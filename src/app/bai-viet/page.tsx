import { query } from '@/lib/db';
import { Post } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Newspaper, ArrowRight, Clock, Eye, Sparkles } from 'lucide-react';

import Pagination from '@/components/ui/Pagination';

export const metadata = {
  title: 'Tin Tức & Hướng Dẫn AI Thực Chiến - Tự Học AI (tuhocai.top)',
  description: 'Cập nhật tin tức mô hình AI mới nhất, hướng dẫn kỹ thuật prompt và xây dựng quy trình tự động hóa n8n.',
};

export const revalidate = 60;

function getPostCover(post: Post): string {
  if (post.thumbnail) return post.thumbnail;
  const slug = post.slug?.toLowerCase() || '';
  if (slug.includes('claude')) return '/images/products/skill-claude.svg';
  if (slug.includes('n8n') || slug.includes('dang-bai')) return '/images/products/n8n-workflow-demo.jpg';
  if (slug.includes('cursor') || slug.includes('code')) return '/images/products/skill-codex.svg';
  if (slug.includes('ky-nang') || slug.includes('skills')) return '/images/products/skill-chatgpt.svg';
  return '/images/products/flux-prompt-bundle.jpg';
}

export default async function BaiVietPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; page?: string }>;
}) {
  const { cat, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1);
  const limit = 8;
  const offset = (page - 1) * limit;

  let countSql = 'SELECT COUNT(*) as total FROM posts WHERE is_published = TRUE';
  let sql = 'SELECT id, slug, title, summary, category, tags, thumbnail, is_featured, views, created_at FROM posts WHERE is_published = TRUE';
  const countParams: any[] = [];
  const params: any[] = [];

  if (cat && cat !== 'ALL') {
    countSql += ' AND category = ?';
    countParams.push(cat.toUpperCase());
    sql += ' AND category = ?';
    params.push(cat.toUpperCase());
  }

  sql += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

  const [countResult, posts] = await Promise.all([
    query<{ total: number }>(countSql, countParams),
    query<Post>(sql, params),
  ]);

  const total = Number(countResult[0]?.total || 0);
  const totalPages = Math.ceil(total / limit) || 1;
  const baseUrl = cat && cat !== 'ALL' ? `/bai-viet?cat=${cat}` : '/bai-viet';

  const categories = [
    { key: 'ALL', label: 'Tất cả bài viết' },
    { key: 'NEWS', label: 'Tin tức AI' },
    { key: 'WORKFLOW', label: 'Workflow n8n' },
    { key: 'PROMPT', label: 'Prompt VIP' },
    { key: 'SKILL', label: 'Kỹ Năng AI' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Kho Tri Thức AI Thực Chiến
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Tin Tức & Hướng Dẫn Tự Học AI
        </h1>
        <p className="text-sm text-slate-400">
          Tổng hợp thông tin công nghệ AI, hướng dẫn prompt engineering và giải pháp tự động hóa hữu ích từ tuhocai.top.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((c) => {
          const isActive = (cat || 'ALL').toUpperCase() === c.key;
          return (
            <Link
              key={c.key}
              href={c.key === 'ALL' ? '/bai-viet' : '/bai-viet?cat=' + c.key}
              className={
                'px-4 py-2 rounded-xl text-xs font-semibold transition-all ' +
                (isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/25 font-bold'
                  : 'bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08]')
              }
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      {/* Posts Grid: 1 hàng 4 bài viết theo yêu cầu */}
      {posts.length === 0 ? (
        <div className="text-center py-16 bg-[#111116] rounded-2xl border border-white/[0.06] space-y-3">
          <p className="text-slate-400 text-sm">Chưa có bài viết nào trong chuyên mục này.</p>
          <Link href="/bai-viet" className="text-xs font-semibold text-indigo-400 hover:underline">
            Xem lại tất cả bài viết
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {posts.map((post) => {
            const cover = getPostCover(post);
            return (
              <article
                key={post.id}
                className="bento-card group flex flex-col p-4 hover:border-indigo-500/45 transition-all duration-300"
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#111116] mb-3.5 border border-white/[0.06] group-hover:border-indigo-500/30 transition-colors">
                  <Image
                    src={cover}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/80 via-transparent to-black/20 pointer-events-none" />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-indigo-400 border border-indigo-500/30">
                      {post.category || 'AI GUIDE'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    {new Date(post.created_at).toLocaleDateString('vi-VN')}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {post.views || 0}
                  </span>
                </div>

                <Link href={'/bai-viet/' + post.slug} className="group/link">
                  <h2 className="font-bold text-white text-sm sm:text-base line-clamp-2 leading-snug group-hover/link:text-cyan-400 transition-colors">
                    {post.title}
                  </h2>
                </Link>

                <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed flex-1">
                  {post.summary}
                </p>

                <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  <Link
                    href={'/bai-viet/' + post.slug}
                    className="font-semibold text-indigo-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    Đọc tiếp <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pt-6 border-t border-white/[0.08]">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            pageSize={limit}
            itemName="bài viết"
            baseUrl={baseUrl}
          />
        </div>
      )}
    </div>
  );
}
