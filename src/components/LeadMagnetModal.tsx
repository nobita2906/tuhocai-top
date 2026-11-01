'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle2, Download, MessageCircle, ArrowRight, Loader2, ShieldCheck, Sparkles, PackageCheck, UserCheck } from 'lucide-react';

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
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; phone?: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [manualMode, setManualMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ downloadUrl: string; zaloGroup: string } | null>(null);

  const claimForUser = useCallback(async (user: { name?: string; email: string; phone?: string }) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name || 'Thành viên Tự Học AI',
          email: user.email,
          phone: user.phone || '',
          resource_id: resourceId,
          resource_name: resourceName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi kích hoạt');
      }

      setResult({
        downloadUrl: data.download_url || defaultDownloadUrl,
        zaloGroup: data.zalo_group || 'https://zalo.me/g/tuhocai',
      });
    } catch (err: any) {
      setError(err.message || 'Không thể tự động kích hoạt. Bạn có thể thử lại hoặc nhập thông tin thủ công.');
    } finally {
      setLoading(false);
      setCheckingAuth(false);
    }
  }, [resourceId, resourceName, defaultDownloadUrl]);

  // Auto-detect authentication & auto-claim for logged-in users
  useEffect(() => {
    if (!isOpen) {
      setResult(null);
      setError('');
      setLoading(false);
      setManualMode(false);
      return;
    }

    let isMounted = true;
    setCheckingAuth(true);
    setError('');

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          setName(data.user.name || '');
          setEmail(data.user.email || '');
          if (data.user.phone) setPhone(data.user.phone);

          // Tự động kích hoạt tài liệu vào Kho Của Tôi cho người dùng đã đăng nhập (Không cần nhập lại form)
          claimForUser(data.user);
        } else {
          setCurrentUser(null);
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setCurrentUser(null);
        setCheckingAuth(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, claimForUser]);

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

  if (!isOpen) return null;

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
          /* Success Screen with direct download button */
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border-2 border-emerald-400 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                {currentUser ? 'ĐÃ KÍCH HOẠT VÀO TÀI KHOẢN' : 'ĐĂNG KÝ THÀNH CÔNG'}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {currentUser ? 'Tài liệu đã sẵn sàng tải!' : 'Đăng ký thành công!'}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 max-w-md mx-auto">
                Tài liệu <strong className="text-indigo-900 dark:text-indigo-400 font-mono font-bold">{resourceName}</strong> đã được thêm vào Kho Của Tôi {currentUser?.email ? <>của tài khoản <strong className="text-slate-900 dark:text-white">{currentUser.email}</strong></> : null}.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* NÚT TẢI XUỐNG TRỰC TIẾP (Google Drive / File) */}
              <a
                href={result.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:opacity-90 text-white font-extrabold text-sm shadow-xl shadow-emerald-950/25 transition-all border border-emerald-400/30 active:scale-[0.98]"
              >
                <Download className="w-5 h-5 animate-pulse" />
                📥 Tải File / Mở Link Google Drive Ngay
              </a>

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
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white dark:bg-white/[0.04] hover:opacity-85 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-xs transition-all border-2 border-slate-300 dark:border-white/10 active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Tham Gia Nhóm Zalo Nhận Thêm Prompt Mới
              </a>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 font-mono">
              Tài liệu đã được kích hoạt vĩnh viễn trong tài khoản Tự Học AI của bạn.
            </p>
          </div>
        ) : checkingAuth || (loading && currentUser && !manualMode) ? (
          /* Auto-activation screen for logged-in user */
          <div className="py-10 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border-2 border-indigo-400 dark:border-indigo-500/30 text-indigo-700 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-sm">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-900 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-500/25 text-xs font-mono font-bold">
                <UserCheck className="w-3.5 h-3.5 text-indigo-700 dark:text-cyan-400" />
                ĐÃ NHẬN DIỆN TÀI KHOẢN
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Đang kích hoạt tài liệu vào Kho...
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                Đang mở khóa <strong>{resourceName}</strong> cho tài khoản <strong className="text-slate-900 dark:text-white font-mono">{currentUser?.email || email}</strong>
              </p>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              Vui lòng đợi giây lát, hệ thống đang chuẩn bị đường link tải cho bạn...
            </p>
          </div>
        ) : (
          /* Form Screen (For anonymous user or manual fallback) */
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
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border-2 border-rose-300 dark:border-rose-500/30 text-rose-800 dark:text-rose-400 text-xs font-semibold space-y-2">
                <p>{error}</p>
                {currentUser && (
                  <button
                    type="button"
                    onClick={() => claimForUser(currentUser)}
                    className="inline-block text-xs font-bold underline hover:opacity-80"
                  >
                    Thử lại kích hoạt tự động
                  </button>
                )}
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
