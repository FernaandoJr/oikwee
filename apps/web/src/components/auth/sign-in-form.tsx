'use client';

import { authClient, getOAuthRedirectUrl, useSignIn } from '@/auth';
import { PasswordInput } from '@/components/auth/password-input';
import { SocialLogo } from '@/components/auth/social-logo';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

interface SignInFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function SignInForm() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [discordLoading, setDiscordLoading] = useState(false);

  const { t } = useTranslation();
  const { mutate: signIn, isPending: isSubmitting } = useSignIn();
  const router = useRouter();

  const signInSchema = useMemo(
    () =>
      z.object({
        email: z
          .email(t('validationEmailInvalid'))
          .min(1, t('validationEmailRequired')),
        password: z.string().min(6, t('validationPasswordMin')),
        rememberMe: z.boolean(),
      }),
    [t],
  );

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const handleSignIn = (values: SignInFormValues) => {
    signIn({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
    });
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

  const handleResetPassword = () => {
    // TODO: Implement reset password
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="animate-element animate-delay-100 text-4xl leading-tight font-semibold md:text-5xl">
        <span className="text-foreground font-light tracking-tighter">
          {t('welcome')}
        </span>
      </h1>
      <p className="animate-element animate-delay-200 text-muted-foreground">
        {t('accessYourAccountAndContinue')}
      </p>

      <Form {...form}>
        <form
          className="space-y-2"
          onSubmit={form.handleSubmit(handleSignIn)}
          autoComplete="off"
        >
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

          <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex cursor-pointer items-center gap-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <span className="text-foreground/90">
                      {t('keepMeSignedIn')}
                    </span>
                  </FormLabel>
                </FormItem>
              )}
            />
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleResetPassword();
              }}
              className="text-primary transition-colors select-none hover:underline"
            >
              {t('resetPassword')}
            </Link>
          </div>

          <Button
            type="submit"
            className="animate-element animate-delay-600 w-full py-4 select-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? (t('signingIn') ?? 'Signing in...') : t('signIn')}
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
          className="flex-1 cursor-pointer py-4 select-none"
        >
          {googleLoading ? (
            <Loader size="xs" />
          ) : (
            <Image
              src="/logo/google.svg"
              alt="Google"
              width={20}
              height={20}
              className="size-5 shrink-0"
            />
          )}
        </Button>
        <Button
          variant="outline"
          onClick={handleGitHubSignIn}
          disabled={googleLoading || githubLoading || discordLoading}
          className="flex-1 cursor-pointer py-4 select-none"
        >
          {githubLoading ? (
            <Loader size="xs" />
          ) : (
            <SocialLogo src="/logo/github.svg" alt="GitHub" />
          )}
        </Button>
        <Button
          variant="outline"
          onClick={handleDiscordSignIn}
          disabled={googleLoading || githubLoading || discordLoading}
          className="flex-1 cursor-pointer py-4 select-none"
        >
          {discordLoading ? (
            <Loader size="xs" />
          ) : (
            <SocialLogo src="/logo/discord.svg" alt="Discord" />
          )}
        </Button>
      </div>

      <p className="animate-element animate-delay-900 text-muted-foreground flex justify-center gap-2 text-center text-sm select-none">
        {t('newToOurPlatform')}
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            router.push('/auth/sign-up');
          }}
          className="text-primary transition-colors hover:underline"
        >
          {t('createAccount')}
        </Link>
      </p>
    </div>
  );
}
