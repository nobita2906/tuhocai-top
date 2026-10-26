import { query, execute } from '@/lib/db';
import { Post } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
} from 'lucide-react';
import { prepareArticleContent, generateArticleSchema } from '@/lib/seo-article';

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

  // Fetch related posts in the same category
  const relatedPosts = await query<Post>(
    'SELECT * FROM posts WHERE category = ? AND id != ? AND is_published = 1 ORDER BY created_at DESC LIMIT 3',
    [post.category, post.id]
  ).catch(() => []);

  // Process markdown, headings & reading time
  const { html, toc, readingMinutes, wordCount } = prepareArticleContent(post.content);
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
            href="/bai-viet"
            className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors group font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Tất cả bài viết</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs tracking-wider uppercase">
              {post.category}
            </span>
          </div>
        </div>

        {/* Article Header */}
        <header className="space-y-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Metadata bar */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-5 text-xs text-slate-600 dark:text-slate-300 border-y border-slate-200 dark:border-slate-800/80 py-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow">
                Đ
              </div>
              <div>
                <span className="text-slate-900 dark:text-white font-bold">Nguyễn Văn Đăng</span>
                <span className="text-indigo-600 dark:text-indigo-400 ml-1.5 text-[11px] font-semibold">Verified AI Author</span>
              </div>
            </div>

            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>

            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
              <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              {new Date(post.created_at).toLocaleDateString('vi-VN')}
            </span>

            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>

            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              {readingMinutes} phút đọc (~{wordCount} từ)
            </span>

            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>

            <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
              <Eye className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              {(post.views || 0) + 1} lượt xem
            </span>
          </div>

          {/* Lead Excerpt */}
          {post.summary && (
            <div className="p-5 sm:p-6 rounded-2xl bg-indigo-50/70 dark:bg-slate-900/90 border-l-4 border-indigo-600 dark:border-indigo-500 text-slate-800 dark:text-slate-100 text-base sm:text-lg leading-relaxed font-normal shadow-sm border border-slate-200/60 dark:border-slate-800">
              {post.summary}
            </div>
          )}

          {/* Table of Contents (Mục lục bài viết) */}
          {toc.length >= 2 && (
            <nav aria-label="Mục lục bài viết" className="rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm sm:text-base">
                <ListOrdered className="w-4 h-4" />
                <span>Mục lục nội dung bài viết</span>
              </div>
              <ul className="space-y-2.5 text-sm">
                {toc.map((item, index) => (
                  <li
                    key={index}
                    className={`${item.level === 3 ? 'pl-5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm' : 'font-semibold text-slate-900 dark:text-slate-100'}`}
                  >
                    <a
                      href={`#${item.id}`}
                      className="hover:text-indigo-600 dark:hover:text-indigo-300 hover:underline transition-colors flex items-baseline gap-2"
                    >
                      <span className="text-indigo-600 dark:text-indigo-400 font-mono text-xs">{index + 1}.</span>
                      <span>{item.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </header>

        {/* Main Article Body - High Contrast, Crystal Clear */}
        <div
          className="markdown-body max-w-none text-base sm:text-lg leading-relaxed space-y-6 pt-2"
          dangerouslySetInnerHTML={{ __html: html }}
        />

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

        {/* 3-Tier Conversion Funnel Box */}
        <div className="space-y-6 pt-4">
          {/* Box 1: Lead Magnet Free 0đ */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/70 border border-indigo-500/40 p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  Quà tặng miễn phí
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                  Nhận trọn bộ Prompt & Template JSON bài viết này (0đ)
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Đừng bắt đầu lại từ con số 0. Toàn bộ file mẫu, prompt copy-paste và workflow mẫu được cập nhật liên tục tại nhóm Zalo VIP Tự Học AI.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="https://zalo.me/g/tuhocai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                Vào Nhóm Zalo Nhận File Mẫu Ngay
              </a>

              <Link
                href="/san-pham"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Xem Kho Quy Trình & Khóa Học
              </Link>
            </div>
          </div>

          {/* Box 2 & 3: Upsell & Affiliate Dual Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 2: Core Product Upsell */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-3 hover:border-indigo-500/40 transition-all group">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Zap className="w-4 h-4" />
                <span>Quy trình n8n Tự Động Hóa 2026</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tự động hóa hoàn toàn khâu tìm kiếm khách hàng, gửi email chốt đơn và chăm sóc 24/7 không cần nhân sự.
              </p>
              <Link
                href="/lp/n8n-tu-dong-hoa-kiem-tien"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-400 group-hover:text-indigo-300 font-semibold pt-1"
              >
                <span>Xem chi tiết giải pháp</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Box 3: Affiliate Invitation */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-3 hover:border-emerald-500/40 transition-all group">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Kiếm tiền cùng Affiliate Tự Học AI</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Chia sẻ bài viết & sản phẩm của chúng tôi để nhận hoa hồng trọn đời 30% - 50%. Rút tiền tự động trong 24h.
              </p>
              <Link
                href="/affiliate"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 group-hover:text-emerald-300 font-semibold pt-1"
              >
                <span>Đăng ký đối tác Affiliate</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="pt-10 border-t border-slate-800/80 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Bài viết liên quan cùng chuyên mục
              </h2>
              <Link
                href="/bai-viet"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Xem tất cả →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/bai-viet/${rel.slug}`}
                  className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-2.5 hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-semibold text-indigo-400 tracking-wider">
                      {rel.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-white line-clamp-2 leading-snug">
                      {rel.title}
                    </h3>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-800/60">
                    <span>{new Date(rel.created_at).toLocaleDateString('vi-VN')}</span>
                    <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">→</span>
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
