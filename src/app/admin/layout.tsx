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
} from 'lucide-react';

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
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm font-mono text-slate-400">Đang xác thực quyền Quản trị viên...</p>
      </div>
    );
  }

  const navItems = [
    { label: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
    { label: 'Quản lý bài viết', href: '/admin/bai-viet', icon: FileText },
    { label: 'Viết bài mới', href: '/admin/bai-viet/them-moi', icon: PlusCircle },
    { label: 'Quản lý thành viên', href: '/admin/thanh-vien', icon: Users },
    { label: 'Kho sản phẩm', href: '/admin/san-pham', icon: Package },
    { label: 'Đơn hàng & VietQR', href: '/admin/don-hang', icon: CreditCard },
    { label: 'Danh sách Leads 0đ', href: '/admin/leads', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 flex flex-col md:flex-row">
      {/* Top Mobile Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-[#111116]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm text-white">TỰ HỌC AI ADMIN</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Desktop */}
      <aside
        className={`w-full md:w-64 bg-[#111116] border-r border-white/[0.08] flex flex-col justify-between p-4 z-40 transition-all ${
          mobileMenuOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="space-y-6">
          {/* Brand header */}
          <div className="hidden md:flex items-center gap-2.5 px-2 py-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-[#111116] rounded-[11px] flex items-center justify-center">
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white tracking-tight">TỰ HỌC AI</span>
                <span className="font-mono text-[9px] font-bold px-1 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  ADMIN
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Bảng điều khiển</span>
            </div>
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
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
        <div className="pt-4 border-t border-white/[0.08] space-y-2 mt-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-cyan-400 hover:bg-white/[0.04] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về trang chủ tuhocai.top</span>
          </Link>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div className="truncate max-w-[130px]">
              <p className="text-xs font-bold text-white truncate">{adminUser?.name}</p>
              <p className="text-[10px] font-mono text-indigo-400 truncate">{adminUser?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-white/[0.05]"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#09090b]">
        <div className="max-w-7xl mx-auto space-y-6">{children}</div>
      </main>
    </div>
  );
}
