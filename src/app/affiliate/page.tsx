import type { Metadata } from 'next';
import AffiliateClient from './AffiliateClient';

export const metadata: Metadata = {
  title: 'Chương Trình Đối Tác Tiếp Thị (Affiliate / CTV) | Tự Học AI',
  description: 'Trở thành đối tác Affiliate & CTV cùng Tự Học AI. Nhận hoa hồng thực chiến 60% trọn đời trên mỗi đơn hàng công cụ, prompt và workflow AI.',
  alternates: {
    canonical: '/affiliate',
  },
};

export default function AffiliatePage() {
  return <AffiliateClient />;
}
