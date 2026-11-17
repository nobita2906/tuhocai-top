'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Plus,
  Users,
  Package,
  CreditCard,
  Mail,
  ArrowLeft,
  LogOut,
  Loader2,
  Menu,
  X,
  Cpu,
  Settings,
  BookOpen,
  Share2,
  Layers,
  Send,
  GraduationCap,
  History,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

import ThemeToggle from '@/components/ThemeToggle';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  requiredSuperAdmin?: boolean;
  actionHref?: string;
  actionTitle?: string;
  badge?: string;
}

interface NavGroup {
  id: string;
  groupTitle: string;
  icon: any;
  items: NavItem[];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);

  useEffect(() => {
    async function checkAdminAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!data.authenticated || (data.user.role !== 'ADMIN' && data.user.role !== 'EDITOR')) {
          router.push('/login?redirect=/admin');
          return;
        }
        setAdminUser(data.user);
      } catch (err) {
        router.push('/login?redirect=/admin');
      } finally {
        setLoading(false);
      }
    }
    checkAdminAuth();
  }, [router]);

  // Khôi phục trạng thái sidebar collapse từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tuhocai_admin_sidebar_collapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('tuhocai_admin_sidebar_collapsed', String(next));
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const isSuperAdmin = adminUser?.role === 'ADMIN';

  // Nhóm Menu theo 4 phân khu chức năng logic chuẩn UX (Tên ngắn gọn, hiển thị 100% không bị cắt)
  const navGroups: NavGroup[] = [
    {
      id: 'commerce',
      groupTitle: 'Kinh Doanh & Bán Hàng',
      icon: CreditCard,
      items: [
        { label: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
        { label: 'Đơn hàng & VietQR', href: '/admin/don-hang', icon: CreditCard },
        { label: 'Kho sản phẩm', href: '/admin/san-pham', icon: Package },
        { label: 'Landing Pages & Phễu', href: '/admin/landing-pages', icon: Layers },
        { label: 'Khách hàng (Leads 0đ)', href: '/admin/leads', icon: Mail },
        { label: 'Đối tác Affiliate', href: '/admin/affiliate', icon: Share2 },
      ],
    },
    {
      id: 'academy',
      groupTitle: 'Đào Tạo & Khóa Học',
      icon: GraduationCap,
      items: [
        { label: 'Khu vực học tập', href: '/admin/khoa-hoc', icon: GraduationCap },
        { label: 'Tài liệu nội bộ (Wiki)', href: '/admin/noi-bo', icon: BookOpen },
      ],
    },
    {
      id: 'content',
      groupTitle: 'Bài Viết & Nội Dung',
      icon: FileText,
      items: [
        {
          label: 'Quản lý bài viết',
          href: '/admin/bai-viet',
          icon: FileText,
          actionHref: '/admin/bai-viet/them-moi',
          actionTitle: 'Viết bài mới',
        },
      ],
    },
    {
      id: 'system',
      groupTitle: 'Cài Đặt Hệ Thống',
      icon: Settings,
      items: [
        { label: 'Quản lý thành viên', href: '/admin/thanh-vien', icon: Users, requiredSuperAdmin: true },
        { label: 'Nhật ký thao tác', href: '/admin/nhat-ky', icon: History, requiredSuperAdmin: true },
        { label: 'Cấu hình Telegram', href: '/admin/cai-dat-telegram', icon: Send, requiredSuperAdmin: true },
        { label: 'Cài đặt Website & QR', href: '/admin/cai-dat', icon: Settings, requiredSuperAdmin: true },
      ],
    },
  ];

  // Tự động nhận diện phân khu đang hoạt động theo route hiện tại
  useEffect(() => {
    for (const group of navGroups) {
      for (const item of group.items) {
        if (item.href === '/admin' && pathname === '/admin') {
          setOpenGroupId(group.id);
          return;
        }
        if (item.href !== '/admin' && pathname.startsWith(item.href)) {
          setOpenGroupId(group.id);
          return;
        }
        if (item.actionHref && pathname === item.actionHref) {
          setOpenGroupId(group.id);
          return;
        }
      }
    }
  }, [pathname]);

  // Xử lý cơ chế Accordion mượt mà: Click mở phân khu này, đồng thời thu gọn tất cả phân khu khác
  const handleGroupHeaderClick = (groupId: string) => {
    setOpenGroupId((prev) => (prev === groupId ? null : groupId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#09090b] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-700 dark:text-indigo-400 animate-spin" />
        <p className="text-sm font-mono text-slate-600 dark:text-slate-400 font-semibold">Đang xác thực quyền Quản trị viên...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#09090b] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200">
      {/* Top Mobile Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b-2 border-slate-300 dark:border-white/[0.08] bg-white dark:bg-[#111116] sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-400 flex items-center justify-center border border-indigo-300 dark:border-indigo-500/30">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm text-slate-900 dark:text-white">TỰ HỌC AI ADMIN</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.05]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Desktop: Mở rộng thành w-72 để hiển thị 100% đầy đủ nội dung, không bị truncate cắt chữ */}
      <aside
        className={`bg-white dark:bg-[#111116] border-r-2 border-slate-300 dark:border-white/[0.08] flex flex-col justify-between z-40 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'md:w-20 p-3' : 'md:w-72 p-4'
        } ${mobileMenuOpen ? 'fixed inset-0 z-50 w-full p-4 overflow-y-auto' : 'hidden md:flex'}`}
      >
        <div className="space-y-4">
          {/* Brand header */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-1 py-1`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-800 via-indigo-700 to-blue-700 p-[1px] shadow-sm flex-shrink-0">
                <div className="w-full h-full bg-white dark:bg-[#111116] rounded-[11px] flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-indigo-800 dark:text-cyan-400" />
                </div>
              </div>
              {!isCollapsed && (
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">TỰ HỌC AI</span>
                    <span className="font-mono text-[9px] font-bold px-1 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-900 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-500/30">
                      ADMIN
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">Bảng điều khiển</span>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-1">
              {!isCollapsed && <ThemeToggle />}
              <button
                onClick={toggleCollapse}
                title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors"
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Accordion Groups */}
          <nav className="space-y-1.5">
            {navGroups.map((group) => {
              const visibleItems = group.items.filter((item) => !item.requiredSuperAdmin || isSuperAdmin);
              if (visibleItems.length === 0) return null;

              const isOpen = openGroupId === group.id;
              const GroupIcon = group.icon;

              // Kiểm tra xem trong group này có item nào đang active không
              const hasActiveChild = visibleItems.some((item) => {
                if (item.href === '/admin') return pathname === '/admin';
                if (item.href === '/admin/bai-viet') return pathname.startsWith('/admin/bai-viet');
                return pathname.startsWith(item.href) || (item.actionHref && pathname === item.actionHref);
              });

              return (
                <div key={group.id} className="rounded-xl overflow-hidden">
                  {/* ACCORDION HEADER (Nhấn để sổ danh sách / thu gọn) */}
                  {!isCollapsed ? (
                    <button
                      type="button"
                      onClick={() => handleGroupHeaderClick(group.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-200 select-none ${
                        isOpen
                          ? 'bg-indigo-50 dark:bg-white/[0.06] text-indigo-700 dark:text-indigo-400 font-bold shadow-sm'
                          : hasActiveChild
                          ? 'bg-slate-100/80 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-white/[0.03] hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <GroupIcon className={`w-4 h-4 flex-shrink-0 ${isOpen || hasActiveChild ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`} />
                        <span className="text-xs font-bold tracking-tight whitespace-nowrap">
                          {group.groupTitle}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                          isOpen
                            ? 'bg-indigo-200/70 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300'
                            : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {visibleItems.length}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ease-out ${
                            isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : 'text-slate-400 rotate-0'
                          }`}
                        />
                      </div>
                    </button>
                  ) : (
                    /* Trạng thái Sidebar Icon-only */
                    <button
                      type="button"
                      onClick={() => handleGroupHeaderClick(group.id)}
                      title={group.groupTitle}
                      className={`w-full flex items-center justify-center p-2 rounded-xl transition-all ${
                        isOpen || hasActiveChild
                          ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                      }`}
                    >
                      <GroupIcon className="w-5 h-5" />
                    </button>
                  )}

                  {/* ACCORDION CONTENT: Sử dụng CSS Grid Animation (grid-rows-[1fr] / [0fr]) mượt mà 60fps tuyệt đối */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="mt-1 pl-2.5 ml-3 border-l-2 border-indigo-400/30 dark:border-indigo-500/30 space-y-1 py-1">
                        {visibleItems.map((item) => {
                          const isExact = item.href === '/admin';
                          const isNewPost = pathname === '/admin/bai-viet/them-moi';

                          let isActive = false;
                          if (isExact) {
                            isActive = pathname === '/admin';
                          } else if (item.href === '/admin/bai-viet') {
                            isActive = pathname.startsWith('/admin/bai-viet') && !isNewPost;
                          } else {
                            isActive = pathname.startsWith(item.href);
                          }

                          const isActionActive = item.actionHref && pathname === item.actionHref;
                          const Icon = item.icon;

                          return (
                            <div key={item.href} className="relative group">
                              <div
                                className={`flex items-center justify-between rounded-xl transition-all ${
                                  isActive
                                    ? 'bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 text-white shadow-md shadow-indigo-950/25 font-bold'
                                    : 'text-slate-700 dark:text-slate-400 hover:text-indigo-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                                }`}
                              >
                                <Link
                                  href={item.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  title={item.label}
                                  className="flex items-center gap-2.5 py-2 px-2.5 text-xs font-semibold flex-1 truncate"
                                >
                                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span className="truncate">{item.label}</span>
                                </Link>

                                {/* Shortcut tạo mới nếu có (như Viết bài mới) */}
                                {item.actionHref && (
                                  <Link
                                    href={item.actionHref}
                                    onClick={() => setMobileMenuOpen(false)}
                                    title={item.actionTitle || 'Thêm mới'}
                                    className={`mr-1.5 p-1 rounded-lg text-xs transition-colors flex items-center justify-center ${
                                      isActionActive
                                        ? 'bg-emerald-500 text-white shadow-sm'
                                        : isActive
                                        ? 'bg-white/20 hover:bg-white/30 text-white'
                                        : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10'
                                    }`}
                                  >
                                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                  </Link>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom profile & Back to main site */}
        <div className="pt-3 border-t-2 border-slate-200 dark:border-white/[0.08] space-y-2 mt-4">
          <Link
            href="/"
            title={isCollapsed ? 'Về trang chủ' : undefined}
            className={`flex items-center gap-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-400 hover:text-indigo-800 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors ${
              isCollapsed ? 'justify-center px-2' : 'px-3'
            }`}
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Về trang chủ</span>}
          </Link>

          {/* User badge */}
          <div
            className={`rounded-xl bg-slate-50 dark:bg-white/[0.02] border-2 border-slate-300 dark:border-white/[0.06] flex items-center ${
              isCollapsed ? 'justify-center p-2' : 'justify-between p-2.5'
            }`}
          >
            {!isCollapsed ? (
              <div className="truncate max-w-[150px]">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{adminUser?.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className={`text-[9px] font-mono px-1 py-0.2 rounded font-extrabold uppercase ${
                      isSuperAdmin
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                        : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300'
                    }`}
                  >
                    {isSuperAdmin ? 'Super Admin' : 'Editor'}
                  </span>
                </div>
              </div>
            ) : (
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                  isSuperAdmin ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'
                }`}
                title={`${adminUser?.name} (${isSuperAdmin ? 'Super Admin' : 'Editor'})`}
              >
                {adminUser?.name?.charAt(0) || 'A'}
              </div>
            )}

            {!isCollapsed && (
              <button
                onClick={handleLogout}
                title="Đăng xuất"
                className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.05]"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/70 dark:bg-[#09090b]">
        <div className="max-w-7xl mx-auto space-y-6">{children}</div>
      </main>
    </div>
  );
}
