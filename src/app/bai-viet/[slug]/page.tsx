import { query, execute } from '@/lib/db';
import { Post } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import {
  Clock,
  Eye,
  ArrowLeft,
  Sparkles,
  Download,
  MessageCircle,
  Share2,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ListOrdered,
  Zap,
  Lock,
  Unlock,
  ShieldCheck,
  LogIn,
  CreditCard,
  GraduationCap,
  Video,
  FileCheck,
} from 'lucide-react';
import { prepareArticleContent, generateArticleSchema } from '@/lib/seo-article';
import ArticleBody from '@/components/ArticleBody';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await query<Post>('SELECT * FROM posts WHERE slug = ? LIMIT 1', [slug]);
  if (posts.length === 0) return { title: 'Bài viết không tồn tại - Tự Học AI' };

  const p = posts[0];
  const siteUrl = 'https://www.tuhocai.top';
  const postUrl = `${siteUrl}/bai-viet/${p.slug}`;
  const defaultThumbnail = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
  const ogImage = p.thumbnail && p.thumbnail.startsWith('http') ? p.thumbnail : defaultThumbnail;

  return {
    title: `${p.title} | Tự Học AI`,
    description: p.summary || p.title,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: p.title,
      description: p.summary || p.title,
      url: postUrl,
      siteName: 'Tự Học AI',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: p.title,
        },
      ],
      type: 'article',
      publishedTime: new Date(p.created_at).toISOString(),
      authors: ['Nguyễn Văn Đăng'],
      tags: p.tags ? p.tags.split(',').map((t) => t.trim()) : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: p.title,
      description: p.summary || p.title,
      images: [ogImage],
    },
  };
}

export default async function SingleArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await query<Post>('SELECT * FROM posts WHERE slug = ? LIMIT 1', [slug]);

  if (posts.length === 0) {
    notFound();
  }

  const post = posts[0];

  // Increment views in background
  execute('UPDATE posts SET views = views + 1 WHERE id = ?', [post.id]).catch(() => {});

  // Fetch current user session
  const user = await getCurrentUser();

  // Kiểm tra bài viết có thuộc diện giới hạn bản quyền khóa học hay không
  const isCourseGated = post.visibility === 'COURSE_BUYERS' || Boolean(post.required_pid);

  let hasAccess = !isCourseGated;
  let isAdmin = false;
  let courseInfo: any = null;

  if (isCourseGated) {
    const targetPid = post.required_pid || 'WF-VIP-297';

    // Lấy thông tin khóa học / sản phẩm liên kết
    const matched = await query<any>(
      `SELECT p.id, p.pid, p.name, p.slug, p.price, p.original_price, p.thumbnail, c.headline, c.slug as course_slug
       FROM products p
       LEFT JOIN courses c ON (c.pid = p.pid OR c.slug = p.slug)
       WHERE p.pid = ? OR p.id = ? OR p.slug = ?
       LIMIT 1`,
      [targetPid, targetPid, targetPid]
    );

    if (matched.length > 0) {
      courseInfo = matched[0];
    } else {
      // Fallback nếu không khớp trực tiếp trong products
      const matchedCourse = await query<any>(
        `SELECT c.id, c.pid, c.title as name, c.slug, c.price, c.thumbnail, c.headline, c.slug as course_slug
         FROM courses c
         WHERE c.pid = ? OR c.id = ? OR c.slug = ?
         LIMIT 1`,
        [targetPid, targetPid, targetPid]
      );
      if (matchedCourse.length > 0) {
        courseInfo = matchedCourse[0];
      }
    }

    // Kiểm tra quyền sở hữu của user
    if (user) {
      if (user.role === 'ADMIN') {
        hasAccess = true;
        isAdmin = true;
      } else {
        const owned = await query<any>(
          `SELECT ul.id FROM user_library ul
           JOIN products p ON ul.product_id = p.id
           LEFT JOIN courses c ON (c.pid = p.pid OR c.slug = p.slug)
           WHERE ul.user_id = ? 
             AND (p.pid = ? OR p.id = ? OR p.slug = ? OR c.pid = ? OR c.slug = ?)
           LIMIT 1`,
          [user.id, targetPid, targetPid, targetPid, targetPid, targetPid]
        );
        if (owned.length > 0) {
          hasAccess = true;
        }
      }
    }
  }

  // Fetch related posts in the same category
  const relatedPosts = await query<Post>(
    "SELECT * FROM posts WHERE category = ? AND id != ? AND is_published = 1 AND (visibility IS NULL OR visibility = 'PUBLIC') ORDER BY created_at DESC LIMIT 3",
    [post.category, post.id]
  ).catch(() => []);

  // Process markdown, headings & reading time
  // Chỉ parse HTML đầy đủ khi người dùng có quyền truy cập để bảo vệ bản quyền
  const { html, toc, readingMinutes, wordCount } = hasAccess
    ? prepareArticleContent(post.content)
    : {
        html: '',
        toc: [],
        readingMinutes: Math.max(3, Math.ceil((post.content || '').split(/\s+/).length / 200)),
        wordCount: (post.content || '').split(/\s+/).length,
      };

  const schemaJson = generateArticleSchema(post);

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Breadcrumbs & Navigation */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <Link
            href={isCourseGated ? '/khoa-hoc' : '/bai-viet'}
            className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors group font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>{isCourseGated ? 'Danh sách khóa học' : 'Tất cả bài viết'}</span>
          </Link>
          <div className="flex items-center gap-2">
            {isCourseGated && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs tracking-wider uppercase flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Khóa Học VIP
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs tracking-wider uppercase">
              {post.category}
            </span>
          </div>
        </div>

        {/* VIP Member Welcoming Banner */}
        {isCourseGated && hasAccess && (
          <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-500/40 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-amber-500/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isAdmin ? 'Quản trị viên (Admin)' : 'Học viên VIP chính thức'}
                </div>
                <div className="text-sm font-semibold text-white">
                  {isAdmin
                    ? 'Bạn đang xem bài viết độc quyền với tư cách Admin hệ thống.'
                    : `Chào mừng ${user?.name || 'bạn'}! Bạn đã mở khóa trọn bộ tài liệu & bài học này.`}
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors shrink-0 hover:border-amber-500/40"
            >
              <span>Bảng điều khiển học tập</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </Link>
          </div>
        )}

        {/* Article Header - Tinh Tế Chuẩn Tạp Chí Cao Cấp */}
        <header className="space-y-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Dòng Metadata Tinh Giản 1 Hàng Gọn Gàng */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-400 py-3 border-y border-slate-200 dark:border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                Đ
              </div>
              <span className="text-slate-900 dark:text-white font-bold">Nguyễn Văn Đăng</span>
            </div>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
              {new Date(post.created_at).toLocaleDateString('vi-VN')}
            </span>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              {readingMinutes} phút đọc
            </span>
          </div>

          {/* Đoạn Sapo / Tóm Tắt Mở Đầu Trang Nhã (Bỏ Khung Hộp) */}
          {post.summary && (
            <div className="border-l-2 border-indigo-600 dark:border-indigo-400 pl-4 sm:pl-5 py-1 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {post.summary}
            </div>
          )}

          {/* Hero Thumbnail Banner Chiều Cao Vừa Phải */}
          {post.thumbnail && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg max-h-[420px] aspect-[16/9] relative bg-slate-100 dark:bg-slate-950">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Table of Contents (Mục lục bài viết Tối Giản) */}
          {toc.length >= 2 && (
            <nav aria-label="Mục lục bài viết" className="rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] p-5 sm:p-6 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-cyan-400 font-bold text-sm">
                <ListOrdered className="w-4 h-4" />
                <span>Mục lục bài viết</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm">
                {toc.map((item, index) => (
                  <li
                    key={index}
                    className={`${item.level === 3 ? 'pl-4 text-slate-600 dark:text-slate-400' : 'font-semibold text-slate-800 dark:text-slate-200'}`}
                  >
                    <a
                      href={`#${item.id}`}
                      className="hover:text-indigo-600 dark:hover:text-cyan-300 hover:underline transition-colors flex items-baseline gap-2"
                    >
                      <span className="text-indigo-600 dark:text-cyan-400 font-mono text-xs">{index + 1}.</span>
                      <span>{item.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </header>

        {/* Main Article Body HOẶC Khung Paywall VIP Khóa Học */}
        {hasAccess ? (
          <ArticleBody html={html} />
        ) : (
          <section className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/50 p-6 sm:p-10 space-y-8 shadow-2xl shadow-amber-500/10 relative overflow-hidden text-center sm:text-left">
            {/* Glow blur background */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header Lock */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30 shrink-0">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Nội dung độc quyền • Dành riêng cho học viên
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                  Mở Khóa Toàn Bộ Quy Trình & Tài Liệu Thực Chiến
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Bài viết chi tiết này thuộc chương trình <strong className="text-amber-300 font-semibold">{courseInfo?.name || 'Khóa Học Làm Video AI Bán Hàng Triệu View Từ 1 Ảnh'}</strong>. Để bảo vệ quyền lợi học viên, toàn bộ video thao tác, prompt mẫu copy 1-click và checklist phân cảnh chỉ hiển thị sau khi kích hoạt khóa học.
                </p>
              </div>
            </div>

            {/* 4 Core Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 space-y-2">
                <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
                  <Video className="w-4 h-4 text-amber-400" />
                  <span>Video Hướng Dẫn Thực Hành Từng Bước</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Quay màn hình trực tiếp từ tạo prompt đến dựng video, không cắt giấu mẹo vặt thực tế.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 space-y-2">
                <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Trọn Bộ Prompt Độc Quyền Bản Quyền</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Prompt FLUX, Midjourney & Kling AI giữ nét khuôn mặt nhất quán đã kiểm chứng trên 1.000.000 lượt xem.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 space-y-2">
                <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-sm">
                  <FileCheck className="w-4 h-4 text-indigo-400" />
                  <span>Checklist Phân Cảnh & Template Dự Án</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Checklist 5 bước chuẩn hóa, template CapCut tải về dùng ngay giúp tiết kiệm 90% thời gian dựng.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 space-y-2">
                <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Hỗ Trợ 1-1 & Cập Nhật Trọn Đời</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tham gia nhóm kín Zalo VIP trao đổi trực tiếp với tác giả Đăng AI, cập nhật phiên bản AI mới nhất.
                </p>
              </div>
            </div>

            {/* Pricing & CTA Card */}
            <div className="rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-800/80 to-indigo-500/15 border border-amber-500/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center md:text-left">
                <div className="text-xs uppercase font-bold tracking-wider text-amber-400">
                  Ưu đãi mở khóa độc quyền hôm nay
                </div>
                <div className="flex items-baseline justify-center md:justify-start gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-amber-300">
                    {new Intl.NumberFormat('vi-VN').format(courseInfo?.price || 297000)}đ
                  </span>
                  <span className="text-sm sm:text-base text-slate-400 line-through">
                    {new Intl.NumberFormat('vi-VN').format(courseInfo?.original_price || 1200000)}đ
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    -75%
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  ⚡ Quét mã VietQR nhận tài khoản & mở khóa tự động trong 30 giây
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <Link
                  href={`/thanh-toan?pid=${courseInfo?.pid || 'WF-VIP-297'}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-105"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Mở Khóa Khóa Học Ngay (VietQR)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={`/dang-nhap?redirect=/bai-viet/${post.slug}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <LogIn className="w-4 h-4 text-indigo-400" />
                  <span>Đã mua? Đăng nhập ngay</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Tags */}
        {post.tags && (
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Chủ đề liên quan:</span>
            {post.tags.split(',').map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:border-indigo-500/50 transition-colors"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Quà Tặng Tài Liệu & Nhóm Zalo Hỗ Trợ (Thiết Kế Tinh Giản, Thoáng Mắt) */}
        {hasAccess && (
          <div className="pt-4">
            <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-mono">
                    ✦ Tài nguyên thực hành 0đ
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Nhận Prompt Mẫu & File Template Của Bài Viết
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Toàn bộ prompt thực tế, file JSON flow và tài liệu hướng dẫn được chia sẻ miễn phí trong cộng đồng Tự Học AI.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href="https://zalo.me/g/tuhocai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Vào Nhóm Zalo Nhận File Ngay</span>
                </a>

                <Link
                  href="/san-pham"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-white/10 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Kho Tài Nguyên & Công Cụ AI</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Bài Viết Liên Quan Cùng Chuyên Mục (3 Cột Thoáng Đãng) */}
        {relatedPosts.length > 0 && (
          <section className="pt-10 border-t border-slate-200 dark:border-white/[0.08] space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                <span>Bài viết liên quan</span>
              </h2>
              <Link
                href="/bai-viet"
                className="text-xs text-indigo-600 dark:text-cyan-400 hover:underline font-mono font-bold"
              >
                Xem tất cả bài viết →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/bai-viet/${rel.slug}`}
                  className="rounded-2xl bg-white dark:bg-[#0e0e13] border border-slate-300 dark:border-white/10 p-4 space-y-2.5 hover:border-indigo-400/50 dark:hover:border-indigo-500/40 transition-all flex flex-col justify-between group shadow-xs hover:shadow-md"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-cyan-400 tracking-wider font-mono">
                      {rel.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-cyan-300 line-clamp-2 leading-snug transition-colors">
                      {rel.title}
                    </h3>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/[0.06] font-mono">
                    <span>{new Date(rel.created_at).toLocaleDateString('vi-VN')}</span>
                    <span className="text-indigo-600 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
