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
      free_resource_title: s.free_resource_title || 'Trọn Bộ 100+ Prompt FLUX & Kịch Bản Video AI Triệu View',
      free_resource_desc: s.free_resource_desc || 'Nhập email để nhận ngay file template và tài liệu hướng dẫn vào tài khoản của bạn.',
      free_resource_download_url: s.free_resource_download_url || 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing',
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
