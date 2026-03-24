'use client';

import { ArrowDown, ArrowUp, Search, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Kbd } from '@/components/ui/kbd';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import type { MenuActionItem, MenuOptionItem, MenuSearchProps } from './types';
import {
  flattenMenuItems,
  loadRecentSearches,
  MAX_RECENT_SEARCHES,
  MAX_SUGGESTIONS_WHEN_EMPTY,
  RECENT_SEARCHES_KEY,
} from './utils';

export type { MenuActionItem, MenuOptionItem, MenuSearchProps } from './types';

export function MenuSearch({ items, actions = [] }: MenuSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] =
    useState<MenuOptionItem[]>(loadRecentSearches);
  const router = useRouter();
  const flatItems = flattenMenuItems(items);

  const recentPaths = new Set(recentSearches.map((item) => item.path));
  const filteredItems = flatItems.filter(
    (item) => item.path?.trim() !== '' && !recentPaths.has(item.path),
  );
  const suggestionsToShow =
    searchQuery.trim() === ''
      ? filteredItems.slice(0, MAX_SUGGESTIONS_WHEN_EMPTY)
      : filteredItems;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectPage = (item: MenuOptionItem) => {
    setOpen(false);
    const serializable = { label: item.label, path: item.path };
    const updated = [
      serializable,
      ...recentSearches
        .filter((recent) => recent.path !== item.path)
        .map((r) => ({ label: r.label, path: r.path })),
    ].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    router.push(item.path);
  };

  const handleSelectAction = (action: MenuActionItem) => {
    setOpen(false);
    action.onSelect();
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  return (
    <div className="select-none">
      <Button
        size="sm"
        variant="outline"
        className="w-full cursor-pointer justify-start text-left"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1 truncate">Pesquisar</span>
        <span className="flex items-center gap-0.5">
          <Kbd className="bg-black/10 dark:bg-white/10">CTRL</Kbd>
          <span className="text-muted-foreground font-normal">+</span>
          <Kbd className="bg-black/10 dark:bg-white/10">K</Kbd>
        </span>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          setSearchQuery('');
        }}
      >
        <Command
          className="select-none"
          value={searchQuery}
          onValueChange={setSearchQuery}
        >
          <CommandInput placeholder="Pesquisar" />
          <ScrollArea className="h-[40vh] pr-1">
            <CommandList className="h-full max-h-none overflow-visible">
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
              {recentSearches.length > 0 && (
                <CommandGroup heading="Pesquisas Recentes">
                  {recentSearches.map((item) => {
                    const itemWithPath = flatItems.find(
                      (i) => i.path === item.path,
                    );
                    const displayItem = itemWithPath ?? item;
                    return (
                      <CommandItem
                        key={`recent-${item.path}`}
                        onSelect={() => handleSelectPage(item)}
                      >
                        {displayItem.icon && (
                          <span className="[&_svg]:size-4 [&_svg]:shrink-0">
                            {displayItem.icon}
                          </span>
                        )}
                        <div className="flex flex-col">
                          <span>{displayItem.label}</span>
                          {itemWithPath?.parentPath?.length ? (
                            <span className="text-muted-foreground text-xs">
                              {itemWithPath.parentPath.join(' / ')}
                            </span>
                          ) : null}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
              <CommandGroup heading="Sugestões">
                {suggestionsToShow.map((item) => (
                  <CommandItem
                    key={`${item.path}-${item.label}`}
                    onSelect={() => handleSelectPage(item)}
                    className="flex items-center gap-2"
                  >
                    {item.icon && (
                      <span className="[&_svg]:size-4 [&_svg]:shrink-0">
                        {item.icon}
                      </span>
                    )}
                    <div className="flex flex-col">
                      <span>{item.label}</span>
                      {item.parentPath?.length ? (
                        <span className="text-muted-foreground text-xs">
                          {item.parentPath.join(' / ')}
                        </span>
                      ) : null}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              {actions.length > 0 && (
                <CommandGroup heading="Ações do sistema">
                  {actions.map((action) => (
                    <CommandItem
                      key={action.id}
                      value={[action.label, ...(action.keywords ?? [])].join(
                        ' ',
                      )}
                      onSelect={() => handleSelectAction(action)}
                      className="flex items-center gap-2"
                    >
                      {action.icon && (
                        <span className="[&_svg]:size-4 [&_svg]:shrink-0">
                          {action.icon}
                        </span>
                      )}
                      <span>{action.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </ScrollArea>
          <div className="text-muted-foreground flex items-center justify-between border-t px-3 py-2 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Kbd className="bg-muted flex items-center justify-center px-1.5 py-0.5">
                  <ArrowUp className="size-3" />
                  <ArrowDown className="size-3" />
                </Kbd>
                <span>para navegar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Kbd className="bg-muted px-1.5 py-0.5">Enter</Kbd>
                <span>para selecionar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Kbd className="bg-muted px-1.5 py-0.5">ESC</Kbd>
                <span>para fechar</span>
              </div>
            </div>
            {recentSearches.length > 0 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleClearRecentSearches}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Limpar pesquisas recentes</p>
                </TooltipContent>
              </Tooltip>
            ) : null}
          </div>
        </Command>
      </CommandDialog>
    </div>
  );
}
