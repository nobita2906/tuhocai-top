'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';
import { ArrowRight, BookOpen, Sparkles, CheckCircle2, PlayCircle, Clock } from 'lucide-react';

interface TutorialsPlaybookSectionProps {
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

export default function TutorialsPlaybookSection({ posts }: TutorialsPlaybookSectionProps) {
  // Lọc các bài hướng dẫn thực chiến
  const tutorialPosts = posts.filter(
    (p) => p.category === 'TUTORIAL' || p.category === 'WORKFLOW' || p.slug?.includes('huong-dan') || p.slug?.includes('quy-trinh')
  );
  const displayPosts = tutorialPosts.length >= 2 ? tutorialPosts.slice(0, 3) : posts.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-800 dark:text-purple-300 text-xs font-mono font-bold mb-2 shadow-xs">
            <BookOpen className="w-3.5 h-3.5" />
            <span>PLAYBOOKS & CASE STUDY THỰC HÀNH</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Hướng Dẫn Thực Chiến Cầm Tay Chỉ Việc
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Quy trình từng bước (Step-by-step) làm video AI, tự động hóa n8n và khai thác các mô hình AI mới.
          </p>
        </div>
        <Link
          href="/bai-viet"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-700 dark:text-cyan-400 hover:underline font-mono shrink-0 cursor-pointer"
        >
          <span>Xem tất cả bài hướng dẫn</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid 3 Cột Card Playbook Nổi Bật */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {displayPosts.map((post) => (
          <article
            key={post.id}
            className="bento-card p-4 sm:p-5 flex flex-col justify-between group transition-all duration-300 border-2 border-slate-300 dark:border-white/10 hover:border-purple-400/50 dark:hover:border-purple-500/40 hover:shadow-xl shadow-md rounded-2xl bg-white dark:bg-[#0e0e13]"
          >
            <div className="space-y-3.5">
              {/* Visual Thumbnail với Badge Hướng Dẫn */}
              <Link
                href={`/bai-viet/${post.slug}`}
                className="block relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-[#15151c] border border-slate-300/80 dark:border-white/10 group-hover:opacity-95 transition-all shadow-inner"
              >
                <Image
                  src={getCover(post)}
                  alt={post.title}
                  fill
                  unoptimized
                  className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-[#09090b]/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 text-white backdrop-blur-md text-[10px] font-mono font-bold border border-white/20">
                  <PlayCircle className="w-3 h-3 text-purple-400" />
                  <span>HƯỚNG DẪN THỰC CHIẾN</span>
                </div>
              </Link>

              {/* Tags / Subtitle */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30">
                  {post.category || 'TUTORIAL'}
                </span>
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  5-10 phút thực hành
                </span>
              </div>

              {/* Title */}
              <Link href={`/bai-viet/${post.slug}`}>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {post.title}
                </h3>
              </Link>

              {/* Summary */}
              {post.summary && (
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {post.summary}
                </p>
              )}
            </div>

            {/* Bottom Action */}
            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Kèm File Mẫu & Prompt
              </span>
              <Link
                href={`/bai-viet/${post.slug}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 dark:text-cyan-400 hover:underline font-mono"
              >
                <span>Xem chi tiết</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

