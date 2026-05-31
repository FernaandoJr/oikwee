import { useCallback, useState } from 'react';

export function useSessionState(key: string, defaultValue: string) {
  const [value, setValue] = useState<string>(() => {
    if (typeof window === 'undefined') return defaultValue;
    return sessionStorage.getItem(key) ?? defaultValue;
  });

  const set = useCallback(
    (newValue: string) => {
      setValue(newValue);
      if (typeof window !== 'undefined') {
        if (newValue === defaultValue) {
          sessionStorage.removeItem(key);
        } else {
          sessionStorage.setItem(key, newValue);
        }
      }
    },
    [key, defaultValue],
  );

  return [value, set] as const;
}
