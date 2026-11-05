'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  Play,
  CheckCircle2,
  Zap,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface WorkflowDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkflowDemoModal({ isOpen, onClose }: WorkflowDemoModalProps) {
  const [activeTab, setActiveTab] = useState<'canvas' | 'steps' | 'results'>('canvas');
  const [isPlayingSim, setIsPlayingSim] = useState(true);
  const [simStep, setSimStep] = useState(1);

  // Simulation steps animation
  useEffect(() => {
    if (!isOpen || !isPlayingSim) return;
    const interval = setInterval(() => {
      setSimStep((prev) => (prev >= 4 ? 1 : prev + 1));
    }, 2800);
    return () => clearInterval(interval);
  }, [isOpen, isPlayingSim]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border-2 border-indigo-500/40 shadow-2xl shadow-indigo-950/60 text-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  Demo Vận Hành Thực Tế: Workflow n8n Tự Động Đăng Bài
                </h3>
                <span className="hidden sm:inline-block text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Auto 24/7
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Xem cách hệ thống kích hoạt, AI tạo nội dung và tự động xuất bản lên đa kênh không cần can thiệp thủ công
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Đóng demo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-4 border-b border-white/10 bg-slate-900/40 text-xs">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`px-4 py-2.5 font-bold rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'canvas'
                ? 'border-cyan-400 text-cyan-300 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Sơ Đồ Canvas n8n Vận Hành
          </button>

          <button
            onClick={() => setActiveTab('steps')}
            className={`px-4 py-2.5 font-bold rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'steps'
                ? 'border-indigo-400 text-indigo-300 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            4 Bước Tự Động Hóa Chi Tiết
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2.5 font-bold rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'results'
                ? 'border-emerald-400 text-emerald-300 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Kết Quả Xuất Bản Thực Tế
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 flex-1">
          {activeTab === 'canvas' && (
            <div className="space-y-4">
              {/* Simulated Flow Player */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-500/30 bg-slate-950 aspect-video shadow-inner p-2 flex flex-col justify-between">
                {/* Canvas Background Image */}
                <Image
                  src="/images/n8n-workflow-demo.jpg"
                  alt="Sơ đồ n8n demo"
                  fill
                  className="object-cover opacity-70"
                />

                {/* Dark overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40 pointer-events-none" />

                {/* Top status bar */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-emerald-300 font-bold">N8N RUNNING</span>
                    <span className="text-slate-400">• Execution ID: #88921</span>
                  </div>

                  <button
                    onClick={() => setIsPlayingSim(!isPlayingSim)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-[11px] font-bold text-white transition cursor-pointer flex items-center gap-1"
                  >
                    {isPlayingSim ? 'Tạm dừng mô phỏng' : 'Tiếp tục mô phỏng'}
                  </button>
                </div>

                {/* Live simulation pulse indicators over nodes */}
                <div className="relative z-10 grid grid-cols-4 gap-2 sm:gap-4 my-auto px-2">
                  <div
                    className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-300 ${
                      simStep === 1
                        ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/30 scale-105'
                        : 'bg-black/50 border-white/10 opacity-70'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-cyan-300 font-bold">BƯỚC 1</div>
                    <div className="text-xs font-bold text-white truncate">⏰ Lên lịch Trigger</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Tự động kích hoạt</div>
                  </div>

                  <div
                    className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-300 ${
                      simStep === 2
                        ? 'bg-purple-500/20 border-purple-400 shadow-lg shadow-purple-500/30 scale-105'
                        : 'bg-black/50 border-white/10 opacity-70'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-purple-300 font-bold">BƯỚC 2</div>
                    <div className="text-xs font-bold text-white truncate">🤖 GPT-4o Biên tập</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Viết bài chuẩn SEO</div>
                  </div>

                  <div
                    className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-300 ${
                      simStep === 3
                        ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/30 scale-105'
                        : 'bg-black/50 border-white/10 opacity-70'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-amber-300 font-bold">BƯỚC 3</div>
                    <div className="text-xs font-bold text-white truncate">🎨 Xử lý Media</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Tạo ảnh bìa tự động</div>
                  </div>

                  <div
                    className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-300 ${
                      simStep === 4
                        ? 'bg-emerald-500/20 border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105'
                        : 'bg-black/50 border-white/10 opacity-70'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-emerald-300 font-bold">BƯỚC 4</div>
                    <div className="text-xs font-bold text-white truncate">🚀 Bắn bài đa kênh</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">FB, Telegram, Blog</div>
                  </div>
                </div>

                {/* Bottom terminal logs simulation */}
                <div className="relative z-10 p-2 sm:p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 font-mono text-[11px] text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Nhật ký thực thi n8n (Live Logs):</span>
                  </div>
                  <div className="text-slate-400 truncate">
                    {simStep === 1 && '▶ [09:00:00] [Schedule Trigger] Đã kích hoạt kịch bản theo lịch trình hàng ngày...'}
                    {simStep === 2 && '▶ [09:00:02] [OpenAI Node] Gửi prompt tạo bài viết, nhận phản hồi 1,200 từ hoàn chỉnh...'}
                    {simStep === 3 && '▶ [09:00:05] [Image Node] Đã chuẩn hóa kích thước 1200x630 chuẩn hiển thị Facebook & Web...'}
                    {simStep === 4 && '▶ [09:00:08] [Multi-Channel] HTTP 200 OK: Xuất bản thành công lên Facebook Fanpage & Telegram!'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
                  01
                </div>
                <h4 className="font-bold text-sm text-white">Import File JSON Trong 30 Giây</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Bạn tải file JSON đính kèm từ Tự Học AI về máy, mở n8n bấm &quot;Import from file&quot; là toàn bộ node và logic
                  tự động xếp đặt hoàn chỉnh.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 font-mono font-bold flex items-center justify-center text-xs">
                  02
                </div>
                <h4 className="font-bold text-sm text-white">Điền API Key OpenAI & Kênh Đích</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Điền API Key của OpenAI hoặc Gemini, nhập Token Telegram hoặc Facebook Page Access Token theo video
                  hướng dẫn từng cú click chuột.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-xs">
                  03
                </div>
                <h4 className="font-bold text-sm text-white">Lên Lịch Tự Động Theo Giờ</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Thiết lập giờ đăng: ví dụ 8h sáng, 14h chiều hoặc 20h tối. n8n tự động chạy nền trên máy hoặc VPS mà
                  không cần bạn ngồi canh máy.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs">
                  04
                </div>
                <h4 className="font-bold text-sm text-white">Bắn Bài Đa Kênh Tức Thì</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Bài viết mới, hình ảnh và hashtag tự động xuất hiện đồng thời trên Fanpage, Kênh Telegram thông báo và
                  Website chuẩn SEO.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Hiệu Quả Thực Tế Đã Kiểm Chứng:</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong>Tiết kiệm 80% thời gian:</strong> Không còn phải ngồi viết từng bài, copy dán qua lại giữa 3-4 nền tảng mỗi ngày.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong>Duy trì tần suất đăng bài đều đặn:</strong> Kênh của bạn luôn có bài viết mới kể cả khi bạn đang đi ngủ hay du lịch.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong>Hỗ trợ kỹ thuật 1-1:</strong> Nếu gặp bất kỳ khó khăn nào khi import, anh Đăng hỗ trợ trực tiếp qua Zalo cho đến khi workflow chạy thành công.</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer with Direct Purchase CTA */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">99.000 đ</span>
            <span className="text-sm text-slate-400 line-through font-mono">299.000 đ</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Tiết kiệm 200.000 đ (Ưu đãi hôm nay)
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/thanh-toan?pid=WF-THAI-099"
              onClick={onClose}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              Mua Ngay Với VietQR (99.000 đ)
            </Link>

            <Link
              href="/san-pham/workflow-n8n-tu-dong-dang-bai-da-kenh"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/10 cursor-pointer"
            >
              Xem chi tiết <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
