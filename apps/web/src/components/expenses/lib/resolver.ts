import type { FieldValues, Resolver } from 'react-hook-form';
import type { ZodType } from 'zod';

export function zodV4Resolver<T extends FieldValues>(
  schema: ZodType<T>,
): Resolver<T> {
  return (async (values: T) => {
    const result = schema.safeParse(values);
    if (result.success) {
      return { values: result.data as T, errors: {} };
    }
    const fieldErrors: Record<string, { type: string; message: string }> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join('.');
      if (!fieldErrors[path]) {
        fieldErrors[path] = { type: issue.code, message: issue.message };
      }
    }
    return { values: {} as Record<string, never>, errors: fieldErrors };
  }) as Resolver<T>;
}
