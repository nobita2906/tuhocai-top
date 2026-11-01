'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  DollarSign,
  Share2,
  Copy,
  Check,
  TrendingUp,
  Users,
  ShoppingBag,
  Gift,
  Sparkles,
  ExternalLink,
  Building,
  CreditCard,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  ArrowRight,
  Loader2,
  X,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function CustomerAffiliateHub() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Copy states
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [copiedKitId, setCopiedKitId] = useState<number | null>(null);

  // Bank Form State
  const [bankName, setBankName] = useState('');
  const [bankAccountNo, setBankAccountNo] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [savingBank, setSavingBank] = useState(false);
  const [bankMsg, setBankMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Payout Modal State
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutMsg, setPayoutMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    try {
      const res = await fetch('/api/dashboard/referral');
      const json = await res.json();
      if (json.success) {
        setData(json);
        if (json.partner) {
          setBankName(json.partner.bankName || '');
          setBankAccountNo(json.partner.bankAccountNo || '');
          setBankAccountName(json.partner.bankAccountName || '');
        }
      } else {
        setError(json.error || 'Không thể tải dữ liệu');
      }
    } catch (e: any) {
      setError(e.message || 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(identifier);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleCopyKit = (kit: any, customLink?: string) => {
    let content = kit.content;
    if (customLink) {
      content = content.replace(/https?:\/\/[^\s]+/g, customLink);
    }
    navigator.clipboard.writeText(content);
    setCopiedKitId(kit.id);
    setTimeout(() => setCopiedKitId(null), 2500);
  };

  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBank(true);
    setBankMsg(null);

    try {
      const res = await fetch('/api/dashboard/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName,
          bankAccountNo,
          bankAccountName,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Có lỗi xảy ra');

      setBankMsg({ type: 'success', text: 'Đã lưu thông tin tài khoản ngân hàng thành công!' });
      loadData();
    } catch (err: any) {
      setBankMsg({ type: 'error', text: err.message });
    } finally {
      setSavingBank(false);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.partner?.id) return;

    setPayoutLoading(true);
    setPayoutMsg(null);

    try {
      const res = await fetch('/api/affiliate/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId: data.partner.id,
          amount: Number(payoutAmount),
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Lỗi gửi yêu cầu rút tiền');

      setPayoutMsg({ type: 'success', text: json.message || 'Yêu cầu rút tiền thành công!' });
      setTimeout(() => {
        setPayoutModalOpen(false);
        setPayoutMsg(null);
        setPayoutAmount('');
        loadData();
      }, 1500);
    } catch (err: any) {
      setPayoutMsg({ type: 'error', text: err.message });
    } finally {
      setPayoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-700 dark:text-cyan-400 mx-auto" />
        <p className="text-xs text-slate-500 font-mono">Đang tải trung tâm CTV và link chia sẻ 60%...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-white dark:bg-[#111116] rounded-2xl border-2 border-slate-300 dark:border-white/10 space-y-3">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <p className="text-sm font-bold text-slate-900 dark:text-white">{error || 'Không có dữ liệu'}</p>
        <button onClick={loadData} className="px-4 py-2 rounded-xl bg-indigo-700 text-white font-bold text-xs">
          Thử lại
        </button>
      </div>
    );
  }

  const { partner, stats, referralProducts, commissions, payouts, marketingKits } = data;
  const ownedProducts = referralProducts?.filter((p: any) => p.isOwned) || [];
  const otherProducts = referralProducts?.filter((p: any) => !p.isOwned) || [];

  return (
    <div className="space-y-8 transition-colors duration-200">
      {/* 1. HERO BANNER: CHƯƠNG TRÌNH CTV 60% HOA HỒNG */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-[#0b0e1e] text-white p-6 sm:p-10 shadow-2xl border-2 border-indigo-700/50 space-y-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-bold border border-indigo-400/30 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            CHƯƠNG TRÌNH ĐẠI SỨ HỌC VIÊN TỰ HỌC AI • 60% HOA HỒNG TRỌN ĐỜI
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Kiếm Tiền Cùng{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-200 to-cyan-300">
              Tự Học AI
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            Biến trải nghiệm học thực tế của bạn thành dòng tiền thụ động. Mỗi khóa học bạn đã sở hữu sẽ được mở khóa mức thưởng cao nhất <strong className="text-amber-400 font-black">60% Hoa Hồng</strong>. Chỉ cần giới thiệu <strong className="text-cyan-300 font-bold">2 người bạn</strong> mua cùng là bạn đã hoàn lại <strong className="text-emerald-400 font-black">120% học phí</strong>. Rút tiền về VietQR tự động trong 24h!
          </p>

          {/* 4 Mini Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">60% Hoa Hồng</div>
              <div className="text-xs text-slate-300 mt-0.5">Khóa học bạn đã sở hữu</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">Hoàn 120%</div>
              <div className="text-xs text-slate-300 mt-0.5">Chỉ cần 2 bạn mua cùng</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">Từ 200k</div>
              <div className="text-xs text-slate-300 mt-0.5">Rút tiền về VietQR 24h</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-black text-indigo-300 font-mono">1-Click Content</div>
              <div className="text-xs text-slate-300 mt-0.5">5 Mẫu bài đăng sẵn link</div>
            </div>
          </div>

          {/* Mã giới thiệu & Link tổng quan */}
          <div className="pt-2">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/15 backdrop-blur-md flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-1.5 text-xs font-mono">
                <span className="text-slate-300 font-medium">Mã CTV của bạn: <strong className="text-amber-400 font-black text-sm">{partner.code}</strong></span>
                <span className="text-cyan-300 truncate max-w-sm select-all">{partner.generalRefUrl}</span>
              </div>

              <button
                onClick={() => handleCopy(partner.generalRefUrl, 'general')}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shrink-0 shadow-lg active:scale-[0.98] ${
                  copiedLink === 'general'
                    ? 'bg-emerald-600 text-white shadow-emerald-950/30'
                    : 'bg-white hover:bg-slate-100 text-slate-950 shadow-white/10'
                }`}
              >
                {copiedLink === 'general' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-slate-950" />}
                {copiedLink === 'general' ? 'ĐÃ SAO CHÉP!' : 'Sao chép link chung'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW: 4 THẺ VÀNG */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Số dư ví */}
        <div className="bento-card p-5 border-2 border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-mono font-semibold">
            <span>Số dư có thể rút</span>
            <DollarSign className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-700 dark:text-emerald-400">
            {new Intl.NumberFormat('vi-VN').format(stats.balance || 0)} đ
          </p>
          <button
            onClick={() => setPayoutModalOpen(true)}
            disabled={stats.balance < 200000}
            className="w-full mt-2 py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-all"
          >
            {stats.balance >= 200000 ? '🏦 Yêu Cầu Rút Tiền' : 'Tối thiểu 200.000 đ'}
          </button>
        </div>

        {/* Tổng hoa hồng đã kiếm */}
        <div className="bento-card p-5 border-2 border-slate-300 dark:border-white/15 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-mono font-semibold">
            <span>Tổng hoa hồng đã kiếm</span>
            <TrendingUp className="w-4 h-4 text-indigo-700 dark:text-cyan-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
            {new Intl.NumberFormat('vi-VN').format(stats.totalEarned || 0)} đ
          </p>
          <span className="text-[11px] text-slate-500 font-mono block pt-2">
            Đang chờ duyệt: <strong className="text-amber-600">{new Intl.NumberFormat('vi-VN').format(stats.pendingAmount || 0)} đ</strong>
          </span>
        </div>

        {/* Lượt bấm link */}
        <div className="bento-card p-5 border-2 border-slate-300 dark:border-white/15 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-mono font-semibold">
            <span>Lượt bấm link (Clicks)</span>
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
            {stats.totalClicks}
          </p>
          <span className="text-[11px] text-slate-500 font-mono block pt-2">
            Theo dõi thời gian thực
          </span>
        </div>

        {/* Số đơn hàng */}
        <div className="bento-card p-5 border-2 border-slate-300 dark:border-white/15 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-mono font-semibold">
            <span>Đơn hàng thành công</span>
            <ShoppingBag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
            {stats.totalOrders} đơn
          </p>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono font-bold block pt-2">
            Tỷ lệ chuyển đổi: {stats.conversionRate}%
          </span>
        </div>
      </div>

      {/* 3. KHÓA HỌC & CÔNG CỤ CHIA SẺ NHẬN HOA HỒNG */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Khóa Học & Công Cụ Chia Sẻ Nhận {partner.commissionRate || 60}% Hoa Hồng ({referralProducts?.length || 0})
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Chia sẻ bất kỳ link sản phẩm nào dưới đây cho bạn bè hoặc cộng đồng. Khi có người mua, bạn nhận ngay <strong className="text-emerald-700 dark:text-emerald-400">{partner.commissionRate || 60}% tiền thưởng</strong> về ví!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {referralProducts?.map((p: any) => (
            <div
              key={p.id}
              className={`p-5 rounded-2xl bg-white dark:bg-[#111116] border-2 shadow-md flex flex-col justify-between space-y-3.5 transition-all ${
                p.isOwned
                  ? 'border-emerald-400 dark:border-emerald-500/40'
                  : 'border-slate-300 dark:border-white/15'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black border ${
                      p.isOwned
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30'
                        : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-400 border-indigo-300 dark:border-indigo-500/30'
                    }`}
                  >
                    {p.isOwned
                      ? `✓ ĐÃ SỞ HỮU • HOA HỒNG ${p.commissionRate || partner.commissionRate || 60}%`
                      : `🔥 HOA HỒNG ${p.commissionRate || partner.commissionRate || 60}%`}
                  </span>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                    {p.name}
                  </h4>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-400 font-mono">Giá: {new Intl.NumberFormat('vi-VN').format(p.price)} đ</span>
                  <p className="text-base font-black font-mono text-emerald-700 dark:text-emerald-400">
                    +{new Intl.NumberFormat('vi-VN').format(p.commissionAmount)} đ
                  </p>
                </div>
              </div>

              {/* Referral Link & Copy */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-white/[0.08]">
                <input
                  type="text"
                  readOnly
                  value={p.refUrl}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-cyan-300 truncate"
                />
                <button
                  onClick={() => handleCopy(p.refUrl, p.id)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 shadow-xs ${
                    copiedLink === p.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-700 hover:bg-indigo-600 text-white'
                  }`}
                >
                  {copiedLink === p.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedLink === p.id ? 'Đã copy!' : 'Sao chép link'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. BỘ KIT 5 BÀI VIẾT CONTENT MẪU (COPY-PASTE ĐĂNG NGAY) */}
      <div className="space-y-4 pt-4 border-t-2 border-slate-200 dark:border-white/10">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-900 dark:text-cyan-400 border border-indigo-300 dark:border-indigo-500/30 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            VŨ KHÍ BÁN HÀNG TỰ ĐỘNG
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Bộ Kit 5 Bài Viết Đăng Mạng Xã Hội Thực Chiến (Copy Đi Đăng Ngay)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Học viên không cần suy nghĩ viết bài! Bấm nút <strong className="text-indigo-800 dark:text-cyan-400">1-Click Sao Chép</strong> bên dưới, hệ thống sẽ tự động chèn sẵn link giới thiệu cá nhân của bạn vào bài viết.
          </p>
        </div>

        <div className="space-y-4">
          {marketingKits?.map((kit: any) => (
            <div
              key={kit.id}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-300 dark:border-white/15 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-cyan-400 flex items-center justify-center font-mono text-xs font-black">
                      {kit.id}
                    </span>
                    {kit.title}
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-400 font-mono">
                    Nền tảng phù hợp: <strong className="text-indigo-800 dark:text-cyan-400">{kit.platform}</strong>
                  </p>
                </div>

                <button
                  onClick={() => handleCopyKit(kit)}
                  className={`flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 shadow-md ${
                    copiedKitId === kit.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 hover:opacity-85 text-white shadow-indigo-950/20'
                  }`}
                >
                  {copiedKitId === kit.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      ĐÃ SAO CHÉP KÈM LINK REF!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      1-Click Sao Chép Bài Này
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-100 dark:bg-black/50 border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-slate-200 font-mono whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                {kit.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. THÔNG TIN NHẬN HOA HỒNG NGÂN HÀNG */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-300 dark:border-white/15 shadow-sm space-y-4">
        <div className="space-y-1">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-700 dark:text-cyan-400" />
            Thông Tin Tài Khoản Ngân Hàng Nhận Tiền
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">
            Tiền hoa hồng rút sẽ được Admin Tự Học AI chuyển khoản trực tiếp vào số tài khoản này trong vòng 24h.
          </p>
        </div>

        {bankMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold ${
              bankMsg.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-300'
                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border border-rose-300'
            }`}
          >
            {bankMsg.text}
          </div>
        )}

        <form onSubmit={handleSaveBank} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Ngân hàng (Ví dụ: Vietcombank, MB, Techcombank)
            </label>
            <input
              type="text"
              required
              placeholder="Vietcombank"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Số tài khoản ngân hàng
            </label>
            <input
              type="text"
              required
              placeholder="101867..."
              value={bankAccountNo}
              onChange={(e) => setBankAccountNo(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tên chủ tài khoản (Viết hoa không dấu)
            </label>
            <input
              type="text"
              required
              placeholder="NGUYEN VAN A"
              value={bankAccountName}
              onChange={(e) => setBankAccountName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white uppercase font-mono"
            />
          </div>

          <div className="sm:col-span-3 pt-1">
            <button
              type="submit"
              disabled={savingBank}
              className="px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs shadow-xs transition-all disabled:opacity-50"
            >
              {savingBank ? 'Đang lưu...' : 'Lưu Thông Tin Ngân Hàng'}
            </button>
          </div>
        </form>
      </div>

      {/* 7. LỊCH SỬ HOA HỒNG & RÚT TIỀN */}
      <div className="space-y-4 pt-4 border-t-2 border-slate-200 dark:border-white/10">
        <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-700 dark:text-cyan-400" />
          Lịch Sử Hoa Hồng Gần Đây ({commissions?.length || 0})
        </h3>

        {commissions?.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border-2 border-slate-300 dark:border-white/15 bg-white dark:bg-[#111116] shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-black/60 border-b-2 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Mã đơn</th>
                  <th className="py-3 px-4">Giá trị đơn</th>
                  <th className="py-3 px-4">Tỷ lệ</th>
                  <th className="py-3 px-4">Hoa hồng nhận</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/[0.08] text-slate-800 dark:text-slate-300">
                {commissions.map((comm: any) => (
                  <tr key={comm.id}>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700 dark:text-cyan-400">{comm.order_code}</td>
                    <td className="py-3 px-4 font-mono">{new Intl.NumberFormat('vi-VN').format(comm.order_amount)} đ</td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-600">{comm.rate}%</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      +{new Intl.NumberFormat('vi-VN').format(comm.commission_amount)} đ
                    </td>
                    <td className="py-3 px-4">
                      {comm.status === 'APPROVED' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400">
                          ĐÃ DUYỆT
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400">
                          CHỜ DUYỆT
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {new Date(comm.created_at).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center font-mono">
            Chưa có hoa hồng nào. Hãy sao chép bài viết mẫu và chia sẻ link để nhận hoa hồng 60% đầu tiên!
          </p>
        )}
      </div>

      {/* MODAL YÊU CẦU RÚT TIỀN */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-300 dark:border-white/20 shadow-2xl p-6 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Yêu Cầu Rút Tiền Về Ngân Hàng
              </h3>
              <button onClick={() => setPayoutModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {payoutMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold ${
                  payoutMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-50 text-rose-800 border border-rose-300'
                }`}
              >
                {payoutMsg.text}
              </div>
            )}

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Số dư khả dụng:</span>
                  <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">
                    {new Intl.NumberFormat('vi-VN').format(stats.balance || 0)} đ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tài khoản nhận:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {partner.bankName ? `${partner.bankName} - ${partner.bankAccountNo}` : 'Chưa cài đặt'}
                  </span>
                </div>
              </div>

              {!partner.bankAccountNo && (
                <p className="text-xs text-rose-600 font-bold">
                  ⚠️ Bạn cần cập nhật thông tin tài khoản ngân hàng ở mục bên dưới trước khi rút tiền!
                </p>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Số tiền muốn rút (Tối thiểu 200.000 đ)
                </label>
                <input
                  type="number"
                  required
                  min={200000}
                  max={stats.balance}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="200000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/15 text-sm font-mono text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setPayoutModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={payoutLoading || !partner.bankAccountNo || Number(payoutAmount) < 200000 || Number(payoutAmount) > stats.balance}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs disabled:opacity-40"
                >
                  {payoutLoading ? 'Đang gửi...' : 'Xác Nhận Rút Tiền'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

