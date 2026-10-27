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
  X,
  ShieldCheck,
  Mail,
  Zap,
  ArrowRight
} from 'lucide-react';

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

  // VietQR URL VIB
  const qrUrl = "https://img.vietqr.io/image/VIB-0934434101-compact2.png?amount=69000&addInfo=1%20ly%20tra%20sua&accountName=NGUYEN%20VAN%20DANG";

  // Affiliate tracking
  useEffect(() => {
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
    setIsSubmitting(true);
    try {
      let affRef: string | null = null;
      if (typeof window !== 'undefined') {
        affRef = localStorage.getItem('tuhocai_aff_ref');
      }

      await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'WF-DRAMA-069',
          customerName: customerName || 'Học Viên Video Drama',
          customerEmail: customerEmail,
          customerPhone: customerPhone,
          affiliateRef: affRef,
        }),
      });

      // Lưu email vào localStorage để trang Cảm ơn hiển thị
      if (typeof window !== 'undefined') {
        localStorage.setItem('customer_email_drama', customerEmail);
      }
    } catch (_) {
      // Tiếp tục chuyển hướng
    } finally {
      setIsSubmitting(false);
      window.location.href = `/lp/video-drama-gia-dinh-nho/cam-on?email=${encodeURIComponent(customerEmail)}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#03070f] text-[#f5f4ef] font-sans antialiased selection:bg-[#ffc400] selection:text-[#080b10]">
      {/* Background Grid Accent */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-25 z-0" 
        style={{
          backgroundImage: 'linear-gradient(to right, #27303d 1px, transparent 1px), linear-gradient(to bottom, #27303d 1px, transparent 1px)',
          backgroundSize: '68px 68px'
        }}
      />

      <main className="relative z-10 overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative px-5 pb-16 pt-10 sm:px-8 sm:pt-14 lg:pb-24">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            
            {/* Author Avatar & Brand */}
            <div className="mb-6 flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-amber-500 to-yellow-400 p-0.5 shadow-[0_0_35px_rgba(255,191,0,0.3)]">
                  <div className="w-full h-full rounded-full bg-[#03070f] flex items-center justify-center text-2xl font-black text-[#ffc400]">
                    ĐAI
                  </div>
                </div>
              </div>
              <p className="mt-3 text-[#f6c64b] font-black text-sm tracking-wider uppercase">
                NGUYỄN ĐĂNG AI · TỰ HỌC AI (TUHOCAI.TOP)
              </p>
            </div>

            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#ffc400]/40 bg-[#ffc400]/10 px-4 py-2 text-xs font-bold uppercase text-[#ffc400] sm:text-sm shadow-[0_0_20px_rgba(255,196,0,0.15)]">
              <Sparkles className="w-4 h-4 text-[#ffc400]" />
              <span>Quy trình Video AI thực chiến độc quyền · Tự Học AI</span>
            </div>

            {/* Main Headline */}
            <h1 className="max-w-4xl text-balance text-4xl font-black uppercase leading-[1.1] sm:text-6xl lg:text-7xl tracking-tight">
              Toàn bộ quy trình<br />làm video AI
              <span className="mt-3 block text-[#ffc400] drop-shadow-[0_4px_30px_rgba(255,196,0,0.35)]">
                “Câu chuyện gia đình nhỏ”
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-7 max-w-2xl text-pretty text-sm sm:text-base font-medium leading-relaxed text-[#aab1bc]">
              Từ ý tưởng đến thành phẩm Mini Drama — quy trình thực chiến để bạn tự làm video triệu view chỉ bằng 1 ly trà sữa. Kích hoạt tài liệu thẳng vào tài khoản email của bạn trên hệ thống Tự Học AI.
            </p>

            {/* Visual Showcase (11 ngày 44 video 427K follow) */}
            <div className="mt-10 w-full max-w-4xl overflow-hidden rounded-xl border border-[#ffc400]/50 shadow-[0_0_50px_rgba(255,191,0,0.15)]">
              <img 
                src="/sites/tuhocai-top/landing/drama/mini-drama-results-atm.png" 
                alt="Mini Drama Gia Đình Nhỏ — Kênh 11 ngày, 44 video, 427K follow" 
                className="aspect-video w-full object-cover"
              />
            </div>

            {/* 3 Metric Pillars */}
            <div className="mt-10 grid w-full max-w-4xl grid-cols-1 border-y border-[#27303d] bg-[#070c16]/80 backdrop-blur-sm sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#27303d]">
              <div className="px-5 py-6">
                <p className="text-xs font-bold uppercase text-[#aab1bc]">Quy trình</p>
                <p className="mt-2 text-3xl font-black text-[#ffc400]">01</p>
                <p className="mt-1 text-sm text-[#aab1bc]">Từng bước cụ thể</p>
              </div>
              <div className="px-5 py-6">
                <p className="text-xs font-bold uppercase text-[#aab1bc]">Chi phí</p>
                <p className="mt-2 text-3xl font-black text-[#ffc400]">69K</p>
                <p className="mt-1 text-sm text-[#aab1bc]">Bằng 1 ly trà sữa</p>
              </div>
              <div className="px-5 py-6">
                <p className="text-xs font-bold uppercase text-[#aab1bc]">Nhận ngay</p>
                <p className="mt-2 text-3xl font-black text-[#ffc400]">Email & Web</p>
                <p className="mt-1 text-sm text-[#aab1bc]">Vào tài khoản ngay</p>
              </div>
            </div>

            {/* CTA Button */}
            <button 
              onClick={() => setModalOpen(true)}
              className="mt-9 inline-flex items-center justify-center gap-2.5 rounded-lg bg-[#ffc400] px-8 py-4 text-base font-black text-[#080b10] shadow-[0_10px_36px_rgba(255,196,0,0.25)] hover:bg-[#ffd33d] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span>Nhận toàn bộ quy trình (69K)</span>
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </button>
          </div>
        </section>

        {/* SECTION: BẠN SẼ NHẬN ĐƯỢC GÌ? */}
        <section className="border-y border-[#27303d] bg-[#070c16] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#ffc400]">
              Bạn sẽ nhận được gì?
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl tracking-tight">
              Đủ quy trình để bắt đầu ngay
            </h2>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
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
                  className="flex gap-5 rounded-xl border border-[#27303d] bg-[#090f18] p-6 sm:p-8 hover:border-[#ffc400]/40 transition-colors"
                >
                  <span className="text-4xl font-black text-[#ffc400]/30 select-none">
                    {item.id}
                  </span>
                  <div>
                    <div className="mb-4 flex size-8 items-center justify-center rounded-full bg-[#ffc400] text-[#080b10] shadow">
                      <Check className="size-4 stroke-[3]" />
                    </div>
                    <p className="font-semibold leading-relaxed text-[#f5f4ef]">
                      {item.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: 1 LY TRÀ SỮA */}
        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative mx-auto max-w-sm">
              <div className="absolute inset-10 rounded-full bg-[#ffc400]/15 blur-3xl pointer-events-none" />
              <img 
                src="/sites/tuhocai-top/landing/drama/tra-sua.png" 
                alt="Một ly trà sữa" 
                className="relative w-full rounded-2xl object-cover border border-[#27303d] shadow-2xl"
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#ffc400]">
                Một món quà nhỏ
              </p>
              <h2 className="mt-3 text-4xl font-black uppercase leading-tight sm:text-5xl">
                Mời NGUYỄN ĐĂNG AI 1 ly<br />
                <span className="text-[#ffc400]">trà sữa 69.000đ</span>
              </h2>
              <p className="mt-6 text-lg text-[#aab1bc] leading-relaxed">
                Chỉ <strong className="text-white font-bold">69.000đ</strong> — tương đương 1 ly trà sữa để sở hữu trọn bộ quy trình video AI triệu view, được kích hoạt thẳng vào tài khoản email của bạn trên hệ thống Tự Học AI.
              </p>
              <div className="mt-7 inline-flex items-center gap-3 border-l-2 border-[#ffc400] pl-4 text-sm font-bold uppercase text-[#ffc400]">
                Mở khóa tự động ngay hôm nay
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: CHUYỂN KHOẢN NHANH CHÓNG */}
        <section id="nhan-quy-trinh" className="border-y border-[#27303d] bg-[#070c16] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#ffc400]">
              Chuyển khoản nhanh chóng
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl">
              Nhận toàn bộ quy trình
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[#aab1bc]">
              Quét mã QR ngân hàng VIB, nhập số tiền 69.000đ và nội dung “1 ly tra sua”. Chuyển khoản xong, bấm NHẬN QUY TRÌNH để hệ thống kích hoạt tài liệu vào tài khoản email của bạn.
            </p>

            <div className="mx-auto mt-10 grid max-w-4xl gap-8 rounded-2xl border border-[#27303d] bg-[#090f18] p-6 sm:p-10 text-left shadow-2xl md:grid-cols-[20rem_1fr]">
              {/* QR Image Box */}
              <div className="overflow-hidden rounded-xl bg-white p-4 shadow-inner flex flex-col items-center justify-center">
                <img 
                  src={qrUrl} 
                  alt="QR VietQR VIB NGUYEN VAN DANG 69.000đ" 
                  className="mx-auto w-full max-w-64 object-contain"
                />
                <span className="text-[11px] font-mono text-slate-700 mt-2 font-semibold">
                  Mã VietQR Ngân Hàng VIB
                </span>
              </div>

              {/* Payment Details */}
              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-bold uppercase text-[#ffc400] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Thông tin chuyển khoản chính thức</span>
                </h3>

                <dl className="mt-5 divide-y divide-[#27303d] border-y border-[#27303d]">
                  <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] items-center">
                    <dt className="text-sm text-[#aab1bc]">Ngân hàng</dt>
                    <dd className="font-bold text-white flex items-center justify-between">
                      <span>VIB (Ngân hàng Quốc Tế)</span>
                    </dd>
                  </div>
                  <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] items-center">
                    <dt className="text-sm text-[#aab1bc]">Chủ tài khoản</dt>
                    <dd className="font-bold text-white">NGUYEN VAN DANG</dd>
                  </div>
                  <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] items-center">
                    <dt className="text-sm text-[#aab1bc]">Số tài khoản</dt>
                    <dd className="font-mono font-bold text-[#ffc400] text-base flex items-center justify-between">
                      <span>0934434101</span>
                      <button 
                        onClick={() => handleCopy('0934434101', 'bank')}
                        className="text-xs text-[#aab1bc] hover:text-white flex items-center gap-1 cursor-pointer bg-white/5 px-2 py-1 rounded"
                      >
                        {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedBank ? 'Đã copy' : 'Copy'}</span>
                      </button>
                    </dd>
                  </div>
                  <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] items-center">
                    <dt className="text-sm text-[#aab1bc]">Số tiền / Nội dung</dt>
                    <dd className="font-bold text-white flex items-center justify-between">
                      <span>69.000đ · 1 ly tra sua</span>
                      <button 
                        onClick={() => handleCopy('1 ly tra sua', 'content')}
                        className="text-xs text-[#aab1bc] hover:text-white flex items-center gap-1 cursor-pointer bg-white/5 px-2 py-1 rounded"
                      >
                        {copiedContent ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedContent ? 'Đã copy' : 'Copy'}</span>
                      </button>
                    </dd>
                  </div>
                </dl>

                <p className="mt-6 text-sm text-[#aab1bc]">
                  Sau khi chuyển khoản, bấm <strong className="text-white">NHẬN QUY TRÌNH</strong> để điền email nhận link kích hoạt tài liệu ngay lập tức.
                </p>

                <button 
                  onClick={() => setModalOpen(true)}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#ffc400] py-4 px-6 font-black text-[#080b10] hover:bg-[#ffd33d] transition-all shadow-[0_10px_30px_rgba(255,196,0,0.2)] cursor-pointer text-base uppercase"
                >
                  <span>NHẬN QUY TRÌNH VÀO EMAIL</span>
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: QUÀ TẶNG KHÁC & KẾT NỐI */}
        <section className="px-5 py-20 text-center sm:px-8">
          <div className="mx-auto max-w-3xl">
            <Gift className="mx-auto size-12 text-[#ffc400]" />
            <h2 className="mt-5 text-3xl font-black uppercase sm:text-4xl">
              Nhận các quà tặng khác
            </h2>
            <p className="mt-4 text-[#aab1bc] leading-relaxed">
              Kết nối trực tiếp cùng NGUYỄN ĐĂNG AI & TỰ HỌC AI để nhận thêm hàng trăm prompt, tài liệu và quy trình tự động hóa n8n dành riêng cho cộng đồng.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a 
                href="https://zalo.me/g/tuhocai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ffc400] px-7 py-3.5 font-black text-[#080b10] hover:bg-[#ffd33d] shadow-[0_10px_30px_rgba(255,196,0,0.2)] transition-all text-sm uppercase"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Tham Gia Nhóm Zalo Tự Học AI</span>
              </a>
              <Link
                href="/bai-viet"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#27303d] bg-[#090f18] px-7 py-3.5 font-bold text-white hover:border-[#ffc400]/40 transition-all text-sm"
              >
                <span>Đọc Thư Viện Bài Viết Chuyên Sâu</span>
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-[#27303d] px-5 py-8 text-center text-xs text-[#aab1bc] bg-[#02050b]">
          <p>© 2026 NGUYỄN ĐĂNG AI · TỰ HỌC AI (tuhocai.top) · STK VIB: 0934434101</p>
        </footer>
      </main>

      {/* POPUP XÁC NHẬN THANH TOÁN (MODAL) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#1c2130] to-[#0b101b] border border-[#ffc400]/40 p-6 sm:p-8 text-center shadow-[0_24px_75px_rgba(0,0,0,0.8)] text-white">
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-2 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-[#ffc400] font-extrabold text-xs tracking-widest uppercase mb-2">
              NGUYỄN ĐĂNG AI · TỰ HỌC AI
            </div>

            <h2 className="text-2xl font-black uppercase text-white">
              HOÀN TẤT ĐƠN HÀNG
            </h2>

            <p className="mt-2 text-xs text-[#cbd0dd]">
              Chỉ 1 ly trà sữa để sở hữu trọn bộ <strong>Quy trình Video AI Câu Chuyện Gia Đình Nhỏ</strong>!
            </p>

            <div className="my-4 text-3xl font-black text-[#ffc400]">
              69.000đ
            </div>

            <div className="inline-flex p-3 bg-white rounded-xl shadow-md my-2">
              <img 
                src={qrUrl} 
                alt="QR Code thanh toán VIB" 
                className="w-48 h-auto object-contain"
              />
            </div>

            <div className="text-xs text-slate-300 bg-white/5 p-3 rounded-lg border border-white/10 my-2 text-left space-y-1">
              <div>Ngân hàng: <strong className="text-white">VIB</strong></div>
              <div>Số TK: <strong className="text-[#ffc400]">0934434101</strong></div>
              <div>Chủ TK: <strong className="text-white">NGUYEN VAN DANG</strong></div>
              <div>Nội dung: <strong className="text-white">1 ly tra sua</strong></div>
            </div>

            <form onSubmit={handleConfirmPayment} className="mt-4 space-y-3 text-left">
              <div>
                <label className="text-[11px] font-bold text-[#aab1bc] block mb-1">
                  Email nhận tài liệu và mở khóa (Bắt buộc):
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="name@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-[#27303d] text-sm text-white focus:outline-none focus:border-[#ffc400]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#aab1bc] block mb-1">
                  Họ và tên của bạn:
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-[#27303d] text-sm text-white focus:outline-none focus:border-[#ffc400]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#aab1bc] block mb-1">
                  Số điện thoại / Zalo:
                </label>
                <input 
                  type="tel" 
                  required
                  placeholder="Ví dụ: 0912345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-[#27303d] text-sm text-white focus:outline-none focus:border-[#ffc400]"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ffe66d] via-[#facc15] to-[#e9a808] text-[#141414] font-black text-sm uppercase tracking-wider hover:opacity-95 cursor-pointer shadow-[0_5px_22px_rgba(250,204,21,0.3)] transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Đang kích hoạt tài khoản...</span>
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-black" />
                    <span>✓ TÔI ĐÃ CHUYỂN KHOẢN (KÍCH HOẠT VÀO EMAIL)</span>
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 text-[11px] text-[#aeb4c2] leading-relaxed">
              Sau khi bấm, hệ thống sẽ kích hoạt và chuyển bạn đến trang nhận tài liệu ngay lập tức.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
