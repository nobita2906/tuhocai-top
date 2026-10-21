import Link from 'next/link';
import { Sparkles, MessageCircle, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-slate-400">
      {/* Top CTA Banner */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Cộng đồng 10.000+ thành viên
            </span>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Tham gia Group Zalo Tự Học AI & Tự Động Hóa Thực Chiến
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Nhận thông báo cập nhật workflow n8n mới nhất, hỏi đáp kỹ thuật và tài liệu miễn phí mỗi ngày.
            </p>
          </div>
          <a
            href="https://zalo.me/g/tuhocai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-xl shadow-emerald-600/25 transition-all hover:scale-105"
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
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg text-white">TỰ HỌC AI</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Nền tảng chia sẻ kiến thức Trí Tuệ Nhân Tạo thực chiến, hệ thống tự động hóa n8n, AI Agent và bộ công cụ tăng tốc hiệu suất công việc.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Thanh toán an toàn qua VietQR — Phê duyệt tức thì</span>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Tài nguyên AI</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/san-pham" className="hover:text-white transition-colors">Workflow n8n Tự Động Hóa</Link></li>
            <li><Link href="/san-pham?cat=skill" className="hover:text-white transition-colors">Kỹ Năng Sử Dụng AI (Skills)</Link></li>
            <li><Link href="/san-pham?cat=prompt" className="hover:text-white transition-colors">Bộ Prompt AI Chuẩn Thương Mại</Link></li>
            <li><Link href="/#tai-lieu-free" className="hover:text-white transition-colors">Tải Tài Liệu Miễn Phí (Free Leads)</Link></li>
          </ul>
        </div>

        {/* Knowledge & News */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Kiến thức</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/bai-viet" className="hover:text-white transition-colors">Tin Tức Công Nghệ AI Mới Nhất</Link></li>
            <li><Link href="/bai-viet?cat=workflow" className="hover:text-white transition-colors">Hướng Dẫn Setup n8n Từ A-Z</Link></li>
            <li><Link href="/bai-viet?cat=prompt" className="hover:text-white transition-colors">Kỹ Thuật Viết Prompt Chuyên Sâu</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Kho Tài Liệu Đã Lưu Của Tôi</Link></li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Hỗ trợ & Liên hệ</h4>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-indigo-400" />
              <span>Hotline / Zalo: <strong className="text-white">0938.494.303</strong> (Đăng)</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>Email: <strong className="text-white">dang@tuhocai.top</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Zalo Admin: <a href="https://zalo.me/0938494303" target="_blank" className="text-emerald-400 hover:underline">0938 494 303</a></span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-4">
        <p>© 2026 Tự Học AI (tuhocai.top). Bản quyền nội dung thuộc về Nguyễn Văn Đăng.</p>
        <p className="flex items-center gap-1">
          Xây dựng với <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> cho cộng đồng AI Việt Nam
        </p>
      </div>
    </footer>
  );
}
