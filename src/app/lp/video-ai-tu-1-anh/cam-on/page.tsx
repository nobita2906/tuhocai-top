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
  ArrowRight,
  PackageCheck,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const qEmail = searchParams.get('email');
    if (qEmail) {
      setEmail(qEmail);
    } else if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('customer_email_video_vip');
      if (stored) setEmail(stored);
    }
  }, [searchParams]);

  return (
    <div className="relative z-10 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <header className="flex items-center justify-between pb-6 border-b border-[#2a2015]">
        <Link 
          href="/lp/video-ai-tu-1-anh" 
          className="inline-flex items-center gap-3 text-white hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5">
            <div className="w-full h-full rounded-full bg-[#100c08] flex items-center justify-center text-xs font-black text-[#eab84e]">
              ĐAI
            </div>
          </div>
          <div>
            <span className="font-black text-base sm:text-lg block leading-tight text-white">NGUYỄN ĐĂNG AI · TỰ HỌC AI</span>
            <small className="text-[#eab84e] font-bold text-xs uppercase tracking-wider">Khóa Học Video AI Triệu View</small>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-[#d5c6ac] hover:text-white transition-colors"
        >
          Về Trang Chủ
        </Link>
      </header>

      {/* Intro */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4" />
          <span>Đăng ký thành công</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-[#eab84e] tracking-tight">
          Cảm ơn bạn đã tham gia!
        </h1>
        <p className="text-base sm:text-lg text-white max-w-2xl mx-auto leading-relaxed">
          Quy trình <strong className="text-[#eab84e]">“Video AI Xây Dựng Thương Hiệu Từ 1 Ảnh”</strong> đã được kích hoạt trực tiếp cho tài khoản của bạn.
        </p>
        {email && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm">
            <Mail className="w-4 h-4 text-[#eab84e]" />
            <span>Email tài khoản: <strong className="text-[#eab84e]">{email}</strong></span>
          </div>
        )}
      </div>

      {/* HƯỚNG DẪN TRUY CẬP LẤY ĐƠN HÀNG TRÊN HỆ THỐNG TUHOCAI.TOP */}
      <div className="rounded-2xl border-2 border-[#eab84e]/40 bg-gradient-to-br from-[#2a1c0e] via-[#1a1208] to-[#100c08] p-6 sm:p-7 space-y-4 shadow-2xl text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#eab84e]/20 flex items-center justify-center text-[#eab84e] border border-[#eab84e]/30 shrink-0">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#eab84e] bg-[#eab84e]/10 px-2 py-0.5 rounded border border-[#eab84e]/25">
              HƯỚNG DẪN MỞ KHÓA TÀI LIỆU
            </span>
            <h3 className="text-base sm:text-lg font-black text-white mt-1">
              Cách Truy Cập Lấy Đơn Hàng Tại Mục &quot;Kho Của Tôi&quot; (tuhocai.top)
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-300">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="inline-block w-6 h-6 rounded-full bg-[#eab84e] text-black font-black text-xs text-center leading-6">1</span>
            <p className="font-bold text-white">Vào tuhocai.top</p>
            <p className="text-[12px] text-slate-400 leading-relaxed">
              Truy cập trang chủ <a href="https://www.tuhocai.top" target="_blank" className="text-[#eab84e] underline font-bold">tuhocai.top</a> và bấm vào mục <strong>&quot;Kho Của Tôi&quot;</strong> trên thanh Menu.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="inline-block w-6 h-6 rounded-full bg-[#eab84e] text-black font-black text-xs text-center leading-6">2</span>
            <p className="font-bold text-white">Đăng Nhập Tra Cứu</p>
            <p className="text-[12px] text-slate-400 leading-relaxed">
              Nhập <strong>Email</strong> và <strong>Mật khẩu mặc định là Số điện thoại (10 số)</strong> bạn vừa dùng khi đặt mua.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="inline-block w-6 h-6 rounded-full bg-[#eab84e] text-black font-black text-xs text-center leading-6">3</span>
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#eab84e] hover:bg-[#f8d575] text-black font-black text-xs uppercase shadow-md transition-all active:scale-95"
          >
            <span>Đến Mục Kho Của Tôi Ngay</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Area Access */}
        <div className="rounded-2xl border border-[#2a2015] bg-[#140e08] p-6 sm:p-8 space-y-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#eab84e]/15 flex items-center justify-center text-[#eab84e]">
              <PackageCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black uppercase text-white">
              Vào Khu Vực Học Tập & Nhận Tài Liệu
            </h2>
            <p className="text-xs sm:text-sm text-[#d5c6ac] leading-relaxed">
              Toàn bộ File mẫu Prompt nhân vật, kịch bản mẫu và video hướng dẫn đã được kích hoạt vĩnh viễn trong tài khoản của bạn. Bấm để vào học ngay!
            </p>
          </div>

          <a 
            href="/dashboard" 
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#eab84e] py-3.5 px-6 font-black text-[#100c08] hover:bg-[#f8d575] shadow-lg transition-all text-sm uppercase cursor-pointer"
          >
            <PackageCheck className="w-4 h-4" />
            <span>VÀO KHU VỰC HỌC TẬP CỦA TÔI</span>
          </a>
        </div>

        {/* Support Zalo */}
        <div className="rounded-2xl border border-[#2a2015] bg-[#140e08] p-6 sm:p-8 space-y-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black uppercase text-white">
              Hỗ Trợ Kỹ Thuật Nguyễn Đăng AI
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Cần hỗ trợ sửa prompt hoặc hỏi đáp quy trình dựng video? Nhắn tin trực tiếp qua Zalo admin: <strong className="text-emerald-400">0938.494.303</strong>.
            </p>
          </div>

          <a 
            href="https://zalo.me/0938494303" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 px-6 font-black shadow-lg transition-all text-sm uppercase cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>NHẮN ZALO ADMIN: 0938.494.303</span>
          </a>
        </div>
      </div>

      {/* Community Banner */}
      <div className="rounded-2xl border border-[#2a2015] bg-[#140e08] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#eab84e] bg-[#eab84e]/10 px-2.5 py-0.5 rounded-full border border-[#eab84e]/20">
            Cộng đồng thực chiến
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white mt-1">
            Tham Gia Nhóm Zalo Tự Học AI (Miễn Phí)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Giao lưu cùng hơn 5.000+ thành viên đang ứng dụng AI xây kênh và tự động hóa.
          </p>
        </div>

        <a
          href="https://zalo.me/g/tuhocai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 px-5 py-3 rounded-xl bg-[#eab84e] text-[#100c08] hover:bg-[#f8d575] font-black text-xs sm:text-sm flex items-center gap-2 transition-colors"
        >
          <span>Vào Nhóm Zalo</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2a2015] pt-8 pb-4 text-center text-xs sm:text-sm text-slate-400">
        <p>© 2026 NGUYỄN ĐĂNG AI · TỰ HỌC AI (tuhocai.top) · STK VIB: 0934434101 · Zalo: 0938.494.303</p>
      </footer>
    </div>
  );
}

export default function ThankYouVideoVipPage() {
  return (
    <div className="min-h-screen bg-[#0d0905] text-[#f7eee1] font-sans antialiased selection:bg-[#eab84e] selection:text-[#100c08] px-4 py-8 sm:py-12">
      <Suspense fallback={<div className="text-center py-20 text-white">Đang tải thông tin...</div>}>
        <ThankYouContent />
      </Suspense>
    </div>
  );
}
