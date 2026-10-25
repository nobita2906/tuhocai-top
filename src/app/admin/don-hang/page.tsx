'use client';

import { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Eye,
  Loader2,
  DollarSign,
  AlertCircle,
  FileCheck,
  X,
  User,
  ShoppingBag,
} from 'lucide-react';
import Pagination from '@/components/ui/Pagination';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const PAGE_SIZE = 10;

  const loadOrders = async () => {
    try {
      setLoading(true);
      const url = new URL('/api/admin/orders', window.location.origin);
      if (statusFilter !== 'ALL') url.searchParams.set('status', statusFilter);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId: string, newStatus: 'APPROVED' | 'REJECTED') => {
    const confirmMsg =
      newStatus === 'APPROVED'
        ? 'Duyệt đơn hàng này? Khách hàng sẽ ngay lập tức được cấp quyền tải sản phẩm vào Thư viện cá nhân.'
        : 'Từ chối đơn hàng này?';

    if (!confirm(confirmMsg)) return;

    try {
      setActionLoading(orderId);
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Lỗi cập nhật trạng thái đơn');

      setNotice({
        type: 'success',
        message:
          newStatus === 'APPROVED'
            ? 'Đã duyệt đơn và mở khóa sản phẩm cho khách hàng!'
            : 'Đã cập nhật trạng thái đơn hàng.',
      });
      loadOrders();
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message || 'Lỗi xử lý' });
    } finally {
      setActionLoading(null);
    }
  };

  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const approvedTotal = orders
    .filter((o) => o.status === 'APPROVED')
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  return (
    <div className="space-y-6 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-700 dark:text-indigo-400" />
            Quản lý đơn hàng & Duyệt VietQR
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Xem ảnh bill chuyển khoản và duyệt quyền kích hoạt khóa học/tài nguyên tự động</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bento-card p-4 border-2 border-slate-300 dark:border-white/15 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 flex items-center justify-center border border-emerald-300 dark:border-emerald-500/30">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(approvedTotal)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Doanh thu đã đối soát</div>
          </div>
        </div>

        <div className="bento-card p-4 border-2 border-slate-300 dark:border-white/15 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 flex items-center justify-center border border-amber-300 dark:border-amber-500/30">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-amber-700 dark:text-amber-400 font-mono">{pendingCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Đơn chờ duyệt bill</div>
          </div>
        </div>

        <div className="bento-card p-4 border-2 border-slate-300 dark:border-white/15 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-400 flex items-center justify-center border border-indigo-300 dark:border-indigo-500/30">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono">{orders.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tổng số đơn hàng</div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notice && (
        <div
          className={`p-4 rounded-xl border-2 flex items-center justify-between gap-3 font-semibold text-xs ${
            notice.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400'
              : 'bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/30 text-red-800 dark:text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{notice.message}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-xs hover:underline opacity-80">
            Đóng
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b-2 border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setStatusFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            statusFilter === 'ALL'
              ? 'bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 text-white shadow-md shadow-indigo-950/25'
              : 'border-2 border-slate-300 dark:border-white/10 bg-white dark:bg-white/[0.04] text-slate-700 dark:text-slate-400 hover:opacity-80'
          }`}
        >
          Tất cả ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('PENDING')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            statusFilter === 'PENDING'
              ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border-2 border-amber-400 dark:border-amber-500/30 shadow-xs'
              : 'border-2 border-slate-300 dark:border-white/10 bg-white dark:bg-white/[0.04] text-slate-700 dark:text-slate-400 hover:opacity-80'
          }`}
        >
          <Clock className="w-4 h-4" />
          Chờ duyệt {pendingCount > 0 && <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-mono font-black">{pendingCount}</span>}
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('APPROVED')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            statusFilter === 'APPROVED'
              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border-2 border-emerald-400 dark:border-emerald-500/30 shadow-xs'
              : 'border-2 border-slate-300 dark:border-white/10 bg-white dark:bg-white/[0.04] text-slate-700 dark:text-slate-400 hover:opacity-80'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Đã thanh toán
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('REJECTED')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            statusFilter === 'REJECTED'
              ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-900 dark:text-rose-300 border-2 border-rose-400 dark:border-rose-500/30 shadow-xs'
              : 'border-2 border-slate-300 dark:border-white/10 bg-white dark:bg-white/[0.04] text-slate-700 dark:text-slate-400 hover:opacity-80'
          }`}
        >
          <XCircle className="w-4 h-4" />
          Đã hủy
        </button>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900/60 border-2 border-slate-300 dark:border-slate-800 shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-500 dark:text-slate-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-700 dark:text-indigo-400" />
            <span className="font-semibold">Đang tải danh sách đơn hàng...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center p-12 text-slate-500 dark:text-slate-400">
            <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="font-semibold">Không có đơn hàng nào trong mục này</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950/60 border-b-2 border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-mono font-bold uppercase">
                <tr>
                  <th className="px-5 py-3.5">Mã đơn / Thời gian</th>
                  <th className="px-5 py-3.5">Khách hàng</th>
                  <th className="px-5 py-3.5">Sản phẩm</th>
                  <th className="px-5 py-3.5">Số tiền</th>
                  <th className="px-5 py-3.5">Ảnh Bill VietQR</th>
                  <th className="px-5 py-3.5">Trạng thái</th>
                  <th className="px-5 py-3.5 text-right">Duyệt kích hoạt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-mono text-xs font-bold text-indigo-800 dark:text-indigo-400">
                        #{o.id.substring(0, 8)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {o.created_at ? new Date(o.created_at).toLocaleString('vi-VN') : '—'}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{o.user_name || 'Khách hàng'}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{o.user_email}</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-slate-800 dark:text-slate-300 font-semibold line-clamp-1 max-w-[220px]">
                        {o.items?.[0]?.product_title || 'Gói tài nguyên / Khóa học'}
                      </div>
                      {o.items?.length > 1 && (
                        <div className="text-xs text-slate-500">+{o.items.length - 1} sản phẩm khác</div>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-black text-slate-900 dark:text-white font-mono">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(o.total_amount) || 0)}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {o.receipt_image_url ? (
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(o.receipt_image_url)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 hover:opacity-80 text-indigo-900 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-500/30 text-xs font-bold transition shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Xem Bill
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Chưa tải bill</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {o.status === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đã thanh toán
                        </span>
                      )}
                      {o.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30">
                          <Clock className="w-3.5 h-3.5" />
                          Chờ duyệt
                        </span>
                      )}
                      {o.status === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-500/15 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30">
                          <XCircle className="w-3.5 h-3.5" />
                          Đã từ chối
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {o.status !== 'APPROVED' && (
                          <button
                            type="button"
                            disabled={actionLoading === o.id}
                            onClick={() => handleUpdateStatus(o.id, 'APPROVED')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:opacity-85 text-white font-bold text-xs shadow-sm transition active:scale-95 disabled:opacity-50"
                            title="Duyệt đơn & cấp quyền ngay"
                          >
                            {actionLoading === o.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            Duyệt
                          </button>
                        )}

                        {o.status !== 'REJECTED' && (
                          <button
                            type="button"
                            disabled={actionLoading === o.id}
                            onClick={() => handleUpdateStatus(o.id, 'REJECTED')}
                            className="p-1.5 rounded-xl text-rose-700 hover:bg-rose-100 dark:text-rose-400 dark:hover:bg-rose-500/10 border border-rose-300 dark:border-rose-500/20 transition active:scale-95 disabled:opacity-50"
                            title="Từ chối đơn"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {Math.ceil(orders.length / PAGE_SIZE) > 1 && (
          <div className="p-4 border-t-2 border-slate-200 dark:border-slate-800">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(orders.length / PAGE_SIZE)}
              totalItems={orders.length}
              pageSize={PAGE_SIZE}
              itemName="đơn hàng"
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* Bill Preview Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-400" />
                Ảnh chụp biên lai chuyển khoản (VietQR Bill)
              </h3>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center max-h-[75vh] overflow-auto bg-slate-950">
              <img
                src={selectedReceipt}
                alt="Receipt Bill"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-end">
              <a
                href={selectedReceipt}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Mở ảnh tab mới
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
