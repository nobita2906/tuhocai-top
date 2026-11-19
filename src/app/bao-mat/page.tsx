import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, Database } from 'lucide-react';

export const metadata = {
  title: 'Chính Sách Bảo Mật Thông Tin - Tự Học AI (Nguyễn Đăng AI)',
  description: 'Cam kết bảo mật dữ liệu khách hàng, thông tin thanh toán và quyền riêng tư tại Tự Học AI.',
};

export default function BaoMatPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            BẢO MẬT DỮ LIỆU & QUYỀN RIÊNG TƯ
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Chính Sách Bảo Mật Thông Tin
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Cam kết bởi <strong>Nguyễn Đăng AI</strong> · Nền tảng Tự Học AI (tuhocai.top) · Cập nhật lần cuối: Tháng 11/2026
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Mục đích thu thập thông tin</h2>
            <p>
              Tự Học AI tôn trọng và cam kết bảo vệ quyền riêng tư tuyệt đối của bạn. Khi bạn đăng ký nhận tài liệu 0đ hoặc đặt mua sản phẩm, chúng tôi chỉ thu thập các trường thông tin tối thiểu cần thiết:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Họ và tên:</strong> Để hiển thị tài khoản và định danh khi hỗ trợ kỹ thuật 1-1.</li>
              <li><strong>Địa chỉ Email:</strong> Để gửi thông báo kích hoạt, link tải mã nguồn và cập nhật phiên bản mới.</li>
              <li><strong>Số điện thoại / Zalo:</strong> Để liên hệ hỗ trợ trực tiếp khi bạn gặp khó khăn trong quá trình sử dụng sản phẩm hoặc đối soát đơn hàng.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Bảo mật thông tin thanh toán VietQR</h2>
            <p>
              Hệ thống thanh toán tại Tự Học AI sử dụng giải pháp quét mã chuyển khoản ngân hàng <strong>VietQR</strong> thông qua cổng đối soát tự động bảo mật. Chúng tôi <strong>tuyệt đối không lưu giữ mật khẩu ngân hàng, mã OTP hay thông tin thẻ tín dụng</strong> của bạn. Mọi giao dịch chuyển khoản đều do chính bạn chủ động thực hiện trực tiếp trong ứng dụng ngân hàng của bạn.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Cam kết KHÔNG bán hoặc chia sẻ dữ liệu</h2>
            <p>
              Nguyễn Đăng AI và Tự Học AI cam kết <strong>100% KHÔNG bao giờ bán, cho thuê, thương mại hóa hoặc chia sẻ thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào</strong> vì mục đích quảng cáo hoặc spam. Thông tin của bạn chỉ được dùng nội bộ để chăm sóc và nâng cao trải nghiệm học tập, ứng dụng AI của bạn.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Quyền kiểm soát dữ liệu của bạn</h2>
            <p>
              Bạn có toàn quyền yêu cầu kiểm tra, cập nhật hoặc xóa vĩnh viễn thông tin cá nhân khỏi cơ sở dữ liệu của Tự Học AI bất cứ lúc nào bằng cách gửi email về: <a href="mailto:dang@tuhocai.top" className="text-indigo-600 dark:text-cyan-400 underline font-semibold">dang@tuhocai.top</a> hoặc nhắn Zalo: <strong>0938.494.303</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

