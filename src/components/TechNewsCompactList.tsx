'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';
import { ArrowRight, Clock, Calendar, Newspaper, ExternalLink } from 'lucide-react';

interface TechNewsCompactListProps {
  posts: Post[];
}

function getCover(post: Post): string {
  if (post.thumbnail) return post.thumbnail;
  const slug = post.slug?.toLowerCase() || '';
  if (slug.includes('claude')) return '/images/products/skill-claude.svg';
  if (slug.includes('n8n') || slug.includes('dang-bai')) return '/images/products/n8n-workflow-demo.jpg';
  if (slug.includes('cursor') || slug.includes('code')) return '/images/products/skill-codex.svg';
  if (slug.includes('ky-nang') || slug.includes('skills')) return '/images/products/skill-chatgpt.svg';
  return '/images/products/flux-prompt-bundle.jpg';
}

export default function TechNewsCompactList({ posts }: TechNewsCompactListProps) {
  // Lấy các bài tin tức (hoặc các bài mới nhất không phải tutorial)
  const newsPosts = posts.filter((p) => p.category === 'NEWS' || p.category === 'SKILL' || p.category === 'PROMPT');
  const displayPosts = newsPosts.length >= 3 ? newsPosts.slice(0, 4) : posts.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-slate-200 dark:border-white/[0.08] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-800 dark:text-cyan-300 text-xs font-mono font-bold mb-2 shadow-xs">
            <Newspaper className="w-3.5 h-3.5" />
            <span>BẢN TIN AI CẬP NHẬT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tin Tức & Xu Hướng AI Mới Nhất
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Tổng hợp tin vắn công nghệ, mô hình AI thế hệ mới và góc nhìn thực chiến.
          </p>
        </div>
        <Link
          href="/bai-viet"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-700 dark:text-cyan-400 hover:underline font-mono shrink-0 cursor-pointer"
        >
          <span>Xem tất cả tin tức</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Compact List Grid: 2 cột trên desktop, 1 cột danh sách thẻ nhỏ trên mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {displayPosts.map((post) => (
          <article
            key={post.id}
            className="group p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-200 dark:border-white/[0.08] hover:border-indigo-400/60 dark:hover:border-indigo-500/50 shadow-xs hover:shadow-md transition-all flex items-center gap-3.5"
          >
            {/* Thumbnail vuông mini bo góc */}
            <Link
              href={`/bai-viet/${post.slug}`}
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0 border border-slate-200 dark:border-white/10 group-hover:scale-[1.02] transition-transform duration-300"
            >
              <Image
                src={getCover(post)}
                alt={post.title}
                fill
                unoptimized
                className="object-cover object-center"
              />
            </Link>

            {/* Nội dung tin vắn */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] text-indigo-700 dark:text-cyan-300 border border-slate-200 dark:border-white/10">
                  {post.category || 'NEWS'}
                </span>
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                </span>
              </div>

              <Link href={`/bai-viet/${post.slug}`}>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                  {post.title}
                </h3>
              </Link>

              {post.summary && (
                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-normal">
                  {post.summary}
                </p>
              )}

              <div className="pt-0.5">
                <Link
                  href={`/bai-viet/${post.slug}`}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 dark:text-cyan-400 hover:underline font-mono"
                >
                  <span>Đọc tiếp</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

