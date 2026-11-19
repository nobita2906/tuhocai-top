'use client';

import Link from 'next/link';
import { ShieldCheck, Zap, RefreshCw, MessageCircle, FileText, CheckCircle2, Award, Scale, HelpCircle } from 'lucide-react';

export default function TrustSection() {
  const guarantees = [
    {
      icon: Zap,
      title: 'Giao link tự động trong 30 giây',
      desc: 'Hệ thống thanh toán quét mã VietQR tự động kích hoạt và gửi link tải ngay vào email & màn hình.',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: RefreshCw,
      title: 'Cập nhật tài liệu trọn đời',
      desc: 'Mọi video bài giảng mới, phiên bản cập nhật của workflow n8n và bộ prompt đều được nhận miễn phí.',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      icon: MessageCircle,
      title: 'Hỗ trợ kỹ thuật 1-1 qua Zalo',
      desc: 'Không lo bị bỏ rơi. Nếu gặp khó khăn khi cài đặt n8n hay viết prompt, bạn được hỗ trợ trực tiếp.',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: ShieldCheck,
      title: 'Hoàn tiền 100% trong 7 ngày',
      desc: 'Nếu tài liệu hoặc workflow không đúng như mô tả hoặc bạn không thể áp dụng, hoàn tiền 100% không phiền hà.',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
  ];

  return (
    <section id="an-tam" className="py-8 sm:py-14 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            CAM KẾT &amp; BẢO CHỨNG MINH BẠCH
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Vì Sao Bạn Có Thể Hoàn Toàn An Tâm?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Mọi sản phẩm trên Tự Học AI đều được xây dựng từ trải nghiệm thực chiến của Nguyễn Đăng AI và đi kèm cam kết đồng hành rõ ràng.
          </p>
        </div>

        {/* 4 Bảo Chứng An Tâm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {guarantees.map((g, i) => {
            const Icon = g.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-200 dark:border-white/10 space-y-3 hover:border-indigo-400/40 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${g.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {g.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {g.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Khối Minh Bạch Bản Quyền & Giấy Phép Sử Dụng Thương Mại (Giải quyết vấn đề C18) */}
        <div className="rounded-2xl p-6 sm:p-7 bg-white dark:bg-[#111116] border-2 border-slate-200 dark:border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Quy Định Bản Quyền &amp; Quyền Sử Dụng Thương Mại
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-1.5">
              <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>ĐƯỢC PHÉP (Quyền sử dụng):</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Bạn được toàn quyền sử dụng các hình ảnh, video và bài viết tạo ra từ prompt/workflow để làm kênh, quảng cáo và phục vụ hoạt động kinh doanh thương mại của cá nhân hoặc doanh nghiệp.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-1.5">
              <div className="font-bold text-amber-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>GIỚI HẠN (Bảo hộ tác quyền):</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Không được phép sao chép, đóng gói lại để bán lại (resell) file mã nguồn JSON gốc hoặc chia sẻ công khai bộ tài nguyên có phí cho bên thứ ba.
              </p>
            </div>
          </div>
        </div>

        {/* Dải liên kết chính sách minh bạch */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
            <span>Minh bạch thông tin &amp; bảo vệ quyền lợi người học theo tiêu chuẩn cao nhất:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
            <Link
              href="/hoan-tien"
              className="text-emerald-700 dark:text-emerald-400 hover:underline min-h-[44px] inline-flex items-center"
            >
              Chính sách hoàn tiền 7 ngày →
            </Link>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <Link
              href="/dieu-khoan"
              className="text-indigo-700 dark:text-indigo-400 hover:underline min-h-[44px] inline-flex items-center"
            >
              Điều khoản sử dụng →
            </Link>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <Link
              href="/bao-mat"
              className="text-cyan-700 dark:text-cyan-400 hover:underline min-h-[44px] inline-flex items-center"
            >
              Chính sách bảo mật →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
