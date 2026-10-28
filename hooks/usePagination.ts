"use client";

import { useCallback, useMemo, useState } from "react";

/**
 * Client-side pagination for any array.
 *
 * - `page` is always clamped to a valid page, so deleting the last item on the
 *   last page (or filtering down to fewer results) never leaves you on an
 *   empty page.
 * - Call `resetPage()` whenever a search/filter changes so the user lands on
 *   page 1 of the new results.
 */
export function usePagination<T>(items: T[], initialPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPage(1);
  }, []);

  const resetPage = useCallback(() => setPage(1), []);

  return {
    page: currentPage,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    pageItems,
    resetPage,
  };
}
