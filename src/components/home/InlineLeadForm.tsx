'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, CheckCircle2, MessageCircle, ArrowRight, Loader2, ShieldCheck, Sparkles, Gift } from 'lucide-react';

interface InlineLeadFormProps {
  initialResource?: {
    id: string;
    name: string;
    giftDesc?: string;
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

  const resourceTitle = initialResource?.name || 'Trọn Bộ 100+ Prompt FLUX & Kịch Bản Video AI Ngắn';
  const resourceId = initialResource?.id || 'FREE-BUNDLE-2026';

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
    <section id="nhan-qua-0d" className="py-8 sm:py-14">
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
                  QUÀ TẶNG 0Đ DÀNH RIÊNG CHO BẠN
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                    {resourceTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {initialResource?.giftDesc || 'Tài liệu được đúc kết từ quá trình thực chiến tự học và ứng dụng AI hàng ngày của Nguyễn Đăng AI. Tải về dùng ngay, hoàn toàn miễn phí.'}
                  </p>
                </div>

                {/* 3 gạch đầu dòng quyền lợi theo Blueprint */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>File JSON workflow &amp; Prompt mẫu đã được kiểm thử thực tế.</span>
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
                    <label className="block text-xs font-mono font-bold text-slate-300 uppercase flex items-center justify-between">
                      <span>Số điện thoại / Zalo</span>
                      <span className="text-[10px] text-slate-400 lowercase font-normal">(không bắt buộc)</span>
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
                    <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-90 text-slate-950 shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang chuẩn bị quà tặng...</span>
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
            /* Màn hình Chúc Mừng Sau Khi Nhận Quà Thành Công */
            <div className="relative z-10 text-center py-6 sm:py-10 max-w-xl mx-auto space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Quà Tặng Của Bạn Đã Sẵn Sàng!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Cảm ơn bạn đã kết nối cùng Nguyễn Đăng AI. Link tải toàn bộ tài nguyên đã được kích hoạt ngay dưới đây:
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-black text-sm bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-lg hover:opacity-90 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Mở Thư Mục Tải Về Ngay</span>
                </a>

                <a
                  href={zaloGroup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Vào Group Zalo Hỗ Trợ</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
