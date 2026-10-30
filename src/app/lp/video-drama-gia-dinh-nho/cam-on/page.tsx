'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  MessageCircle, 
  Download, 
  CheckCircle2, 
  Mail, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  PackageCheck
} from 'lucide-react';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const qEmail = searchParams.get('email');
    if (qEmail) {
      setEmail(qEmail);
    } else if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('customer_email_drama');
      if (stored) setEmail(stored);
    }
  }, [searchParams]);

  return (
    <div className="relative z-10 max-w-4xl mx-auto space-y-10">
      {/* Header / Brand */}
      <header className="flex items-center justify-between pb-6 border-b border-[#27303d]">
        <Link 
          href="/lp/video-drama-gia-dinh-nho" 
          className="inline-flex items-center gap-3 text-white hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 via-amber-500 to-yellow-400 p-0.5">
            <div className="w-full h-full rounded-full bg-[#03070f] flex items-center justify-center text-xs font-black text-[#ffc400]">
              ĐAI
            </div>
          </div>
          <div>
            <span className="font-black text-base sm:text-lg block leading-tight">NGUYỄN ĐĂNG AI · TỰ HỌC AI</span>
            <small className="text-[#f6c64b] font-bold text-xs uppercase tracking-wider">Hệ Thống Đào Tạo & Tự Động Hóa</small>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-[#aab1bc] hover:text-white transition-colors"
        >
          Trang Chủ Tự Học AI
        </Link>
      </header>

      {/* Intro */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4" />
          <span>Ghi nhận đơn hàng thành công</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-[#ffc400] tracking-tight">
          Cảm ơn bạn đã đăng ký!
        </h1>
        <p className="text-base sm:text-lg text-white max-w-2xl mx-auto leading-relaxed">
          Quy trình <strong className="text-[#ffc400]">“Video AI Câu Chuyện Gia Đình Nhỏ”</strong> đã được kích hoạt và liên kết với email của bạn.
        </p>
        {email && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm">
            <Mail className="w-4 h-4 text-[#ffc400]" />
            <span>Tài khoản nhận: <strong className="text-[#ffc400]">{email}</strong></span>
          </div>
        )}
      </div>

      {/* HƯỚNG DẪN TRUY CẬP LẤY ĐƠN HÀNG TRÊN HỆ THỐNG TUHOCAI.TOP */}
      <div className="rounded-2xl border-2 border-[#ffc400]/40 bg-gradient-to-br from-[#2a2205] via-[#0d1525] to-[#090f18] p-6 sm:p-7 space-y-4 shadow-2xl text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffc400]/20 flex items-center justify-center text-[#ffc400] border border-[#ffc400]/30 shrink-0">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#ffc400] bg-[#ffc400]/10 px-2 py-0.5 rounded border border-[#ffc400]/25">
              HƯỚNG DẪN MỞ KHÓA TÀI LIỆU
            </span>
            <h3 className="text-base sm:text-lg font-black text-white mt-1">
              Cách Truy Cập Lấy Đơn Hàng Tại Mục &quot;Kho Của Tôi&quot; (tuhocai.top)
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-300">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="inline-block w-6 h-6 rounded-full bg-[#ffc400] text-black font-black text-xs text-center leading-6">1</span>
            <p className="font-bold text-white">Vào tuhocai.top</p>
            <p className="text-[12px] text-slate-400 leading-relaxed">
              Truy cập trang chủ <a href="https://www.tuhocai.top" target="_blank" className="text-[#ffc400] underline font-bold">tuhocai.top</a> và bấm vào mục <strong>&quot;Kho Của Tôi&quot;</strong> trên thanh Menu.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="inline-block w-6 h-6 rounded-full bg-[#ffc400] text-black font-black text-xs text-center leading-6">2</span>
            <p className="font-bold text-white">Đăng Nhập Tra Cứu</p>
            <p className="text-[12px] text-slate-400 leading-relaxed">
              Nhập <strong>Email</strong> và <strong>Mật khẩu mặc định là Số điện thoại (10 số)</strong> bạn vừa dùng khi đặt mua.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="inline-block w-6 h-6 rounded-full bg-[#ffc400] text-black font-black text-xs text-center leading-6">3</span>
            <p className="font-bold text-white">Tải Về & Đổi Mật Khẩu</p>
            <p className="text-[12px] text-slate-400 leading-relaxed">
              Toàn bộ link Drive, video và prompt được lưu trữ vĩnh viễn. Bạn có thể tự đổi mật khẩu mới ngay trong mục này!
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
          <p className="text-xs text-amber-300/90 italic">
            *Mọi đơn hàng đã kích hoạt đều được hệ thống cấp quyền truy cập trọn đời vào tài khoản của bạn.
          </p>
          <a
            href="https://www.tuhocai.top"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ffc400] hover:bg-[#ffd33d] text-black font-black text-xs uppercase shadow-md transition-all active:scale-95"
          >
            <span>Đến Mục Kho Của Tôi Ngay</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: User Area Access */}
        <div className="rounded-2xl border border-[#27303d] bg-[#090f18] p-6 sm:p-8 space-y-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#ffc400]/15 flex items-center justify-center text-[#ffc400]">
              <PackageCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black uppercase text-white">
              Vào Khu Vực Học Tập & Nhận Tài Liệu
            </h2>
            <p className="text-xs sm:text-sm text-[#aab1bc] leading-relaxed">
              Toàn bộ Prompt kịch bản, Prompt nhân vật và hướng dẫn làm video đã được kích hoạt vĩnh viễn trong tài khoản của bạn. Bấm để vào học ngay!
            </p>
          </div>

          <a 
            href="/dashboard" 
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#ffc400] py-3.5 px-6 font-black text-[#080b10] hover:bg-[#ffd33d] shadow-[0_10px_30px_rgba(255,196,0,0.25)] transition-all text-sm uppercase cursor-pointer"
          >
            <PackageCheck className="w-4 h-4" />
            <span>VÀO KHU VỰC HỌC TẬP CỦA TÔI</span>
          </a>
        </div>

        {/* Card 2: Zalo VIP Support */}
        <div className="rounded-2xl border border-[#27303d] bg-[#090f18] p-6 sm:p-8 space-y-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black uppercase text-white">
              Hỗ Trợ Kỹ Thuật Trực Tiếp Qua Zalo
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Cần giải đáp thắc mắc hoặc hỗ trợ xử lý lỗi khi tạo video AI? Kết nối trực tiếp với Nguyễn Đăng AI qua số Zalo: <strong className="text-emerald-400">0938.494.303</strong>.
            </p>
          </div>

          <a 
            href="https://zalo.me/0938494303" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 px-6 font-black shadow-lg shadow-emerald-900/30 transition-all text-sm uppercase cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>NHẮN TIN ZALO: 0938.494.303</span>
          </a>
        </div>
      </div>

      {/* Community Banner */}
      <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/60 to-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
            Cộng đồng học viên chính thức
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white mt-1">
            Gia nhập Nhóm Zalo VIP Tự Học AI
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Nhận thêm hàng tuần các tài liệu về n8n, AI Agent và kỹ năng kiếm tiền từ AI.
          </p>
        </div>

        <a
          href="https://zalo.me/g/tuhocai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors"
        >
          <span>Vào Nhóm Zalo Tự Học AI</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#27303d] pt-8 pb-4 text-center text-xs sm:text-sm text-slate-400">
        <p>© 2026 NGUYỄN ĐĂNG AI · TỰ HỌC AI (tuhocai.top) · STK ACB: 4747827 · Zalo: 0938.494.303</p>
      </footer>
    </div>
  );
}

export default function ThankYouDramaPage() {
  return (
    <div className="min-h-screen bg-[#03070f] text-[#f5f4ef] font-sans antialiased selection:bg-[#ffc400] selection:text-[#080b10] px-5 py-8 sm:py-12">
      {/* Background Grid Accent */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-25 z-0" 
        style={{
          backgroundImage: 'linear-gradient(to right, #27303d 1px, transparent 1px), linear-gradient(to bottom, #27303d 1px, transparent 1px)',
          backgroundSize: '68px 68px'
        }}
      />
      <Suspense fallback={<div className="text-center py-20 text-white">Đang tải thông tin...</div>}>
        <ThankYouContent />
      </Suspense>
    </div>
  );
}
