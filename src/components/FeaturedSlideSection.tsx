'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post, Product } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  ArrowRight,
  Clock,
  Eye,
  CheckCircle2,
  Cpu,
  Flame,
  BookOpen,
} from 'lucide-react';

export interface FeaturedSlideItem {
  id: string;
  type: 'COURSE' | 'WORKFLOW' | 'POST';
  badge: string;
  badgeColor: string;
  title: string;
  subtitle?: string;
  description: string;
  highlights: string[];
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  price?: {
    current: number;
    original?: number;
    discount?: string;
  };
  meta?: {
    date?: string;
    readingMinutes?: number;
    views?: number;
  };
  image: string;
  imageAlt: string;
}

interface FeaturedSlideSectionProps {
  posts: Post[];
  products: Product[];
}

export default function FeaturedSlideSection({ posts, products }: FeaturedSlideSectionProps) {
  // Chuẩn bị danh sách slide tổng hợp: Khóa học VIP, Workflow flagship và các bài viết mới & nổi bật
  const slides: FeaturedSlideItem[] = [];

  // 1. Slide Flagship Khóa Học Video AI (Nếu có trong products)
  const videoCourse = products.find(
    (p) => p.slug === 'video-ai-tu-1-anh' || p.pid === 'WF-VIP-297'
  );
  if (videoCourse) {
    slides.push({
      id: 'slide-course-video-ai',
      type: 'COURSE',
      badge: 'KHÓA HỌC HOT 2026',
      badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
      title: 'Khóa Học & Quy Trình Tạo Video AI Triệu View Từ 1 Ảnh Tĩnh',
      subtitle: 'Thực chiến xây kênh TikTok & Reels 2026',
      description:
        'Trọn bộ quy trình 5 bước: viết kịch bản giữ chân 3s với Claude 3.7, giữ nét khuôn mặt nhất quán FLUX/Midjourney và chuyển động mượt mà với Kling AI.',
      highlights: [
        'Bộ Prompt độc quyền giữ nét nhân vật đã kiểm chứng triệu view',
        'Checklist kịch bản phân cảnh 3s & template CapCut tải về dùng ngay',
        'Hỗ trợ thực chiến 1-1 và cập nhật video bài giảng mới trọn đời',
      ],
      ctaText: 'Đăng Ký Khóa Học (297K)',
      ctaLink: '/thanh-toan?pid=WF-VIP-297',
      secondaryCtaText: 'Xem Landing Page Khóa Học',
      secondaryCtaLink: '/lp/video-ai-tu-1-anh',
      price: {
        current: 297000,
        original: 1200000,
        discount: 'Tiết kiệm 75%',
      },
      image: videoCourse.thumbnail || '/images/products/flux-prompt-bundle.jpg',
      imageAlt: 'Khóa học làm video AI bán hàng triệu view từ 1 ảnh',
    });
  }

  // 2. Slide Flagship Workflow n8n Tự Động Đăng Bài Đa Kênh
  const n8nProduct = products.find(
    (p) => p.slug === 'workflow-n8n-tu-dong-dang-bai-da-kenh' || p.pid === 'WF-THAI-099'
  );
  if (n8nProduct) {
    slides.push({
      id: 'slide-n8n-flagship',
      type: 'WORKFLOW',
      badge: 'FLAGSHIP WORKFLOW N8N 2026',
      badgeColor: 'border-indigo-500/40 text-indigo-300 bg-indigo-500/10',
      title: 'Workflow n8n Tự Động Đăng Bài Đa Kênh',
      subtitle: 'Facebook, Telegram & WordPress 24/7',
      description:
        'Hệ thống tự động hóa n8n giúp lên lịch, tạo nội dung bằng AI và tự động đăng bài đa kênh không giới hạn, tiết kiệm 95% thời gian quản lý kênh.',
      highlights: [
        'File JSON import trực tiếp vào n8n trong 30 giây',
        'Video hướng dẫn cài đặt từng bước chi tiết cho người mới',
        'Hỗ trợ kỹ thuật 1-1 qua Zalo khi gặp lỗi cài đặt',
      ],
      ctaText: 'Mua Ngay Với VietQR (99.000 đ)',
      ctaLink: '/thanh-toan?pid=WF-THAI-099',
      secondaryCtaText: 'Xem Chi Tiết Quy Trình',
      secondaryCtaLink: '/san-pham/workflow-n8n-tu-dong-dang-bai-da-kenh',
      price: {
        current: 99000,
        original: 299000,
        discount: 'Tiết kiệm 200.000 đ',
      },
      image: '/images/n8n-workflow-demo.jpg',
      imageAlt: 'Sơ đồ thực tế n8n workflow tự động đăng bài đa kênh',
    });
  }

  // 3. Các bài viết mới & gắn nhãn nổi bật (is_featured = 1)
  const featuredOrNewPosts = posts.slice(0, 4);
  featuredOrNewPosts.forEach((post) => {
    const isFeatured = Boolean(post.is_featured);
    slides.push({
      id: `slide-post-${post.id}`,
      type: 'POST',
      badge: isFeatured ? '🔥 BÀI VIẾT NỔI BẬT' : '⚡ BÀI ĐĂNG MỚI',
      badgeColor: isFeatured
        ? 'border-rose-500/40 text-rose-300 bg-rose-500/10'
        : 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
      title: post.title,
      description: post.summary || '',
      highlights: [
        `Chuyên mục: ${post.category || 'KIẾN THỨC AI'}`,
        'Hướng dẫn thực chiến từng bước không giấu nghề',
        'Chia sẻ kèm Prompt mẫu & sơ đồ kiến trúc ứng dụng',
      ],
      ctaText: 'Đọc Bài Viết Ngay',
      ctaLink: `/bai-viet/${post.slug}`,
      secondaryCtaText: 'Xem Tất Cả Bài Viết',
      secondaryCtaLink: '/bai-viet',
      meta: {
        date: new Date(post.created_at).toLocaleDateString('vi-VN'),
        readingMinutes: Math.max(3, Math.ceil((post.summary || '').length / 50)),
        views: (post.views || 0) + 1,
      },
      image:
        post.thumbnail ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      imageAlt: post.title,
    });
  });

  const totalSlides = slides.length;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Kéo vuốt (Drag & Swipe) Touch / Mouse
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);
  const dragDeltaX = useRef<number>(0);

  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay nhẹ nhàng mỗi 6 giây (tạm dừng khi người dùng hover)
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, totalSlides]);

  // Touch Swipe Handlers (Mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 45) {
        // Vuốt sang trái -> xem slide tiếp
        nextSlide();
      } else if (diff < -45) {
        // Vuốt sang phải -> xem slide trước
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setTimeout(() => setIsPaused(false), 2000);
  };

  // Mouse Drag Handlers (Desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragDeltaX.current = 0;
    setIsPaused(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    dragDeltaX.current = e.clientX - dragStartX.current;
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      if (dragDeltaX.current < -50) {
        nextSlide();
      } else if (dragDeltaX.current > 50) {
        prevSlide();
      }
    }
    isDragging.current = false;
    dragDeltaX.current = 0;
    setTimeout(() => setIsPaused(false), 2000);
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      if (dragDeltaX.current < -50) {
        nextSlide();
      } else if (dragDeltaX.current > 50) {
        prevSlide();
      }
    }
    isDragging.current = false;
    dragDeltaX.current = 0;
    setIsPaused(false);
  };

  if (totalSlides === 0) return null;

  const current = slides[currentIdx];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Điều Hướng Slide */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Tiêu Điểm & Bài Đăng Nổi Bật</span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 uppercase">
                Vuốt để xem ({currentIdx + 1}/{totalSlides})
              </span>
            </h2>
          </div>
        </div>

        {/* Nút Prev / Next & Indicators */}
        <div className="flex items-center gap-2">
          {/* Indicator dots dạng pill mở rộng */}
          <div className="hidden md:flex items-center gap-1.5 mr-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIdx(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIdx === i
                    ? 'w-7 bg-indigo-500 shadow-sm shadow-indigo-500/50'
                    : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40'
                }`}
                title={`Chuyển tới slide ${i + 1}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={prevSlide}
            className="w-9 h-9 rounded-xl border border-slate-300 dark:border-white/10 bg-white/90 dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
            title="Slide trước"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="w-9 h-9 rounded-xl border border-slate-300 dark:border-white/10 bg-white/90 dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
            title="Slide tiếp theo"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Card (Kéo lướt cảm ứng hoặc bằng chuột) */}
      <div
        className="relative select-none overflow-hidden rounded-2xl sm:rounded-3xl cursor-grab active:cursor-grabbing transition-transform"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className="bento-card p-5 sm:p-7 md:p-8 relative overflow-hidden border-2 border-indigo-300 dark:border-indigo-500/30 shadow-xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/20 dark:from-slate-900/90 dark:via-[#0e0e13] dark:to-indigo-950/25">
          {/* Subtle Ambient Light Glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
            {/* Cột trái: Nội dung chi tiết */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              {/* Badge Phân Loại & Đếm Slide */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border tracking-wider uppercase ${current.badgeColor}`}
                >
                  {current.type === 'COURSE' && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                  {current.type === 'WORKFLOW' && <Cpu className="w-3.5 h-3.5 text-indigo-400" />}
                  {current.type === 'POST' && <Flame className="w-3.5 h-3.5 text-rose-400" />}
                  <span>{current.badge}</span>
                </span>

                {current.meta?.date && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {current.meta.date}
                  </span>
                )}

                {current.meta?.views && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {current.meta.views} lượt xem
                  </span>
                )}
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                  {current.title}
                </h3>
                {current.subtitle && (
                  <p className="text-sm sm:text-base font-semibold text-indigo-600 dark:text-cyan-400 mt-1">
                    {current.subtitle}
                  </p>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                {current.description}
              </p>

              {/* Highlights 3 gạch đầu dòng */}
              <div className="space-y-2 py-1">
                {current.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-cyan-400 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Khung Giá Ưu Đãi (Nếu là sản phẩm / khóa học) */}
              {current.price && (
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                    {new Intl.NumberFormat('vi-VN').format(current.price.current)} đ
                  </span>
                  {current.price.original && (
                    <span className="text-xs sm:text-sm text-slate-400 line-through font-mono">
                      {new Intl.NumberFormat('vi-VN').format(current.price.original)} đ
                    </span>
                  )}
                  {current.price.discount && (
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                      {current.price.discount}
                    </span>
                  )}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={current.ctaLink}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 hover:opacity-90 text-white font-black text-xs sm:text-sm shadow-xl shadow-indigo-950/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Zap className="w-4 h-4 text-white" />
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {current.secondaryCtaLink && current.secondaryCtaText && (
                  <Link
                    href={current.secondaryCtaLink}
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl bg-white/80 dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-slate-200 text-xs sm:text-sm font-bold border border-slate-300 dark:border-white/15 transition-colors shadow-xs"
                  >
                    <span>{current.secondaryCtaText}</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Cột phải: Hình ảnh Visual Mockup chất lượng cao */}
            <div className="lg:col-span-5">
              <Link
                href={current.ctaLink}
                className="group relative block rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-indigo-500/30 bg-slate-950 aspect-[16/10] sm:aspect-video shadow-lg"
              >
                <Image
                  src={current.image}
                  alt={current.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />

                {/* Subtle Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                {/* Overlay Hover CTA */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 backdrop-blur-[1px] transition-opacity flex items-center justify-center">
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xl shadow-indigo-600/50">
                    <span>Khám Phá Ngay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Badge Góc Trên Hình Ảnh */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 backdrop-blur-md border border-white/20 text-[11px] font-mono text-cyan-300 shadow-sm z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{current.type === 'POST' ? 'BÀI VIẾT HOT' : 'STATUS: SẴN SÀNG'}</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Swipe Guidance & Indicators */}
      <div className="flex sm:hidden items-center justify-between pt-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
        <span>👈 Vuốt qua lại để xem tiếp 👉</span>
        <div className="flex items-center gap-1">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                currentIdx === i ? 'w-4 bg-indigo-500' : 'w-1.5 bg-slate-400 dark:bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

