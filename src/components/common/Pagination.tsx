'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label?: string;
}

function buildPageItems(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from(
      {
        length: totalPages,
      },
      (_, index) => index + 1,
    );
  }

  const pages: Array<number | 'ellipsis-start' | 'ellipsis-end'> = [1];
  const rangeStart = Math.max(2, currentPage - 1);
  const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

  if (rangeStart > 2) {
    pages.push('ellipsis-start');
  }

  for (let page = rangeStart; page <= rangeEnd; page += 1) {
    pages.push(page);
  }

  if (rangeEnd < totalPages - 1) {
    pages.push('ellipsis-end');
  }

  pages.push(totalPages);

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  label = 'pagination',
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageItems = buildPageItems(currentPage, totalPages);

  return (
    <div className="mt-10 flex flex-col gap-4 border-t border-[#1A1A1A] pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
        {label} - page {currentPage} of {totalPages}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#1A1A1A] bg-[#0D0D0D] px-3.5 py-2 text-xs font-bold text-zinc-400 transition-all hover:border-[#FF4C00]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {pageItems.map(pageItem =>
            pageItem === 'ellipsis-start' || pageItem === 'ellipsis-end' ? (
              <span
                key={pageItem}
                className="px-2 text-sm font-bold text-zinc-600"
              >
                ...
              </span>
            ) : (
              <button
                key={pageItem}
                type="button"
                onClick={() => onPageChange(pageItem)}
                className={`flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-bold transition-all ${
                  currentPage === pageItem
                    ? 'border-[#FF4C00] bg-[#FF4C00] text-white shadow-lg shadow-[#FF4C00]/20'
                    : 'border-[#1A1A1A] bg-[#0D0D0D] text-zinc-400 hover:border-[#FF4C00]/40 hover:text-white'
                }`}
                aria-current={currentPage === pageItem ? 'page' : undefined}
              >
                {pageItem}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#1A1A1A] bg-[#0D0D0D] px-3.5 py-2 text-xs font-bold text-zinc-400 transition-all hover:border-[#FF4C00]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
