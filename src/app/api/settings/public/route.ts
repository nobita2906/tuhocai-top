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
      hotline: s.hotline || '0934.434.101',
      zalo_group_url: s.zalo_group_url || 'https://zalo.me/g/tuhocai',
      support_email: s.support_email || 'dang@tuhocai.top',
    });
  } catch (error) {
    return NextResponse.json({
      bank_id: 'ACB',
      account_no: '4747827',
      account_name: 'NGUYEN VAN DANG',
      banner_enabled: false,
      banner_text: '',
      banner_url: '/san-pham',
      hotline: '0934.434.101',
      zalo_group_url: 'https://zalo.me/g/tuhocai',
      support_email: 'dang@tuhocai.top',
    });
  }
}
