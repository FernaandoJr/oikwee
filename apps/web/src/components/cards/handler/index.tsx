'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useTranslation } from '@repo/i18n';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type { CreditCard } from '../types';
import { CardForm } from './cardForm';
import { useCardHandler } from './useCardHandler';

const CARD_FORM_ID = 'card-form';

interface CardHandlerProps {
  isEdit: boolean;
  defaultValues?: CreditCard;
}

export function CardHandler({ isEdit, defaultValues }: CardHandlerProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { form, onSubmit, isPending } = useCardHandler({
    isEdit,
    card: defaultValues,
  });

  const closeHandler = useCallback(() => {
    const canGoBack =
      typeof window !== 'undefined' &&
      !!document.referrer &&
      document.referrer.startsWith(window.location.origin);

    if (canGoBack) {
      router.back();
      return;
    }

    router.push('/dashboard/cards');
  }, [router]);

  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) closeHandler();
      }}
      direction="right"
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {isEdit ? t('editCard') : t('newCard')}
          </DrawerTitle>
        </DrawerHeader>
        <CardForm
          form={form}
          formId={CARD_FORM_ID}
          onSubmit={onSubmit}
          isEdit={isEdit}
        />
        <DrawerFooter>
          <Button type="submit" form={CARD_FORM_ID} disabled={isPending}>
            {isEdit ? t('save') : t('add')}
          </Button>
          <Button type="button" variant="outline" onClick={closeHandler}>
            {t('cancel')}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
