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
  Code2
} from 'lucide-react';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const qEmail = searchParams.get('email');
    if (qEmail) {
      setEmail(qEmail);
    } else if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('customer_email_copy_lp');
      if (stored) setEmail(stored);
    }
  }, [searchParams]);

  return (
    <div className="relative z-10 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <header className="flex items-center justify-between pb-6 border-b border-slate-800">
        <Link 
          href="/lp/sao-chep-landing-page" 
          className="inline-flex items-center gap-3 text-white hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-teal-400 p-0.5">
            <div className="w-full h-full rounded-full bg-[#050811] flex items-center justify-center text-xs font-black text-cyan-400">
              ĐAI
            </div>
          </div>
          <div>
            <span className="font-black text-base sm:text-lg block leading-tight text-white">NGUYỄN ĐĂNG AI · TỰ HỌC AI</span>
            <small className="text-cyan-400 font-bold text-xs uppercase tracking-wider">Skill AI Clone Landing Page</small>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
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
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300 tracking-tight">
          Cảm ơn bạn đã tham gia!
        </h1>
        <p className="text-base sm:text-lg text-white max-w-2xl mx-auto leading-relaxed">
          Quy trình & <strong className="text-cyan-400">“Skill AI Sao Chép Bất Kỳ Landing Page”</strong> đã được kích hoạt trực tiếp vào email của bạn.
        </p>
        {email && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>Tài khoản nhận: <strong className="text-cyan-400">{email}</strong></span>
          </div>
        )}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Drive Download */}
        <div className="rounded-2xl border border-slate-800 bg-[#0c1427] p-6 sm:p-8 space-y-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400">
              <Download className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black uppercase text-white">
              Tải Skill AI & Video Hướng Dẫn
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Truy cập ngay kho Google Drive VIP chứa mã nguồn Skill AI, file Prompt chuẩn và video hướng dẫn từng bước 1-click.
            </p>
          </div>

          <a 
            href="https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 py-3.5 px-6 font-black text-[#050811] hover:opacity-95 shadow-lg transition-all text-sm uppercase cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>MỞ KHO DRIVE TÀI LIỆU</span>
          </a>
        </div>

        {/* Support Zalo */}
        <div className="rounded-2xl border border-slate-800 bg-[#0c1427] p-6 sm:p-8 space-y-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black uppercase text-white">
              Hỗ Trợ Kỹ Thuật Nguyễn Đăng AI
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Cần trợ giúp cài đặt skill hoặc clone trang mẫu đặc biệt? Nhắn tin trực tiếp qua Zalo admin: <strong className="text-emerald-400">0938.494.303</strong>.
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
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
            Cộng đồng Tự Học AI
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white mt-1">
            Gia nhập Nhóm Zalo Tự Học AI VIP (Miễn Phí)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Học hỏi cách xây dựng hệ thống web tự động hóa và AI Coding cùng Nguyễn Đăng AI.
          </p>
        </div>

        <a
          href="https://zalo.me/g/tuhocai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-[#050811] hover:opacity-95 font-black text-xs sm:text-sm flex items-center gap-2 transition-colors"
        >
          <span>Vào Nhóm Zalo VIP</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 pt-8 pb-4 text-center text-xs sm:text-sm text-slate-400">
        <p>© 2026 NGUYỄN ĐĂNG AI · TỰ HỌC AI (tuhocai.top) · STK VIB: 0934434101 · Zalo: 0938.494.303</p>
      </footer>
    </div>
  );
}

export default function ThankYouCopyLpPage() {
  return (
    <div className="min-h-screen bg-[#050811] text-[#f5f4ef] font-sans antialiased selection:bg-[#00f2fe] selection:text-[#050811] px-4 py-8 sm:py-12">
      <Suspense fallback={<div className="text-center py-20 text-white">Đang tải thông tin...</div>}>
        <ThankYouContent />
      </Suspense>
    </div>
  );
}
