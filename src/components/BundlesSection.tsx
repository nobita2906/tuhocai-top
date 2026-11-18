'use client';

import Link from 'next/link';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Flame,
  BadgePercent,
  Clock,
  Layers,
} from 'lucide-react';

interface BundlesSectionProps {
  zaloSupportUrl?: string;
}

export default function BundlesSection({ zaloSupportUrl }: BundlesSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold shadow-xs">
          <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>GÓI COMBO SIÊU TIẾT KIỆM — ALL IN ONE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Đầu Tư Một Lần, Sở Hữu Trọn Bộ Giải Pháp AI
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Tiết kiệm hơn 50% so với mua lẻ từng công cụ. Nhận trọn vẹn workflow, prompt VIP, template thực chiến và được bảo hành cập nhật trọn đời.
        </p>
      </div>

      {/* 2 Card Combo lớn đặt cạnh nhau */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
        {/* COMBO 1: VIDEO AI & SÁNG TẠO TRIỆU VIEW */}
        <div className="relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900 via-[#11111a] to-[#0a0a0f] text-white border-2 border-indigo-500/40 shadow-2xl shadow-indigo-950/40 hover:border-indigo-400 transition-all duration-300 group">
          {/* Badge nổi bật góc trên */}
          <div className="absolute -top-3.5 left-6 sm:left-8 px-3.5 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-mono text-xs font-black shadow-lg flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>COMBO CREATOR • BÁN CHẠY NHẤT</span>
          </div>

          <div>
            <div className="flex items-start justify-between gap-4 mt-2 mb-4">
              <div>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-indigo-400">
                  Dành cho Nhà Sáng Tạo & Xây Kênh
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-1 text-white group-hover:text-indigo-300 transition-colors">
                  Combo Toàn Năng Video AI & Sáng Tạo Triệu View
                </h3>
              </div>
              <div className="shrink-0 px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-mono text-xs font-bold">
                TIẾT KIỆM 47%
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Giải pháp trọn vẹn biến 1 bức ảnh thành video bán hàng triệu view, quy trình làm phim ngắn drama gia đình và kho prompt FLUX thương mại đỉnh cao.
            </p>

            {/* Giá tiền */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 mb-6 flex items-baseline justify-between">
              <div>
                <div className="text-xs text-slate-400 font-medium line-through font-mono">
                  Giá gốc: 564.000 đ
                </div>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-white font-mono tracking-tight">
                  299.000&nbsp;đ
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                  Sở hữu vĩnh viễn
                </span>
              </div>
            </div>

            {/* Danh sách thành phần chi tiết */}
            <div className="space-y-3 mb-8">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Trọn bộ 5 tài nguyên bao gồm:
              </div>
              
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Khóa Học & Quy Trình Làm Video AI Bán Hàng Triệu View</strong> từ 1 ảnh (Trị giá 297K)</span>
              </div>

              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Quy trình Video AI Mini Drama</strong> câu chuyện gia đình cảm động viral (Trị giá 69K)</span>
              </div>

              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Bộ Prompt Tạo Video TikTok Viral</strong> kịch bản giữ chân người xem 3s đầu (Trị giá 99K)</span>
              </div>

              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Bộ 100+ Prompt FLUX & Midjourney Thương Mại</strong> tạo ảnh sản phẩm bán hàng (Trị giá 99K)</span>
              </div>

              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-300 font-semibold bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Đặc quyền:</strong> Hỗ trợ 1-1 cài đặt và giải đáp thắc mắc qua Nhóm Zalo VIP trọn đời</span>
              </div>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="pt-2">
            <Link
              href="/thanh-toan?pid=COMBO-VIDEO-299"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-black text-sm sm:text-base shadow-xl shadow-indigo-950/60 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span>Sở Hữu Trọn Bộ Video AI — 299.000 đ</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <div className="mt-2.5 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Thanh toán VietQR quét mã • Nhận link tự động trong 30s</span>
            </div>
          </div>
        </div>

        {/* COMBO 2: SUPER AUTOMATION n8n & DOANH NGHIỆP TỰ ĐỘNG */}
        <div className="relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900 via-[#10141b] to-[#0a0d14] text-white border-2 border-emerald-500/40 shadow-2xl shadow-emerald-950/40 hover:border-emerald-400 transition-all duration-300 group">
          {/* Badge nổi bật góc trên */}
          <div className="absolute -top-3.5 left-6 sm:left-8 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-mono text-xs font-black shadow-lg flex items-center gap-1.5">
            <BadgePercent className="w-3.5 h-3.5 text-yellow-300" />
            <span>COMBO DOANH CHỦ • TIẾT KIỆM 53%</span>
          </div>

          <div>
            <div className="flex items-start justify-between gap-4 mt-2 mb-4">
              <div>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-400">
                  Dành cho Chủ Shop & Tự Động Hóa Vận Hành
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-1 text-white group-hover:text-emerald-300 transition-colors">
                  Combo Super Automation n8n & Doanh Nghiệp Tự Động
                </h3>
              </div>
              <div className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono text-xs font-bold">
                SIÊU TIẾT KIỆM
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Vũ khí tự động hóa 100% quy trình đăng bài đa kênh, nuôi fanpage, gửi email chăm sóc khách hàng và sao chép bất kỳ landing page nào chỉ với 1 click.
            </p>

            {/* Giá tiền */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 mb-6 flex items-baseline justify-between">
              <div>
                <div className="text-xs text-slate-400 font-medium line-through font-mono">
                  Giá gốc: 745.000 đ
                </div>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-white font-mono tracking-tight">
                  349.000&nbsp;đ
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                  Update trọn đời
                </span>
              </div>
            </div>

            {/* Danh sách thành phần chi tiết */}
            <div className="space-y-3 mb-8">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Trọn bộ 6 giải pháp vận hành bao gồm:
              </div>

              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Workflow n8n Đăng Bài Đa Kênh</strong> tự động phân phối Facebook, Telegram, WP (Trị giá 99K)</span>
              </div>

              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Workflow n8n Auto Đăng Bài Facebook</strong> kèm kịch bản tạo content không trùng lặp (Trị giá 199K)</span>
              </div>

              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Workflow n8n Gửi Email Marketing</strong> tự động chăm sóc và upsell khách hàng (Trị giá 149K)</span>
              </div>

              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Skill AI Sao Chép Bất Kỳ Landing Page 1-Click</strong> giống 99% trang mẫu (Trị giá 99K)</span>
              </div>

              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Skill Codex & ChatGPT: Tạo App & Code Không Cần Code</strong> (Trị giá 199K)</span>
              </div>

              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-teal-300 font-semibold bg-teal-500/10 p-2.5 rounded-xl border border-teal-500/20">
                <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Đặc quyền:</strong> Tặng toàn bộ file JSON n8n import 1-click + Hướng dẫn setup VPS free + Hỗ trợ Zalo VIP</span>
              </div>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="pt-2">
            <Link
              href="/thanh-toan?pid=COMBO-AUTO-349"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-950/60 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span>Sở Hữu Trọn Bộ Tự Động Hóa — 349.000 đ</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <div className="mt-2.5 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Thanh toán VietQR quét mã • Kích hoạt link tải và tài liệu ngay</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

