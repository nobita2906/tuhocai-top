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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-400" />
            Quản lý đơn hàng & Duyệt VietQR
          </h1>
          <p className="text-sm text-slate-400">Xem ảnh bill chuyển khoản và duyệt quyền kích hoạt khóa học/tài nguyên tự động</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-400">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(approvedTotal)}
            </div>
            <div className="text-xs text-slate-400">Doanh thu đã đối soát</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-amber-400">{pendingCount}</div>
            <div className="text-xs text-slate-400">Đơn chờ duyệt bill</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{orders.length}</div>
            <div className="text-xs text-slate-400">Tổng số đơn hàng</div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notice && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
            notice.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
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
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setStatusFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            statusFilter === 'ALL'
              ? 'bg-indigo-500 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Tất cả ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('PENDING')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
            statusFilter === 'PENDING'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          Chờ duyệt {pendingCount > 0 && <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-xs font-bold">{pendingCount}</span>}
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('APPROVED')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
            statusFilter === 'APPROVED'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Đã thanh toán
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('REJECTED')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
            statusFilter === 'REJECTED'
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <XCircle className="w-4 h-4" />
          Đã hủy
        </button>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
            <span>Đang tải danh sách đơn hàng...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center p-12 text-slate-400">
            <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p>Không có đơn hàng nào trong mục này</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-xs text-slate-400 uppercase">
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
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-5 py-4">
                      <div className="font-mono text-xs font-semibold text-indigo-400">
                        #{o.id.substring(0, 8)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {o.created_at ? new Date(o.created_at).toLocaleString('vi-VN') : '—'}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-white">{o.user_name || 'Khách hàng'}</div>
                      <div className="text-xs text-slate-400 font-mono">{o.user_email}</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-slate-300 font-medium line-clamp-1 max-w-[220px]">
                        {o.items?.[0]?.product_title || 'Gói tài nguyên / Khóa học'}
                      </div>
                      {o.items?.length > 1 && (
                        <div className="text-xs text-slate-500">+{o.items.length - 1} sản phẩm khác</div>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-bold text-white">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(o.total_amount) || 0)}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {o.receipt_image_url ? (
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(o.receipt_image_url)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Xem Bill
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Chưa tải bill</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {o.status === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đã thanh toán
                        </span>
                      )}
                      {o.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <Clock className="w-3.5 h-3.5" />
                          Chờ duyệt
                        </span>
                      )}
                      {o.status === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
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
                            onClick={() => handleUpdateStatus(o.id, 'APPROVED')}
                            disabled={actionLoading === o.id}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1 transition disabled:opacity-50"
                          >
                            {actionLoading === o.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <FileCheck className="w-3.5 h-3.5" />
                            )}
                            Duyệt đơn
                          </button>
                        )}

                        {o.status === 'PENDING' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(o.id, 'REJECTED')}
                            disabled={actionLoading === o.id}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs transition"
                          >
                            Từ chối
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
