import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outputDir = path.resolve(process.env.APPDATA || '', '..', 'Local', 'Temp', 'tuhocai_qa_screenshots');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const viewports = [
  { name: 'desktop_1024', width: 1024, height: 900 },
  { name: 'desktop_1280', width: 1280, height: 900 },
  { name: 'tablet_768', width: 768, height: 1024 },
  { name: 'mobile_390', width: 390, height: 844 },
  { name: 'mobile_360', width: 360, height: 800 },
];

console.log('=== BẮT ĐẦU GIẢ LẬP VÀ CHỤP SCREENSHOT TẤT CẢ VIEWPORT ===');

for (const vp of viewports) {
  const fileOut = path.join(outputDir, `${vp.name}.png`);
  console.log(`> Đang kiểm thử viewport ${vp.name} (${vp.width}x${vp.height})...`);
  try {
    const cmd = `"${edgePath}" --headless=new --disable-gpu --window-size=${vp.width},${vp.height} --screenshot="${fileOut}" "http://localhost:8899"`;
    execSync(cmd, { stdio: 'pipe', timeout: 15000 });
    const stat = fs.statSync(fileOut);
    console.log(`  ✓ Thành công: ${vp.name}.png (${(stat.size / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`  ✗ Lỗi viewport ${vp.name}:`, err.message);
  }
}

console.log(`\nToàn bộ ảnh chụp đã được lưu tại: ${outputDir}`);

