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

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
    loadPosts();
  }, [category]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            Quản Lý Bài Viết
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tổng cộng {posts.length} bài viết trên hệ thống.
          </p>
        </div>

        <Link
          href="/admin/bai-viet/them-moi"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          Viết bài mới
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#111116] border border-white/[0.08]">
        {/* Category tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'NEWS', 'WORKFLOW', 'PROMPT', 'SKILL'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                category === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
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
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Posts Table */}
      <div className="bento-card overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            <p className="text-xs text-slate-400">Đang tải bài viết...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs space-y-3">
            <p>Không tìm thấy bài viết nào.</p>
            <Link
              href="/admin/bai-viet/them-moi"
              className="inline-block text-xs text-indigo-400 hover:underline font-semibold"
            >
              Tạo bài viết đầu tiên ngay →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 font-mono bg-white/[0.02]">
                  <th className="py-3 px-4">Bài viết</th>
                  <th className="py-3 px-4">Chuyên mục</th>
                  <th className="py-3 px-4">Lượt xem</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Ngày tạo</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-bold text-white line-clamp-1">{post.title}</p>
                      <p className="text-[11px] font-mono text-slate-500 truncate max-w-xs mt-0.5">
                        /{post.slug}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] text-slate-300">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        {post.views || 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(post)}
                        disabled={actionLoading === post.id}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                          post.is_published
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {post.is_published ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Đã xuất bản
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Bản nháp
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(post.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/bai-viet/${post.slug}`}
                          target="_blank"
                          title="Xem trên web"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/[0.06] transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/bai-viet/${post.id}`}
                          title="Chỉnh sửa bài viết"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-white/[0.06] transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post.id, post.title)}
                          disabled={actionLoading === post.id}
                          title="Xóa bài viết"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/[0.06] transition-colors"
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
      </div>
    </div>
  );
}
