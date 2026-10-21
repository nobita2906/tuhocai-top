import { query } from '@/lib/db';
import { Product } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  Download,
  ShoppingCart,
  ArrowLeft,
  Layers,
  FileCode,
  Video,
  Clock,
  Sparkles,
  MessageCircle,
} from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await query<Product>('SELECT * FROM products WHERE slug = ? OR pid = ? LIMIT 1', [slug, slug]);
  if (products.length === 0) return { title: 'Sản phẩm không tồn tại' };

  const p = products[0];
  return {
    title: `${p.name} - Tự Học AI`,
    description: p.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await query<Product>('SELECT * FROM products WHERE slug = ? OR pid = ? LIMIT 1', [slug, slug]);

  if (products.length === 0) {
    notFound();
  }

  const product = products[0];
  const isFree = product.price === 0;

  // Fetch 3 related products
  const related = await query<Product>(
    'SELECT * FROM products WHERE id != ? AND is_active = TRUE ORDER BY sales_count DESC LIMIT 3',
    [product.id]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-white">Trang chủ</Link>
        <span>/</span>
        <Link href="/san-pham" className="hover:text-white">Kho sản phẩm</Link>
        <span>/</span>
        <span className="text-slate-200 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Product Info & Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
              <Zap className="w-3.5 h-3.5" />
              {product.category} • Mã: {product.pid}
            </span>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Included Features Box */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Gói sản phẩm bao gồm
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <FileCode className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>Mã nguồn JSON flow chuẩn n8n</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <Video className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Video hướng dẫn cài đặt từ A-Z</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Cập nhật miễn phí khi có phiên bản mới</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <MessageCircle className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <span>Hỗ trợ kỹ thuật 1-1 qua Zalo</span>
              </div>
            </div>
          </div>

          {/* Workflow Overview Text */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h3 className="font-bold text-white text-base">Mô tả chi tiết giải pháp</h3>
            <p>
              Hệ thống được thiết kế theo tiêu chuẩn công nghiệp, cho phép triển khai linh hoạt trên cả nền tảng <strong>n8n Cloud</strong> và <strong>n8n Self-hosted (VPS riêng)</strong>.
            </p>
            <p>
              Tất cả các node xử lý logic, phân nhánh điều kiện, kết nối API và xử lý lỗi (Error Trigger) đều được cấu hình sẵn. Sau khi mua hoặc kích hoạt, bạn chỉ cần thay thông tin API Key và kích hoạt là hệ thống tự động chạy 24/7.
            </p>
          </div>
        </div>

        {/* Right Column: Checkout Purchase Box */}
        <div className="lg:col-span-5 sticky top-24 rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="space-y-2 border-b border-slate-800 pb-5">
            <p className="text-xs text-slate-400">Giá sở hữu trọn đời</p>
            {isFree ? (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-400">0 đ</span>
                <span className="text-sm text-slate-500 line-through">99.000 đ</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                  MIỄN PHÍ
                </span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">
                  {new Intl.NumberFormat('vi-VN').format(product.price)} đ
                </span>
                {product.original_price > product.price && (
                  <span className="text-sm text-slate-500 line-through">
                    {new Intl.NumberFormat('vi-VN').format(product.original_price)} đ
                  </span>
                )}
              </div>
            )}
            <p className="text-[11px] text-slate-400">
              * Thanh toán 1 lần duy nhất, không phát sinh chi phí duy trì hàng tháng.
            </p>
          </div>

          <div className="space-y-3">
            {isFree ? (
              <Link
                href={`/thanh-toan?pid=${product.pid}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                Tải Xuống Miễn Phí Ngay
              </Link>
            ) : (
              <Link
                href={`/thanh-toan?pid=${product.pid}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <ShoppingCart className="w-4 h-4" />
                Mua Ngay Bằng VietQR ({new Intl.NumberFormat('vi-VN').format(product.price)} đ)
              </Link>
            )}

            <a
              href="https://zalo.me/0938494303"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              Chat Zalo Tư Vấn Trực Tiếp (0938 494 303)
            </a>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Duyệt tự động qua Bot Telegram & nhận link tức thì</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>Được lưu vĩnh viễn vào Kho tài liệu cá nhân</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
