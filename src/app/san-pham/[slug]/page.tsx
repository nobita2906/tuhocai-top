import { query } from '@/lib/db';
import { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { getProductCover } from '@/lib/productImages';
import { getProductTargetUrl, isLandingPageProduct } from '@/lib/productLinks';
import ProductCard from '@/components/ProductCard';
import {
  ShieldCheck,
  CheckCircle2,
  Download,
  ShoppingCart,
  Layers,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Zap,
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

  // Nếu sản phẩm này có Landing Page chuyên sâu, tự động redirect sang Landing Page để tối đa chuyển đổi
  if (isLandingPageProduct(product)) {
    const targetUrl = getProductTargetUrl(product);
    if (targetUrl && targetUrl !== `/san-pham/${slug}` && targetUrl !== `/san-pham/${product.slug}`) {
      redirect(targetUrl);
    }
  }

  const isFree = product.price === 0;
  const coverImage = getProductCover(product);

  // Fetch 3 related products (1 hàng 3 thẻ thoáng đãng chuẩn mới)
  const related = await query<Product>(
    'SELECT * FROM products WHERE id != ? AND is_active = TRUE ORDER BY sales_count DESC LIMIT 3',
    [product.id]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 transition-colors duration-200">
      {/* 1. BREADCRUMB TINH GỌN */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link href="/san-pham" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Kho sản phẩm</Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-cyan-400 truncate max-w-xs font-semibold">{product.name}</span>
      </nav>

      {/* 2. KHUNG CHI TIẾT SẢN PHẨM: 2 CỘT CÂN ĐỐI, THOÁNG ĐÃNG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* CỘT TRÁI: TIÊU ĐỀ + ẢNH SẢN PHẨM + QUYỀN LỢI */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tiêu đề & Mô tả */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-500/20 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chuyên mục: {product.category || 'Tài nguyên AI'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              {product.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {product.description || 'Bộ tài liệu và mã nguồn tự động hóa được kiểm thử kỹ lưỡng, sẵn sàng triển khai ngay.'}
            </p>
          </div>

          {/* Ảnh Bìa Sản Phẩm Sắc Nét, Không Bị Dán Tem Mác */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-[#111116] border border-slate-300 dark:border-white/10 shadow-lg">
            <Image
              src={coverImage}
              alt={product.name}
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-[#09090b]/80 via-transparent to-transparent pointer-events-none" />

            {/* Chỉ 1 badge duy nhất ở góc trên nếu giảm giá hoặc miễn phí */}
            {isFree ? (
              <div className="absolute top-3 left-3 px-3 py-1 rounded-md text-xs font-mono font-bold bg-emerald-600 text-white shadow-md border border-emerald-400/40">
                Miễn phí 0đ
              </div>
            ) : product.original_price > product.price ? (
              <div className="absolute top-3 left-3 px-3 py-1 rounded-md text-xs font-mono font-bold bg-slate-900/85 text-white shadow-md border border-white/20">
                Tiết kiệm {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
              </div>
            ) : null}
          </div>

          {/* Quyền Lợi Gói Sản Phẩm: Dạng Danh Sách Checklist Tinh Tế */}
          <div className="rounded-2xl p-5 sm:p-6 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 font-mono">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
              <span>Gói sản phẩm bao gồm trọn bộ:</span>
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Mã nguồn JSON flow chuẩn n8n / Bộ Prompt VIP thương mại</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Tài liệu & Video hướng dẫn từng bước chi tiết cho người mới</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Cập nhật miễn phí các bản nâng cấp và sửa lỗi trọn đời</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Hỗ trợ kỹ thuật 1-1 qua nhóm Zalo VIP khi gặp vướng mắc</span>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: HỘP MUA HÀNG & SỞ HỮU GỌN GÀNG (STICKY) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl p-6 sm:p-7 space-y-5 shadow-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#0e0e13]">
            {/* Hàng Giá Tiền */}
            <div className="space-y-1 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Giá sở hữu trọn đời:</span>
              <div className="flex items-baseline gap-2.5 flex-wrap pt-1">
                {isFree ? (
                  <>
                    <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
                      0&nbsp;đ
                    </span>
                    <span className="text-sm text-slate-400 line-through font-mono">
                      99.000&nbsp;đ
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                      {new Intl.NumberFormat('vi-VN').format(product.price)}&nbsp;đ
                    </span>
                    {product.original_price > product.price && (
                      <span className="text-sm text-slate-400 dark:text-slate-500 line-through font-mono font-medium">
                        {new Intl.NumberFormat('vi-VN').format(product.original_price)}&nbsp;đ
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 1 NÚT BẤM CHÍNH DUY NHẤT (SINGLE CLEAR CTA) */}
            <div className="space-y-3">
              {isFree ? (
                <Link
                  href={`/thanh-toan?pid=${product.pid}`}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/20 transition-all active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Xuống Miễn Phí Ngay</span>
                </Link>
              ) : (
                <Link
                  href={`/thanh-toan?pid=${product.pid}`}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 hover:opacity-90 text-white font-bold text-sm shadow-xl shadow-indigo-950/25 transition-all hover:scale-[1.01] active:scale-[0.98]"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Mua Ngay Bằng VietQR ({new Intl.NumberFormat('vi-VN').format(product.price)} đ)</span>
                </Link>
              )}

              {/* Dòng Hỗ Trợ Zalo Tinh Tế */}
              <a
                href="https://zalo.me/0934434101"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Cần tư vấn nhanh? Chat Zalo: 0934.434.101</span>
              </a>
            </div>

            {/* 3 Cam Kết Chuẩn */}
            <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-white/[0.08] text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Duyệt tự động tức thì & nhận link tải ngay</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 dark:text-cyan-400 shrink-0" />
                <span>Lưu trữ vĩnh viễn trong Kho tài liệu của bạn</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
                <span>Cập nhật mã nguồn & tài liệu mới trọn đời</span>
              </div>
            </div>
          </div>

          {/* Dòng Text Nhỏ Giới Thiệu CTV Affiliate (Không làm loãng trang bán hàng) */}
          <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Muốn nhận hoa hồng 60% khi chia sẻ sản phẩm này?{' '}
              <Link href="/affiliate" className="text-indigo-600 dark:text-cyan-400 font-bold hover:underline inline-flex items-center gap-0.5">
                <span>Đăng ký CTV</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* 3. SẢN PHẨM CÙNG CHUYÊN MỤC (LƯỚI 3 CỘT RỘNG RÃI) */}
      {related.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-slate-200 dark:border-white/[0.08]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
              <span>Sản Phẩm Cùng Chuyên Mục</span>
            </h2>
            <Link href="/san-pham" className="text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline font-mono">
              Xem tất cả sản phẩm →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
