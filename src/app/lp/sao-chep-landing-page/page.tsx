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
  Code2,
  Clock,
  FileCode,
  Video,
  FileText,
  Lock,
  Flame,
  ChevronRight
} from 'lucide-react';
import { trackLandingPageView, trackLandingPageCtaClick, getStoredUtm } from '@/lib/funnelTracker';

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
  const [formError, setFormError] = useState('');

  // Urgency Countdown 14:59
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 59 });

  // Dynamic Bank Settings from Admin (default ACB)
  const [bankSettings, setBankSettings] = useState({
    bankId: 'ACB',
    accountNo: '4747827',
    accountName: 'NGUYEN VAN DANG',
  });

  useEffect(() => {
    fetch('/api/settings/public')
      .then(res => res.json())
      .then(data => {
        if (data.bank_id && data.account_no) {
          setBankSettings({
            bankId: data.bank_id,
            accountNo: data.account_no,
            accountName: data.account_name || 'NGUYEN VAN DANG',
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { minutes: 14, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // VietQR Dynamic
  const qrUrl = `https://img.vietqr.io/image/${bankSettings.bankId}-${bankSettings.accountNo}-compact2.png?amount=99000&addInfo=copy%20landing%20page&accountName=${encodeURIComponent(bankSettings.accountName)}`;

  // Track pageview & affiliate
  useEffect(() => {
    trackLandingPageView('sao-chep-landing-page');
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

  const handleOpenCheckout = () => {
    trackLandingPageCtaClick('sao-chep-landing-page');
    let refParam = '';
    if (typeof window !== 'undefined') {
      const ref = localStorage.getItem('tuhocai_aff_ref');
      if (ref) refParam = `&ref=${encodeURIComponent(ref)}`;
    }
    window.location.href = `/thanh-toan?pid=SKILL-CLONE-099${refParam}`;
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
      const utmData = getStoredUtm('sao-chep-landing-page');

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'SKILL-CLONE-099',
          customerName: customerName || 'Học Viên Copy Landing Page',
          customerEmail: cleanEmail,
          customerPhone: cleanPhone,
          affiliateRef: affRef,
          landingSlug: 'sao-chep-landing-page',
          utmSource: utmData.utmSource,
          utmMedium: utmData.utmMedium,
          utmCampaign: utmData.utmCampaign,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        setFormError(resData.error || 'Có lỗi xảy ra khi tạo đơn hàng');
        setIsSubmitting(false);
        return;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('customer_email_copy_lp', cleanEmail);
      }
      window.location.href = `/lp/sao-chep-landing-page/cam-on?email=${encodeURIComponent(cleanEmail)}`;
    } catch (_) {
      setFormError('Không thể kết nối máy chủ. Vui lòng thử lại.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-[#f5f4ef] font-sans antialiased selection:bg-[#00f2fe] selection:text-[#050811] pb-24 md:pb-12">
      {/* Background Tech Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-25 z-0" 
        style={{
          backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
          backgroundSize: '54px 54px'
        }}
      />

      {/* TOP URGENCY BANNER */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-amber-500 via-rose-600 to-cyan-500 py-2.5 px-3 text-center text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-lg flex items-center justify-center gap-2 flex-wrap">
        <Flame className="w-4 h-4 text-yellow-300 animate-bounce flex-shrink-0" />
        <span>ƯU ĐÃI FLASH SALE: GIÁ CHỈ 99.000đ (GIÁ GỐC 499.000đ)</span>
        <span className="hidden sm:inline">·</span>
        <div className="inline-flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md font-mono text-yellow-300 text-xs font-black">
          <Clock className="w-3.5 h-3.5" />
          <span>{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
        <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Chỉ còn 8 suất</span>
      </div>

      <main className="relative z-10 overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative px-4 pb-14 pt-8 sm:px-8 sm:pt-14 lg:pb-20">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            
            {/* Author Avatar & Brand */}
            <div className="mb-6 flex flex-col items-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-[0_0_35px_rgba(6,182,212,0.35)]">
                <div className="w-full h-full rounded-full bg-[#050811] flex items-center justify-center text-xl font-black text-cyan-400">
                  ĐAI
                </div>
              </div>
              <p className="mt-3 text-cyan-400 font-black text-xs sm:text-sm tracking-wider uppercase">
                NGUYỄN ĐĂNG AI · TỰ HỌC AI (TUHOCAI.TOP)
              </p>
            </div>

            {/* Badges */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1.5 text-xs sm:text-sm font-bold uppercase text-cyan-300">
                DÀNH CHO NGƯỜI KINH DOANH
              </span>
              <span className="rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-1.5 text-xs sm:text-sm font-bold uppercase text-purple-300">
                SKILL AI SIÊU ĐỈNH CHO BÁN HÀNG
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="max-w-4xl text-balance text-2xl sm:text-5xl lg:text-6xl font-black uppercase leading-[1.2] tracking-tight">
              SAO CHÉP BẤT KÌ LANDING PAGE CHUYỂN ĐỔI CAO BẠN MUỐN
              <span className="mt-2 block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-yellow-300 drop-shadow-[0_4px_30px_rgba(6,182,212,0.35)]">
                CHỈ VỚI 1 CLICK
              </span>
            </h1>

            {/* Subheadline (CÂN CHỈNH FONT RÕ NÉT TRÊN MOBILE) */}
            <p className="mt-6 max-w-2xl text-pretty text-base sm:text-lg font-medium leading-relaxed text-slate-200">
              Chỉ cần gửi link sale page bạn muốn sao chép, Skill AI độc quyền này sẽ phân tích và tái tạo ra trang giống 99,99% trang gốc và cho phép chỉnh sửa nội dung tùy ý thần tốc!
            </p>

            {/* 3 Metric Pillars (CÂN CHỈNH FONT CHỮ LỚN DỄ ĐỌC) */}
            <div className="mt-8 grid w-full max-w-4xl grid-cols-1 border-y border-slate-800 bg-slate-900/60 backdrop-blur-sm sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-800 rounded-2xl overflow-hidden border">
              <div className="px-4 py-5 sm:px-6 sm:py-6">
                <p className="text-xs sm:text-sm font-bold uppercase text-slate-300">SKILL + VIDEO HƯỚNG DẪN</p>
                <p className="mt-1 text-2xl sm:text-4xl font-black text-cyan-400">01</p>
                <p className="mt-1 text-xs sm:text-sm text-slate-300 font-medium">Từng bước cụ thể</p>
              </div>
              <div className="px-4 py-5 sm:px-6 sm:py-6">
                <p className="text-xs sm:text-sm font-bold uppercase text-slate-300">Chi phí Flash Sale</p>
                <p className="mt-1 text-2xl sm:text-4xl font-black text-yellow-400">99K <span className="text-xs line-through text-slate-500 font-normal">499K</span></p>
                <p className="mt-1 text-xs sm:text-sm text-slate-300 font-medium">Bằng 1 ly trà sữa</p>
              </div>
              <div className="px-4 py-5 sm:px-6 sm:py-6">
                <p className="text-xs sm:text-sm font-bold uppercase text-slate-300">Nhận ngay lập tức</p>
                <p className="mt-1 text-2xl sm:text-4xl font-black text-cyan-400">Email & Web</p>
                <p className="mt-1 text-xs sm:text-sm text-slate-300 font-medium">Kích hoạt tài khoản ngay</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <a 
                href="#nhan-quy-trinh"
                onClick={handleOpenCheckout}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-8 py-4 text-base font-black text-[#050811] shadow-[0_10px_36px_rgba(6,182,212,0.3)] hover:opacity-95 active:scale-95 transition-all cursor-pointer"
              >
                <span>NHẬN TOÀN BỘ QUY TRÌNH (99K)</span>
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </a>
              <button
                onClick={handleOpenCheckout}
                className="w-full sm:w-auto px-6 py-4 rounded-xl border border-cyan-500/40 bg-cyan-950/30 text-cyan-300 font-bold text-sm hover:bg-cyan-950/60 transition-colors cursor-pointer"
              >
                Mở Form Kích Hoạt Nhanh
              </button>
            </div>
          </div>
        </section>

        {/* SECTION: FILE EXPLORER TEASER - XEM TRƯỚC TÀI LIỆU */}
        <section className="px-4 py-12 sm:px-8 border-t border-slate-800 bg-[#060b18]">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full">
                SNEAK PEEK · XEM TRƯỚC TÀI SẢN SỐ
              </span>
              <h2 className="mt-3 text-2xl sm:text-4xl font-black uppercase text-white">
                BÊN TRONG GÓI TÀI LIỆU BẠN SẼ NHẬN
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl mx-auto">
                File nguồn thực chiến, prompt chuẩn hóa và video thao tác trực tiếp, mở khóa tức thì qua Drive và Email.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-sm">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 text-xs sm:text-sm text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-slate-300 font-bold">tuhocai-vip / skill-clone-landing-page /</span>
                </div>
                <span className="text-cyan-400 font-bold">4 files · Mở khóa 100%</span>
              </div>

              <div className="divide-y divide-slate-800/80 text-sm">
                <div className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 flex-shrink-0">
                      <FileCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-mono text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        <span>01_Skill_AI_Clone_Landing_Page.md</span>
                        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">Core Skill</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">Tệp cấu hình Agentic Skill cho Claude Code, Cursor, Codex, OpenCode</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono flex-shrink-0">38.4 KB</span>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-mono text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        <span>02_Cursorrules_Blogger_Nextjs.txt</span>
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">Rules</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">Bộ luật chỉ thị AI tái tạo CSS, giữ nguyên responsive mobile 1:1</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono flex-shrink-0">12.1 KB</span>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-mono text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        <span>03_Prompt_Dao_Nguoc_Component.txt</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">Prompt</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">Prompt trích xuất typography, layout, icons và bảng màu chuẩn</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono flex-shrink-0">8.7 KB</span>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-mono text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        <span>04_Video_Huong_Dan_1_Click.mp4</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">1080p HD</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">Video hướng dẫn thực chiến 15 phút, người mới chưa biết lập trình vẫn làm được</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono flex-shrink-0">142 MB</span>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-r from-cyan-950/60 to-slate-950 border-t border-slate-800 text-center text-xs sm:text-sm text-slate-300 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4 text-yellow-400" />
                <span>Toàn bộ 4 tài nguyên sẽ tự động mở khóa ngay sau khi thanh toán thành công 99K</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: BẠN SẼ NHẬN ĐƯỢC GÌ? */}
        <section className="border-y border-slate-800 bg-[#080d1a] px-4 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-cyan-400">
              Bạn sẽ nhận được gì?
            </p>
            <h2 className="mt-3 text-2xl font-black uppercase sm:text-4xl lg:text-5xl tracking-tight text-white">
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
                  text: 'Kích hoạt tài liệu trực tiếp vào tài khoản của bạn trên hệ thống Tự Học AI trong mục Kho Của Tôi.',
                },
              ].map((item) => (
                <article 
                  key={item.id}
                  className="flex gap-4 sm:gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-7 hover:border-cyan-500/40 transition-colors"
                >
                  <span className="text-3xl sm:text-4xl font-black text-cyan-400/25 select-none">
                    {item.id}
                  </span>
                  <div>
                    <div className="mb-3 flex size-8 items-center justify-center rounded-full bg-cyan-400 text-[#050811] shadow">
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
        <section className="px-4 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative mx-auto max-w-sm">
              <div className="absolute inset-10 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
              <img 
                src="/sites/tuhocai-top/landing/drama/tra-sua.png" 
                alt="Một ly trà sữa" 
                className="relative w-full rounded-2xl object-cover border border-slate-800 shadow-2xl"
              />
            </div>

            <div>
              <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-cyan-400">
                Một món quà nhỏ
              </p>
              <h2 className="mt-3 text-3xl font-black uppercase leading-tight sm:text-5xl text-white">
                Mời NGUYỄN ĐĂNG AI 1 ly<br />
                <span className="text-yellow-400">trà sữa 99.000đ</span>
              </h2>
              <p className="mt-5 text-base sm:text-lg text-slate-200 leading-relaxed">
                Chỉ <strong className="text-white font-bold">99.000đ</strong> để nhận trọn bộ Skill AI Clone Landing Page thần tốc — một kỹ năng giúp bạn tạo ra hàng chục trang bán hàng đỉnh cao mỗi tuần cho doanh nghiệp của mình.
              </p>
              <div className="mt-6 inline-flex items-center gap-3 border-l-2 border-cyan-400 pl-4 text-xs sm:text-sm font-bold uppercase text-cyan-400">
                Nhận trọn bộ quy trình ngay hôm nay
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: CHUYỂN KHOẢN NHANH CHÓNG (MOBILE-FIRST) */}
        <section id="nhan-quy-trinh" className="border-y border-slate-800 bg-[#080d1a] px-4 py-16 sm:px-8 lg:py-24 scroll-mt-6">
          <div className="mx-auto max-w-5xl text-center">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3.5 py-1 rounded-full border border-cyan-500/30">
              Chuyển khoản nhanh chóng · Tự động kích hoạt
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl lg:text-5xl font-black uppercase text-white">
              Nhận toàn bộ quy trình
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-200 text-sm sm:text-base leading-relaxed">
              Quét mã QR ngân hàng {bankSettings.bankId}, nhập số tiền 99.000đ và nội dung “copy landing page”. Sau đó bấm nút kích hoạt để nhận tài liệu trực tiếp vào Email.
            </p>

            <div className="mx-auto mt-8 grid max-w-4xl gap-6 rounded-2xl border border-slate-800 bg-[#0c1427] p-5 sm:p-8 text-left shadow-2xl md:grid-cols-[20rem_1fr]">
              {/* QR Image Box */}
              <div className="overflow-hidden rounded-xl bg-white p-4 shadow-inner flex flex-col items-center justify-center">
                <img 
                  src={qrUrl} 
                  alt={`QR VietQR ${bankSettings.bankId} 99.000đ`} 
                  className="mx-auto w-full max-w-60 object-contain"
                />
                <span className="text-xs font-mono text-slate-700 mt-2 font-semibold">
                  Mã VietQR Ngân Hàng {bankSettings.bankId}
                </span>
                <span className="text-[11px] text-slate-500 text-center mt-1">
                  (Dùng mọi App Ngân Hàng để quét)
                </span>
              </div>

              {/* Payment Details */}
              <div className="flex flex-col justify-center">
                <h3 className="text-base sm:text-lg font-bold uppercase text-cyan-400 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <span>Thông tin chuyển khoản chính thức</span>
                </h3>

                {/* 3 ONE-TAP QUICK COPY BUTTONS (ƯU TIÊN MOBILE) */}
                <div className="mt-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-2">
                  <p className="text-xs font-bold uppercase text-cyan-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Dành cho điện thoại: Bấm copy 1-chạm dán sang Banking</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => handleCopy(bankSettings.accountNo, 'bank')}
                      className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs sm:text-sm font-semibold text-white flex items-center justify-between cursor-pointer transition-all active:scale-95"
                    >
                      <span>STK: <strong className="text-yellow-400 font-mono">{bankSettings.accountNo}</strong></span>
                      {copiedBank ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    </button>

                    <button
                      onClick={() => handleCopy('99000', 'amount')}
                      className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs sm:text-sm font-semibold text-white flex items-center justify-between cursor-pointer transition-all active:scale-95"
                    >
                      <span>Tiền: <strong className="text-yellow-400 font-mono">99.000đ</strong></span>
                      {copiedAmount ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    </button>

                    <button
                      onClick={() => handleCopy('copy landing page', 'content')}
                      className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs sm:text-sm font-semibold text-white flex items-center justify-between cursor-pointer transition-all active:scale-95"
                    >
                      <span>Nội dung: <strong className="text-cyan-300 font-mono">copy landing page</strong></span>
                      {copiedContent ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>
                </div>

                <dl className="mt-4 divide-y divide-slate-800 border-y border-slate-800">
                  <div className="grid gap-1 py-2.5 sm:grid-cols-[8rem_1fr] items-center text-sm">
                    <dt className="text-slate-400">Ngân hàng</dt>
                    <dd className="font-bold text-white">{bankSettings.bankId}</dd>
                  </div>
                  <div className="grid gap-1 py-2.5 sm:grid-cols-[8rem_1fr] items-center text-sm">
                    <dt className="text-slate-400">Chủ tài khoản</dt>
                    <dd className="font-bold text-white">{bankSettings.accountName}</dd>
                  </div>
                  <div className="grid gap-1 py-2.5 sm:grid-cols-[8rem_1fr] items-center text-sm">
                    <dt className="text-slate-400">Số tài khoản</dt>
                    <dd className="font-mono font-bold text-yellow-400 text-base sm:text-lg flex items-center justify-between">
                      <span>{bankSettings.accountNo}</span>
                      <button 
                        onClick={() => handleCopy(bankSettings.accountNo, 'bank')}
                        className="text-xs sm:text-sm text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer bg-white/5 px-2.5 py-1 rounded"
                      >
                        {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedBank ? 'Đã copy' : 'Copy'}</span>
                      </button>
                    </dd>
                  </div>
                  <div className="grid gap-1 py-2.5 sm:grid-cols-[8rem_1fr] items-center text-sm">
                    <dt className="text-slate-400">Số tiền / Nội dung</dt>
                    <dd className="font-bold text-white flex items-center justify-between">
                      <span>99.000đ · copy landing page</span>
                      <button 
                        onClick={() => handleCopy('copy landing page', 'content')}
                        className="text-xs sm:text-sm text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer bg-white/5 px-2.5 py-1 rounded"
                      >
                        {copiedContent ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedContent ? 'Đã copy' : 'Copy'}</span>
                      </button>
                    </dd>
                  </div>
                </dl>

                <p className="mt-4 text-xs sm:text-sm text-slate-300">
                  Bấm <strong className="text-cyan-300">TIẾN HÀNH ĐẶT MUA</strong> để hệ thống tạo mã đơn hàng & mã VietQR riêng biệt kích hoạt tự động 100%.
                </p>

                <button 
                  onClick={handleOpenCheckout}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 py-4 px-6 font-black text-[#050811] hover:opacity-95 transition-all shadow-[0_10px_30px_rgba(6,182,212,0.3)] cursor-pointer text-base uppercase"
                >
                  <span>TIẾN HÀNH ĐẶT MUA (99.000đ)</span>
                  <Sparkles className="w-5 h-5" />
                </button>

                {/* HỖ TRỢ KỸ THUẬT QUA ZALO */}
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

        {/* SECTION: QUÀ TẶNG KHÁC */}
        <section className="px-4 py-16 text-center sm:px-8">
          <div className="mx-auto max-w-3xl">
            <Gift className="mx-auto size-10 sm:size-12 text-cyan-400" />
            <h2 className="mt-4 text-2xl font-black uppercase sm:text-4xl text-white">
              Nhận các quà tặng khác
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              Kết nối trực tiếp cùng NGUYỄN ĐĂNG AI & TỰ HỌC AI để nhận thêm hàng trăm prompt, tài liệu và quy trình tự động hóa dành riêng cho cộng đồng.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a 
                href="https://zalo.me/g/tuhocai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-6 py-3.5 font-black text-[#050811] hover:opacity-95 shadow-[0_10px_30px_rgba(6,182,212,0.25)] transition-all text-sm uppercase"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Tham Gia Nhóm Zalo Tự Học AI</span>
              </a>
              <Link
                href="/bai-viet"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-6 py-3.5 font-bold text-white hover:border-cyan-500/40 transition-all text-sm"
              >
                <span>Xem Bài Viết Kỹ Thuật</span>
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-slate-800 px-4 py-8 text-center text-xs sm:text-sm text-slate-400 bg-[#03050a]">
          <p>© 2026 NGUYỄN ĐĂNG AI · TỰ HỌC AI (tuhocai.top) · STK {bankSettings.bankId}: {bankSettings.accountNo} · Zalo: 0938.494.303</p>
        </footer>
      </main>

      {/* MOBILE STICKY FLOATING CTA BAR (CHỈ HIỆN TRÊN MOBILE) */}
      <aside aria-label="Thanh ưu đãi chốt đơn nhanh" className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#070d1d]/95 backdrop-blur-lg border-t border-cyan-500/30 p-3 px-4 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-yellow-400">99.000đ</span>
              <span className="text-xs text-slate-400 line-through">499.000đ</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-cyan-300 font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Flash Sale {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>

          <a
            href="#nhan-quy-trinh"
            onClick={handleOpenCheckout}
            className="flex-1 max-w-[200px] py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-[#050811] font-black text-sm uppercase tracking-wider text-center shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1"
          >
            <span>Nhận Skill Ngay</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </aside>

      {/* POPUP CHECKOUT */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#11192e] to-[#070b15] border border-cyan-500/40 p-5 sm:p-7 text-center shadow-2xl text-white">
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

            <div className="my-2 text-3xl font-black text-yellow-400">
              99.000đ <span className="text-xs line-through text-slate-500 font-normal">499.000đ</span>
            </div>

            <div className="inline-flex p-2.5 bg-white rounded-xl shadow-md my-1">
              <img 
                src={qrUrl} 
                alt={`QR Code thanh toán ${bankSettings.bankId} 99K`} 
                className="w-44 h-auto object-contain"
              />
            </div>

            {/* 3 Nút Copy trong Modal */}
            <div className="grid grid-cols-3 gap-1.5 my-2">
              <button
                type="button"
                onClick={() => handleCopy(bankSettings.accountNo, 'bank')}
                className="p-2 rounded bg-white/10 hover:bg-white/20 text-xs font-bold text-yellow-400 flex items-center justify-center gap-1 cursor-pointer"
              >
                {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBank ? 'Đã copy' : 'Copy STK'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleCopy('99000', 'amount')}
                className="p-2 rounded bg-white/10 hover:bg-white/20 text-xs font-bold text-yellow-400 flex items-center justify-center gap-1 cursor-pointer"
              >
                {copiedAmount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAmount ? 'Đã copy' : 'Copy 99K'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleCopy('copy landing page', 'content')}
                className="p-2 rounded bg-white/10 hover:bg-white/20 text-xs font-bold text-cyan-300 flex items-center justify-center gap-1 cursor-pointer"
              >
                {copiedContent ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedContent ? 'Đã copy' : 'Copy ND'}</span>
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-300 bg-white/5 p-3 rounded-lg border border-white/10 my-2 text-left space-y-1">
              <div>Ngân hàng: <strong className="text-white">{bankSettings.bankId}</strong></div>
              <div>Số TK: <strong className="text-yellow-400">{bankSettings.accountNo}</strong></div>
              <div>Chủ TK: <strong className="text-white">{bankSettings.accountName}</strong></div>
              <div>Nội dung: <strong className="text-white">copy landing page</strong></div>
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
                  className="w-full px-3.5 py-3 rounded-lg bg-black/50 border border-slate-700 text-base text-white focus:outline-none focus:border-cyan-400"
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
                  className="w-full px-3.5 py-3 rounded-lg bg-black/50 border border-slate-700 text-base text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs sm:text-sm font-bold text-slate-200 block">
                    Số điện thoại (Đúng 10 số):
                  </label>
                  <span className="text-[11px] text-yellow-300 font-medium">Mật khẩu Kho Của Tôi</span>
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
                  className="w-full px-3.5 py-3 rounded-lg bg-black/50 border border-slate-700 text-base text-white focus:outline-none focus:border-cyan-400"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  *SĐT này sẽ là mật khẩu mặc định để bạn đăng nhập tra cứu và tải tài liệu trọn đời.
                </p>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="mt-3 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-yellow-300 text-[#050811] font-black text-sm sm:text-base uppercase tracking-wider hover:opacity-95 cursor-pointer shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Đang kích hoạt tài khoản...</span>
                ) : (
                  <>
                    <Mail className="w-5 h-5 text-black" />
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
