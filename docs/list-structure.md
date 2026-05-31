# Estrutura de uma Tela de Listagem

Referência baseada na tela de **Expenses**. Toda nova listagem deve seguir este padrão.

---

## Estrutura de pastas

```
src/components/<feature>/
├── columns.tsx              # Definição das colunas da tabela
├── types/index.ts           # IComplete + labels
├── list/
│   ├── index.tsx            # Componente raiz — orquestra hook → tabela
│   ├── <feature>Table.tsx   # Tabela com toolbar, paginação e dialogs
│   ├── use<Feature>List.ts  # Hook: queries, mutations, estado de paginação
│   └── rowActions.tsx       # Menu de ações por linha (editar, excluir, etc.)
```

---

## Camadas e responsabilidades

### `list/index.tsx` — orquestrador

Apenas chama o hook e passa os dados para a tabela. Sem lógica.

```tsx
export function ExpenseList() {
  const { data, isLoading, ...rest } = useExpenseList();

  if (isLoading) return <DataTableSkeleton columnCount={8} rowCount={10} />;

  return <ExpenseTable data={data} {...rest} />;
}
```

### `list/use<Feature>List.ts` — toda a lógica

Contém queries, mutations e estado de paginação. Não renderiza nada.

```ts
export function useExpenseList() {
  // paginação com cursor — estado em sessionStorage via useSessionState
  const [cursor, setCursor] = useSessionState('expenses_cursor', '');
  // limite persistido em localStorage via useLocalState
  const [limitStr, setLimitStr] = useLocalState('expenses_limit', '20');

  // query principal
  const { data: response, isLoading } = useQuery({
    queryKey: expensesQueryKeys.list(cursor, limit),
    queryFn: () => expensesService.list({ cursor, limit }),
  });

  // mutations: delete, togglePaid, advance...
  // retorna handlers simples (não expõe mutation inteira)
  return {
    data,
    isLoading,
    hasMore, hasPrev, onNext, onPrev,
    deleteExpense: (id) => deleteMutation.mutate(id),
    togglePaid: (id, isPaid) => togglePaidMutation.mutate({ id, isPaid }),
    // ...
  };
}
```

**Regras:**
- Paginação por cursor, nunca por página/offset
- `cursor` em `sessionStorage` (perdido ao fechar aba) — evita cursor stale em sessões diferentes
- `limit` em `localStorage` (persiste entre sessões) — preferência do usuário
- Mutations de toggle usam **optimistic update**: atualizam o cache antes da resposta da API e fazem rollback em caso de erro
- O hook retorna funções simples (`deleteExpense(id)`) em vez de expor `mutation.mutate` diretamente

### `list/<feature>Table.tsx` — apresentação

Recebe tudo via props. Configura `useDataTable`, renderiza `DataTable` + toolbar + paginação.

```tsx
const columns = React.useMemo(
  () => expenseColumns({ onDelete, isDeleting, onTogglePaid, onAdvance }, t),
  [t, onDelete, isDeleting, onTogglePaid, onAdvance],
);

const { table } = useDataTable({
  data,
  columns,
  pageCount: -1,           // -1 = paginação manual (sem contagem total)
  getRowId: (row) => row.id ?? '',
  initialState: {
    sorting: [{ id: 'name', desc: false }],
    columnPinning: { left: ['actions'] },
  },
});
```

**Regras:**
- Colunas sempre memoizadas com `useMemo`
- `onRowClick` navega para a rota de edição: `router.push('/dashboard/<feature>/edit/${id}')`
- Coluna de checkbox (isPaid, etc.) deve ter `onClick={(e) => e.stopPropagation()}` no wrapper para não disparar o `onRowClick`
- Botão "Novo" fica na toolbar dentro do `DataTable`

---

## `columns.tsx` — definição das colunas

Função que recebe callbacks e `t` (tradução) e retorna `ColumnDef[]`.

```ts
export function expenseColumns(
  { onDelete, isDeleting, onTogglePaid, onAdvance }: ColumnOptions,
  t: (key: string) => string,
): ColumnDef<IExpenseComplete>[] {
  return [
    createActionsColumn(...),  // sempre primeiro, pinado à esquerda
    // colunas de dados...
  ];
}
```

**Regras:**
- Primeira coluna sempre `createActionsColumn` com o menu de ações
- Usar `createColumn<T>()` para colunas padrão (tipagem + padrões de meta)
- Definir `meta.variant` para habilitar filtros da toolbar:
  - `'text'` — filtro de texto
  - `'multiSelect'` — filtro de múltipla escolha (requer `meta.options`)
  - `'range'` — filtro de intervalo numérico
  - `'boolean'` — filtro de verdadeiro/falso
- Valores monetários formatados com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
- Labels de enum (status, tipo) mapeados via `Record<string, string>` de `types/index.ts`

---

## Optimistic update (padrão para toggles)

Para ações rápidas como marcar como pago, usar optimistic update para evitar flash de UI:

```ts
const togglePaidMutation = useMutation({
  mutationFn: ({ id, isPaid }) => expensesService.setPaid(id, isPaid),
  onMutate: async ({ id, isPaid }) => {
    await queryClient.cancelQueries({ queryKey });          // cancela refetch em andamento
    const previous = queryClient.getQueryData(queryKey);   // salva estado anterior
    queryClient.setQueryData(queryKey, (old) => ({         // aplica mudança otimista
      ...old,
      data: old.data.map((e) => e.id === id ? { ...e, isPaid } : e),
    }));
    return { previous };                                   // contexto para rollback
  },
  onSuccess: (updated, { id }) => {
    queryClient.setQueryData(queryKey, (old) => ({         // substitui pelo dado real
      ...old,
      data: old.data.map((e) => e.id === id ? updated : e),
    }));
  },
  onError: (_err, _vars, ctx) => {
    if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous); // rollback
  },
});
```

---

## Query keys

Centralizadas no `services/index.ts`. Sempre funções — nunca arrays inline.

```ts
export const expensesQueryKeys = {
  list: (cursor?: string, limit?: number) => ['expenses', cursor ?? 'first', limit ?? 20],
  item: (id: string) => ['expense', id],
};
```

**Por quê funções:** permitem invalidar de forma precisa (`invalidateQueries({ queryKey: expensesQueryKeys.list() })`) sem hardcodar strings espalhadas pelo código.
