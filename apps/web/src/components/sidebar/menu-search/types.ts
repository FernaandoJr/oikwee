export interface MenuOptionItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  children?: MenuOptionItem[];
}

export interface MenuActionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  keywords?: string[];
  onSelect: () => void;
}

export interface MenuItemWithPath extends MenuOptionItem {
  parentPath?: string[];
}

export interface MenuSearchProps {
  items: MenuOptionItem[];
  actions?: MenuActionItem[];
}
