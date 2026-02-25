'use client';
import {
  authClient,
  getOAuthRedirectUrl,
  heroImageSrc,
  useSignIn,
} from '@/auth';
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageDithering } from '@paper-design/shaders-react';
import { useTranslation } from '@repo/i18n';
import { Eye, EyeOff, Github } from 'lucide-react';

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface SignInFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function SignInPage() {
  const { t } = useTranslation();
  const {
    mutate: signIn,
    isPending: isSubmitting,
    error: signInError,
  } = useSignIn();

  const handleSignIn = (values: SignInFormValues) => {
    signIn({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
    });
  };

  const authError = signInError?.message ?? null;

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

  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState<string | null>(null);
  const [discordLoading, setDiscordLoading] = useState(false);
  const [discordError, setDiscordError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setGoogleError(null);
    setGoogleLoading(true);
    const { data, error } = await authClient.signIn.social({
      provider: 'google',
      callbackURL: getOAuthRedirectUrl(),
    });
    setGoogleLoading(false);
    if (error) {
      setGoogleError(error.message ?? 'Google sign-in failed');
      return;
    }
    if (data?.url) window.location.href = data.url;
  };

  const handleGitHubSignIn = async () => {
    setGithubError(null);
    setGithubLoading(true);
    const { data, error } = await authClient.signIn.social({
      provider: 'github',
      callbackURL: getOAuthRedirectUrl(),
    });
    setGithubLoading(false);
    if (error) {
      setGithubError(error.message ?? 'GitHub sign-in failed');
      return;
    }
    if (data?.url) window.location.href = data.url;
  };

  const handleDiscordSignIn = async () => {
    setDiscordError(null);
    setDiscordLoading(true);
    const { data, error } = await authClient.signIn.social({
      provider: 'discord',
      callbackURL: getOAuthRedirectUrl(),
    });
    setDiscordLoading(false);
    if (error) {
      setDiscordError(error.message ?? 'Discord sign-in failed');
      return;
    }
    if (data?.url) window.location.href = data.url;
  };

  const handleResetPassword = () => {
    // TODO: Implement reset password
  };

  const handleCreateAccount = () => {
    // TODO: Implement create account
  };

  return (
    <Fragment>
      <div className="font-geist flex h-[calc(100dvh-4rem)] w-full flex-col overflow-hidden md:flex-row">
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex min-h-full w-full flex-col items-center justify-center md:flex-row">
            <section className="flex flex-1 items-center justify-center p-8">
              <div className="w-full max-w-md">
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
                    {authError && (
                      <p className="text-destructive text-sm">{authError}</p>
                    )}
                    <form
                      className="space-y-5"
                      onSubmit={form.handleSubmit(handleSignIn)}
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
                        {isSubmitting
                          ? (t('signingIn') ?? 'Signing in...')
                          : t('signIn')}
                      </Button>
                    </form>
                  </Form>

                  <div className="animate-element animate-delay-700 relative flex items-center justify-center select-none">
                    <span className="border-border w-full border-t" />
                    <span className="text-muted-foreground bg-background absolute px-4 text-sm">
                      {t('orContinueWith')}
                    </span>
                  </div>

                  {(googleError ?? githubError ?? discordError) && (
                    <p className="text-destructive text-sm">
                      {googleError ?? githubError ?? discordError}
                    </p>
                  )}
                  <div className="animate-element animate-delay-800 flex w-full flex-wrap gap-3">
                    <Button
                      variant="outline"
                      onClick={handleGoogleSignIn}
                      disabled={
                        googleLoading || githubLoading || discordLoading
                      }
                      className="min-w-0 flex-1 cursor-pointer py-4 select-none"
                    >
                      <Image
                        src="/logo/google.svg"
                        alt="Google"
                        width={20}
                        height={20}
                        className="size-4 shrink-0"
                      />
                      <span className="truncate">
                        {googleLoading
                          ? (t('signingIn') ?? 'Signing in...')
                          : t('continueWithGoogle')}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleGitHubSignIn}
                      disabled={
                        googleLoading || githubLoading || discordLoading
                      }
                      className="min-w-0 flex-1 cursor-pointer py-4 select-none"
                    >
                      <Github className="size-5 shrink-0" />
                      <span className="truncate">
                        {githubLoading
                          ? (t('signingIn') ?? 'Signing in...')
                          : t('continueWithGitHub')}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDiscordSignIn}
                      disabled={
                        googleLoading || githubLoading || discordLoading
                      }
                      className="min-w-0 flex-1 cursor-pointer py-4 select-none"
                    >
                      <DiscordIcon className="size-5 shrink-0" />
                      <span className="truncate">
                        {discordLoading
                          ? (t('signingIn') ?? 'Signing in...')
                          : t('continueWithDiscord')}
                      </span>
                    </Button>
                  </div>

                  <p className="animate-element animate-delay-900 text-muted-foreground flex justify-center gap-2 text-center text-sm select-none">
                    {t('newToOurPlatform')}
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCreateAccount();
                      }}
                      className="text-primary transition-colors hover:underline"
                    >
                      {t('createAccount')}
                    </Link>
                  </p>
                </div>
              </div>
            </section>

            {heroImageSrc && (
              <section className="relative hidden flex-1 p-4 md:block lg:p-8">
                <ImageDithering
                  image={heroImageSrc}
                  className="animate-slide-right animate-delay-300 h-[calc(100dvh-8rem)] rounded-lg"
                  fit="cover"
                  originalColors
                  type="8x8"
                  size={2}
                  colorSteps={7}
                />
              </section>
            )}
          </div>
        </ScrollArea>
      </div>
    </Fragment>
  );
}

const PasswordInput = ({
  value,
  onChange,
  onBlur,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputGroup className="h-auto">
      <InputGroupInput
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        className="p-4 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          type="button"
          variant="ghost"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="text-muted-foreground hover:text-foreground h-5 w-5 transition-colors" />
          ) : (
            <Eye className="text-muted-foreground hover:text-foreground h-5 w-5 transition-colors" />
          )}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};
