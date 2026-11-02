'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  UserCheck,
  Share2,
  Wallet,
  CheckCircle2,
  TrendingUp,
  Coins,
  ShieldCheck,
  Clock,
  FileText,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  MessageCircle,
  Zap,
  Gift,
  Bot,
  Globe,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';

interface AffiliateGuideSectionProps {
  onGoToRegister: () => void;
  onGoToDashboard: () => void;
  onGoToToolkit?: () => void;
  isLoggedIn: boolean;
  userEmail?: string;
  userCode?: string;
}

export default function AffiliateGuideSection({
  onGoToRegister,
  onGoToDashboard,
  onGoToToolkit,
  isLoggedIn,
  userEmail,
  userCode,
}: AffiliateGuideSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Đăng ký làm đối tác Affiliate có khác gì với tạo tài khoản học viên không?',
      a: 'Chính là một! Tại Tự Học AI, chương trình Đăng ký làm đối tác cũng chính là Tạo tài khoản thành viên trong hệ thống. Chỉ với một tài khoản duy nhất, bạn vừa có thể học tập, vừa tự động được kích hoạt đặc quyền đối tác CTV với mức hoa hồng 60% trọn đời mà không cần đăng ký 2 nơi hay chờ xét duyệt.',
    },
    {
      q: 'Nếu khách hàng bấm vào link quà tặng 0đ hoặc sản phẩm A nhưng sau đó lại mua sản phẩm B thì tôi có được tính hoa hồng không?',
      a: 'Hoàn toàn CÓ 100%! Cookie đối tác của Tự Học AI có phạm vi áp dụng trên TOÀN BỘ WEBSITE (Global Tracking). Dù khách bấm vào link bất kỳ của bạn (kể cả link bài viết tin tức hay quà tặng miễn phí 0đ), mã giới thiệu sẽ được lưu trên trình duyệt suốt 30 ngày. Trong 30 ngày đó, khách phát sinh mua bất kỳ sản phẩm nào trên web, hệ thống đều tự động nhận diện và chia đủ 60% hoa hồng cho bạn.',
    },
    {
      q: 'Tôi chưa biết gì về AI hoặc chưa từng làm Affiliate thì có kiếm tiền được không?',
      a: 'Hoàn toàn được! Bạn không cần biết kỹ thuật hay lập trình. Tự Học AI cung cấp sẵn 100% bộ tài nguyên tiếp thị (Media Kit): video review mẫu, kịch bản video TikTok 30s, bài đăng Facebook và tin nhắn Zalo. Bạn chỉ cần copy - paste kèm link giới thiệu là đã có thể ra đơn ngay.',
    },
    {
      q: 'Đăng ký tham gia chương trình đối tác có mất khoản phí nào không?',
      a: 'Hoàn toàn MIỄN PHÍ 100%! Không có phí gia nhập, không phí duy trì tài khoản hàng tháng, không yêu cầu cọc tiền hay mua sản phẩm bắt buộc.',
    },
    {
      q: 'Quy chế lưu Cookie 30 ngày và cơ chế bảo vệ kép hoạt động như thế nào?',
      a: 'Khi một người bấm vào link giới thiệu của bạn, hệ thống sẽ lưu mã giới thiệu song song vào cả HTTP Cookie (30 ngày) và HTML5 LocalStorage. Dù khách hàng duyệt web qua trình duyệt ứng dụng Zalo, Facebook hay Safari trên điện thoại, hệ thống vẫn giữ nguyên mã ref và tự động ghi nhận hoa hồng khi họ đặt mua.',
    },
    {
      q: 'Tiền hoa hồng được thanh toán như thế nào và bao lâu thì nhận được?',
      a: 'Bất cứ khi nào số dư hoa hồng khả dụng đạt từ 200.000 đ, bạn chỉ cần bấm nút "Yêu cầu rút tiền" trong Bảng điều khiển. Hệ thống sẽ chuyển khoản tự động qua VietQR về tài khoản ngân hàng của bạn trong vòng 24 giờ làm việc. Tuyệt đối không giam vốn, không trừ phí.',
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* 1. THÔNG BÁO QUAN TRỌNG: 1 TÀI KHOẢN DUY NHẤT */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/90 via-indigo-950 to-slate-900 border-2 border-indigo-500/50 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold font-mono border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              CHÍNH SÁCH ĐỒNG BỘ 1 TÀI KHOẢN DUY NHẤT
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Đăng Ký Làm Đối Tác Cũng Chính Là Tạo Tài Khoản Trong Hệ Thống Tự Học AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bạn không cần đăng ký 2 nơi hay chờ duyệt hồ sơ rườm rà. Chỉ cần <strong>tạo tài khoản thành viên (30 giây)</strong>, hệ thống tự động cấp riêng cho bạn <strong>Mã giới thiệu độc quyền</strong> và kích hoạt mức <strong>hoa hồng thực chiến 60% trọn đời</strong>!
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto">
            {isLoggedIn ? (
              <button
                onClick={onGoToDashboard}
                className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-950/40 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <TrendingUp className="w-4 h-4 text-slate-950" />
                Vào Bảng Điều Khiển Của Bạn
              </button>
            ) : (
              <>
                <button
                  onClick={onGoToRegister}
                  className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-950/40 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <UserCheck className="w-4 h-4 text-slate-950" />
                  Tạo Tài Khoản Đối Tác (30s)
                </button>
                <Link
                  href="/login"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-center font-bold text-xs border border-white/20 transition-all whitespace-nowrap"
                >
                  Đã Có Tài Khoản? Đăng Nhập
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. QUY TRÌNH 3 BƯỚC THAM GIA AFFILIATE */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
            {'// QUY TRÌNH BẮT ĐẦU DỄ DÀNG'}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            3 Bước Bắt Đầu Kiếm Thu Nhập Thụ Động Ngay Hôm Nay
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Từ lúc tạo tài khoản đến khi có đơn hàng đầu tiên chỉ mất chưa đầy 15 phút
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bước 1 */}
          <div className="bento-card p-6 sm:p-7 space-y-4 border-2 border-slate-300 dark:border-white/15 flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-cyan-300 font-mono font-black text-lg flex items-center justify-center border border-indigo-300 dark:border-indigo-500/30">
                  01
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold font-mono">
                  MIỄN PHÍ 100%
                </span>
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                Tạo Tài Khoản Tự Học AI
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Đăng ký tài khoản thành viên chỉ mất 30 giây bằng Họ tên, Email và Mật khẩu. Bạn được cấp ngay <strong>Mã Ref độc quyền</strong> và tự động kích hoạt mức chiết khấu <strong>60% hoa hồng</strong>.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400">
                💡 <em>Nếu đã từng mua khóa học, bạn chỉ cần Đăng nhập là xong!</em>
              </div>
            </div>

            <button
              onClick={isLoggedIn ? onGoToDashboard : onGoToRegister}
              className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <span>{isLoggedIn ? 'Xem tài khoản của tôi' : 'Đăng ký tài khoản ngay'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bước 2 */}
          <div className="bento-card p-6 sm:p-7 space-y-4 border-2 border-slate-300 dark:border-white/15 flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono font-black text-lg flex items-center justify-center border border-amber-300 dark:border-amber-500/30">
                  02
                </span>
                <span className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 text-[10px] font-bold font-mono">
                  CÓ SẴN CONTENT
                </span>
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                Lấy Link Ref & Mẫu Bài Viết
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Vào tab <strong>Bảng Điều Khiển</strong> hoặc <strong>Media Kit</strong> để sao chép link cá nhân. Bạn có thể lấy link Trang chủ, link từng Khóa học hoặc link tặng <strong>Tài liệu 0đ</strong> để hút khách.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400">
                📁 <em>Tự Học AI có sẵn 100% kịch bản video TikTok, bài Facebook & tin nhắn Zalo.</em>
              </div>
            </div>

            <button
              onClick={() => {
                if (onGoToToolkit) {
                  onGoToToolkit();
                } else {
                  const toolkitBtn = document.querySelector('[data-tab="toolkit"]') as HTMLElement;
                  if (toolkitBtn) toolkitBtn.click();
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-500/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Xem kho Content & Media Kit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bước 3 */}
          <div className="bento-card p-6 sm:p-7 space-y-4 border-2 border-slate-300 dark:border-white/15 flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-black text-lg flex items-center justify-center border border-emerald-300 dark:border-emerald-500/30">
                  03
                </span>
                <span className="px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 text-[10px] font-bold font-mono">
                  TIỀN VỀ VIETQR
                </span>
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                Chia Sẻ & Nhận Tiền Tự Động
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Đăng bài lên Facebook, TikTok, Zalo hoặc gửi nhóm bạn bè. Khách bấm vào link được lưu <strong>Cookie 30 ngày</strong>. Bất cứ khi nào họ mua hàng, hoa hồng 60% tự động cộng vào tài khoản của bạn.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400">
                💸 <em>Rút tiền từ 200k về VietQR trong 24h, Bot Telegram báo đơn tức thì.</em>
              </div>
            </div>

            <a
              href="https://zalo.me/g/tuhocai"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Tham gia nhóm Zalo hướng dẫn</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. BẢNG MÔ PHỎNG THU NHẬP THỰC TẾ */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border-2 border-indigo-500/30 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 mb-1">
              <Coins className="w-4 h-4" />
              BẢNG MÔ PHỎNG THU NHẬP THỰC TẾ
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Bạn Có Thể Kiếm Được Bao Nhiêu Cùng Tự Học AI?
            </h3>
          </div>
          <div className="px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-mono font-bold shrink-0">
            Mức hoa hồng: 60% trọn đời
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-xs text-slate-400 font-mono">Cấp độ Khởi Động</span>
            <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
              ~5.340.000 đ
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Chỉ <strong>1 đơn/ngày</strong> (Khóa Video AI 1 Ảnh 297k). Nhận ngay <strong>178.200 đ/đơn</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-xs text-slate-400 font-mono">Cấp độ Thực Chiến</span>
            <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">
              ~16.000.000 đ
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Khoảng <strong>3 đơn/ngày</strong> (Khóa học + Workflow n8n). Đăng 1 video TikTok ngắn mỗi ngày.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-xs text-slate-400 font-mono">Cấp độ Chuyên Nghiệp</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
              ~26.700.000 đ
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Khoảng <strong>5 đơn/ngày</strong> khi kênh video AI của bạn bắt đầu lên xu hướng triệu view.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-400/30 space-y-2">
            <span className="text-xs text-indigo-300 font-mono font-bold">Chiến lược Hút Lead 0đ</span>
            <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
              Bền Vững
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tặng bộ tài liệu 0đ để thu hút hàng trăm data. Nhận hoa hồng 60% trọn đời khi họ nâng cấp bất kỳ lúc nào!
            </p>
          </div>
        </div>
      </div>

      {/* 4. 6 ĐẶC QUYỀN VƯỢT TRỘI */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
            {'// ĐẶC QUYỀN ĐỐI TÁC'}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Vì Sao Bạn Nên Làm Đối Tác Cùng Tự Học AI?
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/10 space-y-2.5 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
              <Coins className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">Hoa Hồng Khủng 60%</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Mức chia sẻ doanh thu cao nhất trên thị trường công cụ AI và tự động hóa. Bán 1 đơn nhận phần lớn lợi nhuận ròng.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/10 space-y-2.5 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">Lưu Cookie 30 Ngày</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Khách bấm link hôm nay nhưng vài tuần sau mới quyết định mua hàng, hệ thống vẫn ghi nhận doanh số và cộng tiền cho bạn.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/10 space-y-2.5 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">Sẵn 100% Content Mẫu</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Không cần vắt óc viết bài hay tự quay video. Có sẵn trọn bộ kịch bản video TikTok 30s, bài đăng Facebook và tin nhắn Zalo chốt đơn.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/10 space-y-2.5 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">Rút Tiền Nhanh VietQR 24h</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Ngưỡng rút tiền cực thấp chỉ từ 200.000 đ. Yêu cầu rút tiền được xử lý tự động về tài khoản ngân hàng trong vòng 24 giờ.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/10 space-y-2.5 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">Báo Đơn Realtime Telegram</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Minh bạch tuyệt đối. Ngay khi có khách đặt mua hoặc thanh toán thành công, Bot Telegram lập tức bắn thông báo chúc mừng tới bạn.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/10 space-y-2.5 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">Nhóm Zalo VIP Đồng Hành</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Được Admin Nguyễn Đăng và đội ngũ hỗ trợ 1-1, chia sẻ kinh nghiệm chạy video AI, xây kênh TikTok và mẹo chuyển đổi ra đơn thực tế.
            </p>
          </div>
        </div>
      </div>

      {/* 5. NGUYÊN TẮC & QUY ĐỊNH TÍNH HOA HỒNG CHI TIẾT (MINH BẠCH 100%) */}
      <div className="space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
            {'// CHÍNH SÁCH MINH BẠCH 100%'}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Nguyên Tắc & Quy Định Tính Hoa Hồng Cho Đối Tác (CTV)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Mọi thao tác giới thiệu, lưu vết cookie và chia sẻ doanh thu đều được tự động hóa bằng code minh bạch, bảo vệ tối đa quyền lợi của anh em đối tác.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Quy tắc 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-cyan-300 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider">Nguyên Tắc 01</span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Cookie Toàn Trang (Global Tracking)
                </h4>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Khách vào từ <strong>bất kỳ link nào</strong> (Trang chủ, Quà tặng 0đ, Bài viết blog hay Khóa học A), cookie <code className="text-indigo-600 dark:text-cyan-300 font-mono text-xs bg-indigo-50 dark:bg-indigo-950/60 px-1 py-0.5 rounded">tuhocai_aff_ref</code> đều được kích hoạt cho toàn bộ website. Trong suốt <strong>30 ngày</strong>, nếu khách mua <strong>bất kỳ sản phẩm nào khác</strong> (Sản phẩm B, C...), hệ thống đều tự động nhận diện và tính <strong>60% hoa hồng</strong> cho bạn.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Không giới hạn sản phẩm — Khách mua món nào cũng được tính!</span>
            </div>
          </div>

          {/* Quy tắc 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Nguyên Tắc 02</span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Bảo Vệ Kép (Cookie + LocalStorage)
                </h4>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Để phòng ngừa trường hợp khách mở link trong các ứng dụng mạng xã hội (trình duyệt in-app của Zalo, Facebook, TikTok) có thể chặn cookie, hệ thống của Tự Học AI lưu trữ đồng thời trên cả <strong>HTTP Cookie (30 ngày)</strong> lẫn <strong>HTML5 LocalStorage</strong>. Khi khách thanh toán, hệ thống quét cả 2 nguồn để tỷ lệ khớp đơn đạt <strong>99.9%</strong>.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Chống mất dấu link ref trên mọi thiết bị và trình duyệt</span>
            </div>
          </div>

          {/* Quy tắc 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Nguyên Tắc 03</span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Mô Hình Ghi Nhận Last-Click Công Bằng
                </h4>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Áp dụng theo chuẩn quốc tế <strong>Last-Click Attribution</strong>: Hoa hồng sẽ thuộc về đối tác có link ref được khách hàng click gần nhất trước thời điểm mua hàng. Hoa hồng được tạo ở trạng thái <strong className="text-amber-500 font-mono">PENDING</strong> ngay khi khách đặt đơn, và tự động chuyển sang <strong className="text-emerald-500 font-mono">APPROVED</strong> ngay khi ngân hàng khớp lệnh VietQR.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-indigo-600 dark:text-cyan-400 font-semibold flex items-center gap-1.5">
              <Bot className="w-4 h-4 shrink-0" />
              <span>Bot Telegram tự động báo đơn và khớp tiền trong vài giây</span>
            </div>
          </div>

          {/* Quy tắc 4 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-300 flex items-center justify-center font-bold">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Nguyên Tắc 04</span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Rút Tiền Tự Động VietQR Trong 24h
                </h4>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Ngưỡng rút tiền khả dụng cực kỳ thấp chỉ từ <strong>200.000 đ</strong>. Bất cứ khi nào bạn bấm yêu cầu rút tiền trong Bảng điều khiển, bộ phận tài chính sẽ duyệt và chuyển khoản trực tiếp qua <strong>VietQR 24/7</strong> về tài khoản ngân hàng của bạn trong vòng 24 giờ. <strong>Tuyệt đối không giam vốn, không trừ phí vô lý</strong>.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Thanh toán minh bạch, đúng hẹn vào mọi ngày trong tuần</span>
            </div>
          </div>
        </div>

        {/* Quy định Tiếp thị Lành mạnh & Chống Gian Lận */}
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Quy Định Về Tiếp Thị Lành Mạnh & Chống Gian Lận (Anti-Fraud Policy)
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-white dark:bg-black/30 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
              <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Hành Vi Được Khuyến Khích:
              </div>
              <ul className="space-y-1.5 text-xs list-disc list-inside text-slate-600 dark:text-slate-300 leading-relaxed">
                <li>Chia sẻ bài viết, kịch bản hữu ích trên Facebook cá nhân, Fanpage, Group, Threads.</li>
                <li>Làm video review, hướng dẫn sử dụng công cụ AI trên TikTok, YouTube, Reels.</li>
                <li>Tặng tài liệu miễn phí 0đ để thu hút data khách hàng tiềm năng.</li>
                <li>Chạy quảng cáo Facebook / TikTok / Google dẫn về Landing Page đánh giá của riêng bạn.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-black/30 border border-rose-200 dark:border-rose-900/40 space-y-2">
              <div className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Hành Vi Nghiêm Cấm (Sẽ Khóa Tài Khoản):
              </div>
              <ul className="space-y-1.5 text-xs list-disc list-inside text-slate-600 dark:text-slate-300 leading-relaxed">
                <li>Chạy quảng cáo Google Ads đấu giá trực tiếp từ khóa thương hiệu <em>"Tự Học AI"</em>, <em>"tuhocai.top"</em>.</li>
                <li>Spam link bừa bãi vào phần bình luận của các hội nhóm không liên quan hoặc group của Tự Học AI.</li>
                <li>Cố tình tạo tài khoản ảo hoặc dùng thủ thuật gian lận cookie để trục lợi chính sách.</li>
                <li>Cung cấp thông tin sai lệch về tính năng, giá tiền hoặc quyền lợi sản phẩm.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 6. CÂU HỎI THƯỜNG GẶP (FAQ) */}
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Giải Đáp Thắc Mắc Thường Gặp
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-cyan-300"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-600 dark:text-cyan-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. CALL TO ACTION CUỐI TRANG */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-[#0b0e1e] border-2 border-indigo-500/40 text-center text-white space-y-5 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/15 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Sẵn Sàng Gia Tăng Thu Nhập Cùng Tự Học AI?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Tạo tài khoản thành viên ngay bây giờ để được cấp mã giới thiệu riêng và nhận 60% hoa hồng trọn đời trên mọi đơn hàng!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {isLoggedIn ? (
              <button
                onClick={onGoToDashboard}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-950/40 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Vào Bảng Điều Khiển Của Bạn →</span>
              </button>
            ) : (
              <>
                <button
                  onClick={onGoToRegister}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-950/40 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Tạo Tài Khoản Đối Tác Ngay (30s) →</span>
                </button>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all whitespace-nowrap"
                >
                  Đăng Nhập Nếu Đã Có Tài Khoản
                </Link>
              </>
            )}
            <a
              href="https://zalo.me/g/tuhocai"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-sm border border-emerald-500/40 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Nhóm Zalo VIP</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
