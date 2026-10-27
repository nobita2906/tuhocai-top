'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Mail, 
  Copy, 
  CheckCircle2, 
  X,
  ExternalLink,
  MessageCircle,
  Users,
  Flame,
  Clock,
  Zap,
  FolderDown,
  FileText,
  Video,
  Smartphone
} from 'lucide-react';

export default function VideoAiTu1AnhPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);

  // Countdown timer 14:59
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59);

  // Form
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // VietQR VIB 297K
  const qrUrl = "https://img.vietqr.io/image/VIB-0934434101-compact2.png?amount=297000&addInfo=video%20ai%201%20anh&accountName=NGUYEN%20VAN%20DANG";

  // Timer tick
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
    <div className="min-h-screen bg-[#0d0905] text-[#f7eee1] font-sans antialiased selection:bg-[#eab84e] selection:text-[#100c08] pb-24 md:pb-12">
      {/* FLASH SALE TOP BANNER */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black px-3 py-2 text-center text-xs font-black tracking-wide shadow-md flex items-center justify-center gap-2">
        <Flame className="w-4 h-4 fill-black animate-pulse" />
        <span>ƯU ĐÃI KHÓA HỌC CHỈ CÒN 5 SUẤT HÔM NAY · KẾT THÚC TRONG:</span>
        <span className="font-mono bg-black text-[#f8d575] px-2 py-0.5 rounded text-[11px] font-black">
          {formatTimer(timeLeft)}
        </span>
      </div>

      {/* Top Bar */}
      <header className="border-b border-[#2a2015] bg-[#140e08]/90 backdrop-blur-md px-4 py-3 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-mono font-black text-[#eab84e] text-xs sm:text-base tracking-wider uppercase">
              TỰ HỌC AI · NGUYỄN ĐĂNG AI
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <a href="#quy-trinh" className="hidden sm:inline text-xs font-semibold text-[#d5c6ac] hover:text-[#eab84e] transition-colors">
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#eab84e]/10 text-[#eab84e] border border-[#eab84e]/30">
                <Sparkles className="w-3.5 h-3.5" />
                Giải pháp video AI độc quyền 2026
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase leading-[1.1] tracking-tight text-white">
                LÀM VIDEO XÂY DỰNG THƯƠNG HIỆU BÁN HÀNG TRIỆU VIEW TỪ 1 ẢNH
              </h1>

              <p className="text-sm sm:text-base text-[#eab84e] font-semibold italic">
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

              <p className="text-xs text-[#d5c6ac]">
                <a href="https://www.youtube.com/watch?v=KOAKDMxpPxI" target="_blank" rel="noopener noreferrer" className="text-[#f8d575] underline">
                  Nếu video không phát, bấm xem trực tiếp trên YouTube
                </a>
              </p>

              <p className="text-xs sm:text-sm leading-relaxed text-[#d5c6ac]">
                Giải pháp độc quyền từ Nguyễn Đăng AI giúp bạn biến ảnh chân dung hoặc sản phẩm tĩnh thành video nói chuyện tự nhiên, biểu cảm thần thái và bối cảnh chuẩn studio sang trọng. Hơn <strong>12.000+ học viên</strong> đã tự tin xây kênh và bùng nổ doanh số mỗi ngày.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button 
                  onClick={() => setModalOpen(true)}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#eab84e] text-[#100c08] font-black text-sm uppercase hover:bg-[#f8d575] shadow-[0_10px_35px_rgba(234,184,78,0.3)] transition-all cursor-pointer text-center"
                >
                  NHẬN QUY TRÌNH · 297.000Đ
                </button>
                <a 
                  href="#quy-trinh"
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-[#2a2015] bg-[#1a130c] text-white font-bold text-xs sm:text-sm text-center hover:border-[#eab84e]/40 transition-colors"
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
                  <p className="text-xs font-bold text-[#eab84e] uppercase flex items-center justify-center gap-1.5">
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
              <span className="text-xs font-bold uppercase tracking-widest text-[#eab84e] bg-[#eab84e]/10 px-3 py-1 rounded-full border border-[#eab84e]/20">
                Minh bạch 100% · Nội dung bạn sẽ nhận được
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">
                Bên trong kho quy trình VIP của bạn
              </h2>
            </div>

            <div className="rounded-2xl border border-[#2a2015] bg-[#160f08] p-5 space-y-3 font-mono text-xs shadow-xl">
              <div className="flex items-center gap-2 text-[#eab84e] font-bold pb-2 border-b border-[#2a2015]">
                <FolderDown className="w-4 h-4 text-[#eab84e]" />
                <span>KHO_TAI_LIEU_VIDEO_AI_1_ANH_TUHOCAI/</span>
              </div>
              <div className="space-y-2 pt-1 text-slate-300">
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 border border-white/5">
                  <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-white font-semibold">01_Prompt_Tao_Boi_Canh_Studio_Trieu_Do.txt</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 border border-white/5">
                  <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-white font-semibold">02_Video_Thuc_Hanh_Dong_Bo_Khau_Hinh_LivePortrait.mp4</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 border border-white/5">
                  <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-white font-semibold">03_Bo_Template_Kich_Ban_Ban_Hang_Chuyen_Doi_Cao.docx</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 border border-white/5">
                  <ShieldCheck className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span className="text-white font-semibold">04_Kenh_Ho_Tro_Truc_Tiep_Zalo_Nguyen_Dang_AI.pdf</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: ỨNG DỤNG */}
        <section className="border-y border-[#2a2015] bg-[#140e08] px-4 py-14 sm:px-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-[#eab84e]">Ứng dụng thực chiến</p>
              <h2 className="text-2xl sm:text-4xl font-black uppercase text-white">
                Từ ảnh tĩnh đến video <em className="text-[#eab84e] not-italic">có thể đăng ngay</em>
              </h2>
              <p className="text-xs sm:text-sm text-[#d5c6ac] max-w-xl mx-auto">
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
                  <span className="text-3xl font-black text-[#eab84e]/30 select-none">{item.num}</span>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-[#d5c6ac] leading-relaxed">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: 4 PHẦN CHUYỂN GIAO */}
        <section id="quy-trinh" className="px-4 py-14 sm:px-8 max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#eab84e]">Trọn bộ chuyển giao</p>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white">
              Bốn phần để <em className="text-[#eab84e] not-italic">bắt đầu làm video AI ngay</em>
            </h2>
            <p className="text-xs sm:text-sm text-[#d5c6ac]">Tài liệu, mẫu câu lệnh Prompt và hướng dẫn thực hành từng bước.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { num: '01 / Ảnh', title: 'Chuẩn bị ảnh chân dung hoặc sản phẩm', desc: 'Kỹ thuật chọn ảnh sắc nét, cân chỉnh tỷ lệ và bố cục chuẩn 9:16 cho TikTok/Reels.' },
              { num: '02 / Prompt', title: 'Viết kịch bản và câu lệnh độc quyền', desc: 'Bộ khung Prompt thiết lập thần thái nhân vật, cử chỉ tự nhiên và ánh sáng studio.' },
              { num: '03 / Video', title: 'Thực hành xuất video chất lượng cao', desc: 'Quy trình tạo chuyển động mượt mà, khử méo hình và ghép hoàn thiện 1 video trong 10 phút.' },
              { num: '04 / Hỗ trợ', title: 'Kích hoạt tài khoản email trên tuhocai.top', desc: 'Lưu trữ vĩnh viễn tài liệu trong kho cá nhân, kèm kênh hỗ trợ kỹ thuật qua Zalo 0934.434.101.' },
            ].map((m) => (
              <div key={m.num} className="p-5 rounded-xl border border-[#2a2015] bg-[#140e08] space-y-2.5 hover:border-[#eab84e]/40 transition-colors">
                <span className="text-xs font-mono font-bold text-[#eab84e] uppercase bg-[#eab84e]/10 px-2.5 py-1 rounded border border-[#eab84e]/20">
                  {m.num}
                </span>
                <h3 className="text-base font-bold text-white pt-1">{m.title}</h3>
                <p className="text-xs text-[#d5c6ac] leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: THANH TOÁN MOBILE-FIRST VỚI BỘ NÚT 1-CHẠM */}
        <section className="border-t border-[#2a2015] bg-[#140e08] px-4 py-16 sm:px-8">
          <div className="max-w-4xl mx-auto rounded-3xl border border-[#eab84e]/40 bg-gradient-to-b from-[#1f170f] to-[#140e08] p-5 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#eab84e]">
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
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div>
                      <p className="text-[10px] text-[#d5c6ac] uppercase font-bold">Số tài khoản VIB</p>
                      <p className="text-base font-mono font-black text-[#eab84e]">0934434101</p>
                    </div>
                    <button 
                      onClick={() => handleCopy('0934434101', 'bank')}
                      className="px-3 py-2 rounded-lg bg-[#eab84e] text-black font-black text-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                    >
                      {copiedBank ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBank ? 'Đã copy' : 'Copy STK'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div>
                      <p className="text-[10px] text-[#d5c6ac] uppercase font-bold">Số tiền</p>
                      <p className="text-base font-mono font-black text-white">297.000 đ</p>
                    </div>
                    <button 
                      onClick={() => handleCopy('297000', 'amount')}
                      className="px-3 py-2 rounded-lg bg-white/15 text-white font-bold text-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                    >
                      {copiedAmount ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAmount ? 'Đã copy' : 'Copy Số Tiền'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div>
                      <p className="text-[10px] text-[#d5c6ac] uppercase font-bold">Nội dung chuyển khoản</p>
                      <p className="text-xs font-mono font-bold text-emerald-400">video ai 1 anh</p>
                    </div>
                    <button 
                      onClick={() => handleCopy('video ai 1 anh', 'content')}
                      className="px-3 py-2 rounded-lg bg-white/15 text-white font-bold text-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                    >
                      {copiedContent ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedContent ? 'Đã copy' : 'Copy Nội Dung'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#d5c6ac] pt-1">
                  Chủ TK: <strong className="text-white">NGUYEN VAN DANG</strong> · Ngân hàng: <strong className="text-white">VIB</strong>
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-xl">
                <img 
                  src={qrUrl} 
                  alt="VietQR VIB 297K NGUYEN VAN DANG" 
                  className="w-full max-w-56 h-auto object-contain"
                />
                <button 
                  onClick={() => setModalOpen(true)}
                  className="mt-4 w-full py-3.5 px-6 rounded-xl bg-[#eab84e] hover:bg-[#f8d575] text-[#100c08] font-black text-sm uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>KÍCH HOẠT QUY TRÌNH VÀO EMAIL</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-[#2a2015] py-8 px-4 text-center text-xs text-[#a39480] bg-[#0a0704]">
          <p>© 2026 NGUYỄN ĐĂNG AI · TỰ HỌC AI (tuhocai.top) · STK VIB: 0934434101</p>
        </footer>
      </main>

      {/* MOBILE STICKY FLOATING BOTTOM BAR */}
      <aside aria-label="Thanh đặt mua nhanh trên di động" className="fixed bottom-0 left-0 right-0 z-40 bg-[#140e08]/95 backdrop-blur-md border-t border-[#eab84e]/30 p-3 sm:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs line-through text-slate-500 font-bold">1.200K</span>
              <span className="text-lg font-black text-[#eab84e]">297.000đ</span>
            </div>
            <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Flash Sale {formatTimer(timeLeft)}</span>
            </p>
          </div>

          <button 
            onClick={() => setModalOpen(true)}
            className="flex-1 py-3 px-4 rounded-xl bg-[#eab84e] text-[#100c08] font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>NHẬN QUY TRÌNH</span>
            <Zap className="w-3.5 h-3.5 fill-black" />
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

            <div className="text-[#eab84e] font-bold text-xs tracking-widest uppercase mb-1">
              NGUYỄN ĐĂNG AI · TỰ HỌC AI
            </div>

            <h2 className="text-xl font-black uppercase text-white">
              KÍCH HOẠT QUY TRÌNH VIDEO AI 1 ẢNH
            </h2>

            <div className="my-2 text-3xl font-black text-[#eab84e]">
              297.000đ
            </div>

            <div className="inline-flex p-3 bg-white rounded-xl shadow-md my-1">
              <img 
                src={qrUrl} 
                alt="QR Code VIB 297K" 
                className="w-44 h-auto object-contain"
              />
            </div>

            <div className="text-xs text-slate-300 bg-white/5 p-2.5 rounded-lg border border-white/10 my-2 text-left space-y-1">
              <div>Ngân hàng: <strong className="text-white">VIB</strong> · Số TK: <strong className="text-[#eab84e]">0934434101</strong></div>
              <div>Chủ TK: <strong className="text-white">NGUYEN VAN DANG</strong> · Nội dung: <strong className="text-white">video ai 1 anh</strong></div>
            </div>

            <form onSubmit={handleConfirmPayment} className="mt-3 space-y-3 text-left">
              <div>
                <label className="text-[11px] font-bold text-[#d5c6ac] block mb-1">
                  Email nhận tài liệu và kích hoạt (Bắt buộc):
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="name@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-[#3d2e1f] text-sm text-white focus:outline-none focus:border-[#eab84e]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#d5c6ac] block mb-1">
                  Họ và tên của bạn:
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-[#3d2e1f] text-sm text-white focus:outline-none focus:border-[#eab84e]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#d5c6ac] block mb-1">
                  Số điện thoại / Zalo:
                </label>
                <input 
                  type="tel" 
                  required
                  placeholder="Ví dụ: 0912345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-[#3d2e1f] text-sm text-white focus:outline-none focus:border-[#eab84e]"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="mt-3 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ffe18d] via-[#eab84e] to-[#c69324] text-[#140e08] font-black text-sm uppercase tracking-wider hover:opacity-95 cursor-pointer shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Đang kích hoạt tài khoản...</span>
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-black" />
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
