# ==============================================================================
# SCRIPT DEPLOY TU DONG LEN VERCEL CHO DOMAIN TUHOCAI.TOP
# ==============================================================================

Write-Host ">>> [1/4] Kiem tra kieu du lieu (TypeScript Typecheck)..." -ForegroundColor Cyan
npm run typecheck
if ($LASTEXITCODE -ne 0) {
    Write-Host "Loi Typecheck! Vui long sua loi truoc khi deploy." -ForegroundColor Red
    exit 1
}

Write-Host ">>> [2/4] Kiem tra bien dich he thong (Next.js Build)..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Loi Bien dich (Build Failed)! Khong the deploy." -ForegroundColor Red
    exit 1
}

$commitMsg = $args[0]
if (-not $commitMsg) {
    $dateStr = Get-Date -Format "yyyy-MM-dd HH:mm"
    $commitMsg = "deploy(release): update tuhocai.top ($dateStr)"
}

Write-Host ">>> [3/4] Gom va commit ma nguon: $commitMsg..." -ForegroundColor Cyan
git add .
$status = git status --porcelain
if ($status) {
    git commit -m "$commitMsg"
} else {
    Write-Host "Khong co file nao thay doi can commit moi." -ForegroundColor Yellow
}

Write-Host ">>> [4/4] Day code len GitHub de Vercel tu dong build va deploy len domain tuhocai.top..." -ForegroundColor Cyan
git push origin main
git push nvdang main

Write-Host ""
Write-Host "THANH CONG! Ma nguon da duoc day len GitHub." -ForegroundColor Green
Write-Host "Vercel dang tu dong kich hoat tien trinh Build va Deploy len https://tuhocai.top" -ForegroundColor Green
Write-Host "Ban co the theo doi tien do deploy tai: https://vercel.com/dashboard" -ForegroundColor Cyan
