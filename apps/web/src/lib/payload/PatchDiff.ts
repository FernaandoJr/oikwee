import { deepEqual, diffArrays, diffObjects, isEmptyValue, isPlainObject, isValidArray } from './helpers';

interface PatchDiffOptions {
  ignoreKeys?: string[];
}

export class PatchDiff {
  private ignoredKeys: Set<string>;

  constructor(options: PatchDiffOptions = {}) {
    this.ignoredKeys = new Set(options.ignoreKeys ?? []);
  }

  diff<T extends object>(next: Partial<T>, prev: Partial<T>): Partial<T> {
    const result: Record<string, unknown> = {};
    const nextRecord = next as Record<string, unknown>;
    const prevRecord = prev as Record<string, unknown>;

    for (const key of Object.keys(nextRecord)) {
      if (this.ignoredKeys.has(key)) continue;

      const newVal = nextRecord[key];
      const origVal = prevRecord[key];

      if (deepEqual(newVal, origVal)) continue;

      // Field was explicitly cleared
      if ((newVal === undefined || newVal === null) && !isEmptyValue(origVal)) {
        result[key] = null;
        continue;
      }

      // Array cleared to empty → null signal
      if (Array.isArray(newVal) && newVal.length === 0 && !isEmptyValue(origVal)) {
        result[key] = null;
        continue;
      }

      if (isPlainObject(newVal) && isPlainObject(origVal)) {
        const nested = diffObjects(newVal, origVal);
        if (nested !== null) result[key] = nested;
      } else if (isValidArray(newVal) && Array.isArray(origVal)) {
        const nested = diffArrays(newVal, origVal);
        if (nested !== null) result[key] = nested;
      } else if (newVal !== undefined) {
        result[key] = newVal;
      }
    }

    // Fields present in prev but absent from next → nullify
    for (const key of Object.keys(prevRecord)) {
      if (this.ignoredKeys.has(key)) continue;
      if (key in nextRecord) continue;
      if (!isEmptyValue(prevRecord[key])) {
        result[key] = null;
      }
    }

    return result as Partial<T>;
  }
}
