'use client';

import { useState } from 'react';
import { X, Sparkles, CheckCircle2, Download, MessageCircle, ArrowRight, Loader2 } from 'lucide-react';

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceId?: string;
  resourceName?: string;
  defaultDownloadUrl?: string;
}

export default function LeadMagnetModal({
  isOpen,
  onClose,
  resourceId = 'FREE-ALL',
  resourceName = 'Trọn bộ tài liệu AI & Workflow Miễn Phí',
  defaultDownloadUrl = 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing',
}: LeadMagnetModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ downloadUrl: string; zaloGroup: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          resource_id: resourceId,
          resource_name: resourceName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra');
      }

      setResult({
        downloadUrl: data.download_url || defaultDownloadUrl,
        zaloGroup: data.zalo_group || 'https://zalo.me/g/tuhocai',
      });
    } catch (err: any) {
      setError(err.message || 'Không thể đăng ký. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 overflow-hidden text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {result ? (
          /* Success Screen */
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Đăng ký thành công!</h3>
              <p className="text-sm text-slate-300">
                Tài liệu <strong className="text-emerald-400">{resourceName}</strong> đã sẵn sàng để tải xuống.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={result.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                Mở Link Tải Trực Tiếp (Google Drive)
              </a>

              <a
                href={result.zaloGroup}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4" />
                Tham Gia Nhóm Zalo Nhận Thêm Prompt Mới
              </a>
            </div>

            <p className="text-xs text-slate-400 pt-2">
              💡 Link tài liệu cũng đã được tự động lưu vào hệ thống của Tự Học AI.
            </p>
          </div>
        ) : (
          /* Form Screen */
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Tài liệu Miễn Phí (100% Free)
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                Tải Ngay: {resourceName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Nhập thông tin bên dưới để nhận ngay link tải qua Google Drive và lời mời tham gia nhóm hỗ trợ Zalo.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Họ và tên của bạn <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Đăng"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Địa chỉ Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Số điện thoại / Zalo (Tùy chọn)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0938..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang chuẩn bị link tải...
                  </>
                ) : (
                  <>
                    Nhận Link Tải Ngay
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-500 text-center">
                🔒 Cam kết bảo mật thông tin. Không spam.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
