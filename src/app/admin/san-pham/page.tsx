'use client';

import { useState, useEffect } from 'react';
import {
  Package,
  PlusCircle,
  Edit3,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Link2,
  DollarSign,
  Sparkles,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      setSaving(true);
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Lỗi cập nhật sản phẩm');

      setNotice({ type: 'success', message: 'Cập nhật thông tin sản phẩm thành công!' });
      setEditingProduct(null);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Lỗi lưu sản phẩm');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (prod: any) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: prod.id,
          is_active: prod.is_active ? 0 : 1,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Lỗi chuyển trạng thái');

      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Lỗi cập nhật');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-400" />
            Quản lý sản phẩm & Tài nguyên số
          </h1>
          <p className="text-sm text-slate-400">Thiết lập giá bán, link tải Google Drive/Notion sau khi đơn hàng được duyệt</p>
        </div>
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
            {notice.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{notice.message}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-xs hover:underline opacity-80">
            Đóng
          </button>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-slate-400 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          <span>Đang tải danh sách sản phẩm...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center p-12 text-slate-400 bg-slate-900/60 rounded-2xl border border-slate-800">
          <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p>Chưa có sản phẩm nào trong hệ thống</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition group"
            >
              <div>
                <div className="relative aspect-video bg-slate-950 overflow-hidden border-b border-slate-800">
                  <img
                    src={p.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(p)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md transition ${
                        p.is_active
                          ? 'bg-emerald-500/80 text-white'
                          : 'bg-slate-800/80 text-slate-400'
                      }`}
                    >
                      {p.is_active ? 'Đang mở bán' : 'Tạm ẩn'}
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="text-xs font-mono text-indigo-400">{p.slug}</div>
                  <h3 className="font-bold text-white text-base line-clamp-1">{p.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{p.summary || 'Chưa có mô tả ngắn'}</p>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-lg font-bold text-cyan-400">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price || 0)}
                    </span>
                    {p.original_price && p.original_price > p.price && (
                      <span className="text-xs text-slate-500 line-through">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.original_price)}
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800/60">
                    <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                      <Link2 className="w-3 h-3 text-indigo-400" />
                      Link cấp cho khách sau thanh toán:
                    </div>
                    {p.download_url ? (
                      <a
                        href={p.download_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-400 hover:underline truncate block font-mono"
                      >
                        {p.download_url}
                      </a>
                    ) : (
                      <span className="text-xs text-amber-500/80 italic">Chưa gắn link tài nguyên</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/40 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={`/san-pham/${p.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Xem trang bán
                </a>

                <button
                  type="button"
                  onClick={() => setEditingProduct(p)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Sửa giá & link
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-400" />
                Cập nhật sản phẩm: {editingProduct.title}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên sản phẩm</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Giá bán (VNĐ)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Giá gốc gạch ngang (VNĐ)</label>
                  <input
                    type="number"
                    value={editingProduct.original_price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, original_price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Link tải / Thư mục Drive / Khóa học (Secret Link)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... hoặc https://notion.so/..."
                  value={editingProduct.download_url || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, download_url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Đường link này chỉ hiển thị với những học viên đã mua và được admin phê duyệt đơn hàng.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">URL ảnh đại diện (Thumbnail)</label>
                <input
                  type="url"
                  value={editingProduct.thumbnail || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, thumbnail: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-sm"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-sm font-medium hover:from-indigo-600 hover:to-cyan-600 shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Đang lưu...' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
