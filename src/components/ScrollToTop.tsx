'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop || 0;
      if (scrollPos > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /**
   * Hiệu ứng trượt cuộn trang siêu êm (Momentum Smooth Slide)
   * Sử dụng thuật toán Quartic Ease-Out giúp khởi đầu nhanh và giảm tốc êm ái
   */
  const handleScrollToTop = () => {
    if (isAnimatingRef.current) return;

    const startY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
    if (startY <= 0) return;

    isAnimatingRef.current = true;
    setIsSliding(true);

    // Thời gian trượt: tối thiểu 450ms, tối đa 750ms tùy theo độ dài trang
    const duration = Math.min(Math.max(startY * 0.35, 450), 750);
    let startTime: number | null = null;

    // Easing Quartic Ease-Out: f(t) = 1 - (1 - t)^4
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const step = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeOutQuart(progress);

      const targetY = Math.round(startY * (1 - ease));
      window.scrollTo(0, targetY);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        window.scrollTo(0, 0);
        isAnimatingRef.current = false;
        setTimeout(() => setIsSliding(false), 200);
      }
    };

    requestAnimationFrame(step);
  };

  // Ẩn trên các trang Admin quản trị
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const hasStickyBottom = pathname?.startsWith('/lp');

  return (
    <button
      type="button"
      onClick={handleScrollToTop}
      aria-label="Cuộn lên đầu trang"
      title="Lên đầu trang"
      className={`fixed z-30 transition-all duration-300 ease-out cursor-pointer flex items-center justify-center rounded-full shadow-lg ${
        hasStickyBottom
          ? 'bottom-[136px] sm:bottom-[88px] right-4 sm:right-6'
          : 'bottom-[76px] sm:bottom-[88px] right-4 sm:right-6'
      } ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      } ${
        isSliding
          ? '-translate-y-2 scale-105 ring-4 ring-indigo-500/30 border-indigo-500 bg-indigo-600 text-white shadow-indigo-500/40'
          : 'bg-white/95 dark:bg-[#151520]/95 backdrop-blur-md border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:border-indigo-500/60 dark:hover:border-cyan-400/60 hover:scale-110 active:scale-95 shadow-black/10 dark:shadow-black/40'
      } w-11 h-11 sm:w-12 sm:h-12 group overflow-hidden`}
    >
      {/* Icon Mũi Tên Với Hiệu Ứng Bắn Lướt (Slide / Lift) */}
      <div className="relative w-5 h-5 flex items-center justify-center">
        <ArrowUp
          className={`w-5 h-5 transition-all duration-300 ${
            isSliding
              ? '-translate-y-4 opacity-0'
              : 'translate-y-0 opacity-100 group-hover:-translate-y-1'
          } ${
            isSliding
              ? 'text-white'
              : 'text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-cyan-400'
          }`}
        />

        {/* Mũi tên thứ 2 trượt vào từ bên dưới khi đang phóng lên */}
        {isSliding && (
          <ArrowUp className="w-5 h-5 text-white absolute animate-in slide-in-from-bottom duration-300" />
        )}
      </div>

      <span className="sr-only">Lên đầu trang</span>
    </button>
  );
}
