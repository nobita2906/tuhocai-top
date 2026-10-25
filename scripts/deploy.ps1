# ==============================================================================
# SCRIPT DEPLOY TỰ ĐỘNG LÊN VERCEL CHO DOMAIN TUHOCAI.TOP
# Tác giả: Thùy Linh (Tự Học AI TOP)
# ==============================================================================

Write-Host "🚀 [1/4] Kiểm tra kiểu dữ liệu (TypeScript Typecheck)..." -ForegroundColor Cyan
npm run typecheck
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Lỗi Typecheck! Vui lòng sửa lỗi trước khi deploy." -ForegroundColor Red
    exit 1
}

Write-Host "📦 [2/4] Kiểm tra biên dịch hệ thống (Next.js Build)..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Lỗi Biên dịch (Build Failed)! Không thể deploy." -ForegroundColor Red
    exit 1
}

$commitMsg = $args[0]
if (-not $commitMsg) {
    $dateStr = Get-Date -Format "yyyy-MM-dd HH:mm"
    $commitMsg = "deploy(release): update tuhocai.top ($dateStr)"
}

Write-Host "📝 [3/4] Gom và commit mã nguồn: $commitMsg..." -ForegroundColor Cyan
git add .
$status = git status --porcelain
if ($status) {
    git commit -m "$commitMsg"
} else {
    Write-Host "ℹ️ Không có file nào thay đổi cần commit mới." -ForegroundColor Yellow
}

Write-Host "🌐 [4/4] Đẩy code lên GitHub để Vercel tự động build & deploy lên domain tuhocai.top..." -ForegroundColor Cyan
git push origin main
git push nvdang main

Write-Host ""
Write-Host "🎉 THÀNH CÔNG! Mã nguồn đã được đẩy lên GitHub." -ForegroundColor Green
Write-Host "👉 Vercel đang tự động kích hoạt tiến trình Build & Deploy lên https://tuhocai.top" -ForegroundColor Green
Write-Host "👉 Bạn có thể theo dõi tiến độ deploy tại: https://vercel.com/dashboard" -ForegroundColor Cyan
