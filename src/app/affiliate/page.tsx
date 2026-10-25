import type { Metadata } from 'next';
import AffiliateClient from './AffiliateClient';

export const metadata: Metadata = {
  title: 'Chương Trình Đối Tác Affiliate | Tự Học AI',
  description: 'Trở thành đối tác Affiliate cùng Tự Học AI. Nhận hoa hồng thực chiến 30% - 50% trọn đời trên mỗi đơn hàng công cụ, prompt và workflow AI.',
  alternates: {
    canonical: '/affiliate',
  },
};

export default function AffiliatePage() {
  return <AffiliateClient />;
}
