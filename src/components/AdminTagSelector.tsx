'use client';

import { useState } from 'react';
import { Tag, Plus, X, Sparkles } from 'lucide-react';
import { PRESET_TAG_GROUPS } from '@/lib/postTaxonomy';

interface AdminTagSelectorProps {
  tagsString: string;
  onChange: (newTagsString: string) => void;
}

export default function AdminTagSelector({ tagsString, onChange }: AdminTagSelectorProps) {
  const [customTag, setCustomTag] = useState('');

  // Tách tags hiện tại thành mảng
  const selectedTags = tagsString
    ? tagsString
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const handleToggleTag = (tagToToggle: string) => {
    const exists = selectedTags.some((t) => t.toLowerCase() === tagToToggle.toLowerCase());
    let updated: string[];
    if (exists) {
      updated = selectedTags.filter((t) => t.toLowerCase() !== tagToToggle.toLowerCase());
    } else {
      updated = [...selectedTags, tagToToggle];
    }
    onChange(updated.join(', '));
  };

  const handleAddCustomTag = () => {
    if (!customTag.trim()) return;
    const clean = customTag.trim();
    if (!selectedTags.some((t) => t.toLowerCase() === clean.toLowerCase())) {
      const updated = [...selectedTags, clean];
      onChange(updated.join(', '));
    }
    setCustomTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = selectedTags.filter((t) => t !== tagToRemove);
    onChange(updated.join(', '));
  };

  return (
    <div className="space-y-3">
      {/* Danh sách Tags đã chọn */}
      <div className="min-h-[42px] p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-wrap items-center gap-1.5">
        {selectedTags.length === 0 ? (
          <span className="text-xs text-slate-500 italic pl-1">Chưa chọn thẻ tag nào...</span>
        ) : (
          selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-xs"
            >
              <span>#{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-rose-400 p-0.5 rounded-full transition-colors cursor-pointer"
                title="Xóa tag"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        )}
      </div>

      {/* Ô gõ tag thủ công */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomTag();
              }
            }}
            placeholder="Gõ tag mới rồi nhấn Enter hoặc Thêm..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
        <button
          type="button"
          onClick={handleAddCustomTag}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          <span>Thêm</span>
        </button>
      </div>

      {/* Gợi ý Preset Tags chuẩn hóa theo Nhóm */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <div className="text-[11px] font-mono text-slate-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Thẻ tag chuẩn hóa theo nhóm (Bấm để chọn nhanh):</span>
        </div>

        {PRESET_TAG_GROUPS.map((group) => (
          <div key={group.groupName} className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">
              {group.groupName}:
            </span>
            <div className="flex flex-wrap gap-1">
              {group.tags.map((tag) => {
                const isSelected = selectedTags.some((t) => t.toLowerCase() === tag.toLowerCase());
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold border border-indigo-400 shadow-xs'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80 border border-slate-700/50'
                    }`}
                  >
                    {isSelected ? `✓ #${tag}` : `+ #${tag}`}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

