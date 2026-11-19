'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, CheckCircle2, MessageCircle, ArrowRight, Loader2, ShieldCheck, Sparkles, Gift } from 'lucide-react';

interface InlineLeadFormProps {
  initialResource?: {
    id: string;
    name: string;
    giftDesc?: string;
    branchId?: string;
  };
}

export default function InlineLeadForm({ initialResource }: InlineLeadFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [zaloGroup, setZaloGroup] = useState('https://zalo.me/g/qnitrawpaxpvl6aj7ixb');

  // Dynamic gift title & description based on user branch selection
  const resourceTitle = initialResource?.name || 'Trọn Bộ Tài Liệu Tự Học AI & Prompt Thực Chiến (0đ)';
  const resourceId = initialResource?.id || 'FREE-ALL-2026';
  const resourceDesc =
    initialResource?.giftDesc ||
    'Bộ tài nguyên và quy trình mẫu được đúc kết từ quá trình thực chiến tự học và ứng dụng AI hàng ngày của Nguyễn Đăng AI. Tải về dùng ngay, hoàn toàn miễn phí.';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ để nhận link tải tài liệu.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Bạn mới Tự Học AI',
          email: email.trim().toLowerCase(),
          phone: phone.trim() || '',
          resource_id: resourceId,
          resource_name: resourceTitle,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra, vui lòng thử lại');
      }

      setDownloadUrl(data.download_url || 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing');
      if (data.zalo_group) setZaloGroup(data.zalo_group);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Không thể gửi form. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="nhan-qua-0d" className="py-8 sm:py-14 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-[#0c1022] border-2 border-indigo-500/40 p-6 sm:p-10 lg:p-12 shadow-2xl text-white">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          {!submitted ? (
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Cột trái: Mockup & Quyền lợi quà tặng */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                  <Gift className="w-3.5 h-3.5 text-emerald-300" />
                  QUÀ TẶNG 0Đ DÀNH CHO BẠN
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                    {resourceTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {resourceDesc}
                  </p>
                </div>

                {/* 3 gạch đầu dòng quyền lợi theo Blueprint */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Bộ tài liệu &amp; Prompt mẫu đã được kiểm thử thực tế.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Hướng dẫn chi tiết từng bước, người mới hoàn toàn có thể làm theo.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Tham gia nhóm Zalo hỏi đáp trực tiếp cùng Nguyễn Đăng AI.</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Cam kết không spam · Hủy đăng ký bất cứ lúc nào</span>
                </div>
              </div>

              {/* Cột phải: Form thu email trực tiếp */}
              <div className="lg:col-span-5 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-bold text-slate-300 uppercase">
                      Họ và tên của bạn
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-bold text-slate-300 uppercase">
                      Địa chỉ Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@gmail.com (để nhận link tải)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-bold text-slate-400 uppercase">
                      Số điện thoại / Zalo <span className="text-slate-500 font-normal lowercase">(không bắt buộc)</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  {error && (
                    <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-emerald-950/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Gửi Quà Cho Tôi Ngay (0đ)</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Màn hình Cảm ơn sau khi gửi Form thành công */
            <div className="relative z-10 text-center max-w-xl mx-auto space-y-5 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Đã Kích Hoạt Quà Tặng 0đ!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Cảm ơn <strong>{name || 'bạn'}</strong>. Link tải bộ tài liệu <strong>{resourceTitle}</strong> đã được gửi tới email <span className="text-cyan-400 underline font-mono">{email}</span>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 shadow-xl transition-all"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Mở Thư Mục Google Drive</span>
                </a>

                <a
                  href={zaloGroup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Vào Nhóm Zalo Nhận Hỗ Trợ</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
