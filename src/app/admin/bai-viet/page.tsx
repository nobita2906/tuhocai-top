'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  PlusCircle,
  Search,
  Trash2,
  Edit,
  ExternalLink,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
} from 'lucide-react';
import Pagination from '@/components/ui/Pagination';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const PAGE_SIZE = 10;

  const loadPosts = async () => {
    try {
      setLoading(true);
      const url = new URL('/api/admin/posts', window.location.origin);
      if (search) url.searchParams.set('q', search);
      if (category && category !== 'ALL') url.searchParams.set('category', category);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadPosts();
  }, [category]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadPosts();
  };

  const handleTogglePublish = async (post: any) => {
    try {
      setActionLoading(post.id);
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !post.is_published }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, is_published: !p.is_published } : p))
        );
      }
    } catch (err) {
      alert('Lỗi cập nhật trạng thái xuất bản');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeletePost = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa bài viết: "${title}" không? Hành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      setActionLoading(id);
      const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.error || 'Lỗi xóa bài viết');
      }
    } catch (err) {
      alert('Không thể xóa bài viết');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Quản Lý Bài Viết
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Tổng cộng {posts.length} bài viết trên hệ thống.
          </p>
        </div>

        <Link
          href="/admin/bai-viet/them-moi"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-blue-800 hover:opacity-85 text-white font-bold text-xs shadow-md shadow-indigo-600/20 border border-indigo-600/30 transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          Viết bài mới
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bento-card border-2 border-slate-300 dark:border-white/10">
        {/* Category tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'NEWS', 'WORKFLOW', 'PROMPT', 'SKILL'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                category === cat
                  ? 'bg-gradient-to-r from-indigo-700 via-indigo-800 to-blue-800 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05]'
              }`}
            >
              {cat === 'ALL' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Tìm theo tiêu đề..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white dark:bg-white/[0.04] border-2 border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Posts Table */}
      <div className="bento-card border-2 border-slate-300 dark:border-white/10 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 text-indigo-600 dark:text-indigo-500 animate-spin" />
            <p className="text-xs text-slate-500 dark:text-slate-400">Đang tải bài viết...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400 text-xs space-y-3">
            <p>Không tìm thấy bài viết nào.</p>
            <Link
              href="/admin/bai-viet/them-moi"
              className="inline-block text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
            >
              Tạo bài viết đầu tiên ngay →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-slate-300 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 font-mono bg-slate-50 dark:bg-white/[0.02] font-bold">
                  <th className="py-3 px-4">Bài viết</th>
                  <th className="py-3 px-4">Chuyên mục</th>
                  <th className="py-3 px-4">Lượt xem</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Ngày tạo</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/[0.04]">
                {posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{post.title}</p>
                      <p className="text-[11px] font-mono text-slate-500 truncate max-w-xs mt-0.5">
                        /{post.slug}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.05] border border-slate-300 dark:border-white/[0.08] text-[10px] text-slate-700 dark:text-slate-300 font-bold">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300 font-semibold">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        {post.views || 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(post)}
                        disabled={actionLoading === post.id}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                          post.is_published
                            ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 hover:opacity-85'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:opacity-85'
                        }`}
                      >
                        {post.is_published ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            Đã xuất bản
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            Bản nháp
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                      {new Date(post.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/bai-viet/${post.slug}`}
                          target="_blank"
                          title="Xem trên web"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/bai-viet/${post.id}`}
                          title="Chỉnh sửa bài viết"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post.id, post.title)}
                          disabled={actionLoading === post.id}
                          title="Xóa bài viết"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {Math.ceil(posts.length / PAGE_SIZE) > 1 && (
          <div className="p-4 border-t border-white/[0.08]">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(posts.length / PAGE_SIZE)}
              totalItems={posts.length}
              pageSize={PAGE_SIZE}
              itemName="bài viết"
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
