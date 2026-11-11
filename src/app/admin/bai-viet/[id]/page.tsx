'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Eye,
  FileEdit,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Link2,
  List,
  Code2,
  Quote,
  Trash2,
  Upload,
  UploadCloud,
  Lock,
  Globe,
  EyeOff,
  GraduationCap,
} from 'lucide-react';
import { slugifyVietnamese } from '@/lib/slugify';

const CATEGORIES = [
  { value: 'NEWS', label: 'Tin tức & Xu hướng' },
  { value: 'WORKFLOW', label: 'Quy trình AI Automation' },
  { value: 'PROMPT', label: 'Prompt Engineering' },
  { value: 'SKILL', label: 'Kỹ năng & Agent Coding' },
  { value: 'TUTORIAL', label: 'Hướng dẫn thực chiến' },
];

const SAMPLE_THUMBNAILS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
];

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [category, setCategory] = useState('NEWS');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [content, setContent] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [visibility, setVisibility] = useState<'PUBLIC' | 'UNLISTED' | 'COURSE_BUYERS'>('PUBLIC');
  const [requiredPid, setRequiredPid] = useState('');
  const [coursesList, setCoursesList] = useState<Array<{ id: string; pid: string; slug?: string; title: string; price: number }>>([]);

  useEffect(() => {
    fetch('/api/admin/classroom')
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) {
          setCoursesList(data.courses);
        }
      })
      .catch(() => {});
  }, []);

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inlineFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingThumb(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Lỗi khi tải ảnh lên');
      setThumbnail(data.url);
    } catch (err: any) {
      alert(err.message || 'Lỗi tải ảnh');
    } finally {
      setUploadingThumb(false);
    }
  };

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingInline(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Lỗi khi tải ảnh lên');
      insertSnippet(`\n\n![${file.name.replace(/\.[^/.]+$/, '')}](${data.url})\n\n`, '');
    } catch (err: any) {
      alert(err.message || 'Lỗi tải ảnh vào bài viết');
    } finally {
      setUploadingInline(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/posts/${id}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Không thể tải thông tin bài viết');
        }
        const p = data.post;
        setTitle(p.title || '');
        setSlug(p.slug || '');
        setCategory(p.category || 'NEWS');
        setSummary(p.summary || '');
        setTags(p.tags || '');
        setThumbnail(p.thumbnail || '');
        setContent(p.content || '');
        setIsFeatured(Boolean(p.is_featured));
        setIsPublished(Boolean(p.is_published));
        setVisibility(p.visibility || 'PUBLIC');
        setRequiredPid(p.required_pid || '');
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải bài viết');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const insertSnippet = (prefix: string, suffix = '') => {
    const textarea = document.getElementById('edit-content-area') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = `${prefix}${selected || 'nội dung'}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected || 'nội dung').length);
    }, 50);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError('Tiêu đề bài viết không được để trống');
      return;
    }
    if (!content.trim()) {
      setError('Nội dung bài viết không được để trống');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          category,
          summary,
          tags,
          thumbnail,
          content,
          is_featured: isFeatured,
          is_published: isPublished,
          visibility,
          required_pid: visibility === 'COURSE_BUYERS' ? (requiredPid.trim() || null) : null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Lỗi cập nhật bài viết');
      }

      setSuccess('Cập nhật bài viết thành công!');
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi gửi cập nhật');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa vĩnh viễn bài viết này không? Hành động này không thể hoàn tác.')) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Lỗi xóa bài viết');
      router.push('/admin/bai-viet');
    } catch (err: any) {
      setError(err.message || 'Không thể xóa bài viết');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p>Đang tải dữ liệu bài viết...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/bai-viet"
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileEdit className="w-6 h-6 text-indigo-400" />
              Chỉnh sửa bài viết
            </h1>
            <p className="text-sm text-slate-400">ID: <span className="font-mono text-xs text-indigo-400">{id}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-medium transition"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Xóa bài
          </button>

          <button
            type="button"
            onClick={handleUpdate}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Tiêu đề bài viết <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tiêu đề bài viết..."
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-lg font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-400">Đường dẫn tĩnh (Slug URL)</label>
                <button
                  type="button"
                  onClick={() => setIsSlugManual(!isSlugManual)}
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  {isSlugManual ? 'Khóa chỉnh sửa slug' : 'Chỉnh sửa slug'}
                </button>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 font-mono">
                <span className="text-slate-500">/bai-viet/</span>
                <input
                  type="text"
                  value={slug}
                  disabled={!isSlugManual}
                  onChange={(e) => setSlug(slugifyVietnamese(e.target.value))}
                  className="bg-transparent text-indigo-300 focus:outline-none flex-1 disabled:text-slate-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Mô tả tóm tắt (SEO Meta / Card)</label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Content Editor */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'edit'
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileEdit className="w-4 h-4 inline mr-1.5" />
                  Soạn thảo
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'preview'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-4 h-4 inline mr-1.5" />
                  Xem trước
                </button>
              </div>

              {activeTab === 'edit' && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => insertSnippet('## ', '')}
                    className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                    title="Tiêu đề H2"
                  >
                    <Heading2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet('### ', '')}
                    className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                    title="Tiêu đề H3"
                  >
                    <Heading3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet('**', '**')}
                    className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                    title="In đậm"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet('*', '*')}
                    className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                    title="In nghiêng"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet('> ', '')}
                    className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                    title="Trích dẫn"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet('```typescript\n', '\n```')}
                    className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                    title="Khối Code"
                  >
                    <Code2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet('- ', '')}
                    className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                    title="Danh sách"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet('[Liên kết](', ')')}
                    className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                    title="Chèn link"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>

                  {/* Inline Image Upload */}
                  <input
                    type="file"
                    ref={inlineFileInputRef}
                    onChange={handleInlineImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => inlineFileInputRef.current?.click()}
                    disabled={uploadingInline}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 transition disabled:opacity-50 ml-1"
                    title="Tải ảnh từ máy tính chèn vào bài"
                  >
                    {uploadingInline ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                    <span>Chèn ảnh máy tính</span>
                  </button>
                </div>
              )}
            </div>

            {activeTab === 'edit' ? (
              <div>
                <textarea
                  id="edit-content-area"
                  rows={18}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nội dung bài viết..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-sm leading-relaxed"
                />
              </div>
            ) : (
              <div className="min-h-[420px] p-6 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 prose prose-invert max-w-none">
                {content ? (
                  <div className="space-y-4 whitespace-pre-line leading-relaxed">
                    {content}
                  </div>
                ) : (
                  <p className="text-slate-600 italic">Chưa có nội dung để xem trước.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Controls (1 col) */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="font-semibold text-white text-sm">Trạng thái xuất bản</h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 cursor-pointer">
                <div>
                  <div className="text-sm font-medium text-white">Xuất bản bài viết</div>
                  <div className="text-xs text-slate-400">Bật/tắt trạng thái hiển thị</div>
                </div>
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-5 h-5 accent-indigo-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 cursor-pointer">
                <div>
                  <div className="text-sm font-medium text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Bài viết nổi bật
                  </div>
                  <div className="text-xs text-slate-400">Ghim trên trang chủ</div>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-5 h-5 accent-indigo-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Privacy & Access Control (Phân quyền khóa học) */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                Quyền riêng tư & Phân quyền
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                visibility === 'PUBLIC'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : visibility === 'UNLISTED'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {visibility}
              </span>
            </div>

            <div className="space-y-2">
              <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                visibility === 'PUBLIC'
                  ? 'bg-indigo-950/40 border-indigo-500/50 text-white'
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800/80'
              }`}>
                <input
                  type="radio"
                  name="visibility"
                  value="PUBLIC"
                  checked={visibility === 'PUBLIC'}
                  onChange={() => setVisibility('PUBLIC')}
                  className="mt-0.5 w-4 h-4 accent-indigo-500"
                />
                <div className="text-xs space-y-0.5">
                  <div className="font-semibold flex items-center gap-1.5 text-slate-200">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    Công khai (Public)
                  </div>
                  <div className="text-slate-400 text-[11px] leading-relaxed">
                    Hiện trên trang danh sách /bai-viet, lập chỉ mục Google & sitemap SEO.
                  </div>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                visibility === 'UNLISTED'
                  ? 'bg-indigo-950/40 border-indigo-500/50 text-white'
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800/80'
              }`}>
                <input
                  type="radio"
                  name="visibility"
                  value="UNLISTED"
                  checked={visibility === 'UNLISTED'}
                  onChange={() => setVisibility('UNLISTED')}
                  className="mt-0.5 w-4 h-4 accent-indigo-500"
                />
                <div className="text-xs space-y-0.5">
                  <div className="font-semibold flex items-center gap-1.5 text-slate-200">
                    <EyeOff className="w-3.5 h-3.5 text-blue-400" />
                    Không công khai (Unlisted)
                  </div>
                  <div className="text-slate-400 text-[11px] leading-relaxed">
                    Ẩn khỏi danh sách bài viết & sitemap. Chỉ ai có đường link mới xem được.
                  </div>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                visibility === 'COURSE_BUYERS'
                  ? 'bg-amber-950/40 border-amber-500/60 text-white'
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800/80'
              }`}>
                <input
                  type="radio"
                  name="visibility"
                  value="COURSE_BUYERS"
                  checked={visibility === 'COURSE_BUYERS'}
                  onChange={() => setVisibility('COURSE_BUYERS')}
                  className="mt-0.5 w-4 h-4 accent-amber-500"
                />
                <div className="text-xs space-y-0.5">
                  <div className="font-semibold flex items-center gap-1.5 text-amber-300">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                    Dành riêng cho Học viên đã mua khóa (Course VIP Gate)
                  </div>
                  <div className="text-slate-400 text-[11px] leading-relaxed">
                    Khóa nội dung bài viết. Người chưa mua sẽ thấy khung Paywall mở khóa kèm VietQR. Chỉ học viên đã thanh toán mới xem được toàn bộ.
                  </div>
                </div>
              </label>
            </div>

            {visibility === 'COURSE_BUYERS' && (
              <div className="pt-2 border-t border-slate-800/80 space-y-3">
                <label className="block text-xs font-semibold text-amber-300">
                  Chọn khóa học yêu cầu sở hữu:
                </label>
                <select
                  value={requiredPid}
                  onChange={(e) => setRequiredPid(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-amber-500/40 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="">-- Chọn khóa học để gắn bản quyền --</option>
                  {coursesList.map((c) => (
                    <option key={c.id} value={c.pid || c.slug}>
                      {c.title} ({c.pid || c.slug}) - {new Intl.NumberFormat('vi-VN').format(c.price)}đ
                    </option>
                  ))}
                </select>

                <div className="space-y-1">
                  <div className="text-[11px] text-slate-400">Hoặc nhập mã PID / Product ID thủ công:</div>
                  <input
                    type="text"
                    value={requiredPid}
                    onChange={(e) => setRequiredPid(e.target.value)}
                    placeholder="VD: WF-VIP-297"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <label className="block text-sm font-semibold text-white">Chuyên mục</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500 text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <label className="block text-sm font-semibold text-white">Thẻ tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="AI, Prompt, Cursor, NextJS..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          {/* Thumbnail */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-white flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                Ảnh đại diện (Thumbnail)
              </label>

              {/* Upload Button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleThumbnailUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingThumb}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                {uploadingThumb ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                Tải ảnh từ máy
              </button>
            </div>
            <input
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs font-mono"
            />

            {thumbnail && (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-700/60 bg-slate-950">
                <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div>
              <div className="text-xs text-slate-400 mb-1.5">Ảnh gợi ý nhanh:</div>
              <div className="grid grid-cols-4 gap-1.5">
                {SAMPLE_THUMBNAILS.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setThumbnail(img)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition ${
                      thumbnail === img ? 'border-indigo-500 scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
