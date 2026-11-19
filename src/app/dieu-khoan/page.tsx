import Link from 'next/link';
import { Shield, ArrowLeft, CheckCircle2, FileText } from 'lucide-react';

export const metadata = {
  title: 'Điều Khoản Sử Dụng - Tự Học AI (Nguyễn Đăng AI)',
  description: 'Quy định và điều khoản sử dụng tài nguyên số, khóa học và dịch vụ tự động hóa tại Tự Học AI.',
};

export default function DieuKhoanPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-cyan-400 text-xs font-mono font-bold">
            <FileText className="w-3.5 h-3.5" />
            VĂN BẢN QUY PHẠM NỀN TẢNG
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Điều Khoản Sử Dụng Dịch Vụ
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Nền tảng Tự Học AI · Đại diện bởi: <strong>Nguyễn Đăng AI</strong> · Cập nhật lần cuối: Tháng 11/2026
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Giới thiệu và Phạm vi áp dụng</h2>
            <p>
              Chào mừng bạn đến với <strong>Tự Học AI</strong> (website: <Link href="/" className="text-indigo-600 dark:text-cyan-400 underline">tuhocai.top</Link>), được sáng lập và vận hành bởi <strong>Nguyễn Đăng AI</strong>. Khi bạn truy cập, đăng ký tài khoản, tải tài liệu miễn phí hoặc thanh toán mua các gói sản phẩm số (mã nguồn n8n workflow, bộ prompt, khóa học video, template), bạn xác nhận đã đọc, hiểu và đồng ý tuân thủ toàn bộ các điều khoản được quy định dưới đây.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Quyền sở hữu trí tuệ và Giấy phép sử dụng</h2>
            <p>
              Toàn bộ bài giảng, tài liệu hướng dẫn, file mã nguồn mẫu và bộ prompt được phát hành trên Tự Học AI là tài sản trí tuệ thuộc quyền sở hữu của Nguyễn Đăng AI hoặc được phân phối hợp pháp theo giấy phép mã nguồn mở liên quan.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Quyền của bạn:</strong> Bạn được cấp quyền sử dụng cá nhân hoặc thương mại hóa bên trong doanh nghiệp/dự án của riêng bạn (ví dụ: dùng workflow để đăng bài cho fanpage của bạn, dùng prompt tạo ảnh bán hàng).
              </li>
              <li>
                <strong>Hạn chế nghiêm ngặt:</strong> Bạn <strong>KHÔNG</strong> được phép sao chép nguyên trạng, đóng gói lại để bán lại (resell), phân phối công khai miễn phí hoặc chia sẻ trái phép các file tài nguyên, video bài giảng độc quyền cho bên thứ ba dưới bất kỳ hình thức nào khi chưa có sự đồng ý bằng văn bản của Nguyễn Đăng AI.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Bản chất sản phẩm số và Kích hoạt tự động</h2>
            <p>
              Các sản phẩm trên Tự Học AI là <strong>sản phẩm số (Digital Goods)</strong> được bàn giao tức thì. Sau khi thanh toán quét mã VietQR thành công, hệ thống tự động đối soát trong vòng 30 - 60 giây và mở khóa quyền truy cập vào mục "Kho Của Tôi", đồng thời gửi email thông báo kèm đường link tải tài nguyên đến địa chỉ email bạn đã đăng ký.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Trách nhiệm người dùng</h2>
            <p>
              Người dùng có trách nhiệm cung cấp thông tin liên hệ chính xác (Email, Số điện thoại/Zalo) để nhận bàn giao sản phẩm và được hỗ trợ kỹ thuật khi cần. Bạn chịu trách nhiệm tự bảo mật tài khoản cá nhân và tuân thủ các quy định của bên thứ ba (như chính sách của OpenAI, Anthropic, n8n, Meta) khi ứng dụng công nghệ AI vào hoạt động kinh doanh.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Hỗ trợ và Giải quyết khiếu nại</h2>
            <p>
              Nếu gặp bất kỳ khó khăn nào trong quá trình nhập file, cài đặt workflow hoặc học tập, bạn sẽ nhận được sự hỗ trợ trực tiếp 1-1 từ đội ngũ kỹ thuật qua kênh Zalo VIP: <a href="https://zalo.me/g/qnitrawpaxpvl6aj7ixb" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-cyan-400 underline font-semibold">Nhóm Zalo Cộng Đồng Tự Học AI</a> hoặc Hotline/Zalo: <strong>0938.494.303</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

