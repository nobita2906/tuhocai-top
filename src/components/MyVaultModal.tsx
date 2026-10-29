'use client';

import { useState } from 'react';
import { 
  X, 
  Search, 
  Download, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  PackageCheck, 
  MessageCircle, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  User,
  LogOut
} from 'lucide-react';

interface VaultItem {
  id: string;
  orderCode: string;
  productName: string;
  productSlug?: string;
  category?: string;
  price: number;
  downloadUrl?: string | null;
  thumbnail?: string | null;
  approvedAt: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

interface MyVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyVaultModal({ isOpen, onClose }: MyVaultModalProps) {
  const [query, setQuery] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [orders, setOrders] = useState<VaultItem[]>([]);

  // Đổi mật khẩu
  const [showChangePass, setShowChangePass] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [changePassLoading, setChangePassLoading] = useState(false);
  const [changePassMsg, setChangePassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Vui lòng nhập Email hoặc Số điện thoại đã dùng khi mua hàng');
      return;
    }
    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu (Mặc định là Số điện thoại của bạn)');
      return;
    }

    setLoading(true);
    setError('');
    setShowChangePass(false);
    setChangePassMsg(null);

    try {
      const res = await fetch('/api/orders/my-vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: query.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Mật khẩu hoặc thông tin tra cứu không chính xác');
      }

      setHasSearched(true);
      setCustomer(data.customer || null);
      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối tra cứu');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassMsg(null);

    if (!customer?.email) return;

    if (!currentPass.trim()) {
      setChangePassMsg({ type: 'error', text: 'Vui lòng nhập mật khẩu hiện tại (hoặc SĐT)' });
      return;
    }

    if (newPass.length < 6) {
      setChangePassMsg({ type: 'error', text: 'Mật khẩu mới phải có tối thiểu 6 ký tự' });
      return;
    }

    if (newPass !== confirmPass) {
      setChangePassMsg({ type: 'error', text: 'Xác nhận mật khẩu mới không khớp' });
      return;
    }

    setChangePassLoading(true);
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customer.email,
          currentPassword: currentPass.trim(),
          newPassword: newPass.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Không thể đổi mật khẩu');
      }

      setChangePassMsg({ type: 'success', text: data.message || 'Đổi mật khẩu thành công!' });
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      // Cập nhật lại mật khẩu trong ô đăng nhập
      setPassword(newPass.trim());
    } catch (err: any) {
      setChangePassMsg({ type: 'error', text: err.message || 'Lỗi khi đổi mật khẩu' });
    } finally {
      setChangePassLoading(false);
    }
  };

  const handleResetSearch = () => {
    setHasSearched(false);
    setOrders([]);
    setCustomer(null);
    setPassword('');
    setShowChangePass(false);
    setChangePassMsg(null);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-300 dark:border-white/20 shadow-2xl overflow-hidden transition-all text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 border-2 border-indigo-400 dark:border-indigo-500/30 flex items-center justify-center text-indigo-900 dark:text-indigo-300 shadow-xs">
              <PackageCheck className="w-5 h-5 text-indigo-800 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Kho Của Tôi</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">Tra cứu & tải lại tài nguyên AI bạn đã mua</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Form Tra Cứu (chưa đăng nhập/tra cứu) */}
          {!hasSearched ? (
            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Email hoặc Số điện thoại khi mua hàng:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="VD: nguyenvana@gmail.com hoặc 0934xxxxxx"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-white/15 bg-white dark:bg-[#181822] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-700 shadow-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Mật khẩu tài khoản:
                  </label>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                    *Mặc định là SĐT của bạn
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Nhập số điện thoại của bạn (10 số)..."
                    className="w-full px-4 py-2.5 pr-11 rounded-xl border-2 border-slate-300 dark:border-white/15 bg-white dark:bg-[#181822] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-700 shadow-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  💡 Tài khoản được hệ thống tự động khởi tạo ngay khi bạn đặt hàng. Mật khẩu mặc định chính là Số điện thoại bạn đã điền lúc thanh toán.
                </p>
              </div>

              {/* Error notice */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 hover:opacity-85 text-white font-extrabold text-sm shadow-md shadow-indigo-950/25 disabled:opacity-50 transition-all active:scale-[0.98] cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang kiểm tra bảo mật & mở kho...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>MỞ KHÓA TÀI NGUYÊN KHO CỦA TÔI</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Đã Tra Cứu Thành Công: Hiển Thị Tài Nguyên & Chức Năng Đổi Mật Khẩu */
            <div className="space-y-4">
              {/* Header Info Khách Hàng */}
              <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/20 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-200 dark:bg-indigo-500/30 flex items-center justify-center text-indigo-800 dark:text-indigo-300">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {customer?.name || 'Học viên Tự Học AI'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {customer?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowChangePass(!showChangePass);
                      setChangePassMsg(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-white/10 border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/20 transition-all"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                    <span>{showChangePass ? 'Đóng form đổi pass' : 'Đổi mật khẩu'}</span>
                  </button>

                  <button
                    onClick={handleResetSearch}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    title="Đăng xuất / Tra cứu tài khoản khác"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form Đổi Mật Khẩu Tự Động */}
              {showChangePass && (
                <form onSubmit={handleChangePassword} className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-white/10">
                    <KeyRound className="w-4 h-4 text-amber-500" />
                    <h4 className="text-xs font-extrabold uppercase text-slate-800 dark:text-slate-200">
                      Thay đổi mật khẩu tài khoản
                    </h4>
                  </div>

                  {changePassMsg && (
                    <div className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                      changePassMsg.type === 'success' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40' 
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40'
                    }`}>
                      {changePassMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                      <span>{changePassMsg.text}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Mật khẩu hiện tại (hoặc SĐT):
                      </label>
                      <input 
                        type="password"
                        required
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        placeholder="Mật khẩu cũ / SĐT"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#181822] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-700 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Mật khẩu mới (≥ 6 ký tự):
                      </label>
                      <input 
                        type="password"
                        required
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="Mật khẩu mới"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#181822] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-700 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Xác nhận mật khẩu mới:
                      </label>
                      <input 
                        type="password"
                        required
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        placeholder="Gõ lại mật khẩu mới"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#181822] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-700 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={changePassLoading}
                      className="px-4 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow-xs disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {changePassLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>Lưu Mật Khẩu Mới</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Danh sách đơn hàng đã mở khóa */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-white/10 pb-2">
                  <span>Tài nguyên đã mở khóa ({orders.length} sản phẩm)</span>
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Bảo lưu trọn đời
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-6 text-sm text-slate-500">
                    Chưa có tài nguyên nào được kích hoạt.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {orders.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl border-2 border-slate-300 dark:border-white/15 bg-white dark:bg-white/[0.03] hover:opacity-95 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all shadow-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-900 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-500/30">
                              {item.orderCode}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              {new Date(item.approvedAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
                            {item.productName}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {item.downloadUrl ? (
                            <a
                              href={item.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 hover:opacity-85 shadow-md shadow-indigo-950/25 transition-all active:scale-[0.98]"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Tải Về Ngay
                            </a>
                          ) : (
                            <a
                              href={`https://zalo.me/0938494303?text=${encodeURIComponent(`Xin chào shop, mình đã mua đơn ${item.orderCode} (${item.productName}) cần cấp link tải.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-950 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600/40 hover:opacity-80 transition-all"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              Nhận qua Zalo
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Hệ thống bảo mật Tự Học AI</span>
          </div>
          <button
            onClick={onClose}
            className="font-semibold text-slate-700 dark:text-slate-300 hover:underline cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

