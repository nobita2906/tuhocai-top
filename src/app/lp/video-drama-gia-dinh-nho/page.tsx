'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowDown, 
  Check, 
  Gift, 
  MessageCircle, 
  Copy, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  X,
  FileText,
  Video,
  FolderDown,
  ShieldCheck,
  Mail,
  Zap,
  Smartphone,
  Flame,
  ChevronRight
} from 'lucide-react';
import { trackLandingPageView, trackLandingPageCtaClick, getStoredUtm } from '@/lib/funnelTracker';

export default function VideoDramaLandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  
  // Checkout form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Countdown timer 14:59 for urgency
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 14 * 60 + 59));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // VietQR VIB 69K
  const qrUrl = "https://img.vietqr.io/image/VIB-0934434101-compact2.png?amount=69000&addInfo=1%20ly%20tra%20sua&accountName=NGUYEN%20VAN%20DANG";

  // Funnel & Affiliate tracking
  useEffect(() => {
    trackLandingPageView('video-drama-gia-dinh-nho');

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        localStorage.setItem('tuhocai_aff_ref', ref);
        fetch('/api/affiliate/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ref, landingPath: '/lp/video-drama-gia-dinh-nho' }),
        }).catch(() => {});
      }
    }
  }, []);

  const handleOpenCheckout = () => {
    trackLandingPageCtaClick('video-drama-gia-dinh-nho');
    setFormError('');
    setModalOpen(true);
  };

  const handleCopy = (text: string, type: 'bank' | 'amount' | 'content') => {
    navigator.clipboard.writeText(text);
    if (type === 'bank') {
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    } else if (type === 'amount') {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    } else {
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    }
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanEmail = customerEmail.trim().toLowerCase();
    const cleanPhone = customerPhone.replace(/\s+/g, '').trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setFormError('Email không đúng định dạng. Vui lòng nhập email hợp lệ (VD: name@gmail.com)');
      return;
    }

    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setFormError('Số điện thoại phải bao gồm đúng 10 chữ số (bắt đầu bằng 0, VD: 0912345678)');
      return;
    }

    setIsSubmitting(true);
    try {
      let affRef: string | null = null;
      if (typeof window !== 'undefined') {
        affRef = localStorage.getItem('tuhocai_aff_ref');
      }

      const utm = getStoredUtm('video-drama-gia-dinh-nho');

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'WF-DRAMA-069',
          customerName: customerName || 'Học Viên Drama',
          customerEmail: cleanEmail,
          customerPhone: cleanPhone,
          affiliateRef: affRef,
          landingSlug: 'video-drama-gia-dinh-nho',
          utmSource: utm.utmSource,
          utmMedium: utm.utmMedium,
          utmCampaign: utm.utmCampaign,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        setFormError(resData.error || 'Có lỗi xảy ra khi tạo đơn hàng');
        setIsSubmitting(false);
        return;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('customer_email_drama', cleanEmail);
      }
      window.location.href = `/lp/video-drama-gia-dinh-nho/cam-on?email=${encodeURIComponent(cleanEmail)}`;
    } catch (_) {
      setFormError('Không thể kết nối máy chủ. Vui lòng thử lại.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#03070f] text-[#f5f4ef] font-sans antialiased selection:bg-[#ffc400] selection:text-[#080b10] pb-24 md:pb-12">
      {/* Background Grid Accent */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-25 z-0" 
        style={{
          backgroundImage: 'linear-gradient(to right, #27303d 1px, transparent 1px), linear-gradient(to bottom, #27303d 1px, transparent 1px)',
          backgroundSize: '68px 68px'
        }}
      />

      {/* FLASH SALE TOP BANNER */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black px-3 py-2 text-center text-xs sm:text-sm font-black tracking-wide shadow-md flex items-center justify-center gap-2 flex-wrap">
        <Flame className="w-4 h-4 fill-black animate-pulse flex-shrink-0" />
        <span>ƯU ĐÃI 1 LY TRÀ SỮA (69K) CHỈ CÒN 7 SUẤT HÔM NAY · KẾT THÚC TRONG:</span>
        <span className="font-mono bg-black text-[#ffc400] px-2 py-0.5 rounded text-xs font-black">
          {formatTimer(timeLeft)}
        </span>
      </div>

      <main className="relative z-10 overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative px-4 pb-14 pt-8 sm:px-8 sm:pt-14 lg:pb-20">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            
            {/* Author Avatar & Brand */}
            <div className="mb-5 flex flex-col items-center">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-amber-500 to-yellow-400 p-0.5 shadow-[0_0_35px_rgba(255,191,0,0.3)]">
                  <div className="w-full h-full rounded-full bg-[#03070f] flex items-center justify-center text-xl sm:text-2xl font-black text-[#ffc400]">
                    ĐAI
                  </div>
                </div>
              </div>
              <p className="mt-2.5 text-[#f6c64b] font-black text-xs sm:text-sm tracking-wider uppercase">
                NGUYỄN ĐĂNG AI · TỰ HỌC AI (TUHOCAI.TOP)
              </p>
            </div>

            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ffc400]/40 bg-[#ffc400]/10 px-4 py-1.5 text-xs sm:text-sm font-bold uppercase text-[#ffc400] shadow-[0_0_20px_rgba(255,196,0,0.15)]">
              <Sparkles className="w-4 h-4 text-[#ffc400]" />
              <span>Video AI thực chiến · Độc quyền Tự Học AI</span>
            </div>

            {/* Main Headline */}
            <h1 className="max-w-4xl text-balance text-3xl sm:text-5xl lg:text-7xl font-black uppercase leading-[1.15] tracking-tight">
              Toàn bộ quy trình<br />làm video AI
              <span className="mt-2 block text-[#ffc400] drop-shadow-[0_4px_30px_rgba(255,196,0,0.35)]">
                “Câu chuyện gia đình nhỏ”
              </span>
            </h1>

            {/* Subheadline (CÂN CHỈNH FONT RÕ NÉT TRÊN MOBILE) */}
            <p className="mt-6 max-w-2xl text-pretty text-base sm:text-lg font-medium leading-relaxed text-slate-200">
              Từ ý tưởng đến video thành phẩm triệu view. Quy trình thực chiến đã được đóng gói đầy đủ file kịch bản, prompt ảnh nhân vật và chuyển động video. Kích hoạt trực tiếp vào email của bạn.
            </p>

            {/* Visual Showcase (11 ngày 44 video 427K follow) */}
            <div className="mt-8 w-full max-w-4xl overflow-hidden rounded-2xl border border-[#ffc400]/50 shadow-[0_0_50px_rgba(255,191,0,0.15)] relative">
              <img 
                src="/sites/tuhocai-top/landing/drama/mini-drama-results-atm.png" 
                alt="Mini Drama Gia Đình Nhỏ — Kênh 11 ngày, 44 video, 427K follow" 
                className="aspect-video w-full object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/20 text-xs sm:text-sm font-mono font-bold text-emerald-400">
                ✓ Đã kiểm chứng 427K Follower
              </div>
            </div>

            {/* 3 Metric Pillars (CÂN CHỈNH FONT CHỮ LỚN DỄ ĐỌC) */}
            <div className="mt-8 grid w-full max-w-4xl grid-cols-3 border-y border-[#27303d] bg-[#070c16]/95 backdrop-blur-sm divide-x divide-[#27303d] rounded-xl overflow-hidden border">
              <div className="px-3 py-4 sm:px-6 sm:py-6">
                <p className="text-xs sm:text-sm font-bold uppercase text-slate-300">Quy trình</p>
                <p className="mt-1 text-2xl sm:text-4xl font-black text-[#ffc400]">01</p>
                <p className="mt-1 text-xs sm:text-sm text-slate-300 font-medium">Từng bước làm theo</p>
              </div>
              <div className="px-3 py-4 sm:px-6 sm:py-6">
                <p className="text-xs sm:text-sm font-bold uppercase text-slate-300">Chi phí</p>
                <p className="mt-1 text-2xl sm:text-4xl font-black text-[#ffc400]">69K <span className="text-xs line-through text-slate-500 font-normal">499K</span></p>
                <p className="mt-1 text-xs sm:text-sm text-slate-300 font-medium">Bằng 1 ly trà sữa</p>
              </div>
              <div className="px-3 py-4 sm:px-6 sm:py-6">
                <p className="text-xs sm:text-sm font-bold uppercase text-slate-300">Nhận ngay</p>
                <p className="mt-1 text-2xl sm:text-4xl font-black text-emerald-400">Email & Web</p>
                <p className="mt-1 text-xs sm:text-sm text-slate-300 font-medium">Mở khóa tức thì</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <a 
                href="#nhan-quy-trinh"
                onClick={handleOpenCheckout}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#ffc400] px-8 py-4 text-base font-black text-[#080b10] shadow-[0_10px_36px_rgba(255,196,0,0.3)] hover:bg-[#ffd33d] active:scale-95 transition-all cursor-pointer"
              >
                <span>NHẬN TOÀN BỘ QUY TRÌNH (69K)</span>
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </a>
              <button 
                onClick={handleOpenCheckout}
                className="w-full sm:w-auto px-6 py-4 rounded-xl border border-[#ffc400]/40 bg-[#ffc400]/10 text-[#ffc400] font-bold text-sm hover:bg-[#ffc400]/20 transition-colors cursor-pointer"
              >
                Mở Form Kích Hoạt Nhanh
              </button>
            </div>
          </div>
        </section>

        {/* SNEAK PEEK: KHO TÀI LIỆU BÊN TRONG CÓ GÌ? */}
        <section className="border-t border-[#27303d] bg-[#050a14] px-4 py-14 sm:px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#ffc400] bg-[#ffc400]/10 px-3.5 py-1 rounded-full border border-[#ffc400]/30">
                Minh bạch 100% · Nhìn thấy trước khi mua
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase text-white">
                Bên trong kho quy trình của bạn có gì?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
                Sau khi kích hoạt tài khoản, bạn sẽ mở khóa trực tiếp các tài liệu thực chiến sau:
              </p>
            </div>

            <div className="rounded-2xl border border-[#27303d] bg-[#090f18] p-5 sm:p-7 space-y-3 font-mono shadow-2xl">
              <div className="flex items-center gap-2 text-[#ffc400] font-bold pb-2 border-b border-[#27303d] text-xs sm:text-sm">
                <FolderDown className="w-4 h-4 text-[#ffc400]" />
                <span>KHO_QUY_TRINH_VIDEO_MINI_DRAMA_TUHOCAI/ (Được cấp quyền truy cập)</span>
              </div>
              <div className="space-y-2.5 pt-1 text-slate-200">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-[#ffc400]/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white text-xs sm:text-sm block">01_Bo_10_Kich_Ban_Drama_Cam_Dong_Trieu_View.docx</span>
                      <span className="text-[11px] text-slate-400">Kịch bản viết sẵn, chỉ việc đưa vào tạo ảnh</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 hidden sm:inline">Word · 245 KB</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-[#ffc400]/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white text-xs sm:text-sm block">02_Prompt_Khoa_Mat_Nhan_Vat_Flux_Midjourney.txt</span>
                      <span className="text-[11px] text-slate-400">Bộ câu lệnh giữ chuẩn nét mặt nhân vật</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 hidden sm:inline">Text · 18 KB</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-[#ffc400]/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white text-xs sm:text-sm block">03_Video_Huong_Dan_Render_Khau_Hinh_Kling_Luma.mp4</span>
                      <span className="text-[11px] text-slate-400">Video thực chiến 1080p hướng dẫn từng click</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 hidden sm:inline">MP4 · 185 MB</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-[#ffc400]/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-purple-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white text-xs sm:text-sm block">04_File_Am_Thanh_BGM_Lay_Nuoc_Mat_Doc_Quyen.zip</span>
                      <span className="text-[11px] text-slate-400">Bộ nhạc nền và hiệu ứng âm thanh cảm động</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 hidden sm:inline">ZIP · 64 MB</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: BẠN SẼ NHẬN ĐƯỢC GÌ? (FONT TO RÕ NÉT) */}
        <section className="border-y border-[#27303d] bg-[#070c16] px-4 py-16 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#ffc400]">
              Bạn sẽ nhận được gì?
            </p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Đủ quy trình để bắt đầu ngay hôm nay
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  id: '01',
                  text: 'Toàn bộ quy trình làm video AI Câu Chuyện Gia Đình Nhỏ từ kịch bản xúc động đến tạo hình nhân vật chuẩn.',
                },
                {
                  id: '02',
                  text: 'Bộ câu lệnh Prompt thực chiến (Kling AI, Midjourney, Flux.1, Luma) để bạn có thể copy-paste làm theo ngay.',
                },
                {
                  id: '03',
                  text: 'Bí quyết giữ tính nhất quán gương mặt và biểu cảm nhân vật qua các phân cảnh không bị méo lệch.',
                },
                {
                  id: '04',
                  text: 'Mở khóa tự động vào tài khoản Email & Kho tài nguyên của bạn trên website tuhocai.top lưu trữ vĩnh viễn.',
                },
              ].map((item) => (
                <article 
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-[#27303d] bg-[#090f18] p-5 sm:p-6 hover:border-[#ffc400]/40 transition-colors"
                >
                  <span className="text-3xl sm:text-4xl font-black text-[#ffc400]/30 select-none">
                    {item.id}
                  </span>
                  <div>
                    <div className="mb-2.5 flex size-8 items-center justify-center rounded-full bg-[#ffc400] text-[#080b10] shadow">
                      <Check className="size-4 stroke-[3]" />
                    </div>
                    <p className="font-medium text-base sm:text-lg leading-relaxed text-white">
                      {item.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: 1 LY TRÀ SỮA */}
        <section className="px-4 py-16 sm:px-8">
          <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative mx-auto max-w-xs sm:max-w-sm">
              <div className="absolute inset-10 rounded-full bg-[#ffc400]/15 blur-3xl pointer-events-none" />
              <img 
                src="/sites/tuhocai-top/landing/drama/tra-sua.png" 
                alt="Một ly trà sữa" 
                className="relative w-full rounded-2xl object-cover border border-[#27303d] shadow-2xl"
              />
            </div>

            <div>
              <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#ffc400]">
                Khoản đầu tư siêu nhỏ
              </p>
              <h2 className="mt-2 text-3xl font-black uppercase leading-tight sm:text-5xl">
                Mời NGUYỄN ĐĂNG AI 1 ly<br />
                <span className="text-[#ffc400]">trà sữa 69.000đ</span>
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed">
                Chỉ <strong className="text-white font-bold">69.000đ</strong> — tương đương 1 ly trà sữa để sở hữu trọn bộ quy trình video AI triệu view, được kích hoạt thẳng vào tài khoản email của bạn trên hệ thống Tự Học AI.
              </p>
              <div className="mt-6 inline-flex items-center gap-3 border-l-2 border-[#ffc400] pl-4 text-xs sm:text-sm font-bold uppercase text-[#ffc400]">
                Mở khóa tự động ngay hôm nay · Tiết kiệm hàng tháng thử sai
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: CHUYỂN KHOẢN MOBILE-FIRST (CÓ BỘ NÚT 1-CHẠM & HỖ TRỢ ZALO 0938.494.303) */}
        <section id="nhan-quy-trinh" className="border-t border-[#27303d] bg-[#070c16] px-4 py-16 sm:px-8 scroll-mt-8">
          <div className="mx-auto max-w-4xl text-center space-y-4">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#ffc400] bg-[#ffc400]/10 px-3.5 py-1 rounded-full border border-[#ffc400]/30">
              Thanh toán 1-chạm tiện lợi · Nhận ngay tức thì
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white">
              Nhận toàn bộ quy trình ngay
            </h2>
            <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto">
              Trên điện thoại: Quét mã QR hoặc dùng cụm nút <strong>Copy 1-chạm</strong> bên dưới để dán vào App ngân hàng của bạn.
            </p>

            <div className="mt-8 rounded-2xl border border-[#27303d] bg-[#090f18] p-5 sm:p-8 text-left shadow-2xl grid grid-cols-1 md:grid-cols-[18rem_1fr] gap-6 items-center">
              {/* QR Image Box */}
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-inner">
                <img 
                  src={qrUrl} 
                  alt="QR VietQR VIB NGUYEN VAN DANG 69.000đ" 
                  className="w-full max-w-56 h-auto object-contain"
                />
                <span className="text-xs font-mono text-slate-800 mt-2 font-bold flex items-center gap-1">
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  Quét bằng mọi App Ngân Hàng
                </span>
              </div>

              {/* Mobile One-Tap Buttons & Details */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold uppercase text-[#ffc400] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <span>Thông tin chuyển khoản VIB chính thức</span>
                </h3>

                {/* 3 ONE-TAP QUICK COPY BUTTONS */}
                <div className="grid grid-cols-1 gap-2.5">
                  {/* Copy STK */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffc400]/50 transition-colors">
                    <div>
                      <p className="text-xs text-slate-300 uppercase font-bold">Số tài khoản VIB</p>
                      <p className="text-lg sm:text-xl font-mono font-black text-[#ffc400]">0934434101</p>
                    </div>
                    <button 
                      onClick={() => handleCopy('0934434101', 'bank')}
                      className="px-3.5 py-2 rounded-lg bg-[#ffc400] text-black font-black text-xs sm:text-sm flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow"
                    >
                      {copiedBank ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedBank ? 'Đã copy' : 'Copy STK'}</span>
                    </button>
                  </div>

                  {/* Copy Số tiền */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffc400]/50 transition-colors">
                    <div>
                      <p className="text-xs text-slate-300 uppercase font-bold">Số tiền chuyển khoản</p>
                      <p className="text-lg sm:text-xl font-mono font-black text-white">69.000 đ</p>
                    </div>
                    <button 
                      onClick={() => handleCopy('69000', 'amount')}
                      className="px-3.5 py-2 rounded-lg bg-white/15 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    >
                      {copiedAmount ? <Check className="w-4 h-4 text-emerald-400 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedAmount ? 'Đã copy' : 'Copy Số Tiền'}</span>
                    </button>
                  </div>

                  {/* Copy Nội dung */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffc400]/50 transition-colors">
                    <div>
                      <p className="text-xs text-slate-300 uppercase font-bold">Nội dung chuyển khoản</p>
                      <p className="text-base font-mono font-bold text-emerald-400">1 ly tra sua</p>
                    </div>
                    <button 
                      onClick={() => handleCopy('1 ly tra sua', 'content')}
                      className="px-3.5 py-2 rounded-lg bg-white/15 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    >
                      {copiedContent ? <Check className="w-4 h-4 text-emerald-400 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedContent ? 'Đã copy' : 'Copy Nội Dung'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-sm text-slate-300 space-y-1.5 pt-1">
                  <p>Chủ tài khoản: <strong className="text-white font-bold">NGUYEN VAN DANG</strong></p>
                  <p className="text-xs sm:text-sm text-amber-300">
                    *Chuyển khoản xong, bấm nút phía dưới để kích hoạt tài liệu vào email của bạn ngay lập tức.
                  </p>
                </div>

                <button 
                  onClick={handleOpenCheckout}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#ffc400] py-4 px-6 font-black text-[#080b10] hover:bg-[#ffd33d] transition-all shadow-[0_10px_30px_rgba(255,196,0,0.25)] cursor-pointer text-base uppercase"
                >
                  <Mail className="w-5 h-5" />
                  <span>KÍCH HOẠT QUY TRÌNH VÀO EMAIL NGAY</span>
                </button>

                {/* HỖ TRỢ KỸ THUẬT TRỰC TIẾP QUA ZALO */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-400">Cần hỗ trợ kỹ thuật trực tiếp?</span>
                  <a 
                    href="https://zalo.me/0938494303" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-400 font-bold hover:underline"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Zalo: 0938.494.303</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-[#27303d] px-4 py-8 text-center text-xs sm:text-sm text-slate-400 bg-[#02050b]">
          <p>© 2026 NGUYỄN ĐĂNG AI · TỰ HỌC AI (tuhocai.top) · STK VIB: 0934434101 · Zalo: 0938.494.303</p>
        </footer>
      </main>

      {/* MOBILE STICKY FLOATING BOTTOM BAR (LUÔN BÁM THEO NGÓN CÁI) */}
      <aside aria-label="Thanh đặt mua nhanh trên di động" className="fixed bottom-0 left-0 right-0 z-40 bg-[#070c16]/95 backdrop-blur-md border-t border-[#ffc400]/30 p-3 sm:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs line-through text-slate-500 font-bold">499K</span>
              <span className="text-xl font-black text-[#ffc400]">69.000đ</span>
            </div>
            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Flash Sale {formatTimer(timeLeft)}</span>
            </p>
          </div>

          <button 
            onClick={() => setModalOpen(true)}
            className="flex-1 py-3 px-4 rounded-xl bg-[#ffc400] text-[#080b10] font-black text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>NHẬN QUY TRÌNH</span>
            <Zap className="w-4 h-4 fill-black" />
          </button>
        </div>
      </aside>

      {/* POPUP XÁC NHẬN THANH TOÁN (MODAL) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#1c2130] to-[#0b101b] border border-[#ffc400]/40 p-5 sm:p-7 text-center shadow-[0_24px_75px_rgba(0,0,0,0.8)] text-white">
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white p-2 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-[#ffc400] font-extrabold text-xs tracking-widest uppercase mb-1">
              NGUYỄN ĐĂNG AI · TỰ HỌC AI
            </div>

            <h2 className="text-xl font-black uppercase text-white">
              KÍCH HOẠT QUY TRÌNH VIDEO AI
            </h2>

            <div className="my-2.5 text-3xl font-black text-[#ffc400]">
              69.000đ <span className="text-xs line-through text-slate-400 font-normal">499.000đ</span>
            </div>

            <div className="inline-flex p-3 bg-white rounded-xl shadow-md my-1">
              <img 
                src={qrUrl} 
                alt="QR Code thanh toán VIB" 
                className="w-44 h-auto object-contain"
              />
            </div>

            {/* 3 Nút Copy trong Modal */}
            <div className="grid grid-cols-3 gap-1.5 my-2">
              <button
                type="button"
                onClick={() => handleCopy('0934434101', 'bank')}
                className="p-2 rounded bg-white/10 hover:bg-white/20 text-xs font-bold text-yellow-400 flex items-center justify-center gap-1 cursor-pointer"
              >
                {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBank ? 'Đã copy' : 'Copy STK'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleCopy('69000', 'amount')}
                className="p-2 rounded bg-white/10 hover:bg-white/20 text-xs font-bold text-yellow-400 flex items-center justify-center gap-1 cursor-pointer"
              >
                {copiedAmount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAmount ? 'Đã copy' : 'Copy 69K'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleCopy('1 ly tra sua', 'content')}
                className="p-2 rounded bg-white/10 hover:bg-white/20 text-xs font-bold text-emerald-300 flex items-center justify-center gap-1 cursor-pointer"
              >
                {copiedContent ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedContent ? 'Đã copy' : 'Copy ND'}</span>
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-300 bg-white/5 p-3 rounded-lg border border-white/10 my-2 text-left space-y-1">
              <div>Ngân hàng: <strong className="text-white">VIB</strong> · Số TK: <strong className="text-[#ffc400]">0934434101</strong></div>
              <div>Chủ TK: <strong className="text-white">NGUYEN VAN DANG</strong> · Nội dung: <strong className="text-white">1 ly tra sua</strong></div>
            </div>

            <form onSubmit={handleConfirmPayment} className="mt-3 space-y-3 text-left">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold leading-relaxed">
                  ⚠️ {formError}
                </div>
              )}

              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-200 block mb-1">
                  Email nhận tài liệu và mở khóa (Bắt buộc):
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="name@gmail.com"
                  value={customerEmail}
                  onChange={(e) => {
                    setCustomerEmail(e.target.value);
                    if (formError) setFormError('');
                  }}
                  className="w-full px-3.5 py-3 rounded-lg bg-black/50 border border-[#27303d] text-base text-white focus:outline-none focus:border-[#ffc400]"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-200 block mb-1">
                  Họ và tên của bạn:
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-lg bg-black/50 border border-[#27303d] text-base text-white focus:outline-none focus:border-[#ffc400]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs sm:text-sm font-bold text-slate-200 block">
                    Số điện thoại (Đúng 10 số):
                  </label>
                  <span className="text-[11px] text-amber-300 font-medium">Mật khẩu Kho Của Tôi</span>
                </div>
                <input 
                  type="tel" 
                  required
                  maxLength={10}
                  pattern="0[0-9]{9}"
                  placeholder="Ví dụ: 0912345678"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (formError) setFormError('');
                  }}
                  className="w-full px-3.5 py-3 rounded-lg bg-black/50 border border-[#27303d] text-base text-white focus:outline-none focus:border-[#ffc400]"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  *SĐT này sẽ là mật khẩu mặc định để bạn đăng nhập tra cứu và tải tài liệu trọn đời.
                </p>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="mt-3 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ffe66d] via-[#facc15] to-[#e9a808] text-[#141414] font-black text-sm sm:text-base uppercase tracking-wider hover:opacity-95 cursor-pointer shadow-[0_5px_22px_rgba(250,204,21,0.3)] transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Đang kích hoạt tài khoản...</span>
                ) : (
                  <>
                    <Mail className="w-5 h-5 text-black" />
                    <span>✓ TÔI ĐÃ CHUYỂN KHOẢN (MỞ KHÓA NGAY)</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
