export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxRemoteConfig<T> {
  queryFn: (search: string) => Promise<T[]>;
  mapOption: (item: T) => ComboboxOption;
  debounceMs?: number;
}

export interface ComboboxProps<T = unknown> {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  options?: ComboboxOption[];
  remote?: ComboboxRemoteConfig<T>;
}
