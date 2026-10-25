'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Layers, MessageCircle, LogOut, ChevronDown, Menu, X, Cpu, ShieldAlert, PackageCheck } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import MyVaultModal from '@/components/MyVaultModal';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string; email: string; role?: string; libraryCount?: number } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [vaultOpen, setVaultOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setUserDropdownOpen(false);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Kho Workflow & Skill', href: '/san-pham' },
    { label: 'Tài liệu Miễn Phí', href: '/#tai-lieu-free' },
    { label: 'Tin tức & Hướng dẫn', href: '/bai-viet' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-300 dark:border-white/[0.08] bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-xl shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Brand Logo - Không bao giờ rớt dòng */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 whitespace-nowrap group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-800 via-indigo-700 to-blue-700 p-[1px] shadow-md shadow-indigo-900/20 group-hover:opacity-90 transition-all shrink-0">
              <div className="w-full h-full bg-white dark:bg-[#111116] rounded-[11px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-indigo-800 dark:text-cyan-400 transition-all" />
              </div>
            </div>
            <div className="flex flex-col shrink-0">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="font-extrabold text-base lg:text-lg tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  TỰ HỌC AI
                </span>
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/10 text-indigo-900 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-500/25 shrink-0">
                  TOP
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-semibold whitespace-nowrap">tuhocai.top</span>
            </div>
          </Link>

          {/* Desktop Nav - Luôn nằm trên 1 dòng duy nhất, không bao giờ rớt dòng trên Chrome */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
            <Link
              href="/"
              className={`whitespace-nowrap shrink-0 px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-bold transition-all ${
                pathname === '/'
                  ? 'text-indigo-900 dark:text-indigo-400 bg-indigo-100/90 dark:bg-indigo-500/10 border border-indigo-300 dark:border-indigo-500/30'
                  : 'text-slate-800 dark:text-slate-200 hover:opacity-75 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
              }`}
            >
              Trang chủ
            </Link>

            <Link
              href="/san-pham"
              className={`whitespace-nowrap shrink-0 px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-bold transition-all ${
                pathname.startsWith('/san-pham')
                  ? 'text-indigo-900 dark:text-indigo-400 bg-indigo-100/90 dark:bg-indigo-500/10 border border-indigo-300 dark:border-indigo-500/30'
                  : 'text-slate-800 dark:text-slate-200 hover:opacity-75 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
              }`}
            >
              <span className="hidden xl:inline">Kho Workflow & Skill</span>
              <span className="xl:hidden">Workflow & Skill</span>
            </Link>

            <Link
              href="/#tai-lieu-free"
              className="whitespace-nowrap shrink-0 px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-bold text-slate-800 dark:text-slate-200 hover:opacity-75 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all"
            >
              <span className="hidden xl:inline">Tài liệu Miễn Phí</span>
              <span className="xl:hidden">Tài liệu 0đ</span>
            </Link>

            <Link
              href="/bai-viet"
              className={`whitespace-nowrap shrink-0 px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-bold transition-all ${
                pathname.startsWith('/bai-viet')
                  ? 'text-indigo-900 dark:text-indigo-400 bg-indigo-100/90 dark:bg-indigo-500/10 border border-indigo-300 dark:border-indigo-500/30'
                  : 'text-slate-800 dark:text-slate-200 hover:opacity-75 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
              }`}
            >
              <span className="hidden xl:inline">Tin tức & Hướng dẫn</span>
              <span className="xl:hidden">Tin tức</span>
            </Link>

            {/* Kho Của Tôi button - Đậm đà mặc định, hover mờ lại */}
            <button
              onClick={() => setVaultOpen(true)}
              className="whitespace-nowrap shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-bold text-indigo-950 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-500/20 hover:opacity-75 border-2 border-indigo-400 dark:border-indigo-500/40 transition-all shadow-xs"
              title="Tra cứu & tải lại tài nguyên đã mua"
            >
              <PackageCheck className="w-4 h-4 shrink-0 text-indigo-800 dark:text-indigo-400" />
              <span>Kho Của Tôi</span>
            </button>

            {/* Nhóm Zalo VIP - Đậm đà mặc định, hover mờ lại */}
            <a
              href="https://zalo.me/g/tuhocai"
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-bold text-emerald-950 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/20 hover:opacity-75 border-2 border-emerald-400 dark:border-emerald-500/40 transition-all shadow-xs ml-0.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
              <MessageCircle className="w-4 h-4 shrink-0 text-emerald-800 dark:text-emerald-400" />
              <span className="hidden xl:inline">Nhóm Zalo VIP</span>
              <span className="xl:hidden">Zalo VIP</span>
            </a>
          </nav>

          {/* User Auth, Theme Toggle, Actions - Giữ nguyên hàng */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0 whitespace-nowrap">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {user ? (
              <div className="relative shrink-0">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-300 dark:border-white/[0.08] hover:border-slate-400 dark:hover:border-white/[0.16] text-xs xl:text-sm text-slate-900 dark:text-slate-200 transition-colors shadow-xs shrink-0 whitespace-nowrap"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-400 font-bold flex items-center justify-center text-xs shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate font-bold">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#111116] border border-slate-300 dark:border-white/[0.1] shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-200 dark:border-white/[0.06]">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Đã đăng nhập với</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.email}</p>
                    </div>
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 border-b border-slate-100 dark:border-white/[0.06]"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                        Trang Quản Trị (Admin)
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setVaultOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-800 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] text-left font-medium"
                    >
                      <PackageCheck className="w-4 h-4 shrink-0" />
                      Kho Của Tôi
                    </button>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-800 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] font-medium"
                    >
                      <Layers className="w-4 h-4 shrink-0" />
                      Kho tài liệu đã lưu
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-left font-semibold"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs xl:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-800 dark:hover:text-white transition-colors whitespace-nowrap"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 text-xs xl:text-sm font-bold text-white bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 hover:opacity-85 rounded-xl shadow-md shadow-indigo-900/30 transition-all hover:scale-[0.99] whitespace-nowrap shrink-0"
                >
                  Tạo tài khoản
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions: Theme toggle & Hamburger (Hiện khi dưới 1024px) */}
          <div className="lg:hidden flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer (Hiện dưới 1024px) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-300 dark:border-white/[0.08] bg-white/98 dark:bg-[#09090b]/98 backdrop-blur-2xl px-4 py-4 space-y-3 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-800 dark:text-slate-300 hover:text-indigo-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]"
              >
                {link.label}
              </Link>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setVaultOpen(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-indigo-800 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-300 dark:border-indigo-500/25"
            >
              <PackageCheck className="w-4 h-4" />
              Kho Của Tôi (Tra cứu đơn hàng)
            </button>

            <a
              href="https://zalo.me/g/tuhocai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/25"
            >
              <MessageCircle className="w-4 h-4" />
              Nhóm Zalo VIP
            </a>

            {user ? (
              <div className="pt-3 border-t border-slate-300 dark:border-white/[0.08] space-y-2">
                <div className="px-3 py-1 text-xs text-slate-500 dark:text-slate-400 truncate">
                  Xin chào, <strong className="text-slate-900 dark:text-white">{user.name}</strong>
                </div>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/25"
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    Trang Quản Trị (Admin)
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-800 dark:text-slate-300 bg-slate-100 dark:bg-white/[0.05] font-semibold"
                >
                  <Layers className="w-4 h-4" />
                  Kho tài liệu của tôi
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 text-left font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-300 dark:border-white/[0.08] flex items-center gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-sm font-bold text-slate-800 dark:text-slate-300 bg-slate-100 dark:bg-white/[0.05] rounded-xl"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-sm font-bold text-white bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 rounded-xl shadow-md"
                >
                  Tạo tài khoản
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Kho Của Tôi Modal */}
      <MyVaultModal isOpen={vaultOpen} onClose={() => setVaultOpen(false)} />
    </>
  );
}
