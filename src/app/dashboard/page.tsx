'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Layers,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ShoppingBag,
  ExternalLink,
  Loader2,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [library, setLibrary] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'library' | 'orders'>('library');

  useEffect(() => {
    async function loadData() {
      try {
        const authRes = await fetch('/api/auth/me');
        const authData = await authRes.json();
        if (!authData.authenticated) {
          router.push('/login?redirect=/dashboard');
          return;
        }
        setUser(authData.user);

        const libRes = await fetch('/api/library');
        const libData = await libRes.json();
        if (libData.success) {
          setLibrary(libData.library || []);
          setOrders(libData.orders || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-slate-400">Đang tải thông tin tài khoản...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl uppercase shadow-lg shadow-indigo-600/30">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{user.name}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                {user.role}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/san-pham"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Khám Phá Thêm Workflow
          </Link>
          <a
            href="https://zalo.me/g/tuhocai"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Group Zalo Hỗ Trợ
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('library')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'library'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          Kho Tài Liệu Đã Mở Khóa ({library.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'orders'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Lịch Sử Đơn Hàng ({orders.length})
        </button>
      </div>

      {/* TAB 1: LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          {library.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {library.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                        {item.category || 'Tài nguyên'}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        Mở ngày: {new Date(item.unlocked_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base leading-snug line-clamp-2">
                      {item.product_name}
                    </h3>
                  </div>

                  <div className="pt-2">
                    <a
                      href={item.download_url || 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.01]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Mở Thư Mục Tải Google Drive
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl bg-slate-900 border border-slate-800 p-8 space-y-4">
              <Layers className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">Chưa có tài liệu nào trong kho</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Bạn có thể đăng ký tải miễn phí các bộ Prompt VIP hoặc sở hữu ngay Workflow n8n để xem tại đây.
              </p>
              <Link
                href="/#tai-lieu-free"
                className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
              >
                Nhận Bộ Tài Liệu Miễn Phí
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Mã đơn</th>
                    <th className="py-3.5 px-4">Sản phẩm</th>
                    <th className="py-3.5 px-4">Số tiền</th>
                    <th className="py-3.5 px-4">Trạng thái</th>
                    <th className="py-3.5 px-4">Ngày tạo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{ord.order_code}</td>
                      <td className="py-3.5 px-4 font-medium text-white max-w-xs truncate">{ord.product_name}</td>
                      <td className="py-3.5 px-4 font-bold">{new Intl.NumberFormat('vi-VN').format(ord.price)} đ</td>
                      <td className="py-3.5 px-4">
                        {ord.payment_status === 'APPROVED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Đã duyệt
                          </span>
                        ) : ord.payment_status === 'PENDING' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock className="w-3 h-3" /> Đang chờ duyệt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                            <AlertCircle className="w-3 h-3" /> Từ chối
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(ord.created_at).toLocaleDateString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl bg-slate-900 border border-slate-800 p-8 space-y-2">
              <FileText className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">Chưa có đơn hàng nào</h3>
              <p className="text-xs text-slate-400">Lịch sử thanh toán sẽ được lưu lại tự động tại đây.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
