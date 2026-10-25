'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import LeadMagnetModal from '@/components/LeadMagnetModal';
import Pagination from '@/components/ui/Pagination';
import { Layers, Sparkles, Filter, Search, Download, Cpu } from 'lucide-react';

interface ProductsCatalogClientProps {
  initialProducts: Product[];
  activeCategory: string;
}

export default function ProductsCatalogClient({ initialProducts, activeCategory }: ProductsCatalogClientProps) {
  const [products] = useState<Product[]>(initialProducts);
  const [selectedCat, setSelectedCat] = useState(activeCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<{ id: string; name: string; url?: string } | null>(null);

  const PAGE_SIZE = 8;

  const categories = [
    { key: 'all', label: 'Tất cả' },
    { key: 'free', label: 'Miễn Phí 0đ' },
    { key: 'workflow', label: 'Workflow n8n' },
    { key: 'skill', label: 'Skill AI' },
    { key: 'prompt', label: 'Prompt VIP' },
  ];

  // Filter & Sort: Ưu tiên hiển thị các sản phẩm 0Đ lên đầu
  const filtered = products
    .filter((p) => {
      if (selectedCat === 'free') {
        const matchSearch =
          searchQuery === '' ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return p.price === 0 && matchSearch;
      }
      const matchCat =
        selectedCat === 'all' || p.category?.toLowerCase().includes(selectedCat.toLowerCase());
      const matchSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      const isAFree = a.price === 0;
      const isBFree = b.price === 0;
      if (isAFree && !isBFree) return -1;
      if (!isAFree && isBFree) return 1;
      return (b.sales_count || 0) - (a.sales_count || 0);
    });

  const handleFreeClick = (prod: Product) => {
    setSelectedResource({
      id: prod.pid,
      name: prod.name,
      url: prod.download_url || undefined,
    });
    setLeadModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 transition-colors duration-200">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-500/25 text-xs font-mono font-bold">
          <Cpu className="w-3.5 h-3.5" />
          Hệ Thống Tự Động Hóa & Tài Liệu AI
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Kho Workflow, Kỹ Năng & Prompt Thực Chiến
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Tất cả sản phẩm đã được đóng gói chuẩn, tích hợp sẵn hướng dẫn cài đặt và hỗ trợ kích hoạt tự động qua VietQR.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-300 dark:border-white/15 shadow-md">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                setSelectedCat(c.key);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                selectedCat === c.key
                  ? 'bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 text-white shadow-md shadow-indigo-950/25 font-bold hover:opacity-85'
                  : 'text-slate-800 dark:text-slate-300 font-semibold border-2 border-slate-300 dark:border-white/10 hover:opacity-75 bg-slate-50 dark:bg-white/[0.04]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Tìm kiếm tài liệu..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border-2 border-slate-300 dark:border-white/[0.15] text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-700 transition-colors shadow-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Products Grid: 4 columns per row */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#111116] rounded-2xl border-2 border-slate-300 dark:border-white/10 space-y-3 shadow-md">
          <p className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Không tìm thấy sản phẩm nào phù hợp.</p>
          <button
            onClick={() => {
              setSelectedCat('all');
              setSearchQuery('');
              setCurrentPage(1);
            }}
            className="text-xs font-bold text-indigo-800 dark:text-indigo-400 hover:opacity-80 underline"
          >
            Xem lại tất cả sản phẩm
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered
              .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
              .map((prod) => (
                <ProductCard key={prod.id} product={prod} onFreeClick={handleFreeClick} />
              ))}
          </div>

          {/* Pagination */}
          {Math.ceil(filtered.length / PAGE_SIZE) > 1 && (
            <div className="pt-6 border-t border-slate-300 dark:border-white/[0.08]">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filtered.length / PAGE_SIZE)}
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
                itemName="sản phẩm"
                onPageChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 200, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Lead Magnet Modal */}
      <LeadMagnetModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        resourceId={selectedResource?.id || 'FREE-CATALOG'}
        resourceName={selectedResource?.name || 'Tài liệu Tự Học AI'}
        defaultDownloadUrl={selectedResource?.url}
      />
    </div>
  );
}
