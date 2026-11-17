'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Video,
  Cpu,
  Code2,
  Sparkles,
  ArrowRight,
  Gift,
  CheckCircle2,
  Download,
  Zap,
  Play,
  Layers,
} from 'lucide-react';
import { Product } from '@/types';

interface InteractiveRoadmapProps {
  products: Product[];
  onClaimFree: (resourceName: string, resourceId: string) => void;
}

interface RoadmapTrack {
  id: 'creator' | 'business' | 'developer';
  label: string;
  shortLabel: string;
  icon: any;
  targetAudience: string;
  description: string;
  badge: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    btn: string;
  };
  recommendedProductSlug: string;
  freebie: {
    id: string;
    title: string;
    desc: string;
    badge: string;
    thumbnail: string;
  };
}

const ROADMAP_TRACKS: RoadmapTrack[] = [
  {
    id: 'creator',
    label: 'Làm Video & Sáng Tạo Nội Dung',
    shortLabel: 'Creator & Video AI',
    icon: Video,
    targetAudience: 'Dành cho Creator, TikToker, Marketing, Freelancer làm nội dung số',
    description: 'Lộ trình từ tạo nhân vật AI nhất quán, viết kịch bản 3 giây đầu giữ chân người xem đến xuất bản video AI triệu view bằng Kling AI & Hedra.',
    badge: 'HOT NHẤT 2026',
    colorScheme: {
      bg: 'from-pink-500/10 via-purple-500/5 to-indigo-500/10',
      border: 'border-purple-400/30',
      text: 'text-purple-600 dark:text-purple-400',
      btn: 'bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700',
    },
    recommendedProductSlug: 'khoa-hoc-video-ai-trieu-view-tu-1-anh',
    freebie: {
      id: 'FREE-CREATOR-KIT',
      title: 'Túi Quà 0đ: Trọn Bộ 100+ Prompt FLUX & Kịch Bản Video AI',
      desc: 'Bộ Prompt chân dung thương mại FLUX, kịch bản mẫu CapCut và checklist giữ chân 3s đầu.',
      badge: 'Miễn phí 0đ',
      thumbnail: '/images/flux-prompt-bundle.jpg',
    },
  },
  {
    id: 'business',
    label: 'Tự Động Hóa Vận Hành & Bán Hàng',
    shortLabel: 'Tự Động Hóa n8n',
    icon: Cpu,
    targetAudience: 'Dành cho Chủ shop, Doanh nghiệp SME, Quản trị viên cần giảm tải 80% thời gian',
    description: 'Xây dựng hệ thống tự động hóa hoàn toàn: Đăng bài tự động đa kênh, khớp đơn VietQR tự động qua SePay, gửi email kích hoạt và báo cáo doanh thu về Telegram 24/7.',
    badge: 'TIẾT KIỆM 80% THỜI GIAN',
    colorScheme: {
      bg: 'from-emerald-500/10 via-teal-500/5 to-cyan-500/10',
      border: 'border-emerald-400/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      btn: 'bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700',
    },
    recommendedProductSlug: 'workflow-n8n-dang-bai-tu-dong-da-kenh',
    freebie: {
      id: 'FREE-N8N-KIT',
      title: 'Túi Quà 0đ: Bộ 3 Template Workflow n8n Thực Chiến (JSON)',
      desc: 'File JSON import 1-click: Tự động tổng hợp tin tức, bot Telegram báo đơn và kịch bản webhook.',
      badge: 'Miễn phí 0đ',
      thumbnail: '/images/products/n8n-workflow-demo.jpg',
    },
  },
  {
    id: 'developer',
    label: 'Coding & Phát Triển Agent AI',
    shortLabel: 'Agent & AI Coding',
    icon: Code2,
    targetAudience: 'Dành cho Lập trình viên, Kỹ thuật viên, AI Engineer muốn tăng tốc độ code x5 lần',
    description: 'Làm chủ Agentic Coding với Claude 3.7, Cursor AI, MCP Servers và Antigravity framework để xây dựng ứng dụng full-stack từ ý tưởng đến production trong vài giờ.',
    badge: 'X5 TỐC ĐỘ CODE',
    colorScheme: {
      bg: 'from-blue-500/10 via-indigo-500/5 to-violet-500/10',
      border: 'border-blue-400/30',
      text: 'text-blue-600 dark:text-cyan-400',
      btn: 'bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900',
    },
    recommendedProductSlug: 'skill-claude-37-chatgpt-viet-kich-ban-youtube',
    freebie: {
      id: 'FREE-DEV-KIT',
      title: 'Túi Quà 0đ: Ebook Cẩm Nang AI Agent & 50+ Prompt Cho Coder',
      desc: 'Bộ Prompt tối ưu Cursor, cấu hình Rule Agent và hướng dẫn tích hợp MCP server thực tế.',
      badge: 'Miễn phí 0đ',
      thumbnail: '/images/products/skill-claude.svg',
    },
  },
];

export default function InteractiveRoadmap({ products, onClaimFree }: InteractiveRoadmapProps) {
  const [selectedTrack, setSelectedTrack] = useState<'creator' | 'business' | 'developer'>('creator');

  const currentTrack = ROADMAP_TRACKS.find((t) => t.id === selectedTrack) || ROADMAP_TRACKS[0];
  const Icon = currentTrack.icon;

  // Tìm sản phẩm gợi ý
  const recommendedProduct =
    products.find((p) => p.slug === currentTrack.recommendedProductSlug) ||
    products.find((p) => p.category?.toLowerCase().includes(currentTrack.id)) ||
    products[0];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-800 dark:text-cyan-300 text-xs font-mono font-bold mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LỘ TRÌNH THỰC CHIẾN THEO NHU CẦU</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Bạn Đang Cần Giải Pháp Nào?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Chọn đúng mục tiêu để nhận ngay công cụ tuyển chọn và bộ quà tặng 0đ tương ứng.
          </p>
        </div>
      </div>

      {/* Tabs Selector: 3 Lộ Trình Lớn */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-300 dark:border-white/[0.08]">
        {ROADMAP_TRACKS.map((track) => {
          const TabIcon = track.icon;
          const isActive = selectedTrack === track.id;
          return (
            <button
              key={track.id}
              onClick={() => setSelectedTrack(track.id)}
              className={`flex items-center justify-center sm:justify-start gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer select-none text-left ${
                isActive
                  ? 'bg-white dark:bg-[#151520] text-slate-900 dark:text-white shadow-md border-2 border-indigo-500/50 dark:border-indigo-400/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.02]'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400'
                }`}
              >
                <TabIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block truncate font-extrabold">{track.shortLabel}</span>
                <span className="hidden sm:block text-[10.5px] font-mono text-slate-400 dark:text-slate-500 truncate">
                  {track.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Track Content Card - Bento Container */}
      <div className={`p-5 sm:p-7 rounded-3xl bg-gradient-to-br ${currentTrack.colorScheme.bg} border-2 ${currentTrack.colorScheme.border} shadow-lg transition-all duration-300 space-y-6`}>
        {/* Intro Banner */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-cyan-300 border border-indigo-300 dark:border-indigo-500/30">
              {currentTrack.badge}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {currentTrack.targetAudience}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {currentTrack.label}
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
            {currentTrack.description}
          </p>
        </div>

        {/* 2 Cột: Bên Trái là Giải Pháp VIP Khuyên Dùng, Bên Phải là Túi Quà 0đ Tương Ứng */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Cột 1: Giải pháp VIP cốt lõi (7 cols) */}
          {recommendedProduct && (
            <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-300 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-extrabold text-indigo-700 dark:text-cyan-400 uppercase tracking-wide flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Giải pháp đề xuất cho bạn
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20">
                    SẴN SÀNG SỬ DỤNG
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {recommendedProduct.thumbnail && (
                    <div className="relative w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0 border border-slate-200 dark:border-white/10">
                      <Image
                        src={recommendedProduct.thumbnail}
                        alt={recommendedProduct.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {recommendedProduct.name}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {recommendedProduct.description}
                    </p>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-base font-black text-indigo-700 dark:text-cyan-400 font-mono">
                        {new Intl.NumberFormat('vi-VN').format(recommendedProduct.price)}đ
                      </span>
                      {recommendedProduct.original_price && (
                        <span className="text-xs line-through text-slate-400 font-mono">
                          {new Intl.NumberFormat('vi-VN').format(recommendedProduct.original_price)}đ
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200 dark:border-white/[0.06]">
                <Link
                  href={`/san-pham/${recommendedProduct.slug || recommendedProduct.pid}`}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl ${currentTrack.colorScheme.btn} hover:opacity-90 text-white font-bold text-xs shadow-md shadow-indigo-950/20 transition-all cursor-pointer`}
                >
                  <span>Khám Phá Giải Pháp Này</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/san-pham"
                  className="text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-white font-semibold transition"
                >
                  Xem thêm các công cụ liên quan →
                </Link>
              </div>
            </div>
          )}

          {/* Cột 2: Túi Quà Tặng 0đ Tương Ứng (5 cols) - KHÔNG còn form dài lê thê */}
          <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-slate-900 text-white border-2 border-indigo-400/30 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5" />
                  Gói tài nguyên tặng kèm
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {currentTrack.freebie.badge}
                </span>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                  {currentTrack.freebie.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentTrack.freebie.desc}
                </p>
              </div>

              <ul className="text-[11.5px] text-slate-300 space-y-1 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Kích hoạt link tải tự động ngay lập tức</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Được cập nhật thêm tài liệu mới định kỳ</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onClaimFree(currentTrack.freebie.title, currentTrack.freebie.id)}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/30 active:scale-[0.99] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Nhận Gói Quà 0đ Này Ngay</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

