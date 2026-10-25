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
  ChevronRight,
  BookOpen,
  Download,
  FileText,
  MessageSquare,
} from 'lucide-react';

export default function AffiliateClient() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'register' | 'toolkit'>('dashboard');

  // Search/Lookup state
  const [searchCode, setSearchCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Dashboard Data
  const [statsData, setStatsData] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Marketing Toolkit State
  const [customPath, setCustomPath] = useState('/san-pham');
  const [copiedDeepLink, setCopiedDeepLink] = useState(false);
  const [copiedTemplateIdx, setCopiedTemplateIdx] = useState<number | null>(null);

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
          <button
            onClick={() => setActiveTab('toolkit')}
            className={`pb-4 px-4 font-bold text-base sm:text-lg transition-all relative flex items-center gap-2 ${
              activeTab === 'toolkit'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-500" />
            Tài Nguyên Tiếp Thị (Media Kit)
            {activeTab === 'toolkit' && (
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

        {/* Tab 3: Marketing Media Kit & Toolkit */}
        {activeTab === 'toolkit' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header intro */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white border border-indigo-700/40 shadow-xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-mono text-xs font-bold border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                VŨ KHÍ TIẾP THỊ CHO ANH EM AFFILIATE
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Kho Tài Nguyên Tiếp Thị & Mẫu Content Thực Chiến
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
                Được chuẩn bị sẵn từ kịch bản đăng bài Facebook, tin nhắn Zalo, hook video ngắn TikTok đến bộ banner mockup. Anh em chỉ cần sao chép, gắn link ref của mình và bắt đầu tạo thu nhập thụ động ngay hôm nay.
              </p>
            </div>

            {/* Section 1: Deep Link Generator */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Trình Tạo Link Giới Thiệu Tùy Biến (Deep Link Generator)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Dẫn khách trực tiếp vào trang sản phẩm cụ thể để tăng tỷ lệ chốt đơn x3 lần so với trang chủ
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300">
                  Mã ref của bạn: <strong className="text-indigo-600 dark:text-indigo-400">{statsData?.partner?.code || searchCode || 'dangai'}</strong>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Chọn trang đích muốn tiếp thị:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Kho Sản Phẩm & Skill', path: '/san-pham' },
                    { label: 'Workflow n8n Tự Động Hóa', path: '/san-pham?cat=workflow' },
                    { label: 'Bộ Skill & Trợ Lý AI', path: '/san-pham?cat=skill' },
                    { label: 'Quà Tặng Miễn Phí (Free Leads)', path: '/#tai-lieu-free' },
                    { label: 'Bài Viết Chia Sẻ Kiến Thức', path: '/bai-viet' },
                  ].map((preset) => (
                    <button
                      key={preset.path}
                      type="button"
                      onClick={() => setCustomPath(preset.path)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        customPath === preset.path
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Path Input */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Đường dẫn trang đích (Path)
                  </label>
                  <input
                    type="text"
                    value={customPath}
                    onChange={(e) => setCustomPath(e.target.value)}
                    placeholder="/san-pham/n8n-auto-crm"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Mã đối tác (Ref code)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={statsData?.partner?.code || searchCode || 'dangai'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 font-mono text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Result Link Box */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                  Link tiếp thị trực tiếp của bạn:
                </span>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-700 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 select-all truncate">
                    https://www.tuhocai.top{customPath.startsWith('/') ? customPath : '/' + customPath}{customPath.includes('?') ? '&' : '?'}ref={statsData?.partner?.code || searchCode || 'dangai'}
                  </div>
                  <button
                    onClick={() => {
                      const link = `https://www.tuhocai.top${customPath.startsWith('/') ? customPath : '/' + customPath}${customPath.includes('?') ? '&' : '?'}ref=${statsData?.partner?.code || searchCode || 'dangai'}`;
                      navigator.clipboard.writeText(link);
                      setCopiedDeepLink(true);
                      setTimeout(() => setCopiedDeepLink(false), 2500);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shrink-0 shadow-md shadow-indigo-600/20"
                  >
                    {copiedDeepLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        Đã sao chép!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Sao chép Link này
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Section 2: Copywriting Templates */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Mẫu Content Bán Hàng & Đăng Bài Mạng Xã Hội (Sẵn Dùng)
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Bấm nút sao chép để lấy nội dung đã tự động chèn sẵn link giới thiệu cá nhân của bạn
                </p>
              </div>

              {/* 3 Copywriting Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Template 1: Facebook / Threads */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        Facebook & Threads
                      </span>
                      <span className="text-xs text-slate-400">Bài viết chia sẻ</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Bí quyết x3 hiệu suất làm nội dung với n8n & AI
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono whitespace-pre-wrap bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 max-h-56 overflow-y-auto">
{`Nếu mỗi ngày bạn vẫn mất 3-4 tiếng để nghĩ kịch bản, viết bài và lên lịch đăng thủ công thì bạn đang đi sau đối thủ rất xa rồi!

Mình vừa tìm thấy kho workflow n8n tự động hóa thực chiến của Tự Học AI. Tự động cào tin tức, viết kịch bản đa kênh và đẩy bài tự động lên Blogger / Fanpage.

👉 Tải dùng thử và xem demo tại đây:
https://www.tuhocai.top/san-pham?ref=${statsData?.partner?.code || searchCode || 'dangai'}

Mua xong dùng ngay, không cần biết code vẫn setup được trong 15 phút!`}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const text = `Nếu mỗi ngày bạn vẫn mất 3-4 tiếng để nghĩ kịch bản, viết bài và lên lịch đăng thủ công thì bạn đang đi sau đối thủ rất xa rồi!\n\nMình vừa tìm thấy kho workflow n8n tự động hóa thực chiến của Tự Học AI. Tự động cào tin tức, viết kịch bản đa kênh và đẩy bài tự động lên Blogger / Fanpage.\n\n👉 Tải dùng thử và xem demo tại đây:\nhttps://www.tuhocai.top/san-pham?ref=${statsData?.partner?.code || searchCode || 'dangai'}\n\nMua xong dùng ngay, không cần biết code vẫn setup được trong 15 phút!`;
                      navigator.clipboard.writeText(text);
                      setCopiedTemplateIdx(1);
                      setTimeout(() => setCopiedTemplateIdx(null), 2500);
                    }}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    {copiedTemplateIdx === 1 ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        Đã sao chép kịch bản!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Sao chép kịch bản Facebook
                      </>
                    )}
                  </button>
                </div>

                {/* Template 2: Zalo Direct Chat */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Zalo / Nhóm Kín
                      </span>
                      <span className="text-xs text-slate-400">Tin nhắn ngắn</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Gửi tin nhắn 1-1 hoặc tặng quà trong Group
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono whitespace-pre-wrap bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 max-h-56 overflow-y-auto">
{`Chào bạn! Bên Tự Học AI đang mở tặng miễn phí bộ tài liệu Prompt thương mại và kịch bản video AI thực chiến cực hay.

Bạn bấm vào link này để tải ngay miễn phí nhé (hoàn toàn 0đ):
https://www.tuhocai.top/#tai-lieu-free?ref=${statsData?.partner?.code || searchCode || 'dangai'}

Nếu cần setup hệ thống tự động hóa n8n bán hàng thì bên đó cũng có sẵn template dùng luôn rất tiện ạ!`}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const text = `Chào bạn! Bên Tự Học AI đang mở tặng miễn phí bộ tài liệu Prompt thương mại và kịch bản video AI thực chiến cực hay.\n\nBạn bấm vào link này để tải ngay miễn phí nhé (hoàn toàn 0đ):\nhttps://www.tuhocai.top/#tai-lieu-free?ref=${statsData?.partner?.code || searchCode || 'dangai'}\n\nNếu cần setup hệ thống tự động hóa n8n bán hàng thì bên đó cũng có sẵn template dùng luôn rất tiện ạ!`;
                      navigator.clipboard.writeText(text);
                      setCopiedTemplateIdx(2);
                      setTimeout(() => setCopiedTemplateIdx(null), 2500);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    {copiedTemplateIdx === 2 ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        Đã sao chép tin nhắn!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Sao chép tin nhắn Zalo
                      </>
                    )}
                  </button>
                </div>

                {/* Template 3: TikTok / Reels Script */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                        TikTok / Reels Video
                      </span>
                      <span className="text-xs text-slate-400">Hook 3s đầu</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Kịch bản video ngắn 30s giữ chân người xem
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono whitespace-pre-wrap bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 max-h-56 overflow-y-auto">
{`[0-3s Hook]: Dừng lại! Đừng thuê người viết bài 50k/bài nữa nếu bạn chưa biết workflow này.

[3-15s Body]: Đây là hệ thống n8n tự động hóa kết hợp ChatGPT. Chỉ cần nhập 1 chủ đề, AI tự lên dàn ý, viết 10 bài chuẩn SEO và tự đăng bài luôn trong lúc bạn đang ngủ.

[15-30s CTA]: Mình để trọn bộ template và link hướng dẫn ở đầu trang Bio:
https://www.tuhocai.top/?ref=${statsData?.partner?.code || searchCode || 'dangai'}
Tải về dùng ngay, không cần biết kỹ thuật nha!`}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const text = `[0-3s Hook]: Dừng lại! Đừng thuê người viết bài 50k/bài nữa nếu bạn chưa biết workflow này.\n\n[3-15s Body]: Đây là hệ thống n8n tự động hóa kết hợp ChatGPT. Chỉ cần nhập 1 chủ đề, AI tự lên dàn ý, viết 10 bài chuẩn SEO và tự đăng bài luôn trong lúc bạn đang ngủ.\n\n[15-30s CTA]: Mình để trọn bộ template và link hướng dẫn ở đầu trang Bio:\nhttps://www.tuhocai.top/?ref=${statsData?.partner?.code || searchCode || 'dangai'}\nTải về dùng ngay, không cần biết kỹ thuật nha!`;
                      navigator.clipboard.writeText(text);
                      setCopiedTemplateIdx(3);
                      setTimeout(() => setCopiedTemplateIdx(null), 2500);
                    }}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    {copiedTemplateIdx === 3 ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        Đã sao chép kịch bản!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Sao chép kịch bản TikTok
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Section 3: Banners & Graphic Assets */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold">
                  <Download className="w-3.5 h-3.5" />
                  ĐỒ HOẠ & BANNER CHẤT LƯỢNG CAO
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Tải Trọn Bộ Banner & Ảnh Mockup Thiết Kế Sẵn
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                  Gồm đầy đủ kích thước vuông (1:1), story (9:16) và ảnh bìa bài viết (16:9), ảnh chụp màn hình workflow n8n thực tế để bạn đăng kèm bài viết mà không mất công tự thiết kế.
                </p>
              </div>

              <a
                href="https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:opacity-90 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center gap-2 shrink-0 transition"
              >
                <Download className="w-4 h-4" />
                Mở Thư Mục Ảnh Drive
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Section 4: Rules & Support */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Quy Tắc & Cam Kết Quyền Lợi Dành Cho Đối Tác Affiliate
              </h4>
              <p>• <strong>Thời hạn Cookie 30 ngày:</strong> Áp dụng mô hình Last-Click. Khách bấm link ref của bạn và mua hàng trong vòng 30 ngày đều được tính hoa hồng đầy đủ.</p>
              <p>• <strong>Duyệt thanh toán VietQR trong 24h:</strong> Rút tiền tối thiểu từ 200.000đ, không giam vốn, chuyển khoản thẳng về số tài khoản ngân hàng của bạn.</p>
              <p>• <strong>Nghiêm cấm:</strong> Không chạy quảng cáo Google Search từ khóa thương hiệu "Tự Học AI", không spam link rác vào các hội nhóm làm ảnh hưởng uy tín thương hiệu.</p>
              <p>• <strong>Hỗ trợ kỹ thuật 1-1:</strong> Cần hỗ trợ riêng hoặc deal tỷ lệ hoa hồng cao hơn cho Team/KOL, liên hệ Zalo: <strong className="text-indigo-600 dark:text-indigo-400">0934.434.101 (Đăng)</strong>.</p>
            </div>
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
