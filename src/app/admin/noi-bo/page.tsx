'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { marked } from 'marked';
import {
  BookOpen,
  Search,
  Plus,
  Pin,
  ExternalLink,
  Copy,
  Check,
  Edit3,
  Trash2,
  Folder,
  Layers,
  Sparkles,
  Zap,
  GraduationCap,
  Lightbulb,
  KeyRound,
  FileText,
  Clock,
  X,
  Loader2,
  CheckCircle2,
  ChevronRight,
  Maximize2,
  Download,
  Share2,
  FileDown,
  UploadCloud,
  ArrowRight,
  FileCode,
  Wand2,
} from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { convertNotionHtmlToMarkdown, parseNotionContent, ParsedNotionDoc } from '@/lib/notionParser';

interface InternalDoc {
  id: string;
  title: string;
  slug: string;
  icon: string;
  category: string;
  tags: string;
  drive_url?: string;
  content: string;
  is_pinned: boolean;
  badge_color: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  { key: 'ALL', label: 'Tất cả tài liệu', icon: Layers },
  { key: 'PINNED', label: 'Ghim quan trọng', icon: Pin },
  { key: 'DRIVE_LINKS', label: 'Kho Link Drive', icon: Folder },
  { key: 'QUY_TRINH', label: 'Quy trình SOPs', icon: Zap },
  { key: 'KHOA_HOC', label: 'Khóa học & Video', icon: GraduationCap },
  { key: 'GHI_CHU', label: 'Ghi chú & Ý tưởng', icon: Lightbulb },
  { key: 'TAI_KHOAN', label: 'Cấu hình & Tool AI', icon: KeyRound },
];

const EMOJI_LIST = ['📂', '⚡', '💳', '🎓', '💡', '🔐', '🚀', '🤖', '📝', '🎯', '📑', '🛠️', '📊', '🔑', '📘', '⭐'];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
};

export default function AdminInternalWikiPage() {
  const [docs, setDocs] = useState<InternalDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [search, setSearch] = useState('');
  const [activeDoc, setActiveDoc] = useState<InternalDoc | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<InternalDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 12;

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formIcon, setFormIcon] = useState('📘');
  const [formCategory, setFormCategory] = useState('QUY_TRINH');
  const [formTags, setFormTags] = useState('');
  const [formDriveUrl, setFormDriveUrl] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formPinned, setFormPinned] = useState(false);
  const [formColor, setFormColor] = useState('indigo');

  // Notion Import Modal State
  const [isNotionImportOpen, setIsNotionImportOpen] = useState(false);
  const [importTab, setImportTab] = useState<'paste' | 'file'>('paste');
  const [importInputText, setImportInputText] = useState('');
  const [importedDoc, setImportedDoc] = useState<ParsedNotionDoc | null>(null);
  const [importSaving, setImportSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadDocs = async () => {
    try {
      setLoading(true);
      const url = new URL('/api/admin/internal-docs', window.location.origin);
      if (selectedCat !== 'ALL' && selectedCat !== 'PINNED') {
        url.searchParams.set('category', selectedCat);
      }
      if (selectedCat === 'PINNED') {
        url.searchParams.set('pinned', 'true');
      }
      if (search) {
        url.searchParams.set('q', search);
      }

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setDocs(data.docs || []);
        if (activeDoc) {
          const updated = (data.docs || []).find((d: InternalDoc) => d.id === activeDoc.id);
          if (updated) setActiveDoc(updated);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadDocs();
  }, [selectedCat]);

  const handleCopy = (text: string, id: string, label: string = 'Đã sao chép!') => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(label);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTogglePin = async (doc: InternalDoc, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/admin/internal-docs/${doc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ togglePin: true }),
      });
      if (res.ok) {
        showToast(doc.is_pinned ? 'Đã bỏ ghim tài liệu' : 'Đã ghim tài liệu lên đầu');
        loadDocs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (doc: InternalDoc, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm(`Xóa tài liệu "${doc.title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/internal-docs/${doc.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('Đã xóa tài liệu');
        if (activeDoc?.id === doc.id) setActiveDoc(null);
        loadDocs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setEditingDoc(null);
    setFormTitle('');
    setFormIcon('📂');
    setFormCategory('DRIVE_LINKS');
    setFormTags('');
    setFormDriveUrl('');
    setFormContent('');
    setFormPinned(false);
    setFormColor('cyan');
    setIsModalOpen(true);
  };

  const openEditModal = (doc: InternalDoc, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingDoc(doc);
    setFormTitle(doc.title);
    setFormIcon(doc.icon || '📘');
    setFormCategory(doc.category || 'QUY_TRINH');
    setFormTags(doc.tags || '');
    setFormDriveUrl(doc.drive_url || '');
    setFormContent(doc.content || '');
    setFormPinned(Boolean(doc.is_pinned));
    setFormColor(doc.badge_color || 'indigo');
    setIsModalOpen(true);
  };

  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Vui lòng nhập tiêu đề tài liệu');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: formTitle.trim(),
        icon: formIcon,
        category: formCategory,
        tags: formTags,
        drive_url: formDriveUrl.trim(),
        content: formContent,
        is_pinned: formPinned,
        badge_color: formColor,
      };

      if (editingDoc) {
        const res = await fetch(`/api/admin/internal-docs/${editingDoc.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast('Đã cập nhật tài liệu thành công!');
          setIsModalOpen(false);
          loadDocs();
        }
      } else {
        const res = await fetch('/api/admin/internal-docs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast('Đã tạo tài liệu mới thành công!');
          setIsModalOpen(false);
          loadDocs();
        }
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi lưu tài liệu');
    } finally {
      setSaving(false);
    }
  };

  const insertSnippet = (snippet: string) => {
    setFormContent((prev) => prev + '\n\n' + snippet);
  };

  // -------------------------------------------------------------
  // NOTION IMPORT LOGIC
  // -------------------------------------------------------------
  const processNotionRawText = (text: string, fileName?: string) => {
    const parsed = parseNotionContent(text, fileName);
    setImportedDoc(parsed);
  };

  const handleNotionPasteEvent = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const htmlData = e.clipboardData.getData('text/html');
    const textData = e.clipboardData.getData('text/plain');

    if (htmlData && htmlData.includes('notion')) {
      const convertedMarkdown = convertNotionHtmlToMarkdown(htmlData);
      setImportInputText(convertedMarkdown);
      processNotionRawText(convertedMarkdown);
      showToast('Đã tự động chuyển định dạng Notion HTML sang Markdown!');
    } else if (textData) {
      setImportInputText(textData);
      processNotionRawText(textData);
      showToast('Đã phân tích nội dung dán từ Notion!');
    }
  };

  const handleNotionFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setImportInputText(text);
      processNotionRawText(text, file.name);
      showToast(`Đã đọc tệp Notion "${file.name}" thành công!`);
    } catch (err) {
      console.error(err);
      alert('Không thể đọc tệp markdown này.');
    }
  };

  const handleSaveImportedDoc = async () => {
    if (!importedDoc || !importedDoc.title.trim()) {
      alert('Vui lòng kiểm tra lại tiêu đề tài liệu');
      return;
    }

    try {
      setImportSaving(true);
      const payload = {
        title: importedDoc.title,
        icon: importedDoc.icon || '📘',
        category: importedDoc.category || 'QUY_TRINH',
        tags: importedDoc.tags || '',
        drive_url: importedDoc.drive_url || '',
        content: importedDoc.content || '',
        is_pinned: false,
        badge_color:
          importedDoc.category === 'DRIVE_LINKS'
            ? 'cyan'
            : importedDoc.category === 'KHOA_HOC'
            ? 'purple'
            : importedDoc.category === 'TAI_KHOAN'
            ? 'amber'
            : 'indigo',
      };

      const res = await fetch('/api/admin/internal-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast('🚀 Đã nhập tài liệu từ Notion thành công!');
        setIsNotionImportOpen(false);
        setImportedDoc(null);
        setImportInputText('');
        loadDocs();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Lỗi khi nhập tài liệu');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi lưu tài liệu từ Notion');
    } finally {
      setImportSaving(false);
    }
  };

  // Quick auto-fill into standard Create Modal
  const autoFillFromNotionPaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (!clipText.trim()) {
        alert('Bộ nhớ tạm (Clipboard) đang trống. Hãy copy một trang từ Notion trước nhé!');
        return;
      }
      const parsed = parseNotionContent(clipText);
      setFormTitle(parsed.title);
      setFormIcon(parsed.icon || '📘');
      setFormCategory(parsed.category || 'QUY_TRINH');
      if (parsed.drive_url) setFormDriveUrl(parsed.drive_url);
      if (parsed.tags) setFormTags(parsed.tags);
      setFormContent(parsed.content);
      showToast('Đã tự động điền thông tin từ Notion!');
    } catch (err) {
      alert('Vui lòng cấp quyền đọc bộ nhớ tạm hoặc sử dụng nút "Nhập từ Notion" ở ngoài trang nhé!');
    }
  };

  // Filtered docs
  const filteredDocs = docs.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      (d.tags && d.tags.toLowerCase().includes(q)) ||
      (d.content && d.content.toLowerCase().includes(q))
    );
  });

  // Render markdown for active document
  const parsedMarkdownHtml = useMemo(() => {
    if (!activeDoc?.content) return '';
    try {
      return marked.parse(activeDoc.content, {
        breaks: true,
        gfm: true,
      }) as string;
    } catch (err) {
      console.error('Markdown parse error:', err);
      return `<pre>${activeDoc.content}</pre>`;
    }
  }, [activeDoc?.content]);

  // Render markdown for imported preview
  const parsedImportPreviewHtml = useMemo(() => {
    if (!importedDoc?.content) return '';
    try {
      return marked.parse(importedDoc.content, {
        breaks: true,
        gfm: true,
      }) as string;
    } catch (err) {
      return `<pre>${importedDoc.content}</pre>`;
    }
  }, [importedDoc?.content]);

  const totalDriveLinks = docs.filter((d) => Boolean(d.drive_url)).length;
  const totalSOPs = docs.filter((d) => d.category === 'QUY_TRINH').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#18181f] border border-cyan-500/40 text-cyan-300 text-xs font-mono shadow-2xl shadow-cyan-500/10 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Notion Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#12121a] via-[#0d0d12] to-[#141420] border border-white/[0.08] p-6 sm:p-7">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Notion Workspace & Internal Wiki
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="text-3xl">🧠</span> Không Gian Tri Thức & Link Gốc Nội Bộ
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Danh sách tập trung toàn bộ link Google Drive master, tài liệu hướng dẫn, SOPs tự động hóa và ghi chú kỹ thuật.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-4 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono">
              <div className="text-center">
                <div className="font-bold text-white text-base">{docs.length}</div>
                <div className="text-[10px] text-slate-500">Tài liệu</div>
              </div>
              <div className="h-6 w-px bg-white/[0.1]" />
              <div className="text-center">
                <div className="font-bold text-cyan-400 text-base">{totalDriveLinks}</div>
                <div className="text-[10px] text-slate-500">Link Drive</div>
              </div>
              <div className="h-6 w-px bg-white/[0.1]" />
              <div className="text-center">
                <div className="font-bold text-indigo-400 text-base">{totalSOPs}</div>
                <div className="text-[10px] text-slate-500">Quy trình</div>
              </div>
            </div>

            {/* Nút Nhập từ Notion */}
            <button
              onClick={() => {
                setImportedDoc(null);
                setImportInputText('');
                setIsNotionImportOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-bold transition-all shadow-md shadow-cyan-500/5"
            >
              <FileDown className="w-4 h-4 text-cyan-400" />
              Nhập từ Notion
            </button>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-blue-800 hover:opacity-85 text-white font-bold text-xs shadow-md shadow-indigo-600/25 border border-indigo-600/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Tạo tài liệu mới
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar: Category Switcher & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCat === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  setSelectedCat(cat.key);
                  setPage(1);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-700 via-indigo-800 to-blue-800 text-white shadow-sm font-bold'
                    : 'bg-white dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] border-2 border-slate-300 dark:border-white/[0.06]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : 'text-slate-500 dark:text-slate-400'}`} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo tiêu đề, tag, nội dung..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-white/[0.03] border-2 border-slate-300 dark:border-white/[0.08] text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 transition-colors"
          />
        </div>
      </div>

      {/* DANH SÁCH TÀI LIỆU (LIST VIEW ONLY) */}
      <div className="rounded-2xl bento-card border-2 border-slate-300 dark:border-white/10 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">Đang tải danh sách tài liệu...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400 text-xs space-y-3">
            <p>Không tìm thấy tài liệu nào phù hợp.</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setIsNotionImportOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/20 text-cyan-700 dark:text-cyan-300 text-xs font-bold hover:bg-cyan-600/30 transition border border-cyan-500/30"
              >
                <FileDown className="w-3.5 h-3.5" /> Nhập từ Notion
              </button>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-blue-800 text-white text-xs font-bold hover:opacity-85 transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Tạo tài liệu mới
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#14141c] border-b-2 border-slate-300 dark:border-white/[0.08] text-slate-700 dark:text-slate-400 font-mono font-bold">
                <tr>
                  <th className="py-3.5 px-5">Tài liệu & Thẻ phân loại</th>
                  <th className="py-3.5 px-4 w-40">Chuyên mục</th>
                  <th className="py-3.5 px-4 w-52">Link Google Drive gốc</th>
                  <th className="py-3.5 px-4 w-36">Cập nhật</th>
                  <th className="py-3.5 px-5 text-right w-36">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/[0.04]">
                {filteredDocs
                  .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
                  .map((doc) => {
                    const color = COLOR_MAP[doc.badge_color || 'indigo'] || COLOR_MAP.indigo;
                    return (
                      <tr
                        key={doc.id}
                        onClick={() => setActiveDoc(doc)}
                        className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer group"
                      >
                        {/* Title, Icon, Tags */}
                        <td className="py-4 px-5">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl select-none flex-shrink-0 mt-0.5">
                              {doc.icon || '📘'}
                            </span>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {doc.is_pinned && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/25 font-bold">
                                    <Pin className="w-2.5 h-2.5 fill-amber-400" />
                                    Ghim
                                  </span>
                                )}
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-cyan-300 transition-colors line-clamp-1">
                                  {doc.title}
                                </h3>
                              </div>

                              {doc.tags && (
                                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                  {doc.tags.split(',').map((t, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.03] text-slate-400 border border-white/[0.05]"
                                    >
                                      #{t.trim()}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 font-mono">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${color.bg} ${color.text} ${color.border}`}
                          >
                            {doc.category}
                          </span>
                        </td>

                        {/* Drive URL */}
                        <td className="py-4 px-4 font-mono">
                          {doc.drive_url ? (
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handleCopy(doc.drive_url!, doc.id, 'Đã copy link Drive!')}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/25 text-[11px] font-semibold transition"
                              >
                                {copiedId === doc.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    Đã copy
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    Copy Drive
                                  </>
                                )}
                              </button>

                              <a
                                href={doc.drive_url}
                                target="_blank"
                                rel="noreferrer"
                                title="Mở thư mục Google Drive"
                                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic text-[11px]">—</span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                          {new Date(doc.updated_at || doc.created_at).toLocaleDateString('vi-VN')}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => handleTogglePin(doc, e)}
                              title={doc.is_pinned ? 'Bỏ ghim' : 'Ghim lên đầu'}
                              className={`p-1.5 rounded-lg transition-colors ${
                                doc.is_pinned
                                  ? 'text-amber-400 bg-amber-500/10'
                                  : 'text-slate-500 hover:text-white hover:bg-white/[0.06]'
                              }`}
                            >
                              <Pin className={`w-3.5 h-3.5 ${doc.is_pinned ? 'fill-amber-400' : ''}`} />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => openEditModal(doc, e)}
                              title="Chỉnh sửa tài liệu"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-white/[0.06] transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleDelete(doc, e)}
                              title="Xóa tài liệu"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/[0.06] transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {Math.ceil(filteredDocs.length / PAGE_SIZE) > 1 && (
          <div className="p-4 border-t border-white/[0.08]">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filteredDocs.length / PAGE_SIZE)}
              totalItems={filteredDocs.length}
              pageSize={PAGE_SIZE}
              itemName="tài liệu"
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* MARKDOWN READER MODAL (HIỂN THỊ ĐỊNH DẠNG MARKDOWN TIÊU CHUẨN) */}
      {activeDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-4xl w-full max-h-[92vh] bg-[#111116] border border-white/[0.1] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#14141c]">
              <div className="flex items-center gap-3">
                <span className="text-3xl select-none">{activeDoc.icon || '📘'}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                      {activeDoc.category}
                    </span>
                    {activeDoc.is_pinned && (
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/25">
                        Đang ghim
                      </span>
                    )}
                  </div>
                  <h2 className="text-base sm:text-xl font-bold text-white mt-1 line-clamp-1">
                    {activeDoc.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(activeDoc)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                  Sửa
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDoc(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="px-6 py-3 bg-[#0d0d12] border-b border-white/[0.04] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-2">
                {activeDoc.drive_url && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCopy(activeDoc.drive_url!, 'reader-drive', 'Đã copy link Drive!')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-semibold transition"
                    >
                      {copiedId === 'reader-drive' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          Đã copy Drive
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy Link Drive
                        </>
                      )}
                    </button>

                    <a
                      href={activeDoc.drive_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Mở Google Drive
                    </a>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => handleCopy(activeDoc.content, 'reader-markdown', 'Đã copy toàn bộ nội dung Markdown!')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition"
                >
                  {copiedId === 'reader-markdown' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      Đã copy Markdown
                    </>
                  ) : (
                    <>
                      <FileText className="w-3 h-3" />
                      Copy Raw Markdown
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span>Người tạo: <strong className="text-slate-200">{activeDoc.created_by || 'Admin'}</strong></span>
                <span>•</span>
                <span>Cập nhật: {new Date(activeDoc.updated_at || activeDoc.created_at).toLocaleString('vi-VN')}</span>
              </div>
            </div>

            {/* VÙNG NỘI DUNG HIỂN THỊ MARKDOWN THỰC THỤ */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 max-h-[calc(92vh-140px)]">
              {/* Tags */}
              {activeDoc.tags && (
                <div className="flex flex-wrap gap-2">
                  {activeDoc.tags.split(',').map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-cyan-400"
                    >
                      #{t.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Rendered HTML from Markdown */}
              <div
                className="markdown-body p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
                dangerouslySetInnerHTML={{ __html: parsedMarkdownHtml }}
              />
            </div>
          </div>
        </div>
      )}

      {/* NOTION IMPORT MODAL (HỖ TRỢ NHẬP TỪ NOTION) */}
      {isNotionImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-3xl w-full max-h-[92vh] bg-[#111116] border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#14141c]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 flex items-center justify-center font-bold">
                  N
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    Nhập Định Dạng Từ Notion
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Tự động nhận diện Tiêu đề, Emoji, Link Google Drive, Tags và chuyển sang Markdown chuẩn
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNotionImportOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 max-h-[calc(92vh-130px)]">
              {/* Tabs: Paste vs File */}
              <div className="flex items-center gap-2 p-1 rounded-xl bg-white/[0.03] border border-white/[0.08] w-fit">
                <button
                  type="button"
                  onClick={() => setImportTab('paste')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                    importTab === 'paste'
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📋 Dán nội dung Notion
                </button>
                <button
                  type="button"
                  onClick={() => setImportTab('file')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                    importTab === 'file'
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📁 Tải file .md từ Notion
                </button>
              </div>

              {importTab === 'paste' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Dán nội dung copy từ Notion (Ctrl + V):</span>
                    <span className="text-[11px] text-cyan-400 italic">Hỗ trợ tự động trích xuất link Drive</span>
                  </div>
                  <textarea
                    rows={6}
                    value={importInputText}
                    onPaste={handleNotionPasteEvent}
                    onChange={(e) => {
                      setImportInputText(e.target.value);
                      processNotionRawText(e.target.value);
                    }}
                    placeholder="Mở Notion -> Chọn toàn bộ trang (Ctrl+A) -> Copy (Ctrl+C) -> Dán vào đây (Ctrl+V)..."
                    className="w-full p-4 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-xs font-mono leading-relaxed placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/[0.15] hover:border-cyan-500/50 rounded-2xl p-8 text-center cursor-pointer bg-white/[0.01] hover:bg-white/[0.03] transition space-y-3"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".md,.markdown,.txt"
                    onChange={handleNotionFileChange}
                    className="hidden"
                  />
                  <UploadCloud className="w-10 h-10 text-cyan-400 mx-auto" />
                  <div>
                    <p className="text-sm font-semibold text-white">Bấm để chọn hoặc kéo thả tệp .md từ Notion</p>
                    <p className="text-xs text-slate-500 font-mono mt-1">Hỗ trợ tệp .md, .markdown xuất từ Notion</p>
                  </div>
                </div>
              )}

              {/* EXTRACTED RESULT & PREVIEW */}
              {importedDoc && (
                <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Kết Quả Tự Động Trích Xuất:
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Đã sẵn sàng lưu</span>
                  </div>

                  {/* Quick Edit Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">Icon:</label>
                      <input
                        type="text"
                        value={importedDoc.icon}
                        onChange={(e) => setImportedDoc({ ...importedDoc, icon: e.target.value })}
                        className="w-full text-center text-lg py-1.5 rounded-xl bg-slate-900 border border-white/[0.1] text-white"
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">Tiêu đề:</label>
                      <input
                        type="text"
                        value={importedDoc.title}
                        onChange={(e) => setImportedDoc({ ...importedDoc, title: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/[0.1] text-white text-xs font-bold"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">Chuyên mục:</label>
                      <select
                        value={importedDoc.category}
                        onChange={(e) => setImportedDoc({ ...importedDoc, category: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/[0.1] text-white text-xs"
                      >
                        <option value="DRIVE_LINKS">📂 Kho Link Drive</option>
                        <option value="QUY_TRINH">⚡ Quy trình SOPs</option>
                        <option value="KHOA_HOC">🎓 Khóa học & Video</option>
                        <option value="GHI_CHU">💡 Ghi chú & Ý tưởng</option>
                        <option value="TAI_KHOAN">🔐 Cấu hình & Tool AI</option>
                      </select>
                    </div>

                    <div className="sm:col-span-8">
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">
                        Link Google Drive phát hiện:
                      </label>
                      <input
                        type="url"
                        value={importedDoc.drive_url}
                        onChange={(e) => setImportedDoc({ ...importedDoc, drive_url: e.target.value })}
                        placeholder="https://drive.google.com/..."
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/[0.1] text-cyan-300 font-mono text-xs"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">Thẻ tags:</label>
                      <input
                        type="text"
                        value={importedDoc.tags}
                        onChange={(e) => setImportedDoc({ ...importedDoc, tags: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/[0.1] text-slate-300 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Rendered Preview Box */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1.5">
                      Bản xem trước định dạng Markdown:
                    </label>
                    <div
                      className="markdown-body p-5 rounded-2xl bg-[#09090d] border border-white/[0.08] max-h-60 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: parsedImportPreviewHtml }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNotionImportOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition"
                >
                  Đóng
                </button>

                <button
                  type="button"
                  disabled={!importedDoc || importSaving}
                  onClick={handleSaveImportedDoc}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {importSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang lưu vào Wiki...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Lưu Vào Không Gian Nội Bộ
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notion Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-3xl w-full max-h-[92vh] bg-[#111116] border border-white/[0.1] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#14141c]">
              <div className="flex items-center gap-2">
                <span className="text-xl">{formIcon}</span>
                <h2 className="text-base font-bold text-white">
                  {editingDoc ? 'Chỉnh sửa tài liệu nội bộ' : 'Tạo tài liệu mới (Notion Doc)'}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {!editingDoc && (
                  <button
                    type="button"
                    onClick={autoFillFromNotionPaste}
                    title="Đọc từ Clipboard và tự điền các trường"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    Dán từ Notion (Auto-Fill)
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveDoc} className="p-6 overflow-y-auto space-y-4 max-h-[calc(92vh-130px)]">
              {/* Emoji Picker Strip */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">Chọn Icon đại diện:</label>
                <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormIcon(emoji)}
                      className={`w-9 h-9 text-lg rounded-lg flex items-center justify-center transition-all ${
                        formIcon === emoji
                          ? 'bg-indigo-600/50 border border-indigo-400 scale-110'
                          : 'hover:bg-white/[0.08]'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                  <input
                    type="text"
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    placeholder="Khác"
                    className="w-16 px-2 py-1 text-center rounded-lg bg-white/[0.04] border border-white/[0.1] text-xs text-white"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Tiêu đề tài liệu *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Tổng hợp Master Link Google Drive Khóa học n8n..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Category, Color & Pin */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Chuyên mục</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/[0.1] text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="DRIVE_LINKS">📂 Kho Link Drive</option>
                    <option value="QUY_TRINH">⚡ Quy trình SOPs</option>
                    <option value="KHOA_HOC">🎓 Khóa học & Video</option>
                    <option value="GHI_CHU">💡 Ghi chú & Ý tưởng</option>
                    <option value="TAI_KHOAN">🔐 Cấu hình & Tool AI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Tông màu nhãn</label>
                  <select
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/[0.1] text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="cyan">Xanh Cyan</option>
                    <option value="indigo">Tím Indigo</option>
                    <option value="emerald">Xanh Emerald</option>
                    <option value="amber">Vàng Amber</option>
                    <option value="purple">Tím Purple</option>
                    <option value="rose">Hồng Rose</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                    <input
                      type="checkbox"
                      checked={formPinned}
                      onChange={(e) => setFormPinned(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700"
                    />
                    <span>Ghim lên đầu trang</span>
                  </label>
                </div>
              </div>

              {/* Drive Link */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Link Google Drive / Thư mục tải về gốc (Nếu có)
                </label>
                <input
                  type="url"
                  value={formDriveUrl}
                  onChange={(e) => setFormDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-cyan-300 font-mono text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Tags (ngăn cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="Drive Master, n8n, SOP, Khóa học, VPS"
                  className="w-full px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Content with Quick Snippet Buttons */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono text-slate-400">Nội dung chi tiết (Định dạng Markdown):</label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => insertSnippet('> 💡 **Lưu ý quan trọng:** Điền thông tin lưu ý tại đây...')}
                      className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] text-amber-400 border border-white/[0.06] hover:bg-white/[0.08]"
                    >
                      + Callout
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('- [ ] Bước 1: Chuẩn bị\n- [ ] Bước 2: Thực thi\n- [ ] Bước 3: Nghiệm thu')}
                      className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] text-cyan-400 border border-white/[0.06] hover:bg-white/[0.08]"
                    >
                      + Checklist
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('```bash\n# Lệnh cài đặt\ncurl -fsSL https://get.docker.com -o get-docker.sh\nsudo sh get-docker.sh\n```')}
                      className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] text-indigo-400 border border-white/[0.06] hover:bg-white/[0.08]"
                    >
                      + Code
                    </button>
                  </div>
                </div>
                <textarea
                  rows={10}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Soạn thảo hướng dẫn, quy trình từng bước hoặc dán các đường link phụ bằng cú pháp Markdown..."
                  className="w-full p-4 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-xs font-mono leading-relaxed placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {editingDoc ? 'Lưu thay đổi' : 'Tạo tài liệu'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
