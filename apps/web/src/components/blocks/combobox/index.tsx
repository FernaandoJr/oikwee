'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { type ComboboxOption, type ComboboxProps } from './types';
import { debounce } from './utils';

export type { ComboboxOption, ComboboxProps } from './types';

export function Combobox<T = unknown>({
  value,
  onValueChange,
  placeholder = 'Selecionar...',
  searchPlaceholder = 'Buscar...',
  emptyText = 'Nenhum resultado.',
  disabled,
  className,
  options: staticOptions,
  remote,
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [remoteOptions, setRemoteOptions] = React.useState<ComboboxOption[]>([]);
  const [loading, setLoading] = React.useState(false);

  const isRemote = !!remote;
  const options = isRemote ? remoteOptions : (staticOptions ?? []);
  const selected = options.find((o) => o.value === value);

  const fetchRemote = React.useMemo(() => {
    if (!remote) return null;
    return debounce(async (q: string) => {
      setLoading(true);
      try {
        const items = await remote.queryFn(q);
        setRemoteOptions(items.map(remote.mapOption));
      } finally {
        setLoading(false);
      }
    }, remote.debounceMs ?? 300);
  }, [remote]);

  React.useEffect(() => {
    if (!isRemote || !open) return;
    fetchRemote?.(search);
  }, [search, open, isRemote, fetchRemote]);

  React.useEffect(() => {
    if (isRemote && open) fetchRemote?.('');
  }, [open, isRemote, fetchRemote]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'w-full justify-between font-normal',
            !selected && 'text-muted-foreground',
            className,
          )}
        >
          {selected ? selected.label : placeholder}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
        <Command shouldFilter={!isRemote}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={isRemote ? search : undefined}
            onValueChange={isRemote ? setSearch : undefined}
          />
          <CommandList>
            <CommandEmpty>{loading ? 'Buscando...' : emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onValueChange?.(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      'ml-auto size-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
