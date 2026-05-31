'use client';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@repo/i18n';
import type { UseFormReturn } from 'react-hook-form';
import { CARD_STATUSES, CARD_STATUS_LABELS, type CreditCard } from '../types';

interface CardFormProps {
  form: UseFormReturn<Partial<CreditCard>>;
  formId: string;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isEdit?: boolean;
}

export function CardForm({ form, formId, onSubmit, isEdit }: CardFormProps) {
  const { t } = useTranslation();

  return (
    <Form {...form}>
      <form id={formId} onSubmit={onSubmit} className="flex flex-col gap-4 p-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('cardName')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('cardNamePlaceholder')}
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bank"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('bank')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('bankPlaceholder')}
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('descriptionOptional')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('notesPlaceholder')}
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="closingDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('closingDay')}</FormLabel>
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
            name="dueDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('cardDueDay')}</FormLabel>
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
        </div>

        {isEdit && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('status')}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? 'active'}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('status')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CARD_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {CARD_STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  );
}
