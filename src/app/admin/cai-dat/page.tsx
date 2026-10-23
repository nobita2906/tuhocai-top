'use client';

import { useState, useEffect } from 'react';
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
  ExternalLink,
  HelpCircle,
  QrCode,
  Wand2,
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
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Settings State
  const [bankId, setBankId] = useState('VPB');
  const [accountNo, setAccountNo] = useState('0934434101');
  const [accountName, setAccountName] = useState('NGUYEN VAN DANG');
  const [hotline, setHotline] = useState('0934.434.101');
  const [zaloGroupUrl, setZaloGroupUrl] = useState('https://zalo.me/g/tuhocai');
  const [supportEmail, setSupportEmail] = useState('dang@tuhocai.top');
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [bannerEnabled, setBannerEnabled] = useState(false);
  const [bannerText, setBannerText] = useState('🔥 Ưu đãi đặc biệt: Giảm 50% trọn bộ Prompt & Workflow AI Automation!');
  const [bannerUrl, setBannerUrl] = useState('/san-pham');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        const s = data.settings;
        setBankId(s.bank_id || 'VPB');
        setAccountNo(s.account_no || '');
        setAccountName(s.account_name || '');
        setHotline(s.hotline || '');
        setZaloGroupUrl(s.zalo_group_url || '');
        setSupportEmail(s.support_email || '');
        setTelegramBotToken(s.telegram_bot_token || '');
        setTelegramChatId(s.telegram_chat_id || '');
        setBannerEnabled(Boolean(s.banner_enabled));
        setBannerText(s.banner_text || '');
        setBannerUrl(s.banner_url || '/san-pham');
        setGeminiApiKey(s.gemini_api_key || '');
        setOpenaiApiKey(s.openai_api_key || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
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
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Lỗi lưu cài đặt');
      }

      setNotice({ type: 'success', message: 'Đã lưu cấu hình hệ thống thành công! Mã VietQR và Telegram đã được cập nhật.' });
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message || 'Lỗi khi lưu cài đặt' });
    } finally {
      setSaving(false);
    }
  };

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
          token: telegramBotToken.trim(),
          chatId: telegramChatId.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Lỗi gửi tin nhắn Telegram');
      }

      alert('🎉 THÀNH CÔNG: Tin nhắn thông báo đã được gửi đến Telegram của bạn! Hãy mở điện thoại kiểm tra nhé.');
    } catch (err: any) {
      alert('⚠️ ' + (err.message || 'Lỗi kết nối Telegram'));
    } finally {
      setTestingTg(false);
    }
  };

  const previewQrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo || '0000'}-compact2.png?amount=99000&addInfo=DEMO99&accountName=${encodeURIComponent(accountName || 'TENTAIKHOAN')}`;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p>Đang tải cấu hình hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-400" />
            Cấu hình Website & Thanh toán VietQR
          </h1>
          <p className="text-sm text-slate-400">Thiết lập tài khoản ngân hàng nhận tiền, Bot Telegram báo đơn và thông tin liên hệ</p>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Đang lưu...' : 'Lưu tất cả thay đổi'}
        </button>
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
            {notice.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{notice.message}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-xs hover:underline opacity-80">
            Đóng
          </button>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: VietQR Configuration */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Tài khoản Ngân hàng nhận tiền (VietQR)</h3>
                <p className="text-xs text-slate-400">Khi khách thanh toán, mã QR sẽ tự động sinh theo thông tin này</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              Chuẩn VietQR Quốc gia
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ngân hàng thụ hưởng</label>
                <select
                  value={bankId}
                  onChange={(e) => setBankId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500 text-sm"
                >
                  {POPULAR_BANKS.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.code} - {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Số tài khoản ngân hàng</label>
                <input
                  type="text"
                  required
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  placeholder="Ví dụ: 0934434101"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tên chủ tài khoản (Viết hoa không dấu)
                </label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                  placeholder="NGUYEN VAN DANG"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500 font-mono text-sm uppercase"
                />
              </div>
            </div>

            {/* QR Preview Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                Mẫu mã VietQR sẽ hiển thị
              </div>
              <div className="w-44 h-44 bg-white p-2 rounded-xl shadow-lg mb-2 overflow-hidden flex items-center justify-center">
                <img
                  src={previewQrUrl}
                  alt="Demo VietQR"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-[11px] font-mono text-slate-400 truncate max-w-[200px]">
                {bankId} - {accountNo}
              </div>
              <div className="text-[11px] font-bold text-white uppercase">{accountName}</div>
            </div>
          </div>
        </div>

        {/* Section 2: Telegram Bot Notifications */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Thông báo Đơn hàng qua Bot Telegram</h3>
                <p className="text-xs text-slate-400">Tự động gửi tin nhắn báo có đơn mới và ảnh bill ngân hàng về điện thoại</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleTestTelegram}
              disabled={testingTg}
              className="px-3.5 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
            >
              {testingTg ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              {testingTg ? 'Đang gửi...' : 'Gửi tin nhắn test'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Telegram Bot Token
              </label>
              <input
                type="text"
                value={telegramBotToken}
                onChange={(e) => setTelegramBotToken(e.target.value)}
                placeholder="Ví dụ: 8781006384:AAHDfcnSsIiwDpycoY9G-..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
              <p className="text-[11px] text-slate-500 mt-1">Lấy từ BotFather trên Telegram</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Telegram Chat ID (Cá nhân hoặc Nhóm)
              </label>
              <input
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="Ví dụ: 6580812076"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
              <p className="text-[11px] text-slate-500 mt-1">Chat với bot <code>@userinfobot</code> để lấy Chat ID của bạn</p>
            </div>
          </div>
        </div>

        {/* Section 3: Contact & Support */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Phone className="w-4 h-4 text-indigo-400" />
              Thông tin Liên hệ & Hỗ trợ học viên
            </h3>
            <p className="text-xs text-slate-400">Hiển thị ở chân trang (Footer), trang thanh toán và nút liên hệ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Hotline / Zalo hỗ trợ</label>
              <input
                type="text"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                placeholder="0934.434.101"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Đường dẫn Nhóm Zalo VIP</label>
              <input
                type="url"
                value={zaloGroupUrl}
                onChange={(e) => setZaloGroupUrl(e.target.value)}
                placeholder="https://zalo.me/g/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Hỗ trợ kỹ thuật</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="dang@tuhocai.top"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Top Announcement Banner */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                Thanh thông báo Khuyến mãi (Top Banner)
              </h3>
              <p className="text-xs text-slate-400">Hiển thị một thanh banner nổi bật ở trên cùng của trang web</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-slate-300 font-medium">Bật thông báo</span>
              <input
                type="checkbox"
                checked={bannerEnabled}
                onChange={(e) => setBannerEnabled(e.target.checked)}
                className="w-5 h-5 accent-indigo-500 rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nội dung thông báo</label>
              <input
                type="text"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="🔥 Ưu đãi giảm 50% hôm nay..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Đường dẫn khi bấm (URL)</label>
              <input
                type="text"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="/san-pham"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 5: AI Assistant API Keys */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-purple-400" />
              Khóa API Trợ lý AI Viết bài (Google Gemini / OpenAI)
            </h3>
            <p className="text-xs text-slate-400">
              Dùng để kích hoạt tính năng tự động sinh bài viết và prompt chuẩn SEO theo yêu cầu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Google Gemini API Key (Khuyên dùng - Có gói miễn phí rất nhanh)
              </label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500 text-sm font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Lấy miễn phí tại <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Google AI Studio</a>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                OpenAI API Key (Tùy chọn)
              </label>
              <input
                type="password"
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500 text-sm font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">Dùng model gpt-4o-mini</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
