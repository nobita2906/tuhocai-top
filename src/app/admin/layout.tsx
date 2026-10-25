'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  Package,
  CreditCard,
  Mail,
  ArrowLeft,
  LogOut,
  ShieldAlert,
  Loader2,
  Menu,
  X,
  Cpu,
  Sparkles,
  Settings,
  BookOpen,
  Share2,
} from 'lucide-react';

import ThemeToggle from '@/components/ThemeToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkAdminAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!data.authenticated || data.user.role !== 'ADMIN') {
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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#09090b] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-700 dark:text-indigo-400 animate-spin" />
        <p className="text-sm font-mono text-slate-600 dark:text-slate-400 font-semibold">Đang xác thực quyền Quản trị viên...</p>
      </div>
    );
  }

  const navItems = [
    { label: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
    { label: 'Không gian nội bộ (Wiki)', href: '/admin/noi-bo', icon: BookOpen },
    { label: 'Quản lý bài viết', href: '/admin/bai-viet', icon: FileText },
    { label: 'Viết bài mới', href: '/admin/bai-viet/them-moi', icon: PlusCircle },
    { label: 'Quản lý thành viên', href: '/admin/thanh-vien', icon: Users },
    { label: 'Kho sản phẩm', href: '/admin/san-pham', icon: Package },
    { label: 'Đơn hàng & VietQR', href: '/admin/don-hang', icon: CreditCard },
    { label: 'Đối tác Affiliate', href: '/admin/affiliate', icon: Share2 },
    { label: 'Danh sách Leads 0đ', href: '/admin/leads', icon: Mail },
    { label: 'Cài đặt Website & QR', href: '/admin/cai-dat', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#09090b] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200">
      {/* Top Mobile Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b-2 border-slate-300 dark:border-white/[0.08] bg-white dark:bg-[#111116]">
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
            className="p-2 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Desktop */}
      <aside
        className={`w-full md:w-64 bg-white dark:bg-[#111116] border-r-2 border-slate-300 dark:border-white/[0.08] flex flex-col justify-between p-4 z-40 transition-all ${
          mobileMenuOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="space-y-6">
          {/* Brand header */}
          <div className="hidden md:flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-800 via-indigo-700 to-blue-700 p-[1px] shadow-sm">
                <div className="w-full h-full bg-white dark:bg-[#111116] rounded-[11px] flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-indigo-800 dark:text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">TỰ HỌC AI</span>
                  <span className="font-mono text-[9px] font-bold px-1 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-900 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-500/30">
                    ADMIN
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Bảng điều khiển</span>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* Navigation links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 text-white shadow-md shadow-indigo-950/25'
                      : 'text-slate-700 dark:text-slate-400 hover:text-indigo-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom profile & Back to main site */}
        <div className="pt-4 border-t-2 border-slate-200 dark:border-white/[0.08] space-y-2 mt-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-400 hover:text-indigo-800 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về trang chủ tuhocai.top</span>
          </Link>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border-2 border-slate-300 dark:border-white/[0.06] flex items-center justify-between">
            <div className="truncate max-w-[130px]">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{adminUser?.name}</p>
              <p className="text-[10px] font-mono text-indigo-700 dark:text-indigo-400 truncate font-semibold">{adminUser?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.05]"
            >
              <LogOut className="w-4 h-4" />
            </button>
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
