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

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getProductChecklist(p: Product) {
  const text = `${p.pid} ${p.slug} ${p.name}`.toLowerCase();
  if (text.includes('combo-video') || text.includes('video-ai') || p.pid === 'COMBO-VIDEO-299') {
    return [
      'Trọn bộ khóa học & video hướng dẫn tạo Video AI từ 1 ảnh tĩnh',
      'Quy trình viết kịch bản Mini Drama gia đình thu hút người xem',
      'Kho 100+ prompt FLUX thương mại (được phép dùng tạo ảnh cho cá nhân & kinh doanh)',
      'Chính sách hoàn tiền 100% trong 7 ngày nếu không áp dụng được',
    ];
  }
  if (text.includes('pack-office') || text.includes('van-phong') || p.pid === 'PACK-OFFICE-069') {
    return [
      '50+ prompt thực chiến cho công việc văn phòng: soạn email, biên bản họp & báo cáo',
      'Cẩm nang kết hợp ChatGPT, Claude & Gemini giải phóng thời gian làm việc mỗi ngày',
      'Cập nhật prompt và kỹ năng mới định kỳ trọn đời không thu phụ phí',
      'Chính sách hoàn tiền 100% trong 7 ngày nếu không hài lòng',
    ];
  }
  if (text.includes('n8n') || text.includes('auto') || text.includes('workflow')) {
    return [
      'File JSON workflow n8n hoàn chỉnh, import 1 click là chạy',
      'Tài liệu & Video hướng dẫn cấu hình kết nối API từng bước',
      'Cập nhật miễn phí các bản nâng cấp và sửa lỗi trọn đời',
      'Hỗ trợ kỹ thuật 1-1 qua nhóm Zalo VIP & Hoàn tiền trong 7 ngày',
    ];
  }
  return [
    'Tài liệu và file mẫu hướng dẫn chi tiết từng bước cho người mới',
    'Cập nhật tài nguyên mới định kỳ trọn đời không phát sinh chi phí',
    'Chính sách hoàn tiền 100% trong 7 ngày nếu không đúng mô tả',
    'Hỗ trợ kỹ thuật 1-1 qua nhóm Zalo VIP cùng Nguyễn Đăng AI',
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await query<Product>('SELECT * FROM products WHERE slug = ? OR pid = ? LIMIT 1', [slug, slug]);
  if (products.length === 0) return { title: 'Sản phẩm không tồn tại' };

  const p = products[0];
  const canonicalUrl = `https://tuhocai.top/san-pham/${p.slug}`;

  return {
    title: `${p.name} - Tự Học AI (tuhocai.top)`,
    description: p.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${p.name} - Tự Học AI`,
      description: p.description,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${p.name} - Tự Học AI`,
      description: p.description,
    },
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

  // Chuẩn hóa địa chỉ URL: Nếu truy cập bằng PID hoặc slug cũ, redirect 301 sang slug chính thức (Giải quyết C14)
  if (product.slug && slug !== product.slug) {
    redirect(`/san-pham/${product.slug}`);
  }

  const isFree = product.price === 0;
  const coverImage = getProductCover(product);
  const checklist = getProductChecklist(product);

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

          {/* Ảnh Bìa Sản Phẩm Sắc Nét */}
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

          {/* Quyền Lợi Gói Sản Phẩm: Checklist Động Đúng Từng Gói (Giải quyết C13) */}
          <div className="rounded-2xl p-5 sm:p-6 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 font-mono">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
              <span>Gói sản phẩm bao gồm trọn bộ:</span>
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: KHUNG ĐẶT MUA / TẢI VỀ (STICKY BOX) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
          <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#111116] border-2 border-slate-200 dark:border-white/10 shadow-xl space-y-6">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Mức giá sở hữu:</span>
              <div className="flex items-baseline gap-3 mt-1">
                {isFree ? (
                  <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    MIỄN PHÍ 0đ
                  </span>
                ) : (
                  <>
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
                      {new Intl.NumberFormat('vi-VN').format(product.price)}đ
                    </span>
                    {product.original_price > product.price && (
                      <span className="text-sm text-slate-400 font-mono">
                        (Mua lẻ: {new Intl.NumberFormat('vi-VN').format(product.original_price)}đ)
                      </span>
                    )}
                  </>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isFree ? 'Tải về sử dụng ngay không cần đăng ký thẻ' : 'Thanh toán 1 lần • Sở hữu vĩnh viễn • Nhận link ngay'}
              </p>
            </div>

            {/* Nút Hành Động Chính */}
            <div>
              {isFree ? (
                <a
                  href={product.download_url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base shadow-lg shadow-emerald-950/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
                >
                  <Download className="w-5 h-5" />
                  <span>Tải Về Ngay (0đ)</span>
                </a>
              ) : (
                <Link
                  href={`/thanh-toan?product=${product.pid}`}
                  className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 hover:opacity-95 text-white font-black text-base shadow-xl shadow-indigo-950/25 transition-all hover:scale-[1.01] active:scale-[0.98]"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Mua Ngay — Kích Hoạt Tự Động</span>
                </Link>
              )}
            </div>

            {/* Bảo Chứng An Tâm */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Giao tự động trong 30 giây qua mã VietQR</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Hoàn tiền 100% trong 7 ngày nếu không hài lòng</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>Hỗ trợ kỹ thuật 1-1 qua nhóm Zalo VIP</span>
              </div>
            </div>

            {/* Hỗ Trợ Zalo Thống Nhất (Giải quyết C12) */}
            <div className="pt-2 text-center border-t border-slate-100 dark:border-white/5">
              <a
                href="https://zalo.me/g/qnitrawpaxpvl6aj7ixb"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Cần tư vấn chọn giải pháp? Nhắn Zalo Hỗ Trợ</span>
              </a>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-center">
            <p>
              Tất cả sản phẩm đều được kiểm thử và bảo hành bởi <strong>Nguyễn Đăng AI</strong>. Xem thêm{' '}
              <Link href="/hoan-tien" className="text-indigo-600 dark:text-cyan-400 font-semibold hover:underline inline-flex items-center gap-0.5">
                Chính sách hoàn tiền 7 ngày
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
