'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Share2,
  TrendingUp,
  DollarSign,
  Wallet,
  Users,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

export default function AffiliateClient() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'register'>('dashboard');

  // Search/Lookup state
  const [searchCode, setSearchCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Dashboard Data
  const [statsData, setStatsData] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Registration Form State
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    phone: '',
    code: '',
    bankName: 'VPBank',
    bankAccountNo: '',
    bankAccountName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payout Form State
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('200000');
  const [payoutNotes, setPayoutNotes] = useState('');
  const [isPayoutSubmitting, setIsPayoutSubmitting] = useState(false);

  // Auto-load if code saved locally
  useEffect(() => {
    try {
      const savedCode = localStorage.getItem('my_aff_code') || 'dangai';
      if (savedCode) {
        setSearchCode(savedCode);
        fetchStats(savedCode);
      }
    } catch (_) {}
  }, []);

  const fetchStats = async (codeOrEmail: string) => {
    if (!codeOrEmail.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const param = codeOrEmail.includes('@') ? `email=${encodeURIComponent(codeOrEmail.trim())}` : `code=${encodeURIComponent(codeOrEmail.trim().toLowerCase())}`;
      const res = await fetch(`/api/affiliate/me?${param}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Không tìm thấy thông tin đối tác với mã/email này');
        setStatsData(null);
      } else {
        setStatsData(data.stats);
        localStorage.setItem('my_aff_code', data.stats.partner.code);
        setErrorMsg('');
      }
    } catch (err: any) {
      setErrorMsg('Lỗi kết nối máy chủ: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/affiliate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Lỗi đăng ký đối tác');
      } else {
        setSuccessMsg(data.message);
        localStorage.setItem('my_aff_code', data.partner.code);
        setSearchCode(data.partner.code);
        await fetchStats(data.partner.code);
        setActiveTab('dashboard');
      }
    } catch (err: any) {
      setErrorMsg('Lỗi đăng ký: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayoutRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statsData?.partner?.id) return;
    setIsPayoutSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/affiliate/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId: statsData.partner.id,
          amount: payoutAmount,
          notes: payoutNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Lỗi yêu cầu rút tiền');
      } else {
        alert(data.message || 'Đã gửi yêu cầu rút tiền thành công!');
        setShowPayoutModal(false);
        fetchStats(statsData.partner.code);
      }
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setIsPayoutSubmitting(false);
    }
  };

  const copyRefLink = (code: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.tuhocai.top';
    const link = `${origin}/?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val || 0) + ' đ';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 shadow-2xl border border-indigo-700/40">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-semibold border border-indigo-400/30">
              <Sparkles className="w-4 h-4 text-amber-400" />
              CHƯƠNG TRÌNH ĐỐI TÁC CHIẾN LƯỢC TỰ HỌC AI
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Kiếm Tiền Cùng <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-300 to-cyan-300">Tự Học AI</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Nhận hoa hồng thực chiến <strong className="text-amber-400 font-bold">30% - 50%</strong> trên mỗi đơn hàng công cụ, workflow n8n và skill AI. Theo dõi minh bạch từng lượt click, nhận tiền về tài khoản ngân hàng trong 24h.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-2xl font-black text-amber-400">30% - 50%</div>
                <div className="text-xs text-slate-300 mt-0.5">Hoa hồng trọn đời</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-2xl font-black text-cyan-300">30 Ngày</div>
                <div className="text-xs text-slate-300 mt-0.5">Thời hạn lưu Cookie</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-2xl font-black text-emerald-400">Từ 200k</div>
                <div className="text-xs text-slate-300 mt-0.5">Rút tiền về VietQR</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-2xl font-black text-indigo-300">Realtime</div>
                <div className="text-xs text-slate-300 mt-0.5">Báo đơn qua Bot Telegram</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-4 px-4 font-bold text-base sm:text-lg transition-all relative flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Bảng Điều Khiển Đối Tác
            {activeTab === 'dashboard' && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`pb-4 px-4 font-bold text-base sm:text-lg transition-all relative flex items-center gap-2 ${
              activeTab === 'register'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-5 h-5" />
            Đăng Ký Tham Gia Mới
            {activeTab === 'register' && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab 1: Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Lookup input bar */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Tra cứu thống kê đối tác</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Nhập mã giới thiệu cá nhân hoặc email đã đăng ký để xem báo cáo doanh số
                </p>
              </div>

              <div className="flex gap-2 max-w-md w-full">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchStats(searchCode)}
                    placeholder="Nhập mã ref (VD: dangai) hoặc email..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={() => fetchStats(searchCode)}
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0 flex items-center gap-1.5"
                >
                  {isLoading ? 'Đang tìm...' : 'Tra cứu'}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Partner Found */}
            {statsData && statsData.partner && (
              <div className="space-y-8 animate-in fade-in duration-300">

                {/* Partner Header Box */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 via-white to-indigo-50/50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 border border-indigo-200 dark:border-indigo-800/60 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                        {statsData.partner.name}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                        {statsData.partner.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Mã Ref: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{statsData.partner.code}</span> • Tỷ lệ hoa hồng: <strong className="text-amber-500">{statsData.partner.commission_rate}%</strong>
                    </p>
                  </div>

                  {/* Ref Link Box */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                    <div className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 select-all truncate max-w-md">
                      https://www.tuhocai.top/?ref={statsData.partner.code}
                    </div>
                    <button
                      onClick={() => copyRefLink(statsData.partner.code)}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shrink-0 shadow-md shadow-indigo-500/20"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-300" />
                          Đã sao chép!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Sao chép Link Ref
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 4 Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lượt Click</span>
                      <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                        <Share2 className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-3xl font-black text-slate-900 dark:text-white">
                        {statsData.totalClicks.toLocaleString('vi-VN')}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Lượt truy cập từ link ref</div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Số dư khả dụng</span>
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                        <Wallet className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(statsData.partner.balance)}
                      </div>
                      <button
                        onClick={() => setShowPayoutModal(true)}
                        disabled={statsData.partner.balance < 200000}
                        className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white"
                      >
                        {statsData.partner.balance >= 200000 ? '⚡ Rút tiền ngay' : 'Tối thiểu 200k để rút'}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chờ duyệt (Pending)</span>
                      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                        <Clock className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-3xl font-black text-amber-500">
                        {formatCurrency(statsData.pendingAmount)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Đơn chờ khách thanh toán</div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng hoa hồng</span>
                      <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                        <DollarSign className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
                        {formatCurrency(statsData.partner.total_earned)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tích lũy trọn đời</div>
                    </div>
                  </div>
                </div>

                {/* Commission Orders History */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-500" />
                      Lịch sử đơn hàng & Hoa hồng gần đây
                    </h3>
                    <span className="text-xs text-slate-500">
                      {statsData.commissions?.length || 0} bản ghi
                    </span>
                  </div>

                  {statsData.commissions && statsData.commissions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <tr>
                            <th className="px-5 py-3">Mã đơn</th>
                            <th className="px-5 py-3">Giá trị đơn</th>
                            <th className="px-5 py-3">Tỷ lệ</th>
                            <th className="px-5 py-3">Tiền hoa hồng</th>
                            <th className="px-5 py-3">Trạng thái</th>
                            <th className="px-5 py-3">Thời gian</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {statsData.commissions.map((comm: any) => (
                            <tr key={comm.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="px-5 py-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                                {comm.order_code}
                              </td>
                              <td className="px-5 py-3.5 font-medium">
                                {formatCurrency(comm.order_amount)}
                              </td>
                              <td className="px-5 py-3.5 text-slate-500">
                                {comm.rate}%
                              </td>
                              <td className="px-5 py-3.5 font-bold text-indigo-600 dark:text-indigo-400">
                                +{formatCurrency(comm.commission_amount)}
                              </td>
                              <td className="px-5 py-3.5">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                    comm.status === 'APPROVED'
                                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                      : comm.status === 'PENDING'
                                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                  }`}
                                >
                                  {comm.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                                  {comm.status === 'PENDING' && <Clock className="w-3 h-3" />}
                                  {comm.status}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-xs text-slate-500">
                                {new Date(comm.created_at).toLocaleString('vi-VN')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-10 text-center text-slate-500">
                      <p>Chưa có đơn hàng nào được ghi nhận từ link ref của bạn.</p>
                      <p className="text-xs mt-1">Hãy bắt đầu chia sẻ link để nhận những khoản hoa hồng đầu tiên!</p>
                    </div>
                  )}
                </div>

                {/* Payouts History */}
                {statsData.payouts && statsData.payouts.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-200 dark:border-slate-800">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-emerald-500" />
                        Lịch sử yêu cầu rút tiền
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <tr>
                            <th className="px-5 py-3">Số tiền</th>
                            <th className="px-5 py-3">Tài khoản nhận</th>
                            <th className="px-5 py-3">Trạng thái</th>
                            <th className="px-5 py-3">Thời gian</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {statsData.payouts.map((po: any) => (
                            <tr key={po.id}>
                              <td className="px-5 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(po.amount)}
                              </td>
                              <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-300">
                                {po.bank_info}
                              </td>
                              <td className="px-5 py-3.5">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                  {po.status}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-xs text-slate-500">
                                {new Date(po.created_at).toLocaleString('vi-VN')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Register Form */}
        {activeTab === 'register' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-lg">
            <div className="text-center space-y-2 mb-8">
              <div className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-2">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Đăng Ký Đối Tác Affiliate
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Chỉ mất 30 giây để bắt đầu nhận hoa hồng 30% - 50% cùng Tự Học AI
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-sm">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Họ và tên của bạn <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn Đăng"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Email nhận thông báo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="email@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Số điện thoại / Zalo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="0934.434.101"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Mã Ref giới thiệu mong muốn <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                    tuhocai.top/?ref=
                  </span>
                  <input
                    type="text"
                    required
                    value={regForm.code}
                    onChange={(e) => setRegForm({ ...regForm, code: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                    placeholder="dangai"
                    className="w-full pl-36 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Từ 3-30 ký tự, viết liền không dấu (chữ cái, số, gạch nối)</p>
              </div>

              {/* Bank Info */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Thông tin nhận thanh toán hoa hồng (VietQR)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Ngân hàng
                    </label>
                    <input
                      type="text"
                      value={regForm.bankName}
                      onChange={(e) => setRegForm({ ...regForm, bankName: e.target.value })}
                      placeholder="VPBank, Vietcombank..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Số tài khoản
                    </label>
                    <input
                      type="text"
                      value={regForm.bankAccountNo}
                      onChange={(e) => setRegForm({ ...regForm, bankAccountNo: e.target.value })}
                      placeholder="0934434101"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Tên chủ tài khoản
                    </label>
                    <input
                      type="text"
                      value={regForm.bankAccountName}
                      onChange={(e) => setRegForm({ ...regForm, bankAccountName: e.target.value.toUpperCase() })}
                      placeholder="NGUYEN VAN A"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs uppercase focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-bold text-base shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Đang tạo đối tác...' : '⚡ Đăng Ký Làm Đối Tác Ngay'}
              </button>
            </form>
          </div>
        )}

        {/* Withdrawal Modal */}
        {showPayoutModal && statsData?.partner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-500" />
                  Yêu Cầu Rút Tiền Hoa Hồng
                </h3>
                <button
                  onClick={() => setShowPayoutModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
                <div>Số dư khả dụng: <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(statsData.partner.balance)}</strong></div>
                <div>Tài khoản nhận: <strong>{statsData.partner.bank_name} - {statsData.partner.bank_account_no} ({statsData.partner.bank_account_name})</strong></div>
              </div>

              <form onSubmit={handlePayoutRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Số tiền muốn rút (VNĐ)
                  </label>
                  <input
                    type="number"
                    min="200000"
                    max={statsData.partner.balance}
                    step="10000"
                    required
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setPayoutAmount('200000')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold"
                    >
                      200.000 đ
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoutAmount('500000')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold"
                    >
                      500.000 đ
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoutAmount(String(statsData.partner.balance))}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold"
                    >
                      Tất cả ({formatCurrency(statsData.partner.balance)})
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Ghi chú thêm (tùy chọn)
                  </label>
                  <textarea
                    rows={2}
                    value={payoutNotes}
                    onChange={(e) => setPayoutNotes(e.target.value)}
                    placeholder="Ghi chú thêm nếu bạn đổi số tài khoản..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPayoutModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-xs"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isPayoutSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                  >
                    {isPayoutSubmitting ? 'Đang gửi...' : 'Xác Nhận Rút Tiền'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
