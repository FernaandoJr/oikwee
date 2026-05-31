export interface PaginatedLinks {
  self: string;
  next: string | null;
  prev: string | null;
}

export interface PaginatedMeta {
  nextCursor: string | null;
  prevCursor: string | null;
  hasMore: boolean;
  count: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
  links: PaginatedLinks;
}
