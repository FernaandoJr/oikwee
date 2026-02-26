'use client';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export function PasswordInput({
  value,
  onChange,
  onBlur,
  placeholder,
  'aria-describedby': ariaDescribedBy,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder: string;
  'aria-describedby'?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputGroup className="h-auto">
      <InputGroupInput
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        className="text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-describedby={ariaDescribedBy}
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
}
