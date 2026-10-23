'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Post } from '@/types';
import ProductCard from '@/components/ProductCard';
import LeadMagnetModal from '@/components/LeadMagnetModal';
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
  Cpu,
  Sparkles,
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
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<{ id: string; name: string; url?: string } | null>(null);

  // Email Lead Magnet Section state
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState<string | null>(null);
  const [leadError, setLeadError] = useState('');

  // Filter products & Ưu tiên hiển thị sản phẩm 0Đ lên đầu
  const filteredProducts = initialProducts
    .filter((p) => {
      if (activeTab === 'free') return p.price === 0;
      if (activeTab === 'workflow') return p.category?.toLowerCase().includes('workflow');
      if (activeTab === 'skill') return p.category?.toLowerCase().includes('skill');
      if (activeTab === 'prompt') return p.category?.toLowerCase().includes('prompt');
      return true;
    })
    .sort((a, b) => {
      // Ưu tiên bài/sản phẩm 0Đ lên đầu tiên
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
    <div className="space-y-28 pb-24 overflow-hidden">
      {/* 1. HERO SECTION - Modern Indigo & Cyan AI Theme */}
      <section className="relative pt-16 sm:pt-24 pb-8 cyber-grid radial-spotlight">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Top subtle AI badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-xs font-semibold shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>KHO WORKFLOW N8N & AI SKILL 2026 THỰC CHIẾN</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
            Tự Động Hóa Thực Chiến <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Với AI & n8n
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Sở hữu các template <strong>n8n workflow</strong>, kỹ năng làm chủ <strong>Claude 3.7 / ChatGPT</strong> và bộ prompt chuẩn thương mại giúp tiết kiệm 80% thời gian làm việc mỗi ngày.
          </p>

          {/* Call to actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-105 active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 text-white" />
              Khám Phá Kho Workflow & Skill
            </Link>

            <button
              onClick={() => handleOpenFreeModal()}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.12] font-semibold text-sm transition-all hover:scale-105"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              Nhận Bộ Tài Liệu 0đ
            </button>

            <a
              href="https://zalo.me/g/tuhocai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Cộng Đồng Zalo Hỗ Trợ
            </a>
          </div>

          {/* Stats Cards - Bento Style with Indigo/Cyan Accents */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bento-card p-4 text-center hover:border-indigo-500/40">
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">10.000+</p>
              <p className="text-xs text-slate-400 mt-1">Thành viên cộng đồng</p>
            </div>
            <div className="bento-card p-4 text-center hover:border-indigo-500/40">
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">50+</p>
              <p className="text-xs text-slate-400 mt-1">Workflow & Prompt VIP</p>
            </div>
            <div className="bento-card p-4 text-center hover:border-indigo-500/40">
              <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">100%</p>
              <p className="text-xs text-slate-400 mt-1">Mã nguồn sẵn sàng dùng</p>
            </div>
            <div className="bento-card p-4 text-center hover:border-indigo-500/40">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">0 đ</p>
              <p className="text-xs text-slate-400 mt-1">Bắt đầu học ngay hôm nay</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED SPOTLIGHT BENTO (Workflow n8n Đăng bài đa kênh) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bento-card p-6 sm:p-10 relative overflow-hidden border-indigo-500/25 shadow-2xl shadow-indigo-500/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 font-mono text-xs font-semibold">
                <Cpu className="w-3.5 h-3.5" />
                FLAGSHIP WORKFLOW N8N 2026
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Workflow n8n Tự Động Đăng Bài Đa Kênh <br />
                <span className="text-slate-400 text-lg font-normal sm:text-xl">
                  (Facebook, Telegram, WordPress)
                </span>
              </h2>

              <p className="text-base text-slate-300 leading-relaxed">
                Hệ thống tự động hóa n8n giúp lên lịch, tạo nội dung bằng AI và tự động đăng bài đa kênh không giới hạn.
              </p>

              <div className="space-y-2.5 py-1">
                <div className="flex items-center gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>File JSON import trực tiếp vào n8n trong 30 giây</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Video hướng dẫn cài đặt từng bước chi tiết cho người mới</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Hỗ trợ kỹ thuật 1-1 qua Zalo khi gặp lỗi cài đặt</span>
                </div>
              </div>

              {/* Price & Savings */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-extrabold text-white font-mono">99.000 đ</span>
                <span className="text-sm text-slate-500 line-through font-mono">299.000 đ</span>
                <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Tiết kiệm 200.000 đ
                </span>
              </div>

              {/* CTA buttons */}
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/thanh-toan?pid=WF-THAI-099"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-[0.98]"
                >
                  <Zap className="w-4 h-4" />
                  Mua Ngay Với VietQR (99.000 đ)
                </Link>
                <Link
                  href="/san-pham/workflow-n8n-tu-dong-dang-bai-da-kenh"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-sm font-medium border border-white/[0.08] transition-colors"
                >
                  Xem Demo Chi Tiết
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Interactive n8n Canvas Mockup */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-indigo-500/25 bg-[#111116] aspect-video shadow-2xl p-1">
                <Image
                  src="/images/n8n-workflow-demo.jpg"
                  alt="Sơ đồ thực tế n8n workflow tự động đăng bài đa kênh"
                  fill
                  className="object-cover rounded-xl"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-indigo-500/30 text-[11px] font-mono text-cyan-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>STATUS: 200 OK</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 text-center font-mono">
                Giao diện Canvas n8n thực tế: Kích hoạt tự động • GPT-4o biên tập • Bắn bài đa kênh
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATALOG (Bento Filter & Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Workflow, Skill & Prompt Tuyển Chọn
            </h2>
            <p className="text-sm text-slate-400 mt-1.5">
              Khám phá các sản phẩm sẵn sàng triển khai ngay, có cả miễn phí lẫn trả phí tối ưu chi phí.
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            {(
              [
                { id: 'all', label: 'Tất cả' },
                { id: 'workflow', label: 'Workflow n8n' },
                { id: 'skill', label: 'Kỹ Năng AI' },
                { id: 'prompt', label: 'Prompt VIP' },
                { id: 'free', label: 'Miễn Phí 0đ' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onFreeClick={() => handleOpenFreeModal(product)}
            />
          ))}
        </div>
      </section>

      {/* 4. LEAD MAGNET SECTION (100+ Prompt FLUX) */}
      <section id="tai-lieu-free" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bento-card p-8 sm:p-12 relative overflow-hidden border-indigo-500/25">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="font-mono text-xs uppercase font-semibold tracking-wider text-cyan-400">
                // MIỄN PHÍ DÀNH CHO BẠN
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Tải Trọn Bộ 100+ Prompt FLUX & App Flow Tự Động
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Nhập tên và email để hệ thống tự động gửi link Google Drive chứa file template và tài liệu hướng dẫn vào hòm thư của bạn.
              </p>

              <form onSubmit={handleLeadSubmit} className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Họ và tên của bạn"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#09090b] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email nhận link tải"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#09090b] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={leadLoading}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                  >
                    {leadLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Nhận Link Tải
                  </button>
                </div>

                {leadSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
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
                  <p className="text-rose-400 text-xs">{leadError}</p>
                )}

                <p className="text-xs text-slate-400 font-mono">
                  Link được mở khóa trực tiếp và tự động gửi qua email từ Resend.
                </p>
              </form>
            </div>

            <div className="lg:col-span-5 space-y-2">
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] bg-slate-950 aspect-video shadow-2xl">
                <Image
                  src="/images/flux-prompt-bundle.jpg"
                  alt="Bộ ảnh mẫu thực tế tạo từ Prompt FLUX & Midjourney"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <p className="text-xs text-slate-400 text-center font-mono">
                Mẫu ảnh thực tế: Sản phẩm thương mại • Kiến trúc • Kỹ thuật số
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEWS & GUIDES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Tin Tức & Hướng Dẫn AI Mới Nhất
            </h2>
          </div>
          <Link
            href="/bai-viet"
            className="text-sm font-semibold text-indigo-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
          >
            Xem tất cả bài viết <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {initialPosts.slice(0, 4).map((post) => (
            <article
              key={post.id}
              className="bento-card p-4 flex flex-col group transition-all duration-300 hover:border-indigo-500/45"
            >
              {/* Visual Thumbnail */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#111116] mb-3.5 border border-white/[0.06] group-hover:border-indigo-500/30 transition-colors">
                <Image
                  src={getPostCover(post)}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/80 via-transparent to-black/20 pointer-events-none" />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-indigo-400 border border-indigo-500/30">
                    {post.category || 'NEWS'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3 text-indigo-400" />
                  {new Date(post.created_at).toLocaleDateString('vi-VN')}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {post.views || 0}
                </span>
              </div>

              <Link
                href={`/bai-viet/${post.slug}`}
                className="group/title"
              >
                <h3 className="font-bold text-white text-sm sm:text-base line-clamp-2 leading-snug group-hover/title:text-cyan-400 transition-colors">
                  {post.title}
                </h3>
              </Link>

              <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed flex-1">
                {post.summary}
              </p>

              <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <Link
                  href={`/bai-viet/${post.slug}`}
                  className="font-semibold text-indigo-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  Đọc tiếp <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
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
