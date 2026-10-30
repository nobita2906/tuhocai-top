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
  ShieldCheck,
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
    <div className="space-y-20 sm:space-y-28 pb-24 overflow-hidden transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-8 cyber-grid radial-spotlight">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
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

          {/* Call to actions: Mặc định đậm đà, hover mờ lại dịu dàng */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 hover:opacity-85 text-white font-black text-sm shadow-xl shadow-indigo-950/30 transition-all hover:scale-[0.99] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 text-white" />
              Khám Phá Kho Công Cụ & Skill
            </Link>

            <button
              onClick={() => handleOpenFreeModal()}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-white/[0.05] hover:opacity-85 text-slate-900 dark:text-white border-2 border-slate-400 dark:border-white/20 font-bold text-sm transition-all shadow-xs"
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

          {/* Stats Cards - Bento Style: Khung đậm đà */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            <div className="bento-card p-4 text-center border-2 border-slate-300 dark:border-white/10 shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">10.000+</p>
              <p className="text-xs text-slate-700 dark:text-slate-400 mt-1 font-semibold">Thành viên cộng đồng</p>
            </div>
            <div className="bento-card p-4 text-center border-2 border-slate-300 dark:border-white/10 shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-800 dark:text-indigo-400 font-mono">50+</p>
              <p className="text-xs text-slate-700 dark:text-slate-400 mt-1 font-semibold">Workflow & Prompt VIP</p>
            </div>
            <div className="bento-card p-4 text-center border-2 border-slate-300 dark:border-white/10 shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-800 dark:text-cyan-400 font-mono">100%</p>
              <p className="text-xs text-slate-700 dark:text-slate-400 mt-1 font-semibold">Mã nguồn sẵn sàng dùng</p>
            </div>
            <div className="bento-card p-4 text-center border-2 border-slate-300 dark:border-white/10 shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-800 dark:text-emerald-400 font-mono">0 đ</p>
              <p className="text-xs text-slate-700 dark:text-slate-400 mt-1 font-semibold">Bắt đầu học ngay hôm nay</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE STRIP: 3 CAM KẾT VÀNG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bento-card p-6 flex gap-4 items-start border-2 border-slate-300 dark:border-white/10 shadow-sm hover:opacity-95">
            <div className="text-3xl sm:text-4xl font-black font-mono text-indigo-800 dark:text-indigo-400 shrink-0 leading-none">
              01
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Đúng Việc Bạn Cần</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Mỗi workflow và kỹ năng giải quyết trọn vẹn 1 bài toán thực tế: viết kịch bản, tạo ảnh, dựng video, tự động đăng bài đa kênh.
              </p>
            </div>
          </div>

          <div className="bento-card p-6 flex gap-4 items-start border-2 border-slate-300 dark:border-white/10 shadow-sm hover:opacity-95">
            <div className="text-3xl sm:text-4xl font-black font-mono text-blue-800 dark:text-cyan-400 shrink-0 leading-none">
              02
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Dùng Được Ngay</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Không cần biết lập trình phức tạp. File JSON import 1-click vào n8n, kèm prompt mẫu và video hướng dẫn từng bước rõ ràng.
              </p>
            </div>
          </div>

          <div className="bento-card p-6 flex gap-4 items-start border-2 border-slate-300 dark:border-white/10 shadow-sm hover:opacity-95">
            <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-800 dark:text-emerald-400 shrink-0 leading-none">
              03
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Quản Lý Tập Trung</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Thanh toán quét mã VietQR tự động. Mọi sản phẩm đã mua được lưu trữ vĩnh viễn và dễ dàng tải lại bất cứ lúc nào trong &quot;Kho Của Tôi&quot;.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SPOTLIGHT BENTO (Workflow n8n Đăng bài đa kênh) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bento-card p-6 sm:p-10 relative overflow-hidden border-2 border-indigo-300 dark:border-indigo-500/30 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-100 dark:bg-indigo-500/10 text-indigo-900 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-500/25 font-mono text-xs font-bold">
                <Cpu className="w-3.5 h-3.5" />
                FLAGSHIP WORKFLOW N8N 2026
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Workflow n8n Tự Động Đăng Bài Đa Kênh <br />
                <span className="text-slate-600 dark:text-slate-400 text-lg font-normal sm:text-xl">
                  (Facebook, Telegram, WordPress)
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Hệ thống tự động hóa n8n giúp lên lịch, tạo nội dung bằng AI và tự động đăng bài đa kênh không giới hạn.
              </p>

              <div className="space-y-2.5 py-1">
                <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-indigo-700 dark:text-cyan-400 flex-shrink-0" />
                  <span>File JSON import trực tiếp vào n8n trong 30 giây</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-indigo-700 dark:text-cyan-400 flex-shrink-0" />
                  <span>Video hướng dẫn cài đặt từng bước chi tiết cho người mới</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-indigo-700 dark:text-cyan-400 flex-shrink-0" />
                  <span>Hỗ trợ kỹ thuật 1-1 qua Zalo khi gặp lỗi cài đặt</span>
                </div>
              </div>

              {/* Price & Savings */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">99.000 đ</span>
                <span className="text-sm text-slate-400 line-through font-mono">299.000 đ</span>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                  Tiết kiệm 200.000 đ
                </span>
              </div>

              {/* CTA buttons */}
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/thanh-toan?pid=WF-THAI-099"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 hover:opacity-85 text-white font-bold text-sm shadow-xl shadow-indigo-950/25 transition-all hover:scale-[0.99] active:scale-[0.98]"
                >
                  <Zap className="w-4 h-4" />
                  Mua Ngay Với VietQR (99.000 đ)
                </Link>
                <Link
                  href="/san-pham/workflow-n8n-tu-dong-dang-bai-da-kenh"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:opacity-80 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-900 dark:text-slate-200 text-sm font-bold border-2 border-slate-300 dark:border-white/[0.08] shadow-xs transition-colors"
                >
                  Xem Demo Chi Tiết
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Interactive n8n Canvas Mockup */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-indigo-500/25 bg-slate-100 dark:bg-[#111116] aspect-video shadow-md p-1">
                <Image
                  src="/images/n8n-workflow-demo.jpg"
                  alt="Sơ đồ thực tế n8n workflow tự động đăng bài đa kênh"
                  fill
                  className="object-cover rounded-xl"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 backdrop-blur-md border border-white/20 text-[11px] font-mono text-cyan-300 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>STATUS: 200 OK</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center font-mono">
                Giao diện Canvas n8n thực tế: Kích hoạt tự động • GPT-4o biên tập • Bắn bài đa kênh
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT CATALOG (Bento Filter & Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Workflow, Skill & Prompt Tuyển Chọn
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5">
              Khám phá các sản phẩm sẵn sàng triển khai ngay, có cả miễn phí lẫn trả phí tối ưu chi phí.
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-white/[0.04] border-2 border-slate-300 dark:border-white/[0.08] shadow-xs">
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
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-800 to-blue-800 text-white shadow-md shadow-indigo-950/25 hover:opacity-90'
                    : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05]'
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

      {/* 5. LEAD MAGNET SECTION (100+ Prompt FLUX) */}
      <section id="tai-lieu-free" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bento-card p-8 sm:p-12 relative overflow-hidden border-2 border-indigo-200 dark:border-indigo-500/25 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="font-mono text-xs uppercase font-bold tracking-wider text-indigo-800 dark:text-cyan-400">
                // MIỄN PHÍ DÀNH CHO BẠN
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Tải Trọn Bộ 100+ Prompt FLUX & App Flow Tự Động
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Nhập tên và email để hệ thống tự động kích hoạt file template và tài liệu hướng dẫn vào tài khoản của bạn.
              </p>

              <form onSubmit={handleLeadSubmit} className="space-y-3 pt-2">
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

      {/* 6. NEWS & GUIDES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tin Tức & Hướng Dẫn AI Mới Nhất
            </h2>
          </div>
          <Link
            href="/bai-viet"
            className="text-sm font-bold text-indigo-800 dark:text-indigo-400 hover:opacity-85 flex items-center gap-1 font-mono"
          >
            Xem tất cả bài viết <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {initialPosts.slice(0, 4).map((post) => (
            <article
              key={post.id}
              className="bento-card p-4 flex flex-col group transition-all duration-200 border-2 border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/10 shadow-sm"
            >
              {/* Visual Thumbnail */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-[#111116] mb-3.5 border-2 border-slate-300 dark:border-white/[0.06] group-hover:opacity-95 transition-opacity">
                <Image
                  src={getPostCover(post)}
                  alt={post.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-300 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-[#09090b]/80 via-transparent to-black/10 pointer-events-none" />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-900/90 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-300 border border-white/20">
                    {post.category || 'NEWS'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-2 font-mono">
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-semibold">
                  <Clock className="w-3 h-3 text-indigo-800 dark:text-indigo-400" />
                  {new Date(post.created_at).toLocaleDateString('vi-VN')}
                </span>
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
                  <Eye className="w-3 h-3" />
                  {post.views || 0}
                </span>
              </div>

              <Link
                href={`/bai-viet/${post.slug}`}
                className="group/title"
              >
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base line-clamp-2 leading-snug group-hover/title:text-indigo-800 dark:group-hover/title:text-cyan-400 transition-colors">
                  {post.title}
                </h3>
              </Link>

              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1">
                {post.summary}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-300 dark:border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <Link
                  href={`/bai-viet/${post.slug}`}
                  className="font-bold text-indigo-800 dark:text-indigo-400 hover:opacity-80 flex items-center gap-1"
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
