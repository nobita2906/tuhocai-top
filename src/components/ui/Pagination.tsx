'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  baseUrl?: string; // If provided, renders Next.js Link instead of button
  totalItems?: number;
  pageSize?: number;
  itemName?: string;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  baseUrl,
  totalItems,
  pageSize,
  itemName = 'mục',
  className = '',
}: PaginationProps) {
  if (totalPages <= 1 && (!totalItems || totalItems <= (pageSize || 10))) {
    return null;
  }

  // Helper to build URL with page
  const getPageUrl = (page: number) => {
    if (!baseUrl) return '#';
    try {
      const url = new URL(baseUrl, 'https://tuhocai.top');
      url.searchParams.set('page', page.toString());
      return url.pathname + url.search;
    } catch {
      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}page=${page}`;
    }
  };

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  const renderPageItem = (p: number | string, index: number) => {
    if (typeof p === 'string') {
      return (
        <span
          key={`ellipsis-${index}`}
          className="inline-flex items-center justify-center w-9 h-9 text-slate-500 font-mono text-xs select-none"
        >
          ...
        </span>
      );
    }

    const isActive = p === currentPage;
    const baseClasses =
      'inline-flex items-center justify-center min-w-[36px] h-9 px-3 rounded-xl text-xs font-mono font-semibold transition-all duration-200';
    const activeClasses =
      'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30';
    const inactiveClasses =
      'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]';

    if (baseUrl) {
      return (
        <Link
          key={`page-${p}`}
          href={getPageUrl(p)}
          className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
          aria-current={isActive ? 'page' : undefined}
        >
          {p}
        </Link>
      );
    }

    return (
      <button
        key={`page-${p}`}
        type="button"
        onClick={() => onPageChange && onPageChange(p)}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {p}
      </button>
    );
  };

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 select-none ${className}`}
    >
      {/* Information text */}
      {typeof totalItems === 'number' && typeof pageSize === 'number' ? (
        <div className="text-xs text-slate-400 font-mono">
          Hiển thị{' '}
          <span className="font-semibold text-slate-200">
            {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{' '}
          -{' '}
          <span className="font-semibold text-slate-200">
            {Math.min(currentPage * pageSize, totalItems)}
          </span>{' '}
          trên tổng số{' '}
          <span className="font-semibold text-cyan-400">{totalItems}</span> {itemName}
        </div>
      ) : (
        <div className="text-xs text-slate-400 font-mono">
          Trang <span className="font-semibold text-slate-200">{currentPage}</span> /{' '}
          <span className="font-semibold text-slate-200">{totalPages}</span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        {baseUrl ? (
          prevDisabled ? (
            <span className="inline-flex items-center gap-1 h-9 px-3 rounded-xl text-xs font-semibold text-slate-600 bg-white/[0.02] border border-white/[0.04] cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Trước</span>
            </span>
          ) : (
            <Link
              href={getPageUrl(currentPage - 1)}
              className="inline-flex items-center gap-1 h-9 px-3 rounded-xl text-xs font-semibold text-slate-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Trước</span>
            </Link>
          )
        ) : (
          <button
            type="button"
            disabled={prevDisabled}
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            className={`inline-flex items-center gap-1 h-9 px-3 rounded-xl text-xs font-semibold transition-all ${
              prevDisabled
                ? 'text-slate-600 bg-white/[0.02] border border-white/[0.04] cursor-not-allowed'
                : 'text-slate-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            <ChevronLeft className={`w-4 h-4 ${prevDisabled ? '' : 'text-cyan-400'}`} />
            <span className="hidden sm:inline">Trước</span>
          </button>
        )}

        {/* Page Numbers */}
        <div className="flex items-center gap-1">{pages.map((p, idx) => renderPageItem(p, idx))}</div>

        {/* Next Button */}
        {baseUrl ? (
          nextDisabled ? (
            <span className="inline-flex items-center gap-1 h-9 px-3 rounded-xl text-xs font-semibold text-slate-600 bg-white/[0.02] border border-white/[0.04] cursor-not-allowed">
              <span className="hidden sm:inline">Tiếp</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          ) : (
            <Link
              href={getPageUrl(currentPage + 1)}
              className="inline-flex items-center gap-1 h-9 px-3 rounded-xl text-xs font-semibold text-slate-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-all"
            >
              <span className="hidden sm:inline">Tiếp</span>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </Link>
          )
        ) : (
          <button
            type="button"
            disabled={nextDisabled}
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            className={`inline-flex items-center gap-1 h-9 px-3 rounded-xl text-xs font-semibold transition-all ${
              nextDisabled
                ? 'text-slate-600 bg-white/[0.02] border border-white/[0.04] cursor-not-allowed'
                : 'text-slate-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            <span className="hidden sm:inline">Tiếp</span>
            <ChevronRight className={`w-4 h-4 ${nextDisabled ? '' : 'text-cyan-400'}`} />
          </button>
        )}
      </div>
    </div>
  );
}
