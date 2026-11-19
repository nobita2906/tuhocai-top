'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Zap, RefreshCw, MessageCircle, FileText, CheckCircle2, Star, Quote } from 'lucide-react';

export default function TrustSection() {
  const testimonials = [
    {
      name: 'Anh Hoàng Nam',
      role: 'Chủ shop thời trang online',
      avatar: '👨‍💼',
      quote:
        'Trước đây mỗi ngày mất gần 3 tiếng để viết caption và đăng bài Facebook, Zalo. Từ khi dùng workflow n8n của anh Đăng, mọi thứ chạy tự động hoàn toàn, chỉ cần nhập ý tưởng vào Google Sheets là bài tự đăng chuẩn giờ.',
    },
    {
      name: 'Bạn Thu Thảo',
      role: 'Content Creator TikTok',
      avatar: '👩‍🎨',
      quote:
        'Khóa học video AI từ 1 ảnh rất dễ hiểu. Mình không rành công nghệ nhưng làm theo từng bước là xuất được video mượt mà, kênh mới làm 2 tuần đã có video đạt hơn 50.000 views!',
    },
    {
      name: 'Anh Tuấn Anh',
      role: 'Trưởng phòng kinh doanh',
      avatar: '👨‍💻',
      quote:
        'Bộ prompt và skill AI cho công việc văn phòng thực sự đáng giá từng đồng. Mình áp dụng để tóm tắt biên bản họp và soạn email cho đối tác cực nhanh. Bạn Đăng hỗ trợ Zalo rất nhiệt tình khi mình gặp lỗi.',
    },
  ];

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
    <section id="an-tam" className="py-8 sm:py-14 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            CAM KẾT &amp; BẢO CHỨNG
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Vì Sao Bạn Có Thể Hoàn Toàn An Tâm?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Mọi sản phẩm trên Tự Học AI đều được xây dựng từ kinh nghiệm thực chiến và đi kèm cam kết đồng hành rõ ràng.
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

        {/* 3 Đánh Giá / Cảm Nhận Thực Tế */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Quote className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
              <span>Chia sẻ từ các bạn trong cộng đồng Tự Học AI</span>
            </h3>
            <div className="flex items-center gap-1 text-amber-400 text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bento-card p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-4"
              >
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-white/5">
                  <span className="text-2xl p-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.05]">
                    {t.avatar}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {t.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
              className="text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              Chính sách hoàn tiền 7 ngày →
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              href="/dieu-khoan"
              className="text-indigo-700 dark:text-indigo-400 hover:underline"
            >
              Điều khoản sử dụng →
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              href="/bao-mat"
              className="text-cyan-700 dark:text-cyan-400 hover:underline"
            >
              Chính sách bảo mật →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

