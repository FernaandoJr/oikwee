# Estrutura de uma Feature

Referência baseada na tela de **Expenses**. Toda nova feature deve seguir este padrão.

---

## Estrutura de pastas

```
src/components/<feature>/
├── schema.ts           # Schema Zod do formulário (somente frontend)
├── types/
│   └── index.ts        # Tipos da feature + re-exports do domínio + labels
├── services/
│   └── index.ts        # Query keys + classe de serviço HTTP
├── handler/
│   ├── index.tsx        # Drawer/Modal com layout (header, scroll, footer)
│   ├── <feature>Form.tsx # Campos do formulário
│   └── use<Feature>Handler.ts # Hook: form + mutations
└── list/
    ├── index.tsx        # Página de listagem
    ├── <feature>Table.tsx # DataTable com colunas e paginação
    └── use<Feature>List.ts  # Hook: queries de listagem
```

---

## Schema (`schema.ts`)

O schema fica **somente no web**, não no domínio compartilhado. Usa o `baseSchema` do domínio como base e aplica `.partial()` para funcionar tanto em criação quanto edição.

```ts
// src/components/expenses/schema.ts
import { z } from 'zod';
import { expenseSchema } from '@oikwee/domains/expenses';

export const expenseFormSchema = expenseSchema
  .omit({ id: true, createdAt: true, updatedAt: true, installmentsPaid: true, ... })
  .partial()
  .superRefine((data, ctx) => {
    if (data.type === 'subscription' && !data.recurrenceInterval) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'validationRecurrenceRequired', path: ['recurrenceInterval'] });
    }
  });
```

**Regras:**
- Um único schema para criar e editar (`.partial()` cobre os dois casos)
- Mensagens de erro usam chaves de tradução (`'validationRequired'`, `'validationRecurrenceRequired'`, etc.)
- Validações cruzadas entre campos ficam no `superRefine`

---

## Tipos (`types/index.ts`)

Re-exporta apenas o que vem do domínio. Labels ficam aqui como constantes locais.

```ts
// src/components/expenses/types/index.ts
export type { Category, ExpenseType, ... } from '@oikwee/domains/expenses';
export { expenseSchema, CATEGORIES, EXPENSE_TYPES, ... } from '@oikwee/domains/expenses';

export interface IExpenseComplete {
  id: string;
  name: string;
  // ... campos completos incluindo os de leitura (installmentsPaid, etc.)
}

export const EXPENSE_TYPE_LABELS: Record<string, string> = {
  subscription: 'Assinatura',
  installment: 'Parcela',
};
```

**Regras:**
- `schema.ts` e `FormValues` não existem aqui — o form tipado usa `Partial<IComplete>`
- Labels (traduções hardcoded) ficam como `Record<string, string>` neste arquivo

---

## Serviço (`services/index.ts`)

```ts
// src/components/expenses/services/index.ts
import { HttpClient } from '@/services/httpClient';
import type { IExpenseComplete } from '../types';

export const expensesQueryKeys = {
  list: (cursor?: string, limit?: number) => ['expenses', cursor ?? 'first', limit ?? 20],
  item: (id: string) => ['expense', id],
};

class ExpensesService extends HttpClient<IExpenseComplete, Partial<IExpenseComplete>, Partial<IExpenseComplete>> {
  constructor() {
    super(apiClient, 'v1', '/expenses');
  }
  // métodos extras específicos da feature
}

export const expensesService = new ExpensesService();
```

---

## Hook do handler (`use<Feature>Handler.ts`)

```ts
// src/components/expenses/handler/useExpenseHandler.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseFormSchema } from '../schema';
import { type IExpenseComplete } from '../types';

export function useExpenseHandler({ isEdit, expense }: UseExpenseHandlerProps) {
  const form = useForm<Partial<IExpenseComplete>>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: isEdit && expense ? expense : defaultFormValues,
  });

  // mutations com useMutation
  // onSubmit com form.handleSubmit
  return { form, onSubmit, isPending };
}
```

**Regras:**
- Tipo do form: `Partial<IComplete>` — nunca `z.infer<typeof schema>`
- Um único schema para criar e editar
- **Nunca usar `as` para forçar tipos no resolver** — se o TypeScript reclamar, o problema está na definição do schema ou do tipo, não no cast

```ts
// ❌ errado — esconde incompatibilidade real
resolver: zodResolver(schema) as unknown as Resolver<Partial<IExpenseComplete>>,

// ✅ correto — sem cast, funciona direto
resolver: zodResolver(expenseFormSchema),
```

---

## Tipagem do formulário — regra fundamental

**Nunca criar interfaces ou tipos derivados do Zod para o formulário.**

```ts
// ❌ errado
export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
const form = useForm<ExpenseFormValues>({ ... });

// ❌ errado
interface ExpenseFormValues {
  name: string;
  amount: number;
  // ...
}

// ✅ correto
const form = useForm<Partial<IExpenseComplete>>({ ... });
```

O Zod existe **exclusivamente** como verificador em runtime via `zodResolver`. Ele nunca deve ser a fonte de verdade dos tipos TypeScript da aplicação.

A fonte de verdade dos tipos é a interface `IComplete` (ex: `IExpenseComplete`, `CreditCard`), que vive em `types/index.ts` e representa o objeto completo retornado pela API.

**Por quê:**
- `z.infer` acopla os tipos ao schema — se o schema muda (ex: `.partial()`, `.omit()`), os tipos mudam junto de forma imprevisível
- `FormValues` é uma abstração desnecessária que duplica a interface já existente
- `Partial<IComplete>` reflete a realidade: no formulário nem todos os campos são obrigatórios ao mesmo tempo
- Exportar `z.infer` de um arquivo cria dependência entre camadas (domínio → form → componente) que não deve existir

---

## Formulário (`<feature>Form.tsx`)

```tsx
interface ExpenseFormProps {
  form: UseFormReturn<Partial<IExpenseComplete>>;
  formId: string;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isEdit?: boolean;
}
```

**Regras:**
- Campos de seleção usam `<FormCombobox>` (`src/components/ui/form-combobox.tsx`), não `<Select>`
- Todos os campos têm `w-full`
- Erros exibidos via `<FormMessage />` — as mensagens vêm das chaves de tradução do schema
- Hook e componente ficam no mesmo arquivo quando possível (colocação)

---

## Traduções de validação

Chaves adicionadas em `packages/i18n/locales/ptBR/common.json` e `enUS/common.json`:

| Chave | pt-BR | en-US |
|---|---|---|
| `validationRequired` | Obrigatório | Required |
| `validationAmountPositive` | Deve ser maior que zero | Must be greater than zero |
| `validationInstallmentsMin` | Mínimo 1 parcela | Minimum 1 installment |
| `validationInstallmentsRequired` | Obrigatório para parcelamentos | Required for installments |
| `validationRecurrenceRequired` | Obrigatório para assinaturas | Required for subscriptions |
| `validationDueDay` | Entre 1 e 31 | Between 1 and 31 |

---

## Domínio compartilhado (`packages/domains`)

O domínio expõe apenas o `baseSchema` e tipos derivados. **Não** contém schemas de criação/edição separados.

```ts
// packages/domains/src/expenses/index.ts
export const expenseSchema = z.object({ ... }); // schema base
export type Expense = z.infer<typeof expenseSchema>;
// sem createExpenseSchema, updateExpenseSchema, FormValues
```
