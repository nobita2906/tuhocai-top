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
  Edit3
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

  // Modal Chỉnh Sửa LP
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
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
    isPublished: true,
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
      isPublished: lp.isPublished !== false,
    });
    setEditModalOpen(true);
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

      {/* MODAL: CHỈNH SỬA LANDING PAGE & SUBDOMAIN */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-white">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Edit3 className="w-5 h-5 text-indigo-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Cập Nhật Cấu Hình Landing Page
              </span>
            </div>
            <h2 className="text-xl font-black uppercase text-slate-900 dark:text-white">
              Chỉnh Sửa Subdomain & Quảng Cáo
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Thay đổi Subdomain cho Facebook Ads, cấu hình Facebook Pixel riêng hoặc điều chỉnh giá bán và nội dung.
            </p>

            <form onSubmit={handleUpdateLp} className="space-y-4 text-left text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
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

              {/* Subdomain & Facebook Pixel ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
                <div>
                  <label className="block font-bold text-indigo-950 dark:text-indigo-200 mb-1">
                    🌐 Tên Miền Con (Subdomain):
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="copypage"
                      value={editForm.subdomain}
                      onChange={(e) => setEditForm({ ...editForm, subdomain: e.target.value.toLowerCase().trim() })}
                      className="w-full px-3 py-2 rounded-l-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <span className="px-2.5 py-2 rounded-r-xl bg-slate-200 dark:bg-slate-700 border border-l-0 border-slate-300 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 font-mono font-medium whitespace-nowrap">
                      .tuhocai.top
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                    Ví dụ: nhập <code className="text-indigo-500 font-bold">copypage</code> ➔ link chạy ads là <code className="text-indigo-500 font-bold">copypage.tuhocai.top</code>
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-indigo-950 dark:text-indigo-200 mb-1">
                    🎯 Facebook Pixel ID (Riêng LP này):
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 104592019402918"
                    value={editForm.facebookPixelId}
                    onChange={(e) => setEditForm({ ...editForm, facebookPixelId: e.target.value.trim() })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                    Tự động kích hoạt PageView, InitiateCheckout, Purchase cho tài khoản Ads riêng.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Đường Dẫn Slug mặc định:
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 rounded-l-xl bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-300 dark:border-slate-700 text-xs text-slate-500 font-mono">
                      /lp/
                    </span>
                    <input
                      type="text"
                      required
                      value={editForm.slug}
                      onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                      className="w-full px-3 py-2 rounded-r-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Trạng Thái Hoạt Động:
                  </label>
                  <select
                    value={editForm.isPublished ? 'true' : 'false'}
                    onChange={(e) => setEditForm({ ...editForm, isPublished: e.target.value === 'true' })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="true">✅ Đang Xuất Bản (Hoạt động bình thường)</option>
                    <option value="false">⏸️ Tạm Ẩn (Không nhận truy cập)</option>
                  </select>
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
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-emerald-600 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
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
                    value={editForm.originalPrice}
                    onChange={(e) => setEditForm({ ...editForm, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-400 line-through text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
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
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu thay đổi...</span>
                    </>
                  ) : (
                    <span>Lưu Cấu Hình</span>
                  )}
                </button>
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
