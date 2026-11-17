'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Image as ImageIcon,
  Link as LinkIcon,
  Table as TableIcon,
  Quote,
  Code,
  Minus,
  Undo2,
  Redo2,
  RemoveFormatting,
  Eye,
  FileEdit,
  Code2,
  Upload,
  Loader2,
  Maximize2,
  Minimize2,
  Sparkles,
  HelpCircle,
  Highlighter,
  Palette,
  Check,
} from 'lucide-react';
import { marked } from 'marked';

interface WordRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function WordRichTextEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung bài viết...',
  minHeight = '520px',
}: WordRichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'preview'>('visual');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [highlightPickerOpen, setHighlightPickerOpen] = useState(false);

  const visualEditorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUpdatingRef = useRef(false);

  // Thống kê bài viết
  const [stats, setStats] = useState({ words: 0, chars: 0, readMinutes: 1 });

  const calculateStats = useCallback((textOrHtml: string) => {
    const textOnly = textOrHtml
      .replace(/<[^>]+>/g, ' ')
      .replace(/[#*_`~>-]/g, ' ')
      .trim();
    const chars = textOnly.length;
    const words = textOnly ? textOnly.split(/\s+/).filter(Boolean).length : 0;
    const readMinutes = Math.max(1, Math.ceil(words / 220));
    setStats({ words, chars, readMinutes });
  }, []);

  // Khởi tạo và đồng bộ giá trị vào contentEditable khi chuyển tab hoặc khi value thay đổi từ bên ngoài
  useEffect(() => {
    if (visualEditorRef.current && !isUpdatingRef.current) {
      if (visualEditorRef.current.innerHTML !== value) {
        // Nếu value là markdown thuần, render thành html sơ khởi hoặc đưa trực tiếp
        const hasMarkdown = /(?:^|\n)(?:#{1,6}\s|```|\|[\s\S]*\||[\*\-]\s|\d+\.\s)/.test(value);
        if (hasMarkdown && !value.includes('<p>') && !value.includes('<div>')) {
          try {
            visualEditorRef.current.innerHTML = marked.parse(value, { breaks: true, gfm: true }) as string;
          } catch {
            visualEditorRef.current.innerHTML = value;
          }
        } else {
          visualEditorRef.current.innerHTML = value || '';
        }
      }
    }
    calculateStats(value);
  }, [value, calculateStats, activeTab]);

  // Xử lý khi người dùng gõ vào visual editor
  const handleVisualInput = () => {
    if (!visualEditorRef.current) return;
    isUpdatingRef.current = true;
    const html = visualEditorRef.current.innerHTML;
    onChange(html);
    calculateStats(html);
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 100);
  };

  // Thực thi lệnh document.execCommand chuẩn Rich Text
  const executeCmd = (command: string, val: string | undefined = undefined) => {
    if (activeTab !== 'visual') {
      setActiveTab('visual');
    }
    setTimeout(() => {
      visualEditorRef.current?.focus();
      document.execCommand(command, false, val);
      handleVisualInput();
    }, 20);
  };

  // Chọn Heading hoặc Paragraph
  const handleFormatBlock = (tag: string) => {
    executeCmd('formatBlock', tag);
  };

  // Chèn liên kết
  const handleInsertLink = () => {
    const url = prompt('Nhập đường dẫn liên kết (URL):', 'https://');
    if (url && url !== 'https://') {
      executeCmd('createLink', url);
    }
  };

  // Tải ảnh từ máy tính và chèn ngay vào bài
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Lỗi khi tải ảnh lên');
      }

      // Chèn ảnh vào visual editor
      if (activeTab === 'visual') {
        visualEditorRef.current?.focus();
        const imgHtml = `<p><img src="${data.url}" alt="${file.name.replace(/\.[^/.]+$/, '')}" class="rounded-xl shadow-lg max-w-full my-4 border border-slate-700/50" /></p>`;
        document.execCommand('insertHTML', false, imgHtml);
        handleVisualInput();
      } else {
        const mdImage = `\n\n![${file.name}](${data.url})\n\n`;
        onChange(value + mdImage);
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi tải ảnh');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Chèn bảng mẫu 3x3
  const handleInsertTable = () => {
    const tableHtml = `
      <table class="w-full my-4 border-collapse border border-slate-600 rounded-lg overflow-hidden text-sm">
        <thead>
          <tr class="bg-indigo-950/40 text-indigo-300">
            <th class="border border-slate-700 px-3 py-2 text-left font-bold">Cột 1</th>
            <th class="border border-slate-700 px-3 py-2 text-left font-bold">Cột 2</th>
            <th class="border border-slate-700 px-3 py-2 text-left font-bold">Cột 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-slate-700 px-3 py-2">Nội dung 1</td>
            <td class="border border-slate-700 px-3 py-2">Nội dung 2</td>
            <td class="border border-slate-700 px-3 py-2">Nội dung 3</td>
          </tr>
          <tr>
            <td class="border border-slate-700 px-3 py-2">Dữ liệu A</td>
            <td class="border border-slate-700 px-3 py-2">Dữ liệu B</td>
            <td class="border border-slate-700 px-3 py-2">Dữ liệu C</td>
          </tr>
        </tbody>
      </table>
      <p><br></p>
    `;
    executeCmd('insertHTML', tableHtml);
  };

  // Chèn Hộp ghi chú Callout (Tip / Warning / Note)
  const handleInsertCallout = (type: 'tip' | 'warning' | 'note') => {
    let calloutHtml = '';
    if (type === 'tip') {
      calloutHtml = `
        <div class="my-4 p-4 rounded-xl bg-cyan-950/30 border-l-4 border-cyan-500 text-cyan-200 text-sm">
          <p class="font-bold flex items-center gap-1.5 text-cyan-400 mb-1">💡 Mẹo thực chiến (Pro Tip):</p>
          <p>Nhập mẹo hoặc lời khuyên hữu ích của bạn tại đây...</p>
        </div><p><br></p>
      `;
    } else if (type === 'warning') {
      calloutHtml = `
        <div class="my-4 p-4 rounded-xl bg-rose-950/30 border-l-4 border-rose-500 text-rose-200 text-sm">
          <p class="font-bold flex items-center gap-1.5 text-rose-400 mb-1">⚠️ Lưu ý quan trọng:</p>
          <p>Cảnh báo các sai lầm cần tránh hoặc cấu hình bắt buộc tại đây...</p>
        </div><p><br></p>
      `;
    } else {
      calloutHtml = `
        <div class="my-4 p-4 rounded-xl bg-indigo-950/30 border-l-4 border-indigo-500 text-indigo-200 text-sm">
          <p class="font-bold flex items-center gap-1.5 text-indigo-400 mb-1">📌 Ghi chú thêm:</p>
          <p>Thông tin bổ trợ cần người đọc nắm vững...</p>
        </div><p><br></p>
      `;
    }
    executeCmd('insertHTML', calloutHtml);
  };

  // Bảng màu chữ
  const TEXT_COLORS = [
    { name: 'Mặc định', color: 'inherit' },
    { name: 'Xanh tím', color: '#6366f1' },
    { name: 'Cyan ngọc', color: '#06b6d4' },
    { name: 'Lục bảo', color: '#10b981' },
    { name: 'Cam sáng', color: '#f97316' },
    { name: 'Đỏ tươi', color: '#ef4444' },
    { name: 'Vàng hổ phách', color: '#f59e0b' },
    { name: 'Trắng tinh', color: '#ffffff' },
  ];

  // Bút dạ quang Highlight nền
  const HIGHLIGHT_COLORS = [
    { name: 'Không màu', color: 'transparent' },
    { name: 'Dạ quang vàng', color: 'rgba(250, 204, 21, 0.25)' },
    { name: 'Dạ quang xanh ngọc', color: 'rgba(6, 182, 212, 0.25)' },
    { name: 'Dạ quang lục', color: 'rgba(34, 197, 94, 0.25)' },
    { name: 'Dạ quang tím', color: 'rgba(168, 85, 247, 0.25)' },
    { name: 'Dạ quang hồng', color: 'rgba(244, 63, 94, 0.25)' },
  ];

  return (
    <div
      className={`rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-xl overflow-hidden flex flex-col transition-all ${
        isFullScreen ? 'fixed inset-4 z-50 bg-[#0c0d14] border-indigo-500/50 shadow-2xl' : 'relative'
      }`}
    >
      {/* Ẩn input upload ảnh */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* TOP HEADER: 3 Chế độ & Nút Fullscreen */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'visual'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Soạn thảo Trực quan (Word)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'code'
                ? 'bg-indigo-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Mã nguồn (HTML / MD)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'preview'
                ? 'bg-cyan-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem trước Web</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
            {stats.words} từ • {stats.chars} ký tự • ~{stats.readMinutes} phút đọc
          </span>

          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            title={isFullScreen ? 'Thu nhỏ cửa sổ' : 'Phóng to toàn màn hình'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* WORD RIBBON TOOLBAR (Chỉ hiện khi ở tab Visual) */}
      {activeTab === 'visual' && (
        <div className="px-3 py-2 bg-slate-900/95 border-b border-slate-800 flex items-center flex-wrap gap-1 text-slate-300 select-none">
          {/* Format Block (Headings & Paragraph) */}
          <div className="flex items-center mr-1">
            <select
              onChange={(e) => handleFormatBlock(e.target.value)}
              defaultValue="p"
              className="bg-slate-800 text-slate-200 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="p">Văn bản thường (Normal)</option>
              <option value="h1">Tiêu đề lớn 1 (H1)</option>
              <option value="h2">Tiêu đề mục 2 (H2)</option>
              <option value="h3">Tiêu đề con 3 (H3)</option>
            </select>
          </div>

          <div className="h-5 w-[1px] bg-slate-700/80 mx-1" />

          {/* Basic Text Formats */}
          <button
            type="button"
            onClick={() => executeCmd('bold')}
            title="In đậm (Ctrl+B)"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => executeCmd('italic')}
            title="In nghiêng (Ctrl+I)"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => executeCmd('underline')}
            title="Gạch chân (Ctrl+U)"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Underline className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => executeCmd('strikeThrough')}
            title="Gạch ngang"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          {/* Màu chữ (Text Color Dropdown) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setColorPickerOpen(!colorPickerOpen);
                setHighlightPickerOpen(false);
              }}
              title="Màu chữ"
              className="p-1.5 rounded hover:bg-slate-800 hover:text-indigo-400 transition-colors flex items-center gap-0.5"
            >
              <Palette className="w-4 h-4" />
            </button>
            {colorPickerOpen && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 grid grid-cols-4 gap-1.5 w-40">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    onClick={() => {
                      executeCmd('foreColor', c.color);
                      setColorPickerOpen(false);
                    }}
                    className="w-7 h-7 rounded-lg border border-slate-700 flex items-center justify-center hover:scale-110 transition-transform"
                    style={{ backgroundColor: c.color === 'inherit' ? '#334155' : c.color }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Bút dạ quang Highlight nền */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setHighlightPickerOpen(!highlightPickerOpen);
                setColorPickerOpen(false);
              }}
              title="Tô màu nền (Highlight)"
              className="p-1.5 rounded hover:bg-slate-800 hover:text-amber-400 transition-colors"
            >
              <Highlighter className="w-4 h-4" />
            </button>
            {highlightPickerOpen && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 grid grid-cols-3 gap-1.5 w-44">
                {HIGHLIGHT_COLORS.map((h) => (
                  <button
                    key={h.name}
                    type="button"
                    title={h.name}
                    onClick={() => {
                      executeCmd('hiliteColor', h.color);
                      setHighlightPickerOpen(false);
                    }}
                    className="w-8 h-7 rounded border border-slate-700 flex items-center justify-center text-[10px] hover:scale-105 transition-transform"
                    style={{ backgroundColor: h.color }}
                  >
                    {h.name === 'Không màu' ? '✕' : ''}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-5 w-[1px] bg-slate-700/80 mx-1" />

          {/* Alignment */}
          <button
            type="button"
            onClick={() => executeCmd('justifyLeft')}
            title="Căn trái"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('justifyCenter')}
            title="Căn giữa"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('justifyRight')}
            title="Căn phải"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('justifyFull')}
            title="Căn đều hai bên"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <AlignJustify className="w-4 h-4" />
          </button>

          <div className="h-5 w-[1px] bg-slate-700/80 mx-1" />

          {/* Lists & Indent */}
          <button
            type="button"
            onClick={() => executeCmd('insertUnorderedList')}
            title="Danh sách gạch đầu dòng"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('insertOrderedList')}
            title="Danh sách số thứ tự"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('outdent')}
            title="Giảm thụt lề"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Outdent className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('indent')}
            title="Tăng thụt lề"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Indent className="w-4 h-4" />
          </button>

          <div className="h-5 w-[1px] bg-slate-700/80 mx-1" />

          {/* Objects: Image Upload, Link, Table, Callouts */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            title="Tải ảnh từ máy tính chèn vào bài"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 text-xs font-semibold transition"
          >
            {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            <span>Chèn Ảnh</span>
          </button>

          <button
            type="button"
            onClick={handleInsertLink}
            title="Chèn liên kết web"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-cyan-400 transition-colors"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleInsertTable}
            title="Chèn Bảng mẫu (Table 3x3)"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-emerald-400 transition-colors"
          >
            <TableIcon className="w-4 h-4" />
          </button>

          {/* Callouts Dropdown */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => handleInsertCallout('tip')}
              title="Chèn Hộp Mẹo hay (Pro Tip)"
              className="p-1.5 rounded hover:bg-slate-800 text-cyan-400 text-xs font-bold"
            >
              💡Tip
            </button>
            <button
              type="button"
              onClick={() => handleInsertCallout('warning')}
              title="Chèn Hộp Lưu ý quan trọng"
              className="p-1.5 rounded hover:bg-slate-800 text-rose-400 text-xs font-bold"
            >
              ⚠️Lưu ý
            </button>
          </div>

          <button
            type="button"
            onClick={() => executeCmd('insertHorizontalRule')}
            title="Đường phân cách ngang (Divider)"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="h-5 w-[1px] bg-slate-700/80 mx-1" />

          {/* History & Clear */}
          <button
            type="button"
            onClick={() => executeCmd('undo')}
            title="Hoàn tác (Ctrl+Z)"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('redo')}
            title="Làm lại (Ctrl+Y)"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('removeFormat')}
            title="Xóa toàn bộ định dạng được chọn"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-rose-400 transition-colors"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* VÙNG SOẠN THẢO CHÍNH THEO 3 TAB */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/60" style={{ minHeight }}>
        {/* TAB 1: VISUAL WORD EDITOR */}
        {activeTab === 'visual' && (
          <div
            ref={visualEditorRef}
            contentEditable
            onInput={handleVisualInput}
            className="min-h-full max-w-4xl mx-auto p-6 sm:p-10 rounded-xl bg-white dark:bg-[#12131a] text-slate-800 dark:text-slate-100 shadow-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans prose prose-slate dark:prose-invert max-w-none text-base"
            style={{ minHeight: '480px' }}
          />
        )}

        {/* TAB 2: CODE / MARKDOWN EDITOR */}
        {activeTab === 'code' && (
          <div className="h-full flex flex-col">
            <textarea
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                calculateStats(e.target.value);
              }}
              placeholder="Nhập mã nguồn HTML hoặc Markdown..."
              rows={22}
              className="w-full flex-1 p-4 rounded-xl bg-[#090a0f] text-emerald-400 font-mono text-xs sm:text-sm border border-slate-800 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
            />
          </div>
        )}

        {/* TAB 3: LIVE PREVIEW */}
        {activeTab === 'preview' && (
          <div className="max-w-4xl mx-auto p-6 sm:p-10 rounded-xl bg-white dark:bg-[#111116] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-xl">
            <div className="pb-4 mb-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-500 uppercase">
                👁️ Mô phỏng giao diện người đọc thực tế
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {stats.words} từ • {stats.readMinutes} phút đọc
              </span>
            </div>

            {value ? (
              <div
                className="prose prose-slate dark:prose-invert max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: /(?:^|\n)(?:#{1,6}\s|```|\|[\s\S]*\||[\*\-]\s|\d+\.\s)/.test(value) && !value.includes('<p>')
                    ? (marked.parse(value, { breaks: true, gfm: true }) as string)
                    : value,
                }}
              />
            ) : (
              <div className="text-center py-16 text-slate-500 italic">
                Bài viết chưa có nội dung để xem trước...
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER HELPER */}
      <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Giao diện soạn thảo WYSIWYG chuẩn Word: Bôi đen chữ để đổi màu, in đậm hoặc chèn ảnh.</span>
        </div>
        <div className="font-mono text-[11px] text-slate-500">
          Chế độ hiện tại: <span className="text-indigo-400 font-bold uppercase">{activeTab}</span>
        </div>
      </div>
    </div>
  );
}

