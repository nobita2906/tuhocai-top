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
  ArrowRight
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

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Drive Download */}
        <div className="rounded-2xl border border-[#2a2015] bg-[#140e08] p-6 sm:p-8 space-y-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#eab84e]/15 flex items-center justify-center text-[#eab84e]">
              <Download className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black uppercase text-white">
              Tải Toàn Bộ File Mẫu & Prompt Pack
            </h2>
            <p className="text-xs sm:text-sm text-[#d5c6ac] leading-relaxed">
              Truy cập ngay kho Google Drive VIP chứa các mẫu prompt nhân vật, kịch bản mẫu và video hướng dẫn từng bước.
            </p>
          </div>

          <a 
            href="https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#eab84e] py-3.5 px-6 font-black text-[#100c08] hover:bg-[#f8d575] shadow-lg transition-all text-sm uppercase cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>MỞ KHO TÀI NGUYÊN DRIVE</span>
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
            <p className="text-xs sm:text-sm text-[#d5c6ac] leading-relaxed">
              Cần hỗ trợ sửa prompt hoặc hỏi đáp quy trình dựng video? Nhắn tin trực tiếp qua Zalo admin: <strong>0934.434.101</strong>.
            </p>
          </div>

          <a 
            href="https://zalo.me/0934434101" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 px-6 font-black shadow-lg transition-all text-sm uppercase cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>NHẮN ZALO ADMIN: 0934.434.101</span>
          </a>
        </div>
      </div>

      {/* Community Banner */}
      <div className="rounded-2xl border border-[#2a2015] bg-[#140e08] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#eab84e] bg-[#eab84e]/10 px-2.5 py-0.5 rounded-full border border-[#eab84e]/20">
            Cộng đồng thực chiến
          </span>
          <h3 className="text-base font-bold text-white mt-1">
            Tham Gia Nhóm Zalo Tự Học AI (Miễn Phí)
          </h3>
          <p className="text-xs text-[#d5c6ac] mt-1">
            Giao lưu cùng hơn 5.000+ thành viên đang ứng dụng AI xây kênh và tự động hóa.
          </p>
        </div>

        <a
          href="https://zalo.me/g/tuhocai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 px-5 py-3 rounded-xl bg-[#eab84e] text-[#100c08] hover:bg-[#f8d575] font-black text-xs flex items-center gap-2 transition-colors"
        >
          <span>Vào Nhóm Zalo</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2a2015] pt-8 pb-4 text-center text-xs text-[#a39480]">
        <p>© 2026 NGUYỄN ĐĂNG AI · TỰ HỌC AI (tuhocai.top) · STK VIB: 0934434101</p>
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
