'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Layers,
  FileText,
  CheckCircle2,
  Lock,
  Download,
  Sparkles,
  Trophy,
  Clock,
  ArrowRight,
  Loader2,
  MessageCircle,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Zap,
  Gift,
} from 'lucide-react';
import CustomerAffiliateHub from '@/components/CustomerAffiliateHub';

interface CourseItem {
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
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  isUnlocked: boolean;
}

interface ClassroomStats {
  totalLessonsCompleted: number;
  totalLessonsAvailable: number;
  overallProgress: number;
  points: number;
  levelName: string;
  levelBadge: string;
  nextLevelPoints: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [stats, setStats] = useState<ClassroomStats | null>(null);
  const [library, setLibrary] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'classroom' | 'library' | 'orders' | 'referral'>('classroom');
  const [courseFilter, setCourseFilter] = useState<'all' | 'unlocked' | 'free' | 'vip'>('all');

  useEffect(() => {
    async function loadAllData() {
      try {
        // 1. Auth check
        const authRes = await fetch('/api/auth/me');
        const authData = await authRes.json();
        if (!authData.authenticated) {
          router.push('/login?redirect=/dashboard');
          return;
        }
        setUser(authData.user);

        // 2. Load Classroom courses & progress
        const crRes = await fetch('/api/dashboard/classroom');
        const crData = await crRes.json();
        if (crData.success) {
          setCourses(crData.courses || []);
          setStats(crData.stats || null);
        }

        // 3. Load Library & Orders
        const libRes = await fetch('/api/library');
        const libData = await libRes.json();
        if (libData.success) {
          setLibrary(libData.library || []);
          setOrders(libData.orders || []);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAllData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-700 dark:text-cyan-400 animate-spin" />
        <p className="text-xs text-slate-500 font-mono">Đang tải không gian học tập Skool của bạn...</p>
      </div>
    );
  }

  if (!user) return null;

  const filteredCourses = courses.filter((c) => {
    if (courseFilter === 'unlocked') return c.isUnlocked;
    if (courseFilter === 'free') return c.price === 0;
    if (courseFilter === 'vip') return c.price > 0;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 transition-colors duration-200">
      {/* 1. SKOOL HEADER PROFILE BANNER (THU GỌN TINH TẾ) */}
      <div className="rounded-2xl bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/10 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* User Info & Avatar */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-blue-600 p-0.5 shadow-md shadow-indigo-950/20">
                <div className="w-full h-full bg-white dark:bg-[#111116] rounded-[14px] flex items-center justify-center text-indigo-700 dark:text-cyan-400 font-black text-xl uppercase font-mono">
                  {user.name?.charAt(0) || 'U'}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-black bg-emerald-600 text-white shadow-xs">
                {stats?.levelBadge || 'Lv.1'}
              </span>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                  {user.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/25">
                  <Trophy className="w-3 h-3 text-indigo-600 dark:text-cyan-400" />
                  {stats?.levelName || 'Level 1: Tân Binh'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span>{user.email}</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Đã hoàn thành {stats?.totalLessonsCompleted || 0} bài
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-800 dark:text-white font-bold text-xs border border-slate-300 dark:border-white/10 transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
              <span>Kho Workflow</span>
            </Link>

            <a
              href="https://zalo.me/g/tuhocai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 hover:opacity-85 text-emerald-800 dark:text-emerald-400 font-bold text-xs border border-emerald-300 dark:border-emerald-500/30 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Hỗ Trợ Zalo VIP</span>
            </a>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-mono text-[11px]">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
              Tiến độ học tập tổng thể
            </span>
            <span className="font-mono font-bold text-xs text-indigo-700 dark:text-cyan-400">
              {stats?.overallProgress || 0}% ({stats?.totalLessonsCompleted || 0}/{stats?.totalLessonsAvailable || 0} bài)
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 transition-all duration-500"
              style={{ width: `${stats?.overallProgress || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. SKOOL TOP NAVIGATION TABS (TINH GỌN) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('classroom')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'classroom'
              ? 'bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 text-white shadow-md shadow-indigo-950/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Khóa Học Của Tôi ({courses.filter(c => c.isUnlocked).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'library'
              ? 'bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 text-white shadow-md shadow-indigo-950/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Kho Tài Liệu ({library.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 text-white shadow-md shadow-indigo-950/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Lịch Sử Đơn Hàng ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('referral')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'referral'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
          }`}
        >
          <Gift className="w-4 h-4 text-emerald-500" />
          <span>Đối Tác CTV (60%)</span>
          <span className="text-[9px] uppercase tracking-wider px-1 py-0.2 rounded-full font-black bg-amber-400 text-slate-950">
            HOT
          </span>
        </button>

        <a
          href="https://zalo.me/g/tuhocai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-all ml-auto whitespace-nowrap"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>Hỏi Đáp Zalo</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>

      {/* 3. TAB CONTENT: CLASSROOM (LÀM GỌN KHÓA HỌC ĐÃ MUA) */}
      {activeTab === 'classroom' && (
        <div className="space-y-6">
          {/* Filter Bar Tinh Gọn */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-[#111116] border border-slate-200 dark:border-white/10">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { key: 'all', label: 'Tất cả chương trình' },
                { key: 'unlocked', label: 'Đã mở khóa' },
                { key: 'free', label: 'Miễn phí 0đ' },
                { key: 'vip', label: 'Khóa học VIP' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setCourseFilter(f.key as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    courseFilter === f.key
                      ? 'bg-indigo-700 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Tổng số: <strong className="text-slate-900 dark:text-white font-bold">{filteredCourses.length}</strong> khóa học
            </span>
          </div>

          {/* KHU VỰC 1: KHÓA HỌC BẠN ĐÃ MUA / ĐÃ SỞ HỮU (ƯU TIÊN LÊN ĐẦU, THIẾT KẾ SIÊU GỌN GÀNG) */}
          {(courseFilter === 'all' || courseFilter === 'unlocked') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Khóa Học Đã Mở Khóa Của Bạn</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                    {courses.filter((c) => c.isUnlocked).length} khóa
                  </span>
                </h2>
              </div>

              {courses.filter((c) => c.isUnlocked).length === 0 ? (
                <div className="text-center py-10 rounded-2xl bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/10 p-6 space-y-2">
                  <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bạn chưa mở khóa chương trình nào.</p>
                  <p className="text-xs text-slate-500">Khám phá các khóa học bên dưới để bắt đầu học ngay nhé!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {courses
                    .filter((c) => c.isUnlocked)
                    .map((course) => {
                      const targetUrl = course.customUrl || `/dashboard/hoc/${course.slug}`;
                      return (
                        <div
                          key={course.slug}
                          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/10 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div>
                            {/* Thumbnail Gọn Gàng */}
                            <Link href={targetUrl} className="block relative aspect-[16/9] w-full bg-slate-100 dark:bg-black overflow-hidden">
                              <Image
                                src={course.thumbnail || '/images/products/n8n-workflow-demo.jpg'}
                                alt={course.title}
                                fill
                                unoptimized
                                className="object-cover group-hover:scale-103 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                              {/* 1 Badge Trạng Thái Học Duy Nhất */}
                              <div className="absolute top-2.5 left-2.5">
                                {course.progressPercent === 100 ? (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    ĐÃ HOÀN THÀNH
                                  </span>
                                ) : course.progressPercent > 0 ? (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-600 text-white shadow-sm flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-amber-300" />
                                    ĐANG HỌC ({course.progressPercent}%)
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-600 text-white shadow-sm flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    SẴN SÀNG HỌC
                                  </span>
                                )}
                              </div>

                              <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-white/90">
                                <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-medium">
                                  {course.totalLessons} bài học
                                </span>
                                <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-medium">
                                  {course.level}
                                </span>
                              </div>
                            </Link>

                            {/* Content Rút Gọn: Bỏ headline dài dòng, tập trung vào tên và tiến độ */}
                            <div className="p-4 space-y-3">
                              <Link href={targetUrl} className="block group/link">
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-2 group-hover/link:text-indigo-600 dark:group-hover/link:text-cyan-400 transition-colors">
                                  {course.title}
                                </h3>
                              </Link>

                              {/* Progress Bar Gọn Gàng */}
                              <div className="space-y-1.5 pt-1">
                                <div className="flex items-center justify-between text-[11px] font-mono">
                                  <span className="text-slate-500 dark:text-slate-400">Tiến độ</span>
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                    {course.completedLessons}/{course.totalLessons} bài ({course.progressPercent}%)
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-white/[0.08] rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-500 transition-all duration-300"
                                    style={{ width: `${course.progressPercent}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 1 Nút Hành Động Duy Nhất (Không nút mua thừa) */}
                          <div className="p-4 pt-0">
                            <Link
                              href={targetUrl}
                              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 hover:opacity-90 text-white font-bold text-xs shadow-md transition-all active:scale-[0.98]"
                            >
                              <span>
                                {course.customUrl
                                  ? 'Xem Bài Viết Hướng Dẫn'
                                  : course.progressPercent > 0
                                  ? 'Tiếp Tục Học Ngay'
                                  : 'Bắt Đầu Học Ngay'}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* KHU VỰC 2: CÁC KHÓA HỌC KHÁC ĐỂ KHÁM PHÁ THÊM (CHỈ HIỆN KHI FILTER ALL HOẶC VIP/FREE) */}
          {(courseFilter === 'all' || courseFilter === 'vip' || courseFilter === 'free') && (
            <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>
                    {courseFilter === 'all'
                      ? 'Khám Phá Thêm Khóa Học AI Khác'
                      : courseFilter === 'free'
                      ? 'Các Chương Trình Miễn Phí 0đ'
                      : 'Các Chương Trình VIP'}
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {(courseFilter === 'all'
                  ? courses.filter((c) => !c.isUnlocked)
                  : filteredCourses
                ).map((course) => {
                  const targetUrl = course.customUrl || `/dashboard/hoc/${course.slug}`;
                  return (
                    <div
                      key={course.slug}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/25 shadow-sm transition-all"
                    >
                      <div>
                        {/* Thumbnail */}
                        <Link href={targetUrl} className="block relative aspect-[16/9] w-full bg-slate-100 dark:bg-black overflow-hidden">
                          <Image
                            src={course.thumbnail || '/images/products/n8n-workflow-demo.jpg'}
                            alt={course.title}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-103 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                          <div className="absolute top-2.5 left-2.5">
                            {course.price === 0 ? (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-600 text-white shadow-sm">
                                MIỄN PHÍ 0Đ
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-900/90 text-white border border-white/20 shadow-sm flex items-center gap-1">
                                <Lock className="w-3 h-3 text-amber-400" />
                                {new Intl.NumberFormat('vi-VN').format(course.price)} đ
                              </span>
                            )}
                          </div>

                          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-white/90">
                            <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
                              {course.totalLessons} bài học
                            </span>
                            <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
                              {course.level}
                            </span>
                          </div>
                        </Link>

                        {/* Title & Info */}
                        <div className="p-4 space-y-2">
                          <Link href={targetUrl} className="block group/link">
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-2 group-hover/link:text-indigo-600 dark:group-hover/link:text-cyan-400 transition-colors">
                              {course.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                            {course.headline}
                          </p>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="p-4 pt-0">
                        {course.price === 0 ? (
                          <Link
                            href={targetUrl}
                            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Học Miễn Phí Ngay</span>
                          </Link>
                        ) : (
                          <Link
                            href={`/thanh-toan?pid=${course.pid}`}
                            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-900 dark:text-white font-bold text-xs border border-slate-300 dark:border-white/10 transition-all"
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-500" />
                            <span>Mở Khóa ({new Intl.NumberFormat('vi-VN').format(course.price)} đ)</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. TAB CONTENT: LIBRARY (Kho Tài Liệu Đã Mở Khóa) */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
              <span>Tài Liệu & Mã Nguồn Đã Mở Khóa Vĩnh Viễn</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">Tổng cộng: {library.length} tài nguyên</span>
          </div>

          {library.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {library.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/10 p-4 sm:p-5 flex flex-col justify-between space-y-3.5 hover:border-emerald-500/50 shadow-xs hover:shadow-sm transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-500/20 uppercase">
                        {item.category || 'Tài nguyên AI'}
                      </span>
                      <span className="text-slate-400 text-[11px] font-mono">
                        {new Date(item.unlocked_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-2">
                      {item.product_name}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                    <a
                      href={item.download_url || 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all active:scale-[0.98]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Mở Thư Mục Tải Google Drive</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-300 dark:border-white/15 p-8 space-y-4 shadow-md">
              <Layers className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Chưa có tài liệu nào trong kho</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Bạn có thể đăng ký tải miễn phí các bộ Prompt hoặc sở hữu ngay Workflow n8n để xem tại đây.
              </p>
              <Link
                href="/san-pham"
                className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-800 to-blue-700 text-white font-bold text-xs"
              >
                Khám Phá Kho Sản Phẩm
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 5. TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-mono">
              <FileText className="w-4 h-4 text-indigo-700 dark:text-cyan-400" />
              Lịch Sử Giao Dịch & Đơn Hàng
            </h2>
            <span className="text-xs font-mono text-slate-500">Tổng cộng: {orders.length} đơn</span>
          </div>

          {orders.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border-2 border-slate-300 dark:border-white/15 bg-white dark:bg-[#111116] shadow-md">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-black/60 border-b-2 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider font-mono">
                  <tr>
                    <th className="py-3.5 px-4">Mã đơn</th>
                    <th className="py-3.5 px-4">Sản phẩm</th>
                    <th className="py-3.5 px-4">Số tiền</th>
                    <th className="py-3.5 px-4">Trạng thái</th>
                    <th className="py-3.5 px-4">Ngày tạo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/[0.08] text-slate-800 dark:text-slate-300">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03]">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-800 dark:text-indigo-400">{ord.order_code}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white max-w-xs truncate">{ord.product_name}</td>
                      <td className="py-3.5 px-4 font-mono font-bold">{new Intl.NumberFormat('vi-VN').format(ord.price)} đ</td>
                      <td className="py-3.5 px-4">
                        {ord.payment_status === 'APPROVED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 font-mono">
                            <CheckCircle2 className="w-3 h-3" /> ĐÃ DUYỆT
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 font-mono">
                            <Clock className="w-3 h-3" /> CHỜ DUYỆT
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {new Date(ord.created_at).toLocaleDateString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-300 dark:border-white/15 p-8 space-y-2 shadow-md">
              <FileText className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Chưa có đơn hàng nào</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Lịch sử thanh toán VietQR sẽ được lưu lại tự động tại đây.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Referral / CTV Kiếm Tiền 60% */}
      {activeTab === 'referral' && (
        <div className="pt-2">
          <CustomerAffiliateHub />
        </div>
      )}
    </div>
  );
}
