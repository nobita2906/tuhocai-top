'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X, ShoppingBag } from 'lucide-react';

interface ToastItem {
  name: string;
  location: string;
  action: string;
  product: string;
  time: string;
}

const SAMPLE_EVENTS: ToastItem[] = [
  {
    name: 'Anh Tuấn',
    location: 'Hà Nội',
    action: 'vừa sở hữu',
    product: 'Workflow n8n: Tự động tổng hợp tin tức AI hàng ngày',
    time: '2 phút trước',
  },
  {
    name: 'Chị Mai Hương',
    location: 'TP.HCM',
    action: 'vừa tải',
    product: 'Trọn bộ 100+ Prompt FLUX & Midjourney VIP',
    time: '5 phút trước',
  },
  {
    name: 'Anh Hoàng Nam',
    location: 'Đà Nẵng',
    action: 'vừa mua',
    product: 'Skill Claude 3.7: Viết kịch bản YouTube triệu view',
    time: '9 phút trước',
  },
  {
    name: 'Một thành viên',
    location: 'Bình Dương',
    action: 'vừa tải',
    product: 'Bộ tài liệu n8n Automation thực chiến 2026 (0đ)',
    time: '14 phút trước',
  },
  {
    name: 'Anh Đức Trọng',
    location: 'Hải Phòng',
    action: 'vừa sở hữu',
    product: 'Workflow n8n: Đăng bài tự động đa kênh Facebook & Blog',
    time: '18 phút trước',
  },
];

export default function SocialProofToast() {
  const pathname = usePathname();
  const [current, setCurrent] = useState<ToastItem | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissedUntil, setDismissedUntil] = useState<number>(0);

  // Ẩn hoàn toàn trên các trang quản trị, thanh toán, kho học và đăng nhập để không làm phiền
  const isExcludedPage =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/thanh-toan') ||
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/register');

  useEffect(() => {
    if (isExcludedPage) return;

    // Lần đầu xuất hiện sau 14 giây để khách làm quen trang web, không bị sốc pop-up
    const firstTimer = setTimeout(() => {
      let isDismissed = false;
      try {
        isDismissed = sessionStorage.getItem('tuhocai_toast_dismissed') === 'true';
      } catch (_) {}

      if (!isDismissed && Date.now() > dismissedUntil) {
        setCurrent(SAMPLE_EVENTS[0]);
        setVisible(true);
      }
    }, 14000);

    // Chu kỳ xuất hiện lại giãn cách 60 giây (thay vì 22s dồn dập gây phiền toái)
    const interval = setInterval(() => {
      let isDismissed = false;
      try {
        isDismissed = sessionStorage.getItem('tuhocai_toast_dismissed') === 'true';
      } catch (_) {}

      if (!isDismissed && Date.now() > dismissedUntil) {
        setCurrent((prev) => {
          const currentIndex = prev ? SAMPLE_EVENTS.findIndex((e) => e.product === prev.product) : -1;
          const nextIndex = (currentIndex + 1) % SAMPLE_EVENTS.length;
          return SAMPLE_EVENTS[nextIndex];
        });
        setVisible(true);
      }
    }, 60000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, [isExcludedPage, dismissedUntil]);

  // Tự động ẩn toast sau 3.5 giây (vừa đủ lướt mắt qua là biến mất, không chiếm màn hình)
  useEffect(() => {
    if (isExcludedPage || !visible) return;
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 3500);
    return () => clearTimeout(hideTimer);
  }, [visible, current, isExcludedPage]);

  const handleDismiss = () => {
    setVisible(false);
    // Lưu vào sessionStorage để không làm phiền lại trong cả phiên duyệt web
    try {
      sessionStorage.setItem('tuhocai_toast_dismissed', 'true');
    } catch (_) {}
    setDismissedUntil(Date.now() + 600000); // Tối thiểu 10 phút
  };

  if (isExcludedPage || !current || !visible) return null;

  return (
    <aside
      aria-label="Thông báo giao dịch gần đây"
      className="fixed left-3 sm:left-6 bottom-4 sm:bottom-6 z-40 max-w-[calc(100vw-88px)] sm:max-w-[420px] py-1.5 pl-2.5 pr-2 rounded-full bg-slate-900/95 dark:bg-[#15151e]/95 backdrop-blur-md border border-slate-700/70 dark:border-white/15 shadow-xl shadow-black/25 text-white flex items-center gap-2 select-none pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      {/* Icon shopping mini với chấm xanh live */}
      <div className="relative w-5 h-5 rounded-full bg-indigo-500/20 text-cyan-300 flex items-center justify-center shrink-0">
        <ShoppingBag className="w-2.5 h-2.5" />
        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 ring-1 ring-slate-900 animate-pulse" />
      </div>

      {/* 1 dòng text súc tích, tinh gọn */}
      <div className="flex-1 min-w-0 text-xs truncate leading-none py-0.5">
        <span className="font-bold text-white mr-1">{current.name}</span>
        <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">({current.location})</span>
        <span className="text-slate-300">
          {current.action} <strong className="text-cyan-400 font-semibold">{current.product}</strong>
        </span>
        <span className="text-slate-400 text-[10.5px] ml-1.5 font-mono">· {current.time}</span>
      </div>

      {/* Nút đóng tinh tế */}
      <button
        onClick={handleDismiss}
        className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer ml-0.5"
        aria-label="Đóng thông báo"
      >
        <X className="w-3 h-3" />
      </button>
    </aside>
  );
}
