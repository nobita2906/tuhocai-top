import { Product } from '@/types';

/**
 * Xác định link điều hướng chính khi người dùng click vào sản phẩm (Thumbnail, Title, Chi tiết)
 * Nếu sản phẩm có Landing Page (cấu hình trong landing_page_url hoặc các slug được map sẵn),
 * sẽ dẫn thẳng đến Landing Page đó thay vì trang chi tiết sản phẩm chuẩn.
 */
export function getProductTargetUrl(product: Product): string {
  if (!product) return '/san-pham';

  // 1. Nếu có trường landing_page_url được cấu hình
  if (product.landing_page_url && product.landing_page_url.trim()) {
    const trimmed = product.landing_page_url.trim();
    // Chuẩn hóa nếu admin nhập thiếu dấu gạch chéo đầu
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
      return trimmed;
    }
    return `/${trimmed}`;
  }

  // 2. Fallback kiểm tra các slug có Landing Page tĩnh đặc thù
  const slug = product.slug?.toLowerCase() || '';
  const pid = product.pid?.toUpperCase() || '';

  if (slug === 'video-ai-tu-1-anh' || pid === 'WF-VIP-297') {
    return '/lp/video-ai-tu-1-anh';
  }
  if (slug === 'video-drama-gia-dinh-nho' || pid === 'WF-DRAMA-069') {
    return '/lp/video-drama-gia-dinh-nho';
  }
  if (slug === 'sao-chep-landing-page' || pid === 'SKILL-CLONE-099') {
    return '/lp/sao-chep-landing-page';
  }
  if (slug === 'workflow-n8n-auto-dang-bai-facebook' || pid === 'WF-N8N-001') {
    return '/lp/n8n-tu-dong-hoa-kiem-tien';
  }

  // 3. Mặc định là trang sản phẩm e-commerce thông thường
  return `/san-pham/${product.slug || product.pid}`;
}

/**
 * Kiểm tra nhanh xem sản phẩm có phải dạng Landing Page hay không
 */
export function isLandingPageProduct(product: Product): boolean {
  if (!product) return false;
  if (product.landing_page_url && product.landing_page_url.trim()) {
    return true;
  }
  const slug = product.slug?.toLowerCase() || '';
  const pid = product.pid?.toUpperCase() || '';
  return (
    slug === 'video-ai-tu-1-anh' ||
    pid === 'WF-VIP-297' ||
    slug === 'video-drama-gia-dinh-nho' ||
    pid === 'WF-DRAMA-069' ||
    slug === 'sao-chep-landing-page' ||
    pid === 'SKILL-CLONE-099' ||
    slug === 'workflow-n8n-auto-dang-bai-facebook' ||
    pid === 'WF-N8N-001'
  );
}

/**
 * Text nút xem thông tin phù hợp theo loại sản phẩm
 */
export function getProductDetailLabel(product: Product): string {
  if (isLandingPageProduct(product)) {
    return 'Khám phá';
  }
  return 'Chi tiết';
}

