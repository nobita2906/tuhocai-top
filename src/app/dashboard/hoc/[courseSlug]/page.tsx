'use client';

import React, { useState, useEffect, use, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { marked } from 'marked';
import ReferralShareCard from '@/components/ReferralShareCard';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Play,
  Lock,
  Download,
  FileCode,
  FileText,
  Link as LinkIcon,
  Archive,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckSquare,
  Square,
  MessageCircle,
  ExternalLink,
  Search,
  Clock,
  Paperclip,
  Check,
  Zap,
  Copy,
  Terminal,
  Code,
  Share2,
  Compass,
  Video,
  Eye,
  EyeOff,
} from 'lucide-react';

interface LessonResource {
  name: string;
  type: 'json' | 'pdf' | 'doc' | 'link' | 'zip';
  url: string;
  size?: string;
}

interface Lesson {
  id: string;
  module_id?: string;
  title: string;
  duration: string;
  videoUrl: string;
  summary: string;
  contentMarkdown: string;
  actionChecklist: string[];
  resources: LessonResource[];
  sortOrder: number;
  isFreePreview?: boolean;
  isCompleted?: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseDetail {
  slug: string;
  pid: string;
  title: string;
  headline: string;
  category: string;
  price: number;
  level: string;
  thumbnail: string;
  instructor: string;
  customUrl?: string | null;
  isUnlocked: boolean;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  modules: Module[];
}

// Helper escape HTML
const escapeHtml = (str: string) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Helper format Video embed URL (YouTube / Direct)
const formatEmbedUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('youtube.com/embed/') || url.includes('youtube-nocookie.com/embed/')) return url;
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
  }
  return url;
};

export default function CourseLearningRoomPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = use(params);
  const router = useRouter();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [completedChecklist, setCompletedChecklist] = useState<Record<string, boolean>>({});
  const [lessonSearchTerm, setLessonSearchTerm] = useState('');
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const [copiedPromptIdx, setCopiedPromptIdx] = useState<number | null>(null);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const [isVideoCollapsed, setIsVideoCollapsed] = useState(false);

  // Section Refs for Smooth Scrolling
  const lessonStageRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const promptsSectionRef = useRef<HTMLDivElement>(null);
  const resourcesSectionRef = useRef<HTMLDivElement>(null);
  const checklistSectionRef = useRef<HTMLDivElement>(null);
  const notesSectionRef = useRef<HTMLDivElement>(null);

  // Load course details
  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await fetch(`/api/dashboard/classroom/${courseSlug}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          router.push('/dashboard');
          return;
        }

        const cr = data.course as CourseDetail;
        setCourse(cr);

        // Expand all modules by default
        const exp: Record<string, boolean> = {};
        cr.modules.forEach((m) => {
          exp[m.id] = true;
        });
        setExpandedModules(exp);

        // Find first uncompleted lesson, or the first lesson
        const all = cr.modules.flatMap((m) => m.lessons);
        const firstUncompleted = all.find((l) => !l.isCompleted);
        const initial = firstUncompleted || all[0] || null;
        setActiveLesson(initial);
      } catch (e) {
        console.error('Failed to load course:', e);
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [courseSlug, router]);

  // Load saved checklist state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`tuhocai_checklist_${courseSlug}`);
      if (saved) {
        setCompletedChecklist(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, [courseSlug]);

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  // Smooth scroll to a target section inside the lesson
  const scrollToSection = (sectionId: string, ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setHighlightedSection(sectionId);
      setTimeout(() => {
        setHighlightedSection(null);
      }, 1500);
    }
  };

  // Smooth scroll to lesson stage when clicking sidebar item
  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setHighlightedSection('stage');

    setTimeout(() => {
      if (lessonStageRef.current) {
        lessonStageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);

    setTimeout(() => {
      setHighlightedSection(null);
    }, 1200);
  };

  const handleToggleComplete = async () => {
    if (!course || !activeLesson || updatingProgress) return;

    setUpdatingProgress(true);
    const newStatus = !activeLesson.isCompleted;

    try {
      const res = await fetch('/api/dashboard/classroom/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseSlug: course.slug,
          lessonId: activeLesson.id,
          completed: newStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local state
        setCourse((prev) => {
          if (!prev) return null;
          const updatedModules = prev.modules.map((m) => ({
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === activeLesson.id ? { ...l, isCompleted: newStatus } : l
            ),
          }));

          return {
            ...prev,
            completedLessons: data.completedLessons,
            progressPercent: data.progressPercent,
            modules: updatedModules,
          };
        });

        setActiveLesson((prev) => (prev ? { ...prev, isCompleted: newStatus } : null));

        // Auto advance to next lesson if marking as complete
        if (newStatus) {
          const all = course.modules.flatMap((m) => m.lessons);
          const currentIndex = all.findIndex((l) => l.id === activeLesson.id);
          if (currentIndex !== -1 && currentIndex < all.length - 1) {
            setTimeout(() => {
              handleSelectLesson(all[currentIndex + 1]);
            }, 600);
          }
        }
      }
    } catch (err) {
      console.error('Error toggling complete:', err);
    } finally {
      setUpdatingProgress(false);
    }
  };

  const toggleChecklistItem = (itemIndex: number) => {
    if (!activeLesson) return;
    const key = `${activeLesson.id}-${itemIndex}`;
    setCompletedChecklist((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(`tuhocai_checklist_${courseSlug}`, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Safe markdown render with Quick Copy Button for every code block
  const renderMarkdownWithCopy = (md: string) => {
    if (!md) return '<p class="text-slate-400 italic">Chưa có nội dung hướng dẫn chi tiết cho bài học này.</p>';
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

      return marked.parse(md, { renderer, breaks: true, gfm: true }) as string;
    } catch {
      return md.replace(/\n/g, '<br/>');
    }
  };

  // Event delegation for copy buttons inside Markdown
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
      setCopyToast('✓ Đã sao chép prompt / câu lệnh vào bộ nhớ tạm!');
      setTimeout(() => {
        target.innerHTML = originalText;
        target.classList.remove('bg-emerald-600', 'hover:bg-emerald-500');
        target.classList.add('bg-indigo-600', 'hover:bg-indigo-500');
        setCopyToast(null);
      }, 2200);
    });
  };

  // Resource Icon helper
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'json':
        return <FileCode className="w-4 h-4 text-amber-500" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-500" />;
      case 'zip':
        return <Archive className="w-4 h-4 text-purple-500" />;
      default:
        return <LinkIcon className="w-4 h-4 text-indigo-500" />;
    }
  };

  // Flatten all lessons with memoization
  const allLessons = useMemo(() => {
    if (!course) return [];
    return course.modules.flatMap((m) => m.lessons);
  }, [course]);

  const activeIdx = useMemo(() => {
    if (!activeLesson) return -1;
    return allLessons.findIndex((l) => l.id === activeLesson.id);
  }, [allLessons, activeLesson]);

  const prevLesson = activeIdx > 0 ? allLessons[activeIdx - 1] : null;
  const nextLesson = activeIdx !== -1 && activeIdx < allLessons.length - 1 ? allLessons[activeIdx + 1] : null;

  // Find module containing the active lesson
  const currentModule = useMemo(() => {
    if (!course || !activeLesson) return null;
    return course.modules.find((m) => m.lessons.some((l) => l.id === activeLesson.id)) || null;
  }, [course, activeLesson]);

  // Extract explicit prompt blocks for prominent Quick-Copy cards
  const extractedPrompts = useMemo(() => {
    if (!activeLesson?.contentMarkdown) return [];
    const regex = /```(?:text|prompt|json)?\s*([\s\S]*?)```/g;
    const matches: { title: string; content: string }[] = [];
    let m;
    let idx = 1;
    while ((m = regex.exec(activeLesson.contentMarkdown)) !== null) {
      const raw = m[1].trim();
      if (raw.length > 20) {
        const beforeText = activeLesson.contentMarkdown.slice(0, m.index);
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
      setCopyToast('✓ Đã sao chép prompt vào bộ nhớ tạm thành công!');
      setTimeout(() => {
        setCopiedPromptIdx(null);
        setCopyToast(null);
      }, 2200);
    });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-700 dark:text-cyan-400 animate-spin" />
        <p className="text-xs text-slate-500 font-mono">Đang tải không gian học tập Skool...</p>
      </div>
    );
  }

  if (!course) return null;

  // LOCK SCREEN IF USER HASN'T PURCHASED
  if (!course.isUnlocked) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border-2 border-amber-400/30 shadow-lg">
          <Lock className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {course.title}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Khóa học này đang ở chế độ VIP. Hãy mở khóa để nhận toàn bộ video bài giảng, file prompt/JSON và tài liệu thực chiến.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <Link
            href={`/thanh-toan?pid=${course.pid}`}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 hover:opacity-85 text-white font-extrabold text-sm shadow-xl shadow-indigo-950/25 transition-all active:scale-[0.98]"
          >
            Mở Khóa Ngay ({new Intl.NumberFormat('vi-VN').format(course.price)} đ)
          </Link>

          <Link
            href="/dashboard"
            className="px-5 py-3.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:opacity-80 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-300 dark:border-white/10"
          >
            Quay lại Kho Bài Học
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 transition-colors duration-200 relative">
      {/* FLOATING TOAST NOTIFICATION FOR 1-CLICK COPY */}
      {copyToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-2xl backdrop-blur-md border border-white/20 dark:border-black/20 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{copyToast}</span>
        </div>
      )}

      {/* 1. TOP HEADER: Breadcrumb, Title & Course Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-200 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard"
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors shrink-0"
            title="Quay lại danh sách khóa học"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <span className="text-xs font-mono font-bold text-indigo-700 dark:text-cyan-400 uppercase tracking-wider">
              // KHÔNG GIAN HỌC TẬP SKOOL
            </span>
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-4 min-w-[260px]">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs sm:text-[13px] font-mono font-semibold">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">Tiến độ hoàn thành</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {course.completedLessons}/{course.totalLessons} bài ({course.progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${course.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BANNER ĐIỀU HƯỚNG TỚI BÀI VIẾT BÁN HÀNG / BÀI HỌC CHUYÊN SÂU (NẾU CÓ CẤU HÌNH) */}
      {course.customUrl && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-blue-500/15 border-2 border-amber-400/50 dark:border-amber-500/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-black">
                  Chế độ bài viết
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Khóa học này được tối ưu dưới dạng bài viết thực chiến
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">
                Xem toàn bộ hướng dẫn, kịch bản mẫu và ưu đãi mới nhất tại bài viết chi tiết.
              </p>
            </div>
          </div>

          <Link
            href={course.customUrl}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition-all shrink-0 active:scale-95"
          >
            <span>Đọc Bài Viết Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* 2. BỐ CỤC 2 CỘT CHUẨN: LỘ TRÌNH BÀI HỌC BÊN TAY TRÁI (4 COLS) + KHÔNG GIAN BÀI HỌC BÊN PHẢI (8 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ======================================================== */}
        {/* CỘT TRÁI (4 COLS): LỘ TRÌNH BÀI HỌC (CURRICULUM SIDEBAR)    */}
        {/* ======================================================== */}
        <div className="order-2 lg:order-1 lg:col-span-4 space-y-4 sticky top-20 z-20">
          <div className="rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
            {/* Header Lộ Trình */}
            <div className="p-4 bg-slate-50 dark:bg-black/40 border-b-2 border-slate-200 dark:border-white/10 flex items-center justify-between">
              <h2 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 font-mono">
                <BookOpen className="w-4 h-4 text-indigo-700 dark:text-cyan-400" />
                Lộ Trình Bài Học
              </h2>
              <span className="text-xs font-mono text-slate-500 font-bold">
                {course.totalLessons} bài
              </span>
            </div>

            {/* Search bài học nhanh */}
            <div className="p-3 border-b border-slate-100 dark:border-white/[0.06]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài học..."
                  value={lessonSearchTerm}
                  onChange={(e) => setLessonSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Accordion Modules & Lessons List (Full multiline title, no cutoff) */}
            <div className="divide-y divide-slate-100 dark:divide-white/[0.06] max-h-[calc(100vh-230px)] overflow-y-auto no-scrollbar scrollbar-none">
              {course.modules.map((mod, modIdx) => {
                const modLessons = mod.lessons.filter((l) =>
                  !lessonSearchTerm ||
                  l.title.toLowerCase().includes(lessonSearchTerm.toLowerCase()) ||
                  (l.summary && l.summary.toLowerCase().includes(lessonSearchTerm.toLowerCase()))
                );

                if (modLessons.length === 0 && lessonSearchTerm) return null;

                const isExpanded = expandedModules[mod.id] !== false;

                return (
                  <div key={mod.id} className="space-y-0.5">
                    {/* Module Accordion Header */}
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors select-none"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-cyan-400 text-[10px] font-black flex items-center justify-center shrink-0">
                          {modIdx + 1}
                        </span>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 line-clamp-1">
                          {mod.title}
                        </span>
                      </div>

                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {/* Module Lessons */}
                    {isExpanded && (
                      <div className="bg-slate-50/50 dark:bg-black/20 divide-y divide-slate-100 dark:divide-white/[0.04]">
                        {modLessons.map((lesson) => {
                          const isActive = activeLesson?.id === lesson.id;
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => handleSelectLesson(lesson)}
                              className={`w-full p-3 pl-4 flex items-start gap-2.5 text-left text-xs transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-indigo-50/90 dark:bg-indigo-500/15 border-l-4 border-indigo-700 dark:border-cyan-400 text-indigo-950 dark:text-white font-bold shadow-sm'
                                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-white/[0.04]'
                              }`}
                            >
                              {/* Completion or Play status icon */}
                              <div className="mt-0.5 shrink-0">
                                {lesson.isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                ) : isActive ? (
                                  <Play className="w-4 h-4 text-indigo-700 dark:text-cyan-400 fill-indigo-700 dark:fill-cyan-400" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                                )}
                              </div>

                              {/* Lesson Info (Hiển thị 2 dòng đầy đủ, không cắt xén) */}
                              <div className="flex-1 space-y-1 min-w-0">
                                <p className="line-clamp-2 leading-snug text-xs sm:text-[13.5px] font-semibold">{lesson.title}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono font-medium">
                                  <span>{lesson.duration || '10:00'}</span>
                                  {lesson.resources && lesson.resources.length > 0 && (
                                    <span className="flex items-center gap-0.5 text-indigo-600 dark:text-cyan-400 font-bold">
                                      <Paperclip className="w-3 h-3" />
                                      {lesson.resources.length}
                                    </span>
                                  )}
                                  {lesson.isFreePreview && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100/80 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                                      Học thử
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CỘT PHẢI (8 COLS): KHÔNG GIAN BÀI HỌC (MAIN LESSON STAGE)  */}
        {/* ======================================================== */}
        <div
          ref={lessonStageRef}
          className={`order-1 lg:order-2 lg:col-span-8 space-y-6 scroll-mt-36 transition-all duration-300 ${
            highlightedSection === 'stage' ? 'ring-2 ring-indigo-500/50 rounded-3xl' : ''
          }`}
        >
          {activeLesson ? (
            <div className="space-y-6">

              {/* ======================================================== */}
              {/* PHẦN ĐẦU: TIÊU ĐỀ + NÚT HOÀN THÀNH + TÓM TẮT ĐIỂM CỐT LÕI */}
              {/* ======================================================== */}
              <div className="bento-card p-5 sm:p-6 border-2 border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#111116] shadow-sm space-y-4">
                {/* Tiêu đề & Nút Hoàn thành */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-indigo-700 dark:text-cyan-400 uppercase tracking-wider">
                        {currentModule?.title || `BÀI HỌC SỐ ${activeIdx + 1} / ${allLessons.length}`}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-xs font-mono text-slate-600 dark:text-slate-400 flex items-center gap-1 font-semibold">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {activeLesson.duration || '10:00'}
                      </span>
                      {activeLesson.isFreePreview && (
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                          Xem thử 0đ
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                      {activeLesson.title}
                    </h2>
                  </div>

                  {/* NÚT HOÀN THÀNH BÀI HỌC (SKOOL CORE ACTION) */}
                  <button
                    onClick={handleToggleComplete}
                    disabled={updatingProgress}
                    className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-sm shadow-lg transition-all active:scale-[0.98] shrink-0 cursor-pointer ${
                      activeLesson.isCompleted
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/20 border border-emerald-500'
                        : 'bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 hover:opacity-90 text-white shadow-indigo-950/25'
                    }`}
                  >
                    {updatingProgress ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {activeLesson.isCompleted
                      ? '✓ ĐÃ HOÀN THÀNH (BẤM ĐỂ HỦY)'
                      : 'ĐÁNH DẤU HOÀN THÀNH (+10 ĐIỂM)'}
                  </button>
                </div>

                {/* Tóm tắt điểm cốt lõi (Callout màu hổ phách) */}
                {activeLesson.summary && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-500/[0.06] border-2 border-amber-300/80 dark:border-amber-500/25 text-[14.5px] sm:text-base text-amber-950 dark:text-amber-100 leading-relaxed flex items-start gap-3.5">
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
                  <div className="flex items-center gap-2 overflow-x-auto py-0.5 no-scrollbar scrollbar-none flex-1 min-w-0">
                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5 pl-1">
                      <Compass className="w-3.5 h-3.5 text-indigo-500" />
                      Chuyển đến:
                    </span>

                    {activeLesson.videoUrl && (
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

                    {activeLesson.actionChecklist && activeLesson.actionChecklist.length > 0 && (
                      <button
                        onClick={() => scrollToSection('checklist', checklistSectionRef)}
                        className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
                          highlightedSection === 'checklist'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400'
                            : 'bg-slate-100 dark:bg-white/[0.05] hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                        }`}
                      >
                        <CheckSquare className="w-3 h-3 text-emerald-500" />
                        <span>4. Checklist ({activeLesson.actionChecklist.length})</span>
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
                      if (lessonStageRef.current) {
                        lessonStageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                className={`bento-card rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#111116] shadow-sm scroll-mt-36 transition-all duration-300 ${
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
                      <p className="text-xs sm:text-[13px] text-slate-500 font-medium">
                        {activeLesson.duration ? `Thời lượng video: ${activeLesson.duration}` : 'Xem hướng dẫn từng bước'}
                      </p>
                    </div>
                  </div>

                  {activeLesson.videoUrl && (
                    <button
                      onClick={() => setIsVideoCollapsed(!isVideoCollapsed)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
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
                    {activeLesson.videoUrl ? (
                      <iframe
                        src={formatEmbedUrl(activeLesson.videoUrl)}
                        title={activeLesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2 p-12">
                        <Play className="w-10 h-10 opacity-40" />
                        <p className="text-xs font-mono">Bài học này không có video</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => setIsVideoCollapsed(false)}
                    className="p-6 text-center bg-slate-50/50 dark:bg-black/20 hover:bg-indigo-50/30 transition-colors cursor-pointer border-t border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 dark:text-cyan-400"
                  >
                    <Play className="w-4 h-4 fill-indigo-600 dark:fill-cyan-400" />
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
                  className={`p-4 sm:p-5 rounded-2xl bg-slate-900 text-slate-100 border-2 border-indigo-500/40 shadow-xl space-y-4 scroll-mt-36 transition-all duration-300 ${
                    highlightedSection === 'prompts' ? 'ring-4 ring-amber-400/80 shadow-amber-500/30' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-400">
                        <Zap className="w-4 h-4 fill-amber-400" />
                      </div>
                      <h3 className="font-extrabold text-xs sm:text-sm text-white uppercase tracking-wider font-mono">
                        Mục 2: Bộ Prompt & Câu Lệnh Dùng Ngay ({extractedPrompts.length})
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Bấm nút sao chép để dán thẳng vào AI
                    </span>
                  </div>

                  <div className="space-y-3">
                    {extractedPrompts.map((p, pIdx) => {
                      const isCopied = copiedPromptIdx === pIdx;
                      return (
                        <div
                          key={pIdx}
                          className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-2.5 hover:border-indigo-500/50 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mono truncate">
                              <Terminal className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span>{p.title}</span>
                            </span>

                            <button
                              onClick={() => handleCopyPromptCard(p.content, pIdx)}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-md active:scale-95 ${
                                isCopied
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                              }`}
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>✓ Đã sao chép!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Sao chép Prompt</span>
                                </>
                              )}
                            </button>
                          </div>

                          <pre className="p-3 rounded-lg bg-slate-950 text-slate-200 text-xs font-mono leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap break-words border border-slate-800/80 select-all">
                            {p.content}
                          </pre>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* MỤC 3: TÀI LIỆU & FILE ĐÍNH KÈM (SKOOL ATTACHMENTS BOX)    */}
              {/* ======================================================== */}
              {activeLesson.resources && activeLesson.resources.length > 0 && (
                <div
                  ref={resourcesSectionRef}
                  id="section-resources"
                  className={`p-4 sm:p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-500/[0.04] border-2 border-indigo-200/80 dark:border-indigo-500/20 space-y-3 scroll-mt-36 transition-all duration-300 ${
                    highlightedSection === 'resources' ? 'ring-4 ring-indigo-500/80 shadow-indigo-500/30' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Mục 3: Tài Liệu & Tệp Tải Về ({activeLesson.resources.length})</span>
                    </h3>
                    <span className="text-[11px] font-mono text-slate-500">Bấm nút để tải hoặc mở ngay</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeLesson.resources.map((res, idx) => (
                      <div
                        key={idx}
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
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                              <span className="uppercase text-indigo-600 dark:text-cyan-400 font-bold">{res.type}</span>
                              {res.size && <span> · {res.size}</span>}
                            </p>
                          </div>
                        </div>

                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* MỤC 4: CHECKLIST HÀNH ĐỘNG THỰC CHIẾN (TICK KHI LÀM XONG)  */}
              {/* ======================================================== */}
              {activeLesson.actionChecklist && activeLesson.actionChecklist.length > 0 && (
                <div
                  ref={checklistSectionRef}
                  id="section-checklist"
                  className={`p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border-2 border-slate-200 dark:border-white/[0.08] space-y-3 scroll-mt-36 transition-all duration-300 ${
                    highlightedSection === 'checklist' ? 'ring-4 ring-emerald-500/80 shadow-emerald-500/30' : ''
                  }`}
                >
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 font-mono">
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                    <span>Mục 4: Checklist Hành Động Thực Chiến (Tick khi hoàn thành)</span>
                  </h3>

                  <div className="space-y-2">
                    {activeLesson.actionChecklist.map((task, idx) => {
                      const key = `${activeLesson.id}-${idx}`;
                      const isChecked = !!completedChecklist[key];
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleChecklistItem(idx)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs sm:text-sm transition-all border cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-300 font-semibold line-through'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400/50'
                          }`}
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className="flex-1 leading-snug">{task}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* MỤC 5: NỘI DUNG BÀI GIẢNG & GHI CHÚ CHI TIẾT (MARKDOWN)   */}
              {/* ======================================================== */}
              <div
                ref={notesSectionRef}
                id="section-notes"
                className={`space-y-3 pt-2 scroll-mt-36 transition-all duration-300 ${
                  highlightedSection === 'notes' ? 'ring-4 ring-indigo-500/80 rounded-2xl p-1' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm sm:text-base uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                    Mục 5: Ghi Chú & Kịch Bản Hướng Dẫn Thực Hành
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Click vào nút "Sao Chép Lệnh" trên từng khối mã
                  </span>
                </div>
                <div
                  onClick={handleMarkdownClick}
                  className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed p-6 rounded-2xl bg-slate-50/70 dark:bg-black/30 border border-slate-200 dark:border-white/[0.06]"
                  dangerouslySetInnerHTML={{ __html: renderMarkdownWithCopy(activeLesson.contentMarkdown) }}
                />
              </div>

              {/* ======================================================== */}
              {/* 8. BOTTOM NAVIGATION (BÀI TRƯỚC / BÀI TIẾP THEO)           */}
              {/* ======================================================== */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/[0.08] text-xs gap-3">
                {prevLesson ? (
                  <button
                    onClick={() => handleSelectLesson(prevLesson)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                    <span className="line-clamp-1">Bài Trước: {prevLesson.title}</span>
                  </button>
                ) : (
                  <div />
                )}

                {nextLesson && (
                  <button
                    onClick={() => handleSelectLesson(nextLesson)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                  >
                    <span className="line-clamp-1">Bài Tiếp: {nextLesson.title}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                )}
              </div>

              {/* REFERRAL SHARE CARD - 60% COMMISSION */}
              <ReferralShareCard
                courseSlug={course.slug}
                courseTitle={course.title}
                coursePrice={course.price}
                isUnlocked={course.isUnlocked}
              />

              {/* VIP COMMUNITY SUPPORT BOX (ZALO 24/7) */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-200 dark:border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Cần Hỗ Trợ Kỹ Thuật & Giải Đáp Thắc Mắc?
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-600 text-white">
                      HỖ TRỢ 24/7
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Đội ngũ Tự Học AI và cộng đồng hỗ trợ trực tiếp từng ca thực hành trên nhóm Zalo VIP.
                  </p>
                </div>

                <a
                  href="https://zalo.me/g/tuhocai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shrink-0 transition-colors shadow-md shadow-emerald-600/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Vào Nhóm Zalo Hỗ Trợ</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-16 text-center text-slate-500 text-sm bg-white dark:bg-[#111116] rounded-2xl border-2 border-slate-200 dark:border-white/10">
              Chọn bài học từ lộ trình bên trái để bắt đầu học.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
