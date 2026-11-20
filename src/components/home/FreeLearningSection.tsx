'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';
import { BookOpen, Sparkles, ArrowRight, Download, Calendar, PlayCircle, Video } from 'lucide-react';

interface FreeLearningSectionProps {
  posts: Post[];
}

interface YoutubeVideo {
  id: string;
  youtubeId: string;
  title: string;
  tag: string;
  tagColor: string;
  templateName: string;
  templateUrl?: string;
}

const YOUTUBE_VIDEOS: YoutubeVideo[] = [
  {
    id: 'yt-1',
    youtubeId: 'KOAKDMxpPxI',
    title: 'Quy trình tạo Video AI từ 1 ảnh tĩnh bán hàng thực chiến',
    tag: '🎬 Creator & Video AI',
    tagColor: 'bg-amber-500/10 text-amber-500 dark:text-amber-300 border-amber-500/20',
    templateName: 'Template kịch bản phân cảnh 3s đầu (0đ)',
  },
];

function getBranchBadge(post: Post) {
  const text = `${post.title} ${post.summary || ''} ${post.slug || ''} ${post.tags || ''}`.toLowerCase();
  if (text.includes('video') || text.includes('drama') || text.includes('flux') || text.includes('creator')) {
    return {
      label: '🎬 Cho Creator',
      color: 'bg-amber-500/10 text-amber-500 dark:text-amber-300 border-amber-500/20',
    };
  }
  if (text.includes('n8n') || text.includes('văn phòng') || text.includes('sheets') || text.includes('email')) {
    return {
      label: '💼 Cho Văn phòng',
      color: 'bg-blue-500/10 text-blue-600 dark:text-cyan-400 border-blue-500/20',
    };
  }
  return {
    label: '🌱 Cho Người mới',
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  };
}

function getPostThumbnail(post: Post): string {
  if (post.thumbnail && post.thumbnail.trim() !== '') return post.thumbnail;
  const slug = post.slug?.toLowerCase() || '';
  if (slug.includes('claude')) return '/images/products/skill-claude.svg';
  if (slug.includes('n8n') || slug.includes('dang-bai')) return '/images/products/n8n-workflow-demo.jpg';
  if (slug.includes('cursor') || slug.includes('code')) return '/images/products/skill-codex.svg';
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

export default function FreeLearningSection({ posts }: FreeLearningSectionProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'blog'>('video');
  const topPosts = posts.slice(0, 3);

  const scrollToLead = () => {
    document.getElementById('nhan-qua-0d')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hoc-mien-phi" className="py-8 sm:py-14 border-t border-slate-200 dark:border-white/5 scroll-mt-20">
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
              Nội dung thực chiến chia sẻ bởi Nguyễn Đăng AI. Tất cả video và bài viết đều có đính kèm template hoặc file mẫu 0đ để bạn tải về áp dụng ngay.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('video')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'video'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Video YouTube ({YOUTUBE_VIDEOS.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('blog')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'blog'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Bài Viết Blog (3)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Video YouTube nhúng thực tế (Chỉ hiển thị video đã quay thật, không để video trùng lặp) */}
        {activeTab === 'video' && (
          <div className="space-y-4">
            {YOUTUBE_VIDEOS.map((v) => (
              <div
                key={v.id}
                className="bento-card group rounded-3xl bg-white dark:bg-[#111116] border-2 border-slate-200 dark:border-white/10 hover:border-red-500/40 hover:shadow-2xl transition-all overflow-hidden p-4 sm:p-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Cột trái: Embedded 16:9 YouTube Player */}
                  <div className="lg:col-span-7">
                    <div className="relative aspect-video w-full rounded-2xl bg-slate-950 overflow-hidden shadow-lg border border-slate-300 dark:border-white/10">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                        title={v.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>

                  {/* Cột phải: Thông tin nội dung & Quà tặng đính kèm */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${v.tagColor}`}>
                          {v.tag}
                        </span>
                        <span className="text-xs text-red-600 dark:text-red-400 font-mono font-bold flex items-center gap-1">
                          <PlayCircle className="w-3.5 h-3.5" />
                          Video Hướng Dẫn Thật
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                        {v.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Toàn bộ quy trình từng bước từ tạo hình ảnh nhất quán bằng FLUX, lên kịch bản chuyển động và đồng bộ giọng đọc bán hàng thực tế mà Nguyễn Đăng AI đang áp dụng.
                      </p>
                    </div>

                    {/* Hộp nhận template đính kèm 0đ */}
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/25 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-400 uppercase">
                          🎁 Tài liệu đính kèm video:
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white font-mono">
                          0đ
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {v.templateName}
                      </p>
                      <button
                        type="button"
                        onClick={scrollToLead}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Nhập Email Nhận Template 0đ Này</span>
                      </button>
                    </div>

                    {/* Dòng chú thích trung thực về video tiếp theo */}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                      * Các video tiếp theo về Workflow n8n tự động hóa và Kỹ năng AI văn phòng đang được quay dựng và sẽ cập nhật trực tiếp tại đây.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: 3 Bài Viết Thực Chiến */}
        {activeTab === 'blog' && (
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                      <div className="absolute top-3 left-3">
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${branch.color}`}>
                          {branch.label}
                        </span>
                      </div>
                    </Link>

                    {/* Body Content */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{dateStr}</span>
                      </div>

                      <Link href={`/bai-viet/${post.slug}`} className="block group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {post.summary || 'Hướng dẫn chi tiết từng bước áp dụng AI vào công việc thực tế cùng Nguyễn Đăng AI.'}
                      </p>
                    </div>
                  </div>

                  {/* Footer Card */}
                  <div className="p-4 pt-0 mt-auto">
                    <Link
                      href={`/bai-viet/${post.slug}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-900 dark:text-white border border-slate-300 dark:border-white/10 transition-colors"
                    >
                      <span>Đọc Hướng Dẫn &amp; Lấy File</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Bottom Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Kênh YouTube @tuhocai_top liên tục đăng tải quy trình thực chiến mới
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bạn có thể đăng ký kênh để không bỏ lỡ các video hướng dẫn tiếp theo của Nguyễn Đăng AI.
            </p>
          </div>
          <a
            href="https://youtube.com/@tuhocai_top"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Xem Kênh YouTube @tuhocai_top</span>
          </a>
        </div>
      </div>
    </section>
  );
}
