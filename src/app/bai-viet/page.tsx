import { query } from '@/lib/db';
import { Post } from '@/types';
import Link from 'next/link';
import { Newspaper, ArrowRight, Sparkles, Clock, Eye } from 'lucide-react';

export const metadata = {
  title: 'Tin Tức & Hướng Dẫn AI Thực Chiến - Tự Học AI (tuhocai.top)',
  description: 'Cập nhật tin tức mô hình AI mới nhất, hướng dẫn kỹ thuật prompt và xây dựng quy trình tự động hóa n8n.',
};

export const revalidate = 60;

export default async function BaiVietPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;

  let sql = 'SELECT id, slug, title, summary, category, tags, thumbnail, is_featured, views, created_at FROM posts WHERE is_published = TRUE';
  const params: any[] = [];

  if (cat && cat !== 'ALL') {
    sql += ' AND category = ?';
    params.push(cat.toUpperCase());
  }

  sql += ' ORDER BY created_at DESC';

  const posts = await query<Post>(sql, params);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
          <Newspaper className="w-3.5 h-3.5" />
          Kho Tri Thức AI
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Tin Tức & Hướng Dẫn AI Thực Chiến
        </h1>
        <p className="text-sm text-slate-400">
          Tổng hợp thông tin công nghệ AI, hướng dẫn prompt engineering và giải pháp tự động hóa hữu ích.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { key: 'ALL', label: 'Tất cả bài viết' },
          { key: 'NEWS', label: 'Tin tức AI' },
          { key: 'WORKFLOW', label: 'Workflow n8n' },
          { key: 'PROMPT', label: 'Prompt VIP' },
          { key: 'SKILL', label: 'Kỹ Năng AI' },
        ].map((c) => (
          <Link
            key={c.key}
            href={c.key === 'ALL' ? '/bai-viet' : `/bai-viet?cat=${c.key}`}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              (cat || 'ALL').toUpperCase() === c.key
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group flex flex-col rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-6 transition-all hover:shadow-xl"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-400 font-semibold border border-slate-700">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3 text-slate-500" />
                {new Date(post.created_at).toLocaleDateString('vi-VN')}
              </span>
            </div>

            <Link href={`/bai-viet/${post.slug}`} className="group-hover:text-indigo-400 transition-colors">
              <h2 className="font-bold text-white text-base sm:text-lg line-clamp-2 leading-snug">
                {post.title}
              </h2>
            </Link>

            <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed flex-1">
              {post.summary}
            </p>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <Link
                href={`/bai-viet/${post.slug}`}
                className="font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                Đọc toàn bộ bài viết <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-slate-500 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {post.views || 0}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
