'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@repo/i18n';
import { useState } from 'react';
import type { IExpenseComplete } from '../types';

interface AdvanceDialogProps {
  expense: IExpenseComplete | null;
  onClose: () => void;
  onAdvance: (id: string, count: number, amount: number) => void;
  isAdvancing: boolean;
}

export function AdvanceDialog({
  expense,
  onClose,
  onAdvance,
  isAdvancing,
}: AdvanceDialogProps) {
  const { t } = useTranslation();
  const remaining = (expense?.installmentsTotal ?? 0) - (expense?.installmentsPaid ?? 0);

  const [count, setCount] = useState(1);
  const [amount, setAmount] = useState(expense?.amount ?? 0);

  const originalTotal = count * (expense?.amount ?? 0);
  const discount = originalTotal - amount;

  function handleSubmit() {
    if (!expense?.id) return;
    onAdvance(expense.id, count, amount);
  }

  return (
    <Dialog
      key={expense?.id}
      open={!!expense}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t('advanceInstallment')}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="advance-count">
              {t('howManyInstallments')}{' '}
              <span className="text-muted-foreground text-xs">
                {t('maxInstallments', { max: remaining })}
              </span>
            </Label>
            <Input
              id="advance-count"
              type="number"
              min={1}
              max={remaining}
              value={count}
              onChange={(e) => {
                const v = Math.min(Math.max(1, Number(e.target.value)), remaining);
                setCount(v);
                setAmount(v * (expense?.amount ?? 0));
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="advance-amount">{t('actualAmountPaid')}</Label>
            <Input
              id="advance-amount"
              type="number"
              step={0.01}
              min={0.01}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          <div className="bg-muted rounded-md p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('originalAmount')}</span>
              <span>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(originalTotal)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>{t('discount')}</span>
                <span>
                  -{' '}
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(discount)}
                </span>
              </div>
            )}
            <div className="mt-1 flex justify-between font-medium">
              <span>{t('youWillPay')}</span>
              <span>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isAdvancing}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isAdvancing || count < 1 || amount <= 0}>
            {isAdvancing ? t('saving') : t('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
