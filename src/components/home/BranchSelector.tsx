'use client';

import { Sparkles, ArrowRight, Sprout, Briefcase, Clapperboard, Gift } from 'lucide-react';

export interface BranchOption {
  id: 'beginner' | 'office' | 'creator';
  iconType: 'beginner' | 'office' | 'creator';
  badge: string;
  badgeColor: string;
  title: string;
  desc: string;
  giftTitle: string;
  giftDesc: string;
  ctaText: string;
}

export const BRANCHES: BranchOption[] = [
  {
    id: 'beginner',
    iconType: 'beginner',
    badge: 'DÀNH CHO NGƯỜI MỚI',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
    title: 'Mình mới bắt đầu với AI',
    desc: 'Chưa biết bắt đầu từ đâu, muốn làm quen với AI từng bước thực tế, dễ hiểu, không cần biết kỹ thuật lập trình.',
    giftTitle: 'Lộ trình 7 ngày làm quen AI cho người mới (0đ)',
    giftDesc: 'Cẩm nang từng bước giúp bạn hiểu bản chất AI, cách đặt câu hỏi chuẩn để có kết quả ngay mà không cần biết kỹ thuật.',
    ctaText: 'Nhận Lộ Trình Cho Người Mới',
  },
  {
    id: 'office',
    iconType: 'office',
    badge: 'DÂN VĂN PHÒNG & KINH DOANH',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-cyan-400 border-blue-500/25',
    title: 'Mình làm văn phòng / cá nhân',
    desc: 'Muốn tự động hóa công việc lặp lại, tăng tốc xử lý email, soạn thảo văn bản và tóm tắt biên bản họp.',
    giftTitle: '15 Prompt Văn Phòng Khởi Động (Bản Rút Gọn 0đ)',
    giftDesc: 'Gồm 15 prompt cơ bản giúp bạn thử nghiệm soạn thảo email, xử lý bảng biểu và tóm tắt cuộc họp. (Bản Full 50+ prompt nâng cao có phí 69k bên dưới).',
    ctaText: 'Nhận Bản Rút Gọn 0đ',
  },
  {
    id: 'creator',
    iconType: 'creator',
    badge: 'CREATOR & XÂY KÊNH',
    badgeColor: 'bg-amber-500/10 text-amber-500 dark:text-amber-300 border-amber-500/25',
    title: 'Mình làm nội dung / xây kênh',
    desc: 'Sản xuất video ngắn bán hàng, viết kịch bản giữ chân người xem và tạo hình ảnh thương mại bằng AI.',
    giftTitle: 'Túi quà 30 Prompt FLUX & Kịch bản mẫu (Bản Khởi Động 0đ)',
    giftDesc: 'Kho 30 prompt tạo ảnh chân dung thương mại và mẫu kịch bản phân cảnh 3s đầu cho video TikTok & Reels.',
    ctaText: 'Nhận Túi Quà Creator',
  },
];

function BranchIcon({ type }: { type: 'beginner' | 'office' | 'creator' }) {
  if (type === 'beginner') {
    return (
      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 group-hover:bg-emerald-500/15 transition-all shadow-inner">
        <Sprout className="w-6 h-6" />
      </div>
    );
  }
  if (type === 'office') {
    return (
      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-600 dark:text-cyan-400 group-hover:scale-105 group-hover:bg-blue-500/15 transition-all shadow-inner">
        <Briefcase className="w-6 h-6" />
      </div>
    );
  }
  return (
    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 dark:text-amber-300 group-hover:scale-105 group-hover:bg-amber-500/15 transition-all shadow-inner">
      <Clapperboard className="w-6 h-6" />
    </div>
  );
}

interface BranchSelectorProps {
  onSelectBranch: (branch: BranchOption) => void;
  activeBranchId?: string;
}

export default function BranchSelector({ onSelectBranch, activeBranchId }: BranchSelectorProps) {
  return (
    <section id="phan-nhanh" className="py-6 sm:py-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            CHỌN ĐÚNG LỘ TRÌNH PHÙ HỢP
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Bạn Đang Ở Đâu Trong Hành Trình AI?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Chọn nhánh nhu cầu gần nhất với bạn để nhận đúng bộ tài nguyên và hướng dẫn thực hành phù hợp nhất.
          </p>
        </div>

        {/* 3 Large Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {BRANCHES.map((b) => {
            const isSelected = activeBranchId === b.id;
            return (
              <div
                key={b.id}
                className={`bento-card group flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111116] border-2 transition-all duration-300 ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-xl dark:bg-[#151520]'
                    : 'border-slate-200 dark:border-white/10 hover:border-indigo-500/50 hover:shadow-xl'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <BranchIcon type={b.iconType} />
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${b.badgeColor}`}>
                      {b.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                      {b.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {b.desc}
                    </p>
                  </div>

                  {/* Quà tặng tương ứng */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] space-y-1">
                    <p className="text-[11px] font-mono font-bold text-indigo-600 dark:text-cyan-400 uppercase flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400 shrink-0" />
                      <span>Quà tặng kèm theo:</span>
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {b.giftTitle}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      {b.giftDesc}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-5 mt-auto">
                  <button
                    type="button"
                    onClick={() => onSelectBranch(b)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold bg-slate-100 dark:bg-white/[0.06] hover:bg-gradient-to-r hover:from-indigo-700 hover:to-blue-600 hover:text-white text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-white/10 group-hover:border-transparent transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    <span>{b.ctaText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
