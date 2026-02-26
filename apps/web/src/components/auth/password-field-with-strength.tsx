'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from '@/components/ui/form';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from '@repo/i18n';
import { PasswordInput } from '@/components/auth/password-input';
import { PasswordStrengthIndicator } from '@/components/auth/password-strength-indicator';

interface PasswordFieldWithStrengthProps {
  field: { value: string; onChange: (value: string) => void; onBlur: () => void };
  placeholder: string;
}

export function PasswordFieldWithStrength({
  field,
  placeholder,
}: PasswordFieldWithStrengthProps) {
  const { control } = useFormContext();
  const { name, formDescriptionId } = useFormField();
  const watchedValue = useWatch({ control, name, defaultValue: '' });
  const password = typeof watchedValue === 'string' ? watchedValue : '';

  const indicatorId = formDescriptionId?.replace(/-description$/, '');

  return (
    <>
      <PasswordInput
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        placeholder={placeholder}
        aria-describedby={formDescriptionId}
      />
      <PasswordStrengthIndicator password={password} id={indicatorId} />
    </>
  );
}

export function PasswordWithConfirmFields() {
  const { control } = useFormContext();
  const { t } = useTranslation();

  return (
    <>
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem className="animate-element animate-delay-400">
            <FormLabel className="text-muted-foreground text-sm font-medium">
              {t('password')}
            </FormLabel>
            <FormControl>
              <PasswordFieldWithStrength
                field={field}
                placeholder={t('enterYourPassword')}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem className="animate-element animate-delay-500">
            <FormLabel className="text-muted-foreground text-sm font-medium">
              {t('confirmPassword')}
            </FormLabel>
            <FormControl>
              <PasswordInput
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={t('enterYourPassword')}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
