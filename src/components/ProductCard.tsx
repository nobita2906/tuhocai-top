'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { getProductCover } from '@/lib/productImages';
import { Zap, Download, ShoppingCart, ShieldCheck, ArrowUpRight, Cpu, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onFreeClick?: (product: Product) => void;
}

export default function ProductCard({ product, onFreeClick }: ProductCardProps) {
  const isFree = product.price === 0;
  const coverImage = getProductCover(product);

  // Calculate discount percentage
  const discountPercent =
    product.original_price > product.price && product.original_price > 0
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0;

  const categoryConfigs: Record<string, { label: string; badgeClass: string; icon: any }> = {
    workflow: { 
      label: 'Workflow n8n', 
      badgeClass: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-900 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500/30', 
      icon: Cpu 
    },
    skill: { 
      label: 'Skill AI', 
      badgeClass: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-900 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/30', 
      icon: Sparkles 
    },
    prompt: { 
      label: 'Prompt VIP', 
      badgeClass: 'bg-purple-100 dark:bg-purple-500/20 text-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-500/30', 
      icon: Zap 
    },
  };

  const catKey = product.category?.toLowerCase() || '';
  const cat = categoryConfigs[catKey] || {
    label: product.category || 'Tài nguyên AI',
    badgeClass: 'bg-slate-200 dark:bg-white/[0.05] text-slate-800 dark:text-slate-300 border-slate-300 dark:border-white/10',
    icon: Zap,
  };
  const IconComponent = cat.icon;

  return (
    <div className="bento-card group relative flex flex-col overflow-hidden p-3.5 sm:p-4 border-2 border-slate-300 dark:border-white/15 hover:border-slate-400 dark:hover:border-white/10 hover:opacity-95 shadow-md shadow-slate-900/5 transition-all duration-200">
      {/* 1. VISUAL THUMBNAIL COVER (Top Area) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-[#111116] mb-3.5 border-2 border-slate-300/90 dark:border-white/10 group-hover:opacity-95 transition-opacity shadow-inner">
        <Image
          src={coverImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-300 ease-out"
          priority={product.pid === 'WF-THAI-099'}
        />

        {/* Ambient bottom shadow gradient for smooth blend */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-[#09090b]/90 via-transparent to-black/10 pointer-events-none" />

        {/* Top-Left: Discount or Free Badge - Đậm đà */}
        {discountPercent > 0 && !isFree && (
          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md font-mono text-[10px] font-black bg-gradient-to-r from-indigo-800 to-blue-800 text-white shadow-md shadow-indigo-950/40 border border-indigo-400/40 flex items-center gap-1">
            <span>-{discountPercent}%</span>
          </div>
        )}
        {isFree && (
          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md font-mono text-[10px] font-black bg-emerald-700 text-white border border-emerald-600 shadow-md shadow-emerald-950/40 flex items-center gap-1">
            <span>MIỄN PHÍ 0Đ</span>
          </div>
        )}

        {/* Top-Right: Category Pill with High Contrast */}
        <div className="absolute top-2 right-2">
          <span className={`tech-badge border backdrop-blur-md text-[10px] py-0.5 px-2 font-bold shadow-sm ${cat.badgeClass}`}>
            <IconComponent className="w-3 h-3" />
            {cat.label}
          </span>
        </div>

        {/* Bottom Feature Pill on Image */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-900/90 backdrop-blur-md text-white border border-white/20 flex items-center gap-1 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Sẵn sàng dùng</span>
        </div>
      </div>

      {/* 2. TITLE & DESCRIPTION */}
      <div className="flex-1 flex flex-col">
        <Link href={`/san-pham/${product.slug}`} className="group/title">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base line-clamp-2 leading-snug group-hover/title:text-indigo-800 dark:group-hover/title:text-cyan-400 transition-colors flex items-start justify-between gap-1">
            <span>{product.name}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 translate-y-1 group-hover/title:opacity-100 group-hover/title:translate-x-0 group-hover/title:translate-y-0 transition-all text-indigo-700 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
          </h3>
        </Link>

        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1">
          {product.description || 'Bộ tài liệu và mã nguồn tự động hóa được kiểm thử kỹ lưỡng, sẵn sàng triển khai ngay.'}
        </p>

        {/* 3. PRICING & GUARANTEE */}
        <div className="mt-3 pt-2.5 border-t border-slate-300 dark:border-white/[0.08] flex items-baseline justify-between">
          <div>
            {isFree ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 font-mono">0 đ</span>
                <span className="text-[11px] text-slate-400 line-through font-mono">99.000 đ</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-indigo-800 dark:text-indigo-400 font-mono">
                  {new Intl.NumberFormat('vi-VN').format(product.price)} đ
                </span>
                {product.original_price > product.price && (
                  <span className="text-[11px] text-slate-400 line-through font-mono font-medium">
                    {new Intl.NumberFormat('vi-VN').format(product.original_price)} đ
                  </span>
                )}
              </div>
            )}
          </div>
          <span className="text-[10px] text-slate-600 dark:text-slate-400 flex items-center gap-1 font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-400" />
            Đã bán: <strong className="text-slate-900 dark:text-white font-mono">{product.sales_count || 15}+</strong>
          </span>
        </div>
      </div>

      {/* 4. ACTION BUTTONS: Bình thường đậm đà, hover mờ lại dịu dàng */}
      <div className="mt-3 pt-0">
        {isFree ? (
          <button
            onClick={() => onFreeClick?.(product)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-700 hover:opacity-85 hover:shadow-xs text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/25 transition-all duration-200 active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            Tải Miễn Phí Ngay
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href={`/san-pham/${product.slug}`}
              className="flex-1 py-2 px-2.5 rounded-xl bg-white hover:opacity-80 hover:border-slate-300 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-900 dark:text-slate-200 text-center font-bold text-xs sm:text-sm border-2 border-slate-300 dark:border-white/[0.1] shadow-xs transition-all"
            >
              Chi tiết
            </Link>
            <Link
              href={`/thanh-toan?pid=${product.pid}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 hover:opacity-85 hover:shadow-xs text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-950/25 transition-all active:scale-[0.98]"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Mua ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
