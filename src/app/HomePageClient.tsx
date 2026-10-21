'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product, Post } from '@/types';
import ProductCard from '@/components/ProductCard';
import LeadMagnetModal from '@/components/LeadMagnetModal';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Download,
  MessageCircle,
  CheckCircle2,
  Layers,
  Flame,
  Newspaper,
  Send,
  Loader2,
} from 'lucide-react';

interface HomePageClientProps {
  initialProducts: Product[];
  initialPosts: Post[];
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

  // Filter products
  const filteredProducts = initialProducts.filter((p) => {
    if (activeTab === 'free') return p.price === 0;
    if (activeTab === 'workflow') return p.category?.toLowerCase().includes('workflow');
    if (activeTab === 'skill') return p.category?.toLowerCase().includes('skill');
    if (activeTab === 'prompt') return p.category?.toLowerCase().includes('prompt');
    return true;
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

  // Flagship Product WF-THAI-099
  const flagship = initialProducts.find((p) => p.pid === 'WF-THAI-099') || initialProducts[0];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 sm:pt-24 pb-12">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs sm:text-sm font-semibold tracking-wide">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin-slow" />
            <span>Kho Vũ Khí AI Thực Chiến Cho Doanh Nghiệp & Freelancer</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Học AI Ứng Dụng & Tự Động Hóa{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Không Cần Viết Code
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Sở hữu các template <strong>n8n workflow</strong>, kỹ năng làm chủ <strong>Claude 3.7 / ChatGPT</strong> và bộ prompt chuẩn thương mại giúp tiết kiệm 80% thời gian làm việc mỗi ngày.
          </p>

          {/* Call to actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <Zap className="w-4 h-4 text-yellow-300" />
              Khám Phá Kho Workflow & Skill
            </Link>

            <button
              onClick={() => handleOpenFreeModal()}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white border border-slate-700 font-semibold text-sm transition-all hover:scale-105"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Nhận Bộ Tài Liệu 0đ
            </button>

            <a
              href="https://zalo.me/g/tuhocai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-semibold text-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Nhóm Zalo 10.000+ Bạn
            </a>
          </div>

          {/* Stats strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/60">
            <div className="p-3 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">10.000+</p>
              <p className="text-xs text-slate-400 mt-0.5">Thành viên cộng đồng</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400">50+</p>
              <p className="text-xs text-slate-400 mt-0.5">Workflow & Prompt VIP</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</p>
              <p className="text-xs text-slate-400 mt-0.5">Mã nguồn sẵn sàng dùng</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-pink-400">0 đ</p>
              <p className="text-xs text-slate-400 mt-0.5">Bắt đầu học ngay hôm nay</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLAGSHIP SPOTLIGHT (WF-THAI-099) */}
      {flagship && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 sm:p-10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 fill-rose-500" />
                  WORKFLOW BÁN CHẠY NHẤT — GIẢM 66% HÔM NAY
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {flagship.name}
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {flagship.description ||
                    'Giải pháp tự động hóa toàn diện bằng n8n: Lấy ý tưởng từ Google Sheets/RSS $\\rightarrow$ AI viết bài chuẩn SEO $\\rightarrow$ Tự động đăng tải lên Facebook Fanpage, Group, Telegram Channel và WordPress cùng lúc.'}
                </p>

                <div className="space-y-2 py-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>File JSON import trực tiếp vào n8n trong 30 giây</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Video hướng dẫn cài đặt từng bước chi tiết cho người mới</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Hỗ trợ kỹ thuật 1-1 qua Zalo khi gặp lỗi cài đặt</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-3 pt-2">
                  <span className="text-3xl font-extrabold text-white">
                    {new Intl.NumberFormat('vi-VN').format(flagship.price)} đ
                  </span>
                  <span className="text-sm text-slate-500 line-through">
                    {new Intl.NumberFormat('vi-VN').format(flagship.original_price || 299000)} đ
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Tiết kiệm {new Intl.NumberFormat('vi-VN').format((flagship.original_price || 299000) - flagship.price)} đ
                  </span>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    href={`/thanh-toan?pid=${flagship.pid}`}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
                  >
                    <Zap className="w-4 h-4 text-yellow-300" />
                    Mua Ngay Với VietQR ({new Intl.NumberFormat('vi-VN').format(flagship.price)} đ)
                  </Link>

                  <Link
                    href={`/san-pham/${flagship.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
                  >
                    Xem Demo Chi Tiết
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Visual Preview Box */}
              <div className="lg:col-span-5 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
                  <Layers className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Gói Triển Khai n8n Pro</h4>
                  <p className="text-xs text-slate-400 mt-1">Đầy đủ JSON flow + Tài liệu cấu hình</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-left text-xs space-y-2 text-slate-300">
                  <p className="font-mono text-indigo-400 text-[11px]">{'// N8N_WORKFLOW_SPECS'}</p>
                  <p>• Nodes: Webhook, OpenAI GPT-4o, Facebook Graph API, Telegram Bot, WordPress REST API</p>
                  <p>• Định dạng: JSON v1 (chuẩn n8n self-hosted & cloud)</p>
                  <p>• Mã sản phẩm: <strong>{flagship.pid}</strong></p>
                </div>

                <p className="text-[11px] text-emerald-400 font-medium">
                  ⚡ Quét mã thanh toán VietQR - Duyệt bot tự động - Nhận link tức thì!
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. STORE & RESOURCES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-2">
              <Layers className="w-3.5 h-3.5" />
              Kho Vũ Khí Tự Động Hóa
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Workflow, Skill & Prompt Tuyển Chọn
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Khám phá các sản phẩm sẵn sàng triển khai ngay, có cả miễn phí lẫn trả phí tối ưu chi phí.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'workflow', label: 'Workflow n8n' },
              { key: 'skill', label: 'Kỹ Năng AI' },
              { key: 'prompt', label: 'Prompt VIP' },
              { key: 'free', label: '🎁 Miễn Phí' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id || product.pid}
              product={product}
              onFreeClick={() => handleOpenFreeModal(product)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            Không tìm thấy sản phẩm nào trong danh mục này.
          </div>
        )}
      </section>

      {/* 4. FREE LEAD MAGNET SECTION (#tai-lieu-free) */}
      <section id="tai-lieu-free" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-slate-900 border border-purple-500/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <Download className="w-3.5 h-3.5" />
              Quà Tặng Miễn Phí 100%
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Tải Trọn Bộ 100+ Prompt FLUX & App Flow Báo Cáo Google Sheets
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Nhập tên và email để hệ thống tự động gửi link Google Drive chứa file template và tài liệu hướng dẫn vào hòm thư của bạn.
            </p>

            {leadSuccess ? (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <p className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Đăng ký thành công! Bạn có thể mở link tài liệu ngay dưới đây:
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={leadSuccess}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    Mở Thư Mục Google Drive
                  </a>
                  <a
                    href="https://zalo.me/g/tuhocai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Vào Group Zalo Hỗ Trợ
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3 pt-2">
                {leadError && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                    {leadError}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Họ và tên của bạn"
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="Email nhận link tải"
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={leadLoading}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    {leadLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Nhận Link Tải
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  ⚡ Link được mở khóa trực tiếp và lưu vào tài khoản cá nhân.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 5. LATEST AI NEWS & ARTICLES */}
      {initialPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-2">
                <Newspaper className="w-3.5 h-3.5" />
                Kiến Thức Thực Chiến
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Tin Tức & Hướng Dẫn AI Mới Nhất
              </h2>
            </div>
            <Link
              href="/bai-viet"
              className="text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Xem tất cả bài viết <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialPosts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 transition-all hover:shadow-xl"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-400 font-semibold border border-slate-700">
                    {post.category}
                  </span>
                  <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                </div>

                <Link href={`/bai-viet/${post.slug}`} className="group-hover:text-indigo-400 transition-colors">
                  <h3 className="font-bold text-white text-base line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                </Link>

                <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed flex-1">
                  {post.summary}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <Link
                    href={`/bai-viet/${post.slug}`}
                    className="font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    Đọc tiếp <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-slate-500">{post.views || 0} lượt xem</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Modal for free resources */}
      <LeadMagnetModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        resourceId={selectedResource?.id}
        resourceName={selectedResource?.name}
        defaultDownloadUrl={selectedResource?.url}
      />
    </div>
  );
}
