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
  ChevronRight,
  Flame
} from 'lucide-react';

export default function VideoAiTu1AnhPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  
  // Checkout form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown timer 14:59
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

  // VietQR VIB 297K
  const qrUrl = "https://img.vietqr.io/image/VIB-0934434101-compact2.png?amount=297000&addInfo=video%20ai%201%20anh&accountName=NGUYEN%20VAN%20DANG";

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
          body: JSON.stringify({ ref, landingPath: '/lp/video-ai-tu-1-anh' }),
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
          productId: 'WF-VIP-297',
          customerName: customerName || 'Học Viên Video AI 1 Ảnh',
          customerEmail: customerEmail,
          customerPhone: customerPhone,
          affiliateRef: affRef,
        }),
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('customer_email_video_vip', customerEmail);
      }
    } catch (_) {
      // Continue
    } finally {
      setIsSubmitting(false);
      window.location.href = `/lp/video-ai-tu-1-anh/cam-on?email=${encodeURIComponent(customerEmail)}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0a06] text-[#f7f2eb] font-sans antialiased selection:bg-[#eab84e] selection:text-[#100c08] pb-24 md:pb-12">
      {/* Background Ambience */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 z-0" 
        style={{
          backgroundImage: 'linear-gradient(to right, #382c1e 1px, transparent 1px), linear-gradient(to bottom, #382c1e 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }}
      />

      {/* FLASH SALE TOP BANNER */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-amber-500 via-[#eab84e] to-amber-600 text-black px-3 py-2 text-center text-xs sm:text-sm font-black tracking-wide shadow-md flex items-center justify-center gap-2 flex-wrap">
        <Flame className="w-4 h-4 fill-black animate-pulse flex-shrink-0" />
        <span>ƯU ĐÃI FLASH SALE: GIÁ CHỈ 297.000đ (GIÁ GỐC 1.200.000đ) · KẾT THÚC TRONG:</span>
        <span className="font-mono bg-black text-[#f8d575] px-2 py-0.5 rounded text-xs font-black">
          {formatTimer(timeLeft)}
        </span>
        <span className="text-[11px] bg-black/20 px-2 py-0.5 rounded font-bold">Còn 5 suất</span>
      </div>

      {/* HEADER */}
      <header className="relative z-20 border-b border-[#2a2015] bg-[#140e08]/90 backdrop-blur-md px-4 py-3 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/lp/video-ai-tu-1-anh" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#eab84e] to-amber-600 p-0.5">
              <div className="w-full h-full rounded-full bg-[#100c08] flex items-center justify-center text-xs font-black text-[#eab84e]">
                ĐAI
              </div>
            </div>
            <div>
              <span className="text-sm font-black text-white block leading-tight">NGUYỄN ĐĂNG AI</span>
              <small className="text-[11px] font-bold text-[#eab84e] uppercase tracking-wider">Tự Học AI (tuhocai.top)</small>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <a href="#quy-trinh" className="hidden sm:inline text-xs sm:text-sm font-semibold text-slate-300 hover:text-[#eab84e] transition-colors">
              Nội dung khóa học
            </a>
            <button 
              onClick={() => setModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#eab84e] text-[#100c08] font-black text-xs uppercase hover:bg-[#f8d575] shadow-[0_0_20px_rgba(234,184,78,0.25)] transition-all cursor-pointer"
            >
              Nhận quy trình · 297K
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="px-4 py-10 sm:px-8 sm:py-16 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
            {/* Copy & Video Embed */}
            <div className="space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold uppercase bg-[#eab84e]/10 text-[#eab84e] border border-[#eab84e]/30">
                <Sparkles className="w-4 h-4" />
                Giải pháp video AI độc quyền 2026
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase leading-[1.12] tracking-tight text-white">
                LÀM VIDEO XÂY DỰNG THƯƠNG HIỆU BÁN HÀNG TRIỆU VIEW TỪ 1 ẢNH
              </h1>

              <p className="text-base sm:text-lg text-[#f8d575] font-semibold italic">
                “Biến 1 Bức Ảnh Tĩnh Thành Cỗ Máy Video Triệu View Bán Hàng Tự Động”
              </p>

              {/* YouTube Video Player Embed */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden border-2 border-[#eab84e]/50 shadow-[0_0_40px_rgba(234,184,78,0.2)] bg-black">
                <iframe 
                  src="https://www.youtube.com/embed/KOAKDMxpPxI" 
                  title="Video AI minh họa triệu view" 
                  loading="lazy" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              <p className="text-xs sm:text-sm text-slate-300">
                <a href="https://www.youtube.com/watch?v=KOAKDMxpPxI" target="_blank" rel="noopener noreferrer" className="text-[#f8d575] underline">
                  Nếu video không phát, bấm xem trực tiếp trên YouTube
                </a>
              </p>

              {/* FONT NỘI DUNG RÕ RÀNG TRÊN MOBILE */}
              <p className="text-base sm:text-lg leading-relaxed text-slate-200">
                Giải pháp độc quyền từ Nguyễn Đăng AI giúp bạn biến ảnh chân dung hoặc sản phẩm tĩnh thành video nói chuyện tự nhiên, biểu cảm thần thái và bối cảnh chuẩn studio sang trọng. Hơn <strong>12.000+ học viên</strong> đã tự tin xây kênh và bùng nổ doanh số mỗi ngày.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button 
                  onClick={() => setModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#eab84e] text-[#100c08] font-black text-base uppercase hover:bg-[#f8d575] shadow-[0_10px_35px_rgba(234,184,78,0.3)] transition-all cursor-pointer text-center"
                >
                  NHẬN QUY TRÌNH · 297.000Đ
                </button>
                <a 
                  href="#quy-trinh"
                  className="w-full sm:w-auto px-6 py-4 rounded-xl border border-[#2a2015] bg-[#1a130c] text-white font-bold text-sm text-center hover:border-[#eab84e]/40 transition-colors"
                >
                  Xem chi tiết 4 Module
                </a>
              </div>
            </div>

            {/* Proof Image */}
            <div className="relative">
              <div className="absolute inset-4 rounded-3xl bg-[#eab84e]/10 blur-3xl pointer-events-none" />
              <div className="relative rounded-2xl overflow-hidden border border-[#2a2015] shadow-2xl bg-[#140e08]">
                <img 
                  src="/sites/tuhocai-top/landing/video-vip/ket-qua-video.jpg" 
                  alt="Ảnh chụp kết quả video 333,9K lượt xem" 
                  className="w-full h-auto object-cover"
                />
                <div className="p-3.5 bg-[#140e08]/90 border-t border-[#2a2015] text-center">
                  <p className="text-xs sm:text-sm font-bold text-[#eab84e] uppercase flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Kết quả thực tế: Video đạt 333.900 lượt xem tự nhiên</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SNEAK PEEK: KHO TÀI LIỆU BÊN TRONG CÓ GÌ? */}
        <section className="border-t border-[#2a2015] bg-[#110b06] px-4 py-12 sm:px-8">
          <div className="max-w-4xl mx-auto space-y-5">
            <div className="text-center space-y-1.5">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#eab84e] bg-[#eab84e]/10 px-3 py-1 rounded-full border border-[#eab84e]/20">
                Minh bạch 100% · Nội dung bạn sẽ nhận được
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">
                Bên trong kho quy trình VIP của bạn
              </h2>
            </div>

            <div className="rounded-2xl border border-[#2a2015] bg-[#160f08] p-5 sm:p-7 space-y-3 font-mono shadow-xl">
              <div className="flex items-center gap-2 text-[#eab84e] font-bold pb-2 border-b border-[#2a2015] text-xs sm:text-sm">
                <FolderDown className="w-4 h-4 text-[#eab84e]" />
                <span>KHO_TAI_LIEU_VIDEO_AI_1_ANH_TUHOCAI/</span>
              </div>
              <div className="space-y-2.5 pt-1 text-slate-200">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-[#eab84e]/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-white font-semibold text-xs sm:text-sm block">01_Prompt_Tao_Boi_Canh_Studio_Trieu_Do.txt</span>
                      <span className="text-[11px] text-slate-400">Prompt set ánh sáng và bối cảnh chuẩn quốc tế</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 hidden sm:inline">14.2 KB</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-[#eab84e]/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-white font-semibold text-xs sm:text-sm block">02_Video_Thuc_Hanh_Dong_Bo_Khau_Hinh_LivePortrait.mp4</span>
                      <span className="text-[11px] text-slate-400">Video thực chiến tạo chuyển động khớp từng từ</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 hidden sm:inline">210 MB</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-[#eab84e]/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-white font-semibold text-xs sm:text-sm block">03_Bo_Template_Kich_Ban_Ban_Hang_Chuyen_Doi_Cao.docx</span>
                      <span className="text-[11px] text-slate-400">12 khung kịch bản video bán hàng triệu view</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 hidden sm:inline">88 KB</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-[#eab84e]/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-yellow-400 shrink-0" />
                    <div>
                      <span className="text-white font-semibold text-xs sm:text-sm block">04_Kenh_Ho_Tro_Truc_Tiep_Zalo_Nguyen_Dang_AI.pdf</span>
                      <span className="text-[11px] text-slate-400">Quyền kết nối hỗ trợ kỹ thuật qua Zalo 0938.494.303</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 hidden sm:inline">VIP</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: ỨNG DỤNG */}
        <section className="border-y border-[#2a2015] bg-[#140e08] px-4 py-14 sm:px-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#eab84e]">Ứng dụng thực chiến</p>
              <h2 className="text-2xl sm:text-4xl font-black uppercase text-white">
                Từ ảnh tĩnh đến video <em className="text-[#eab84e] not-italic">có thể đăng ngay</em>
              </h2>
              <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto">
                Một quy trình gọn nhẹ để bạn chủ động sản xuất nội dung hàng ngày mà không cần chuẩn bị máy quay hoặc studio đắt đỏ.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { num: '01', title: 'Nhân vật có lời thoại', desc: 'Chuẩn bị kịch bản, giọng đọc AI và chuyển động khẩu hình đồng bộ khớp từng giây.' },
                { num: '02', title: 'Thay đổi bối cảnh linh hoạt', desc: 'Tạo các phiên bản bối cảnh studio triệu đô và trang phục phục vụ từng chủ đề bán hàng.' },
                { num: '03', title: 'Thử nghiệm nhiều phiên bản', desc: 'Đổi hook mở đầu, lời thoại và cách kêu gọi hành động để tìm video ăn đề xuất triệu view.' },
              ].map((item) => (
                <article key={item.num} className="p-5 rounded-xl border border-[#2a2015] bg-[#1c140d] space-y-2.5">
                  <span className="text-3xl sm:text-4xl font-black text-[#eab84e]/30 select-none">{item.num}</span>
                  <h3 className="text-base sm:text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: 4 PHẦN CHUYỂN GIAO */}
        <section id="quy-trinh" className="px-4 py-14 sm:px-8 max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#eab84e]">Trọn bộ chuyển giao</p>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white">
              Bốn phần để <em className="text-[#eab84e] not-italic">bắt đầu làm video AI ngay</em>
            </h2>
            <p className="text-sm sm:text-base text-slate-200">Tài liệu, mẫu câu lệnh Prompt và hướng dẫn thực hành từng bước.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { num: '01 / Ảnh', title: 'Chuẩn bị ảnh chân dung hoặc sản phẩm', desc: 'Kỹ thuật chọn ảnh sắc nét, cân chỉnh tỷ lệ và bố cục chuẩn 9:16 cho TikTok/Reels.' },
              { num: '02 / Prompt', title: 'Viết kịch bản và câu lệnh độc quyền', desc: 'Bộ khung Prompt thiết lập thần thái nhân vật, cử chỉ tự nhiên và ánh sáng studio.' },
              { num: '03 / Video', title: 'Thực hành xuất video chất lượng cao', desc: 'Quy trình tạo chuyển động mượt mà, khử méo hình và ghép hoàn thiện 1 video trong 10 phút.' },
              { num: '04 / Hỗ trợ', title: 'Kích hoạt tài khoản email trên tuhocai.top', desc: 'Lưu trữ vĩnh viễn tài liệu trong kho cá nhân, kèm kênh hỗ trợ kỹ thuật qua Zalo 0938.494.303.' },
            ].map((m) => (
              <div key={m.num} className="p-5 sm:p-6 rounded-xl border border-[#2a2015] bg-[#140e08] space-y-2.5 hover:border-[#eab84e]/40 transition-colors">
                <span className="text-xs font-mono font-bold text-[#eab84e] uppercase bg-[#eab84e]/10 px-2.5 py-1 rounded border border-[#eab84e]/20">
                  {m.num}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white pt-1">{m.title}</h3>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: THANH TOÁN MOBILE-FIRST VỚI BỘ NÚT 1-CHẠM */}
        <section className="border-t border-[#2a2015] bg-[#140e08] px-4 py-16 sm:px-8">
          <div className="max-w-4xl mx-auto rounded-3xl border border-[#eab84e]/40 bg-gradient-to-b from-[#1f170f] to-[#140e08] p-5 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#eab84e]">
                  Nhận trọn bộ quy trình
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-white leading-tight">
                  Bắt đầu làm video AI <em className="text-[#eab84e] not-italic">từ một ảnh</em>
                </h2>
                <div className="flex items-baseline gap-3">
                  <span className="text-sm line-through text-slate-500 font-bold">1.200.000đ</span>
                  <span className="text-4xl font-black text-[#eab84e]">297.000đ</span>
                </div>

                {/* MOBILE ONE-TAP QUICK COPY BUTTONS */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#eab84e]/50 transition-colors">
                    <div>
                      <p className="text-xs text-slate-300 uppercase font-bold">Số tài khoản VIB</p>
                      <p className="text-lg sm:text-xl font-mono font-black text-[#eab84e]">0934434101</p>
                    </div>
                    <button 
                      onClick={() => handleCopy('0934434101', 'bank')}
                      className="px-3.5 py-2 rounded-lg bg-[#eab84e] text-black font-black text-xs sm:text-sm flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow"
                    >
                      {copiedBank ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedBank ? 'Đã copy' : 'Copy STK'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#eab84e]/50 transition-colors">
                    <div>
                      <p className="text-xs text-slate-300 uppercase font-bold">Số tiền chuyển khoản</p>
                      <p className="text-lg sm:text-xl font-mono font-black text-white">297.000 đ</p>
                    </div>
                    <button 
                      onClick={() => handleCopy('297000', 'amount')}
                      className="px-3.5 py-2 rounded-lg bg-white/15 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    >
                      {copiedAmount ? <Check className="w-4 h-4 text-emerald-400 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedAmount ? 'Đã copy' : 'Copy Số Tiền'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#eab84e]/50 transition-colors">
                    <div>
                      <p className="text-xs text-slate-300 uppercase font-bold">Nội dung chuyển khoản</p>
                      <p className="text-base font-mono font-bold text-emerald-400">video ai 1 anh</p>
                    </div>
                    <button 
                      onClick={() => handleCopy('video ai 1 anh', 'content')}
                      className="px-3.5 py-2 rounded-lg bg-white/15 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    >
                      {copiedContent ? <Check className="w-4 h-4 text-emerald-400 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedContent ? 'Đã copy' : 'Copy Nội Dung'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-sm text-slate-300 pt-1 space-y-1">
                  <p>Chủ TK: <strong className="text-white font-bold">NGUYEN VAN DANG</strong> · Ngân hàng: <strong className="text-white">VIB</strong></p>
                </div>

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

              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-xl">
                <img 
                  src={qrUrl} 
                  alt="VietQR VIB 297K NGUYEN VAN DANG" 
                  className="w-full max-w-56 h-auto object-contain"
                />
                <button 
                  onClick={() => setModalOpen(true)}
                  className="mt-4 w-full py-4 px-6 rounded-xl bg-[#eab84e] hover:bg-[#f8d575] text-[#100c08] font-black text-base uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>KÍCH HOẠT QUY TRÌNH VÀO EMAIL</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-[#2a2015] py-8 px-4 text-center text-xs sm:text-sm text-slate-400 bg-[#0a0704]">
          <p>© 2026 NGUYỄN ĐĂNG AI · TỰ HỌC AI (tuhocai.top) · STK VIB: 0934434101 · Zalo: 0938.494.303</p>
        </footer>
      </main>

      {/* MOBILE STICKY FLOATING BOTTOM BAR */}
      <aside aria-label="Thanh đặt mua nhanh trên di động" className="fixed bottom-0 left-0 right-0 z-40 bg-[#140e08]/95 backdrop-blur-md border-t border-[#eab84e]/30 p-3 sm:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs line-through text-slate-500 font-bold">1.200K</span>
              <span className="text-xl font-black text-[#eab84e]">297.000đ</span>
            </div>
            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Flash Sale {formatTimer(timeLeft)}</span>
            </p>
          </div>

          <button 
            onClick={() => setModalOpen(true)}
            className="flex-1 py-3 px-4 rounded-xl bg-[#eab84e] text-[#100c08] font-black text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>NHẬN QUY TRÌNH</span>
            <Zap className="w-4 h-4 fill-black" />
          </button>
        </div>
      </aside>

      {/* MODAL CHECKOUT */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#221910] to-[#120c07] border border-[#eab84e]/40 p-5 sm:p-7 text-center shadow-2xl text-white">
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white p-2 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-[#eab84e] font-extrabold text-xs tracking-widest uppercase mb-1">
              NGUYỄN ĐĂNG AI · TỰ HỌC AI
            </div>

            <h2 className="text-xl font-black uppercase text-white">
              KÍCH HOẠT VIDEO AI 1 ẢNH VIP
            </h2>

            <div className="my-2.5 text-3xl font-black text-[#eab84e]">
              297.000đ <span className="text-xs line-through text-slate-400 font-normal">1.200.000đ</span>
            </div>

            <div className="inline-flex p-3 bg-white rounded-xl shadow-md my-1">
              <img 
                src={qrUrl} 
                alt="QR Code thanh toán VIB 297K" 
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
                onClick={() => handleCopy('297000', 'amount')}
                className="p-2 rounded bg-white/10 hover:bg-white/20 text-xs font-bold text-yellow-400 flex items-center justify-center gap-1 cursor-pointer"
              >
                {copiedAmount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAmount ? 'Đã copy' : 'Copy 297K'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleCopy('video ai 1 anh', 'content')}
                className="p-2 rounded bg-white/10 hover:bg-white/20 text-xs font-bold text-emerald-300 flex items-center justify-center gap-1 cursor-pointer"
              >
                {copiedContent ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedContent ? 'Đã copy' : 'Copy ND'}</span>
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-300 bg-white/5 p-3 rounded-lg border border-white/10 my-2 text-left space-y-1">
              <div>Ngân hàng: <strong className="text-white">VIB</strong> · Số TK: <strong className="text-[#eab84e]">0934434101</strong></div>
              <div>Chủ TK: <strong className="text-white">NGUYEN VAN DANG</strong> · Nội dung: <strong className="text-white">video ai 1 anh</strong></div>
            </div>

            <form onSubmit={handleConfirmPayment} className="mt-3 space-y-3 text-left">
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-200 block mb-1">
                  Email nhận tài liệu và mở khóa (Bắt buộc):
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="name@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-lg bg-black/50 border border-[#382c1e] text-base text-white focus:outline-none focus:border-[#eab84e]"
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
                  className="w-full px-3.5 py-3 rounded-lg bg-black/50 border border-[#382c1e] text-base text-white focus:outline-none focus:border-[#eab84e]"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-200 block mb-1">
                  Số điện thoại / Zalo:
                </label>
                <input 
                  type="tel" 
                  required
                  placeholder="Ví dụ: 0912345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-lg bg-black/50 border border-[#382c1e] text-base text-white focus:outline-none focus:border-[#eab84e]"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="mt-3 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#eab84e] via-[#f8d575] to-[#c7922d] text-[#100c08] font-black text-sm sm:text-base uppercase tracking-wider hover:opacity-95 cursor-pointer shadow-lg transition-all flex items-center justify-center gap-2"
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
