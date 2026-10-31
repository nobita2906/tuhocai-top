'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Lỗi điều hướng/render giao diện:', error);

    // Tự động reload nếu gặp lỗi phiên bản code cũ (ChunkLoadError do vừa có bản deploy mới trên Vercel)
    const errMsg = error?.message || '';
    if (
      errMsg.includes('Loading chunk') ||
      errMsg.includes('ChunkLoadError') ||
      errMsg.includes('Failed to fetch RSC payload') ||
      errMsg.includes('Connection closed')
    ) {
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/5">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
        Đang tải lại giao diện...
      </h1>

      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
        Hệ thống đang đồng bộ dữ liệu phiên bản mới nhất hoặc kết nối tạm thời bị gián đoạn. Bạn vui lòng bấm nút bên dưới để tiếp tục.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.reload();
            } else {
              reset();
            }
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.98]"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Tải lại trang</span>
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-300 dark:border-white/10 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Về trang chủ</span>
        </Link>
      </div>

      {error?.digest && (
        <p className="mt-8 text-[11px] font-mono text-slate-400 dark:text-slate-600">
          Mã tham chiếu lỗi: {error.digest}
        </p>
      )}
    </div>
  );
}
