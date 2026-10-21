'use client';

import Link from 'next/link';
import { Product } from '@/types';
import { Zap, Download, ShoppingCart, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onFreeClick?: (product: Product) => void;
}

export default function ProductCard({ product, onFreeClick }: ProductCardProps) {
  const isFree = product.price === 0;

  const categoryLabels: Record<string, { label: string; color: string }> = {
    workflow: { label: 'Workflow n8n', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    skill: { label: 'Skill AI', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    prompt: { label: 'Prompt VIP', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  };

  const catInfo = categoryLabels[product.category?.toLowerCase()] || {
    label: product.category || 'Tài nguyên AI',
    color: 'bg-slate-700/50 text-slate-300 border-slate-600',
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 overflow-hidden">
      {/* Top Banner / Tag */}
      <div className="p-5 pb-0 flex items-center justify-between">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${catInfo.color}`}>
          <Zap className="w-3 h-3" />
          {catInfo.label}
        </span>
        {isFree ? (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            MIỄN PHÍ
          </span>
        ) : (
          <span className="text-xs font-medium text-slate-400">
            Đã bán: <strong className="text-white">{product.sales_count || 15}+</strong>
          </span>
        )}
      </div>

      {/* Title & Description */}
      <div className="p-5 flex-1 flex flex-col">
        <Link href={`/san-pham/${product.slug}`} className="group-hover:text-indigo-400 transition-colors">
          <h3 className="font-bold text-white text-base sm:text-lg line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed flex-1">
          {product.description || 'Bộ tài liệu và mã nguồn tự động hóa được kiểm thử kỹ lưỡng, sẵn sàng triển khai ngay.'}
        </p>

        {/* Pricing info */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-baseline justify-between">
          <div>
            {isFree ? (
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-emerald-400">0 đ</span>
                <span className="text-xs text-slate-500 line-through">99.000 đ</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-white">
                  {new Intl.NumberFormat('vi-VN').format(product.price)} đ
                </span>
                {product.original_price > product.price && (
                  <span className="text-xs text-slate-500 line-through">
                    {new Intl.NumberFormat('vi-VN').format(product.original_price)} đ
                  </span>
                )}
              </div>
            )}
          </div>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Bảo hành trọn đời
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-5 pt-0">
        {isFree ? (
          <button
            onClick={() => onFreeClick?.(product)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 font-semibold text-xs border border-emerald-500/30 transition-all hover:scale-[1.01]"
          >
            <Download className="w-4 h-4" />
            Tải Miễn Phí Ngay
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href={`/san-pham/${product.slug}`}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-center font-medium text-xs transition-colors"
            >
              Chi tiết
            </Link>
            <Link
              href={`/thanh-toan?pid=${product.pid}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02]"
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
