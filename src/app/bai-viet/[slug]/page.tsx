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
} from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await query<Post>('SELECT * FROM posts WHERE slug = ? LIMIT 1', [slug]);
  if (posts.length === 0) return { title: 'Bài viết không tồn tại' };

  const p = posts[0];
  return {
    title: `${p.title} - Tự Học AI`,
    description: p.summary,
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

  // Increment views
  execute('UPDATE posts SET views = views + 1 WHERE id = ?', [post.id]).catch(() => {});

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <Link
          href="/bai-viet"
          className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quay lại danh sách bài viết
        </Link>
        <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 font-semibold uppercase">
          {post.category}
        </span>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-slate-400 border-b border-slate-800 pb-5">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {new Date(post.created_at).toLocaleDateString('vi-VN')}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            {(post.views || 0) + 1} lượt xem
          </span>
          <span>•</span>
          <span>Tác giả: <strong>Nguyễn Văn Đăng</strong></span>
        </div>

        {post.summary && (
          <div className="p-4 rounded-xl bg-slate-900/80 border-l-4 border-indigo-500 text-slate-300 text-sm leading-relaxed italic">
            {post.summary}
          </div>
        )}
      </div>

      {/* Article Content */}
      <div
        className="prose prose-invert prose-indigo max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Content Gating & Free Lead Magnet Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-white">
            Bạn muốn nhận tài liệu thực hành & mã nguồn bài viết này?
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Tham gia cộng đồng Zalo Tự Học AI để tải xuống các file cấu hình mẫu, template JSON và đặt câu hỏi trực tiếp cho đội ngũ hỗ trợ.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="https://zalo.me/g/tuhocai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all hover:scale-105"
          >
            <MessageCircle className="w-4 h-4" />
            Vào Group Zalo Nhận Tài Liệu
          </a>

          <Link
            href="/san-pham"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            Xem Kho Workflow n8n
          </Link>
        </div>
      </div>
    </article>
  );
}
