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
  Layers,
  Code2
} from 'lucide-react';

export default function CopyLandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  
  // Checkout form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // VietQR VIB 99K
  const qrUrl = "https://img.vietqr.io/image/VIB-0934434101-compact2.png?amount=99000&addInfo=copy%20landing%20page&accountName=NGUYEN%20VAN%20DANG";

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
          body: JSON.stringify({ ref, landingPath: '/lp/sao-chep-landing-page' }),
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
          productId: 'SKILL-CLONE-099',
          customerName: customerName || 'Học Viên Copy Landing Page',
          customerEmail: customerEmail,
          customerPhone: customerPhone,
          affiliateRef: affRef,
        }),
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('customer_email_copy_lp', customerEmail);
      }
    } catch (_) {
      // Continue
    } finally {
      setIsSubmitting(false);
      window.location.href = `/lp/sao-chep-landing-page/cam-on?email=${encodeURIComponent(customerEmail)}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-[#f5f4ef] font-sans antialiased selection:bg-[#00f2fe] selection:text-[#050811]">
      {/* Background Tech Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-25 z-0" 
        style={{
          backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
          backgroundSize: '54px 54px'
        }}
      />

      <main className="relative z-10 overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative px-5 pb-16 pt-10 sm:px-8 sm:pt-14 lg:pb-24">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            
            {/* Author Avatar & Brand */}
            <div className="mb-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-[0_0_35px_rgba(6,182,212,0.35)]">
                <div className="w-full h-full rounded-full bg-[#050811] flex items-center justify-center text-xl font-black text-cyan-400">
                  ĐAI
                </div>
              </div>
              <p className="mt-3 text-cyan-400 font-black text-sm tracking-wider uppercase">
                NGUYỄN ĐĂNG AI · TỰ HỌC AI (TUHOCAI.TOP)
              </p>
            </div>

            {/* Badges */}
            <div className="mb-7 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase text-cyan-300">
                DÀNH CHO NGƯỜI KINH DOANH
              </span>
              <span className="rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase text-purple-300">
                SKILL AI SIÊU ĐỈNH CHO BÁN HÀNG
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="max-w-4xl text-balance text-3xl sm:text-5xl lg:text-6xl font-black uppercase leading-[1.15] tracking-tight">
              SAO CHÉP BẤT KÌ LANDING PAGE CHUYỂN ĐỔI CAO BẠN MUỐN
              <span className="mt-3 block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-yellow-300 drop-shadow-[0_4px_30px_rgba(6,182,212,0.35)]">
                CHỈ VỚI 1 CLICK
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-7 max-w-2xl text-pretty text-sm sm:text-base font-medium leading-relaxed text-slate-300">
              Chỉ cần gửi link sale page bạn muốn sao chép, Skill AI độc quyền này sẽ phân tích và tái tạo ra trang giống 99,99% trang gốc và cho phép chỉnh sửa nội dung tùy ý thần tốc!
            </p>

            {/* 3 Metric Pillars */}
            <div className="mt-10 grid w-full max-w-4xl grid-cols-1 border-y border-slate-800 bg-slate-900/60 backdrop-blur-sm sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-800 rounded-2xl overflow-hidden border">
              <div className="px-5 py-6">
                <p className="text-xs font-bold uppercase text-slate-400">SKILL + VIDEO HƯỚNG DẪN</p>
                <p className="mt-2 text-3xl font-black text-cyan-400">01</p>
                <p className="mt-1 text-sm text-slate-400">Từng bước cụ thể</p>
              </div>
              <div className="px-5 py-6">
                <p className="text-xs font-bold uppercase text-slate-400">Chi phí</p>
                <p className="mt-2 text-3xl font-black text-yellow-400">99K</p>
                <p className="mt-1 text-sm text-slate-400">Bằng 1 ly trà sữa</p>
              </div>
              <div className="px-5 py-6">
                <p className="text-xs font-bold uppercase text-slate-400">Nhận ngay</p>
                <p className="mt-2 text-3xl font-black text-cyan-400">Email & Web</p>
                <p className="mt-1 text-sm text-slate-400">Kích hoạt tài khoản ngay</p>
              </div>
            </div>

            {/* CTA Button */}
            <button 
              onClick={() => setModalOpen(true)}
              className="mt-9 inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-8 py-4 text-base font-black text-[#050811] shadow-[0_10px_36px_rgba(6,182,212,0.3)] hover:opacity-95 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span>NHẬN TOÀN BỘ QUY TRÌNH (99K)</span>
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </button>
          </div>
        </section>

        {/* SECTION: BẠN SẼ NHẬN ĐƯỢC GÌ? */}
        <section className="border-y border-slate-800 bg-[#080d1a] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
              Bạn sẽ nhận được gì?
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl tracking-tight text-white">
              SKILL + HƯỚNG DẪN ĐỂ BẮT ĐẦU
            </h2>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                {
                  id: '01',
                  text: 'Toàn bộ quy trình + Skill sao chép landing page độc quyền được tối ưu cho Claude Code / Cursor / Codex.',
                },
                {
                  id: '02',
                  text: 'Hướng dẫn thực chiến từng bước: từ cào assets, cấu trúc layout đến chuyển đổi sang Next.js / Tailwind hoặc Blogger.',
                },
                {
                  id: '03',
                  text: 'Cách triển khai landing page THẦN TỐC bằng AI trong chưa đầy 15 phút, tiết kiệm hàng chục triệu tiền thuê code.',
                },
                {
                  id: '04',
                  text: 'Kích hoạt tài liệu trực tiếp vào tài khoản email của bạn trên hệ thống Tự Học AI kèm link Google Drive tải ngay.',
                },
              ].map((item) => (
                <article 
                  key={item.id}
                  className="flex gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 hover:border-cyan-500/40 transition-colors"
                >
                  <span className="text-4xl font-black text-cyan-400/25 select-none">
                    {item.id}
                  </span>
                  <div>
                    <div className="mb-4 flex size-8 items-center justify-center rounded-full bg-cyan-400 text-[#050811] shadow">
                      <Check className="size-4 stroke-[3]" />
                    </div>
                    <p className="font-semibold leading-relaxed text-slate-100">
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
              <div className="absolute inset-10 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
              <img 
                src="/sites/tuhocai-top/landing/drama/tra-sua.png" 
                alt="Một ly trà sữa" 
                className="relative w-full rounded-2xl object-cover border border-slate-800 shadow-2xl"
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
                Một món quà nhỏ
              </p>
              <h2 className="mt-3 text-4xl font-black uppercase leading-tight sm:text-5xl text-white">
                Mời NGUYỄN ĐĂNG AI 1 ly<br />
                <span className="text-yellow-400">trà sữa 99.000đ</span>
              </h2>
              <p className="mt-6 text-lg text-slate-300 leading-relaxed">
                Chỉ <strong className="text-white font-bold">99.000đ</strong> để nhận trọn bộ Skill AI Clone Landing Page thần tốc — một kỹ năng giúp bạn tạo ra hàng chục trang bán hàng đỉnh cao mỗi tuần cho doanh nghiệp của mình.
              </p>
              <div className="mt-7 inline-flex items-center gap-3 border-l-2 border-cyan-400 pl-4 text-sm font-bold uppercase text-cyan-400">
                Nhận trọn bộ quy trình ngay hôm nay
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: CHUYỂN KHOẢN NHANH CHÓNG */}
        <section id="nhan-quy-trinh" className="border-y border-slate-800 bg-[#080d1a] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
              Chuyển khoản nhanh chóng
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl text-white">
              Nhận toàn bộ quy trình
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-slate-300">
              Quét mã QR ngân hàng VIB, nhập số tiền 99.000đ và nội dung “copy landing page”. Chuyển khoản xong, bấm NHẬN QUY TRÌNH để hệ thống kích hoạt tài liệu vào tài khoản email của bạn.
            </p>

            <div className="mx-auto mt-10 grid max-w-4xl gap-8 rounded-2xl border border-slate-800 bg-[#0c1427] p-6 sm:p-10 text-left shadow-2xl md:grid-cols-[20rem_1fr]">
              {/* QR Image Box */}
              <div className="overflow-hidden rounded-xl bg-white p-4 shadow-inner flex flex-col items-center justify-center">
                <img 
                  src={qrUrl} 
                  alt="QR VietQR VIB 99.000đ" 
                  className="mx-auto w-full max-w-64 object-contain"
                />
                <span className="text-[11px] font-mono text-slate-700 mt-2 font-semibold">
                  Mã VietQR Ngân Hàng VIB
                </span>
              </div>

              {/* Payment Details */}
              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-bold uppercase text-cyan-400 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Thông tin chuyển khoản chính thức</span>
                </h3>

                <dl className="mt-5 divide-y divide-slate-800 border-y border-slate-800">
                  <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] items-center">
                    <dt className="text-sm text-slate-400">Ngân hàng</dt>
                    <dd className="font-bold text-white flex items-center justify-between">
                      <span>VIB (Ngân hàng Quốc Tế)</span>
                    </dd>
                  </div>
                  <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] items-center">
                    <dt className="text-sm text-slate-400">Chủ tài khoản</dt>
                    <dd className="font-bold text-white">NGUYEN VAN DANG</dd>
                  </div>
                  <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] items-center">
                    <dt className="text-sm text-slate-400">Số tài khoản</dt>
                    <dd className="font-mono font-bold text-yellow-400 text-base flex items-center justify-between">
                      <span>0934434101</span>
                      <button 
                        onClick={() => handleCopy('0934434101', 'bank')}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer bg-white/5 px-2 py-1 rounded"
                      >
                        {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedBank ? 'Đã copy' : 'Copy'}</span>
                      </button>
                    </dd>
                  </div>
                  <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] items-center">
                    <dt className="text-sm text-slate-400">Số tiền / Nội dung</dt>
                    <dd className="font-bold text-white flex items-center justify-between">
                      <span>99.000đ · copy landing page</span>
                      <button 
                        onClick={() => handleCopy('copy landing page', 'content')}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer bg-white/5 px-2 py-1 rounded"
                      >
                        {copiedContent ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedContent ? 'Đã copy' : 'Copy'}</span>
                      </button>
                    </dd>
                  </div>
                </dl>

                <p className="mt-6 text-sm text-slate-400">
                  Sau khi chuyển khoản, bấm <strong className="text-white">NHẬN QUY TRÌNH</strong> để điền email nhận link kích hoạt tài liệu ngay lập tức.
                </p>

                <button 
                  onClick={() => setModalOpen(true)}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 py-4 px-6 font-black text-[#050811] hover:opacity-95 transition-all shadow-[0_10px_30px_rgba(6,182,212,0.3)] cursor-pointer text-base uppercase"
                >
                  <span>NHẬN QUY TRÌNH VÀO EMAIL</span>
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: QUÀ TẶNG KHÁC */}
        <section className="px-5 py-20 text-center sm:px-8">
          <div className="mx-auto max-w-3xl">
            <Gift className="mx-auto size-12 text-cyan-400" />
            <h2 className="mt-5 text-3xl font-black uppercase sm:text-4xl text-white">
              Nhận các quà tặng khác
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              Kết nối trực tiếp cùng NGUYỄN ĐĂNG AI & TỰ HỌC AI để nhận thêm hàng trăm prompt, tài liệu và quy trình tự động hóa dành riêng cho cộng đồng.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a 
                href="https://zalo.me/g/tuhocai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-7 py-3.5 font-black text-[#050811] hover:opacity-95 shadow-[0_10px_30px_rgba(6,182,212,0.25)] transition-all text-sm uppercase"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Tham Gia Nhóm Zalo Tự Học AI</span>
              </a>
              <Link
                href="/bai-viet"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-7 py-3.5 font-bold text-white hover:border-cyan-500/40 transition-all text-sm"
              >
                <span>Xem Bài Viết Kỹ Thuật</span>
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-slate-800 px-5 py-8 text-center text-xs text-slate-400 bg-[#03050a]">
          <p>© 2026 NGUYỄN ĐĂNG AI · TỰ HỌC AI (tuhocai.top) · STK VIB: 0934434101</p>
        </footer>
      </main>

      {/* POPUP CHECKOUT */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#11192e] to-[#070b15] border border-cyan-500/40 p-6 sm:p-8 text-center shadow-2xl text-white">
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-2 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-cyan-400 font-extrabold text-xs tracking-widest uppercase mb-1">
              NGUYỄN ĐĂNG AI · TỰ HỌC AI
            </div>

            <h2 className="text-xl font-black uppercase text-white">
              KÍCH HOẠT SKILL CLONE LANDING PAGE
            </h2>

            <div className="my-3 text-3xl font-black text-yellow-400">
              99.000đ
            </div>

            <div className="inline-flex p-3 bg-white rounded-xl shadow-md my-1">
              <img 
                src={qrUrl} 
                alt="QR Code thanh toán VIB 99K" 
                className="w-48 h-auto object-contain"
              />
            </div>

            <div className="text-xs text-slate-300 bg-white/5 p-3 rounded-lg border border-white/10 my-2 text-left space-y-1">
              <div>Ngân hàng: <strong className="text-white">VIB</strong></div>
              <div>Số TK: <strong className="text-yellow-400">0934434101</strong></div>
              <div>Chủ TK: <strong className="text-white">NGUYEN VAN DANG</strong></div>
              <div>Nội dung: <strong className="text-white">copy landing page</strong></div>
            </div>

            <form onSubmit={handleConfirmPayment} className="mt-4 space-y-3 text-left">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Email nhận tài liệu và mở khóa (Bắt buộc):
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="name@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Họ và tên của bạn:
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Số điện thoại / Zalo:
                </label>
                <input 
                  type="tel" 
                  required
                  placeholder="Ví dụ: 0912345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-yellow-300 text-[#050811] font-black text-sm uppercase tracking-wider hover:opacity-95 cursor-pointer shadow-lg transition-all flex items-center justify-center gap-2"
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
          </div>
        </div>
      )}
    </div>
  );
}
