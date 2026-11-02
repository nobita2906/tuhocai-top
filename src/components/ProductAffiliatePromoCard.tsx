'use client';

import Link from 'next/link';
import { Product } from '@/types';
import {
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Coins,
  ShieldCheck,
  Gift,
} from 'lucide-react';

interface ProductAffiliatePromoCardProps {
  product: Product;
}

export default function ProductAffiliatePromoCard({ product }: ProductAffiliatePromoCardProps) {
  const isFree = product.price === 0;
  const rate = 60; // Hoa hồng CTV chuẩn 60%
  const commissionAmount = Math.round((product.price * rate) / 100);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-[#0b0e1e] text-white p-5 sm:p-6 shadow-2xl border-2 border-indigo-500/40 space-y-4">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header Pill */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/25 border border-indigo-400/30 text-indigo-300 text-[11px] font-bold font-mono shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>CƠ HỘI GIA TĂNG THU NHẬP • HOA HỒNG {rate}%</span>
        </div>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      </div>

      {/* Main Title & Benefit Teaser */}
      <div className="relative z-10 space-y-2">
        <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
          Cơ Hội Tăng Thu Nhập{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200">
            5 – 15 Triệu/Tháng
          </span>{' '}
          Cùng Tự Học AI
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {isFree ? (
            <>
              Chia sẻ tài liệu 0đ hữu ích cho cộng đồng để xây tệp khách hàng — Tự động nhận hoa hồng trọn đời{' '}
              <strong className="text-amber-400 font-extrabold whitespace-nowrap">lên tới {rate}%</strong> ngay khi phát sinh giao dịch nâng cấp!
            </>
          ) : (
            <>
              Tạo nguồn thu nhập thụ động ngay hôm nay! Giới thiệu sản phẩm này, nhận ngay tiền thưởng{' '}
              <strong className="text-amber-400 font-black font-mono text-sm sm:text-base whitespace-nowrap">
                +{new Intl.NumberFormat('vi-VN').format(commissionAmount)}&nbsp;đ
              </strong>{' '}
              <span className="text-cyan-300 font-bold whitespace-nowrap">({rate}% hoa hồng/đơn)</span>. Tiền về VietQR tự động trong 24h!
            </>
          )}
        </p>
      </div>

      {/* Highlight Stats / Mini Badges */}
      <div className="relative z-10 grid grid-cols-2 gap-2 pt-1">
        <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-xs">
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Coins className="w-3 h-3 text-amber-400 shrink-0" />
            Hoa hồng cao nhất
          </div>
          <div className="text-base sm:text-lg font-black text-amber-400 font-mono mt-0.5 whitespace-nowrap">
            {rate}% Thực Chiến
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-xs">
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-cyan-400 shrink-0" />
            Rút tiền nhanh 24h
          </div>
          <div className="text-base sm:text-lg font-black text-cyan-300 font-mono mt-0.5 whitespace-nowrap">
            Từ 200k VietQR
          </div>
        </div>
      </div>

      {/* Bullet Features Checklist: Đánh trúng lợi ích đầu tiên */}
      <div className="relative z-10 space-y-1.5 pt-1 text-xs text-slate-300">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span><strong>Hưởng trọn 60% hoa hồng</strong> — Mức chia sẻ doanh thu cao nhất thị trường AI</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span><strong>Không cần bỏ vốn, không ôm hàng</strong>: Rủi ro bằng 0, làm online tự do</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span><strong>Có sẵn 100% bài viết & video mẫu</strong>: Chỉ việc copy - paste là có khách</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span><strong>Báo đơn tự động tức thì qua Telegram</strong>, theo dõi click & tiền về realtime</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 pt-2 space-y-2">
        <Link
          href="/affiliate"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-950/40 transition-all hover:scale-[1.01] active:scale-[0.98] border border-amber-600/30 whitespace-nowrap"
        >
          <span>Bắt Đầu Kiếm Thu Nhập Ngay →</span>
        </Link>

        <a
          href="https://zalo.me/g/tuhocai"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-slate-200 hover:text-white font-bold text-xs border border-white/15 transition-all whitespace-nowrap"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Vào Nhóm Zalo Hướng Dẫn Kiếm Tiền Thực Chiến</span>
        </a>
      </div>
    </div>
  );
}

