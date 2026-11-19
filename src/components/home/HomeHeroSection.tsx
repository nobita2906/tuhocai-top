'use client';

import { useState } from 'react';
import { Sparkles, Gift, ArrowRight, CheckCircle2, Play, Cpu, Layers, Zap, X } from 'lucide-react';
import Image from 'next/image';

interface HomeHeroSectionProps {
  onClaimFreeClick: () => void;
}

export default function HomeHeroSection({ onClaimFreeClick }: HomeHeroSectionProps) {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-6 sm:pt-12 pb-10 sm:pb-16 cyber-grid radial-spotlight overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Cột trái: Thông điệp cốt lõi & CTA */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-cyan-400 border border-indigo-500/20 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>HỌC BẰNG CÁCH LÀM • TỰ HỌC AI</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.2]">
              Tự học AI bằng cách làm:{' '}
              <span className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 dark:from-indigo-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                từ người mới đến có workflow chạy thật
              </span>
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Mình tự áp dụng AI vào công việc và làm nội dung hàng ngày, rồi chia sẻ lại quy trình + template để bạn tải về dùng được ngay.
            </p>

            {/* CTA row theo chuẩn Blueprint */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                type="button"
                onClick={onClaimFreeClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-950/25 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
              >
                <Gift className="w-4 h-4 text-emerald-300" />
                <span>Nhận Bộ Quà 0đ</span>
              </button>

              <button
                type="button"
                onClick={() => setVideoModalOpen(true)}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-600 dark:text-cyan-400 hover:underline py-2 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-500/10 dark:bg-cyan-500/20 flex items-center justify-center border border-indigo-500/30">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Video chào 45s (Nguyễn Đăng AI)</span>
              </button>
            </div>

            {/* Dòng tin cậy bên dưới theo đúng Blueprint */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-x-2.5 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                100% Miễn phí
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Giao link trong 30s</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Nhóm Zalo hỗ trợ</span>
            </div>
          </div>

          {/* Cột phải: Mockup Sơ đồ Workflow Tự Động Hóa Mẫu (Minh bạch, không phóng đại) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl bg-slate-900/90 border-2 border-indigo-500/30 p-5 shadow-2xl backdrop-blur-xl overflow-hidden text-white">
              {/* Top Bar giả lập app */}
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/10 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex gap-1.5 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 truncate">quy_trinh_tu_dong_hoa.json</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-cyan-300 text-[10px] font-mono font-bold whitespace-nowrap shrink-0 border border-cyan-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  SƠ ĐỒ QUY TRÌNH MẪU
                </div>
              </div>

              {/* Sơ đồ workflow node trực quan */}
              <div className="py-4 space-y-3">
                {/* Node 1: Input */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">1. Lên ý tưởng / Google Sheets</div>
                    <div className="text-[10px] text-slate-400 font-mono">Nhập chủ đề &amp; tiêu đề bài viết</div>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">✓ Trigger</div>
                </div>

                {/* Connector line */}
                <div className="w-0.5 h-3 bg-gradient-to-b from-indigo-500 to-cyan-500 mx-auto" />

                {/* Node 2: AI Process */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/30">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-cyan-300 truncate">2. AI Xử Lý &amp; Tạo Ảnh FLUX</div>
                    <div className="text-[10px] text-slate-400 font-mono">Viết kịch bản + render ảnh thương mại</div>
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono">✓ Tự động</div>
                </div>

                {/* Connector line */}
                <div className="w-0.5 h-3 bg-gradient-to-b from-cyan-500 to-emerald-500 mx-auto" />

                {/* Node 3: Publish */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">3. Tự Động Đăng Đa Kênh</div>
                    <div className="text-[10px] text-slate-400 font-mono">Facebook, Zalo &amp; Blog Tự Học AI</div>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">✓ Xuất bản</div>
                </div>
              </div>

              {/* Bottom Result Box */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="text-[11px] text-slate-400">Ứng dụng thực tế:</div>
                  <div className="font-bold text-white">Tự động hóa từ ý tưởng đến đăng bài</div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">Template n8n</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Chào 45s */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-white/20 p-4 shadow-2xl overflow-hidden space-y-3">
            <div className="flex items-center justify-between text-white pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-cyan-400" />
                <span className="text-xs sm:text-sm font-bold font-mono">Nguyễn Đăng AI — Chào bạn &amp; Giới thiệu Tự Học AI</span>
              </div>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black">
              <iframe
                src="https://www.youtube-nocookie.com/embed/KOAKDMxpPxI?autoplay=1"
                title="Nguyễn Đăng AI - Video giới thiệu"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
              <span>Học bằng cách làm — Thực hành cùng Nguyễn Đăng AI</span>
              <button
                type="button"
                onClick={() => {
                  setVideoModalOpen(false);
                  onClaimFreeClick();
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
              >
                Nhận Bộ Quà 0đ Ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
