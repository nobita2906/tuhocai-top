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
      return NextResponse.json({ error: 'Không tìm thấy tệp tải lên' }, { status: 400 });
    }

    // Limit to 50MB for materials
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'Kích thước tệp vượt quá 50MB. Vui lòng tải lên Google Drive và dán liên kết.' }, { status: 400 });
    }

    const originalName = file.name || 'tai-lieu';
    const extension = path.extname(originalName).toLowerCase() || '.bin';

    // Determine resource type
    let resourceType: 'pdf' | 'doc' | 'json' | 'zip' | 'link' = 'doc';
    if (extension === '.pdf') resourceType = 'pdf';
    else if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(extension)) resourceType = 'zip';
    else if (extension === '.json') resourceType = 'json';
    else if (['.doc', '.docx', '.txt', '.md', '.xlsx', '.xls', '.pptx', '.ppt'].includes(extension)) resourceType = 'doc';

    // Format human-readable size
    const formatBytes = (bytes: number) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'classroom');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Safe clean filename
      const cleanBase = path.basename(originalName, extension)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 40);

      const savedFileName = `${cleanBase}_${Date.now()}${extension}`;
      const filePath = path.join(uploadsDir, savedFileName);

      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        name: originalName,
        url: `/uploads/classroom/${savedFileName}`,
        type: resourceType,
        size: formatBytes(file.size),
      });
    } catch (fsErr) {
      // Serverless fallback: base64
      const base64 = buffer.toString('base64');
      const dataUri = `data:${file.type || 'application/octet-stream'};base64,${base64}`;

      return NextResponse.json({
        success: true,
        name: originalName,
        url: dataUri,
        type: resourceType,
        size: formatBytes(file.size),
      });
    }
  } catch (error: any) {
    console.error('Classroom file upload error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi khi tải tệp lên' }, { status: 500 });
  }
}

