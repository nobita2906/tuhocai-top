import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/settings';

export async function GET() {
  try {
    const s = await getSiteSettings();
    return NextResponse.json({
      bank_id: s.bank_id || 'ACB',
      account_no: s.account_no || '4747827',
      account_name: s.account_name || 'NGUYEN VAN DANG',
      banner_enabled: Boolean(s.banner_enabled),
      banner_text: s.banner_text || '',
      banner_url: s.banner_url || '/san-pham',
      hotline: s.hotline || '0938.494.303',
      zalo_group_url: s.zalo_group_url || 'https://zalo.me/g/tuhocai',
      zalo_support_phone: s.zalo_support_phone || '0938.494.303',
      support_email: s.support_email || 'dang@tuhocai.top',

      // Quà tặng chung & 3 quyền lợi
      free_gift_badge: s.free_gift_badge || 'QUÀ TẶNG 0Đ DÀNH CHO BẠN',
      free_resource_title: s.free_resource_title || 'Lộ trình 7 ngày làm quen AI cho người mới (0đ)',
      free_resource_desc: s.free_resource_desc || 'Cẩm nang từng bước giúp bạn hiểu bản chất AI, cách đặt câu hỏi chuẩn để có kết quả ngay mà không cần biết kỹ thuật.',
      free_resource_download_url: s.free_resource_download_url || 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing',
      free_gift_benefit_1: s.free_gift_benefit_1 || 'Bộ tài liệu & Prompt mẫu đã được kiểm thử thực tế.',
      free_gift_benefit_2: s.free_gift_benefit_2 || 'Hướng dẫn chi tiết từng bước, người mới hoàn toàn có thể làm theo.',
      free_gift_benefit_3: s.free_gift_benefit_3 || 'Tham gia nhóm Zalo hỏi đáp trực tiếp cùng Nguyễn Đăng AI.',

      // Quà tặng Nhánh Người Mới
      free_gift_beginner_title: s.free_gift_beginner_title || 'Lộ trình 7 ngày làm quen AI cho người mới (0đ)',
      free_gift_beginner_desc: s.free_gift_beginner_desc || 'Cẩm nang từng bước giúp bạn hiểu bản chất AI, cách đặt câu hỏi chuẩn để có kết quả ngay mà không cần biết kỹ thuật.',
      free_gift_beginner_url: s.free_gift_beginner_url || s.free_resource_download_url || 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing',
      free_gift_beginner_cta: s.free_gift_beginner_cta || 'Nhận Lộ Trình Cho Người Mới',

      // Quà tặng Nhánh Văn Phòng
      free_gift_office_title: s.free_gift_office_title || '15 Prompt Văn Phòng Khởi Động (Bản Rút Gọn 0đ)',
      free_gift_office_desc: s.free_gift_office_desc || 'Gồm 15 prompt cơ bản giúp bạn thử nghiệm soạn thảo email, xử lý bảng biểu và tóm tắt cuộc họp. (Bản Full 50+ prompt nâng cao có phí 69k bên dưới).',
      free_gift_office_url: s.free_gift_office_url || s.free_resource_download_url || 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing',
      free_gift_office_cta: s.free_gift_office_cta || 'Nhận Bản Rút Gọn 0đ',

      // Quà tặng Nhánh Creator
      free_gift_creator_title: s.free_gift_creator_title || 'Túi quà 30 Prompt FLUX & Kịch bản mẫu (Bản Khởi Động 0đ)',
      free_gift_creator_desc: s.free_gift_creator_desc || 'Kho 30 prompt tạo ảnh chân dung thương mại và mẫu kịch bản phân cảnh 3s đầu cho video TikTok & Reels.',
      free_gift_creator_url: s.free_gift_creator_url || s.free_resource_download_url || 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing',
      free_gift_creator_cta: s.free_gift_creator_cta || 'Nhận Túi Quà Creator',
    });
  } catch (error) {
    return NextResponse.json({
      bank_id: 'ACB',
      account_no: '4747827',
      account_name: 'NGUYEN VAN DANG',
      banner_enabled: false,
      banner_text: '',
      banner_url: '/san-pham',
      hotline: '0938.494.303',
      zalo_group_url: 'https://zalo.me/g/tuhocai',
      zalo_support_phone: '0938.494.303',
      support_email: 'dang@tuhocai.top',
      free_resource_title: 'Trọn Bộ 100+ Prompt FLUX & Kịch Bản Video AI Triệu View',
      free_resource_desc: 'Nhập email để nhận ngay file template và tài liệu hướng dẫn vào tài khoản của bạn.',
      free_resource_download_url: 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing',
    });
  }
}
