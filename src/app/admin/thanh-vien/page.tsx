'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  KeyRound,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserCheck,
  Package,
  BookOpen,
  Calendar,
  X,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State for Password Reset
  const [resetModalUser, setResetModalUser] = useState<any | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const url = new URL('/api/admin/users', window.location.origin);
      if (search) url.searchParams.set('q', search);
      if (roleFilter !== 'ALL') url.searchParams.set('role', roleFilter);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers();
  };

  const handleToggleRole = async (user: any) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const confirmMsg =
      newRole === 'ADMIN'
        ? `Bạn có chắc chắn muốn cấp quyền ADMIN (Quản trị viên) cho ${user.email}?`
        : `Bạn có chắc muốn hạ quyền xuống Thành viên thông thường cho ${user.email}?`;

    if (!confirm(confirmMsg)) return;

    try {
      setActionLoading(user.id);
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Lỗi cập nhật vai trò');

      setNotice({ type: 'success', message: `Đã đổi quyền cho ${user.email} thành ${newRole}!` });
      loadUsers();
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message || 'Lỗi xử lý' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenResetModal = (user: any) => {
    setResetModalUser(user);
    setNewPassword('');
  };

  const handleExecutePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUser || !newPassword) return;

    if (newPassword.length < 6) {
      alert('Mật khẩu mới tối thiểu 6 ký tự');
      return;
    }

    try {
      setResetLoading(true);
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: resetModalUser.id, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Lỗi đổi mật khẩu');

      setNotice({ type: 'success', message: `Đã đổi và mã hóa mật khẩu mới (bcrypt) cho ${resetModalUser.email} thành công!` });
      setResetModalUser(null);
    } catch (err: any) {
      alert(err.message || 'Lỗi đổi mật khẩu');
    } finally {
      setResetLoading(false);
    }
  };

  const handleDeleteUser = async (user: any) => {
    if (!confirm(`CẢNH BÁO: Bạn có chắc muốn xóa vĩnh viễn người dùng ${user.email}? Dữ liệu đơn hàng và thư viện liên quan cũng sẽ bị xóa.`)) {
      return;
    }

    try {
      setActionLoading(user.id);
      const res = await fetch(`/api/admin/users?id=${user.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Lỗi xóa người dùng');

      setNotice({ type: 'success', message: `Đã xóa tài khoản ${user.email} thành công!` });
      loadUsers();
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message || 'Lỗi khi xóa người dùng' });
    } finally {
      setActionLoading(null);
    }
  };

  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const regularCount = users.filter((u) => u.role === 'USER').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Quản lý thành viên & Phân quyền
          </h1>
          <p className="text-sm text-slate-400">Xem danh sách người dùng, đặt lại mật khẩu an toàn và cấp quyền Admin</p>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{users.length}</div>
            <div className="text-xs text-slate-400">Tổng tài khoản</div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-amber-400">{adminCount}</div>
            <div className="text-xs text-slate-400">Quản trị viên (ADMIN)</div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-cyan-400">{regularCount}</div>
            <div className="text-xs text-slate-400">Thành viên học viên</div>
          </div>
        </div>
      </div>

      {/* Alerts */}
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

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo họ tên hoặc email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </form>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRoleFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              roleFilter === 'ALL'
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Tất cả
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('ADMIN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              roleFilter === 'ADMIN'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            ADMIN
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('USER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              roleFilter === 'USER'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            USER
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
            <span>Đang tải danh sách thành viên...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center p-12 text-slate-400">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p>Không tìm thấy thành viên nào phù hợp</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-xs text-slate-400 uppercase">
                <tr>
                  <th className="px-5 py-3.5">Thành viên</th>
                  <th className="px-5 py-3.5">Vai trò</th>
                  <th className="px-5 py-3.5">Đơn hàng</th>
                  <th className="px-5 py-3.5">Khóa học / Sp</th>
                  <th className="px-5 py-3.5">Ngày tham gia</th>
                  <th className="px-5 py-3.5 text-right">Thao tác an toàn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0">
                          {(u.name || u.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-white flex items-center gap-1.5">
                            {u.name || 'Chưa đặt tên'}
                            {u.role === 'ADMIN' && <Shield className="w-3.5 h-3.5 text-amber-400" />}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'ADMIN'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {u.role === 'ADMIN' ? 'Quản trị viên' : 'Thành viên'}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Package className="w-4 h-4 text-indigo-400" />
                        <span className="font-semibold">{u.order_count || 0}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <BookOpen className="w-4 h-4 text-cyan-400" />
                        <span className="font-semibold">{u.library_count || 0}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : '—'}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Change Role Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleRole(u)}
                          disabled={actionLoading === u.id}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition flex items-center gap-1"
                          title="Đổi phân quyền"
                        >
                          <Shield className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{u.role === 'ADMIN' ? 'Hạ User' : 'Lên Admin'}</span>
                        </button>

                        {/* Reset Password Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenResetModal(u)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 transition"
                          title="Đặt lại mật khẩu mã hóa"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>

                        {/* Delete User Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u)}
                          disabled={actionLoading === u.id}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Password Reset Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <KeyRound className="w-5 h-5 text-indigo-400" />
                Đặt lại mật khẩu mới
              </div>
              <button
                onClick={() => setResetModalUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-400">
              Đang đặt lại mật khẩu cho tài khoản:{' '}
              <span className="text-indigo-400 font-medium font-mono">{resetModalUser.email}</span>
            </div>

            <form onSubmit={handleExecutePasswordReset} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mật khẩu mới (Tối thiểu 6 ký tự)
                </label>
                <input
                  type="text"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Mật khẩu sẽ được mã hóa an toàn bằng thuật toán <strong>bcrypt (10 rounds)</strong> trước khi lưu vào DB.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-sm"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-sm font-medium hover:from-indigo-600 hover:to-cyan-600 shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {resetLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {resetLoading ? 'Đang mã hóa...' : 'Xác nhận đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
