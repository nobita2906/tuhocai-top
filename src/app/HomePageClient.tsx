'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Post } from '@/types';
import ProductCard from '@/components/ProductCard';
import LeadMagnetModal from '@/components/LeadMagnetModal';
import {
  Zap,
  ArrowRight,
  Download,
  MessageCircle,
  CheckCircle2,
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
    <div className="space-y-28 pb-24 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 sm:pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
            Tự Động Hóa Thực Chiến Với AI & n8n
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Sở hữu các template <strong>n8n workflow</strong>, kỹ năng làm chủ <strong>Claude 3.7 / ChatGPT</strong> và bộ prompt chuẩn thương mại giúp tiết kiệm 80% thời gian làm việc mỗi ngày.
          </p>

          {/* Call to actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all hover:scale-105"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              Khám Phá Kho Workflow & Skill
            </Link>

            <button
              onClick={() => handleOpenFreeModal()}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-sm transition-all hover:scale-105"
            >
              <Download className="w-4 h-4 text-emerald-400" />
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

          {/* Stats strip */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">10.000+</p>
              <p className="text-sm text-slate-400 mt-1">Thành viên cộng đồng</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">50+</p>
              <p className="text-sm text-slate-400 mt-1">Workflow & Prompt VIP</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</p>
              <p className="text-sm text-slate-400 mt-1">Mã nguồn sẵn sàng dùng</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">0 đ</p>
              <p className="text-sm text-slate-400 mt-1">Bắt đầu học ngay hôm nay</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLAGSHIP SPOTLIGHT (WF-THAI-099) WITH REAL UI SCREENSHOT */}
      {flagship && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {flagship.name}
                </h2>

                <p className="text-base text-slate-300 leading-relaxed">
                  {flagship.description ||
                    'Giải pháp tự động hóa toàn diện bằng n8n: Lấy ý tưởng từ Google Sheets/RSS -> AI viết bài chuẩn SEO -> Tự động đăng tải lên Facebook Fanpage, Group, Telegram Channel và WordPress cùng lúc.'}
                </p>

                <div className="space-y-2.5 py-1">
                  <div className="flex items-center gap-2.5 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>File JSON import trực tiếp vào n8n trong 30 giây</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Video hướng dẫn cài đặt từng bước chi tiết cho người mới</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-slate-300">
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
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Tiết kiệm {new Intl.NumberFormat('vi-VN').format((flagship.original_price || 299000) - flagship.price)} đ
                  </span>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    href={`/thanh-toan?pid=${flagship.pid}`}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all hover:scale-105"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
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

              {/* Real UI Screenshot instead of empty card */}
              <div className="lg:col-span-6 space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 aspect-video shadow-lg">
                  <Image
                    src="/images/n8n-workflow-demo.jpg"
                    alt="Sơ đồ thực tế n8n workflow tự động đăng bài đa kênh"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
                <p className="text-xs text-slate-400 text-center">
                  Giao diện Canvas n8n thực tế: Kích hoạt tự động &bull; GPT-4o biên tập &bull; Bắn bài đa kênh
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Workflow, Skill & Prompt Tuyển Chọn
            </h2>
            <p className="text-sm text-slate-300 mt-1.5">
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
              { key: 'free', label: 'Miễn Phí 0đ' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
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

      {/* 4. FREE LEAD MAGNET SECTION WITH REAL IMAGERY */}
      <section id="tai-lieu-free" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Tải Trọn Bộ 100+ Prompt FLUX & App Flow Tự Động
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
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
                    >
                      <Download className="w-4 h-4" />
                      Mở Thư Mục Google Drive
                    </a>
                    <a
                      href="https://zalo.me/g/tuhocai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
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
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="email"
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="Email nhận link tải"
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={leadLoading}
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      {leadLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Nhận Link Tải
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">
                    Link được mở khóa trực tiếp và tự động gửi qua email từ Resend.
                  </p>
                </form>
              )}
            </div>

            {/* Visual preview of Prompt outputs */}
            <div className="lg:col-span-5 space-y-2">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 aspect-video shadow-lg">
                <Image
                  src="/images/flux-prompt-bundle.jpg"
                  alt="Bộ ảnh mẫu thực tế tạo từ Prompt FLUX & Midjourney"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <p className="text-xs text-slate-400 text-center">
                Mẫu ảnh thực tế: Sản phẩm thương mại &bull; Kiến trúc &bull; Kỹ thuật số
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LATEST AI NEWS & ARTICLES */}
      {initialPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Tin Tức & Hướng Dẫn AI Mới Nhất
              </h2>
            </div>
            <Link
              href="/bai-viet"
              className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              Xem tất cả bài viết <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialPosts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 transition-all"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-blue-400 font-semibold border border-slate-700">
                    {post.category}
                  </span>
                  <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                </div>

                <Link href={`/bai-viet/${post.slug}`} className="group-hover:text-blue-400 transition-colors">
                  <h3 className="font-bold text-white text-base line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                </Link>

                <p className="mt-2 text-sm text-slate-300 line-clamp-3 leading-relaxed flex-1">
                  {post.summary}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <Link
                    href={`/bai-viet/${post.slug}`}
                    className="font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Đọc tiếp <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-slate-400">{post.views || 0} lượt xem</span>
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
