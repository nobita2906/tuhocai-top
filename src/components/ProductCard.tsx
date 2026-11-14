'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { getProductCover } from '@/lib/productImages';
import { getProductTargetUrl, isLandingPageProduct } from '@/lib/productLinks';
import { Download, ShoppingCart, ArrowRight, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onFreeClick?: (product: Product) => void;
}

export default function ProductCard({ product, onFreeClick }: ProductCardProps) {
  const isFree = product.price === 0;
  const coverImage = getProductCover(product);
  const targetUrl = getProductTargetUrl(product);
  const hasLandingPage = isLandingPageProduct(product);

  // Tính phần trăm giảm giá nếu có
  const discountPercent =
    product.original_price > product.price && product.original_price > 0
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0;

  return (
    <div className="bento-card group flex flex-col overflow-hidden p-4 sm:p-5 border-2 border-slate-300 dark:border-white/10 hover:border-indigo-400/60 dark:hover:border-indigo-500/40 hover:shadow-xl shadow-md transition-all duration-300 rounded-2xl bg-white dark:bg-[#0e0e13]">
      {/* 1. ẢNH BÌA TỐI GIẢN - Chỉ tối đa 1 badge thông minh duy nhất ở góc trên trái */}
      <Link
        href={targetUrl}
        className="block relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-[#15151c] mb-4 border border-slate-300/80 dark:border-white/10 group-hover:opacity-95 transition-all shadow-inner"
        title={`Xem ${product.name}`}
      >
        <Image
          src={coverImage}
          alt={product.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          priority={product.pid === 'WF-THAI-099'}
        />

        {/* Ambient bottom shadow gradient dịu nhẹ */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-[#09090b]/80 via-transparent to-transparent pointer-events-none" />

        {/* 1 BADGE THÔNG MINH DUY NHẤT: Ưu tiên Landing Page -> Miễn phí -> Giảm giá */}
        {hasLandingPage ? (
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-indigo-600/95 text-white backdrop-blur-md border border-indigo-400/30 flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3 text-cyan-300" />
            <span>Landing Page</span>
          </div>
        ) : isFree ? (
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-700 text-white backdrop-blur-md border border-emerald-500/40 shadow-md">
            <span>Miễn phí 0đ</span>
          </div>
        ) : discountPercent > 0 ? (
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-slate-900/85 text-white backdrop-blur-md border border-white/20 shadow-md">
            <span>-{discountPercent}%</span>
          </div>
        ) : null}
      </Link>

      {/* 2. TIÊU ĐỀ & MÔ TẢ NGẮN THOÁNG ĐÃNG */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div>
          <Link href={targetUrl} className="group/title block">
            <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg line-clamp-2 leading-snug group-hover/title:text-indigo-600 dark:group-hover/title:text-cyan-400 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {product.description || 'Bộ tài liệu và mã nguồn tự động hóa được kiểm thử kỹ lưỡng, sẵn sàng triển khai ngay.'}
          </p>
        </div>

        {/* 3. HÀNG CHÂN CARD: GIÁ TIỀN + 1 NÚT BẤM DUY NHẤT (RÕ RÀNG, DỄ TIẾP CẬN) */}
        <div className="pt-3.5 mt-2 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between gap-3">
          {/* Cụm Giá */}
          <div className="flex flex-col min-w-0">
            {isFree ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
                  0&nbsp;đ
                </span>
                <span className="text-xs text-slate-400 line-through font-mono">
                  99.000&nbsp;đ
                </span>
              </div>
            ) : (
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                  {new Intl.NumberFormat('vi-VN').format(product.price)}&nbsp;đ
                </span>
                {product.original_price > product.price && (
                  <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-mono">
                    {new Intl.NumberFormat('vi-VN').format(product.original_price)}&nbsp;đ
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 1 NÚT BẤM CHỦ ĐẠO (SINGLE CLEAR CTA) */}
          <div className="shrink-0">
            {isFree ? (
              <button
                onClick={() => onFreeClick?.(product)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/20 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải 0đ</span>
              </button>
            ) : hasLandingPage ? (
              <Link
                href={targetUrl}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 hover:opacity-90 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-950/25 transition-all hover:translate-x-0.5 active:scale-95 whitespace-nowrap"
              >
                <span>Khám phá</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                href={`/thanh-toan?pid=${product.pid}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-90 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-950/25 transition-all active:scale-95 whitespace-nowrap"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Mua ngay</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
