export const PASSWORD_REQUIREMENT_KEYS = [
  'passwordReqLength',
  'passwordReqNumber',
  'passwordReqLower',
  'passwordReqUpper',
] as const;

const REQUIREMENTS = [
  { regex: /.{8,}/, textKey: PASSWORD_REQUIREMENT_KEYS[0] },
  { regex: /[0-9]/, textKey: PASSWORD_REQUIREMENT_KEYS[1] },
  { regex: /[a-z]/, textKey: PASSWORD_REQUIREMENT_KEYS[2] },
  { regex: /[A-Z]/, textKey: PASSWORD_REQUIREMENT_KEYS[3] },
] as const;

export type PasswordRequirement = { met: boolean; textKey: string };

export function checkStrength(password: string): PasswordRequirement[] {
  return REQUIREMENTS.map((req) => ({
    met: req.regex.test(password),
    textKey: req.textKey,
  }));
}

export function getStrengthScore(password: string): number {
  return checkStrength(password).filter((r) => r.met).length;
}

export function isStrongPassword(password: string): boolean {
  return getStrengthScore(password) === 4;
}

const STRENGTH_TEXT_KEYS = [
  'passwordStrengthEnter',
  'passwordStrengthWeak',
  'passwordStrengthMedium',
  'passwordStrengthStrong',
] as const;

export function getStrengthTextKey(score: number): string {
  if (score === 0) return STRENGTH_TEXT_KEYS[0];
  if (score <= 1) return STRENGTH_TEXT_KEYS[1];
  if (score <= 2) return STRENGTH_TEXT_KEYS[1];
  if (score === 3) return STRENGTH_TEXT_KEYS[2];
  return STRENGTH_TEXT_KEYS[3];
}

export function getStrengthColor(score: number): string {
  if (score === 0) return 'bg-border';
  if (score <= 1) return 'bg-red-500';
  if (score <= 2) return 'bg-orange-500';
  if (score === 3) return 'bg-amber-500';
  return 'bg-emerald-500';
}
