'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { marked } from 'marked';
import {
  GraduationCap,
  Plus,
  Search,
  BookOpen,
  Video,
  FileText,
  FileCode,
  Archive,
  Link as LinkIcon,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  UploadCloud,
  FileUp,
  X,
  AlertCircle,
  Sparkles,
  Layers,
  Users,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  Square,
  Paperclip,
  Check,
  RefreshCw,
  FolderPlus,
  PlaySquare,
  HelpCircle,
  Play,
  Circle,
  Folder,
  LayoutTemplate,
  SlidersHorizontal,
  Bold,
  Heading,
  List,
  Code,
  Compass,
  Zap,
  Copy
} from 'lucide-react';

interface LessonResource {
  name: string;
  type: 'json' | 'pdf' | 'doc' | 'link' | 'zip';
  url: string;
  size?: string;
}

interface Lesson {
  id: string;
  course_id?: string;
  module_id?: string;
  title: string;
  duration: string;
  video_url: string;
  custom_url?: string | null;
  summary: string;
  content_markdown: string;
  action_checklist: string[];
  resources: LessonResource[];
  sort_order: number;
  is_free_preview: boolean;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  sort_order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  slug: string;
  pid: string | null;
  title: string;
  headline: string;
  category: string;
  price: number;
  level: string;
  thumbnail: string;
  instructor: string;
  custom_url?: string | null;
  is_published: boolean;
  sort_order: number;
  modules_count?: number;
  lessons_count?: number;
  enrolled_students?: number;
}

interface PublishedPost {
  id: string;
  title: string;
  slug: string;
  category: string;
}

interface Product {
  id: string;
  pid: string;
  name: string;
  slug: string;
  price: number;
}

export default function AdminClassroomPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<PublishedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Selected Course for Detail Editing
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Delivery Mode states for the selected course (Chọn 1 trong 2: Lộ trình Skool vs Link Bài Hướng Dẫn)
  const [deliveryMode, setDeliveryMode] = useState<'skool' | 'custom_url'>('skool');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [isUpdatingDelivery, setIsUpdatingDelivery] = useState(false);

  // Skool-style Workspace States
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [editorTab, setEditorTab] = useState<'content' | 'resources' | 'checklist' | 'settings'>('content');
  const [markdownPreview, setMarkdownPreview] = useState(false);
  const [lessonSearchTerm, setLessonSearchTerm] = useState('');
  const [showVideoPreviewInEditor, setShowVideoPreviewInEditor] = useState(true);
  const [isVideoCollapsed, setIsVideoCollapsed] = useState(false);
  const [copiedPromptIdx, setCopiedPromptIdx] = useState<number | null>(null);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  // Section Refs for smooth scroll & anchors
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const promptsSectionRef = useRef<HTMLDivElement>(null);
  const resourcesSectionRef = useRef<HTMLDivElement>(null);
  const checklistSectionRef = useRef<HTMLDivElement>(null);
  const notesSectionRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to section with highlight
  const scrollToSection = (sectionName: string, ref: React.RefObject<HTMLDivElement | null>) => {
    setHighlightedSection(sectionName);
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      setHighlightedSection(null);
    }, 1800);
  };
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Modals & States
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // File Upload input ref & Admin Stage Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const adminStageRef = useRef<HTMLDivElement>(null);

  // External link form state
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkType, setLinkType] = useState<'link' | 'pdf' | 'doc' | 'zip' | 'json'>('link');

  // New Module form
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [isAddingModule, setIsAddingModule] = useState(false);

  // Course Form
  const [courseForm, setCourseForm] = useState({
    id: '',
    title: '',
    slug: '',
    pid: '',
    headline: '',
    category: 'course',
    price: 0,
    level: 'Thực chiến A-Z',
    thumbnail: '',
    instructor: 'Tự Học AI',
    custom_url: '',
    isPublished: true,
    sortOrder: 1,
  });

  // Action checklist input
  const [newChecklistText, setNewChecklistText] = useState('');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Extract explicit prompt blocks for prominent Quick-Copy cards
  const extractedPrompts = useMemo(() => {
    if (!activeLesson?.content_markdown) return [];
    const regex = /```(?:text|prompt|json)?\s*([\s\S]*?)```/g;
    const matches: { title: string; content: string }[] = [];
    let m;
    let idx = 1;
    while ((m = regex.exec(activeLesson.content_markdown)) !== null) {
      const raw = m[1].trim();
      if (raw.length > 20) {
        const beforeText = activeLesson.content_markdown.slice(0, m.index);
        const headingMatch = beforeText.match(/###?\s*(?:📋|⚡|📸|🎬|🎙️|🏷️)?\s*([^\n#]+)\s*$/);
        const title = headingMatch ? headingMatch[1].trim() : `Prompt / Câu Lệnh Thực Chiến #${idx}`;
        matches.push({ title, content: raw });
        idx++;
      }
    }
    return matches;
  }, [activeLesson]);

  // Direct copy handler for prominent prompt cards
  const handleCopyPromptCard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedPromptIdx(index);
      showToast('✓ Đã sao chép prompt vào bộ nhớ tạm!');
      setTimeout(() => {
        setCopiedPromptIdx(null);
      }, 2200);
    });
  };

  // Helper escape HTML
  const escapeHtml = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Safe Markdown parser with Quick Copy on all code/prompt blocks
  const renderMarkdown = (content: string) => {
    if (!content) return '';
    try {
      const renderer = new marked.Renderer();
      renderer.code = function ({ text, lang }) {
        const escapedText = encodeURIComponent(text);
        const displayLang = (lang || 'PROMPT / CODE').toUpperCase();
        return `
<div class="code-box my-4 rounded-xl overflow-hidden border-2 border-slate-700/80 bg-[#0d1117] text-slate-100 shadow-md">
  <div class="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs sm:text-sm font-mono">
    <span class="text-amber-400 font-extrabold flex items-center gap-1.5">
      <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
      ⚡ ${displayLang}
    </span>
    <button
      type="button"
      data-code="${escapedText}"
      class="copy-code-btn px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
    >
      <span>📋 Sao Chép Lệnh</span>
    </button>
  </div>
  <pre class="p-4 sm:p-5 overflow-x-auto text-[13.5px] sm:text-sm font-mono leading-relaxed text-slate-200 select-all whitespace-pre-wrap break-words"><code>${escapeHtml(text)}</code></pre>
</div>`;
      };
      return marked.parse(content, { renderer, breaks: true, gfm: true }) as string;
    } catch {
      return content.replace(/\n/g, '<br/>');
    }
  };

  // Handle click to copy inside Markdown
  const handleMarkdownClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest('.copy-code-btn') as HTMLButtonElement | null;
    if (!target) return;
    const code = target.getAttribute('data-code');
    if (!code) return;
    const decoded = decodeURIComponent(code);
    navigator.clipboard.writeText(decoded).then(() => {
      const originalText = target.innerHTML;
      target.innerHTML = '<span>✓ Đã sao chép!</span>';
      target.classList.remove('bg-indigo-600', 'hover:bg-indigo-500');
      target.classList.add('bg-emerald-600', 'hover:bg-emerald-500');
      showToast('Đã sao chép prompt / câu lệnh!');
      setTimeout(() => {
        target.innerHTML = originalText;
        target.classList.remove('bg-emerald-600', 'hover:bg-emerald-500');
        target.classList.add('bg-indigo-600', 'hover:bg-indigo-500');
      }, 2200);
    });
  };

  // Load Courses
  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/classroom');
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses || []);
        setProducts(data.products || []);
        setPosts(data.posts || []);
      } else {
        showToast(data.error || 'Lỗi tải danh sách khóa học', 'error');
      }
    } catch {
      showToast('Không thể kết nối máy chủ', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // Load Course Detail
  const openCourseDetail = async (course: Course) => {
    setSelectedCourse(course);
    setDeliveryMode(course.custom_url ? 'custom_url' : 'skool');
    setCustomUrlInput(course.custom_url || '');
    setLoadingDetail(true);
    setActiveLesson(null);
    setIsEditingLesson(false);
    try {
      const res = await fetch(`/api/admin/classroom/${course.id}`);
      const data = await res.json();
      if (data.success) {
        const loadedModules: Module[] = data.modules || [];
        setModules(loadedModules);

        // Expand all modules by default
        const exp: Record<string, boolean> = {};
        loadedModules.forEach((m) => {
          exp[m.id] = true;
        });
        setExpandedModules(exp);

        if (loadedModules.length > 0) {
          const modWithLesson = loadedModules.find((m) => m.lessons && m.lessons.length > 0) || loadedModules[0];
          setActiveModuleId(modWithLesson.id);
          if (modWithLesson.lessons && modWithLesson.lessons.length > 0) {
            setActiveLesson(modWithLesson.lessons[0]);
          }
        }
      } else {
        showToast(data.error || 'Lỗi tải chi tiết khóa học', 'error');
      }
    } catch {
      showToast('Lỗi kết nối khi tải chi tiết', 'error');
    } finally {
      setLoadingDetail(false);
    }
  };

  // Helper: Format YouTube Embed
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/') || url.includes('youtube-nocookie.com/embed/')) return url;
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
    }
    return url;
  };

  // Helper: Format file icon
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-500" />;
      case 'zip':
      case 'rar':
        return <Archive className="w-4 h-4 text-amber-500" />;
      case 'json':
        return <FileCode className="w-4 h-4 text-emerald-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-4 h-4 text-blue-500" />;
      default:
        return <LinkIcon className="w-4 h-4 text-indigo-500" />;
    }
  };

  // Save Course (Create / Edit)
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = courseForm.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/classroom', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseForm),
      });
      const data = await res.json();
      if (data.success) {
        showToast(courseForm.id ? 'Đã cập nhật khóa học' : 'Đã tạo khóa học mới');
        setIsCourseModalOpen(false);
        loadCourses();
        if (selectedCourse && selectedCourse.id === courseForm.id) {
          setSelectedCourse({ ...selectedCourse, ...courseForm });
        }
      } else {
        showToast(data.error || 'Lỗi lưu khóa học', 'error');
      }
    } catch {
      showToast('Lỗi khi gửi yêu cầu', 'error');
    }
  };

  // Delete Course
  const handleDeleteCourse = async (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${title}"? Toàn bộ chương và bài học sẽ bị xóa vĩnh viễn.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/classroom?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Đã xóa khóa học thành công');
        if (selectedCourse?.id === id) {
          setSelectedCourse(null);
        }
        loadCourses();
      } else {
        showToast(data.error || 'Lỗi xóa khóa học', 'error');
      }
    } catch {
      showToast('Lỗi kết nối khi xóa', 'error');
    }
  };

  // Handle Save Delivery Mode (Chọn 1 trong 2: Lộ trình Skool vs Link Bài Hướng Dẫn)
  const handleSaveDeliveryMode = async (mode: 'skool' | 'custom_url', forcedUrl?: string) => {
    if (!selectedCourse) return;
    setIsUpdatingDelivery(true);
    try {
      const finalUrl = mode === 'custom_url' ? (forcedUrl !== undefined ? forcedUrl : customUrlInput).trim() : null;
      if (mode === 'custom_url' && !finalUrl) {
        showToast('Vui lòng chọn hoặc nhập đường dẫn bài hướng dẫn', 'error');
        setIsUpdatingDelivery(false);
        return;
      }

      const payload = {
        id: selectedCourse.id,
        slug: selectedCourse.slug,
        pid: selectedCourse.pid,
        title: selectedCourse.title,
        headline: selectedCourse.headline,
        category: selectedCourse.category,
        price: selectedCourse.price,
        level: selectedCourse.level,
        thumbnail: selectedCourse.thumbnail,
        instructor: selectedCourse.instructor,
        custom_url: finalUrl,
        isPublished: selectedCourse.is_published,
        sortOrder: selectedCourse.sort_order,
      };

      const res = await fetch('/api/admin/classroom', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        const updatedCourse = { ...selectedCourse, custom_url: finalUrl };
        setSelectedCourse(updatedCourse);
        setCourses((prev) => prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
        setDeliveryMode(mode);
        if (mode === 'skool') {
          setCustomUrlInput('');
          showToast('✓ Đã chuyển sang: Hình thức 1 (Học từng phần theo lộ trình Skool)');
        } else {
          setCustomUrlInput(finalUrl || '');
          showToast('✓ Đã lưu: Hình thức 2 (Chèn Link bài hướng dẫn trực tiếp)!');
        }
      } else {
        showToast(data.error || 'Lỗi khi cập nhật hình thức học', 'error');
      }
    } catch {
      showToast('Lỗi kết nối khi cập nhật hình thức học', 'error');
    } finally {
      setIsUpdatingDelivery(false);
    }
  };

  // Add Module
  const handleAddModule = async () => {
    if (!newModuleTitle.trim() || !selectedCourse) return;
    try {
      const res = await fetch('/api/admin/classroom/module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourse.id,
          title: newModuleTitle.trim(),
          sortOrder: modules.length + 1,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Đã tạo chương mới');
        setNewModuleTitle('');
        setIsAddingModule(false);
        openCourseDetail(selectedCourse);
      } else {
        showToast(data.error || 'Lỗi thêm chương', 'error');
      }
    } catch {
      showToast('Lỗi kết nối khi thêm chương', 'error');
    }
  };

  // Delete Module
  const handleDeleteModule = async (moduleId: string, title: string) => {
    if (!window.confirm(`Xóa chương "${title}" và toàn bộ bài học bên trong?`)) return;
    try {
      const res = await fetch(`/api/admin/classroom/module?id=${moduleId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Đã xóa chương');
        if (activeModuleId === moduleId) {
          setActiveLesson(null);
          setActiveModuleId(null);
        }
        if (selectedCourse) openCourseDetail(selectedCourse);
      } else {
        showToast(data.error || 'Lỗi xóa chương', 'error');
      }
    } catch {
      showToast('Lỗi kết nối khi xóa', 'error');
    }
  };

  // Create New Lesson in Module
  const handleCreateNewLesson = (moduleId: string) => {
    setActiveModuleId(moduleId);
    const newLesson: Lesson = {
      id: '',
      course_id: selectedCourse?.id,
      module_id: moduleId,
      title: 'Bài học mới chưa đặt tên',
      duration: '10:00',
      video_url: '',
      summary: '',
      content_markdown: '### Mục tiêu bài học:\n- Hướng dẫn thực hành từng bước.\n- Hoàn thành checklist bên dưới.',
      action_checklist: ['Xem hết video bài giảng', 'Thực hành theo hướng dẫn'],
      resources: [],
      sort_order: 1,
      is_free_preview: false,
    };
    setActiveLesson(newLesson);
    setIsEditingLesson(true);
    setEditorTab('content');
  };

  // Save Lesson
  const handleSaveLesson = async () => {
    if (!activeLesson || !selectedCourse || !activeModuleId) return;
    if (!activeLesson.title.trim()) {
      showToast('Vui lòng nhập tiêu đề bài học', 'error');
      return;
    }

    try {
      setIsSavingLesson(true);
      const res = await fetch('/api/admin/classroom/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeLesson.id || undefined,
          courseId: selectedCourse.id,
          moduleId: activeModuleId,
          title: activeLesson.title,
          duration: activeLesson.duration,
          videoUrl: activeLesson.video_url,
          summary: activeLesson.summary,
          contentMarkdown: activeLesson.content_markdown,
          actionChecklist: activeLesson.action_checklist,
          resources: activeLesson.resources,
          sortOrder: activeLesson.sort_order,
          isFreePreview: activeLesson.is_free_preview,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Đã lưu bài học & tài liệu thành công!');
        setIsEditingLesson(false);
        openCourseDetail(selectedCourse);
      } else {
        showToast(data.error || 'Lỗi lưu bài học', 'error');
      }
    } catch {
      showToast('Lỗi kết nối máy chủ', 'error');
    } finally {
      setIsSavingLesson(false);
    }
  };

  // Delete Lesson
  const handleDeleteLesson = async (lessonId: string, title: string) => {
    if (!lessonId) {
      setActiveLesson(null);
      setIsEditingLesson(false);
      return;
    }
    if (!window.confirm(`Bạn có chắc muốn xóa bài học "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/classroom/lesson?id=${lessonId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Đã xóa bài học');
        setActiveLesson(null);
        setIsEditingLesson(false);
        if (selectedCourse) openCourseDetail(selectedCourse);
      } else {
        showToast(data.error || 'Lỗi xóa bài học', 'error');
      }
    } catch {
      showToast('Lỗi kết nối khi xóa', 'error');
    }
  };

  // Upload Material File from Computer
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeLesson) return;

    if (file.size > 50 * 1024 * 1024) {
      showToast('Tệp quá lớn. Giới hạn tối đa là 50MB', 'error');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/classroom/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        const newResource: LessonResource = {
          name: data.name,
          type: data.type as any,
          url: data.url,
          size: data.size,
        };

        setActiveLesson({
          ...activeLesson,
          resources: [...(activeLesson.resources || []), newResource],
        });
        showToast(`Đã tải lên tệp: ${data.name}`);
      } else {
        showToast(data.error || 'Lỗi tải lên tệp', 'error');
      }
    } catch {
      showToast('Lỗi kết nối khi tải tệp', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Add External Link (Google Drive, Github, Dropbox...)
  const handleAddExternalLink = () => {
    if (!linkName.trim() || !linkUrl.trim() || !activeLesson) {
      showToast('Vui lòng nhập tên tài liệu và đường dẫn liên kết', 'error');
      return;
    }

    const newResource: LessonResource = {
      name: linkName.trim(),
      type: linkType,
      url: linkUrl.trim(),
    };

    setActiveLesson({
      ...activeLesson,
      resources: [...(activeLesson.resources || []), newResource],
    });

    setLinkName('');
    setLinkUrl('');
    setShowAddLinkForm(false);
    showToast('Đã thêm liên kết tài nguyên');
  };

  // Remove Resource
  const handleRemoveResource = (index: number) => {
    if (!activeLesson) return;
    const updated = [...activeLesson.resources];
    updated.splice(index, 1);
    setActiveLesson({ ...activeLesson, resources: updated });
    showToast('Đã xóa tài liệu đính kèm');
  };

  // Add Action Checklist Item
  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim() || !activeLesson) return;
    setActiveLesson({
      ...activeLesson,
      action_checklist: [...(activeLesson.action_checklist || []), newChecklistText.trim()],
    });
    setNewChecklistText('');
  };

  // Remove Action Checklist Item
  const handleRemoveChecklistItem = (index: number) => {
    if (!activeLesson) return;
    const updated = [...activeLesson.action_checklist];
    updated.splice(index, 1);
    setActiveLesson({ ...activeLesson, action_checklist: updated });
  };

  // Insert markdown shortcut
  const insertMarkdown = (prefix: string, suffix: string = '') => {
    if (!activeLesson) return;
    const current = activeLesson.content_markdown || '';
    setActiveLesson({
      ...activeLesson,
      content_markdown: `${current}\n${prefix}Nội dung${suffix}\n`,
    });
  };

  // Open Edit Course Modal
  const openEditCourseModal = (course?: Course) => {
    if (course) {
      setCourseForm({
        id: course.id,
        title: course.title,
        slug: course.slug,
        pid: course.pid || '',
        headline: course.headline || '',
        category: course.category || 'course',
        price: course.price || 0,
        level: course.level || 'Thực chiến A-Z',
        thumbnail: course.thumbnail || '',
        instructor: course.instructor || 'Tự Học AI',
        custom_url: course.custom_url || '',
        isPublished: course.is_published,
        sortOrder: course.sort_order || 1,
      });
    } else {
      setCourseForm({
        id: '',
        title: '',
        slug: '',
        pid: '',
        headline: '',
        category: 'course',
        price: 0,
        level: 'Thực chiến A-Z',
        thumbnail: '',
        instructor: 'Tự Học AI',
        custom_url: '',
        isPublished: true,
        sortOrder: courses.length + 1,
      });
    }
    setIsCourseModalOpen(true);
  };

  // Filter courses for View 1
  const filteredCourses = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.pid && c.pid.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  // Flat list of lessons for Navigation (Skool Previous / Next)
  const allCourseLessons = modules.flatMap((m, mIdx) =>
    (m.lessons || []).map((l, lIdx) => ({
      ...l,
      moduleId: m.id,
      moduleTitle: m.title,
      moduleIndex: mIdx + 1,
      lessonIndex: lIdx + 1,
    }))
  );

  const currentLessonIdx = allCourseLessons.findIndex((l) => l.id === activeLesson?.id);
  const prevLesson = currentLessonIdx > 0 ? allCourseLessons[currentLessonIdx - 1] : null;
  const nextLesson = currentLessonIdx >= 0 && currentLessonIdx < allCourseLessons.length - 1 ? allCourseLessons[currentLessonIdx + 1] : null;

  const currentModule = modules.find((m) => m.id === (activeLesson?.module_id || activeModuleId));

  const toggleModuleAccordion = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold transition-all border animate-in slide-in-from-bottom-5 ${
            toast.type === 'success'
              ? 'bg-emerald-950/95 text-emerald-200 border-emerald-500/40 shadow-emerald-950/50'
              : 'bg-rose-950/95 text-rose-200 border-rose-500/40 shadow-rose-950/50'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* VIEW 1: DANH SÁCH KHÓA HỌC (NẾU CHƯA CHỌN KHÓA NÀO) */}
      {!selectedCourse ? (
        <>
          {/* Header & Stats Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#121216] p-6 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 mb-2">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>HỆ THỐNG CLASSROOM TỰ HỌC AI</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Quản Trị Khu Vực Học Tập
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Quản lý toàn bộ lộ trình khóa học, bài giảng video, kịch bản thực hành và tài liệu đính kèm (PDF, JSON, DOC, ZIP...).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => openEditCourseModal()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo Khóa Học Mới</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/[0.08]">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Tổng Khóa Học</span>
                <BookOpen className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{courses.length}</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/[0.08]">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Bài Giảng Video</span>
                <Video className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {courses.reduce((acc, c) => acc + (c.lessons_count || 0), 0)}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/[0.08]">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Lượt Học Viên</span>
                <Users className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {courses.reduce((acc, c) => acc + (c.enrolled_students || 0), 0)}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/[0.08]">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Trạng Thái Live</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-emerald-500">100% Sẵn Sàng</div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#121216] p-3 rounded-2xl border border-slate-200 dark:border-white/[0.08]">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm khóa học theo tên, slug, PID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {['ALL', 'workflow', 'skill', 'prompt', 'course'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {cat === 'ALL' ? 'Tất cả' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          {loading ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-semibold">Đang tải dữ liệu khóa học...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="py-20 text-center bg-white dark:bg-[#121216] rounded-2xl border border-slate-200 dark:border-white/[0.08]">
              <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
              <p className="text-base font-bold text-slate-700 dark:text-slate-300">Không tìm thấy khóa học nào</p>
              <p className="text-xs text-slate-500 mt-1">Thử đổi từ khóa tìm kiếm hoặc bấm nút "Tạo Khóa Học Mới"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCourses.map((c) => (
                <div
                  key={c.id}
                  className="bg-white dark:bg-[#121216] rounded-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden hover:border-indigo-500/50 hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="aspect-video relative bg-slate-900 overflow-hidden">
                      <img
                        src={c.thumbnail || '/sites/tuhocai-top/landing/video-vip/ket-qua-video.jpg'}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/70 backdrop-blur-md text-amber-300 border border-amber-300/30 uppercase">
                          {c.pid || 'FREE'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600/90 text-white uppercase">
                          {c.category}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg text-[11px] font-mono font-bold bg-black/80 backdrop-blur-md text-white">
                        {c.price === 0 ? 'Miễn Phí 0Đ' : `${new Intl.NumberFormat('vi-VN').format(c.price)}đ`}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2.5">
                      <h3 className="font-black text-base text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-500 transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {c.headline || 'Khóa học thực chiến kỹ năng AI và quy trình tự động hóa.'}
                      </p>

                      <div className="flex items-center gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <div className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{c.modules_count || 0} chương</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Video className="w-3.5 h-3.5 text-purple-500" />
                          <span>{c.lessons_count || 0} bài</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{c.enrolled_students || 0} học viên</span>
                        </div>
                      </div>

                      {/* Custom URL status indicator */}
                      {c.custom_url ? (
                        <div className="mt-2.5 p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 min-w-0 text-amber-900 dark:text-amber-300 font-bold">
                            <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span className="truncate">Bài viết: {c.custom_url}</span>
                          </div>
                          <a
                            href={c.custom_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 ml-1 p-1 rounded hover:bg-amber-200 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-300"
                            title="Mở bài viết"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ) : (
                        <div className="mt-2.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] text-[10.5px] text-slate-500 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="truncate">Phòng học Skool: /dashboard/hoc/{c.slug}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between gap-2">
                    <button
                      onClick={() => openCourseDetail(c)}
                      className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Quản Lý Bài Học</span>
                    </button>

                    <button
                      onClick={() => openEditCourseModal(c)}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs transition-colors cursor-pointer"
                      title="Cài đặt khóa học"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <Link
                      href={c.custom_url || `/dashboard/hoc/${c.slug}`}
                      target="_blank"
                      className={`p-2 rounded-lg text-xs transition-colors ${
                        c.custom_url
                          ? 'bg-amber-100 dark:bg-amber-500/20 hover:bg-amber-200 dark:hover:bg-amber-500/30 text-amber-900 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                      title={c.custom_url ? `Xem bài viết (${c.custom_url})` : "Xem phòng học học viên"}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleDeleteCourse(c.id, c.title)}
                      className="p-2 rounded-lg bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs transition-colors cursor-pointer"
                      title="Xóa khóa học"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* VIEW 2: KHÔNG GIAN CLASSROOM CHUẨN SKOOL.COM */
        <div className="space-y-5">
          {/* Top Breadcrumb & Actions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#121216] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer shrink-0"
                title="Quay lại danh sách khóa học"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Khu Vực Học Tập Skool
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {selectedCourse.pid || '0Đ FREE'}
                  </span>
                  <span className="text-xs text-slate-400">
                    · {modules.length} Chương · {allCourseLessons.length} Bài giảng
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate">
                  {selectedCourse.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <Link
                href={selectedCourse.custom_url || `/dashboard/hoc/${selectedCourse.slug}`}
                target="_blank"
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  selectedCourse.custom_url
                    ? 'border-2 border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300'
                    : 'border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {selectedCourse.custom_url ? (
                  <>
                    <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Mở Xem Bài Hướng Dẫn</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>Xem Phòng Học Học Viên (Skool)</span>
                  </>
                )}
                <ExternalLink className="w-3 h-3 opacity-70 ml-0.5" />
              </Link>
              <button
                onClick={() => openEditCourseModal(selectedCourse)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Cài Đặt Khóa</span>
              </button>
            </div>
          </div>

          {/* DELIVERY MODE CONTROL PANEL - BỘ CHUYỂN ĐỔI CHỌN 1 TRONG 2 HÌNH THỨC HỌC TẬP */}
          <div className="bg-white dark:bg-[#121216] rounded-2xl border-2 border-slate-200 dark:border-white/[0.08] p-5 sm:p-6 shadow-sm space-y-5">
            {/* Top Bar of Delivery Mode */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/[0.05]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                  <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                    Hình Thức Hiển Thị Khóa Học Cho Học Viên (Chọn 1 trong 2)
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Cấu hình cách học viên tiếp cận nội dung khi mua thành công hoặc bấm vào khóa học trong &ldquo;Kho Của Tôi&rdquo;.
                </p>
              </div>

              {/* Status Badge */}
              <div className="shrink-0">
                {selectedCourse.custom_url ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-black shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Đang áp dụng: Link Bài Hướng Dẫn
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-400 text-xs font-black shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Đang áp dụng: Lộ Trình Skool Từng Phần
                  </span>
                )}
              </div>
            </div>

            {/* 2 Big Interactive Choice Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Học từng phần theo lộ trình Skool */}
              <div
                onClick={() => {
                  if (selectedCourse.custom_url) {
                    if (window.confirm('Bạn có muốn chuyển khóa học này về "Hình thức 1: Học từng phần theo lộ trình Skool"? Đường dẫn bài hướng dẫn trực tiếp sẽ được gỡ bỏ.')) {
                      handleSaveDeliveryMode('skool');
                    }
                  } else {
                    setDeliveryMode('skool');
                  }
                }}
                className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer text-left select-none ${
                  !selectedCourse.custom_url
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30 shadow-md shadow-indigo-600/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      !selectedCourse.custom_url
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      1
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-indigo-500" />
                        Học Từng Phần Theo Lộ Trình (Skool View)
                      </h3>
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                        {modules.length} Chương · {allCourseLessons.length} Bài giảng video & tài liệu
                      </span>
                    </div>
                  </div>

                  {!selectedCourse.custom_url && (
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm shrink-0">
                      Đang Dùng
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-11">
                  Học viên học theo từng chương, xem video bài giảng, sao chép prompt và hoàn thành checklist bài học. Thích hợp cho khóa học quy mô lớn.
                </p>

                {selectedCourse.custom_url && (
                  <div className="mt-3.5 pl-11">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                      👉 Bấm vào đây để chuyển sang hình thức học từng phần
                    </span>
                  </div>
                )}
              </div>

              {/* Option 2: Chèn Link bài hướng dẫn trực tiếp */}
              <div
                onClick={() => {
                  setDeliveryMode('custom_url');
                }}
                className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer text-left select-none ${
                  selectedCourse.custom_url || deliveryMode === 'custom_url'
                    ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 shadow-md shadow-amber-500/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      selectedCourse.custom_url || deliveryMode === 'custom_url'
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-black'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      2
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-amber-500" />
                        Chèn Link Bài Hướng Dẫn Trực Tiếp
                      </h3>
                      <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        Khách mua thành công xem ngay bài hướng dẫn
                      </span>
                    </div>
                  </div>

                  {selectedCourse.custom_url ? (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm shrink-0">
                      Đang Dùng
                    </span>
                  ) : deliveryMode === 'custom_url' ? (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-wider shrink-0">
                      Đang Thiết Lập
                    </span>
                  ) : null}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-11">
                  Khi khách hàng mua thành công hoặc mở trong &ldquo;Kho Của Tôi&rdquo;, hệ thống sẽ dẫn thẳng đến bài hướng dẫn thực hành chuyên sâu (nội bộ hoặc ngoài).
                </p>

                {!selectedCourse.custom_url && deliveryMode !== 'custom_url' && (
                  <div className="mt-3.5 pl-11">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
                      👉 Bấm vào đây để chèn link bài hướng dẫn
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* PANEL CẤU HÌNH LINK BÀI HƯỚNG DẪN */}
            {(deliveryMode === 'custom_url' || selectedCourse.custom_url) && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/[0.04] dark:bg-amber-500/[0.08] border-2 border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-wide">
                      Cấu Hình Link Bài Hướng Dẫn Cho Khóa Học Này
                    </span>
                  </div>
                  {selectedCourse.custom_url && (
                    <a
                      href={selectedCourse.custom_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-500/20 hover:bg-amber-200 dark:hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-bold transition-all shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Mở Thử Bài Hướng Dẫn Đang Áp Dụng</span>
                    </a>
                  )}
                </div>

                {/* Dropdown chọn nhanh bài viết */}
                {posts && posts.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span>📚 Cách 1: Chọn nhanh từ danh sách bài viết có sẵn trên Tự Học AI:</span>
                    </label>
                    <select
                      value={customUrlInput.startsWith('/bai-viet/') ? customUrlInput : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          setCustomUrlInput(e.target.value);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                    >
                      <option value="">-- Bấm vào đây để chọn bài viết có sẵn trên website --</option>
                      {posts.map((p) => (
                        <option key={p.id} value={`/bai-viet/${p.slug}`}>
                          [{p.category}] {p.title} (/bai-viet/{p.slug})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Input URL tùy chỉnh */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span>🔗 Cách 2: Hoặc gõ / dán link bài hướng dẫn bất kỳ (Nội bộ hoặc link ngoài):</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        placeholder="Ví dụ: /bai-viet/quy-trinh-tao-video-ai-trieu-view-tu-1-anh hoặc https://docs.google.com/..."
                        className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm font-mono bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                      />
                      <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      {customUrlInput && (
                        <button
                          type="button"
                          onClick={() => setCustomUrlInput('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold cursor-pointer"
                          title="Xóa link"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {customUrlInput && (
                      <a
                        href={customUrlInput}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold shrink-0 transition-colors"
                        title="Mở xem trước link này"
                      >
                        <ExternalLink className="w-4 h-4 text-amber-500" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isUpdatingDelivery || !customUrlInput.trim()}
                      onClick={() => handleSaveDeliveryMode('custom_url')}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-black text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    >
                      {isUpdatingDelivery ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>Lưu Cấu Hình Link Bài Hướng Dẫn</span>
                    </button>

                    {selectedCourse.custom_url && (
                      <button
                        type="button"
                        disabled={isUpdatingDelivery}
                        onClick={() => {
                          if (window.confirm('Bạn có chắc muốn hủy link bài hướng dẫn để quay lại Lộ trình học Skool?')) {
                            handleSaveDeliveryMode('skool');
                          }
                        }}
                        className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Hủy Link &amp; Về Lộ Trình Skool
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                    💡 Link này sẽ tự động thay thế nút vào học khi khách thanh toán thành công và trong &ldquo;Kho Của Tôi&rdquo;.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* MAIN 2-COLUMN SKOOL CLASSROOM LAYOUT */}
          {loadingDetail ? (
            <div className="py-24 text-center bg-white dark:bg-[#121216] rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm">
              <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-500">Đang tải cấu trúc chương, bài học và tài liệu...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              {/* CỘT CHÍNH (RIGHT - 8 COLS TRÊN DESKTOP): KHÔNG GIAN BÀI HỌC SKOOL */}
              <div ref={adminStageRef} className="order-1 lg:order-2 lg:col-span-8 space-y-6 scroll-mt-36">
                {activeLesson ? (
                  <div className="bg-white dark:bg-[#121216] rounded-2xl border border-slate-200 dark:border-white/[0.08] p-5 sm:p-7 shadow-sm space-y-6">

                    {/* TOP ACTION BAR CHUẨN SKOOL (SWITCH GIỮA XEM VÀ SỬA) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/[0.05]">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsEditingLesson(false)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            !isEditingLesson
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Giao Diện Học (Skool View)</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsEditingLesson(true);
                            setEditorTab('content');
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isEditingLesson
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Chỉnh Sửa Bài Này</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {currentModule && (
                          <button
                            onClick={() => handleCreateNewLesson(currentModule.id)}
                            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-indigo-500" />
                            <span>+ Thêm Bài Mới</span>
                          </button>
                        )}

                        {activeLesson.id && (
                          <button
                            onClick={() => handleDeleteLesson(activeLesson.id, activeLesson.title)}
                            className="px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Xóa bài học này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Xóa</span>
                          </button>
                        )}

                        {isEditingLesson && (
                          <button
                            onClick={handleSaveLesson}
                            disabled={isSavingLesson}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-600/25 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                          >
                            {isSavingLesson ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Save className="w-3.5 h-3.5" />
                            )}
                            <span>Lưu Bài Học</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* ======================================================== */}
                    {/* CHẾ ĐỘ 1: SKOOL CLASSROOM VIEW (XEM BÀI HỌC TRỰC QUAN)     */}
                    {/* ======================================================== */}
                    {!isEditingLesson ? (
                      <div className="space-y-6">
                        {/* ======================================================== */}
                        {/* PHẦN ĐẦU: TIÊU ĐỀ + TÓM TẮT ĐIỂM CỐT LÕI               */}
                        {/* ======================================================== */}
                        <div className="p-5 sm:p-6 border-2 border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#111116] shadow-sm space-y-4">
                          {/* Tiêu đề & Metadata */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                  {currentModule?.title || 'Chương học'}
                                </span>
                                <span className="text-slate-300 dark:text-slate-700">·</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1 font-bold">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>{activeLesson.duration || '10:00'}</span>
                                </span>
                                {activeLesson.is_free_preview && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                                    Học thử 0đ
                                  </span>
                                )}
                              </div>
                              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                                {activeLesson.title}
                              </h2>
                            </div>

                            {/* Nút hành động sửa nhanh */}
                            <button
                              onClick={() => {
                                setIsEditingLesson(true);
                                setEditorTab('content');
                              }}
                              className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Chỉnh Sửa Bài Này</span>
                            </button>
                          </div>

                          {/* Tóm tắt bài học (Callout màu hổ phách) */}
                          {activeLesson.summary && (
                            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-500/[0.05] border-2 border-amber-300 dark:border-amber-500/25 text-[14.5px] sm:text-base text-amber-950 dark:text-amber-100 leading-relaxed flex items-start gap-3.5">
                              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              <div>
                                <strong className="block text-amber-900 dark:text-amber-300 font-black mb-1 text-sm sm:text-[15px]">
                                  Điểm Cốt Lõi Của Bài Học:
                                </strong>
                                <span>{activeLesson.summary}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* ======================================================== */}
                        {/* THANH ĐIỀU HƯỚNG 1 CHẠM CỐ ĐỊNH (STICKY QUICK JUMP SUB-NAV) */}
                        {/* ======================================================== */}
                        <div className="sticky top-20 z-20 px-3.5 py-2.5 rounded-2xl bg-white/95 dark:bg-[#111116]/95 backdrop-blur-md border-2 border-slate-200/90 dark:border-white/10 shadow-md shadow-slate-900/5 transition-all">
                          <div className="flex items-center justify-between gap-3 overflow-hidden">
                            <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-1 min-w-0">
                              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5 pl-1">
                                <Compass className="w-3.5 h-3.5 text-indigo-500" />
                                Chuyển đến:
                              </span>

                              {activeLesson.video_url && (
                                <button
                                  onClick={() => scrollToSection('video', videoSectionRef)}
                                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
                                    highlightedSection === 'video'
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400'
                                      : 'bg-slate-100 dark:bg-white/[0.05] hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                                  }`}
                                >
                                  <Video className="w-3 h-3 text-indigo-500" />
                                  <span>1. Video Bài Giảng</span>
                                </button>
                              )}

                              {extractedPrompts.length > 0 && (
                                <button
                                  onClick={() => scrollToSection('prompts', promptsSectionRef)}
                                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
                                    highlightedSection === 'prompts'
                                      ? 'bg-amber-500 text-black border-amber-500 shadow-md ring-2 ring-amber-300'
                                      : 'bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-500/20'
                                  }`}
                                >
                                  <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                                  <span>2. Lấy Prompt ({extractedPrompts.length})</span>
                                </button>
                              )}

                              {activeLesson.resources && activeLesson.resources.length > 0 && (
                                <button
                                  onClick={() => scrollToSection('resources', resourcesSectionRef)}
                                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
                                    highlightedSection === 'resources'
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400'
                                      : 'bg-slate-100 dark:bg-white/[0.05] hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                                  }`}
                                >
                                  <Paperclip className="w-3 h-3 text-indigo-500" />
                                  <span>3. Tải File ({activeLesson.resources.length})</span>
                                </button>
                              )}

                              {activeLesson.action_checklist && activeLesson.action_checklist.length > 0 && (
                                <button
                                  onClick={() => scrollToSection('checklist', checklistSectionRef)}
                                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
                                    highlightedSection === 'checklist'
                                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400'
                                      : 'bg-slate-100 dark:bg-white/[0.05] hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                                  }`}
                                >
                                  <CheckSquare className="w-3 h-3 text-emerald-500" />
                                  <span>4. Checklist ({activeLesson.action_checklist.length})</span>
                                </button>
                              )}

                              <button
                                onClick={() => scrollToSection('notes', notesSectionRef)}
                                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
                                  highlightedSection === 'notes'
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400'
                                    : 'bg-slate-100 dark:bg-white/[0.05] hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                                }`}
                              >
                                <FileText className="w-3 h-3 text-indigo-500" />
                                <span>5. Ghi Chú</span>
                              </button>
                            </div>

                            {/* Nút Nhảy Về Đầu Bài Nhanh */}
                            <button
                              onClick={() => {
                                if (adminStageRef.current) {
                                  adminStageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }}
                              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-white/[0.05] transition-colors cursor-pointer shrink-0 border border-slate-200 dark:border-white/10"
                              title="Cuộn về đầu bài học"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                              <span>Đầu bài</span>
                            </button>
                          </div>
                        </div>

                        {/* ======================================================== */}
                        {/* MỤC 1: VIDEO BÀI GIẢNG (ĐỘC LẬP - CÓ NÚT THU GỌN / MỞ RỘNG) */}
                        {/* ======================================================== */}
                        <div
                          ref={videoSectionRef}
                          id="section-video"
                          className={`rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#111116] shadow-sm scroll-mt-36 transition-all duration-300 ${
                            highlightedSection === 'video' ? 'ring-4 ring-indigo-500/80 shadow-indigo-500/30' : ''
                          }`}
                        >
                          {/* Header Mục Video */}
                          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/30 border-b border-slate-100 dark:border-white/[0.06]">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-cyan-400">
                                <Video className="w-4 h-4" />
                              </div>
                              <div>
                                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                                  Mục 1: Video Bài Giảng Thực Hành
                                </h3>
                                <p className="text-[11px] text-slate-500">
                                  {activeLesson.duration ? `Thời lượng video: ${activeLesson.duration}` : 'Xem hướng dẫn từng bước'}
                                </p>
                              </div>
                            </div>

                            {activeLesson.video_url && (
                              <button
                                onClick={() => setIsVideoCollapsed(!isVideoCollapsed)}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                {isVideoCollapsed ? (
                                  <>
                                    <Eye className="w-3.5 h-3.5 text-indigo-500" />
                                    <span>Mở Video</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Thu Gọn</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          {/* Khung phát Video 16:9 */}
                          {!isVideoCollapsed ? (
                            <div className="bg-black relative aspect-video">
                              {activeLesson.video_url ? (
                                <iframe
                                  src={getEmbedUrl(activeLesson.video_url)}
                                  title={activeLesson.title}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="w-full h-full border-0"
                                />
                              ) : (
                                <div className="p-8 text-center space-y-2 py-12">
                                  <Video className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
                                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                    Bài học này chưa gắn link Video
                                  </h4>
                                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                    Bấm nút <strong className="text-indigo-600">"Chỉnh Sửa Bài Này"</strong> ở góc trên để dán đường dẫn YouTube hoặc Drive.
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div
                              onClick={() => setIsVideoCollapsed(false)}
                              className="p-6 text-center bg-slate-50/50 dark:bg-black/20 hover:bg-indigo-50/30 transition-colors cursor-pointer border-t border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400"
                            >
                              <Play className="w-4 h-4 fill-indigo-600 dark:fill-indigo-400" />
                              <span>Video đang được thu gọn. Bấm vào đây để mở lại khung xem video</span>
                            </div>
                          )}
                        </div>

                        {/* ======================================================== */}
                        {/* MỤC 2: BỘ PROMPT & CÂU LỆNH SAO CHÉP NHANH (1-CLICK COPY)  */}
                        {/* ======================================================== */}
                        {extractedPrompts.length > 0 && (
                          <div
                            ref={promptsSectionRef}
                            id="section-prompts"
                            className={`p-5 rounded-2xl bg-amber-500/[0.04] dark:bg-amber-500/[0.03] border-2 border-amber-300 dark:border-amber-500/30 space-y-4 scroll-mt-36 transition-all duration-300 ${
                              highlightedSection === 'prompts' ? 'ring-4 ring-amber-400 shadow-lg shadow-amber-500/20' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400">
                                  <Zap className="w-4 h-4 fill-amber-500" />
                                </div>
                                <div>
                                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                                    Mục 2: Bộ Prompt & Câu Lệnh Dùng Ngay ({extractedPrompts.length})
                                  </h3>
                                  <p className="text-[11px] text-slate-500">
                                    Sao chép 1 chạm để dán trực tiếp vào Claude, Midjourney hoặc CapCut
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              {extractedPrompts.map((p, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-white dark:bg-black/40 overflow-hidden shadow-sm"
                                >
                                  <div className="px-4 py-2 bg-amber-50/80 dark:bg-amber-500/[0.08] border-b border-amber-100 dark:border-amber-500/10 flex items-center justify-between gap-3">
                                    <span className="text-xs font-bold text-amber-950 dark:text-amber-200 truncate flex items-center gap-1.5">
                                      <span>⚡</span>
                                      <span>{p.title}</span>
                                    </span>
                                    <button
                                      onClick={() => handleCopyPromptCard(p.content, pIdx)}
                                      className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-black text-[11px] font-extrabold flex items-center gap-1 transition-all active:scale-95 shadow-sm cursor-pointer shrink-0"
                                    >
                                      {copiedPromptIdx === pIdx ? (
                                        <>
                                          <Check className="w-3 h-3 text-black" />
                                          <span>✓ Đã sao chép!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3 h-3 text-black" />
                                          <span>Sao chép</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <pre className="p-4 sm:p-5 text-[13.5px] sm:text-sm font-mono leading-relaxed text-slate-900 dark:text-slate-100 whitespace-pre-wrap break-words select-all max-h-72 overflow-y-auto">
                                    {p.content}
                                  </pre>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ======================================================== */}
                        {/* MỤC 3: TÀI LIỆU & FILE ĐÍNH KÈM (SKOOL ATTACHMENTS BOX)   */}
                        {/* ======================================================== */}
                        <div
                          ref={resourcesSectionRef}
                          id="section-resources"
                          className={`p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-500/[0.03] border-2 border-indigo-200/80 dark:border-indigo-500/20 space-y-3.5 scroll-mt-36 transition-all duration-300 ${
                            highlightedSection === 'resources' ? 'ring-4 ring-indigo-500/80 shadow-indigo-500/30' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider font-mono">
                              <UploadCloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              <span>Mục 3: Tài Liệu & Tệp Đính Kèm ({activeLesson.resources?.length || 0})</span>
                            </h3>
                            <button
                              onClick={() => {
                                setIsEditingLesson(true);
                                setEditorTab('resources');
                              }}
                              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              + Thêm / Tải Tài Liệu
                            </button>
                          </div>

                          {activeLesson.resources && activeLesson.resources.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {activeLesson.resources.map((res, rIdx) => (
                                <div
                                  key={rIdx}
                                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-sm hover:border-indigo-500/50 transition-colors"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-slate-800 shrink-0">
                                      {getResourceIcon(res.type)}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                                        {res.name}
                                      </p>
                                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                        <span className="uppercase text-indigo-600 dark:text-indigo-400 font-bold">{res.type}</span>
                                        {res.size && <span> · {res.size}</span>}
                                      </p>
                                    </div>
                                  </div>

                                  <a
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 transition-colors"
                                  >
                                    Tải Về
                                  </a>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">Chưa có tài liệu đính kèm cho bài học này.</p>
                          )}
                        </div>

                        {/* ======================================================== */}
                        {/* MỤC 4: CHECKLIST HÀNH ĐỘNG THỰC CHIẾN                    */}
                        {/* ======================================================== */}
                        {activeLesson.action_checklist && activeLesson.action_checklist.length > 0 && (
                          <div
                            ref={checklistSectionRef}
                            id="section-checklist"
                            className={`p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border-2 border-slate-200 dark:border-white/[0.06] space-y-3 scroll-mt-36 transition-all duration-300 ${
                              highlightedSection === 'checklist' ? 'ring-4 ring-emerald-500/80 shadow-emerald-500/30' : ''
                            }`}
                          >
                            <h3 className="font-extrabold text-sm sm:text-base uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2 font-mono">
                              <CheckSquare className="w-4 h-4 text-emerald-500" />
                              <span>Mục 4: Checklist Hành Động Cần Hoàn Thành ({activeLesson.action_checklist.length})</span>
                            </h3>
                            <div className="space-y-2">
                              {activeLesson.action_checklist.map((task, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
                                >
                                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                  <span>{task}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ======================================================== */}
                        {/* MỤC 5: NỘI DUNG BÀI HỌC (MARKDOWN DỄ ĐỌC CÓ NÚT COPY LỆNH) */}
                        {/* ======================================================== */}
                        <div
                          ref={notesSectionRef}
                          id="section-notes"
                          className={`space-y-3 pt-2 scroll-mt-36 transition-all duration-300 ${
                            highlightedSection === 'notes' ? 'ring-4 ring-indigo-500/80 p-2 rounded-2xl shadow-indigo-500/30' : ''
                          }`}
                        >
                          <h3 className="font-extrabold text-sm sm:text-base uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                            Mục 5: Ghi Chú & Kịch Bản Hướng Dẫn
                          </h3>
                          <div
                            onClick={handleMarkdownClick}
                            className="prose dark:prose-invert max-w-none text-[15.5px] sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed p-6 sm:p-8 rounded-2xl bg-slate-50/70 dark:bg-black/30 border-2 border-slate-200 dark:border-white/[0.06]"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(activeLesson.content_markdown) }}
                          />
                        </div>

                        {/* 6. SKOOL NAVIGATION (BÀI TRƯỚC / BÀI TIẾP THEO) */}
                        <div className="pt-6 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between gap-3 text-xs">
                          {prevLesson ? (
                            <button
                              onClick={() => {
                                setActiveLesson(prevLesson);
                                setActiveModuleId(prevLesson.moduleId);
                              }}
                              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <ArrowLeft className="w-4 h-4" />
                              <span>Bài Trước: {prevLesson.title}</span>
                            </button>
                          ) : <div />}

                          {nextLesson && (
                            <button
                              onClick={() => {
                                setActiveLesson(nextLesson);
                                setActiveModuleId(nextLesson.moduleId);
                              }}
                              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-600/20"
                            >
                              <span>Bài Tiếp: {nextLesson.title}</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
) : (
                      /* ======================================================== */
                      /* CHẾ ĐỘ 2: SKOOL LESSON EDITOR WORKSPACE (3 TABS RÕ RÀNG)   */
                      /* ======================================================== */
                      <div className="space-y-6 animate-in fade-in duration-200">
                        {/* 3 TABS HEADER */}
                        <div className="flex border-b border-slate-200 dark:border-white/10 gap-1">
                          <button
                            onClick={() => setEditorTab('content')}
                            className={`py-2.5 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                              editorTab === 'content'
                                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black'
                                : 'border-transparent text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>1. Video & Nội Dung</span>
                          </button>

                          <button
                            onClick={() => setEditorTab('resources')}
                            className={`py-2.5 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                              editorTab === 'resources'
                                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black'
                                : 'border-transparent text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>2. Tài Liệu Đính Kèm ({activeLesson.resources?.length || 0})</span>
                          </button>

                          <button
                            onClick={() => setEditorTab('checklist')}
                            className={`py-2.5 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                              editorTab === 'checklist'
                                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black'
                                : 'border-transparent text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            <CheckSquare className="w-3.5 h-3.5" />
                            <span>3. Checklist & Cài Đặt</span>
                          </button>
                        </div>

                        {/* TAB 1: VIDEO & NỘI DUNG BÀI GIẢNG */}
                        {editorTab === 'content' && (
                          <div className="space-y-5">
                            {/* Tiêu đề & Thời lượng & Học thử */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                              <div className="sm:col-span-8">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                                  Tiêu đề bài học: <span className="text-rose-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={activeLesson.title}
                                  onChange={(e) => setActiveLesson({ ...activeLesson, title: e.target.value })}
                                  placeholder="Ví dụ: 1.1 Tổng quan quy trình 5 bước sản xuất video AI 1 ảnh"
                                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                                  Thời lượng:
                                </label>
                                <input
                                  type="text"
                                  value={activeLesson.duration}
                                  onChange={(e) => setActiveLesson({ ...activeLesson, duration: e.target.value })}
                                  placeholder="10:45"
                                  className="w-full px-3 py-2.5 text-sm font-mono text-center bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                />
                              </div>

                              <div className="sm:col-span-2 flex flex-col justify-end">
                                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={activeLesson.is_free_preview}
                                    onChange={(e) => setActiveLesson({ ...activeLesson, is_free_preview: e.target.checked })}
                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                                    Xem thử 0đ
                                  </span>
                                </label>
                              </div>
                            </div>

                            {/* Video URL & Toggle Xem Trước Thu Gọn */}
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                  <Video className="w-3.5 h-3.5 text-indigo-500" />
                                  <span>Đường dẫn Video bài giảng (YouTube / Google Drive / MP4):</span>
                                </label>
                                {activeLesson.video_url && (
                                  <button
                                    type="button"
                                    onClick={() => setShowVideoPreviewInEditor(!showVideoPreviewInEditor)}
                                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                                  >
                                    {showVideoPreviewInEditor ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                    <span>{showVideoPreviewInEditor ? 'Ẩn xem thử video' : 'Bật xem thử video'}</span>
                                  </button>
                                )}
                              </div>

                              <input
                                type="text"
                                value={activeLesson.video_url}
                                onChange={(e) => setActiveLesson({ ...activeLesson, video_url: e.target.value })}
                                placeholder="https://www.youtube.com/watch?v=KOAKDMxpPxI"
                                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                              />

                              {/* Collapsible Video Preview (Không chiếm màn hình nếu không bật) */}
                              {showVideoPreviewInEditor && activeLesson.video_url && (
                                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 aspect-video max-w-md bg-black shadow-md mt-2">
                                  <iframe
                                    src={getEmbedUrl(activeLesson.video_url)}
                                    title="Video Preview"
                                    allowFullScreen
                                    className="w-full h-full"
                                  />
                                </div>
                              )}
                            </div>

                            {/* Tóm tắt bài học */}
                            <div>
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                                Tóm tắt ngắn gọn bài học (Summary):
                              </label>
                              <textarea
                                rows={2}
                                value={activeLesson.summary}
                                onChange={(e) => setActiveLesson({ ...activeLesson, summary: e.target.value })}
                                placeholder="Nắm vững quy trình kết nối API, tạo node trigger và xử lý dữ liệu..."
                                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                              />
                            </div>

                            {/* Markdown Editor với Toolbar & Tab Xem Trước */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                                  <span>Nội dung bài giảng chi tiết (Markdown):</span>
                                </label>

                                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px]">
                                  <button
                                    type="button"
                                    onClick={() => setMarkdownPreview(false)}
                                    className={`px-2.5 py-1 rounded font-bold transition-all ${
                                      !markdownPreview ? 'bg-white dark:bg-black text-indigo-600 shadow-sm' : 'text-slate-500'
                                    }`}
                                  >
                                    Soạn thảo
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setMarkdownPreview(true)}
                                    className={`px-2.5 py-1 rounded font-bold transition-all ${
                                      markdownPreview ? 'bg-white dark:bg-black text-indigo-600 shadow-sm' : 'text-slate-500'
                                    }`}
                                  >
                                    Xem trước (Preview)
                                  </button>
                                </div>
                              </div>

                              {/* Formatting Shortcut Toolbar */}
                              {!markdownPreview && (
                                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/[0.04] rounded-lg border border-slate-200 dark:border-slate-800 flex-wrap">
                                  <button
                                    type="button"
                                    onClick={() => insertMarkdown('### ')}
                                    className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1"
                                    title="Chèn tiêu đề H3"
                                  >
                                    <Heading className="w-3.5 h-3.5" />
                                    <span>H3</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => insertMarkdown('**', '**')}
                                    className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                                    title="In đậm"
                                  >
                                    <Bold className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => insertMarkdown('- ')}
                                    className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                                    title="Danh sách gạch đầu dòng"
                                  >
                                    <List className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => insertMarkdown('```text\n', '\n```')}
                                    className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1"
                                    title="Khung code block"
                                  >
                                    <Code className="w-3.5 h-3.5" />
                                    <span>Code</span>
                                  </button>
                                </div>
                              )}

                              {!markdownPreview ? (
                                <textarea
                                  rows={8}
                                  value={activeLesson.content_markdown}
                                  onChange={(e) => setActiveLesson({ ...activeLesson, content_markdown: e.target.value })}
                                  placeholder="### Mục tiêu bài học:&#10;- Bước 1: Chuẩn bị...&#10;- Bước 2: Cài đặt..."
                                  className="w-full px-3.5 py-3 text-xs sm:text-sm font-mono bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                                />
                              ) : (
                                <div
                                  className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed p-4 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 min-h-[160px]"
                                  dangerouslySetInnerHTML={{ __html: renderMarkdown(activeLesson.content_markdown) }}
                                />
                              )}
                            </div>
                          </div>
                        )}

                        {/* TAB 2: TÀI LIỆU ĐÍNH KÈM & UPLOADER */}
                        {editorTab === 'resources' && (
                          <div className="space-y-5">
                            {/* Header uploader */}
                            <div className="p-5 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 bg-indigo-50/40 dark:bg-indigo-500/[0.03] space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                  <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                    <UploadCloud className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    <span>Tải Lên Tệp Tài Liệu Cho Bài Học</span>
                                  </h4>
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    Hỗ trợ file PDF, ZIP, RAR, DOCX, JSON, TXT... lên đến 50MB hoặc link Google Drive.
                                  </p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    accept=".pdf,.zip,.rar,.doc,.docx,.xlsx,.xls,.pptx,.txt,.json,.md,.png,.jpg"
                                  />
                                  <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                                  >
                                    <FileUp className="w-3.5 h-3.5" />
                                    <span>{isUploading ? 'Đang tải tệp lên...' : 'Tải File Từ Máy Tính'}</span>
                                  </button>

                                  <button
                                    onClick={() => setShowAddLinkForm(!showAddLinkForm)}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-300 dark:border-indigo-500/30 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all cursor-pointer"
                                  >
                                    <LinkIcon className="w-3.5 h-3.5" />
                                    <span>+ Thêm Link Drive</span>
                                  </button>
                                </div>
                              </div>

                              {/* Form thêm link ngoài */}
                              {showAddLinkForm && (
                                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                                    <div className="sm:col-span-5">
                                      <input
                                        type="text"
                                        placeholder="Tên tài liệu (VD: Kho Video Mẫu Drive)"
                                        value={linkName}
                                        onChange={(e) => setLinkName(e.target.value)}
                                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                      />
                                    </div>
                                    <div className="sm:col-span-5">
                                      <input
                                        type="text"
                                        placeholder="https://drive.google.com/..."
                                        value={linkUrl}
                                        onChange={(e) => setLinkUrl(e.target.value)}
                                        className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                      />
                                    </div>
                                    <div className="sm:col-span-2">
                                      <select
                                        value={linkType}
                                        onChange={(e: any) => setLinkType(e.target.value)}
                                        className="w-full px-2 py-2 text-xs bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                      >
                                        <option value="link">Link</option>
                                        <option value="pdf">PDF</option>
                                        <option value="zip">ZIP</option>
                                        <option value="doc">DOC</option>
                                        <option value="json">JSON</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={handleAddExternalLink}
                                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                                    >
                                      Đính Kèm Tài Liệu
                                    </button>
                                    <button
                                      onClick={() => setShowAddLinkForm(false)}
                                      className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs"
                                    >
                                      Hủy
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Danh sách tệp đang đính kèm */}
                            <div className="space-y-2.5">
                              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 font-mono">
                                Danh Sách Tệp Đã Đính Kèm ({activeLesson.resources?.length || 0})
                              </h5>

                              {activeLesson.resources && activeLesson.resources.length > 0 ? (
                                <div className="space-y-2">
                                  {activeLesson.resources.map((res, rIdx) => (
                                    <div
                                      key={rIdx}
                                      className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-sm hover:border-indigo-500/40 transition-colors"
                                    >
                                      <div className="flex items-center gap-3 min-w-0">
                                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-slate-800 shrink-0">
                                          {getResourceIcon(res.type)}
                                        </div>
                                        <div className="min-w-0">
                                          <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                                            {res.name}
                                          </p>
                                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                            <span className="uppercase text-indigo-600 dark:text-indigo-400 font-bold">{res.type}</span>
                                            {res.size && <span> · {res.size}</span>}
                                            <span className="truncate max-w-[200px] text-slate-400"> · {res.url}</span>
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <a
                                          href={res.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-xs transition-colors"
                                          title="Tải thử / Mở liên kết"
                                        >
                                          <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                        <button
                                          onClick={() => handleRemoveResource(rIdx)}
                                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-slate-400 hover:text-rose-500 text-xs transition-colors cursor-pointer"
                                          title="Xóa tài liệu"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8 border border-dashed border-slate-200 dark:border-white/10 rounded-xl">
                                  <FileUp className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                                  <p className="text-xs text-slate-500 font-medium">Chưa có tài liệu đính kèm cho bài học này.</p>
                                  <p className="text-[11px] text-slate-400 mt-0.5">Bấm nút "Tải File Từ Máy Tính" để tải file hoặc đính kèm link Drive.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* TAB 3: CHECKLIST & CÀI ĐẶT */}
                        {editorTab === 'checklist' && (
                          <div className="space-y-6">
                            {/* Checklist Đầu Việc */}
                            <div className="p-5 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50/60 dark:bg-black/20 space-y-3">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                  <CheckSquare className="w-4 h-4 text-emerald-500" />
                                  <span>Checklist Đầu Việc Học Viên Cần Hoàn Thành:</span>
                                </label>
                                <span className="text-[11px] text-slate-400">
                                  {activeLesson.action_checklist?.length || 0} mục
                                </span>
                              </div>

                              <div className="space-y-1.5">
                                {activeLesson.action_checklist && activeLesson.action_checklist.length > 0 ? (
                                  activeLesson.action_checklist.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                        <span className="text-slate-800 dark:text-slate-200">{item}</span>
                                      </div>
                                      <button
                                        onClick={() => handleRemoveChecklistItem(idx)}
                                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-slate-400 italic">Chưa có checklist hành động.</p>
                                )}
                              </div>

                              <div className="flex items-center gap-2 pt-1">
                                <input
                                  type="text"
                                  placeholder="Thêm việc cần làm (VD: Tải file template mẫu về máy)..."
                                  value={newChecklistText}
                                  onChange={(e) => setNewChecklistText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddChecklistItem();
                                    }
                                  }}
                                  className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                />
                                <button
                                  onClick={handleAddChecklistItem}
                                  className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold"
                                >
                                  + Thêm Mục
                                </button>
                              </div>
                            </div>

                            {/* Cài đặt chương học & thứ tự */}
                            <div className="p-5 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50/60 dark:bg-black/20 space-y-4">
                              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
                                <span>Cài Đặt Vị Trí Bài Học</span>
                              </h5>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                                    Thuộc Chương Học (Module):
                                  </label>
                                  <select
                                    value={activeModuleId || ''}
                                    onChange={(e) => setActiveModuleId(e.target.value)}
                                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                  >
                                    {modules.map((m) => (
                                      <option key={m.id} value={m.id}>
                                        {m.title}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                                    Thứ tự sắp xếp bài:
                                  </label>
                                  <input
                                    type="number"
                                    value={activeLesson.sort_order}
                                    onChange={(e) => setActiveLesson({ ...activeLesson, sort_order: Number(e.target.value) })}
                                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white dark:bg-[#121216] rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm">
                    <PlaySquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
                      Chọn một bài học từ danh sách bên phải
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Hoặc bấm nút [+] ở một chương học bên phải để tạo bài học mới, nhập video bài giảng và upload tài liệu.
                    </p>
                  </div>
                )}
              </div>

              {/* ======================================================== */}
              {/* CỘT TRÁI (SIDEBAR - 4 COLS TRÊN DESKTOP): LỘ TRÌNH KHÓA HỌC */}
              {/* ======================================================== */}
              <div className="order-2 lg:order-1 lg:col-span-4 space-y-4 sticky top-20 z-20">
                <div className="bg-white dark:bg-[#121216] rounded-2xl border border-slate-200 dark:border-white/[0.08] p-4 space-y-3.5 shadow-sm">
                  {/* Header Sidebar */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/[0.05]">
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
                      <BookOpen className="w-4 h-4 text-indigo-500" />
                      <span>Lộ Trình Khóa Học</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                      {allCourseLessons.length} bài
                    </span>
                  </div>

                  {/* Search lessons input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tìm bài học..."
                      value={lessonSearchTerm}
                      onChange={(e) => setLessonSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Module List Accordion (Skool Style) */}
                  <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                    {modules.map((mod, modIdx) => {
                      const modLessons = (mod.lessons || []).filter((l) =>
                        !lessonSearchTerm ||
                        l.title.toLowerCase().includes(lessonSearchTerm.toLowerCase()) ||
                        (l.summary && l.summary.toLowerCase().includes(lessonSearchTerm.toLowerCase()))
                      );

                      const isExpanded = expandedModules[mod.id] !== false;

                      return (
                        <div
                          key={mod.id}
                          className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50/50 dark:bg-black/20 overflow-hidden"
                        >
                          {/* Module Header (Click to Toggle Accordion) */}
                          <div className="p-3 bg-slate-100/70 dark:bg-white/[0.03] flex items-center justify-between gap-2 cursor-pointer select-none">
                            <div
                              onClick={() => toggleModuleAccordion(mod.id)}
                              className="flex items-center gap-2 min-w-0 flex-1"
                            >
                              <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[10px] font-black flex items-center justify-center shrink-0">
                                {modIdx + 1}
                              </span>
                              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 line-clamp-1">
                                {mod.title}
                              </h4>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleCreateNewLesson(mod.id)}
                                className="p-1 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                                title="Thêm bài học vào chương này"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteModule(mod.id, mod.title)}
                                className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 transition-colors"
                                title="Xóa chương này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => toggleModuleAccordion(mod.id)}
                                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Lessons inside Module (Skool Layout: Full 2-line title, No truncation!) */}
                          {isExpanded && (
                            <div className="p-1.5 space-y-1">
                              {modLessons.length > 0 ? (
                                modLessons.map((lesson) => {
                                  const isActive = activeLesson?.id === lesson.id;
                                  return (
                                    <div
                                      key={lesson.id}
                                      onClick={() => {
                                        setActiveModuleId(mod.id);
                                        setActiveLesson(lesson);
                                        setIsEditingLesson(false);
                                        setTimeout(() => {
                                          adminStageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }, 50);
                                      }}
                                      className={`p-2.5 rounded-lg flex items-start gap-2.5 text-xs transition-all cursor-pointer ${
                                        isActive
                                          ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                                          : 'hover:bg-slate-200/60 dark:hover:bg-white/[0.04] text-slate-700 dark:text-slate-300'
                                      }`}
                                    >
                                      {/* Play or Video icon */}
                                      <div className="mt-0.5 shrink-0">
                                        {isActive ? (
                                          <Play className="w-3.5 h-3.5 text-white fill-white" />
                                        ) : (
                                          <Circle className="w-3.5 h-3.5 text-slate-400" />
                                        )}
                                      </div>

                                      {/* Full 2-line Title (No ellipsis cut!) */}
                                      <div className="flex-1 min-w-0 space-y-1">
                                        <p className="line-clamp-2 leading-snug">
                                          {lesson.title}
                                        </p>
                                        <div className="flex items-center gap-2 text-[10px] font-mono">
                                          <span className={isActive ? 'text-indigo-200' : 'text-slate-400'}>
                                            {lesson.duration || '10:00'}
                                          </span>
                                          {lesson.resources && lesson.resources.length > 0 && (
                                            <span className={`flex items-center gap-0.5 px-1 rounded ${
                                              isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                                            }`}>
                                              <Paperclip className="w-2.5 h-2.5" />
                                              <span>{lesson.resources.length}</span>
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <p className="text-[11px] text-slate-400 italic p-2 text-center">
                                  Chưa có bài học nào. Bấm [+] để thêm bài.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Add New Module Button / Form */}
                  {isAddingModule ? (
                    <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-500/5 space-y-2">
                      <input
                        type="text"
                        placeholder="VD: Phần 4: Chiến Lược Chuyển Đổi..."
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-black/50 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        autoFocus
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleAddModule}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                        >
                          Lưu Chương
                        </button>
                        <button
                          onClick={() => setIsAddingModule(false)}
                          className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddingModule(true)}
                      className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 dark:border-white/10 hover:border-indigo-500 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FolderPlus className="w-4 h-4" />
                      <span>+ Thêm Chương Học (Module) Mới</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* MODAL: TẠO / SỬA KHÓA HỌC */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 p-6 text-slate-900 dark:text-white shadow-2xl space-y-5">
            <button
              onClick={() => setIsCourseModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-black">
                {courseForm.id ? 'Cài Đặt Khóa Học' : 'Tạo Khóa Học Mới'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Điền thông tin và liên kết mã sản phẩm (PID) để tự động mở khóa học viên khi mua hàng.
              </p>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold block">Tên khóa học:</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="VD: Khóa Học & Quy Trình Làm Video AI Bán Hàng Triệu View"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold block">Đường dẫn Slug (URL):</label>
                  <input
                    type="text"
                    required
                    value={courseForm.slug}
                    onChange={(e) => setCourseForm({ ...courseForm, slug: e.target.value })}
                    placeholder="VD: video-ai-tu-1-anh"
                    className="w-full px-3.5 py-2 text-sm font-mono bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold block">Liên kết Mã Sản Phẩm (PID):</label>
                  <select
                    value={courseForm.pid}
                    onChange={(e) => setCourseForm({ ...courseForm, pid: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-xl"
                  >
                    <option value="">-- Khóa học miễn phí (0Đ) --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.pid}>
                        [{p.pid}] {p.name} ({new Intl.NumberFormat('vi-VN').format(p.price)}đ)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold block">Mô tả ngắn gọn (Headline):</label>
                <textarea
                  rows={2}
                  value={courseForm.headline}
                  onChange={(e) => setCourseForm({ ...courseForm, headline: e.target.value })}
                  placeholder="Xây dựng chuỗi video ngắn chuyển đổi cao không cần lộ mặt..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold block">Học phí (VNĐ):</label>
                  <input
                    type="number"
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold block">Phân loại:</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-xl"
                  >
                    <option value="course">Khóa học (Course)</option>
                    <option value="workflow">Workflow n8n</option>
                    <option value="skill">Kỹ năng AI (Skill)</option>
                    <option value="prompt">Prompt Pack VIP</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold block">Cấp độ:</label>
                  <input
                    type="text"
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    placeholder="Thực chiến A-Z"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold block">Ảnh Thumbnail (URL):</label>
                <input
                  type="text"
                  value={courseForm.thumbnail}
                  onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                  placeholder="/sites/tuhocai-top/landing/video-vip/ket-qua-video.jpg"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              {/* CẤU HÌNH ĐƯỜNG DẪN BÀI HƯỚNG DẪN TÙY CHỌN */}
              <div className="space-y-2 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-500/10 border-2 border-amber-200 dark:border-amber-500/30">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-amber-950 dark:text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                    <LinkIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    Hình Thức Học: Link Bài Viết Hướng Dẫn Trực Tiếp (Tùy chọn)
                  </label>
                  {courseForm.custom_url && (
                    <a
                      href={courseForm.custom_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>Mở xem thử</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <p className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  💡 <strong>Chế độ Bài Hướng Dẫn Trực Tiếp:</strong> Điền đường dẫn bài viết hướng dẫn chuyên sâu (VD: <code className="text-amber-700 dark:text-amber-400">/bai-viet/quy-trinh-tao-video-ai-trieu-view-tu-1-anh-tinh-tiktok-reels</code>). Khi học viên thanh toán thành công hoặc bấm vào khóa học trên Dashboard, hệ thống sẽ tự động chuyển hướng đến bài viết này thay vì vào phòng học Skool. Để trống nếu muốn dùng phòng học Skool mặc định.
                </p>

                {posts.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      ⚡ Chọn nhanh bài viết hướng dẫn có sẵn:
                    </span>
                    <select
                      value={courseForm.custom_url}
                      onChange={(e) => setCourseForm({ ...courseForm, custom_url: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-black/40 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    >
                      <option value="">-- Lộ trình học Skool từng phần (/dashboard/hoc/{courseForm.slug || '...'}) --</option>
                      {posts.map((p) => (
                        <option key={p.id} value={`/bai-viet/${p.slug}`}>
                          📄 [{p.category}] {p.title} (/bai-viet/{p.slug})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Hoặc nhập link trực tiếp (Nội bộ hoặc Bên ngoài):
                  </span>
                  <input
                    type="text"
                    value={courseForm.custom_url}
                    onChange={(e) => setCourseForm({ ...courseForm, custom_url: e.target.value })}
                    placeholder="/bai-viet/ten-bai-viet hoặc https://..."
                    className="w-full px-3.5 py-2 text-xs font-mono bg-white dark:bg-black/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="coursePublished"
                  checked={courseForm.isPublished}
                  onChange={(e) => setCourseForm({ ...courseForm, isPublished: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="coursePublished" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Phát hành khóa học (Hiển thị ngay cho học viên trên trang /dashboard)
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
                >
                  Lưu Khóa Học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
