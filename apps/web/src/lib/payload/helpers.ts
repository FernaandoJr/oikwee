export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

export function isValidArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length > 0;
}

export function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (typeof value === 'number' && isNaN(value)) return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (isPlainObject(value) && Object.keys(value).length === 0) return true;
  return false;
}

export function cleanValue(value: unknown): unknown {
  if (isPlainObject(value)) {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      const cleaned = cleanValue(v);
      if (!isEmptyValue(cleaned)) result[k] = cleaned;
    }
    return result;
  }
  if (Array.isArray(value)) {
    return value.map(cleanValue);
  }
  if (typeof value === 'string') {
    return value.trim();
  }
  return value;
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i]));
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys) {
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return false;
}

export function diffObjects(
  next: Record<string, unknown>,
  prev: Record<string, unknown>,
): Record<string, unknown> | null {
  const result: Record<string, unknown> = {};
  const keys = new Set([...Object.keys(next), ...Object.keys(prev)]);
  let changed = false;
  for (const key of keys) {
    if (!deepEqual(next[key], prev[key])) {
      result[key] = next[key];
      changed = true;
    }
  }
  return changed ? result : null;
}

export function diffArrays(next: unknown[], prev: unknown[]): unknown[] | null {
  return deepEqual(next, prev) ? null : next;
}
