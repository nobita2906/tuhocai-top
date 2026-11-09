'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  CreditCard, 
  DollarSign, 
  Plus, 
  ExternalLink, 
  Filter, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  Eye,
  Percent,
  Compass,
  X,
  Loader2,
  Trash2,
  Edit3,
  Video,
  Gift,
  HelpCircle,
  BookOpen,
  Settings,
  Zap,
  ArrowRight,
  Wand2,
  Star,
  Check
} from 'lucide-react';

export default function AdminLandingPagesPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal Tạo LP mới
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    slug: '',
    subdomain: '',
    facebookPixelId: '',
    title: '',
    headline: '',
    subheadline: '',
    price: 99000,
    originalPrice: 499000,
    videoUrl: '',
    ctaText: '⚡ NHẬN QUY TRÌNH NGAY',
    heroBadge: '✦ QUY TRÌNH THỰC CHIẾN TỰ HỌC AI',
  });

  // Modal Chỉnh Sửa Toàn Bộ Nội Dung LP
  type EditTabType = 'general' | 'hero' | 'showcase' | 'features' | 'modules' | 'bonuses' | 'testimonials' | 'faq';
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeEditTab, setActiveEditTab] = useState<EditTabType>('general');
  const [isUpdating, setIsUpdating] = useState(false);

  const defaultShowcaseTemplate = {
    badge: 'KIẾN TRÚC TỰ ĐỘNG HÓA HOÀN CHỈNH',
    title: 'Tất cả những gì bạn cần: Cắm vào là chạy, không cần viết lại từ đầu!',
    desc: 'Toàn bộ các file Workflow JSON mẫu, tài liệu hướng dẫn từng bước và mã kết nối API đã được đóng gói sẵn. Bạn chỉ cần tải về, nhấn nút Import vào n8n là hệ thống bắt đầu tự hoạt động.',
    highlights: [
      { title: '✓ Tiết kiệm 4-5 tiếng mỗi ngày', desc: 'Không còn phải ngồi gõ từng bài viết hay lên lịch thủ công.' },
      { title: '✓ Chi phí vận hành gần như 0đ', desc: 'Sử dụng n8n bản tự host hoàn toàn miễn phí, không mất phí hàng tháng.' },
      { title: '✓ Báo cáo về Telegram tức thì', desc: 'Kiểm tra kết quả đăng bài trực tiếp ngay trên điện thoại của bạn.' },
      { title: '✓ Nhóm Zalo hỗ trợ kỹ thuật 1-1', desc: 'Được admin và đội ngũ Tự Học AI trực tiếp giải đáp mọi thắc mắc.' },
    ],
  };

  const [editForm, setEditForm] = useState({
    id: '',
    title: '',
    slug: '',
    subdomain: '',
    facebookPixelId: '',
    headline: '',
    subheadline: '',
    price: 99000,
    originalPrice: 499000,
    videoUrl: '',
    ctaText: '⚡ NHẬN QUY TRÌNH NGAY',
    heroBadge: '✦ QUY TRÌNH THỰC CHIẾN TỰ HỌC AI',
    isPublished: true,
    showcase: defaultShowcaseTemplate,
    features: [] as Array<{ title: string; desc: string }>,
    modules: [] as Array<{ step: string; name: string; desc: string }>,
    bonusItems: [] as string[],
    testimonials: [] as Array<{ name: string; role: string; comment: string; avatar: string }>,
    faq: [] as Array<{ q: string; a: string }>,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/landing-pages');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error('Lỗi tải dữ liệu Landing Pages:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenEditModal = (lp: any) => {
    setActiveEditTab('general');

    const rawFeatures = Array.isArray(lp.features) ? lp.features : [];
    const normalizedFeatures = rawFeatures.map((f: any) => ({
      title: f.title || '',
      desc: f.desc || '',
    }));

    const rawModules = Array.isArray(lp.modules) ? lp.modules : [];
    const normalizedModules = rawModules.map((m: any, idx: number) => ({
      step: m.step || `0${idx + 1}`.slice(-2),
      name: m.name || m.title || `Bước ${idx + 1}`,
      desc: m.desc || '',
    }));

    const showcaseData = lp.showcase && typeof lp.showcase === 'object' ? {
      badge: lp.showcase.badge || defaultShowcaseTemplate.badge,
      title: lp.showcase.title || defaultShowcaseTemplate.title,
      desc: lp.showcase.desc || defaultShowcaseTemplate.desc,
      highlights: Array.isArray(lp.showcase.highlights) && lp.showcase.highlights.length > 0 ? lp.showcase.highlights : defaultShowcaseTemplate.highlights,
    } : defaultShowcaseTemplate;

    setEditForm({
      id: lp.id,
      title: lp.title || '',
      slug: lp.slug || '',
      subdomain: lp.subdomain || '',
      facebookPixelId: lp.facebookPixelId || '',
      headline: lp.headline || '',
      subheadline: lp.subheadline || '',
      price: lp.price || 99000,
      originalPrice: lp.originalPrice || 499000,
      videoUrl: lp.videoUrl || '',
      ctaText: lp.ctaText || '⚡ NHẬN QUY TRÌNH NGAY',
      heroBadge: lp.heroBadge || '✦ QUY TRÌNH THỰC CHIẾN TỰ HỌC AI',
      isPublished: lp.isPublished !== false,
      showcase: showcaseData,
      features: normalizedFeatures,
      modules: normalizedModules,
      bonusItems: Array.isArray(lp.bonusItems) ? lp.bonusItems : [],
      testimonials: Array.isArray(lp.testimonials) ? lp.testimonials : [],
      faq: Array.isArray(lp.faq) ? lp.faq : [],
    });
    setEditModalOpen(true);
  };

  // Helper: Thêm / Xóa / Sửa Tính năng
  const addFeature = () => {
    setEditForm((prev) => ({
      ...prev,
      features: [...prev.features, { title: '', desc: '' }],
    }));
  };
  const updateFeature = (index: number, field: 'title' | 'desc', val: string) => {
    setEditForm((prev) => {
      const copy = [...prev.features];
      copy[index] = { ...copy[index], [field]: val };
      return { ...prev, features: copy };
    });
  };
  const removeFeature = (index: number) => {
    setEditForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // Helper: Thêm / Xóa / Sửa Modules
  const addModule = () => {
    setEditForm((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          step: `0${prev.modules.length + 1}`.slice(-2),
          name: '',
          desc: '',
        },
      ],
    }));
  };
  const updateModule = (index: number, field: 'step' | 'name' | 'desc', val: string) => {
    setEditForm((prev) => {
      const copy = [...prev.modules];
      copy[index] = { ...copy[index], [field]: val };
      return { ...prev, modules: copy };
    });
  };
  const removeModule = (index: number) => {
    setEditForm((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }));
  };

  // Helper: Thêm / Xóa / Sửa Quà tặng Bonus
  const addBonus = () => {
    setEditForm((prev) => ({
      ...prev,
      bonusItems: [...prev.bonusItems, ''],
    }));
  };
  const updateBonus = (index: number, val: string) => {
    setEditForm((prev) => {
      const copy = [...prev.bonusItems];
      copy[index] = val;
      return { ...prev, bonusItems: copy };
    });
  };
  const removeBonus = (index: number) => {
    setEditForm((prev) => ({
      ...prev,
      bonusItems: prev.bonusItems.filter((_, i) => i !== index),
    }));
  };

  // Helper: Thêm / Xóa / Sửa Đánh giá Testimonial
  const addTestimonial = () => {
    setEditForm((prev) => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        {
          name: '',
          role: 'Học viên / Khách hàng',
          comment: '',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user_${Date.now()}`,
        },
      ],
    }));
  };
  const updateTestimonial = (index: number, field: string, val: string) => {
    setEditForm((prev) => {
      const copy = [...prev.testimonials];
      copy[index] = { ...copy[index], [field]: val };
      return { ...prev, testimonials: copy };
    });
  };
  const removeTestimonial = (index: number) => {
    setEditForm((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index),
    }));
  };

  // Helper: Thêm / Xóa / Sửa FAQ
  const addFaq = () => {
    setEditForm((prev) => ({
      ...prev,
      faq: [...prev.faq, { q: '', a: '' }],
    }));
  };
  const updateFaq = (index: number, field: 'q' | 'a', val: string) => {
    setEditForm((prev) => {
      const copy = [...prev.faq];
      copy[index] = { ...copy[index], [field]: val };
      return { ...prev, faq: copy };
    });
  };
  const removeFaq = (index: number) => {
    setEditForm((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index),
    }));
  };

  // Helper: Nạp dữ liệu mẫu nhanh (Fill Demo Template)
  const handleFillDemoTemplate = () => {
    if (!confirm('Nạp bộ nội dung mẫu chuẩn chuyển đổi cao của Tự Học AI vào biểu mẫu? (Nội dung hiện tại sẽ được cập nhật)')) return;
    setEditForm((prev) => ({
      ...prev,
      heroBadge: prev.heroBadge || '✦ QUY TRÌNH THỰC CHIẾN ĐỘC QUYỀN TỰ HỌC AI',
      headline: prev.headline || 'TỰ ĐỘNG HÓA TOÀN BỘ CÔNG VIỆC KINH DOANH SỐ VỚI AI & N8N',
      subheadline: prev.subheadline || 'Hệ thống đã được đóng gói sẵn từng dòng lệnh và file workflow JSON. Bạn chỉ việc nhập vào n8n là kích hoạt cỗ máy tạo doanh thu 24/7.',
      ctaText: '⚡ NHẬN QUY TRÌNH NGAY (ƯU ĐÃI HÔM NAY)',
      showcase: defaultShowcaseTemplate,
      features: [
        { title: 'Tự động cào dữ liệu & tin tức 24/7', desc: 'Hệ thống tự động quét và tổng hợp dữ liệu từ hàng chục nguồn tin cậy mỗi ngày mà không cần mở máy.' },
        { title: 'Biên tập & viết lại bài bằng AI chuẩn SEO', desc: 'Ứng dụng Claude 3.7 và GPT-4o để viết lại 100% độc bản, tự chèn hình ảnh và định dạng thẻ bài viết.' },
        { title: 'Tự động xuất bản đa kênh Facebook & Blog', desc: 'Kết nối trực tiếp API đẩy bài viết lên Fanpage, Kênh Telegram thông báo và Website tự động.' },
        { title: 'Khớp đơn VietQR & Kích hoạt tức thì', desc: 'Nhận diện thanh toán tự động qua SePay, gửi thông báo doanh thu về điện thoại trong 3 giây.' },
      ],
      modules: [
        { step: '01', name: 'Cài Đặt & Kích Hoạt Hệ Thống n8n', desc: 'Hướng dẫn tự host n8n miễn phí trọn đời trên máy tính hoặc VPS cá nhân chi phí 0đ.' },
        { step: '02', name: 'Import File JSON Mẫu Chỉ Trong 30 Giây', desc: 'Tải trọn bộ file workflow JSON đóng gói sẵn từ Tự Học AI và bấm Import là xong.' },
        { step: '03', name: 'Cấu Hình Token API AI & Kênh Xuất Bản', desc: 'Điền API Key OpenAI/Claude, Telegram Bot và Facebook Page Access Token theo hướng dẫn từng cú click.' },
        { step: '04', name: 'Lên Lịch Tự Động & Kiểm Thử Vận Hành', desc: 'Thiết lập giờ chạy nền tự động hàng ngày và kiểm tra thông báo báo về điện thoại.' },
      ],
      bonusItems: [
        'Bộ 500+ Prompt AI Chuẩn Thương Mại Chuyên Sâu (Trị giá 499.000đ)',
        'Bot Thông Báo Đơn Hàng & Duyệt Tự Động Telegram (Trị giá 299.000đ)',
        'Quyền Tham Gia Nhóm Zalo Hỗ Trợ Kỹ Thuật VIP 1-1 Trọn Đời (Vô giá)',
      ],
      testimonials: [
        {
          name: 'Trần Minh Quân',
          role: 'Content Creator & Blogger',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Quan',
          comment: 'Quy trình n8n của Tự Học AI setup siêu nhanh. Trước đây mình mất 4 tiếng viết bài mỗi ngày, giờ hệ thống tự chạy đăng 15 bài/ngày.',
        },
        {
          name: 'Lê Thị Bích Ngọc',
          role: 'Kinh doanh Online',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ngoc',
          comment: 'Không biết code tí nào mà làm theo video hướng dẫn 20 phút là chạy mượt. Khách chuyển tiền xong hệ thống tự gửi tài liệu ngay lập tức!',
        },
      ],
      faq: [
        { q: 'Tôi không biết lập trình hay viết code thì có dùng được không?', a: 'Hoàn toàn dùng được! Toàn bộ hệ thống đã được đóng gói thành file JSON dựng sẵn. Bạn chỉ cần tải về, import vào n8n và điền API Key theo video hướng dẫn từng cú click chuột.' },
        { q: 'Hệ thống có mất phí duy trì hàng tháng không?', a: 'Không! Bạn có thể cài n8n hoàn toàn miễn phí trên máy tính cá nhân hoặc máy chủ ảo VPS giá rẻ. Bạn sở hữu quy trình vĩnh viễn và không phải trả thêm phí đăng ký tháng nào cho Tự Học AI.' },
        { q: 'Sau khi thanh toán tôi nhận quy trình như thế nào?', a: 'Hệ thống VietQR tự động khớp đơn trong 3 giây. Ngay sau khi chuyển khoản thành công, màn hình sẽ tự động mở khóa link tải trọn bộ file JSON kèm video hướng dẫn và link mời vào nhóm Zalo VIP.' },
        { q: 'Nếu gặp lỗi khi cài đặt tôi có được hỗ trợ không?', a: 'Được hỗ trợ tận tình 1-1 qua Zalo hoặc UltraViewer bởi đội ngũ kỹ thuật của Tự Học AI cho đến khi bạn cài đặt và vận hành hệ thống thành công.' },
      ],
    }));
  };

  const handleUpdateLp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await fetch('/api/admin/landing-pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const json = await res.json();
      if (json.success) {
        setEditModalOpen(false);
        await fetchData();
      } else {
        alert(json.error || 'Có lỗi xảy ra khi cập nhật');
      }
    } catch (e: any) {
      alert(e.message || 'Lỗi kết nối máy chủ');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateLp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/landing-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        setModalOpen(false);
        setForm({
          slug: '',
          subdomain: '',
          facebookPixelId: '',
          title: '',
          headline: '',
          subheadline: '',
          price: 99000,
          originalPrice: 499000,
          videoUrl: '',
          ctaText: '⚡ NHẬN QUY TRÌNH NGAY',
          heroBadge: '✦ QUY TRÌNH THỰC CHIẾN TỰ HỌC AI',
        });
        await fetchData();
      } else {
        alert(json.error || 'Có lỗi xảy ra');
      }
    } catch (e: any) {
      alert(e.message || 'Lỗi kết nối máy chủ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTitleChange = (val: string) => {
    // Tự sinh slug từ tiêu đề nếu slug chưa chỉnh tay
    const generatedSlug = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    setForm(prev => ({
      ...prev,
      title: val,
      headline: prev.headline || val.toUpperCase(),
      slug: prev.slug === '' ? generatedSlug : prev.slug,
    }));
  };

  const filteredLps = data?.landingPages?.filter((lp: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return lp.title.toLowerCase().includes(q) || lp.slug.toLowerCase().includes(q);
  }) || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Landing Pages & Funnel Analytics
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Theo dõi lưu lượng, lượt click CTA, tỷ lệ chuyển đổi và doanh thu từng khóa học thời gian thực
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tạo Landing Page Mới</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Số Landing Page</span>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {data?.totals?.totalLps || 0}
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Đang hoạt động</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-blue-500" />
            <span>Lượt xem (Views)</span>
          </span>
          <p className="mt-1 text-2xl font-black text-blue-600 dark:text-blue-400">
            {new Intl.NumberFormat('vi-VN').format(data?.totals?.totalViews || 0)}
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Tổng traffic ghé thăm</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <MousePointerClick className="w-3.5 h-3.5 text-amber-500" />
            <span>Click CTA Mua</span>
          </span>
          <p className="mt-1 text-2xl font-black text-amber-600 dark:text-amber-400">
            {new Intl.NumberFormat('vi-VN').format(data?.totals?.totalCtaClicks || 0)}
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Bấm mở modal / mua</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
            <span>Đơn khởi tạo</span>
          </span>
          <p className="mt-1 text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {data?.totals?.totalOrders || 0}
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Pending & Approved</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Percent className="w-3.5 h-3.5 text-emerald-500" />
            <span>Tỷ Lệ CR% (Mua)</span>
          </span>
          <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {data?.totals?.overallConversionRate || 0}%
          </p>
          <span className="text-[10px] text-emerald-500 font-bold mt-0.5 block">
            {data?.totals?.totalPaidOrders || 0} đơn thành công
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-rose-500" />
            <span>Doanh Thu LPs</span>
          </span>
          <p className="mt-1 text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 truncate">
            {new Intl.NumberFormat('vi-VN').format(data?.totals?.totalRevenue || 0)} đ
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Khớp SePay Auto</span>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc slug landing page..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Hiển thị <strong>{filteredLps.length}</strong> Landing Page
        </div>
      </div>

      {/* MAIN TABLE: LANDING PAGES RANKING */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Landing Page / Khóa Học</th>
                <th className="py-3.5 px-3">Giá Bán</th>
                <th className="py-3.5 px-3 text-center">Lượt Xem</th>
                <th className="py-3.5 px-3 text-center">Bấm Mua (CTA)</th>
                <th className="py-3.5 px-3 text-center">Đơn Đã Mua</th>
                <th className="py-3.5 px-4">Tỷ Lệ CR%</th>
                <th className="py-3.5 px-4 text-right">Doanh Thu</th>
                <th className="py-3.5 px-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    Đang tính toán các chỉ số phễu chuyển đổi...
                  </td>
                </tr>
              ) : filteredLps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    Không tìm thấy Landing Page nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredLps.map((lp: any) => {
                  return (
                    <tr key={lp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      {/* Name, Slug, Subdomain & Pixel */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                          <span>{lp.title}</span>
                          {!lp.isPublished && (
                            <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-normal">
                              Tạm ẩn
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <code className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              /lp/{lp.slug}
                            </code>
                            <a
                              href={`/lp/${lp.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-indigo-500"
                              title="Mở xem trực tiếp link gốc"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          {lp.subdomain ? (
                            <a
                              href={`https://${lp.subdomain}.tuhocai.top`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-bold hover:bg-indigo-100 transition"
                              title="Click mở Subdomain Ads thực tế"
                            >
                              <span>🌐 {lp.subdomain}.tuhocai.top</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">
                              (Chưa gắn subdomain)
                            </span>
                          )}

                          {lp.facebookPixelId && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-mono text-[10px]">
                              <span>🎯 {lp.facebookPixelId}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                        {new Intl.NumberFormat('vi-VN').format(lp.price)} đ
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-3 text-center font-bold text-slate-700 dark:text-slate-300">
                        {new Intl.NumberFormat('vi-VN').format(lp.views)}
                      </td>

                      {/* CTA Clicks */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {new Intl.NumberFormat('vi-VN').format(lp.ctaClicks)}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {lp.ctaRate}%
                        </span>
                      </td>

                      {/* Paid Orders */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {lp.paidOrders}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          / {lp.totalOrders} đơn
                        </span>
                      </td>

                      {/* CR% with Progress Bar */}
                      <td className="py-3.5 px-4 min-w-[130px]">
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className={lp.conversionRate >= 3 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}>
                            {lp.conversionRate}%
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            RPM: {new Intl.NumberFormat('vi-VN').format(lp.rpm)}đ
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              lp.conversionRate >= 3
                                ? 'bg-emerald-500'
                                : lp.conversionRate >= 1
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                            }`}
                            style={{ width: `${Math.min(lp.conversionRate * 15, 100)}%` }}
                          />
                        </div>
                      </td>

                      {/* Revenue */}
                      <td className="py-3.5 px-4 text-right font-black text-rose-600 dark:text-rose-400">
                        {new Intl.NumberFormat('vi-VN').format(lp.revenue)} đ
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(lp)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                            title="Chỉnh sửa Subdomain, Facebook Pixel, Giá bán..."
                          >
                            <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Sửa</span>
                          </button>
                          <Link
                            href={`/admin/don-hang?landing_slug=${lp.slug}`}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-bold text-xs"
                            title="Xem danh sách đơn hàng của riêng Landing Page này"
                          >
                            Đơn hàng
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOP UTM SOURCES BREAKDOWN */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <Compass className="w-5 h-5 text-indigo-500" />
          <span>Hiệu Quả Theo Kênh Tiếp Thị (UTM Sources Breakdown)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {data?.utmStats?.map((s: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm capitalize truncate">
                  {s.source}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {s.paid_count} đã mua
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">{s.count} đơn tạo</span>
                <strong className="text-rose-600 dark:text-rose-400 font-black">
                  {new Intl.NumberFormat('vi-VN').format(s.revenue)} đ
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: CHỈNH SỬA TOÀN BỘ NỘI DUNG LANDING PAGE */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white overflow-hidden">
            
            {/* MODAL HEADER */}
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black uppercase text-slate-900 dark:text-white">
                      Trình Biên Tập Toàn Diện Landing Page
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      <span>Đường dẫn: <strong className="text-indigo-600 dark:text-indigo-400 font-mono">/lp/{editForm.slug}</strong></span>
                      {editForm.subdomain && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-[10px]">
                          {editForm.subdomain}.tuhocai.top
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS ON HEADER */}
              <div className="flex items-center gap-2 sm:pr-8">
                <button
                  type="button"
                  onClick={handleFillDemoTemplate}
                  className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1.5 transition"
                  title="Nạp nhanh bộ nội dung mẫu chuẩn chuyển đổi cao của Tự Học AI"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Nạp Mẫu Chuẩn</span>
                </button>

                <a
                  href={`/lp/${editForm.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem Live</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <button
                  onClick={() => setEditModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ml-1"
                  aria-label="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* TAB NAVIGATION BAR */}
            <div className="px-6 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveEditTab('general')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                  activeEditTab === 'general'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>⚙️ Cấu Hình & Giá</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveEditTab('hero')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                  activeEditTab === 'hero'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>🎯 Hero & Video</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveEditTab('showcase')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                  activeEditTab === 'showcase'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>💎 Showcase Box</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveEditTab('features')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                  activeEditTab === 'features'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>⚡ Tính Năng ({editForm.features.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveEditTab('modules')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                  activeEditTab === 'modules'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>📚 Lộ Trình ({editForm.modules.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveEditTab('bonuses')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                  activeEditTab === 'bonuses'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Gift className="w-3.5 h-3.5" />
                <span>🎁 Quà Tặng ({editForm.bonusItems.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveEditTab('testimonials')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                  activeEditTab === 'testimonials'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>⭐ Đánh Giá ({editForm.testimonials.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveEditTab('faq')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                  activeEditTab === 'faq'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>❓ FAQ ({editForm.faq.length})</span>
              </button>
            </div>

            {/* TAB CONTENT BODY (SCROLLABLE) */}
            <form onSubmit={handleUpdateLp} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              
              {/* TAB 1: CẤU HÌNH & GIÁ */}
              {activeEditTab === 'general' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                        Tên Khóa Học / Landing Page:
                      </label>
                      <input
                        type="text"
                        required
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                        Trạng Thái Hoạt Động:
                      </label>
                      <select
                        value={editForm.isPublished ? 'true' : 'false'}
                        onChange={(e) => setEditForm({ ...editForm, isPublished: e.target.value === 'true' })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                      >
                        <option value="true">✅ Đang Xuất Bản (Khách xem & mua bình thường)</option>
                        <option value="false">⏸️ Tạm Ẩn (Không nhận truy cập)</option>
                      </select>
                    </div>
                  </div>

                  {/* Slug & Subdomain */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
                    <div>
                      <label className="block font-bold text-indigo-950 dark:text-indigo-200 mb-1 text-xs">
                        Đường Dẫn Slug mặc định:
                      </label>
                      <div className="flex items-center">
                        <span className="px-3 py-2.5 rounded-l-xl bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-300 dark:border-slate-700 text-xs text-slate-500 font-mono">
                          /lp/
                        </span>
                        <input
                          type="text"
                          required
                          value={editForm.slug}
                          onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-r-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-indigo-950 dark:text-indigo-200 mb-1 text-xs">
                        🌐 Tên Miền Con Riêng (Subdomain Ads):
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          placeholder="copypage"
                          value={editForm.subdomain}
                          onChange={(e) => setEditForm({ ...editForm, subdomain: e.target.value.toLowerCase().trim() })}
                          className="w-full px-3 py-2.5 rounded-l-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <span className="px-2.5 py-2.5 rounded-r-xl bg-slate-200 dark:bg-slate-700 border border-l-0 border-slate-300 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 font-mono font-medium whitespace-nowrap">
                          .tuhocai.top
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Giá bán & Pixel */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                        Giá Bán Ưu Đãi (đ):
                      </label>
                      <input
                        type="number"
                        required
                        step={1000}
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-emerald-600 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                        Giá Gốc Gạch Đi (đ):
                      </label>
                      <input
                        type="number"
                        required
                        step={1000}
                        value={editForm.originalPrice}
                        onChange={(e) => setEditForm({ ...editForm, originalPrice: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-400 line-through text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                        🎯 Facebook Pixel ID (Riêng LP):
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: 104592019402918"
                        value={editForm.facebookPixelId}
                        onChange={(e) => setEditForm({ ...editForm, facebookPixelId: e.target.value.trim() })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: HERO & VIDEO */}
              {activeEditTab === 'hero' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                      Huy Hiệu Đầu Trang (Hero Badge):
                    </label>
                    <input
                      type="text"
                      placeholder="✦ QUY TRÌNH THỰC CHIẾN TỰ HỌC AI"
                      value={editForm.heroBadge}
                      onChange={(e) => setEditForm({ ...editForm, heroBadge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none text-indigo-600 dark:text-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                      Headline Chính In Hoa (Gây ấn tượng & đánh trúng nhu cầu):
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="SAO CHÉP BẤT KỲ QUY TRÌNH NÀO BẠN MUỐN CHỈ VỚI 1 CLICK"
                      value={editForm.headline}
                      onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm sm:text-base uppercase font-black focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                      Mô Tả Phụ (Subheadline - Tóm tắt lợi ích cốt lõi người học nhận được):
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mô tả tóm tắt lợi ích cốt lõi người học sẽ nhận được ngay sau khi chuyển khoản..."
                      value={editForm.subheadline}
                      onChange={(e) => setEditForm({ ...editForm, subheadline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                        Văn Bản Nút Mua Hàng (CTA Button):
                      </label>
                      <input
                        type="text"
                        placeholder="⚡ NHẬN QUY TRÌNH NGAY"
                        value={editForm.ctaText}
                        onChange={(e) => setEditForm({ ...editForm, ctaText: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                        Video YouTube Demo (URL xem video):
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={editForm.videoUrl}
                        onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SHOWCASE BOX */}
              {activeEditTab === 'showcase' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-4">
                    <div>
                      <label className="block font-bold text-indigo-950 dark:text-indigo-200 mb-1 text-xs">
                        Huy Hiệu Khối Showcase:
                      </label>
                      <input
                        type="text"
                        value={editForm.showcase.badge}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          showcase: { ...editForm.showcase, badge: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-indigo-950 dark:text-indigo-200 mb-1 text-xs">
                        Tiêu Đề Khối Showcase:
                      </label>
                      <input
                        type="text"
                        value={editForm.showcase.title}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          showcase: { ...editForm.showcase, title: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-indigo-950 dark:text-indigo-200 mb-1 text-xs">
                        Mô Tả Chi Tiết Khối Showcase:
                      </label>
                      <textarea
                        rows={3}
                        value={editForm.showcase.desc}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          showcase: { ...editForm.showcase, desc: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                      4 Điểm Nhấn Cam Kết Nhanh (Highlights):
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {editForm.showcase.highlights.map((hl, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                          <input
                            type="text"
                            placeholder="Tiêu đề điểm nhấn..."
                            value={hl.title}
                            onChange={(e) => {
                              const copy = [...editForm.showcase.highlights];
                              copy[idx] = { ...copy[idx], title: e.target.value };
                              setEditForm({ ...editForm, showcase: { ...editForm.showcase, highlights: copy } });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Mô tả ngắn gọn..."
                            value={hl.desc}
                            onChange={(e) => {
                              const copy = [...editForm.showcase.highlights];
                              copy[idx] = { ...copy[idx], desc: e.target.value };
                              setEditForm({ ...editForm, showcase: { ...editForm.showcase, highlights: copy } });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TÍNH NĂNG VƯỢT TRỘI (FEATURES) */}
              {activeEditTab === 'features' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        Danh Sách Tính Năng Vượt Trội ({editForm.features.length})
                      </h3>
                      <p className="text-xs text-slate-500">Hiển thị dạng các thẻ lưới 01, 02, 03... nổi bật lợi ích kỹ thuật</p>
                    </div>
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Tính Năng</span>
                    </button>
                  </div>

                  {editForm.features.length === 0 ? (
                    <div className="text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
                      Chưa có tính năng nào. Bấm nút <strong>"+ Thêm Tính Năng"</strong> hoặc <strong>"Nạp Mẫu Chuẩn"</strong> ở góc trên.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {editForm.features.map((feat, idx) => (
                        <div key={idx} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2 flex items-start gap-3">
                          <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-mono font-black text-xs flex items-center justify-center shrink-0">
                            0{idx + 1}
                          </span>
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              placeholder="Tiêu đề tính năng (Ví dụ: Cào tin tức tự động 24/7)"
                              value={feat.title}
                              onChange={(e) => updateFeature(idx, 'title', e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <textarea
                              rows={2}
                              placeholder="Mô tả cụ thể giá trị người mua nhận được..."
                              value={feat.desc}
                              onChange={(e) => updateFeature(idx, 'desc', e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFeature(idx)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition cursor-pointer"
                            title="Xóa tính năng"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: LỘ TRÌNH & NỘI DUNG CHI TIẾT (MODULES) */}
              {activeEditTab === 'modules' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        Lộ Trình Các Bước & Bài Học ({editForm.modules.length})
                      </h3>
                      <p className="text-xs text-slate-500">Giúp người mua thấy rõ từng bước sẽ được học và nhận được sau khi chuyển khoản</p>
                    </div>
                    <button
                      type="button"
                      onClick={addModule}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Bước / Module</span>
                    </button>
                  </div>

                  {editForm.modules.length === 0 ? (
                    <div className="text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
                      Chưa có bước / module nào. Bấm nút <strong>"+ Thêm Bước / Module"</strong> để tạo lộ trình.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {editForm.modules.map((m, idx) => (
                        <div key={idx} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-start gap-3">
                          <input
                            type="text"
                            value={m.step}
                            onChange={(e) => updateModule(idx, 'step', e.target.value)}
                            className="w-14 px-2 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-center text-xs text-indigo-600 outline-none"
                            title="Mã số bước (01, 02...)"
                          />
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              placeholder="Tên bước (Ví dụ: Cài đặt & Kích hoạt n8n miễn phí)"
                              value={m.name}
                              onChange={(e) => updateModule(idx, 'name', e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <textarea
                              rows={2}
                              placeholder="Mô tả nội dung cụ thể trong bước này..."
                              value={m.desc}
                              onChange={(e) => updateModule(idx, 'desc', e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeModule(idx)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition cursor-pointer"
                            title="Xóa module"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: QUÀ TẶNG ĐỘC QUYỀN (BONUSES) */}
              {activeEditTab === 'bonuses' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        Quà Tặng Kèm Độc Quyền ({editForm.bonusItems.length})
                      </h3>
                      <p className="text-xs text-slate-500">Tăng mạnh tỷ lệ chuyển đổi bằng việc tặng kèm template, prompt VIP hoặc nhóm hỗ trợ</p>
                    </div>
                    <button
                      type="button"
                      onClick={addBonus}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Quà Tặng</span>
                    </button>
                  </div>

                  {editForm.bonusItems.length === 0 ? (
                    <div className="text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
                      Chưa có quà tặng nào. Bấm nút <strong>"+ Thêm Quà Tặng"</strong> để thêm quà kích thích mua.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {editForm.bonusItems.map((bonus, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                          <Gift className="w-4 h-4 text-amber-500 shrink-0 ml-1" />
                          <input
                            type="text"
                            placeholder="Ví dụ: Bộ 500+ Prompt Midjourney Bán Hàng (Trị giá 499.000đ)"
                            value={bonus}
                            onChange={(e) => updateBonus(idx, e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeBonus(idx)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition cursor-pointer"
                            title="Xóa quà tặng"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: ĐÁNH GIÁ HỌC VIÊN (TESTIMONIALS) */}
              {activeEditTab === 'testimonials' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        Đánh Giá & Nhận Xét Của Học Viên ({editForm.testimonials.length})
                      </h3>
                      <p className="text-xs text-slate-500">Tạo bằng chứng xã hội (Social Proof) uy tín giúp khách hàng an tâm chuyển tiền</p>
                    </div>
                    <button
                      type="button"
                      onClick={addTestimonial}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Đánh Giá</span>
                    </button>
                  </div>

                  {editForm.testimonials.length === 0 ? (
                    <div className="text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
                      Chưa có đánh giá nào. Bấm nút <strong>"+ Thêm Đánh Giá"</strong> để thêm nhận xét học viên.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {editForm.testimonials.map((testi, idx) => (
                        <div key={idx} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Họ tên học viên (Ví dụ: Trần Minh Quân)"
                              value={testi.name}
                              onChange={(e) => updateTestimonial(idx, 'name', e.target.value)}
                              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none"
                            />
                            <input
                              type="text"
                              placeholder="Nghề nghiệp / Vai trò (Ví dụ: Content Creator & Blogger)"
                              value={testi.role}
                              onChange={(e) => updateTestimonial(idx, 'role', e.target.value)}
                              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                            />
                          </div>

                          <div className="flex items-start gap-2">
                            <textarea
                              rows={2}
                              placeholder="Lời nhận xét thực tế về kết quả đạt được..."
                              value={testi.comment}
                              onChange={(e) => updateTestimonial(idx, 'comment', e.target.value)}
                              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeTestimonial(idx)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition cursor-pointer self-center"
                              title="Xóa nhận xét"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 8: CÂU HỎI THƯỜNG GẶP (FAQ) */}
              {activeEditTab === 'faq' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        Câu Hỏi Thường Gặp FAQ ({editForm.faq.length})
                      </h3>
                      <p className="text-xs text-slate-500">Giải đáp khúc mắc trước khi mua (không biết code, phí duy trì, hỗ trợ...)</p>
                    </div>
                    <button
                      type="button"
                      onClick={addFaq}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Câu Hỏi</span>
                    </button>
                  </div>

                  {editForm.faq.length === 0 ? (
                    <div className="text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
                      Chưa có câu hỏi nào. Bấm nút <strong>"+ Thêm Câu Hỏi"</strong> để thêm thắc mắc thường gặp.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {editForm.faq.map((item, idx) => (
                        <div key={idx} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">Câu hỏi #{idx + 1}:</span>
                            <button
                              type="button"
                              onClick={() => removeFaq(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition cursor-pointer"
                              title="Xóa câu hỏi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Câu hỏi (Ví dụ: Tôi không biết code thì có làm được không?)"
                            value={item.q}
                            onChange={(e) => updateFaq(idx, 'q', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none"
                          />
                          <textarea
                            rows={2}
                            placeholder="Câu trả lời giải tỏa băn khoăn cho khách hàng..."
                            value={item.a}
                            onChange={(e) => updateFaq(idx, 'a', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* MODAL FOOTER */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="text-xs text-slate-500">
                  Tip: Bạn có thể chuyển qua lại giữa các tab để hoàn thiện nội dung trước khi lưu.
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang lưu toàn bộ nội dung...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Lưu Toàn Bộ Nội Dung Landing Page</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TẠO LANDING PAGE MỚI */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-white">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Landing Page Builder
              </span>
            </div>
            <h2 className="text-xl font-black uppercase text-slate-900 dark:text-white">
              Tạo Landing Page Khóa Học Mới
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Hệ thống sẽ tự động khởi tạo Landing Page chuẩn Mobile CRO kèm cổng thanh toán SePay Auto và bộ theo dõi chuyển đổi.
            </p>

            <form onSubmit={handleCreateLp} className="space-y-4 text-left text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tên Khóa Học / Quy Trình:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Khóa Học Prompt Midjourney Master Bán Hàng"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Đường Dẫn Slug:
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 rounded-l-xl bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-300 dark:border-slate-700 text-xs text-slate-500 font-mono">
                      /lp/
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="prompt-midjourney-master"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-r-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    🌐 Subdomain Tùy Chọn (Chạy Ads):
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="prompt"
                      value={form.subdomain}
                      onChange={(e) => setForm({ ...form, subdomain: e.target.value.toLowerCase().trim() })}
                      className="w-full px-3 py-2.5 rounded-l-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <span className="px-2.5 py-2.5 rounded-r-xl bg-slate-200 dark:bg-slate-700 border border-l-0 border-slate-300 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 font-mono font-medium whitespace-nowrap">
                      .tuhocai.top
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    🎯 Facebook Pixel ID (Tùy chọn):
                  </label>
                  <input
                    type="text"
                    placeholder="104592019402918"
                    value={form.facebookPixelId}
                    onChange={(e) => setForm({ ...form, facebookPixelId: e.target.value.trim() })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Video YouTube Demo (Tùy chọn):
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={form.videoUrl}
                    onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Giá Bán Ưu Đãi (đ):
                  </label>
                  <input
                    type="number"
                    required
                    step={1000}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-emerald-600 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Giá Gốc Gạch Đi (đ):
                  </label>
                  <input
                    type="number"
                    required
                    step={1000}
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-400 line-through text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Headline Chính (Tiêu đề in hoa gây ấn tượng):
                </label>
                <input
                  type="text"
                  required
                  placeholder="SAO CHÉP BẤT KỲ QUY TRÌNH NÀO BẠN MUỐN CHỈ VỚI 1 CLICK"
                  value={form.headline}
                  onChange={(e) => setForm({ ...form, headline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm uppercase font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mô tả phụ (Subheadline):
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả tóm tắt lợi ích cốt lõi người học sẽ nhận được ngay sau khi chuyển khoản..."
                  value={form.subheadline}
                  onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang tạo...</span>
                    </>
                  ) : (
                    <span>Xuất Bản Landing Page</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
