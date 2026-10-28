"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  /** Plural noun shown in "Showing 1–12 of 87 dishes" */
  itemLabel?: string;
  className?: string;
};

/** 1 … 4 5 6 … 20  (always includes first, last, current and neighbours) */
export function getPageNumbers(
  page: number,
  totalPages: number,
): (number | string)[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const wanted = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...wanted]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const result: (number | string)[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push(`gap-${p}`);
    result.push(p);
  });
  return result;
}

const Pagination = ({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  itemLabel = "items",
  className,
}: Props) => {
  if (totalItems === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1",
        className,
      )}
    >
      <div className="flex items-center justify-between sm:justify-start gap-4 text-xs text-muted-foreground">
        <span>
          Showing{" "}
          <span className="font-semibold text-foreground">
            {from}–{to}
          </span>{" "}
          of <span className="font-semibold text-foreground">{totalItems}</span>{" "}
          {itemLabel}
        </span>

        {onPageSizeChange && (
          <label className="flex items-center gap-2">
            <span className="hidden sm:inline">Per page</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label="Items per page"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <nav
        className="flex items-center justify-center gap-1"
        aria-label="Pagination"
      >
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={isFirst}
          onClick={() => onPageChange(1)}
          aria-label="First page"
          className="hidden sm:inline-flex"
        >
          <ChevronsLeft className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={isFirst}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {/* Phones: compact "Page 2 of 8". Larger screens: numbered buttons. */}
        <span className="sm:hidden px-3 text-xs font-medium text-foreground tabular-nums">
          Page {page} of {totalPages}
        </span>
        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers(page, totalPages).map((p) =>
            typeof p === "string" ? (
              <span
                key={p}
                className="px-1 text-xs text-muted-foreground select-none"
              >
                …
              </span>
            ) : (
              <Button
                key={p}
                type="button"
                size="icon-sm"
                variant={p === page ? "default" : "outline"}
                onClick={() => onPageChange(p)}
                aria-label={`Page ${p}`}
                aria-current={p === page ? "page" : undefined}
                className="text-xs tabular-nums"
              >
                {p}
              </Button>
            ),
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={isLast}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={isLast}
          onClick={() => onPageChange(totalPages)}
          aria-label="Last page"
          className="hidden sm:inline-flex"
        >
          <ChevronsRight className="size-4" />
        </Button>
      </nav>
    </div>
  );
};

export default Pagination;