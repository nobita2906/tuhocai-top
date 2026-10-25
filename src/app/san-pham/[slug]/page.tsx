import { query } from '@/lib/db';
import { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductCover } from '@/lib/productImages';
import ProductCard from '@/components/ProductCard';
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
  Cpu,
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
    title: `${p.name} - Tự Học AI (tuhocai.top)`,
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
  const coverImage = getProductCover(product);

  // Fetch 4 related products (1 hàng 4 thẻ)
  const related = await query<Product>(
    'SELECT * FROM products WHERE id != ? AND is_active = TRUE ORDER BY sales_count DESC LIMIT 4',
    [product.id]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 transition-colors duration-200">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
        <Link href="/" className="hover:text-indigo-800 dark:hover:text-white transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link href="/san-pham" className="hover:text-indigo-800 dark:hover:text-white transition-colors">Kho sản phẩm</Link>
        <span>/</span>
        <span className="text-indigo-800 dark:text-cyan-400 truncate max-w-xs font-bold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Product Info & Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Cover Image Banner */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-[#111116] border-2 border-slate-300 dark:border-white/15 shadow-xl">
            <Image
              src={coverImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-[#09090b]/90 via-transparent to-transparent pointer-events-none" />
            
            {/* Free or Discount badge */}
            {isFree ? (
              <div className="absolute top-3 left-3 px-3 py-1 rounded-lg font-mono text-xs font-black bg-emerald-700 text-white border border-emerald-500 shadow-lg shadow-emerald-950/40">
                MIỄN PHÍ 0Đ
              </div>
            ) : product.original_price > product.price ? (
              <div className="absolute top-3 left-3 px-3 py-1 rounded-lg font-mono text-xs font-black bg-gradient-to-r from-indigo-800 to-blue-800 text-white shadow-lg shadow-indigo-950/40 border border-indigo-400/40">
                -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
              </div>
            ) : null}

            <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-xs font-mono font-bold text-cyan-300 border border-white/20">
              {product.category}
            </div>
          </div>

          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-100 dark:bg-indigo-500/10 text-indigo-900 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-500/25 uppercase">
              <Cpu className="w-3.5 h-3.5 text-indigo-700 dark:text-cyan-400" />
              Mã: {product.pid} • Sẵn sàng triển khai
            </span>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {product.description}
            </p>
          </div>

          {/* Included Features Box */}
          <div className="bento-card p-6 space-y-4 border-2 border-slate-300 dark:border-white/15">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 font-mono">
              <Layers className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
              Gói sản phẩm bao gồm
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-black/40 border-2 border-slate-200 dark:border-white/[0.08]">
                <FileCode className="w-4 h-4 text-indigo-700 dark:text-indigo-400 flex-shrink-0" />
                <span className="font-semibold">Mã nguồn JSON flow chuẩn n8n / Prompt VIP</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-black/40 border-2 border-slate-200 dark:border-white/[0.08]">
                <Video className="w-4 h-4 text-emerald-700 dark:text-emerald-400 flex-shrink-0" />
                <span className="font-semibold">Video hướng dẫn cài đặt & vận hành từ A-Z</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-black/40 border-2 border-slate-200 dark:border-white/[0.08]">
                <Clock className="w-4 h-4 text-cyan-700 dark:text-cyan-400 flex-shrink-0" />
                <span className="font-semibold">Cập nhật miễn phí khi có phiên bản mới</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-black/40 border-2 border-slate-200 dark:border-white/[0.08]">
                <MessageCircle className="w-4 h-4 text-purple-700 dark:text-purple-400 flex-shrink-0" />
                <span className="font-semibold">Hỗ trợ kỹ thuật 1-1 qua Zalo</span>
              </div>
            </div>
          </div>

          {/* Detailed Content / Breakdown */}
          <div className="bento-card p-6 space-y-4 text-slate-700 dark:text-slate-300 text-sm leading-relaxed border-2 border-slate-300 dark:border-white/15">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Chi tiết kỹ thuật & Lợi ích thực tế</h3>
            <p>
              Tất cả các node xử lý logic, phân nhánh điều kiện, kết nối API và xử lý lỗi (Error Trigger) đều được cấu hình sẵn. Sau khi mua hoặc kích hoạt, bạn chỉ cần thay thông tin API Key và kích hoạt là hệ thống tự động chạy 24/7.
            </p>
          </div>
        </div>

        {/* Right Column: Checkout Purchase Box */}
        <div className="lg:col-span-5 sticky top-24 bento-card p-6 sm:p-8 space-y-6 shadow-xl border-2 border-slate-300 dark:border-white/15">
          <div className="space-y-2 border-b border-slate-200 dark:border-white/[0.08] pb-5">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono font-semibold">Giá sở hữu trọn đời</p>
            {isFree ? (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400 font-mono">0 đ</span>
                <span className="text-sm text-slate-400 line-through font-mono">99.000 đ</span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black font-mono bg-emerald-700 text-white">
                  MIỄN PHÍ
                </span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-indigo-800 dark:text-indigo-400 font-mono">
                  {new Intl.NumberFormat('vi-VN').format(product.price)} đ
                </span>
                {product.original_price > product.price && (
                  <span className="text-sm text-slate-400 line-through font-mono font-semibold">
                    {new Intl.NumberFormat('vi-VN').format(product.original_price)} đ
                  </span>
                )}
              </div>
            )}
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              * Nhận file ngay lập tức sau khi thanh toán hoặc đăng ký.
            </p>
          </div>

          <div className="space-y-3">
            {isFree ? (
              <Link
                href={`/thanh-toan?pid=${product.pid}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-700 hover:opacity-85 text-white font-black text-sm border-2 border-emerald-500 shadow-xl shadow-emerald-950/25 transition-all active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                Tải Xuống Miễn Phí Ngay
              </Link>
            ) : (
              <Link
                href={`/thanh-toan?pid=${product.pid}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 hover:opacity-85 text-white font-black text-sm shadow-xl shadow-indigo-950/30 transition-all active:scale-[0.98]"
              >
                <ShoppingCart className="w-4 h-4" />
                Mua Ngay Bằng VietQR ({new Intl.NumberFormat('vi-VN').format(product.price)} đ)
              </Link>
            )}

            <a
              href="https://zalo.me/0938494303"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white dark:bg-white/[0.04] hover:opacity-80 text-slate-800 dark:text-slate-200 font-bold text-xs border-2 border-slate-300 dark:border-white/[0.1] transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Chat Zalo Tư Vấn Trực Tiếp (0938 494 303)
            </a>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/[0.08] text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Duyệt tự động qua Bot Telegram & nhận link tức thì</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-700 dark:text-indigo-400 flex-shrink-0" />
              <span>Được lưu vĩnh viễn vào Kho tài liệu cá nhân</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products: 1 hàng 4 sản phẩm */}
      {related.length > 0 && (
        <div className="space-y-6 pt-10 border-t-2 border-slate-200 dark:border-white/[0.08]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-800 dark:text-indigo-400" />
              Sản Phẩm Cùng Chuyên Mục
            </h2>
            <Link href="/san-pham" className="text-xs font-bold text-indigo-800 dark:text-indigo-400 hover:underline font-mono">
              Xem tất cả →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
