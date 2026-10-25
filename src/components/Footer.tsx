import Link from 'next/link';
import { MessageCircle, Phone, Mail, ShieldCheck, Heart, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t-2 border-slate-300 dark:border-white/[0.08] bg-slate-100/90 dark:bg-[#09090b] text-slate-700 dark:text-slate-400 transition-colors duration-200">
      {/* Top CTA Banner with subtle tech glow */}
      <div className="border-b-2 border-slate-300 dark:border-white/[0.06] bg-gradient-to-r from-indigo-50/90 via-white to-cyan-50/90 dark:from-indigo-950/20 dark:via-slate-900/60 dark:to-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20 font-mono text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Cộng đồng 10.000+ thành viên
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tham gia Group Zalo Tự Học AI & Tự Động Hóa Thực Chiến
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Nhận thông báo cập nhật workflow n8n mới nhất, hỏi đáp kỹ thuật và nhận tài liệu miễn phí mỗi ngày.
            </p>
          </div>
          <a
            href="https://zalo.me/g/tuhocai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 hover:opacity-85 text-white font-bold text-sm shadow-xl shadow-emerald-950/25 border-2 border-emerald-500 transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-5 h-5" />
            Vào Nhóm Zalo Ngay
          </a>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg text-slate-900 dark:text-white">TỰ HỌC AI</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Nền tảng chia sẻ kiến thức Trí Tuệ Nhân Tạo thực chiến, hệ thống tự động hóa n8n, AI Agent và bộ công cụ tăng tốc hiệu suất công việc.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Thanh toán an toàn qua VietQR — Phê duyệt tức thì</span>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 font-mono">Tài nguyên AI</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/san-pham" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">Workflow n8n Tự Động Hóa</Link></li>
            <li><Link href="/san-pham?cat=skill" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">Kỹ Năng Sử Dụng AI (Skills)</Link></li>
            <li><Link href="/san-pham?cat=prompt" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">Bộ Prompt AI Chuẩn Thương Mại</Link></li>
            <li><Link href="/#tai-lieu-free" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">Tải Tài Liệu Miễn Phí (Free Leads)</Link></li>
            <li><Link href="/affiliate" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors font-bold text-amber-600 dark:text-amber-400">🤝 Kiếm Tiền Cùng Affiliate (30%-50%)</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 font-mono">Kiến thức</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/bai-viet" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">Tin Tức Công Nghệ AI Mới Nhất</Link></li>
            <li><Link href="/bai-viet?cat=workflow" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">Hướng Dẫn Setup n8n Từ A-Z</Link></li>
            <li><Link href="/bai-viet?cat=prompt" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">Kỹ Thuật Viết Prompt Chuyên Sâu</Link></li>
            <li><Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">Kho Tài Liệu Đã Lưu Của Tôi</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 font-mono">Hỗ trợ & Liên hệ</h4>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Hotline / Zalo: <strong className="text-slate-900 dark:text-white font-mono">0938.494.303</strong> (Đăng)</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Email: <strong className="text-slate-900 dark:text-white font-mono">dang@tuhocai.top</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Zalo Admin: <a href="https://zalo.me/0938494303" target="_blank" className="text-emerald-600 dark:text-emerald-400 hover:underline font-mono">0938 494 303</a></span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-white/[0.06] py-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-4">
        <p>© 2026 Tự Học AI (tuhocai.top). Bản quyền nội dung thuộc về Nguyễn Văn Đăng.</p>
        <p className="flex items-center gap-1">
          Xây dựng với <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> cho cộng đồng AI Việt Nam
        </p>
      </div>
    </footer>
  );
}
