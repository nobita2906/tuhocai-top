import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getCurrentUser } from '@/lib/auth';
import { query, execute } from '@/lib/db';
import { AffiliatePartner, AffiliateCommission } from '@/types';
import { DEFAULT_COMMISSION_RATE, getPartnerCommissionRate } from '@/lib/affiliate';

export async function GET(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    // 1. Tìm hoặc Tự động tạo tài khoản CTV cho học viên
    let partners = await query<AffiliatePartner>(
      'SELECT * FROM affiliate_partners WHERE user_id = ? OR LOWER(email) = ? LIMIT 1',
      [session.id, session.email.toLowerCase()]
    );

    let partner: AffiliatePartner;

    if (partners.length === 0) {
      // Tự động tạo mã Ref độc bản
      const prefix = (session.name || session.email.split('@')[0])
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '')
        .slice(0, 8);
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const autoCode = `${prefix || 'ctv'}${randomSuffix}`;
      const partnerId = randomUUID();

      await execute(
        `INSERT INTO affiliate_partners (
          id, user_id, code, name, email, phone, commission_rate, balance, total_earned, status, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 'ACTIVE', 'Tự động tạo cho học viên Tự Học AI')`,
        [
          partnerId,
          session.id,
          autoCode,
          session.name || 'Học viên Tự Học AI',
          session.email.toLowerCase(),
          session.phone || null,
          DEFAULT_COMMISSION_RATE,
        ]
      );

      const created = await query<AffiliatePartner>('SELECT * FROM affiliate_partners WHERE id = ? LIMIT 1', [partnerId]);
      partner = created[0];
    } else {
      partner = partners[0];
      // Nếu chưa có user_id thì liên kết lại
      if (!partner.user_id) {
        await execute('UPDATE affiliate_partners SET user_id = ? WHERE id = ?', [session.id, partner.id]);
        partner.user_id = session.id;
      }
    }

    // Mức chiết khấu hoa hồng của đối tác: tùy chỉnh theo partner.commission_rate, mặc định 60%
    const partnerRate = getPartnerCommissionRate(partner);

    // 2. Lấy danh sách sản phẩm học viên ĐÃ MUA trong user_library
    const ownedRows = await query<any>(
      `SELECT p.id, p.pid, p.slug 
       FROM user_library ul
       JOIN products p ON ul.product_id = p.id
       WHERE ul.user_id = ?`,
      [session.id]
    );

    const ownedProductIds = new Set(ownedRows.map((r) => r.id));
    const ownedPids = new Set(ownedRows.map((r) => r.pid));

    // 3. Lấy tất cả sản phẩm trả phí trên hệ thống
    const products = await query<any>(
      'SELECT id, pid, name, slug, price, original_price, category, thumbnail, download_url FROM products WHERE is_active = TRUE AND price > 0 ORDER BY price DESC'
    );

    // Xác định base URL của hệ thống (Tuyệt đối không dính localhost)
    let origin = process.env.NEXT_PUBLIC_APP_URL || 'https://www.tuhocai.top';
    if (origin.includes('localhost')) {
      origin = 'https://www.tuhocai.top';
    }
    origin = origin.replace(/\/+$/, '');

    // 4. Tạo danh sách link referral theo từng khóa học (Đồng bộ mức chiết khấu thống nhất)
    const referralProducts = products.map((prod) => {
      const isOwned = ownedProductIds.has(prod.id) || ownedPids.has(prod.pid);
      const commissionRate = partnerRate;
      const commissionAmount = Math.round((prod.price * commissionRate) / 100);

      // Nếu là sản phẩm có landing page riêng
      let refUrl = `${origin}/san-pham/${prod.slug}?ref=${partner.code}`;
      if (prod.slug === 'video-ai-tu-1-anh') {
        refUrl = `${origin}/lp/video-ai-tu-1-anh?ref=${partner.code}`;
      } else if (prod.slug === 'video-drama-gia-dinh-nho') {
        refUrl = `${origin}/lp/video-drama-gia-dinh-nho?ref=${partner.code}`;
      } else if (prod.slug === 'sao-chep-landing-page') {
        refUrl = `${origin}/lp/sao-chep-landing-page?ref=${partner.code}`;
      }

      return {
        id: prod.id,
        pid: prod.pid,
        name: prod.name,
        slug: prod.slug,
        price: prod.price,
        originalPrice: prod.original_price,
        category: prod.category,
        thumbnail: prod.thumbnail,
        isOwned,
        commissionRate,
        commissionAmount,
        refUrl,
      };
    });

    // 5. Thống kê clicks, đơn hàng, hoa hồng
    const clickCountRes = await query<any>(
      'SELECT COUNT(*) as total FROM affiliate_clicks WHERE affiliate_id = ?',
      [partner.id]
    );
    const totalClicks = Number(clickCountRes[0]?.total || 0);

    const commissions = await query<AffiliateCommission>(
      `SELECT * FROM affiliate_commissions 
       WHERE affiliate_id = ? 
       ORDER BY created_at DESC 
       LIMIT 30`,
      [partner.id]
    );

    const approvedCount = commissions.filter((c) => c.status === 'APPROVED').length;
    const pendingAmount = commissions
      .filter((c) => c.status === 'PENDING')
      .reduce((sum, c) => sum + Number(c.commission_amount), 0);

    // Lịch sử rút tiền
    const payouts = await query<any>(
      `SELECT * FROM affiliate_payouts 
       WHERE affiliate_id = ? 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [partner.id]
    );

    // Link giới thiệu chung toàn trang
    const generalRefUrl = `${origin}/?ref=${partner.code}`;

    // 6. Bộ Kit 5 Content Đăng Bài Thực Chiến
    // Lấy link khóa học VIP làm link mặc định cho content (hoặc link chung)
    const vipCourse = referralProducts.find((p) => p.slug.includes('video-ai') || p.price >= 200000) || referralProducts[0];
    const targetLink = vipCourse?.refUrl || generalRefUrl;

    const marketingKits = [
      {
        id: 1,
        title: 'Mẫu 1: Góc Review Học Viên Trải Nghiệm Thật (Độ Tin Cậy Cao)',
        platform: 'Facebook cá nhân, Nhật ký Zalo, Threads',
        recommendedImage: 'Ảnh chụp màn hình khóa học hoặc sản phẩm tạo ra từ AI',
        content: `Thực sự không nghĩ làm video AI bây giờ nó lại nhanh và dễ đến mức này mọi người ạ... 😅

Trước giờ mình cứ tưởng muốn làm kênh video triệu view thì phải biết quay dựng phức tạp, sắm máy tính khủng hay lộ mặt nói trước ống kính. Ai ngờ học xong quy trình làm video từ 1 ảnh của bên Tự Học AI mới thấy tư duy của họ thực chiến dã man:

1. Dùng Midjourney/FLUX tạo ảnh nhân vật giữ nguyên nét mặt (không bị biến dạng qua các cảnh).
2. Ném vào Kling AI cho chuyển động mắt, nụ cười siêu mượt.
3. Cho AI lồng tiếng truyền cảm + CapCut phụ đề giật gân trong 5 phút là xong 1 video 60s.

Ai đang bí ý tưởng làm video ngắn bán hàng hoặc xây kênh TikTok/Reels thì rất nên tham khảo quy trình này nhé, học xong làm theo được luôn:
👉 Link chi tiết quy trình ở đây nha: ${targetLink}

(Mình để link ở đây cho bạn nào cần, quy trình thực chiến đóng gói sẵn từ A-Z cực kỳ dễ hiểu!)`,
      },
      {
        id: 2,
        title: 'Mẫu 2: Góc Khoe Kết Quả & Chuyển Đổi Thực Tế (Kích Thích Tò Mò)',
        platform: 'Group Kinh doanh Online, Kiếm tiền Online, Marketing, Content Creator',
        recommendedImage: 'Ảnh chụp view TikTok/Reels tăng trưởng hoặc tin nhắn khách hỏi mua hàng',
        content: `Khoe nhẹ kết quả test kênh mới sau đúng 5 ngày áp dụng thử công thức "Video AI từ 1 ảnh"... 🚀

Không cần quay, không cần diễn viên, chỉ cần đúng 1 tấm ảnh chân dung tạo bằng AI rồi dùng công cụ tạo chuyển động. Video đầu tiên đăng thử đã cắn đề xuất hơn 80.000 view và mang về 14 đơn hàng đầu tiên mà không tốn 1 đồng tiền quảng cáo!

Cái hay nhất là toàn bộ kịch bản 3 giây đầu giữ chân khán giả và file prompt mẫu đều có sẵn, chỉ việc copy thay tên sản phẩm vào là chạy.

Bác nào đang làm affiliate hoặc bán hàng online muốn tự nhân bản kênh video ngắn tự động thì xem quy trình chi tiết ở đây nhé:
👉 ${targetLink}

Bác nào làm theo gặp đoạn nào chưa hiểu cứ nhắn mình chỉ thêm cho nha!`,
      },
      {
        id: 3,
        title: 'Mẫu 3: Góc Cho Đi & Tặng Tài Liệu Miễn Phí (Phễu Thu Hút Lớn Nhất)',
        platform: 'Hội nhóm Zalo, Facebook Group, Diễn đàn công nghệ',
        recommendedImage: 'Ảnh chụp bìa bộ tài liệu hoặc file mẫu Google Sheets / Prompt',
        content: `[TẶNG MIỄN PHÍ] Trọn bộ tài liệu & Prompt FLUX, Midjourney thương mại cho anh em làm Content AI 🎁

Dạo này nhiều bạn hỏi mình cách tạo ảnh nhân vật AI đồng nhất để làm video bán hàng mà không bị lỗi méo mặt hay lỗi bàn tay. Nhân tiện mình đang có sẵn bộ tài liệu tổng hợp quy trình chuẩn từng bước kèm hơn 100+ prompt thương mại dùng được ngay.

Anh em bấm vào link bên dưới để nhận tài liệu miễn phí vào kho học tập nha:
👉 ${targetLink}

Nội dung bao gồm:
- Quy trình tạo nhân vật AI nhất quán qua mọi góc chụp.
- File mẫu kịch bản phân cảnh 3 giây đầu giữ chân người xem.
- Bộ prompt ảnh chân dung thương mại chất lượng cao 4K.

Hoàn toàn miễn phí, anh em lưu về dùng ngay kẻo link drive bị giới hạn nhé!`,
      },
      {
        id: 4,
        title: 'Mẫu 4: Góc Cảnh Báo Sai Lầm Thường Gặp (Định Vị Chuyên Gia)',
        platform: 'LinkedIn, Facebook, Bài viết Blog',
        recommendedImage: 'Infographic so sánh cách làm cũ vs cách làm mới bằng AI',
        content: `3 Sai lầm khiến 90% người làm Video AI bỏ cuộc sau 1 tuần đầu tiên:

1. Quá tập trung vào công cụ đắt tiền: Đổi hết phần mềm này sang tool nọ nhưng quên mất "Kịch bản giữ chân 3 giây đầu" mới là yếu tố quyết định người xem có ở lại hay lướt qua.
2. Nhân vật bị méo mặt qua từng cảnh: Không biết cách cố định mã Seed và tham số ánh sáng khiến video trông chắp vá và thiếu chuyên nghiệp.
3. Làm video không có định hướng chuyển đổi: Video có thể có vài nghìn view nhưng không dẫn dắt được người xem bấm vào link bio hay mua hàng.

Nếu bạn đang bắt đầu với video AI và muốn đi đường tắt, tránh mất thời gian tự mày mò thử sai thì nên học quy trình thực chiến đóng gói sẵn này:
👉 Xem quy trình tại: ${targetLink}

Tiết kiệm được ít nhất 3-6 tháng mày mò vô bổ!`,
      },
      {
        id: 5,
        title: 'Mẫu 5: Kịch Bản Video Ngắn TikTok / Reels 30 Giây (Quay Màn Hình)',
        platform: 'Video TikTok, Reels, YouTube Shorts',
        recommendedImage: 'Quay video điện thoại chỉ vào màn hình render AI',
        content: `[0 - 3s] (Quay màn hình máy tính có tấm ảnh đang cử động miệng mượt mà)
Voiceover: "Đừng bỏ tiền thuê diễn viên quay video bán hàng nữa nếu bạn biết mẹo AI này..."

[4 - 15s] (Thao tác bấm nút trong Kling AI / CapCut hiển thị phụ đề chạy)
Voiceover: "Chỉ từ đúng 1 tấm ảnh tĩnh, mình dùng công cụ này tạo chuyển động mắt và nụ cười tự nhiên 100%, sau đó ghép giọng đọc AI và phụ đề tự động trong chưa đầy 5 phút."

[16 - 25s] (Quay bảng thống kê view TikTok hoặc đơn hàng)
Voiceover: "Kênh mới lập vài ngày đã có video triệu view và nổ đơn liên tục. Toàn bộ quy trình và file mẫu mình để ở link đầu trang cá nhân nhé!"

[26 - 30s] (Mũi tên chỉ vào link bio)
Call To Action: "Bấm vào link bio của mình để lấy trọn bộ quy trình làm ngay hôm nay!"
👉 Link gắn bio: ${targetLink}`,
      },
    ];

    return NextResponse.json({
      success: true,
      partner: {
        id: partner.id,
        code: partner.code,
        name: partner.name,
        email: partner.email,
        phone: partner.phone,
        commissionRate: partnerRate,
        balance: partner.balance,
        totalEarned: partner.total_earned,
        bankName: partner.bank_name,
        bankAccountNo: partner.bank_account_no,
        bankAccountName: partner.bank_account_name,
        generalRefUrl,
      },
      stats: {
        totalClicks,
        totalOrders: approvedCount,
        balance: partner.balance,
        totalEarned: partner.total_earned,
        pendingAmount,
        conversionRate: totalClicks > 0 ? ((approvedCount / totalClicks) * 100).toFixed(1) : '0.0',
      },
      referralProducts,
      commissions,
      payouts,
      marketingKits,
    });
  } catch (error: any) {
    console.error('Dashboard referral API error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi tải dữ liệu CTV' }, { status: 500 });
  }
}

// Cập nhật thông tin ngân hàng của CTV
export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const { bankName, bankAccountNo, bankAccountName } = await req.json();

    if (!bankName || !bankAccountNo || !bankAccountName) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ tên ngân hàng, số tài khoản và tên chủ tài khoản' }, { status: 400 });
    }

    await execute(
      `UPDATE affiliate_partners 
       SET bank_name = ?, bank_account_no = ?, bank_account_name = ?
       WHERE user_id = ? OR LOWER(email) = ?`,
      [
        bankName.trim(),
        bankAccountNo.trim(),
        bankAccountName.trim().toUpperCase(),
        session.id,
        session.email.toLowerCase(),
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Cập nhật thông tin nhận hoa hồng thành công!',
    });
  } catch (error: any) {
    console.error('Update bank error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi cập nhật' }, { status: 500 });
  }
}

