import Link from 'next/link';
import { RefreshCcw, ArrowLeft, CheckCircle2, Headphones, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Chính Sách Hoàn Tiền & Cam Kết Hỗ Trợ - Tự Học AI (Nguyễn Đăng AI)',
  description: 'Chính sách hoàn tiền minh bạch, cam kết hỗ trợ kỹ thuật 1-1 và quyền lợi khách hàng tại Tự Học AI.',
};

export default function HoanTienPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </Link>

        {/* Header */}
        <div className="space-y-3 border-b border-slate-200 dark:border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-xs font-mono font-bold">
            <RefreshCcw className="w-3.5 h-3.5" />
            MINH BẠCH & AN TÂM MUA SẮM
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Chính Sách Hoàn Tiền & Hỗ Trợ Sử Dụng
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Cam kết bởi <strong>Nguyễn Đăng AI</strong> · Nền tảng Tự Học AI (tuhocai.top) · Cập nhật lần cuối: Tháng 11/2026
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Cam kết Hỗ trợ kỹ thuật 1-1</h2>
            <p>
              Tự Học AI hiểu rằng khi mới tiếp cận với công cụ tự động hóa n8n hoặc kỹ thuật ứng dụng AI, bạn có thể gặp bỡ ngỡ hoặc lỗi cấu hình môi trường. Vì vậy, <strong>mỗi đơn hàng bạn đặt mua đều đi kèm quyền lợi hỗ trợ kỹ thuật 1-1 trực tiếp từ Nguyễn Đăng AI và đội ngũ</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <Headphones className="w-4 h-4 text-emerald-500" />
                  Hỗ trợ qua Zalo VIP
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Giải đáp thắc mắc, gửi video hướng dẫn bổ sung hoặc Ultraview / AnyDesk hỗ trợ khi bạn gặp lỗi file.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <RefreshCcw className="w-4 h-4 text-indigo-500" />
                  Cập nhật phiên bản mới trọn đời
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Khi nền tảng bên thứ ba cập nhật API, file JSON workflow và prompt sẽ được cập nhật phiên bản vá lỗi miễn phí.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Điều kiện áp dụng hoàn tiền 100%</h2>
            <p>
              Do đặc thù các sản phẩm là tài nguyên số (Digital Products) có thể sao chép và tải về dùng ngay sau khi kích hoạt, chính sách hoàn tiền được áp dụng minh bạch trong các trường hợp sau:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Nội dung file bị lỗi hoặc không đúng mô tả:</strong> File JSON bị hỏng, video bài giảng không truy cập được hoặc tài nguyên thiếu hụt so với mô tả trên website mà đội ngũ hỗ trợ kỹ thuật không thể khắc phục được cho bạn trong vòng 48 giờ.
              </li>
              <li>
                <strong>Chuyển nhầm hoặc bị trừ tiền trùng lặp:</strong> Khách hàng vô tình quét mã VietQR 2 lần cho cùng một mã đơn hàng.
              </li>
              <li>
                <strong>Thời hạn yêu cầu:</strong> Trong vòng <strong>07 ngày</strong> kể từ thời điểm thanh toán đơn hàng thành công.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Các trường hợp không áp dụng hoàn tiền</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Khách hàng đổi ý sau khi đã tải trọn vẹn toàn bộ file mã nguồn và bộ prompt về máy tính cá nhân mà không có bất kỳ lỗi kỹ thuật nào từ phía Tự Học AI.
              </li>
              <li>
                Yêu cầu hoàn tiền vượt quá thời hạn 07 ngày kể từ khi đơn hàng kích hoạt thành công.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Quy trình nhận tiền hoàn lại</h2>
            <p>
              Để yêu cầu hoàn tiền, bạn chỉ cần liên hệ Zalo: <strong>0938.494.303</strong> hoặc gửi email tới: <a href="mailto:dang@tuhocai.top" className="text-indigo-600 dark:text-cyan-400 underline font-semibold">dang@tuhocai.top</a> kèm:
            </p>
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-mono space-y-1">
              <p>• Mã đơn hàng hoặc Số điện thoại/Email khi thanh toán</p>
              <p>• Số tài khoản ngân hàng nhận lại tiền hoàn</p>
              <p>• Mô tả ngắn gọn lý do khiếu nại</p>
            </div>
            <p>
              Số tiền sẽ được chuyển khoản trả lại tài khoản ngân hàng của bạn trong vòng <strong>24 giờ làm việc</strong> sau khi xác nhận.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

