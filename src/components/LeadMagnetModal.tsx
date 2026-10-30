'use client';

import { useState } from 'react';
import { X, CheckCircle2, Download, MessageCircle, ArrowRight, Loader2, ShieldCheck, Sparkles, PackageCheck } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-300 dark:border-white/20 shadow-2xl p-6 sm:p-8 overflow-hidden text-left transition-colors">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {result ? (
          /* Success Screen */
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border-2 border-emerald-400 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Đăng ký thành công!</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Tài liệu <strong className="text-indigo-900 dark:text-indigo-400 font-mono font-bold">{resourceName}</strong> đã sẵn sàng để tải xuống.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href="/dashboard"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 hover:opacity-85 text-white font-bold text-sm shadow-xl shadow-indigo-950/25 transition-all active:scale-[0.98]"
              >
                <PackageCheck className="w-4 h-4" />
                🚀 Vào Xem Trong Kho Tài Liệu Của Tôi
              </a>

              <a
                href={result.zaloGroup}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-700 hover:opacity-85 text-white font-bold text-sm shadow-xl shadow-emerald-950/30 transition-all border-2 border-emerald-500 active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4" />
                Tham Gia Nhóm Zalo Nhận Thêm Prompt Mới
              </a>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 font-mono">
              Tài liệu đã được kích hoạt vĩnh viễn trong tài khoản Tự Học AI của bạn.
            </p>
          </div>
        ) : (
          /* Form Screen */
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-900 dark:text-indigo-400 border-2 border-indigo-400 dark:border-indigo-500/30 text-xs font-mono font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-700 dark:text-cyan-400" />
                Tài liệu Miễn Phí (100% Free)
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                Tải Ngay: {resourceName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Nhập thông tin bên dưới để kích hoạt tài liệu vào Kho Của Tôi và nhận lời mời tham gia nhóm hỗ trợ Zalo.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border-2 border-rose-300 dark:border-rose-500/30 text-rose-800 dark:text-rose-400 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                  Họ và tên của bạn <span className="text-indigo-700 dark:text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Đăng"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#09090b] border-2 border-slate-300 dark:border-white/[0.15] text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-700 transition-colors shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                  Địa chỉ Email <span className="text-indigo-700 dark:text-cyan-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#09090b] border-2 border-slate-300 dark:border-white/[0.15] text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-700 transition-colors shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                  Số điện thoại / Zalo (Tùy chọn)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0938..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#09090b] border-2 border-slate-300 dark:border-white/[0.15] text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-700 transition-colors shadow-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 hover:opacity-85 text-white font-bold text-sm shadow-xl shadow-indigo-950/25 disabled:opacity-50 transition-all active:scale-[0.98]"
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

              <p className="text-[11px] text-slate-500 dark:text-slate-500 text-center flex items-center justify-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Cam kết bảo mật thông tin. Không spam.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
