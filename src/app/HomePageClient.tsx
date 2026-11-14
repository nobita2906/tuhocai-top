'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Post } from '@/types';
import ProductCard from '@/components/ProductCard';
import LeadMagnetModal from '@/components/LeadMagnetModal';
import FeaturedSlideSection from '@/components/FeaturedSlideSection';
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

export default function HomePageClient({ initialProducts, initialPosts }: HomePageClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'workflow' | 'skill' | 'prompt' | 'free'>('all');
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<{ id: string; name: string; url?: string } | null>(null);

  // Email Lead Magnet Section state
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState<string | null>(null);
  const [leadError, setLeadError] = useState('');
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          setLeadName((prev) => prev || data.user.name || '');
          setLeadEmail((prev) => prev || data.user.email || '');
        }
      })
      .catch(() => {});
  }, []);

  // Filter products & Ưu tiên hiển thị sản phẩm 0Đ lên đầu
  const filteredProducts = initialProducts
    .filter((p) => {
      const matchSearch =
        homeSearchQuery.trim() === '' ||
        p.name.toLowerCase().includes(homeSearchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(homeSearchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (activeTab === 'free') return p.price === 0;
      if (activeTab === 'workflow') return p.category?.toLowerCase().includes('workflow');
      if (activeTab === 'skill') return p.category?.toLowerCase().includes('skill');
      if (activeTab === 'prompt') return p.category?.toLowerCase().includes('prompt');
      return true;
    })
    .sort((a, b) => {
      const isAFree = a.price === 0;
      const isBFree = b.price === 0;
      if (isAFree && !isBFree) return -1;
      if (!isAFree && isBFree) return 1;
      return (b.sales_count || 0) - (a.sales_count || 0);
    });

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
        name: 'Trọn bộ 100+ Prompt FLUX & Midjourney Thương Mại',
      });
    }
    setLeadModalOpen(true);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadLoading(true);
    setLeadError('');
    setLeadSuccess(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail,
          resource_id: 'FREE-FOOTER-MAGNET',
          resource_name: 'Trọn bộ 100+ Prompt & Flow Tự Động Hóa',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Có lỗi xảy ra');

      setLeadSuccess(data.download_url || 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026');
      setLeadName('');
      setLeadEmail('');
    } catch (err: any) {
      setLeadError(err.message || 'Lỗi gửi thông tin');
    } finally {
      setLeadLoading(false);
    }
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
              href="https://zalo.me/0934434101"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-800 dark:text-cyan-400 font-bold hover:underline"
            >
              0934.434.101
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
              href="https://zalo.me/g/tuhocai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 hover:opacity-85 text-emerald-900 dark:text-emerald-400 border-2 border-emerald-400 dark:border-emerald-500/30 font-bold text-sm transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              Cộng Đồng Zalo Hỗ Trợ
            </a>
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
                  onClick={() => setActiveTab(tab.id)}
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

        {/* Products Grid: 3 cột thoáng đãng, hiển thị Top 6 sản phẩm */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredProducts.slice(0, 6).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onFreeClick={() => handleOpenFreeModal(product)}
            />
          ))}
        </div>

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

      {/* 5. LEAD MAGNET SECTION (100+ Prompt FLUX) */}
      <section id="tai-lieu-free" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bento-card p-6 sm:p-8 relative overflow-hidden border-2 border-indigo-200 dark:border-indigo-500/25 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="font-mono text-xs uppercase font-bold tracking-wider text-indigo-800 dark:text-cyan-400">
                {'// MIỄN PHÍ DÀNH CHO BẠN'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Tải Trọn Bộ 100+ Prompt FLUX & App Flow Tự Động
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Nhập tên và email để hệ thống tự động kích hoạt file template và tài liệu hướng dẫn vào tài khoản của bạn.
              </p>

              <form onSubmit={handleLeadSubmit} className="space-y-3 pt-2">
                {currentUser && (
                  <div className="p-2.5 px-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-xs flex items-center justify-between text-indigo-950 dark:text-indigo-300">
                    <span className="font-semibold">
                      Tài khoản nhận: <strong className="font-bold">{currentUser.email}</strong>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-200/60 dark:bg-indigo-500/30 px-2 py-0.5 rounded text-indigo-800 dark:text-cyan-300">
                      ✓ ĐÃ ĐĂNG NHẬP
                    </span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Họ và tên của bạn"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-[#09090b] border-2 border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-700 transition-colors shadow-xs"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email nhận link tải"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-[#09090b] border-2 border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-700 transition-colors shadow-xs"
                  />
                  <button
                    type="submit"
                    disabled={leadLoading}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 hover:opacity-85 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-50 shadow-lg shadow-indigo-950/25"
                  >
                    {leadLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Nhận Link Tải
                  </button>
                </div>

                {leadSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-300 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-400 text-xs flex items-center justify-between font-bold">
                    <span>Thành công! Đã gửi link tải.</span>
                    <a
                      href={leadSuccess}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-bold"
                    >
                      Bấm vào đây để tải ngay
                    </a>
                  </div>
                )}

                {leadError && (
                  <p className="text-rose-600 dark:text-rose-400 text-xs font-semibold">{leadError}</p>
                )}

                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Link được mở khóa trực tiếp và tự động gửi qua email từ Resend.
                </p>
              </form>
            </div>

            <div className="lg:col-span-5 space-y-2">
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-white/[0.1] bg-slate-100 dark:bg-slate-950 aspect-video shadow-md">
                <Image
                  src="/images/flux-prompt-bundle.jpg"
                  alt="Bộ ảnh mẫu thực tế tạo từ Prompt FLUX & Midjourney"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center font-mono">
                Mẫu ảnh thực tế: Sản phẩm thương mại • Kiến trúc • Kỹ thuật số
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEWS & GUIDES SECTION - 3 Cột Thoáng Đãng Chuẩn Tạp Chí */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tin Tức & Hướng Dẫn AI Thực Chiến
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Cập nhật kiến thức mới nhất về Prompt Engineering, Tự động hóa n8n và các mô hình AI.
            </p>
          </div>
          <Link
            href="/bai-viet"
            className="text-xs sm:text-sm font-bold text-indigo-700 dark:text-cyan-400 hover:underline flex items-center gap-1 font-mono shrink-0"
          >
            <span>Xem tất cả bài viết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Cột Bài Viết Tinh Tuyển */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {initialPosts.slice(0, 3).map((post) => (
            <article
              key={post.id}
              className="bento-card p-4 sm:p-5 flex flex-col group transition-all duration-300 border-2 border-slate-300 dark:border-white/10 hover:border-indigo-400/50 dark:hover:border-indigo-500/40 hover:shadow-xl shadow-md rounded-2xl bg-white dark:bg-[#0e0e13]"
            >
              {/* Visual Thumbnail */}
              <Link
                href={`/bai-viet/${post.slug}`}
                className="block relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-[#15151c] mb-4 border border-slate-300/80 dark:border-white/10 group-hover:opacity-95 transition-all shadow-inner"
              >
                <Image
                  src={getPostCover(post)}
                  alt={post.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-[#09090b]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-300 border border-white/20 shadow-sm">
                    {post.category || 'KIẾN THỨC AI'}
                  </span>
                </div>
              </Link>

              {/* Title & Summary */}
              <div className="flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <Link href={`/bai-viet/${post.slug}`} className="group/title block">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg line-clamp-2 leading-snug group-hover/title:text-indigo-600 dark:group-hover/title:text-cyan-400 transition-colors">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {post.summary || 'Hướng dẫn chi tiết từng bước xây dựng quy trình và làm chủ công cụ AI thực tế.'}
                  </p>
                </div>

                {/* Footer Meta: Ngày đăng + Nút đọc */}
                <div className="pt-3.5 mt-2 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                    {new Date(post.created_at).toLocaleDateString('vi-VN')}
                  </span>

                  <Link
                    href={`/bai-viet/${post.slug}`}
                    className="font-bold text-indigo-700 dark:text-cyan-400 hover:underline flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Đọc bài viết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Nút Khám Phá Toàn Bộ Bài Viết */}
        <div className="text-center pt-2">
          <Link
            href="/bai-viet"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-900 dark:text-white font-bold text-xs sm:text-sm border border-slate-300 dark:border-white/10 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xs"
          >
            <span>Xem toàn bộ cẩm nang & bài viết hướng dẫn AI</span>
            <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
          </Link>
        </div>
      </section>

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
