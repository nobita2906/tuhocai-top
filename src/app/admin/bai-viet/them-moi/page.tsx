'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function NewPostPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [category, setCategory] = useState('NEWS');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('AI, Tự Học AI, Công nghệ');
  const [thumbnail, setThumbnail] = useState(SAMPLE_THUMBNAILS[0]);
  const [content, setContent] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      setSlug(slugifyVietnamese(val));
    }
  };

  const insertSnippet = (prefix: string, suffix = '') => {
    const textarea = document.getElementById('post-content-area') as HTMLTextAreaElement | null;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề bài viết');
      return;
    }
    if (!content.trim()) {
      setError('Vui lòng nhập nội dung bài viết');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
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
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Lỗi lưu bài viết');
      }

      setSuccess('Bài viết đã được tạo thành công! Đang chuyển hướng...');
      setTimeout(() => {
        router.push('/admin/bai-viet');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi gửi yêu cầu');
    } finally {
      setSaving(false);
    }
  };

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
              Soạn bài viết mới
            </h1>
            <p className="text-sm text-slate-400">Xuất bản bài chia sẻ kiến thức, prompt mẫu hoặc case study</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Đang lưu...' : 'Lưu bài viết'}
        </button>
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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ví dụ: Làm chủ Cursor & Claude Code từ con số 0..."
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-lg font-medium"
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
                  {isSlugManual ? 'Tự động tạo từ tiêu đề' : 'Chỉnh sửa slug tùy chọn'}
                </button>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 font-mono">
                <span className="text-slate-500">/bai-viet/</span>
                <input
                  type="text"
                  value={slug}
                  disabled={!isSlugManual}
                  onChange={(e) => setSlug(slugifyVietnamese(e.target.value))}
                  placeholder="duong-dan-bai-viet"
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
                placeholder="Tóm tắt ngắn gọn nội dung bài viết trong 1-2 câu để thu hút người đọc..."
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
                </div>
              )}
            </div>

            {activeTab === 'edit' ? (
              <div>
                <textarea
                  id="post-content-area"
                  rows={18}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nhập nội dung bài viết bằng Markdown hoặc HTML thuần..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-sm leading-relaxed"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Hỗ trợ định dạng Markdown tiêu chuẩn: **in đậm**, *nghiêng*, ## Tiêu đề, ```code, [link](url), v.v.
                </p>
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
                  <div className="text-sm font-medium text-white">Xuất bản công khai</div>
                  <div className="text-xs text-slate-400">Hiện bài viết trên website</div>
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
            <p className="text-xs text-slate-500">Phân cách các thẻ bằng dấu phẩy</p>
          </div>

          {/* Thumbnail */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <label className="block text-sm font-semibold text-white flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              Ảnh đại diện (Thumbnail)
            </label>
            <input
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://images.unsplash.com/..."
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
