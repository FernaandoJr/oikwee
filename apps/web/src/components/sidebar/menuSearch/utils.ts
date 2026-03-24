import type { MenuOptionItem, MenuItemWithPath } from './types';

export const RECENT_SEARCHES_KEY = 'menu-search-recent';
export const MAX_RECENT_SEARCHES = 5;
export const MAX_SUGGESTIONS_WHEN_EMPTY = 5;

export function flattenMenuItems(
  items: MenuOptionItem[],
  parentPath: string[] = [],
): MenuItemWithPath[] {
  const result: MenuItemWithPath[] = [];

  for (const item of items) {
    if (item.children?.length) {
      result.push(
        ...flattenMenuItems(item.children, [...parentPath, item.label]),
      );
    } else {
      result.push({
        ...item,
        parentPath: parentPath.length > 0 ? parentPath : undefined,
      });
    }
  }

  return result;
}

export function loadRecentSearches(): MenuOptionItem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored) as MenuOptionItem[];
    return parsed.filter((item) => item.path?.trim() !== '');
  } catch {
    return [];
  }
}
