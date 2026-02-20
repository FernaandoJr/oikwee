'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { ImageDithering } from '@paper-design/shaders-react';
import { useTranslation } from '@repo/i18n';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

export default function SignInPage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const heroImageSrc = '/images/flower_aspect1.png';

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google sign in
  };

  const handleResetPassword = () => {
    // TODO: Implement reset password
  };

  const handleCreateAccount = () => {
    // TODO: Implement create account
  };

  return (
    <div className="font-geist flex h-dvh w-dvw flex-col md:flex-row">
      <section className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 text-4xl leading-tight font-semibold md:text-5xl">
              <span className="text-foreground font-light tracking-tighter">{t('welcome')}</span>
            </h1>
            <p className="animate-element animate-delay-200 text-muted-foreground">
              {t('accessYourAccountAndContinue')}
            </p>

            <form className="space-y-5" onSubmit={handleSignIn}>
              <div className="animate-element animate-delay-300 flex flex-col gap-2">
                <Label className="text-muted-foreground text-sm font-medium">
                  {t('emailAddress')}
                </Label>
                <Input
                  name="email"
                  type="email"
                  placeholder={t('enterYourEmailAddress')}
                  className="w-full p-4 text-sm shadow-none"
                />
              </div>

              <div className="animate-element animate-delay-400 flex flex-col gap-2">
                <Label className="text-muted-foreground text-sm font-medium">{t('password')}</Label>
                <InputGroup className="h-auto">
                  <InputGroupInput
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('enterYourPassword')}
                    className="p-4 text-sm"
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
              </div>

              <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
                <Label className="flex cursor-pointer items-center gap-3">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    name="rememberMe"
                  />
                  <span className="text-foreground/90">{t('keepMeSignedIn')}</span>
                </Label>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleResetPassword();
                  }}
                  className="text-primary transition-colors hover:underline"
                >
                  {t('resetPassword')}
                </Link>
              </div>

              <Button type="submit" className="animate-element animate-delay-600 w-full py-4">
                {t('signIn')}
              </Button>
            </form>

            <div className="animate-element animate-delay-700 relative flex items-center justify-center">
              <span className="border-border w-full border-t"></span>
              <span className="text-muted-foreground bg-background absolute px-4 text-sm">
                {t('orContinueWith')}
              </span>
            </div>

            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              className="animate-element animate-delay-800 w-full py-4"
            >
              {t('continueWithGoogle')}
            </Button>

            <p className="animate-element animate-delay-900 text-muted-foreground text-center text-sm">
              {t('newToOurPlatform')}{' '}
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

      {/* Right column: hero image + testimonials */}
      {heroImageSrc && (
        <section className="relative hidden flex-1 p-4 md:block">
          <ImageDithering
            image={heroImageSrc}
            className="animate-slide-right animate-delay-300 absolute inset-4 rounded-lg"
            fit="cover"
            originalColors
            type="8x8"
            size={2}
            colorSteps={7}
          />
        </section>
      )}
    </div>
  );
}
