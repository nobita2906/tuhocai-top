'use client';

import { useState, useEffect } from 'react';
import {
  Share2,
  Users,
  Wallet,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  QrCode,
  Edit,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  X,
  Loader2,
  ArrowRight,
} from 'lucide-react';

export default function AdminAffiliatePage() {
  const [activeTab, setActiveTab] = useState<'partners' | 'payouts'>('partners');
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalPartners: 0,
    totalBalance: 0,
    totalEarned: 0,
    pendingPayouts: 0,
    pendingPayoutCount: 0,
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Edit Partner Modal
  const [editingPartner, setEditingPartner] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    commissionRate: 30,
    status: 'ACTIVE',
    bankName: '',
    bankAccountNo: '',
    bankAccountName: '',
    notes: '',
  });
  const [savingPartner, setSavingPartner] = useState(false);

  // VietQR Transfer Modal
  const [qrModalPayout, setQrModalPayout] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const url = new URL('/api/admin/affiliate', window.location.origin);
      if (search) url.searchParams.set('q', search);
      if (statusFilter !== 'ALL') url.searchParams.set('status', statusFilter);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setPartners(data.partners || []);
        setPayouts(data.payouts || []);
        setStats(data.stats || {});
      }
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message || 'Lỗi tải dữ liệu' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const openEditModal = (p: any) => {
    setEditingPartner(p);
    setEditForm({
      commissionRate: p.commission_rate || 30,
      status: p.status || 'ACTIVE',
      bankName: p.bank_name || '',
      bankAccountNo: p.bank_account_no || '',
      bankAccountName: p.bank_account_name || '',
      notes: p.notes || '',
    });
  };

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner) return;
    setSavingPartner(true);
    try {
      const res = await fetch('/api/admin/affiliate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId: editingPartner.id,
          ...editForm,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Lỗi cập nhật');

      setNotice({ type: 'success', message: data.message });
      setEditingPartner(null);
      loadData();
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message });
    } finally {
      setSavingPartner(false);
    }
  };

  const handlePayoutAction = async (payoutId: string, action: 'TRANSFERRED' | 'REJECTED') => {
    const confirmText =
      action === 'TRANSFERRED'
        ? 'Xác nhận đã chuyển khoản thành công cho đối tác này?'
        : 'Từ chối yêu cầu rút tiền này? Số tiền sẽ được hoàn lại vào ví của đối tác.';
    if (!confirm(confirmText)) return;

    try {
      setActionLoading(payoutId);
      const res = await fetch('/api/admin/affiliate/payout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payoutId, action }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Lỗi xử lý yêu cầu rút tiền');

      setNotice({ type: 'success', message: data.message });
      setQrModalPayout(null);
      loadData();
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val || 0) + ' đ';
  };

  // Helper tạo link VietQR chuyển khoản nhanh cho Admin
  const getPayoutQrUrl = (payout: any) => {
    if (!payout) return '';
    const bankId = 'VPB'; // Mặc định hoặc bóc từ bank_info
    const accountNo = payout.partner_phone || '0934434101';
    const amount = payout.amount || 200000;
    const desc = encodeURIComponent(`HOA HONG AFF ${payout.partner_code || ''}`);
    return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${desc}`;
  };

  return (
    <div className="space-y-6 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-6 h-6 text-indigo-700 dark:text-indigo-400" />
            Quản Lý Đối Tác Affiliate & Hoa Hồng
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Theo dõi mạng lưới đối tác giới thiệu, điều chỉnh tỷ lệ hoa hồng và duyệt thanh toán VietQR
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold hover:opacity-80 transition"
        >
          Làm mới số liệu
        </button>
      </div>

      {notice && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between ${
            notice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200'
          }`}
        >
          <span>{notice.message}</span>
          <button onClick={() => setNotice(null)}>✕</button>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Tổng Đối Tác</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
            {stats.totalPartners || 0}
          </div>
          <div className="text-xs text-slate-500 mt-1">Đối tác trong hệ thống</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Tổng Hoa Hồng Đã Duyệt</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-purple-600 dark:text-purple-400">
            {formatCurrency(stats.totalEarned)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Tích lũy trọn đời cho đối tác</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Số Dư Khả Dụng Trong Ví</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(stats.totalBalance)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Tiền đang giữ trong ví đối tác</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Chờ Rút Tiền</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-500">
            {formatCurrency(stats.pendingPayouts)}
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-1">
            {stats.pendingPayoutCount || 0} lệnh yêu cầu chờ duyệt
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('partners')}
          className={`pb-3 px-3 font-bold text-sm sm:text-base transition-all relative flex items-center gap-2 ${
            activeTab === 'partners'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Danh sách Đối tác ({partners.length})
          {activeTab === 'partners' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`pb-3 px-3 font-bold text-sm sm:text-base transition-all relative flex items-center gap-2 ${
            activeTab === 'payouts'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Wallet className="w-4 h-4" />
          Yêu cầu Rút tiền ({payouts.length})
          {stats.pendingPayoutCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-white">
              {stats.pendingPayoutCount}
            </span>
          )}
          {activeTab === 'payouts' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
          )}
        </button>
      </div>

      {/* TAB 1: PARTNERS LIST */}
      {activeTab === 'partners' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-96">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm tên, mã ref, email, SĐT..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                Tìm
              </button>
            </form>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <span className="text-xs text-slate-500 font-bold">Trạng thái:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="ACTIVE">Đang hoạt động (ACTIVE)</option>
                <option value="PENDING">Chờ kích hoạt (PENDING)</option>
                <option value="BANNED">Đã khóa (BANNED)</option>
              </select>
            </div>
          </div>

          {/* Partners Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                Đang tải danh sách đối tác...
              </div>
            ) : partners.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                Không tìm thấy đối tác nào phù hợp
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3">Đối tác</th>
                      <th className="px-5 py-3">Mã Ref</th>
                      <th className="px-5 py-3">% Hoa hồng</th>
                      <th className="px-5 py-3">Số dư ví</th>
                      <th className="px-5 py-3">Tổng kiếm</th>
                      <th className="px-5 py-3">Clicks / Đơn</th>
                      <th className="px-5 py-3">Trạng thái</th>
                      <th className="px-5 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {partners.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
                          <div className="text-xs text-slate-500">{p.email}</div>
                          {p.phone && <div className="text-xs text-slate-400 font-mono">{p.phone}</div>}
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800/60">
                            {p.code}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="px-2 py-1 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-black text-xs">
                            {p.commission_rate}%
                          </span>
                        </td>

                        <td className="px-5 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(p.balance)}
                        </td>

                        <td className="px-5 py-3.5 font-bold text-purple-600 dark:text-purple-400">
                          {formatCurrency(p.total_earned)}
                        </td>

                        <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-300">
                          <div>👁️ {p.click_count || 0} clicks</div>
                          <div>📦 {p.order_count || 0} đơn hàng</div>
                        </td>

                        <td className="px-5 py-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              p.status === 'ACTIVE'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : p.status === 'PENDING'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => openEditModal(p)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 text-xs font-bold transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Sửa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PAYOUTS */}
      {activeTab === 'payouts' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          {payouts.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              Chưa có yêu cầu rút tiền nào từ đối tác
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Đối tác</th>
                    <th className="px-5 py-3">Số tiền rút</th>
                    <th className="px-5 py-3">Thông tin nhận tiền (VietQR)</th>
                    <th className="px-5 py-3">Trạng thái</th>
                    <th className="px-5 py-3">Thời gian</th>
                    <th className="px-5 py-3 text-right">Hành động duyệt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {payouts.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{po.partner_name}</div>
                        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">
                          Mã ref: {po.partner_code}
                        </div>
                      </td>

                      <td className="px-5 py-3.5 font-black text-emerald-600 dark:text-emerald-400 text-base">
                        {formatCurrency(po.amount)}
                      </td>

                      <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-300 max-w-xs">
                        <div className="font-semibold">{po.bank_info}</div>
                        {po.notes && <div className="text-slate-400 italic mt-0.5">Ghi chú: {po.notes}</div>}
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            po.status === 'TRANSFERRED'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : po.status === 'REQUESTED'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {po.status === 'REQUESTED' ? 'CHỜ DUYỆT' : po.status === 'TRANSFERRED' ? 'ĐÃ CHUYỂN' : 'TỪ CHỐI'}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">
                        {new Date(po.created_at).toLocaleString('vi-VN')}
                      </td>

                      <td className="px-5 py-3.5 text-right space-x-2">
                        {po.status === 'REQUESTED' ? (
                          <>
                            <button
                              onClick={() => setQrModalPayout(po)}
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold text-xs inline-flex items-center gap-1 hover:opacity-85"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              Quét VietQR
                            </button>
                            <button
                              onClick={() => handlePayoutAction(po.id, 'TRANSFERRED')}
                              disabled={actionLoading === po.id}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                            >
                              ✅ Đã chuyển
                            </button>
                            <button
                              onClick={() => handlePayoutAction(po.id, 'REJECTED')}
                              disabled={actionLoading === po.id}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold"
                            >
                              ❌ Từ chối
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Đã xong</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL: CHỈNH SỬA ĐỐI TÁC */}
      {editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Chỉnh sửa đối tác: {editingPartner.name}
              </h3>
              <button onClick={() => setEditingPartner(null)}>✕</button>
            </div>

            <form onSubmit={handleSavePartner} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tỷ lệ hoa hồng (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={editForm.commissionRate}
                    onChange={(e) => setEditForm({ ...editForm, commissionRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                  />
                  <span className="text-base font-bold text-slate-500">%</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {[30, 35, 40, 45, 50].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, commissionRate: rate })}
                      className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-bold"
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Trạng thái đối tác
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                >
                  <option value="ACTIVE">ACTIVE (Đang hoạt động bình thường)</option>
                  <option value="PENDING">PENDING (Tạm hoãn duyệt)</option>
                  <option value="BANNED">BANNED (Khóa / Cấm tiếp thị)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block font-semibold mb-1">Ngân hàng</label>
                  <input
                    type="text"
                    value={editForm.bankName}
                    onChange={(e) => setEditForm({ ...editForm, bankName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Số tài khoản</label>
                  <input
                    type="text"
                    value={editForm.bankAccountNo}
                    onChange={(e) => setEditForm({ ...editForm, bankAccountNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Ghi chú đối tác</label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Ghi chú nội bộ về đối tác này..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingPartner(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingPartner}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  {savingPartner ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QUÉT VIETQR CHUYỂN KHOẢN */}
      {qrModalPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Mã VietQR Trả Thưởng Đối Tác
              </h3>
              <button onClick={() => setQrModalPayout(null)}>✕</button>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-inner flex justify-center">
              <img
                src={getPayoutQrUrl(qrModalPayout)}
                alt="VietQR Payout"
                className="w-64 h-auto rounded-lg"
              />
            </div>

            <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
              <div>Số tiền: <strong className="text-emerald-600 text-base">{formatCurrency(qrModalPayout.amount)}</strong></div>
              <div>Người nhận: <strong>{qrModalPayout.partner_name}</strong></div>
              <div>Thông tin: <strong>{qrModalPayout.bank_info}</strong></div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => handlePayoutAction(qrModalPayout.id, 'TRANSFERRED')}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                ✅ Đã Chuyển Khoản Xong
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
