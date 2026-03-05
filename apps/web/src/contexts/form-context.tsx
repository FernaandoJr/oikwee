'use client';

import type { Expense } from '@/services/expenses/types';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type FormType = 'expense' | 'card';
export type FormMode = 'new' | 'edit';

export type FormData = Expense | null;

interface FormState {
  formType: FormType | null;
  mode: FormMode;
  data: FormData;
}

interface FormContextValue extends FormState {
  openForm: (formType: FormType, mode: FormMode, data?: FormData) => void;
  closeForm: () => void;
}

const FormContext = createContext<FormContextValue | null>(null);

const initialState: FormState = {
  formType: null,
  mode: 'new',
  data: null,
};

export function FormProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FormState>(initialState);

  const openForm = useCallback(
    (formType: FormType, mode: FormMode, data?: FormData) => {
      setState({
        formType,
        mode,
        data: data ?? null,
      });
    },
    [],
  );

  const closeForm = useCallback(() => {
    setState(initialState);
  }, []);

  const value = useMemo<FormContextValue>(
    () => ({ ...state, openForm, closeForm }),
    [state, openForm, closeForm],
  );

  return (
    <FormContext.Provider value={value}>{children}</FormContext.Provider>
  );
}

export function useFormContext(): FormContextValue {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  return ctx;
}
