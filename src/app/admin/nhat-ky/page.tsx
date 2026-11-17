'use client';

import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Clock,
  User,
  Activity,
  Search,
  RefreshCw,
  Loader2,
  FileText,
  CreditCard,
  Settings,
  AlertCircle,
  Database,
  Lock,
} from 'lucide-react';

interface AuditLog {
  id: string;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  user_role: string | null;
  action: string;
  target_type: string;
  target_id: string | null;
  details: string | null;
  ip_address: string | null;
  created_at: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/audit-logs?limit=100');
      const data = await res.json();
      if (data.success && data.logs) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Lỗi tải audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionBadge = (action: string) => {
    if (action.includes('APPROVE')) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
          {action}
        </span>
      );
    }
    if (action.includes('DELETE') || action.includes('REJECT') || action.includes('CANCEL')) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30">
          {action}
        </span>
      );
    }
    if (action.includes('UPDATE')) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30">
          {action}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-500/30">
        {action}
      </span>
    );
  };

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      (log.user_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.user_email || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.target_id || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.action || '').toLowerCase().includes(search.toLowerCase());

    const matchType = filterType === 'ALL' || log.target_type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111116] p-6 rounded-2xl border-2 border-slate-300 dark:border-white/[0.08] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-800 via-indigo-700 to-blue-700 text-white flex items-center justify-center shadow-md shadow-indigo-950/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Nhật Ký Thao Tác (Audit Log)
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Ghi vết chi tiết mọi hành vi chỉnh sửa, duyệt đơn, thay đổi cấu hình để đảm bảo an ninh vận hành.
            </p>
          </div>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-xs font-bold text-slate-800 dark:text-white transition-all cursor-pointer border border-slate-300 dark:border-white/10"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo người thực hiện, mã đơn, email hoặc hành động..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#111116] border-2 border-slate-300 dark:border-white/[0.08] text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-700 shadow-xs"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#111116] border-2 border-slate-300 dark:border-white/[0.08] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-700 shadow-xs"
        >
          <option value="ALL">Tất cả đối tượng</option>
          <option value="ORDER">Đơn hàng (ORDER)</option>
          <option value="SETTING">Cài đặt hệ thống (SETTING)</option>
          <option value="USER">Thành viên (USER)</option>
          <option value="POST">Bài viết (POST)</option>
          <option value="PRODUCT">Sản phẩm (PRODUCT)</option>
        </select>
      </div>

      {/* Table Logs */}
      <div className="bg-white dark:bg-[#111116] rounded-2xl border-2 border-slate-300 dark:border-white/[0.08] overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-700 dark:text-indigo-400 animate-spin" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Đang tải nhật ký bảo mật...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400 text-xs">
            Chưa có ghi nhận thao tác nào khớp với bộ lọc.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/[0.02] border-b-2 border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4">Người thực hiện</th>
                  <th className="py-3 px-4">Hành động</th>
                  <th className="py-3 px-4">Đối tượng</th>
                  <th className="py-3 px-4">Chi tiết thay đổi</th>
                  <th className="py-3 px-4 text-right">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/[0.06]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {new Date(log.created_at).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                        {log.user_name || 'Hệ thống'}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {log.user_email} · <span className="font-semibold text-indigo-600 dark:text-indigo-400">{log.user_role}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-semibold text-slate-800 dark:text-slate-200">
                      <span className="font-mono text-indigo-600 dark:text-cyan-400 font-bold">{log.target_type}</span>
                      {log.target_id && <span className="ml-1 text-slate-500 text-[11px]">({log.target_id})</span>}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600 dark:text-slate-300 font-mono text-[11px]" title={log.details || ''}>
                      {log.details || '—'}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap font-mono text-[10.5px] text-slate-400">
                      {log.ip_address || 'local'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

