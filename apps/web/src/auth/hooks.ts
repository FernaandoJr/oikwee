'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { authService } from './service';
import { getToken } from './storage';
import type { AuthSession, AuthUser, MeResponse } from './types';

export function useUser(): {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const [hasToken, setHasToken] = useState(false);
  useEffect(() => {
    setHasToken(!!getToken());
  }, []);

  const { data, isLoading, error, refetch } = useQuery<MeResponse>({
    queryKey: ['user'],
    queryFn: () => authService.getSession(),
    enabled: hasToken,
  });

  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}

export function useSignIn(): {
  mutate: (params: { email: string; password: string }) => void;
  isPending: boolean;
  error: Error | null;
} {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signIn(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.replace('/dashboard');
    },
    onError: (err) => {
      toast.error(err.message ?? 'Login failed');
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error as Error | null,
  };
}

export function useSignUp(): {
  mutate: (params: { email: string; password: string; name: string }) => void;
  isPending: boolean;
  error: Error | null;
} {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => authService.signUp(email, password, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.replace('/dashboard');
    },
    onError: (err) => {
      toast.error(err.message ?? 'Sign up failed');
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error as Error | null,
  };
}

export function useSignOut(): {
  mutate: () => void;
  isPending: boolean;
} {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['user'] });
      router.replace('/auth/sign-in');
    },
    onError: () => {
      toast.error('Erro ao sair. Tente novamente.');
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
  };
}
