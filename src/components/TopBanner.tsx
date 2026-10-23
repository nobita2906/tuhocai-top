'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles, ArrowRight } from 'lucide-react';

export default function TopBanner() {
  const [banner, setBanner] = useState<{
    enabled: boolean;
    text: string;
    url: string;
  } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/settings/public')
      .then((res) => res.json())
      .then((data) => {
        if (data.banner_enabled && data.banner_text) {
          setBanner({
            enabled: true,
            text: data.banner_text,
            url: data.banner_url || '/san-pham',
          });
        }
      })
      .catch(() => setBanner(null));
  }, []);

  if (!banner || !banner.enabled || dismissed) return null;

  return (
    <aside aria-label="Khuyến mãi đặc biệt" className="relative z-50 bg-gradient-to-r from-indigo-700 via-purple-700 to-cyan-600 text-white text-xs py-2 px-4 shadow-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center justify-center gap-2 truncate">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 animate-pulse" />
          <span className="font-semibold truncate">{banner.text}</span>
          <Link
            href={banner.url}
            className="hidden sm:inline-flex items-center gap-1 font-bold underline underline-offset-2 hover:text-cyan-200 transition shrink-0 ml-1"
          >
            Khám phá ngay <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10 transition shrink-0"
          title="Đóng thông báo"
          aria-label="Đóng thông báo"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
