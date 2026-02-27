'use client';

import { authClient, getOAuthRedirectUrl, useSignUp } from '@/auth';
import { PasswordFieldWithStrength } from '@/components/auth/password-field-with-strength';
import { isStrongPassword } from '@/components/auth/password-strength';
import { SocialLogo } from '@/components/auth/social-logo';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@repo/i18n';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import Loader from '../loader';
import { PasswordInput } from './password-input';

interface SignUpFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpFormProps {
  handleSignIn: () => void;
}

export function SignUpForm({ handleSignIn }: SignUpFormProps) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [discordLoading, setDiscordLoading] = useState(false);

  const { t } = useTranslation();
  const { mutate: signUp, isPending: isSubmitting } = useSignUp();
  const router = useRouter();

  const signUpSchema = useMemo(
    () =>
      z
        .object({
          email: z
            .email(t('validationEmailInvalid'))
            .min(1, t('validationEmailRequired')),
          password: z.string().min(1, t('validationPasswordMin')),
          confirmPassword: z.string().min(1, t('validationPasswordMin')),
        })
        .refine((data) => isStrongPassword(data.password), {
          message: t('validationPasswordStrong'),
          path: ['password'],
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t('validationPasswordMatch'),
          path: ['confirmPassword'],
        }),
    [t],
  );

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: SignUpFormValues) => {
    signUp({ email: values.email, password: values.password });
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const { data, error } = await authClient.signIn.social({
      provider: 'google',
      callbackURL: getOAuthRedirectUrl(),
    });
    setGoogleLoading(false);
    if (error) {
      toast.error(error.message ?? 'Google sign-in failed');
      return;
    }
    if (data?.url) window.location.href = data.url;
  };

  const handleGitHubSignIn = async () => {
    setGithubLoading(true);
    const { data, error } = await authClient.signIn.social({
      provider: 'github',
      callbackURL: getOAuthRedirectUrl(),
    });
    setGithubLoading(false);
    if (error) {
      toast.error(error.message ?? 'GitHub sign-in failed');
      return;
    }
    if (data?.url) window.location.href = data.url;
  };

  const handleDiscordSignIn = async () => {
    setDiscordLoading(true);
    const { data, error } = await authClient.signIn.social({
      provider: 'discord',
      callbackURL: getOAuthRedirectUrl(),
    });
    setDiscordLoading(false);
    if (error) {
      toast.error(error.message ?? 'Discord sign-in failed');
      return;
    }
    if (data?.url) window.location.href = data.url;
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="animate-element animate-delay-100 text-4xl leading-tight font-semibold md:text-5xl">
        <span className="text-foreground font-light tracking-tighter">
          {t('welcome')}
        </span>
      </h1>

      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="animate-element animate-delay-300">
                <FormLabel className="text-muted-foreground text-sm font-medium">
                  {t('emailAddress')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('enterYourEmailAddress')}
                    className="w-full p-4 text-sm shadow-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
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
            control={form.control}
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

          <Button
            type="submit"
            className="animate-element animate-delay-600 w-full py-4 select-none"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? (t('signingIn') ?? 'Signing in...')
              : t('createAccount')}
          </Button>
        </form>
      </Form>

      <div className="animate-element animate-delay-700 relative flex items-center justify-center select-none">
        <span className="border-border w-full border-t" />
        <span className="text-muted-foreground bg-background absolute px-4 text-sm">
          {t('orContinueWith')}
        </span>
      </div>

      <div className="animate-element animate-delay-800 flex flex-row justify-center gap-3">
        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || githubLoading || discordLoading}
          className="cursor-pointer py-4 select-none"
        >
          <Image
            src="/logo/google.svg"
            alt="Google"
            width={20}
            height={20}
            className="size-5 shrink-0"
          />
          {googleLoading ? <Loader size="sm" /> : null}
        </Button>
        <Button
          variant="outline"
          onClick={handleGitHubSignIn}
          disabled={googleLoading || githubLoading || discordLoading}
          className="cursor-pointer py-4 select-none"
        >
          <SocialLogo src="/logo/github.svg" alt="GitHub" />
          {githubLoading ? <Loader size="sm" /> : null}
        </Button>
        <Button
          variant="outline"
          onClick={handleDiscordSignIn}
          disabled={googleLoading || githubLoading || discordLoading}
          className="cursor-pointer py-4 select-none"
        >
          <SocialLogo src="/logo/discord.svg" alt="Discord" />
          {discordLoading ? <Loader size="sm" /> : null}
        </Button>
      </div>

      <p className="animate-element animate-delay-900 text-muted-foreground flex justify-center gap-2 text-center text-sm select-none">
        {t('alreadyHaveAccount')}
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            router.push('/auth/sign-in');
          }}
          className="text-primary transition-colors hover:underline"
        >
          {t('signIn')}
        </Link>
      </p>
    </div>
  );
}
