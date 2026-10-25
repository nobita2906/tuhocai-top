'use client';

import { useState } from 'react';
import { X, Search, Download, ExternalLink, ShieldCheck, AlertCircle, Loader2, PackageCheck, MessageCircle } from 'lucide-react';

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

interface MyVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyVaultModal({ isOpen, onClose }: MyVaultModalProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<VaultItem[]>([]);

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Vui lòng nhập Email hoặc Số điện thoại đã dùng khi mua hàng');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const res = await fetch(`/api/orders/my-vault?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Không tìm thấy thông tin đơn hàng');
      }

      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối tra cứu');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl max-h-[88vh] flex flex-col rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-300 dark:border-white/20 shadow-2xl overflow-hidden transition-all text-slate-900 dark:text-slate-100"
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
              <p className="text-xs text-slate-600 dark:text-slate-400">Tra cứu & tải lại toàn bộ tài nguyên AI bạn đã mua</p>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Search Form */}
          <form onSubmit={handleLookup} className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Nhập Gmail hoặc Số điện thoại khi mua
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="VD: nguyenvana@gmail.com hoặc 0988xxxxxx"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-white/15 bg-white dark:bg-[#181822] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-700 shadow-xs"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 hover:opacity-85 text-white font-bold text-sm shadow-md shadow-indigo-950/25 disabled:opacity-50 transition-all shrink-0 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Tra Cứu
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Mẹo: Hệ thống tự động nhận diện tất cả đơn đã thanh toán thành công qua mã VietQR hoặc quét hóa đơn.
            </p>
          </form>

          {/* Error notice */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Results List */}
          {hasSearched && !loading && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-white/10 pb-2">
                <span>Kết quả tra cứu ({orders.length} sản phẩm)</span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center text-slate-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                    Chưa tìm thấy đơn hàng đã xác nhận với thông tin này.
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Nếu bạn vừa chuyển khoản, vui lòng đợi hệ thống kiểm tra đối soát (khoảng 1–3 phút) hoặc liên hệ Zalo Admin để được kích hoạt ngay.
                  </p>
                  <a
                    href="https://zalo.me/0938494303"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 hover:scale-105 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Hỗ trợ qua Zalo 0938 494 303
                  </a>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {orders.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border-2 border-slate-300 dark:border-white/15 bg-white dark:bg-white/[0.03] hover:opacity-90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all shadow-xs"
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
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Tài nguyên bảo lưu vĩnh viễn</span>
          </div>
          <button
            onClick={onClose}
            className="font-semibold text-slate-700 dark:text-slate-300 hover:underline"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
