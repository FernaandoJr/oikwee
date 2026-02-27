'use client';

import { useTranslation } from '@repo/i18n';
import { Check, X } from 'lucide-react';
import { useId } from 'react';
import {
  checkStrength,
  getStrengthColor,
  getStrengthScore,
  getStrengthTextKey,
} from './password-strength';

interface PasswordStrengthIndicatorProps {
  password: string;
  id?: string;
}

export function PasswordStrengthIndicator({
  password,
  id: idProp,
}: PasswordStrengthIndicatorProps) {
  const { t } = useTranslation();
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const strength = checkStrength(password);
  const score = getStrengthScore(password);

  return (
    <div className="mt-3 flex flex-col gap-3">
      <div
        className="border-border bg-border h-1 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-label={t('passwordStrengthAria')}
      >
        <div
          className={`h-full transition-all duration-500 ease-out ${getStrengthColor(score)}`}
          style={{ width: `${(score / 4) * 100}%` }}
        />
      </div>
      <p
        id={`${id}-description`}
        className="text-foreground text-sm font-medium"
      >
        {t(getStrengthTextKey(score))}. {t('passwordStrengthMustContain')}
      </p>
      <ul
        className="grid grid-cols-2 gap-x-4 gap-y-1.5"
        aria-label={t('passwordStrengthMustContain')}
      >
        {strength.map((req) => (
          <li key={req.textKey} className="flex items-center gap-2">
            {req.met ? (
              <Check size={16} className="text-emerald-500" aria-hidden />
            ) : (
              <X size={16} className="text-muted-foreground/80" aria-hidden />
            )}
            <span
              className={`text-xs ${req.met ? 'text-emerald-600' : 'text-muted-foreground'}`}
            >
              {t(req.textKey)}
              <span className="sr-only">
                {req.met
                  ? ` - ${t('passwordRequirementMet')}`
                  : ` - ${t('passwordRequirementNotMet')}`}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
