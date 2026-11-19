'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'Tôi chưa biết gì về AI hoặc không biết lập trình có dùng được không?',
    a: 'Hoàn toàn dùng được! Toàn bộ tài liệu, template và workflow được Nguyễn Đăng AI đóng gói theo tiêu chí "No-Code" – dành cho người mới và dân văn phòng. Bạn chỉ cần làm theo video hướng dẫn từng bước: import file JSON hoặc copy prompt là có thể chạy ngay mà không cần viết bất kỳ dòng mã nào.',
  },
  {
    q: 'Tôi cần chuẩn bị công cụ hoặc chi phí gì thêm (n8n, VPS, gói AI trả phí)?',
    a: 'Bạn có thể bắt đầu hoàn toàn miễn phí. n8n có thể tự chạy trên máy tính cá nhân (Desktop App hoặc Docker miễn phí 100%) hoặc thuê VPS giá rẻ (khoảng 50.000đ - 100.000đ/tháng nếu muốn chạy 24/7). Đối với AI, bạn có thể dùng tài khoản ChatGPT, Claude hoặc Gemini bản miễn phí để thực hành trước khi cân nhắc nâng cấp.',
  },
  {
    q: 'Sau khi thanh toán tôi sẽ nhận sản phẩm như thế nào và bao lâu?',
    a: 'Sau khi chuyển khoản quét mã VietQR thành công, hệ thống sẽ tự động kích hoạt trong 30 giây. Link Google Drive chứa toàn bộ video bài giảng, file template, file JSON workflow và prompt sẽ hiển thị trực tiếp trên màn hình, đồng thời được gửi về email của bạn để lưu trữ vĩnh viễn.',
  },
  {
    q: 'Chính sách "Cập nhật trọn đời" được thực hiện như thế nào?',
    a: 'Công nghệ AI thay đổi rất nhanh. Bất cứ khi nào các nền tảng (n8n, Midjourney, Claude, FLUX) có bản cập nhật mới làm thay đổi quy trình, Nguyễn Đăng AI sẽ cập nhật lại file JSON workflow và bổ sung video hướng dẫn mới vào thư mục Drive dùng chung. Bạn chỉ cần truy cập lại link đã nhận để tải bản mới nhất mà không phải trả thêm bất kỳ chi phí nào.',
  },
  {
    q: 'Nếu tôi gặp lỗi hoặc bị kẹt trong quá trình cài đặt thì có ai hỗ trợ không?',
    a: 'Có! Khi sở hữu sản phẩm, bạn sẽ nhận được link tham gia nhóm Zalo VIP độc quyền dành riêng cho học viên. Tại đây, Nguyễn Đăng AI và đội ngũ hỗ trợ kỹ thuật sẽ trực tiếp giải đáp thắc mắc, kiểm tra lỗi workflow và đồng hành cùng bạn cho đến khi hệ thống vận hành trơn tru.',
  },
  {
    q: 'Nếu tôi cảm thấy không phù hợp thì có được hoàn tiền không?',
    a: 'Tự Học AI có chính sách "Bảo hành hài lòng 100% trong 7 ngày". Nếu bạn đã làm theo hướng dẫn mà không thể vận hành được workflow, hoặc thấy nội dung không đúng như mô tả, bạn chỉ cần nhắn tin qua Zalo hỗ trợ. Chúng tôi sẽ hoàn lại 100% số tiền bạn đã thanh toán trong vòng 24 giờ làm việc.',
  },
];

export default function HomeFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-8 sm:py-14 border-t border-slate-200 dark:border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-cyan-400 border border-indigo-500/20 text-xs font-mono font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            GIẢI ĐÁP THẮC MẮC
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Câu Hỏi Thường Gặp
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Những băn khoăn phổ biến nhất của các bạn khi mới bắt đầu tìm hiểu và áp dụng AI.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#111116] overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer gap-4"
                >
                  <span className="flex-1">{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-indigo-600 dark:text-cyan-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

