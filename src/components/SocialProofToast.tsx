'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X, Sparkles, ShoppingBag } from 'lucide-react';

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
  const [index, setIndex] = useState(0);

  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) return;
    // Show first toast after 4s
    const firstTimer = setTimeout(() => {
      setCurrent(SAMPLE_EVENTS[0]);
      setVisible(true);
    }, 4000);

    // Rotate every 24 seconds
    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % SAMPLE_EVENTS.length;
        setCurrent(SAMPLE_EVENTS[next]);
        setVisible(true);
        return next;
      });
    }, 24000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, [isAdmin]);

  // Auto-hide toast after 7s
  useEffect(() => {
    if (isAdmin || !visible) return;
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 7000);
    return () => clearTimeout(hideTimer);
  }, [visible, current, isAdmin]);

  if (isAdmin || !current || !visible) return null;

  return (
    <aside
      aria-label="Thông báo giao dịch gần đây"
      className="fixed left-4 bottom-5 z-40 max-w-[340px] p-3.5 rounded-2xl bg-white/95 dark:bg-[#111116]/95 backdrop-blur-md border-2 border-slate-300 dark:border-white/20 shadow-xl shadow-slate-900/10 dark:shadow-black/40 text-slate-900 dark:text-slate-100 flex items-start gap-3 transition-all hover:opacity-90 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-800 via-indigo-700 to-blue-700 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-950/30 border border-indigo-400/40">
        <ShoppingBag className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-900 dark:text-white truncate">{current.name}</span>
          <span>({current.location})</span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 line-clamp-2 leading-snug">
          {current.action} <strong className="text-indigo-800 dark:text-indigo-400 font-bold">{current.product}</strong>
        </p>
        <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-1 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span>{current.time}</span>
        </div>
      </div>

      <button
        onClick={() => setVisible(false)}
        className="absolute top-2.5 right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        aria-label="Đóng thông báo"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
}
