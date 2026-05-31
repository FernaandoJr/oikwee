import { useCallback, useState } from 'react';

export function useLocalState(key: string, defaultValue: string) {
  const [value, setValue] = useState<string>(() => {
    if (typeof window === 'undefined') return defaultValue;
    return localStorage.getItem(key) ?? defaultValue;
  });

  const set = useCallback(
    (newValue: string) => {
      setValue(newValue);
      if (typeof window !== 'undefined') {
        if (newValue === defaultValue) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, newValue);
        }
      }
    },
    [key, defaultValue],
  );

  return [value, set] as const;
}
