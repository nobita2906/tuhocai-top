'use client';

import { useState, useEffect } from 'react';
import {
  Share2,
  Copy,
  Check,
  Sparkles,
  FileText,
  DollarSign,
  Gift,
  ExternalLink,
  X,
  CheckCircle2,
} from 'lucide-react';

interface ReferralShareCardProps {
  courseSlug: string;
  courseTitle: string;
  coursePrice: number;
  isUnlocked: boolean;
}

export default function ReferralShareCard({
  courseSlug,
  courseTitle,
  coursePrice,
  isUnlocked,
}: ReferralShareCardProps) {
  const [refCode, setRefCode] = useState<string>('');
  const [partnerRate, setPartnerRate] = useState<number>(60);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [marketingKits, setMarketingKits] = useState<any[]>([]);
  const [copiedKitId, setCopiedKitId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/referral')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.partner) {
          setRefCode(d.partner.code);
          setPartnerRate(Number(d.partner.commissionRate) || 60);
          setMarketingKits(d.marketingKits || []);
        }
      })
      .catch(() => {});
  }, []);

  if (!refCode || coursePrice <= 0) return null;

  // Mức chiết khấu hoa hồng: tùy chỉnh theo partner, mặc định 60%
  const rate = partnerRate || 60;
  const commissionAmount = Math.round((coursePrice * rate) / 100);

  // Đảm bảo tuyệt đối không bao giờ dính localhost khi tạo link chia sẻ cho học viên
  let origin = process.env.NEXT_PUBLIC_APP_URL || 'https://www.tuhocai.top';
  if (origin.includes('localhost')) {
    origin = 'https://www.tuhocai.top';
  }
  const cleanOrigin = origin.replace(/\/+$/, '');

  let shareUrl = `${cleanOrigin}/san-pham/${courseSlug}?ref=${refCode}`;
  if (courseSlug === 'video-ai-tu-1-anh') {
    shareUrl = `${cleanOrigin}/lp/video-ai-tu-1-anh?ref=${refCode}`;
  } else if (courseSlug === 'video-drama-gia-dinh-nho') {
    shareUrl = `${cleanOrigin}/lp/video-drama-gia-dinh-nho?ref=${refCode}`;
  } else if (courseSlug === 'sao-chep-landing-page') {
    shareUrl = `${cleanOrigin}/lp/sao-chep-landing-page?ref=${refCode}`;
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyKit = (kit: any) => {
    // Replace target link in kit with this specific course link
    let customized = kit.content;
    const linkRegex = /https?:\/\/[^\s]+/g;
    customized = customized.replace(linkRegex, shareUrl);

    navigator.clipboard.writeText(customized);
    setCopiedKitId(kit.id);
    setTimeout(() => setCopiedKitId(null), 2500);
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-[#0b0e1e] text-white p-6 sm:p-8 shadow-2xl border-2 border-indigo-700/50 space-y-6">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Top Bar: Badge Chip + CTA Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-bold border border-indigo-400/30 shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              CHƯƠNG TRÌNH ĐỐI TÁC CHIẾN LƯỢC TỰ HỌC AI • ĐẶC QUYỀN {rate}%
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-950/40 transition-all shrink-0 active:scale-[0.98] border border-amber-600/30"
            >
              <FileText className="w-4 h-4 text-slate-950" />
              Lấy Bộ Content Đăng Bài Có Sẵn
            </button>
          </div>

          {/* Main Headline & Persuasive Caption */}
          <div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Học Xong Kiếm Tiền Cùng{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-200 to-cyan-300">
                Tự Học AI
              </span>
            </h3>

            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              Nhận ngay hoa hồng thực chiến{' '}
              <strong className="text-amber-400 font-black">
                +{new Intl.NumberFormat('vi-VN').format(commissionAmount)} đ ({rate}%)
              </strong>{' '}
              trên mỗi đơn hàng giới thiệu khóa học này. Chỉ cần chia sẻ cho{' '}
              <strong className="text-cyan-300 font-bold">2 người bạn</strong> cùng mua là bạn đã hoàn lại{' '}
              <strong className="text-emerald-400 font-black">120% học phí</strong> (vừa học không mất tiền vừa có thêm nguồn thu nhập thụ động bền vững). Tiền về VietQR tự động trong 24h!
            </p>
          </div>

          {/* 4 Khối Chỉ Số Vàng Chuẩn Style Affiliate */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                +{new Intl.NumberFormat('vi-VN').format(commissionAmount)} đ
              </div>
              <div className="text-xs text-slate-300 mt-0.5">Tiền thưởng / 1 đơn</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">
                {rate}% Hoa Hồng
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Mức thưởng trọn đời
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                Hoàn 120%
              </div>
              <div className="text-xs text-slate-300 mt-0.5">Chỉ cần 2 bạn mua cùng</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-black text-indigo-300 font-mono">
                VietQR 24h
              </div>
              <div className="text-xs text-slate-300 mt-0.5">Rút thẳng về ngân hàng</div>
            </div>
          </div>

          {/* Link Box & 1-Click Copy */}
          <div className="pt-2">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/15 backdrop-blur-md flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full flex items-center gap-2 px-3 py-1.5">
                <span className="text-xs text-slate-400 shrink-0 font-medium hidden sm:inline">
                  Link giới thiệu của bạn:
                </span>
                <span className="font-mono text-xs sm:text-sm text-cyan-300 truncate select-all">
                  {shareUrl}
                </span>
              </div>

              <button
                onClick={handleCopyLink}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shrink-0 shadow-lg active:scale-[0.98] ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-emerald-950/30'
                    : 'bg-white hover:bg-slate-100 text-slate-950 shadow-white/10'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    ĐÃ SAO CHÉP LINK!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-950" />
                    Sao chép link chia sẻ
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 5 BÀI VIẾT CONTENT MẪU CÓ SẴN */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-300 dark:border-white/20 shadow-2xl p-6 sm:p-8 max-h-[90vh] flex flex-col text-left">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-indigo-800 dark:text-cyan-400 uppercase">
                  // BỘ KIT CONTENT ĐĂNG BÀI THỰC CHIẾN
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  5 Mẫu Bài Viết Đăng Mạng Xã Hội (Nhận {rate}% Hoa Hồng)
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of 5 Content Templates */}
            <div className="flex-1 overflow-y-auto py-4 space-y-6 divide-y divide-slate-200 dark:divide-white/[0.08]">
              {marketingKits.map((kit) => (
                <div key={kit.id} className="pt-4 first:pt-0 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        {kit.title}
                      </h4>
                      <p className="text-xs text-slate-700 dark:text-slate-400 font-mono">
                        Đăng trên: <strong className="text-indigo-800 dark:text-cyan-400">{kit.platform}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyKit(kit)}
                      className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 shadow-xs ${
                        copiedKitId === kit.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-700 hover:bg-indigo-600 text-white'
                      }`}
                    >
                      {copiedKitId === kit.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Đã copy bài viết!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          1-Click Sao Chép Bài Này
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-slate-200 font-mono whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                    {kit.content.replace(/https?:\/\/[^\s]+/g, shareUrl)}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-700 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                Hệ thống tự động gắn link giới thiệu cá nhân của bạn vào bài viết khi sao chép.
              </span>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-white/10 text-slate-900 dark:text-slate-200 font-bold transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

