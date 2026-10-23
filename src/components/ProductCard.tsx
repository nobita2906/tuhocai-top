'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { getProductCover } from '@/lib/productImages';
import { Zap, Download, ShoppingCart, ShieldCheck, ArrowUpRight, Cpu, Flame, Sparkles } from 'lucide-react';

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
      badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30', 
      icon: Cpu 
    },
    skill: { 
      label: 'Skill AI', 
      badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30', 
      icon: Sparkles 
    },
    prompt: { 
      label: 'Prompt VIP', 
      badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30', 
      icon: Zap 
    },
  };

  const catKey = product.category?.toLowerCase() || '';
  const cat = categoryConfigs[catKey] || {
    label: product.category || 'Tài nguyên AI',
    badgeClass: 'bg-white/[0.05] text-slate-300 border-white/10',
    icon: Zap,
  };
  const IconComponent = cat.icon;

  return (
    <div className="bento-card group relative flex flex-col overflow-hidden p-3.5 sm:p-4 hover:border-indigo-500/40 transition-all duration-300">
      {/* 1. VISUAL THUMBNAIL COVER (Top Area) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#111116] mb-3.5 border border-white/[0.06] group-hover:border-indigo-500/30 transition-colors">
        <Image
          src={coverImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          priority={product.pid === 'WF-THAI-099'}
        />

        {/* Ambient bottom shadow gradient for smooth blend */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/90 via-transparent to-black/20 pointer-events-none" />

        {/* Top-Left: Discount or Free Badge */}
        {discountPercent > 0 && !isFree && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md font-mono text-[10px] font-black bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30 flex items-center gap-1">
            <span>-{discountPercent}%</span>
          </div>
        )}
        {isFree && (
          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md font-mono text-[10px] font-black bg-emerald-500 text-slate-950 border border-emerald-500 hover:bg-transparent hover:text-emerald-400 transition-all duration-300 cursor-pointer shadow-lg shadow-emerald-500/30 flex items-center gap-1">
            <span>MIỄN PHÍ 0Đ</span>
          </div>
        )}

        {/* Top-Right: Category Pill with Frosted Glass */}
        <div className="absolute top-2 right-2">
          <span className={`tech-badge border backdrop-blur-md text-[10px] py-0.5 px-2 ${cat.badgeClass}`}>
            <IconComponent className="w-3 h-3" />
            {cat.label}
          </span>
        </div>

        {/* Bottom Feature Pill on Image */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-black/75 backdrop-blur-md text-slate-300 border border-white/10 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Sẵn sàng dùng</span>
        </div>
      </div>

      {/* 2. TITLE & DESCRIPTION */}
      <div className="flex-1 flex flex-col">
        <Link href={`/san-pham/${product.slug}`} className="group/title">
          <h3 className="font-bold text-white text-sm sm:text-base line-clamp-2 leading-snug group-hover/title:text-cyan-400 transition-colors flex items-start justify-between gap-1">
            <span>{product.name}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 translate-y-1 group-hover/title:opacity-100 group-hover/title:translate-x-0 group-hover/title:translate-y-0 transition-all text-cyan-400 flex-shrink-0 mt-0.5" />
          </h3>
        </Link>

        <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed flex-1">
          {product.description || 'Bộ tài liệu và mã nguồn tự động hóa được kiểm thử kỹ lưỡng, sẵn sàng triển khai ngay.'}
        </p>

        {/* 3. PRICING & GUARANTEE */}
        <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-baseline justify-between">
          <div>
            {isFree ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-emerald-400 font-mono">0 đ</span>
                <span className="text-[11px] text-slate-500 line-through font-mono">99.000 đ</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-indigo-400 font-mono">
                  {new Intl.NumberFormat('vi-VN').format(product.price)} đ
                </span>
                {product.original_price > product.price && (
                  <span className="text-[11px] text-slate-500 line-through font-mono">
                    {new Intl.NumberFormat('vi-VN').format(product.original_price)} đ
                  </span>
                )}
              </div>
            )}
          </div>
          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3 h-3 text-indigo-400" />
            Đã bán: <strong className="text-white font-mono">{product.sales_count || 15}+</strong>
          </span>
        </div>
      </div>

      {/* 4. ACTION BUTTONS */}
      <div className="mt-3 pt-0">
        {isFree ? (
          <button
            onClick={() => onFreeClick?.(product)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm border border-emerald-500 hover:bg-transparent hover:text-emerald-400 hover:border-emerald-500 transition-all duration-300 active:scale-[0.98] shadow-md shadow-emerald-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            Tải Miễn Phí Ngay
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <Link
              href={`/san-pham/${product.slug}`}
              className="flex-1 py-2 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-center font-medium text-xs sm:text-sm border border-white/[0.06] transition-all"
            >
              Chi tiết
            </Link>
            <Link
              href={`/thanh-toan?pid=${product.pid}`}
              className="flex-1 flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
