'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface LessonResource {
  name: string;
  type: 'json' | 'pdf' | 'doc' | 'link' | 'zip';
  url: string;
  size?: string;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  summary: string;
  contentMarkdown: string;
  actionChecklist: string[];
  resources: LessonResource[];
  sortOrder: number;
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
  isUnlocked: boolean;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  modules: Module[];
}

export default function CourseLearningRoomPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = use(params);
  const router = useRouter();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'resources' | 'discussion'>('content');
  const [loading, setLoading] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [completedChecklist, setCompletedChecklist] = useState<Record<string, boolean>>({});

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

        // Find first lesson or first uncompleted lesson
        const allLessons = cr.modules.flatMap((m) => m.lessons);
        const firstUncompleted = allLessons.find((l) => !l.isCompleted);
        const initial = firstUncompleted || allLessons[0] || null;
        setActiveLesson(initial);
      } catch (e) {
        console.error('Failed to load course:', e);
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [courseSlug, router]);

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
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

        // If marked completed, auto advance to next lesson after 800ms
        if (newStatus) {
          const allLessons = course.modules.flatMap((m) => m.lessons);
          const currentIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
          if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
            setTimeout(() => {
              setActiveLesson(allLessons[currentIndex + 1]);
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

  const handleNextLesson = () => {
    if (!course || !activeLesson) return;
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const idx = allLessons.findIndex((l) => l.id === activeLesson.id);
    if (idx !== -1 && idx < allLessons.length - 1) {
      setActiveLesson(allLessons[idx + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (!course || !activeLesson) return;
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const idx = allLessons.findIndex((l) => l.id === activeLesson.id);
    if (idx > 0) {
      setActiveLesson(allLessons[idx - 1]);
    }
  };

  const toggleChecklistItem = (itemIndex: number) => {
    const key = `${activeLesson?.id}-${itemIndex}`;
    setCompletedChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-700 dark:text-cyan-400 animate-spin" />
        <p className="text-xs text-slate-500 font-mono">Đang tải giáo trình và bài học...</p>
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
            Khóa học này đang ở chế độ VIP. Hãy mở khóa để nhận toàn bộ video bài giảng, file JSON flow n8n và hỗ trợ kỹ thuật trực tiếp.
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
            Quay lại Classroom
          </Link>
        </div>
      </div>
    );
  }

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const activeIdx = allLessons.findIndex((l) => l.id === activeLesson?.id);
  const isFirst = activeIdx === 0;
  const isLast = activeIdx === allLessons.length - 1;

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 transition-colors duration-200">
      {/* 1. TOP BAR: Back Link, Title, Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-300 dark:border-white/15 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors"
            title="Quay lại danh sách khóa học"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] font-mono font-bold text-indigo-800 dark:text-cyan-400 uppercase">
              // KHÔNG GIAN HỌC TẬP SKOOL
            </span>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white line-clamp-1">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-4 min-w-[260px]">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">Tiến độ khóa học</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {course.completedLessons}/{course.totalLessons} bài ({course.progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${course.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN LAYOUT: Left Sidebar (Curriculum) + Right (Video & Workspace) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: CURRICULUM ACCORDION (4 cols on desktop) */}
        <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-300 dark:border-white/15 overflow-hidden shadow-md">
          <div className="p-4 bg-slate-50 dark:bg-black/40 border-b-2 border-slate-200 dark:border-white/10 flex items-center justify-between">
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 font-mono">
              <BookOpen className="w-4 h-4 text-indigo-700 dark:text-cyan-400" />
              Lộ Trình Bài Học
            </h2>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">
              {course.totalLessons} bài
            </span>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-white/[0.08] max-h-[720px] overflow-y-auto">
            {course.modules.map((mod) => (
              <div key={mod.id} className="space-y-0.5">
                {/* Module Header Accordion Toggle */}
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors"
                >
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {mod.title}
                  </span>
                  {expandedModules[mod.id] ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {/* Lessons in Module */}
                {expandedModules[mod.id] && (
                  <div className="bg-slate-50/50 dark:bg-black/20 divide-y divide-slate-100 dark:divide-white/[0.04]">
                    {mod.lessons.map((lesson) => {
                      const isActive = activeLesson?.id === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`w-full p-3 pl-4 flex items-start gap-2.5 text-left text-xs transition-all ${
                            isActive
                              ? 'bg-indigo-50 dark:bg-indigo-500/15 border-l-4 border-indigo-700 dark:border-cyan-400 text-indigo-950 dark:text-white font-bold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-white/[0.04]'
                          }`}
                        >
                          {/* Completion / Play Icon */}
                          <div className="mt-0.5 shrink-0">
                            {lesson.isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            ) : isActive ? (
                              <Play className="w-4 h-4 text-indigo-700 dark:text-cyan-400 fill-indigo-700 dark:fill-cyan-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                            )}
                          </div>

                          <div className="flex-1 space-y-1">
                            <p className="line-clamp-2 leading-snug">{lesson.title}</p>
                            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                              {lesson.duration}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: VIDEO PLAYER, ACTIONS, WORKSPACE (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {activeLesson ? (
            <div className="space-y-6">
              {/* VIDEO PLAYER (16:9) */}
              <div className="rounded-2xl overflow-hidden bg-black border-2 border-slate-300 dark:border-white/15 shadow-xl relative aspect-video">
                <iframe
                  src={activeLesson.videoUrl}
                  title={activeLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* ACTION BAR: Title, Mark as done, Navigation */}
              <div className="bento-card p-5 sm:p-6 border-2 border-slate-300 dark:border-white/15 space-y-4 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-indigo-800 dark:text-cyan-400">
                      BÀI HỌC SỐ {activeIdx + 1} / {allLessons.length}
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                      {activeLesson.title}
                    </h2>
                  </div>

                  {/* NÚT HOÀN THÀNH BÀI HỌC (SKOOL CORE ACTION) */}
                  <button
                    onClick={handleToggleComplete}
                    disabled={updatingProgress}
                    className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all active:scale-[0.98] shrink-0 ${
                      activeLesson.isCompleted
                        ? 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-emerald-950/20 border border-emerald-500'
                        : 'bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 hover:opacity-85 text-white shadow-indigo-950/25'
                    }`}
                  >
                    {updatingProgress ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {activeLesson.isCompleted
                      ? '✓ ĐÃ HOÀN THÀNH BÀI (HỦY)'
                      : 'ĐÁNH DẤU HOÀN THÀNH (+10 ĐIỂM)'}
                  </button>
                </div>

                {/* Lesson Navigation Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/[0.08] text-xs">
                  <button
                    onClick={handlePrevLesson}
                    disabled={isFirst}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-white/[0.04]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Bài trước
                  </button>

                  <span className="font-mono text-slate-500 text-[11px]">
                    Thời lượng: {activeLesson.duration}
                  </span>

                  <button
                    onClick={handleNextLesson}
                    disabled={isLast}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-white/[0.04]"
                  >
                    Bài tiếp theo
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* TABS: Hướng Dẫn & Checklist | Tài Nguyên File | Thảo Luận */}
              <div className="bento-card border-2 border-slate-300 dark:border-white/15 overflow-hidden shadow-md">
                {/* Tab Header */}
                <div className="flex border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 px-4">
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all ${
                      activeTab === 'content'
                        ? 'border-indigo-700 text-indigo-900 dark:text-white dark:border-cyan-400'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    📋 Hướng Dẫn & Checklist
                  </button>

                  <button
                    onClick={() => setActiveTab('resources')}
                    className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                      activeTab === 'resources'
                        ? 'border-indigo-700 text-indigo-900 dark:text-white dark:border-cyan-400'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    📥 Tài Nguyên Đính Kèm ({activeLesson.resources.length})
                  </button>

                  <button
                    onClick={() => setActiveTab('discussion')}
                    className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                      activeTab === 'discussion'
                        ? 'border-indigo-700 text-indigo-900 dark:text-white dark:border-cyan-400'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    💬 Thảo Luận & Hỏi Đáp
                  </button>
                </div>

                <div className="p-6">
                  {/* TAB 1: CONTENT & ACTION CHECKLIST */}
                  {activeTab === 'content' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                          Tóm tắt bài học:
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {activeLesson.summary}
                        </p>
                      </div>

                      {/* Action Checklist Thực Hành */}
                      {activeLesson.actionChecklist?.length > 0 && (
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/10 space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 font-mono">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-700 dark:text-cyan-400" />
                            Checklist Hành Động Thực Chiến (Tick khi làm xong)
                          </h4>

                          <div className="space-y-2">
                            {activeLesson.actionChecklist.map((task, idx) => {
                              const key = `${activeLesson.id}-${idx}`;
                              const isChecked = !!completedChecklist[key];
                              return (
                                <button
                                  key={idx}
                                  onClick={() => toggleChecklistItem(idx)}
                                  className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs transition-colors ${
                                    isChecked
                                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 font-semibold line-through'
                                      : 'hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  {isChecked ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                                  )}
                                  <span>{task}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Markdown Instructions */}
                      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                        {activeLesson.contentMarkdown}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: ATTACHED RESOURCES (1-CLICK DOWNLOAD) */}
                  {activeTab === 'resources' && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                          Tài nguyên đính kèm bài học này:
                        </h3>
                        <p className="text-xs text-slate-500">
                          Bấm nút tải về để nhận ngay file JSON mẫu, kịch bản hoặc mã nguồn.
                        </p>
                      </div>

                      {activeLesson.resources?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {activeLesson.resources.map((res, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 hover:border-indigo-600/40 transition-colors"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2 rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-white/10 shrink-0">
                                  {getResourceIcon(res.type)}
                                </div>
                                <div className="space-y-0.5 overflow-hidden">
                                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {res.name}
                                  </p>
                                  {res.size && (
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      Dung lượng: {res.size}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                              >
                                <Download className="w-3.5 h-3.5" />
                                Tải
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 py-6 text-center">
                          Bài học này không có tài nguyên đính kèm thêm.
                        </p>
                      )}
                    </div>
                  )}

                  {/* TAB 3: DISCUSSION & Q&A */}
                  {activeTab === 'discussion' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/25 text-xs text-indigo-950 dark:text-indigo-300 flex items-center justify-between">
                        <div>
                          <p className="font-bold">Cần hỗ trợ kỹ thuật hoặc sửa lỗi thực hành?</p>
                          <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                            Đội ngũ admin Tự Học AI và cộng đồng hỗ trợ 24/7 trên nhóm Zalo.
                          </p>
                        </div>
                        <a
                          href="https://zalo.me/g/tuhocai"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 hover:opacity-90"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Hỏi trên Zalo
                        </a>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">Admin Tự Học AI</span>
                            <span className="text-[10px] font-mono text-indigo-800 dark:text-cyan-400 bg-indigo-100 dark:bg-indigo-500/20 px-1.5 py-0.5 rounded">HỖ TRỢ</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            💡 Mẹo: Khi thực hành bài này, nếu gặp lỗi không import được file JSON, hãy kiểm tra phiên bản n8n của bạn đã cập nhật lên bản mới nhất chưa nhé!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-sm">
              Chọn bài học từ danh sách bên trái để bắt đầu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

