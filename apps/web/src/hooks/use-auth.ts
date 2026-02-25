'use client';

import { getToken } from '@/lib/auth-storage';
import { authService } from '@/services/auth';
import type { AuthSession, AuthUser, MeResponse } from '@/services/auth';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<MeResponse>({
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
  mutate: (params: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => void;
  isPending: boolean;
  error: Error | null;
} {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      email,
      password,
      rememberMe,
    }: {
      email: string;
      password: string;
      rememberMe: boolean;
    }) => authService.signIn(email, password, rememberMe),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.replace('/dashboard');
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
      router.replace('/auth');
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
  };
}
