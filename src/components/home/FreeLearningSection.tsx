'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';
import { BookOpen, Sparkles, ArrowRight, Download, Calendar, Tag, PlayCircle } from 'lucide-react';

interface FreeLearningSectionProps {
  posts: Post[];
  onClaimTemplate?: (postTitle: string) => void;
}

function getBranchBadge(post: Post) {
  const text = `${post.title} ${post.summary || ''} ${post.slug || ''} ${post.tags || ''}`.toLowerCase();
  if (text.includes('video') || text.includes('drama') || text.includes('flux') || text.includes('creator')) {
    return {
      label: '🎬 Creator & Xây kênh',
      color: 'bg-amber-500/10 text-amber-500 dark:text-amber-300 border-amber-500/20',
    };
  }
  if (text.includes('n8n') || text.includes('văn phòng') || text.includes('sheets') || text.includes('email') || text.includes('kinh doanh')) {
    return {
      label: '💼 Tự động hóa & Văn phòng',
      color: 'bg-blue-500/10 text-blue-600 dark:text-cyan-400 border-blue-500/20',
    };
  }
  return {
    label: '🌱 Dành cho người mới',
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  };
}

function getPostThumbnail(post: Post): string {
  if (post.thumbnail && post.thumbnail.trim() !== '') return post.thumbnail;
  const slug = post.slug?.toLowerCase() || '';
  if (slug.includes('claude')) return '/images/products/skill-claude.svg';
  if (slug.includes('n8n') || slug.includes('dang-bai')) return '/images/products/n8n-workflow-demo.jpg';
  if (slug.includes('cursor') || slug.includes('code')) return '/images/products/skill-codex.svg';
  if (slug.includes('flux') || slug.includes('prompt')) return '/images/products/flux-prompt-bundle.jpg';
  return '/images/products/skill-chatgpt.svg';
}

function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Cập nhật gần đây';
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  } catch {
    return 'Cập nhật gần đây';
  }
}

export default function FreeLearningSection({ posts, onClaimTemplate }: FreeLearningSectionProps) {
  // Lấy 3 bài viết mới nhất
  const topPosts = posts.slice(0, 3);

  return (
    <section id="hoc-mien-phi" className="py-8 sm:py-14 border-t border-slate-200 dark:border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              HỌC MIỄN PHÍ TRƯỚC
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Mới Trên Kênh &amp; Blog Tự Học AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Nội dung thực chiến được chia sẻ bởi Nguyễn Đăng AI. Tất cả bài hướng dẫn đều đính kèm template hoặc file prompt để bạn tải về thực hành 0đ.
            </p>
          </div>

          <Link
            href="/bai-viet"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-700 dark:text-cyan-400 hover:underline shrink-0"
          >
            <span>Xem toàn bộ bài viết</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Bài Viết Thực Chiến */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {topPosts.map((post) => {
            const branch = getBranchBadge(post);
            const thumb = getPostThumbnail(post);
            const dateStr = formatDate(post.created_at || post.updated_at);

            return (
              <article
                key={post.id}
                className="bento-card group flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-200 dark:border-white/10 hover:border-indigo-500/50 hover:shadow-xl transition-all overflow-hidden"
              >
                <div>
                  {/* Thumbnail */}
                  <Link href={`/bai-viet/${post.slug}`} className="block relative aspect-video w-full overflow-hidden bg-slate-900">
                    <Image
                      src={thumb}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${branch.color}`}>
                        {branch.label}
                      </span>
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{dateStr}</span>
                      <span>•</span>
                      <span>{post.views || 0} lượt đọc</span>
                    </div>

                    <Link href={`/bai-viet/${post.slug}`} className="block group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {post.summary || 'Hướng dẫn chi tiết từng bước áp dụng AI vào công việc thực tế cùng Nguyễn Đăng AI.'}
                    </p>
                  </div>
                </div>

                {/* Footer Card: Quà 0đ kèm theo & Link đọc */}
                <div className="p-5 pt-0 space-y-3 mt-auto">
                  <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" />
                      Template kèm theo: 0đ
                    </span>
                    <span className="text-[10px] text-emerald-600/80 font-mono">Tải ngay</span>
                  </div>

                  <Link
                    href={`/bai-viet/${post.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-900 dark:text-white border border-slate-300 dark:border-white/10 transition-colors"
                  >
                    <span>Đọc Hướng Dẫn &amp; Lấy File</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Bạn thích học qua video ngắn và ví dụ trực quan?
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kênh YouTube @tuhocai_top liên tục đăng tải các quy trình thực chiến mới nhất mỗi tuần.
            </p>
          </div>
          <a
            href="https://youtube.com/@tuhocai_top"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Kênh YouTube @tuhocai_top</span>
          </a>
        </div>
      </div>
    </section>
  );
}

