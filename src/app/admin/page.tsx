'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingCart,
  Users,
  FileText,
  Mail,
  ArrowRight,
  CheckCircle2,
  Clock,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Loader2,
  Settings,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-slate-400 font-mono">Đang tải dữ liệu thời gian thực...</p>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Bảng Điều Khiển Hệ Thống
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tổng quan dữ liệu bài viết, thành viên, doanh thu và đơn hàng tự động hóa trên tuhocai.top.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/bai-viet/them-moi"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            Đăng bài viết mới
          </Link>
          <Link
            href="/admin/don-hang"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.08] text-xs font-semibold transition-colors"
          >
            Duyệt đơn ({stats?.orders?.pending || 0})
          </Link>
          <Link
            href="/admin/cai-dat"
            className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.08] text-xs font-semibold transition-colors"
            title="Cấu hình VietQR & Telegram"
          >
            <Settings className="w-4 h-4 text-indigo-400" />
            Cài đặt
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Doanh thu */}
        <div className="bento-card p-5 space-y-2 border-indigo-500/20">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold font-mono uppercase">Doanh thu VietQR</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono">
            {new Intl.NumberFormat('vi-VN').format(stats?.orders?.revenue || 0)} đ
          </p>
          <p className="text-[11px] text-slate-400">
            Đã duyệt: <strong className="text-emerald-400">{stats?.orders?.approved || 0}</strong> đơn
          </p>
        </div>

        {/* Đơn hàng chờ duyệt */}
        <div className="bento-card p-5 space-y-2 border-indigo-500/20">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold font-mono uppercase">Đơn hàng chờ duyệt</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">
            {stats?.orders?.pending || 0}
          </p>
          <p className="text-[11px] text-slate-400">
            Tổng cộng: <strong className="text-white font-mono">{stats?.orders?.total || 0}</strong> đơn
          </p>
        </div>

        {/* Thành viên */}
        <div className="bento-card p-5 space-y-2 border-indigo-500/20">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold font-mono uppercase">Thành viên đăng ký</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-indigo-400 font-mono">
            {stats?.users?.total || 0}
          </p>
          <p className="text-[11px] text-slate-400">
            Quản trị viên: <strong className="text-white">{stats?.users?.admins || 1}</strong>
          </p>
        </div>

        {/* Bài viết & Leads */}
        <div className="bento-card p-5 space-y-2 border-indigo-500/20">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold font-mono uppercase">Bài viết & Leads</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-black text-cyan-400 font-mono">
              {stats?.posts?.total || 0}
            </p>
            <span className="text-xs text-slate-400 font-mono">
              Leads: <strong className="text-white">{stats?.leads?.total || 0}</strong>
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Đã xuất bản: <strong className="text-emerald-400">{stats?.posts?.published || 0}</strong> bài
          </p>
        </div>
      </div>

      {/* Two columns: Recent Orders & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-7 bento-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-indigo-400" />
              Đơn hàng gần đây
            </h2>
            <Link
              href="/admin/don-hang"
              className="text-xs text-indigo-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 font-mono">
                  <th className="pb-2.5">Mã đơn</th>
                  <th className="pb-2.5">Khách hàng</th>
                  <th className="pb-2.5">Số tiền</th>
                  <th className="pb-2.5">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {(data?.recentOrders || []).map((order: any) => (
                  <tr key={order.id} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 font-mono text-slate-300 font-medium">{order.order_code}</td>
                    <td className="py-2.5">
                      <p className="font-semibold text-white">{order.customer_name}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{order.customer_email}</p>
                    </td>
                    <td className="py-2.5 font-mono text-white font-bold">
                      {new Intl.NumberFormat('vi-VN').format(order.price)} đ
                    </td>
                    <td className="py-2.5">
                      {order.payment_status === 'APPROVED' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Đã duyệt
                        </span>
                      ) : order.payment_status === 'PENDING' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          Chờ duyệt
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          Từ chối
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users */}
        <div className="lg:col-span-5 bento-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Thành viên mới
            </h2>
            <Link
              href="/admin/thanh-vien"
              className="text-xs text-indigo-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
            >
              Quản lý <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {(data?.recentUsers || []).map((user: any) => (
              <div
                key={user.id}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between"
              >
                <div className="truncate max-w-[180px]">
                  <p className="text-xs font-bold text-white truncate">{user.name || 'Thành viên mới'}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      user.role === 'ADMIN'
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : 'bg-white/[0.05] text-slate-300 border border-white/10'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
