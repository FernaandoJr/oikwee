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
import { Combobox } from '@/components/blocks/combobox';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, DollarSign } from 'lucide-react';
import { useTranslation } from '@repo/i18n';
import type { UseFormReturn } from 'react-hook-form';
import { cardsService } from '../../cards/services';
import {
  CATEGORIES,
  EXPENSE_STATUSES,
  EXPENSE_STATUS_LABELS,
  EXPENSE_TYPES,
  EXPENSE_TYPE_LABELS,
  PAYMENT_METHODS,
  RECURRENCE_INTERVALS,
  RECURRENCE_INTERVAL_LABELS,
  type IExpenseComplete,
} from '../types';

interface ExpenseFormProps {
  form: UseFormReturn<Partial<IExpenseComplete>>;
  formId: string;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isEdit?: boolean;
}

export function ExpenseForm({ form, formId, onSubmit, isEdit }: ExpenseFormProps) {
  const { t } = useTranslation();
  const type = form.watch('type');

  const typeOptions = EXPENSE_TYPES.map((v) => ({ value: v, label: EXPENSE_TYPE_LABELS[v] }));
  const categoryOptions = CATEGORIES.map((v) => ({ value: v, label: v }));
  const recurrenceOptions = RECURRENCE_INTERVALS.map((v) => ({ value: v, label: RECURRENCE_INTERVAL_LABELS[v] }));
  const paymentOptions = PAYMENT_METHODS.map((v) => ({ value: v, label: v }));
  const statusOptions = EXPENSE_STATUSES.map((v) => ({ value: v, label: EXPENSE_STATUS_LABELS[v] }));

  return (
    <Form {...form}>
      <form id={formId} onSubmit={onSubmit} className="flex w-full flex-col gap-4 p-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('expenseNamePlaceholder')} {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('type')}</FormLabel>
              <FormControl>
                <Combobox
                  options={typeOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={t('select')}
                  searchPlaceholder={t('search')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('amountLabel')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <DollarSign className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="bg-background pl-9"
                    type="number"
                    step={0.01}
                    min={0}
                    placeholder="0,00"
                    {...field}
                    value={field.value === 0 || field.value == null ? '' : field.value}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') { field.onChange(undefined); return; }
                      if (/^\d*\.?\d{0,2}$/.test(val)) field.onChange(Number(val));
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('category')}</FormLabel>
              <FormControl>
                <Combobox
                  options={categoryOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={t('select')}
                  searchPlaceholder={t('search')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === 'subscription' && (
          <FormField
            control={form.control}
            name="recurrenceInterval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('recurrenceInterval')}</FormLabel>
                <FormControl>
                  <Combobox
                    options={recurrenceOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder={t('select')}
                    searchPlaceholder={t('search')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {type === 'installment' && (
          <FormField
            control={form.control}
            name="installmentsTotal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('totalInstallments')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder={t('totalInstallmentsPlaceholder')}
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(Number(e.target.value) || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('startDate')}</FormLabel>
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
                        ? format(new Date(field.value + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })
                        : t('selectDate')}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value + 'T12:00:00') : undefined}
                    onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('chargeDayOptional')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={31}
                  placeholder={t('dayPlaceholder')}
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(Number(e.target.value) || undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="creditCardId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('cardOptional')}</FormLabel>
              <FormControl>
                <Combobox
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={t('none')}
                  searchPlaceholder={t('search')}
                  remote={{
                    queryFn: () => cardsService.get(),
                    mapOption: (card) => ({ value: card.id!, label: `${card.name} — ${card.bank}` }),
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('paymentMethodOptional')}</FormLabel>
              <FormControl>
                <Combobox
                  options={paymentOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={t('optional')}
                  searchPlaceholder={t('search')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPaid"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <FormLabel className="cursor-pointer">{t('paid')}</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEdit && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('status')}</FormLabel>
                <FormControl>
                  <Combobox
                    options={statusOptions}
                    value={field.value ?? 'active'}
                    onValueChange={field.onChange}
                    placeholder={t('status')}
                    searchPlaceholder={t('search')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('notesOptional')}</FormLabel>
              <FormControl>
                <Input placeholder={t('notesPlaceholder')} {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
