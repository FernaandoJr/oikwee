import { cleanValue, isEmptyValue } from './helpers';

interface PayloadBuilderOptions {
  ignoreKeys?: string[];
}

export function PayloadBuilder(options: PayloadBuilderOptions = {}) {
  return {
    from<T extends object>(values: Partial<T>): Partial<T> {
      const data = { ...(values as Record<string, unknown>) };

      delete data['id'];

      for (const key of options.ignoreKeys ?? []) delete data[key];

      for (const key of Object.keys(data)) {
        const cleaned = cleanValue(data[key]);
        if (isEmptyValue(cleaned)) {
          delete data[key];
        } else {
          data[key] = cleaned;
        }
      }

      return data as Partial<T>;
    },
  };
}
