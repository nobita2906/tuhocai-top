'use client';

import { useState, useEffect } from 'react';
import {
  Send,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageSquare,
  HelpCircle,
  Play,
  Copy,
  Check,
} from 'lucide-react';
import { TelegramChannel, TelegramTemplates, DEFAULT_TELEGRAM_TEMPLATES } from '@/types/telegram';

export default function TelegramSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [botToken, setBotToken] = useState('');
  const [channels, setChannels] = useState<TelegramChannel[]>([]);
  const [templates, setTemplates] = useState<TelegramTemplates>(DEFAULT_TELEGRAM_TEMPLATES);
  const [activeTab, setActiveTab] = useState<'channels' | 'templates'>('channels');
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/telegram-settings');
        const data = await res.json();
        if (data.success) {
          setBotToken(data.botToken || '');
          setChannels(data.channels || []);
          setTemplates(data.templates || DEFAULT_TELEGRAM_TEMPLATES);
        }
      } catch (e: any) {
        setErrorMessage(e.message || 'Lỗi tải cấu hình');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddChannel = () => {
    const newChan: TelegramChannel = {
      id: `chan-${Date.now()}`,
      name: `Kênh mới #${channels.length + 1}`,
      chatId: '',
      type: 'ALL',
      enabled: true,
    };
    setChannels([...channels, newChan]);
  };

  const handleRemoveChannel = (id: string) => {
    setChannels(channels.filter((c) => c.id !== id));
  };

  const handleUpdateChannel = (id: string, field: keyof TelegramChannel, value: any) => {
    setChannels(
      channels.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/telegram-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken,
          channels,
          templates,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lỗi lưu cấu hình');
      showToast('✓ Đã lưu toàn bộ cấu hình Telegram thành công!');
    } catch (e: any) {
      setErrorMessage(e.message || 'Lỗi lưu dữ liệu');
    } finally {
      setSaving(false);
    }
  };

  const handleTestChannel = async (channel: TelegramChannel) => {
    if (!channel.chatId) {
      setErrorMessage(`Vui lòng nhập Chat ID cho kênh "${channel.name}" trước khi test`);
      return;
    }
    setTestingId(channel.id);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/telegram-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'TEST',
          targetChatId: channel.chatId,
          botToken,
          testMessage: `🔔 *THỬ NGHIỆM KẾT NỐI KÊNH THÀNH CÔNG!*\n\n📍 *Kênh:* ${channel.name}\n🆔 *Chat ID:* \`${channel.chatId}\`\n🎯 *Loại nhận tin:* ${channel.type}\n⏰ *Thời gian:* ${new Date().toLocaleString('vi-VN')}\n\n✨ Tự Học AI đã liên kết thành công với kênh Telegram này của anh Đăng!`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lỗi gửi tin thử nghiệm');
      showToast(`✓ Đã gửi tin nhắn test đến "${channel.name}" thành công!`);
    } catch (e: any) {
      setErrorMessage(e.message || 'Lỗi gửi tin thử nghiệm');
    } finally {
      setTestingId(null);
    }
  };

  const copyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 1500);
  };

  const placeholders = [
    { tag: '{order_code}', desc: 'Mã đơn hàng (ví dụ: THAI123456)' },
    { tag: '{customer_name}', desc: 'Họ và tên khách' },
    { tag: '{customer_email}', desc: 'Email khách hàng' },
    { tag: '{customer_phone}', desc: 'Số điện thoại khách' },
    { tag: '{product_name}', desc: 'Tên khóa học / sản phẩm' },
    { tag: '{amount}', desc: 'Số tiền định dạng (ví dụ: 199.000 đ)' },
    { tag: '{transfer_content}', desc: 'Nội dung chuyển khoản động' },
    { tag: '{bank_name}', desc: 'Tên ngân hàng (ACB)' },
    { tag: '{account_no}', desc: 'Số tài khoản (4747827)' },
    { tag: '{created_at}', desc: 'Thời gian phát sinh giao dịch' },
  ];

  if (loading) {
    return (
      <div className="p-8 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
        <p className="text-sm font-semibold text-slate-500">Đang tải cấu hình thông báo Telegram...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-slate-200 dark:border-white/[0.08] pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Send className="w-6 h-6 text-indigo-600" />
            Cấu Hình Thông Báo Telegram Đa Kênh
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quản lý bot, thêm không giới hạn kênh/group nhận tin và tùy biến 100% mẫu thông báo.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow-md transition-all active:scale-[0.98]"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Lưu Cấu Hình
        </button>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-400 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border-2 border-red-400 text-red-800 dark:text-red-300 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Bot Token Configuration */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-200 dark:border-white/[0.08] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white font-mono flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            Telegram Bot Token
          </label>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Từ @BotFather</span>
        </div>
        <input
          type="text"
          value={botToken}
          onChange={(e) => setBotToken(e.target.value)}
          placeholder="Ví dụ: 8781006384:AAHDfcnSsIiwDpycoY9G-fd7ug5-Ne2Oq0Y"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b-2 border-slate-200 dark:border-white/[0.08] gap-4">
        <button
          onClick={() => setActiveTab('channels')}
          className={`pb-3 text-sm font-extrabold transition-all border-b-2 -mb-[2px] ${
            activeTab === 'channels'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          1. Danh Sách Kênh & Group Nhận Tin ({channels.length})
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`pb-3 text-sm font-extrabold transition-all border-b-2 -mb-[2px] ${
            activeTab === 'templates'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          2. Tùy Biến Mẫu Tin Nhắn (Templates)
        </button>
      </div>

      {/* TAB 1: CHANNELS LIST WITH "+" BUTTON */}
      {activeTab === 'channels' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Bạn có thể thêm nhiều kênh (Chat ID cá nhân hoặc Group Telegram) để nhận thông báo theo phân loại.
            </p>
            <button
              onClick={handleAddChannel}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Thêm Kênh Nhận Tin
            </button>
          </div>

          <div className="space-y-3">
            {channels.map((chan, idx) => (
              <div
                key={chan.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-200 dark:border-white/[0.08] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-400 text-xs font-black flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={chan.name}
                      onChange={(e) => handleUpdateChannel(chan.id, 'name', e.target.value)}
                      placeholder="Tên kênh (VD: Group Kinh Doanh)"
                      className="font-bold text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 text-slate-900 dark:text-white px-1 py-0.5 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTestChannel(chan)}
                      disabled={testingId === chan.id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-400 font-bold text-[11px] border border-indigo-200 dark:border-indigo-500/20"
                    >
                      {testingId === chan.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                      Test Kênh
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveChannel(chan.id)}
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Xóa kênh"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100 dark:border-white/[0.05]">
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Chat ID / Group ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={chan.chatId}
                      onChange={(e) => handleUpdateChannel(chan.id, 'chatId', e.target.value)}
                      placeholder="VD: 6580812076 hoặc -100xxxxxxxx"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Phân loại thông báo nhận
                    </label>
                    <select
                      value={chan.type}
                      onChange={(e) => handleUpdateChannel(chan.id, 'type', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    >
                      <option value="ALL">Nhận tất cả thông báo</option>
                      <option value="MANUAL_REVIEW_ONLY">Chỉ nhận yêu cầu Duyệt Tay (Nút bấm)</option>
                      <option value="SUCCESS_ONLY">Chỉ nhận Đơn Đã Thanh Toán</option>
                      <option value="ORDERS_ONLY">Chỉ nhận Đơn Mới Khởi Tạo</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 flex items-end pb-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={chan.enabled}
                        onChange={(e) => handleUpdateChannel(chan.id, 'enabled', e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600"
                      />
                      Kích hoạt
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TEMPLATES WITH COPYABLE PLACEHOLDERS */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          {/* Placeholders bar */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-500/10 border-2 border-indigo-200 dark:border-indigo-500/20 space-y-2">
            <span className="text-xs font-extrabold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5 uppercase font-mono">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              Các biến số có thể chèn vào mẫu tin nhắn (Bấm để copy):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {placeholders.map((p) => (
                <button
                  key={p.tag}
                  type="button"
                  onClick={() => copyTag(p.tag)}
                  className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-500/30 text-indigo-900 dark:text-indigo-300 font-mono text-[11px] font-bold hover:bg-indigo-100 flex items-center gap-1 transition-all"
                  title={p.desc}
                >
                  {p.tag}
                  {copiedTag === p.tag ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 opacity-40" />}
                </button>
              ))}
            </div>
          </div>

          {/* Template 1: Order Created */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-200 dark:border-white/[0.08] shadow-xs space-y-2">
            <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white font-mono">
              1. Mẫu: Đơn hàng mới khởi tạo (Khách vừa xem mã VietQR)
            </h3>
            <textarea
              rows={8}
              value={templates.order_created || ''}
              onChange={(e) => setTemplates({ ...templates, order_created: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-600"
            />
          </div>

          {/* Template 2: Order Approved */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-200 dark:border-white/[0.08] shadow-xs space-y-2">
            <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white font-mono">
              2. Mẫu: Thanh toán thành công (SePay Auto Pay khớp tiền)
            </h3>
            <textarea
              rows={8}
              value={templates.order_approved || ''}
              onChange={(e) => setTemplates({ ...templates, order_approved: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-600"
            />
          </div>

          {/* Template 3: Manual Review */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-200 dark:border-white/[0.08] shadow-xs space-y-2">
            <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white font-mono">
              3. Mẫu: Yêu cầu duyệt tay khẩn cấp (Khách bấm sau 60s)
            </h3>
            <textarea
              rows={8}
              value={templates.manual_review || ''}
              onChange={(e) => setTemplates({ ...templates, manual_review: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-600"
            />
          </div>

          {/* Template 4: Unmatched Payment */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-200 dark:border-white/[0.08] shadow-xs space-y-2">
            <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white font-mono">
              4. Mẫu: Tiền vào tài khoản nhưng chưa khớp đơn
            </h3>
            <textarea
              rows={6}
              value={templates.unmatched_payment || ''}
              onChange={(e) => setTemplates({ ...templates, unmatched_payment: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}
