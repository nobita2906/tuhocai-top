'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { Sparkles, ArrowRight, Zap, CheckCircle2, ShieldCheck, Star } from 'lucide-react';

interface TopProductsSectionProps {
  products: Product[];
}

export default function TopProductsSection({ products }: TopProductsSectionProps) {
  // Lọc đúng 3 sản phẩm theo thang giá của Blueprint
  const tripwire = products.find((p) => p.pid === 'SKILL-CLONE-099' || p.price === 99000) || {
    id: 'prod-tripwire',
    pid: 'SKILL-CLONE-099',
    name: 'Skill AI Phân Tích & Tự Dựng Landing Page Chuẩn CRO (99K)',
    slug: 'lp/sao-chep-landing-page',
    landing_page_url: '/lp/sao-chep-landing-page',
    price: 99000,
    original_price: 99000,
    thumbnail: '/images/products/skill-claude.svg',
    description: 'Quy trình AI phân tích cấu trúc landing page mẫu và tự dựng lại theo giao diện của bạn với Next.js và Tailwind CSS.',
  };

  const comboVideo = products.find((p) => p.pid === 'COMBO-VIDEO-299') || {
    id: 'prod-combo-video',
    pid: 'COMBO-VIDEO-299',
    name: 'Combo Video AI Bán Hàng & Sáng Tạo Nội Dung',
    slug: 'lp/video-ai-tu-1-anh',
    landing_page_url: '/lp/video-ai-tu-1-anh',
    price: 299000,
    original_price: 564000,
    thumbnail: '/sites/tuhocai-top/landing/video-vip/ket-qua-video.jpg',
    description: 'Trọn bộ 3 sản phẩm: Khóa học Video AI từ 1 ảnh, Mini Drama gia đình và kho prompt FLUX thương mại.',
  };

  const comboAuto = products.find((p) => p.pid === 'COMBO-AUTO-349') || {
    id: 'prod-combo-auto',
    pid: 'COMBO-AUTO-349',
    name: 'Combo Super Automation n8n & Doanh Nghiệp Tự Động',
    slug: 'san-pham/COMBO-AUTO-349',
    landing_page_url: '/san-pham/COMBO-AUTO-349',
    price: 349000,
    original_price: 745000,
    thumbnail: '/images/n8n-workflow-demo.jpg',
    description: 'Hệ thống tự động hóa kinh doanh toàn diện: n8n đăng bài đa kênh, nuôi fanpage, auto email và bot AI hỗ trợ.',
  };

  const TOP_THREE = [
    {
      roleBadge: 'SẢN PHẨM ĐẦU VÀO • 99K',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
      target: 'Dành cho người mới muốn có kết quả ngay',
      product: tripwire,
      outcome: 'Dựng landing page bán hàng chuẩn cấu trúc CRO chỉ trong 1 buổi tối mà không cần biết code.',
      highlights: [
        'Prompt Claude/GPT phân tích cấu trúc chuyên sâu',
        'Template source code Next.js + Tailwind dựng sẵn',
        'Checklist tối ưu tỷ lệ chuyển đổi đơn hàng',
      ],
      detailLink: tripwire.landing_page_url || `/san-pham/${tripwire.pid}`,
      isPopular: false,
    },
    {
      roleBadge: 'COMBO BÁN CHẠY NHẤT • 299K',
      badgeColor: 'bg-indigo-500/15 text-indigo-700 dark:text-cyan-300 border-indigo-500/30',
      target: 'Dành cho Content Creator & Người xây kênh',
      product: comboVideo,
      outcome: 'Tự sản xuất hàng chục video ngắn bán hàng và xây kênh thương hiệu từ 1 bức ảnh tĩnh duy nhất.',
      highlights: [
        'Khóa học Video AI từ 1 ảnh (cập nhật mới)',
        'Quy trình kịch bản Mini Drama hút khách',
        'Kho 100+ prompt FLUX thương mại bản quyền',
      ],
      detailLink: comboVideo.landing_page_url || `/san-pham/${comboVideo.pid}`,
      isPopular: true,
    },
    {
      roleBadge: 'TỰ ĐỘNG HÓA VẬN HÀNH • 349K',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25',
      target: 'Dành cho Chủ shop & Văn phòng kinh doanh',
      product: comboAuto,
      outcome: 'Tự động hóa hoàn toàn việc đăng bài đa kênh và chăm sóc khách hàng, tiết kiệm 80% thời gian.',
      highlights: [
        'Workflow n8n auto-post Facebook, Zalo, WordPress',
        'Tự động đồng bộ leads vào Google Sheets & Email',
        'Kèm file hướng dẫn cài đặt self-host trên VPS',
      ],
      detailLink: comboAuto.landing_page_url || `/san-pham/${comboAuto.pid}`,
      isPopular: false,
    },
  ];

  return (
    <section id="san-pham" className="py-8 sm:py-14 border-t border-slate-200 dark:border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-cyan-400 border border-indigo-500/20 text-xs font-mono font-bold">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            CÔNG CỤ ĐÓNG GÓI SẴN
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Giải Pháp AI Tinh Tuyển Cho Từng Mục Tiêu
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Nếu bạn muốn tiết kiệm thời gian mày mò, đây là 3 gói công cụ đã được Nguyễn Đăng AI đóng gói sẵn. Tải về import là chạy.
          </p>
        </div>

        {/* 3 Thẻ Sản Phẩm Theo Thang Giá */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 items-stretch">
          {TOP_THREE.map((item, idx) => {
            const p = item.product;
            const priceFormatted = new Intl.NumberFormat('vi-VN').format(p.price);

            return (
              <div
                key={p.pid || idx}
                className={`relative flex flex-col justify-between rounded-3xl bg-white dark:bg-[#111116] border-2 transition-all duration-300 p-6 sm:p-7 ${
                  item.isPopular
                    ? 'border-indigo-600 dark:border-indigo-500 shadow-2xl shadow-indigo-950/20 md:-translate-y-2'
                    : 'border-slate-200 dark:border-white/10 hover:border-indigo-400/50 hover:shadow-xl'
                }`}
              >
                {/* Popular Pill */}
                {item.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-indigo-700 to-blue-600 text-white font-mono font-bold text-[11px] shadow-md flex items-center gap-1.5 whitespace-nowrap">
                    <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                    ĐƯỢC NHIỀU BẠN CHỌN NHẤT
                  </div>
                )}

                <div className="space-y-4">
                  {/* Badge & Target */}
                  <div className="space-y-1.5">
                    <span className={`inline-block text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                      {item.roleBadge}
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {item.target}
                    </p>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                    {p.name}
                  </h3>

                  {/* Outcome Highlight */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {item.outcome}
                  </p>

                  {/* Highlights Checklist */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                    {item.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/5 space-y-3">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                        {priceFormatted}đ
                      </span>
                      {p.original_price > p.price && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          (Mua lẻ: {new Intl.NumberFormat('vi-VN').format(p.original_price)}đ)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Thanh toán 1 lần • Sở hữu vĩnh viễn
                    </p>
                  </div>

                  {/* Nút Xem chi tiết theo chuẩn Blueprint (không đặt Mua ngay trực tiếp tại đây) */}
                  <Link
                    href={item.detailLink}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      item.isPopular
                        ? 'bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 hover:opacity-95 text-white shadow-lg shadow-indigo-950/20'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-slate-900 dark:text-white border border-slate-300 dark:border-white/10'
                    }`}
                  >
                    <span>Xem Chi Tiết Giải Pháp</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Link xem toàn bộ kho sản phẩm */}
        <div className="text-center pt-2">
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
          >
            <span>Khám phá thêm các công cụ &amp; prompt khác trong kho sản phẩm</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

