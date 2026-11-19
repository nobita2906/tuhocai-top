'use client';

import Link from 'next/link';
import { Product } from '@/types';
import { Zap, ArrowRight, CheckCircle2, Star, ShieldCheck } from 'lucide-react';

interface TopProductsSectionProps {
  products: Product[];
}

export default function TopProductsSection({ products }: TopProductsSectionProps) {
  // Lấy sản phẩm văn phòng 69k (hoặc fallback)
  const officeProd = products.find((p) => p.pid === 'PACK-OFFICE-069' || p.slug === 'bo-prompt-ai-van-phong') || {
    id: 'prod-office',
    pid: 'PACK-OFFICE-069',
    name: 'Bộ Prompt & Skill AI Văn Phòng 4.0: Tối Ưu Năng Suất',
    slug: 'bo-prompt-ai-van-phong',
    price: 69000,
    original_price: 69000,
    category: 'skill',
    description: 'Bộ hơn 50+ prompt và quy trình ứng dụng ChatGPT & Claude thực chiến cho dân văn phòng và người mới bắt đầu.',
  };

  const comboVideo = products.find((p) => p.pid === 'COMBO-VIDEO-299') || {
    id: 'prod-combo-video',
    pid: 'COMBO-VIDEO-299',
    name: 'Combo Video AI Sáng Tạo Nội Dung Bán Hàng',
    slug: 'combo-video-ai-ban-hang',
    landing_page_url: '/lp/video-ai-tu-1-anh',
    price: 299000,
    original_price: 564000,
    category: 'combo',
    description: 'Trọn bộ 3 sản phẩm: Khóa học Video AI từ 1 ảnh, Mini Drama gia đình và kho prompt FLUX thương mại.',
  };

  const comboAuto = products.find((p) => p.pid === 'COMBO-AUTO-349') || {
    id: 'prod-combo-auto',
    pid: 'COMBO-AUTO-349',
    name: 'Combo Super Automation n8n & Doanh Nghiệp Tự Động',
    slug: 'combo-super-automation-n8n',
    price: 349000,
    original_price: 745000,
    category: 'combo',
    description: 'Hệ thống tự động hóa kinh doanh toàn diện: n8n đăng bài đa kênh, nuôi fanpage, auto email và bot AI hỗ trợ.',
  };

  const TOP_THREE = [
    {
      roleBadge: 'ĐẦU VÀO CHO NGƯỜI MỚI & VĂN PHÒNG • 69K',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
      target: 'Dành cho người mới & dân văn phòng muốn có kết quả ngay',
      product: officeProd,
      outcome: 'Ứng dụng AI vào soạn thảo văn bản, viết email đối tác, tóm tắt biên bản họp và xử lý dữ liệu Sheets trong 5 phút.',
      highlights: [
        '50+ prompt thực chiến cho công việc hành chính & văn phòng',
        'Cẩm nang hướng dẫn sử dụng ChatGPT, Claude & Gemini',
        'Cam kết hoàn tiền 100% trong 7 ngày nếu không hài lòng',
      ],
      detailLink: `/san-pham/${officeProd.slug}`,
      isPopular: false,
    },
    {
      roleBadge: 'COMBO BÁN CHẠY NHẤT • 299K',
      badgeColor: 'bg-indigo-500/15 text-indigo-700 dark:text-cyan-300 border-indigo-500/30',
      target: 'Dành cho Content Creator & Người làm nội dung',
      product: comboVideo,
      outcome: 'Tự sản xuất chuỗi video ngắn bán hàng và xây kênh thương hiệu từ 1 bức ảnh tĩnh duy nhất.',
      highlights: [
        'Khóa học Video AI từ 1 ảnh (cập nhật mới)',
        'Quy trình kịch bản Mini Drama hút khách',
        'Kho 100+ prompt FLUX thương mại (cho phép dùng tạo ảnh thương mại)',
      ],
      detailLink: comboVideo.landing_page_url || `/san-pham/${comboVideo.slug}`,
      isPopular: true,
    },
    {
      roleBadge: 'TỰ ĐỘNG HÓA DOANH NGHIỆP • 349K',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25',
      target: 'Dành cho Chủ shop & Văn phòng kinh doanh tự động',
      product: comboAuto,
      outcome: 'Tự động hóa hoàn toàn việc đăng bài đa kênh và chăm sóc khách hàng, tối ưu thời gian vận hành.',
      highlights: [
        'Workflow n8n auto-post Facebook, Zalo, WordPress',
        'Tự động đồng bộ leads vào Google Sheets & Email',
        'Kèm file hướng dẫn cài đặt self-host trên VPS',
      ],
      detailLink: `/san-pham/${comboAuto.slug}`,
      isPopular: false,
    },
  ];

  return (
    <section id="san-pham" className="py-8 sm:py-14 border-t border-slate-200 dark:border-white/5 scroll-mt-20">
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

        {/* 3 Thẻ Sản Phẩm Theo Thang Giá Đúng Chuẩn Phễu */}
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
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Thanh toán 1 lần • Sở hữu trọn đời • Hoàn tiền 7 ngày</span>
                    </p>
                  </div>

                  {/* Nút Xem chi tiết theo chuẩn Blueprint */}
                  <Link
                    href={item.detailLink}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold transition-all ${
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
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors py-2"
          >
            <span>Khám phá thêm các công cụ &amp; prompt khác trong kho sản phẩm</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
