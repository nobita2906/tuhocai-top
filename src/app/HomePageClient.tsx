'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Post } from '@/types';
import ProductCard from '@/components/ProductCard';
import LeadMagnetModal from '@/components/LeadMagnetModal';
import FeaturedSlideSection from '@/components/FeaturedSlideSection';
import InteractiveRoadmap from '@/components/InteractiveRoadmap';
import TutorialsPlaybookSection from '@/components/TutorialsPlaybookSection';
import TechNewsCompactList from '@/components/TechNewsCompactList';
import BundlesSection from '@/components/BundlesSection';
import {
  Zap,
  Clock,
  Eye,
  ArrowRight,
  Download,
  MessageCircle,
  CheckCircle2,
  Send,
  Loader2,
  Sparkles,
  Search,
  X,
} from 'lucide-react';

interface HomePageClientProps {
  initialProducts: Product[];
  initialPosts: Post[];
}

function getPostCover(post: Post): string {
  if (post.thumbnail) return post.thumbnail;
  const slug = post.slug?.toLowerCase() || '';
  if (slug.includes('claude')) return '/images/products/skill-claude.svg';
  if (slug.includes('n8n') || slug.includes('dang-bai')) return '/images/products/n8n-workflow-demo.jpg';
  if (slug.includes('cursor') || slug.includes('code')) return '/images/products/skill-codex.svg';
  if (slug.includes('ky-nang') || slug.includes('skills')) return '/images/products/skill-chatgpt.svg';
  return '/images/products/flux-prompt-bundle.jpg';
}

type GoalFilter = 'all' | 'video' | 'automation' | 'design' | 'nocode' | 'free';

const GOAL_OPTIONS: { id: GoalFilter; label: string; icon: string }[] = [
  { id: 'all', label: 'Tất cả mục tiêu', icon: '🎯' },
  { id: 'video', label: 'Xây kênh Video AI', icon: '🎬' },
  { id: 'automation', label: 'Tự động hóa bán hàng', icon: '⚙️' },
  { id: 'design', label: 'Tạo ảnh & Thiết kế', icon: '🎨' },
  { id: 'nocode', label: 'Tạo App & Không code', icon: '💻' },
  { id: 'free', label: 'Quà tặng 0đ', icon: '🎁' },
];

export default function HomePageClient({ initialProducts, initialPosts }: HomePageClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'workflow' | 'skill' | 'prompt' | 'free'>('all');
  const [selectedGoal, setSelectedGoal] = useState<GoalFilter>('all');
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<{ id: string; name: string; url?: string } | null>(null);
  const [publicSettings, setPublicSettings] = useState<{
    zalo_group_url?: string;
    hotline?: string;
    free_resource_title?: string;
    free_resource_download_url?: string;
  }>({});

  useEffect(() => {
    fetch('/api/settings/public')
      .then((res) => res.json())
      .then((data) => setPublicSettings(data))
      .catch(() => {});
  }, []);

  // Filter products: Lọc thông minh kết hợp Mục Tiêu Thực Chiến + Định Dạng + Tìm Kiếm
  const filteredProducts = initialProducts
    .filter((p) => {
      const pText = `${p.name} ${p.description || ''} ${p.pid} ${p.category || ''}`.toLowerCase();

      const matchSearch =
        homeSearchQuery.trim() === '' ||
        pText.includes(homeSearchQuery.toLowerCase());

      if (!matchSearch) return false;

      // 1. Lọc theo Mục tiêu (Goal Filter)
      if (selectedGoal === 'video') {
        const isVideo =
          pText.includes('video') ||
          pText.includes('drama') ||
          pText.includes('tiktok') ||
          p.pid.includes('VIP-297') ||
          p.pid.includes('DRAMA');
        if (!isVideo) return false;
      } else if (selectedGoal === 'automation') {
        const isAuto =
          pText.includes('workflow') ||
          pText.includes('n8n') ||
          pText.includes('tự động') ||
          pText.includes('auto') ||
          pText.includes('email') ||
          pText.includes('sheets');
        if (!isAuto) return false;
      } else if (selectedGoal === 'design') {
        const isDesign =
          pText.includes('prompt') ||
          pText.includes('ảnh') ||
          pText.includes('landing') ||
          pText.includes('midjourney') ||
          pText.includes('flux') ||
          pText.includes('clone');
        if (!isDesign) return false;
      } else if (selectedGoal === 'nocode') {
        const isNocode =
          pText.includes('code') ||
          pText.includes('app') ||
          pText.includes('codex') ||
          pText.includes('gpt') ||
          pText.includes('lập trình');
        if (!isNocode) return false;
      } else if (selectedGoal === 'free') {
        if (p.price !== 0) return false;
      }

      // 2. Lọc theo Tab định dạng (Format Tab)
      if (activeTab === 'free') return p.price === 0;
      if (activeTab === 'workflow') return p.category?.toLowerCase().includes('workflow');
      if (activeTab === 'skill') return p.category?.toLowerCase().includes('skill');
      if (activeTab === 'prompt') return p.category?.toLowerCase().includes('prompt');

      // Ở tab "Tất cả" & không chọn Goal riêng lẻ: Ưu tiên hiển thị sản phẩm VIP có phí để định vị thương hiệu chuyên nghiệp
      if (selectedGoal === 'all') {
        return p.price > 0;
      }

      return true;
    })
    .sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0));

  const handleOpenFreeModal = (product?: Product) => {
    if (product) {
      setSelectedResource({
        id: product.pid,
        name: product.name,
        url: product.download_url || undefined,
      });
    } else {
      setSelectedResource({
        id: 'FREE-BUNDLE-2026',
        name: publicSettings.free_resource_title || 'Trọn bộ 100+ Prompt FLUX & Midjourney Thương Mại',
        url: publicSettings.free_resource_download_url,
      });
    }
    setLeadModalOpen(true);
  };

  return (
    <div className="space-y-10 sm:space-y-14 pb-16 overflow-hidden transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 pb-2 sm:pb-3 cyber-grid radial-spotlight">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-5">
          {/* Top subtle AI badge - Chuẩn SEO, giàu từ khóa tìm kiếm và độc bản */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-white/[0.05] border-2 border-indigo-600/70 dark:border-indigo-500/30 text-indigo-900 dark:text-indigo-300 font-mono text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-700 dark:text-cyan-400" />
            <span>✦ KHO TÀI NGUYÊN & CÔNG CỤ AI THỰC CHIẾN</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            Công cụ AI giúp bạn <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 dark:from-indigo-400 dark:via-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">
              làm nội dung
            </span>{' '}
            và kiếm tiền nhanh hơn
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            Skill viết kịch bản, Skill tạo ảnh, Workflow làm video & n8n, Mã lệnh Prompt thương mại, Sub Agent và Trợ lý AI — được <strong>Tự Học AI</strong> đúc kết từ thực chiến xây kênh & tự động hóa. Mua xong dùng ngay, không cần biết kỹ thuật.
          </p>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Cần tư vấn chọn công cụ phù hợp? Gọi / Zalo:{' '}
            <a
              href={`https://zalo.me/${(publicSettings.hotline || '0938494303').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-800 dark:text-cyan-400 font-bold hover:underline"
            >
              {publicSettings.hotline || '0938.494.303'}
            </a>
          </p>

          {/* Call to actions: 3 nút tinh gọn, cân đối */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2">
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 hover:opacity-85 text-white font-black text-sm shadow-xl shadow-indigo-950/30 transition-all hover:scale-[0.99] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 text-white" />
              Khám Phá Kho Công Cụ & Khóa Học
            </Link>

            <button
              onClick={() => handleOpenFreeModal()}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-white/[0.05] hover:opacity-85 text-slate-900 dark:text-white border-2 border-slate-400 dark:border-white/20 font-bold text-sm transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-indigo-800 dark:text-cyan-400" />
              Nhận Bộ Tài Liệu 0đ
            </button>

            <a
              href={publicSettings.zalo_group_url || 'https://zalo.me/g/tuhocai'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 hover:opacity-85 text-emerald-900 dark:text-emerald-400 border-2 border-emerald-400 dark:border-emerald-500/30 font-bold text-sm transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              Cộng Đồng Zalo Hỗ Trợ
            </a>
          </div>

          {/* 3 Trụ Cột Cam Kết Niềm Tin (Value Pillars) */}
          <div className="pt-3 sm:pt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/[0.04] border border-slate-300/80 dark:border-white/10 shadow-xs backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-900 dark:text-white">⚡ Nhận link tự động</span>
              <span className="text-slate-500 dark:text-slate-400">trong 30 giây</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/[0.04] border border-slate-300/80 dark:border-white/10 shadow-xs backdrop-blur-xs">
              <span className="text-indigo-600 dark:text-cyan-400 font-bold">🔄</span>
              <span className="font-semibold text-slate-900 dark:text-white">Cập nhật trọn đời</span>
              <span className="text-slate-500 dark:text-slate-400">không phụ phí</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/[0.04] border border-slate-300/80 dark:border-white/10 shadow-xs backdrop-blur-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">💬</span>
              <span className="font-semibold text-slate-900 dark:text-white">Hỗ trợ 1-1</span>
              <span className="text-slate-500 dark:text-slate-400">qua Zalo VIP</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TIÊU ĐIỂM & BÀI ĐĂNG NỔI BẬT (SLIDE LƯỚT TRỰC QUAN - KÉO SÁT HERO) */}
      <div className="-mt-4 sm:-mt-8">
        <FeaturedSlideSection posts={initialPosts} products={initialProducts} />
      </div>

      {/* 3. PRODUCT CATALOG (Bento Filter & Grid 3 Cột Thoáng Đãng) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Kho Công Cụ, Skill & Workflow Tuyển Chọn
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Các giải pháp AI thực chiến sẵn sàng dùng ngay, tiết kiệm chi phí và tối ưu hiệu suất công việc.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Ô tìm kiếm nhanh trên trang chủ */}
            <div className="relative min-w-[200px]">
              <input
                type="text"
                placeholder="Tìm công cụ, prompt..."
                value={homeSearchQuery}
                onChange={(e) => setHomeSearchQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              {homeSearchQuery && (
                <button
                  type="button"
                  onClick={() => setHomeSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Segmented Filter Control - Dạng Pill Tối Giản */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-300 dark:border-white/[0.08] shadow-xs">
              {(
                [
                  { id: 'all', label: 'Tất cả' },
                  { id: 'workflow', label: 'Workflow n8n' },
                  { id: 'skill', label: 'Skill AI' },
                  { id: 'prompt', label: 'Prompt VIP' },
                  { id: 'free', label: 'Miễn phí 0đ' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'free') setSelectedGoal('free');
                    else if (selectedGoal === 'free') setSelectedGoal('all');
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-800 to-blue-800 text-white shadow-md shadow-indigo-950/40 font-black'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hàng Goal-driven Selector: Chọn theo mục tiêu thực chiến (Lấy cảm hứng từ congcuaitrungkien) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
              <span>BẠN MUỐN ĐẠT ĐƯỢC MỤC TIÊU NÀO TRƯỚC?</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {filteredProducts.length} công cụ phù hợp
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {GOAL_OPTIONS.map((goal) => {
              const isActive = selectedGoal === goal.id;
              return (
                <button
                  key={goal.id}
                  onClick={() => {
                    setSelectedGoal(goal.id);
                    if (goal.id === 'free') setActiveTab('free');
                    else if (activeTab === 'free') setActiveTab('all');
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-[1.02]'
                      : 'bg-white dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.1] border border-slate-300/80 dark:border-white/10'
                  }`}
                >
                  <span>{goal.icon}</span>
                  <span>{goal.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid: 3 cột thoáng đãng, hiển thị Top 6 sản phẩm */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-3">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Chưa tìm thấy công cụ phù hợp với từ khóa & bộ lọc đã chọn.
            </p>
            <button
              onClick={() => {
                setHomeSearchQuery('');
                setSelectedGoal('all');
                setActiveTab('all');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredProducts.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onFreeClick={() => handleOpenFreeModal(product)}
              />
            ))}
          </div>
        )}

        {/* Nút Khám Phá Toàn Bộ Sản Phẩm */}
        {filteredProducts.length > 6 && (
          <div className="text-center pt-2">
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-900 dark:text-white font-bold text-xs sm:text-sm border border-slate-300 dark:border-white/10 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xs"
            >
              <span>Xem toàn bộ {initialProducts.length}+ công cụ & tài nguyên trong Kho Sản Phẩm</span>
              <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            </Link>
          </div>
        )}
      </section>

      {/* 4. GÓI COMBO SIÊU TIẾT KIỆM (ALL-IN-ONE BUNDLES - TỐI ƯU CHUYỂN ĐỔI CAO) */}
      <BundlesSection zaloSupportUrl={publicSettings.zalo_group_url} />

      {/* 4. INTERACTIVE ROADMAP & STARTER KIT (PHƯƠNG ÁN 2 - BỐ CỤC ĐỘT PHÁ, KHÔNG CÒN TRÙNG LẶP 0Đ) */}
      <InteractiveRoadmap
        products={initialProducts}
        onClaimFree={(title, id) => {
          setSelectedResource({ id, name: title });
          setLeadModalOpen(true);
        }}
      />

      {/* 5. HƯỚNG DẪN THỰC CHIẾN & PLAYBOOKS (TÁCH BIỆT HOÀN TOÀN, CARD PLAYBOOK NỔI BẬT) */}
      <TutorialsPlaybookSection posts={initialPosts} />

      {/* 6. BẢN TIN AI & XU HƯỚNG CÔNG NGHỆ (DẠNG THẺ NHỎ DANH SÁCH COMPACT LIST, LƯỚT SIÊU NHANH) */}
      <TechNewsCompactList posts={initialPosts} />

      {/* Lead Magnet Modal */}
      <LeadMagnetModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        resourceId={selectedResource?.id || 'FREE-RESOURCE'}
        resourceName={selectedResource?.name || 'Tài liệu Tự Học AI'}
        defaultDownloadUrl={selectedResource?.url}
      />
    </div>
  );
}
