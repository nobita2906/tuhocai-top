'use client';

import { useState, useEffect } from 'react';
import { Product, Post } from '@/types';
import HomeHeroSection from '@/components/home/HomeHeroSection';
import BranchSelector, { BranchOption } from '@/components/home/BranchSelector';
import InlineLeadForm from '@/components/home/InlineLeadForm';
import AboutMeSection from '@/components/home/AboutMeSection';
import FreeLearningSection from '@/components/home/FreeLearningSection';
import TopProductsSection from '@/components/home/TopProductsSection';
import TrustSection from '@/components/home/TrustSection';
import HomeFaqSection from '@/components/home/HomeFaqSection';
import FinalCtaSection from '@/components/home/FinalCtaSection';
import LeadMagnetModal from '@/components/LeadMagnetModal';

interface HomePageClientProps {
  initialProducts: Product[];
  initialPosts: Post[];
}

export default function HomePageClient({ initialProducts, initialPosts }: HomePageClientProps) {
  const [selectedBranchId, setSelectedBranchId] = useState<string | undefined>(undefined);
  const [selectedResource, setSelectedResource] = useState<{
    id: string;
    name: string;
    giftDesc?: string;
  } | null>(null);

  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [publicSettings, setPublicSettings] = useState<{
    zalo_group_url?: string;
    hotline?: string;
    free_resource_title?: string;
    free_resource_download_url?: string;
  }>({});

  useEffect(() => {
    fetch('/api/settings/public')
      .then((res) => res.json())
      .then((data) => setPublicSettings(data))
      .catch(() => {});
  }, []);

  const handleClaimFreeScroll = () => {
    const el = document.getElementById('nhan-qua-0d');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectBranch = (branch: BranchOption) => {
    setSelectedBranchId(branch.id);
    setSelectedResource({
      id: `FREE-${branch.id.toUpperCase()}`,
      name: branch.giftTitle,
      giftDesc: branch.giftDesc,
    });
    handleClaimFreeScroll();
  };

  return (
    <div className="space-y-6 sm:space-y-10 pb-12 overflow-hidden transition-colors duration-200">
      {/* KHỐI 1: HERO - MÀN HÌNH ĐẦU TIÊN (Học AI bằng cách làm, có workflow chạy thật) */}
      <HomeHeroSection onClaimFreeClick={handleClaimFreeScroll} />

      {/* KHỐI 2: PHÂN NHÁNH NHU CẦU (Người mới / Văn phòng / Creator) */}
      <BranchSelector onSelectBranch={handleSelectBranch} activeBranchId={selectedBranchId} />

      {/* KHỐI 3: FORM NHẬN QUÀ 0Đ (Thu Email trực tiếp trên trang) */}
      <InlineLeadForm initialResource={selectedResource || undefined} />

      {/* KHỐI 4: VỀ NGUYỄN ĐĂNG AI (Xây niềm tin thương hiệu cá nhân & 3 con số thật) */}
      <AboutMeSection zaloUrl={publicSettings.zalo_group_url} />

      {/* KHỐI 5: HỌC MIỄN PHÍ TRƯỚC (3 bài viết & video mới nhất kèm template 0đ) */}
      <FreeLearningSection posts={initialPosts} />

      {/* KHỐI 6: 3 SẢN PHẨM TINH TUYỂN THEO THANG GIÁ (99k -> 299k -> 349k) */}
      <TopProductsSection products={initialProducts} />

      {/* KHỐI 7: VÌ SAO TIN ĐƯỢC (4 Bảo chứng an tâm + Feedback + Link 3 trang chính sách) */}
      <TrustSection />

      {/* KHỐI 8: CÂU HỎI THƯỜNG GẶP - FAQ (6 câu hỏi gỡ bỏ rào cản mua hàng) */}
      <HomeFaqSection />

      {/* KHỐI 9: KÊU GỌI HÀNH ĐỘNG CUỐI TRANG (Form 1 ô email chốt chặn trước Footer) */}
      <FinalCtaSection />

      {/* Auxiliary Lead Magnet Modal (dành cho các nút pop-up phụ nếu cần) */}
      <LeadMagnetModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        resourceId={selectedResource?.id || 'FREE-RESOURCE'}
        resourceName={selectedResource?.name || 'Tài liệu Tự Học AI'}
      />
    </div>
  );
}
