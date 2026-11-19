'use client';

import { useState } from 'react';
import { Gift, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function FinalCtaSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Bạn Tự Học AI',
          email: email.trim().toLowerCase(),
          resource_id: 'FREE-BUNDLE-FINAL',
          resource_name: 'Bộ Tài Liệu & Prompt Thực Chiến 0đ (Nguyễn Đăng AI)',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Có lỗi xảy ra');

      setDownloadUrl(data.download_url || 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing');
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Không thể đăng ký. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-10 sm:py-16 border-t border-slate-200 dark:border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/30 p-8 sm:p-12 text-center text-white shadow-2xl">
          {/* Ambient light */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
              <Gift className="w-3.5 h-3.5 text-emerald-300" />
              BƯỚC ĐẦU TIÊN HOÀN TOÀN MIỄN PHÍ
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Chưa Chắc Nên Bắt Đầu Từ Đâu?
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Nhận ngay bộ quà tặng 0đ (100+ prompt và quy trình mẫu). Nguyễn Đăng AI sẽ gửi link tải trực tiếp và hướng dẫn bạn bước tiếp theo qua email.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="pt-2 max-w-md mx-auto space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Nhập email của bạn để nhận quà..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-lg transition-all shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Nhận Quà 0đ</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {error && <p className="text-xs text-rose-400">{error}</p>}

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% miễn phí • Không spam • Hủy nhận thư bất cứ lúc nào.</span>
                </div>
              </form>
            ) : (
              <div className="pt-2 p-5 rounded-2xl bg-white/10 border border-white/20 space-y-3">
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Đã gửi link quà tặng về email {email}!</span>
                </div>
                <p className="text-xs text-slate-300">
                  Bạn cũng có thể bấm nút bên dưới để mở ngay thư mục Google Drive:
                </p>
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-colors"
                >
                  <span>Mở Google Drive Nhận Quà Ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

