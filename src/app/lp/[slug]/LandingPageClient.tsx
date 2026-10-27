'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Gift,
  ArrowRight,
  Star,
  Users,
  Copy,
  Check,
  QrCode,
  Download,
  Cpu,
  FileCheck,
  ChevronDown
} from 'lucide-react';

interface Props {
  lp: any;
}

export default function LandingPageClient({ lp }: Props) {
  // Countdown Timer state (14:59)
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59);

  // Checkout Modal State
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderResult, setOrderResult] = useState<any | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val || 0) + ' đ';
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdering(true);
    try {
      // Đọc cookie affiliate nếu có
      let affRef: string | null = null;
      if (typeof window !== 'undefined') {
        affRef = localStorage.getItem('tuhocai_aff_ref');
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: lp.product_id || lp.id,
          customerName: checkoutForm.name,
          customerEmail: checkoutForm.email,
          customerPhone: checkoutForm.phone,
          affiliateRef: affRef,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Lỗi đặt hàng');
      } else {
        setOrderResult(data);
      }
    } catch (err: any) {
      alert('Lỗi đặt hàng: ' + err.message);
    } finally {
      setIsOrdering(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-100 selection:bg-indigo-600 selection:text-white transition-colors duration-200">
      
      {/* Top Countdown Urgency Bar */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-between border-b border-indigo-700/50 shadow-md">
        <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] sm:text-xs">ƯU ĐÃI ĐẶC BIỆT HÔM NAY:</span>
            <span className="hidden sm:inline text-slate-300">Tiết kiệm 80% chỉ còn {formatCurrency(lp.price)}</span>
          </div>

          <div className="flex items-center gap-2 font-mono font-bold">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 bg-black/40 px-2 py-0.5 rounded border border-amber-400/30">
              {formatTimer(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">

        {/* HERO SECTION */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-900 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-500/30 text-xs sm:text-sm font-bold">
            <Sparkles className="w-4 h-4 text-amber-500" />
            {lp.hero_badge || '✦ QUY TRÌNH THỰC CHIẾN ĐỘC QUYỀN TỰ HỌC AI'}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto text-slate-900 dark:text-white">
            {lp.headline}
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {lp.subheadline}
          </p>

          {/* Price & Primary CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-600 shadow-xl flex items-center gap-4">
              <div className="text-left">
                <div className="text-xs text-slate-400 line-through font-mono">
                  Giá gốc: {formatCurrency(lp.original_price)}
                </div>
                <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                  {formatCurrency(lp.price)}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-xs font-black uppercase">
                GIẢM 80%
              </span>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-950 hover:opacity-90 text-white font-black text-base sm:text-lg shadow-xl shadow-indigo-900/30 border-2 border-indigo-500 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <Zap className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              {lp.cta_text || '⚡ NHẬN QUY TRÌNH NGAY'}
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-2 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Kích hoạt tự động qua VietQR
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-500" />
              1.500+ học viên đã sở hữu
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              Đánh giá 4.9/5 sao
            </span>
          </div>
        </div>

        {/* WORKFLOW SHOWCASE BOX */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 shadow-2xl">
          <div className="space-y-4 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              KIẾN TRÚC TỰ ĐỘNG HÓA HOÀN CHỈNH
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tất cả những gì bạn cần: Cắm vào là chạy, không cần viết lại từ đầu!
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Toàn bộ các file Workflow JSON mẫu, tài liệu hướng dẫn từng bước và mã kết nối API đã được đóng gói sẵn. Bạn chỉ cần tải về, nhấn nút Import vào n8n là hệ thống bắt đầu tự hoạt động.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
              <div className="font-bold text-amber-400 text-sm">✓ Tiết kiệm 4-5 tiếng mỗi ngày</div>
              <div className="text-xs text-slate-300">Không còn phải ngồi gõ từng bài viết hay lên lịch thủ công.</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
              <div className="font-bold text-cyan-400 text-sm">✓ Chi phí vận hành gần như 0đ</div>
              <div className="text-xs text-slate-300">Sử dụng n8n bản tự host hoàn toàn miễn phí, không mất phí hàng tháng.</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
              <div className="font-bold text-emerald-400 text-sm">✓ Báo cáo về Telegram tức thì</div>
              <div className="text-xs text-slate-300">Kiểm tra kết quả đăng bài trực tiếp ngay trên điện thoại của bạn.</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
              <div className="font-bold text-purple-400 text-sm">✓ Nhóm Zalo hỗ trợ kỹ thuật 1-1</div>
              <div className="text-xs text-slate-300">Được admin và đội ngũ Tự Học AI trực tiếp giải đáp mọi thắc mắc.</div>
            </div>
          </div>
        </div>

        {/* 4 CORE FEATURES */}
        {lp.features && lp.features.length > 0 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
                Tính Năng Vượt Trội Của Hệ Thống
              </h2>
              <p className="text-sm text-slate-500">
                Xây dựng bởi đội ngũ Tự Học AI để tối ưu hóa tỷ lệ chuyển đổi và giải phóng sức lao động
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {lp.features.map((feat: any, idx: number) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5 hover:border-indigo-500 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
                    0{idx + 1}
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {feat.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULES BREAKDOWN */}
        {lp.modules && lp.modules.length > 0 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
                Nội Dung Chi Tiết Bạn Sẽ Nhận Được
              </h2>
              <p className="text-sm text-slate-500">
                Lộ trình 4 bước đi từ người mới bắt đầu đến khi hệ thống tự động hoàn toàn
              </p>
            </div>

            <div className="space-y-3">
              {lp.modules.map((m: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4"
                >
                  <div className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-mono font-black text-xs shrink-0">
                    BƯỚC {m.step || idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {m.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BONUS ITEMS */}
        {lp.bonus_items && lp.bonus_items.length > 0 && (
          <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-indigo-500/10 border-2 border-amber-400/40 space-y-5">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <Gift className="w-5 h-5" />
              QUÀ TẶNG KÈM ĐẶC QUYỀN (CHỈ CÓ TRONG HÔM NAY)
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Bạn Sẽ Nhận Thêm Toàn Bộ Bộ Quà Tặng Trị Giá 1.200.000đ Này:
            </h3>

            <div className="space-y-3">
              {lp.bonus_items.map((bonus: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{bonus}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TESTIMONIALS */}
        {lp.testimonials && lp.testimonials.length > 0 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
                Học Viên & Khách Hàng Nói Gì?
              </h2>
              <p className="text-sm text-slate-500">
                Những người đã áp dụng quy trình n8n và tự động hóa thành công
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {lp.testimonials.map((testi: any, idx: number) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                >
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                    "{testi.comment}"
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <img
                      src={testi.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${idx}`}
                      alt={testi.name}
                      className="w-10 h-10 rounded-full border border-slate-300"
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{testi.name}</div>
                      <div className="text-xs text-slate-400">{testi.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM FINAL CALL TO ACTION */}
        <div className="text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white border-2 border-indigo-500/50 shadow-2xl space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black">
            Bắt Đầu Tự Động Hóa Công Việc Của Bạn Ngay Hôm Nay!
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Chỉ với chi phí bằng 1 bữa ăn sáng ({formatCurrency(lp.price)}), bạn sở hữu vĩnh viễn quy trình giúp bạn tiết kiệm hàng trăm giờ lao động mỗi tháng.
          </p>

          <button
            onClick={() => setShowCheckout(true)}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:opacity-95 text-slate-950 font-black text-lg shadow-xl shadow-amber-500/30 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <Zap className="w-5 h-5 text-slate-950" />
            {lp.cta_text || '⚡ NHẬN QUY TRÌNH NGAY'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* STICKY BOTTOM BAR */}
      <div className="sticky bottom-0 z-40 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md border-t-2 border-slate-200 dark:border-slate-800 p-3 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400 line-through">Gốc: {formatCurrency(lp.original_price)}</div>
            <div className="text-lg sm:text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
              {formatCurrency(lp.price)}
            </div>
          </div>

          <button
            onClick={() => setShowCheckout(true)}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base shadow-md transition flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Đăng Ký Ngay
          </button>
        </div>
      </div>

      {/* 1-CLICK CHECKOUT MODAL */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  Đăng Ký & Nhận Quy Trình
                </h3>
                <p className="text-xs text-slate-500">Mở khóa tức thì qua mã VietQR tự động</p>
              </div>
              <button
                onClick={() => {
                  setShowCheckout(false);
                  setOrderResult(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {!orderResult ? (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-1">
                  <div className="font-bold text-indigo-900 dark:text-indigo-300">
                    Sản phẩm: {lp.title}
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Số tiền thanh toán:</span>
                    <strong className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                      {formatCurrency(lp.price)}
                    </strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Họ và tên của bạn <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={checkoutForm.name}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Email nhận tài liệu & link tải <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={checkoutForm.email}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                    placeholder="email@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Số điện thoại / Zalo (hỗ trợ kích hoạt)
                  </label>
                  <input
                    type="tel"
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                    placeholder="0938.494.303"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isOrdering}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
                >
                  {isOrdering ? 'Đang tạo đơn hàng...' : 'Tiếp Tục Thanh Toán VietQR'}
                </button>
              </form>
            ) : (
              /* VietQR Display State */
              <div className="space-y-4 text-center animate-in zoom-in-95">
                <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-inner flex justify-center">
                  <img
                    src={orderResult.vietQrUrl}
                    alt="VietQR Checkout"
                    className="w-60 h-auto rounded-lg"
                  />
                </div>

                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    Mã đơn hàng: <span className="font-mono text-indigo-600">{orderResult.orderCode}</span>
                  </div>
                  <div>Số tiền: <strong className="text-emerald-600 text-base">{formatCurrency(orderResult.bankInfo?.amount)}</strong></div>
                  <div>Nội dung chuyển khoản: <strong className="font-mono text-indigo-600 select-all">{orderResult.orderCode}</strong></div>
                  <div className="text-slate-400 text-[11px] pt-1">
                    Ngay khi chuyển khoản thành công, hệ thống tự động duyệt và mở khóa link tải qua email!
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(orderResult.orderCode)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                  >
                    {copiedCode ? 'Đã copy mã!' : 'Copy nội dung CK'}
                  </button>
                  <button
                    onClick={() => {
                      setShowCheckout(false);
                      setOrderResult(null);
                    }}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Đã Chuyển Khoản Xong
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
