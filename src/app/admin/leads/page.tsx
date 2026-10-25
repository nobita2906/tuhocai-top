'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Download,
  Mail,
  Phone,
  Calendar,
  Loader2,
  FileSpreadsheet,
} from 'lucide-react';
import Pagination from '@/components/ui/Pagination';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 15;

  const loadLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/leads');
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const filteredLeads = leads.filter((l) => {
    const q = search.toLowerCase();
    return (
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.phone && l.phone.includes(q))
    );
  });

  const exportCSV = () => {
    if (leads.length === 0) return;

    const headers = ['ID', 'Họ tên', 'Email', 'Số điện thoại', 'Ghi chú / Nguồn', 'Ngày đăng ký'];
    const rows = leads.map((l) => [
      l.id,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.note || '').replace(/"/g, '""')}"`,
      `"${l.created_at ? new Date(l.created_at).toLocaleString('vi-VN') : ''}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_tuhocai_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-700 dark:text-indigo-400" />
            Khách hàng tiềm năng (Leads 0đ)
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Danh sách email và số điện thoại đăng ký nhận tài liệu miễn phí</p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          disabled={leads.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:opacity-85 text-slate-900 dark:text-white font-bold text-xs border-2 border-slate-300 dark:border-slate-700 shadow-sm transition-all disabled:opacity-50 active:scale-95"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          Xuất file Excel CSV
        </button>
      </div>

      {/* Search and Summary */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border-2 border-slate-300 dark:border-slate-800 shadow-md flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo tên, email hoặc số điện thoại..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-700 text-xs shadow-xs"
          />
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
          Tìm thấy <strong className="text-indigo-800 dark:text-indigo-400 font-bold">{filteredLeads.length}</strong> / {leads.length} leads
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900/60 border-2 border-slate-300 dark:border-slate-800 shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-500 dark:text-slate-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-700 dark:text-indigo-400" />
            <span className="font-semibold">Đang tải danh sách leads...</span>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center p-12 text-slate-500 dark:text-slate-400">
            <Mail className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="font-semibold">Không có lead nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950/60 border-b-2 border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-mono font-bold uppercase">
                <tr>
                  <th className="px-5 py-3.5">Họ tên</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Số điện thoại</th>
                  <th className="px-5 py-3.5">Ghi chú / Nhu cầu</th>
                  <th className="px-5 py-3.5">Thời gian nhận</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {filteredLeads
                  .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
                  .map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                        {l.name || 'Khách vãng lai'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-indigo-800 dark:text-indigo-400 font-mono text-xs font-semibold">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {l.email}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {l.phone ? (
                          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-300 font-mono text-xs font-semibold">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {l.phone}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Không có</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate font-medium">
                        {l.note || 'Đăng ký tải bộ Ebook AI Prompt'}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {l.created_at ? new Date(l.created_at).toLocaleString('vi-VN') : '—'}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {Math.ceil(filteredLeads.length / PAGE_SIZE) > 1 && (
          <div className="p-4 border-t-2 border-slate-200 dark:border-slate-800">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filteredLeads.length / PAGE_SIZE)}
              totalItems={filteredLeads.length}
              pageSize={PAGE_SIZE}
              itemName="leads"
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
