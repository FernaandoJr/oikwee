"use client";
"use no memo";

import { useTranslation } from "@repo/i18n";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps extends React.ComponentProps<"div"> {
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  limit: number;
  onLimitChange: (n: number) => void;
  pageSizeOptions?: number[];
}

export function DataTablePagination({
  hasNext,
  hasPrev,
  onNext,
  onPrev,
  limit,
  onLimitChange,
  pageSizeOptions = [10, 20, 30, 50, 100],
  className,
  ...props
}: DataTablePaginationProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "flex w-full items-center justify-end gap-4 overflow-auto p-1 sm:gap-8",
        className,
      )}
      {...props}
    >
      <div className="flex items-center space-x-2">
        <Button
          aria-label="Go to previous page"
          variant="outline"
          size="icon"
          className="size-8"
          onClick={onPrev}
          disabled={!hasPrev}
        >
          <ChevronLeft />
        </Button>
        <Button
          aria-label="Go to next page"
          variant="outline"
          size="icon"
          className="size-8"
          onClick={onNext}
          disabled={!hasNext}
        >
          <ChevronRight />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <p className="whitespace-nowrap font-medium text-sm">{t('rowsPerPage')}</p>
        <Select
          value={`${limit}`}
          onValueChange={(value) => onLimitChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-18 data-size:h-8">
            <SelectValue placeholder={limit} />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
