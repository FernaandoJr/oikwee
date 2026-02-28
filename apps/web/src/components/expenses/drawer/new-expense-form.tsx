'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const newExpenseSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  valor: z
    .string()
    .min(1, 'Valor é obrigatório')
    .refine((val) => Number(val) > 0, 'Valor deve ser maior que zero'),
  data: z.string().min(1, 'Data é obrigatória'),
});

type NewExpenseFormValues = z.infer<typeof newExpenseSchema>;

interface NewExpenseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  formId: string;
}

export function NewExpenseForm({ onSuccess, formId }: NewExpenseFormProps) {
  const form = useForm<NewExpenseFormValues>({
    resolver: zodResolver(newExpenseSchema),
    defaultValues: {
      nome: '',
      valor: '',
      data: '',
    },
  });

  const onSubmit = (_values: NewExpenseFormValues) => {
    form.reset();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4"
      >
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Descrição da despesa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step={0.01}
                  min={0}
                  placeholder="0,00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="data"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {field.value
                        ? format(
                            new Date(field.value + 'T12:00:00'),
                            'dd/MM/yyyy',
                            { locale: ptBR },
                          )
                        : 'Selecione a data'}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      field.value
                        ? new Date(field.value + 'T12:00:00')
                        : undefined
                    }
                    onSelect={(date) =>
                      field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                    }
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
