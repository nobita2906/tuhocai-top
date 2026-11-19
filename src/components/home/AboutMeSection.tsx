'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User, MessageCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface AboutMeSectionProps {
  zaloUrl?: string;
}

export default function AboutMeSection({ zaloUrl = 'https://zalo.me/g/qnitrawpaxpvl6aj7ixb' }: AboutMeSectionProps) {
  return (
    <section id="ve-toi" className="py-8 sm:py-14 border-t border-slate-200 dark:border-white/5 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bento-card rounded-3xl p-6 sm:p-10 bg-white dark:bg-[#111116] border-2 border-slate-200 dark:border-white/10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Cột trái: Ảnh đại diện & Badge */}
            <div className="md:col-span-5 flex flex-col items-center text-center space-y-4">
              <div className="relative w-40 h-40 sm:w-52 sm:h-52 rounded-3xl overflow-hidden p-1 bg-gradient-to-tr from-indigo-700 via-indigo-500 to-cyan-400 shadow-2xl">
                <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-slate-900">
                  <Image
                    src="/images/avatar-dang.svg"
                    alt="Nguyễn Đăng AI"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.target as any).src = '/images/products/skill-claude.svg';
                    }}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Nguyễn Đăng AI
                </h3>
                <p className="text-xs sm:text-sm font-mono text-indigo-600 dark:text-cyan-400 font-bold">
                  Sáng lập Tự Học AI (tuhocai.top)
                </p>
              </div>

              {/* Dải 3 con số thật kiểm chứng được theo góp ý của anh Đăng */}
              <div className="grid grid-cols-3 gap-2 w-full pt-2">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-center">
                  <div className="text-lg sm:text-xl font-black text-indigo-600 dark:text-cyan-400 font-mono">10+</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Template Đóng Gói</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-center">
                  <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">1.000+</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Thành Viên Zalo</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-center">
                  <div className="text-lg sm:text-xl font-black text-amber-500 font-mono">1-1</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Hỗ Trợ Kỹ Thuật</div>
                </div>
              </div>
            </div>

            {/* Cột phải: Câu chuyện & Triết lý */}
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-500/20 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                VỀ NGUYỄN ĐĂNG AI
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                Học AI Không Khó, Quan Trọng Là Phải Chạy Thật Ra Kết Quả
              </h2>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                <p>
                  Xin chào bạn, mình là <strong>Nguyễn Đăng AI</strong>. Mình bắt đầu tự mày mò ứng dụng Trí Tuệ Nhân Tạo từ những ngày đầu khi thấy công việc lặp lại tốn quá nhiều thời gian mỗi ngày.
                </p>
                <p>
                  Thay vì học lý thuyết hàn lâm, mình chọn cách <strong>học bằng cách làm</strong>: tự ráp các workflow n8n để đăng bài tự động, tự viết prompt để làm kịch bản video và tạo hình ảnh thực tế cho các dự án của mình.
                </p>
                <p>
                  Khi đã có những quy trình chạy ổn định và giải phóng sức người, mình đóng gói lại thành các template hoàn chỉnh trên <strong>Tự Học AI</strong> để bạn chỉ cần tải về, import là chạy được ngay mà không cần biết viết code.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Trò Chuyện Cùng Mình Qua Zalo</span>
                </a>

                <Link
                  href="/bai-viet"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold border border-slate-300 dark:border-white/10 transition-colors"
                >
                  <span>Xem Các Hướng Dẫn Mới</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
