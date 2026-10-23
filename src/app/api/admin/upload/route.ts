import { NextResponse } from 'next/server';
import { verifyAdminSession, unauthorizedAdminResponse } from '@/lib/adminAuth';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy tệp ảnh tải lên' }, { status: 400 });
    }

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Định dạng tệp không hợp lệ. Vui lòng chọn ảnh JPG, PNG, WebP hoặc GIF.' }, { status: 400 });
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Kích thước ảnh vượt quá 5MB. Vui lòng nén ảnh trước khi tải lên.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Try saving locally to public/uploads
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const extension = path.extname(file.name) || '.jpg';
      const cleanFileName = `img_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}${extension}`;
      const filePath = path.join(uploadsDir, cleanFileName);

      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${cleanFileName}`,
        fileName: cleanFileName,
        size: file.size,
      });
    } catch (fsErr) {
      // In serverless read-only environments (e.g. Vercel Lambda without external storage)
      // Fallback to Base64 Data URI so it works out-of-the-box everywhere!
      const base64 = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64}`;

      return NextResponse.json({
        success: true,
        url: dataUri,
        fileName: file.name,
        size: file.size,
      });
    }
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi khi tải ảnh lên' }, { status: 500 });
  }
}
