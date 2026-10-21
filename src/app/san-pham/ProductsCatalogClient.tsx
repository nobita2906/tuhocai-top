'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import LeadMagnetModal from '@/components/LeadMagnetModal';
import { Layers, Sparkles, Filter, Search, Download } from 'lucide-react';

interface ProductsCatalogClientProps {
  initialProducts: Product[];
  activeCategory: string;
}

export default function ProductsCatalogClient({ initialProducts, activeCategory }: ProductsCatalogClientProps) {
  const [products] = useState<Product[]>(initialProducts);
  const [selectedCat, setSelectedCat] = useState(activeCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<{ id: string; name: string; url?: string } | null>(null);

  const categories = [
    { key: 'all', label: 'Tất cả' },
    { key: 'workflow', label: 'Workflow n8n' },
    { key: 'skill', label: 'Skill AI' },
    { key: 'prompt', label: 'Prompt VIP' },
  ];

  const filtered = products.filter((p) => {
    const matchCat =
      selectedCat === 'all' || p.category?.toLowerCase().includes(selectedCat.toLowerCase());
    const matchSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Hệ Thống Tự Động Hóa & Tài Liệu AI
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Kho Workflow, Kỹ Năng & Prompt Thực Chiến
        </h1>
        <p className="text-sm text-slate-400">
          Tất cả sản phẩm đã được đóng gói chuẩn, tích hợp sẵn hướng dẫn cài đặt và hỗ trợ kích hoạt tự động qua VietQR.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCat(c.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCat === c.key
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm workflow, prompt..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prod) => (
          <ProductCard key={prod.id} product={prod} onFreeClick={handleFreeClick} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Không tìm thấy sản phẩm phù hợp</h3>
          <p className="text-xs text-slate-500">Hãy thử đổi từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
        </div>
      )}

      {/* Free modal */}
      <LeadMagnetModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        resourceId={selectedResource?.id}
        resourceName={selectedResource?.name}
        defaultDownloadUrl={selectedResource?.url}
      />
    </div>
  );
}
