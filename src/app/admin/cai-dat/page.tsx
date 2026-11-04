'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Settings,
  CreditCard,
  Send,
  MessageCircle,
  Phone,
  Mail,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Bell,
  Eye,
  EyeOff,
  ExternalLink,
  HelpCircle,
  QrCode,
  Wand2,
  Zap,
  Copy,
  Check,
  ShieldCheck,
  Radio,
  RefreshCw,
  Bot,
  ShoppingCart,
} from 'lucide-react';

const POPULAR_BANKS = [
  { code: 'MB', name: 'MB Bank (Ngân hàng Quân Đội)' },
  { code: 'VPB', name: 'VPBank (Việt Nam Thịnh Vượng)' },
  { code: 'TCB', name: 'Techcombank (Kỹ Thương Việt Nam)' },
  { code: 'VCB', name: 'Vietcombank (Ngoại Thương Việt Nam)' },
  { code: 'CTG', name: 'VietinBank (Công Thương Việt Nam)' },
  { code: 'BIDV', name: 'BIDV (Đầu tư và Phát triển VN)' },
  { code: 'ACB', name: 'ACB (Ngân hàng Á Châu)' },
  { code: 'TPB', name: 'TPBank (Tiên Phong Bank)' },
  { code: 'STB', name: 'Sacombank (Sài Gòn Thương Tín)' },
  { code: 'VIB', name: 'VIB (Quốc Tế)' },
];

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingTg, setTestingTg] = useState(false);
  const [testingTgOrder, setTestingTgOrder] = useState(false);
  const [settingTgWebhook, setSettingTgWebhook] = useState(false);
  const [testingSepay, setTestingSepay] = useState(false);
  const [copiedWebhookUrl, setCopiedWebhookUrl] = useState(false);
  const [showSepayKey, setShowSepayKey] = useState(false);
  const [showSepaySecret, setShowSepaySecret] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [tgWebhookInfo, setTgWebhookInfo] = useState<{ url?: string; active?: boolean } | null>(null);

  // Settings State
  const [bankId, setBankId] = useState('ACB');
  const [accountNo, setAccountNo] = useState('4747827');
  const [accountName, setAccountName] = useState('NGUYEN VAN DANG');
  const [hotline, setHotline] = useState('0938.494.303');
  const [zaloGroupUrl, setZaloGroupUrl] = useState('https://zalo.me/g/tuhocai');
  const [supportEmail, setSupportEmail] = useState('dang@tuhocai.top');
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [bannerEnabled, setBannerEnabled] = useState(false);
  const [bannerText, setBannerText] = useState('🔥 Ưu đãi đặc biệt: Giảm 50% trọn bộ Prompt & Workflow AI Automation!');
  const [bannerUrl, setBannerUrl] = useState('/san-pham');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');

  // SePay Settings
  const [sepayApiKey, setSepayApiKey] = useState('');
  const [sepayWebhookSecret, setSepayWebhookSecret] = useState('');
  const [sepayAutoApprove, setSepayAutoApprove] = useState(true);

  const sepayWebhookUrl = 'https://www.tuhocai.top/api/webhook/sepay';

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        const s = data.settings;
        setBankId(s.bank_id || 'ACB');
        setAccountNo(s.account_no || '4747827');
        setAccountName(s.account_name || 'NGUYEN VAN DANG');
        setHotline(s.hotline || '0938.494.303');
        setZaloGroupUrl(s.zalo_group_url || 'https://zalo.me/g/tuhocai');
        setSupportEmail(s.support_email || 'dang@tuhocai.top');
        setTelegramBotToken(s.telegram_bot_token || '');
        setTelegramChatId(s.telegram_chat_id || '');
        setBannerEnabled(Boolean(s.banner_enabled));
        setBannerText(s.banner_text || '');
        setBannerUrl(s.banner_url || '/san-pham');
        setGeminiApiKey(s.gemini_api_key || '');
        setOpenaiApiKey(s.openai_api_key || '');
        setSepayApiKey(s.sepay_api_key || '');
        setSepayWebhookSecret(s.sepay_webhook_secret || '');
        setSepayAutoApprove(s.sepay_auto_approve !== undefined ? Boolean(s.sepay_auto_approve) : true);

        // Fetch Webhook info for Telegram
        if (s.telegram_bot_token) {
          fetchTgWebhookInfo(s.telegram_bot_token);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTgWebhookInfo = async (token?: string) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_telegram_webhook_info', token: token || telegramBotToken }),
      });
      const data = await res.json();
      if (data.success && data.info) {
        setTgWebhookInfo(data.info);
      }
    } catch (_) {}
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setNotice(null);

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bank_id: bankId,
          account_no: accountNo.trim(),
          account_name: accountName.trim().toUpperCase(),
          hotline: hotline.trim(),
          zalo_group_url: zaloGroupUrl.trim(),
          support_email: supportEmail.trim(),
          telegram_bot_token: telegramBotToken.trim(),
          telegram_chat_id: telegramChatId.trim(),
          banner_enabled: bannerEnabled,
          banner_text: bannerText.trim(),
          banner_url: bannerUrl.trim(),
          gemini_api_key: geminiApiKey.trim(),
          openai_api_key: openaiApiKey.trim(),
          sepay_api_key: sepayApiKey.trim(),
          sepay_webhook_secret: sepayWebhookSecret.trim(),
          sepay_auto_approve: sepayAutoApprove,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Lỗi lưu cài đặt');
      }

      setNotice({
        type: 'success',
        message: 'Đã lưu cấu hình hệ thống thành công! Mã VietQR, SePay và Bot Telegram đã được đồng bộ.',
      });
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message || 'Lỗi khi lưu cài đặt' });
    } finally {
      setSaving(false);
    }
  };

  // Test SePay API Key
  const handleTestSepay = async () => {
    if (!sepayApiKey.trim()) {
      alert('Vui lòng nhập Token API của SePay trước khi kiểm tra.');
      return;
    }
    try {
      setTestingSepay(true);
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_sepay',
          apiKey: sepayApiKey.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể xác thực API Token SePay');
      }
      alert('🎉 THÀNH CÔNG: Token SePay hợp lệ và đã kết nối máy chủ SePay hoàn hảo!');
    } catch (err: any) {
      alert('⚠️ ' + (err.message || 'Lỗi kiểm tra SePay'));
    } finally {
      setTestingSepay(false);
    }
  };

  // Kích hoạt Webhook cho Telegram Bot
  const handleSetTelegramWebhook = async () => {
    if (!telegramBotToken.trim()) {
      alert('Vui lòng nhập Telegram Bot Token trước khi kích hoạt Webhook.');
      return;
    }
    try {
      setSettingTgWebhook(true);
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_telegram_webhook',
          token: telegramBotToken.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Lỗi kích hoạt Webhook Telegram');
      }
      alert(data.message || 'Đã kích hoạt Webhook Telegram thành công!');
      fetchTgWebhookInfo(telegramBotToken.trim());
    } catch (err: any) {
      alert('⚠️ ' + (err.message || 'Lỗi kết nối Webhook Telegram'));
    } finally {
      setSettingTgWebhook(false);
    }
  };

  // Test gửi tin nhắn Telegram cơ bản
  const handleTestTelegram = async () => {
    if (!telegramBotToken || !telegramChatId) {
      alert('Vui lòng nhập Bot Token và Chat ID trước khi test.');
      return;
    }

    try {
      setTestingTg(true);
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_telegram',
          token: telegramBotToken.trim(),
          chatId: telegramChatId.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Lỗi gửi tin nhắn Telegram');
      }

      alert('🎉 THÀNH CÔNG: Tin nhắn thử nghiệm đã được gửi đến Telegram của bạn! Hãy mở điện thoại kiểm tra nhé.');
    } catch (err: any) {
      alert('⚠️ ' + (err.message || 'Lỗi kết nối Telegram'));
    } finally {
      setTestingTg(false);
    }
  };

  // Test gửi đơn hàng mẫu có nút Duyệt
  const handleTestOrderBot = async () => {
    if (!telegramBotToken || !telegramChatId) {
      alert('Vui lòng nhập Bot Token và Chat ID trước khi test.');
      return;
    }

    try {
      setTestingTgOrder(true);
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_order_bot',
          token: telegramBotToken.trim(),
          chatId: telegramChatId.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Lỗi gửi đơn hàng mẫu qua Telegram');
      }

      alert('🛒 THÀNH CÔNG: Đã gửi thông báo đơn hàng mẫu kèm nút [DUYỆT ĐƠN] về Telegram! Bạn có thể bấm thử trên điện thoại để trải nghiệm.');
    } catch (err: any) {
      alert('⚠️ ' + (err.message || 'Lỗi gửi đơn mẫu Telegram'));
    } finally {
      setTestingTgOrder(false);
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(sepayWebhookUrl);
    setCopiedWebhookUrl(true);
    setTimeout(() => setCopiedWebhookUrl(false), 2000);
  };

  const previewQrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo || '0000'}-compact2.png?amount=99000&addInfo=DEMO99&accountName=${encodeURIComponent(accountName || 'TENTAIKHOAN')}`;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 dark:text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        <p>Đang tải cấu hình hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Cấu hình Website & Thanh toán VietQR / SePay
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Thiết lập tài khoản ngân hàng, cổng SePay khớp tiền tự động, Bot Telegram báo đơn và thông tin liên hệ
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSaveSettings()}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-blue-800 hover:opacity-85 text-white font-bold shadow-md shadow-indigo-600/20 border border-indigo-600/30 disabled:opacity-50 transition active:scale-95 cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Đang lưu...' : 'Lưu tất cả thay đổi'}
        </button>
      </div>

      {/* Notifications */}
      {notice && (
        <div
          className={`p-4 rounded-xl border-2 flex items-center justify-between gap-3 ${
            notice.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-medium'
              : 'bg-rose-50 dark:bg-red-500/10 border-rose-500/40 text-rose-800 dark:text-red-300 font-medium'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            <span>{notice.message}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-xs hover:underline opacity-80 font-bold">
            Đóng
          </button>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: VietQR Configuration */}
        <div className="p-6 rounded-2xl bento-card border-2 border-slate-300 dark:border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Tài khoản Ngân hàng nhận tiền (VietQR)</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Khi khách thanh toán, mã QR sẽ tự động sinh theo thông tin này</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold">
              Chuẩn VietQR Quốc gia
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Ngân hàng thụ hưởng</label>
                <select
                  value={bankId}
                  onChange={(e) => setBankId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 text-sm font-medium"
                >
                  {POPULAR_BANKS.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.code} - {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Số tài khoản ngân hàng</label>
                <input
                  type="text"
                  required
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  placeholder="Ví dụ: 4747827"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tên chủ tài khoản (Viết hoa không dấu)
                </label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                  placeholder="NGUYEN VAN DANG"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 font-mono text-sm uppercase font-bold"
                />
              </div>
            </div>

            {/* QR Preview Card */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Mẫu mã VietQR sẽ hiển thị
              </div>
              <div className="w-44 h-44 bg-white p-2 rounded-xl shadow-md border-2 border-slate-300 dark:border-white/10 mb-2 overflow-hidden flex items-center justify-center">
                <img
                  src={previewQrUrl}
                  alt="Demo VietQR"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
                {bankId} - {accountNo}
              </div>
              <div className="text-[11px] font-black text-slate-900 dark:text-white uppercase">{accountName}</div>
            </div>
          </div>
        </div>

        {/* Section 2: SePay Payment Gateway Configuration */}
        <div className="p-6 rounded-2xl bento-card border-2 border-amber-500/30 dark:border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  Cổng Thanh Toán Tự Động SePay (Khớp Tiền Tự Động 24/7)
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-extrabold">
                    Auto-Pay V2
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Tự động kiểm tra biến động số dư ngân hàng ACB/MB/VIB, khớp mã đơn và mở khóa tài nguyên trong 3-5 giây
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestSepay}
                disabled={testingSepay}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {testingSepay ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Radio className="w-3.5 h-3.5" />}
                {testingSepay ? 'Đang kiểm tra...' : 'Kiểm tra kết nối SePay API'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SePay API Key / Token */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>SePay API Token (Token bí mật của tài khoản)</span>
                <a
                  href="https://my.sepay.vn"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-0.5 font-medium"
                >
                  Lấy trên my.sepay.vn <ExternalLink className="w-3 h-3" />
                </a>
              </label>
              <div className="relative">
                <input
                  type={showSepayKey ? 'text' : 'password'}
                  value={sepayApiKey}
                  onChange={(e) => setSepayApiKey(e.target.value)}
                  placeholder="Ví dụ: D3A9Kxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowSepayKey(!showSepayKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showSepayKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Lấy tại mục <strong>Cấu hình API</strong> trên SePay. Dùng để gọi API kiểm tra giao dịch và xác thực Webhook.
              </p>
            </div>

            {/* SePay Webhook Secret */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                SePay Webhook Secret (HMAC-SHA256)
              </label>
              <div className="relative">
                <input
                  type={showSepaySecret ? 'text' : 'password'}
                  value={sepayWebhookSecret}
                  onChange={(e) => setSepayWebhookSecret(e.target.value)}
                  placeholder="whsec_Mb3fdTLikFj3RKluA4iyHRyMYxyXITZB"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowSepaySecret(!showSepaySecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showSepaySecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Khóa bảo mật chữ ký HMAC-SHA256 giúp chống làm giả thông báo tiền vào từ hacker.
              </p>
            </div>
          </div>

          {/* Webhook URL display with 1-click copy */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Đường dẫn Webhook SePay (Cài đặt trên my.sepay.vn):
              </div>
              <code className="text-xs font-mono text-emerald-400 break-all select-all">
                {sepayWebhookUrl}
              </code>
            </div>

            <button
              type="button"
              onClick={copyWebhookUrl}
              className={`px-3.5 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 ${
                copiedWebhookUrl
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              {copiedWebhookUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedWebhookUrl ? 'Đã sao chép!' : 'Sao chép Webhook URL'}
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sepayAutoApprove}
                onChange={(e) => setSepayAutoApprove(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">
                Tự động kích hoạt đơn hàng & mở khóa sản phẩm trong Kho ngay khi SePay báo tiền vào
              </span>
            </label>
          </div>
        </div>

        {/* Section 3: Bot Notifications & Telegram Auto-Approval */}
        <div className="p-6 rounded-2xl bento-card border-2 border-sky-500/30 dark:border-sky-500/20 bg-gradient-to-br from-sky-500/5 via-transparent to-transparent space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  Bot Thông Báo Đơn Hàng & Duyệt Tự Động (Telegram)
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 font-extrabold">
                    1-Click Approve
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Tự động gửi tin nhắn báo đơn mới, SePay khớp tiền và cho phép bấm [DUYỆT ĐƠN] ngay trên điện thoại
                </p>
              </div>
            </div>

            <Link
              href="/admin/cai-dat-telegram"
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-bold flex items-center gap-1 self-start sm:self-auto"
            >
              Cấu hình đa kênh & mẫu tin nhắn <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Webhook Status Alert */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  tgWebhookInfo?.active ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="text-slate-700 dark:text-slate-300">
                {tgWebhookInfo?.active ? (
                  <>
                    <strong className="text-emerald-600 dark:text-emerald-400">Webhook Telegram đang hoạt động:</strong>{' '}
                    <code className="text-[11px] font-mono text-slate-500">{tgWebhookInfo.url}</code>
                  </>
                ) : (
                  <>
                    <strong className="text-amber-600 dark:text-amber-400">Webhook chưa đăng ký:</strong> Để nhận lệnh
                    bấm <strong>[✅ DUYỆT ĐƠN]</strong> trực tiếp từ Telegram về website, bạn cần kích hoạt Webhook bên dưới.
                  </>
                )}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSetTelegramWebhook}
              disabled={settingTgWebhook}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer shadow-sm"
            >
              {settingTgWebhook ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              {settingTgWebhook ? 'Đang kích hoạt...' : 'Kích hoạt Webhook Bot'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Telegram Bot Token</span>
                <a
                  href="https://t.me/BotFather"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-0.5 font-medium"
                >
                  Lấy từ @BotFather <ExternalLink className="w-3 h-3" />
                </a>
              </label>
              <input
                type="text"
                value={telegramBotToken}
                onChange={(e) => setTelegramBotToken(e.target.value)}
                placeholder="Ví dụ: 8781006384:AAHDfcnSsIiwDpycoY9G-..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 font-mono text-xs"
              />
              <p className="text-[11px] text-slate-500 mt-1">Bot Token do BotFather cấp khi tạo Bot</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Telegram Chat ID (Cá nhân hoặc Nhóm)</span>
                <a
                  href="https://t.me/userinfobot"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-0.5 font-medium"
                >
                  Lấy từ @userinfobot <ExternalLink className="w-3 h-3" />
                </a>
              </label>
              <input
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="Ví dụ: 6580812076"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 font-mono text-xs"
              />
              <p className="text-[11px] text-slate-500 mt-1">Chat với bot <code>@userinfobot</code> để lấy Chat ID của bạn</p>
            </div>
          </div>

          {/* Action test buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleTestTelegram}
              disabled={testingTg}
              className="px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {testingTg ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              {testingTg ? 'Đang gửi...' : 'Gửi tin nhắn test kết nối'}
            </button>

            <button
              type="button"
              onClick={handleTestOrderBot}
              disabled={testingTgOrder}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm shadow-emerald-500/20"
            >
              {testingTgOrder ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingCart className="w-3.5 h-3.5" />}
              {testingTgOrder ? 'Đang gửi đơn mẫu...' : 'Gửi thử đơn hàng mẫu (Có nút Duyệt)'}
            </button>

            <a
              href="https://t.me/blogger_tuhocai_bot"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:opacity-85 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Bot className="w-3.5 h-3.5 text-sky-500" />
              Mở Bot trên Telegram
            </a>
          </div>
        </div>

        {/* Section 4: Contact & Support */}
        <div className="p-6 rounded-2xl bento-card border-2 border-slate-300 dark:border-white/10 space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Phone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Thông tin Liên hệ & Hỗ trợ học viên
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Hiển thị ở chân trang (Footer), trang thanh toán và nút liên hệ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Hotline / Zalo hỗ trợ</label>
              <input
                type="text"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                placeholder="0938.494.303"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Đường dẫn Nhóm Zalo VIP</label>
              <input
                type="url"
                value={zaloGroupUrl}
                onChange={(e) => setZaloGroupUrl(e.target.value)}
                placeholder="https://zalo.me/g/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Hỗ trợ kỹ thuật</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="dang@tuhocai.top"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Top Announcement Banner */}
        <div className="p-6 rounded-2xl bento-card border-2 border-slate-300 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                Thanh thông báo Khuyến mãi (Top Banner)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Hiển thị một thanh banner nổi bật ở trên cùng của trang web</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">Bật thông báo</span>
              <input
                type="checkbox"
                checked={bannerEnabled}
                onChange={(e) => setBannerEnabled(e.target.checked)}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nội dung thông báo</label>
              <input
                type="text"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="🔥 Ưu đãi giảm 50% hôm nay..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Đường dẫn khi bấm (URL)</label>
              <input
                type="text"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="/san-pham"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 6: AI Assistant API Keys */}
        <div className="p-6 rounded-2xl bento-card border-2 border-slate-300 dark:border-white/10 space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Khóa API Trợ lý AI Viết bài (Google Gemini / OpenAI)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Dùng để kích hoạt tính năng tự động sinh bài viết và prompt chuẩn SEO theo yêu cầu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Google Gemini API Key (Khuyên dùng - Có gói miễn phí rất nhanh)
              </label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 text-sm font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Lấy miễn phí tại{' '}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                OpenAI API Key (Tùy chọn)
              </label>
              <input
                type="password"
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 text-sm font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">Dùng model gpt-4o-mini</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
