'use client';
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
import { authClient, getOAuthRedirectUrl, heroImageSrc, useSignIn } from '@/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageDithering } from '@paper-design/shaders-react';
import { useTranslation } from '@repo/i18n';
import { Eye, EyeOff } from 'lucide-react';
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

                  {googleError && (
                    <p className="text-destructive text-sm">{googleError}</p>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    className="animate-element animate-delay-800 w-full cursor-pointer py-4 select-none"
                  >
                    <Image
                      src="/logo/google.svg"
                      alt="Google"
                      width={20}
                      height={20}
                      className="size-4"
                    />
                    {googleLoading
                      ? (t('signingIn') ?? 'Signing in...')
                      : t('continueWithGoogle')}
                  </Button>

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
