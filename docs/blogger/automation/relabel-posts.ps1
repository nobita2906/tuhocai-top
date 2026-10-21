# ============================================================
# Script: relabel-posts.ps1
# Muc dich: Doi nhan (label) hang loat trong file XML Blogger
# Blog: Nguyen Dang AI
# Chay DryRun: .\automation\relabel-posts.ps1 -DryRun
# Chay that:   .\automation\relabel-posts.ps1
# ============================================================

param(
    [string]$InputDir = (Join-Path $PSScriptRoot ".."),
    [switch]$DryRun = $false
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Helper: Build string from hex bytes (UTF-8)
function HexToStr([byte[]]$bytes) {
    return [System.Text.Encoding]::UTF8.GetString($bytes)
}

# Cac nhan tieng Viet duoc build tu hex bytes chinh xac tu file XML
# "Chia se quy trinh" HEX=[43 68 69 61 20 73 E1 BA BB 20 71 75 79 20 74 72 C3 AC 6E 68]
$LabelChiaSeQuyTrinh = HexToStr @(0x43,0x68,0x69,0x61,0x20,0x73,0xE1,0xBA,0xBB,0x20,0x71,0x75,0x79,0x20,0x74,0x72,0xC3,0xAC,0x6E,0x68)
# "Cong cu hinh anh Ai" HEX=[43 C3 B4 6E 67 20 63 E1 BB A5 20 68 C3 AC 6E 68 20 E1 BA A3 6E 68 20 41 69]
$LabelCongCuHinhAnh  = HexToStr @(0x43,0xC3,0xB4,0x6E,0x67,0x20,0x63,0xE1,0xBB,0xA5,0x20,0x68,0xC3,0xAC,0x6E,0x68,0x20,0xE1,0xBA,0xA3,0x6E,0x68,0x20,0x41,0x69)
# "Huong dan" HEX=[48 C6 B0 E1 BB 9B 6E 67 20 64 E1 BA AB 6E]
$LabelHuongDan       = HexToStr @(0x48,0xC6,0xB0,0xE1,0xBB,0x9B,0x6E,0x67,0x20,0x64,0xE1,0xBA,0xAB,0x6E)
# "Tin tuc Ai" HEX=[54 69 6E 20 74 E1 BB A9 63 20 41 69]
$LabelTinTucAi       = HexToStr @(0x54,0x69,0x6E,0x20,0x74,0xE1,0xBB,0xA9,0x63,0x20,0x41,0x69)

# Nhan moi can them
$LabelWorkflow       = "Workflow"
$LabelSkill          = "Skill"
$LabelImagePrompt    = "Image Prompt"
# "San pham" (new) — San pham n8n -> San pham
$LabelSanPham        = HexToStr @(0x53,0xE1,0xBA,0xA3,0x6E,0x20,0x70,0x68,0xE1,0xBA,0xA9,0x6D)
$LabelSanPhamN8n     = HexToStr @(0x53,0xE1,0xBA,0xA3,0x6E,0x20,0x70,0x68,0xE1,0xBA,0xA9,0x6D,0x20,0x6E,0x38,0x6E)
# "Cua hang" -> "San pham"
$LabelCuaHang        = HexToStr @(0x43,0xE1,0xBB,0xAD,0x61,0x20,0x68,0xC3,0xA0,0x6E,0x67)

# ============================================================
# RULES: [OldLabel, NewLabel]
# ============================================================
$Rules = @(
    @($LabelChiaSeQuyTrinh, $LabelWorkflow),
    @($LabelHuongDan,       $LabelSkill),
    @($LabelCongCuHinhAnh,  $LabelSkill),
    @($LabelTinTucAi,       $LabelSkill),
    @("Template n8n",       $LabelWorkflow),
    @("Image Prompt",       $LabelImagePrompt),
    @($LabelSanPhamN8n,     $LabelSanPham),
    @($LabelCuaHang,        $LabelSanPham)
)

# Files can xu ly
$TargetFiles = @(
    "workflowfree-blogger-posts.xml",
    "workflowfree-blogger-products.xml",
    "workflowfree-ALL-POSTS-AND-PRODUCTS.xml",
    "1-san-pham-ban-hang.xml",
    "2-workflow-n8n-phan-1.xml",
    "3-workflow-n8n-phan-2.xml",
    "4-image-prompts.xml"
)

$TotalLabelChanges = 0
$TotalFiles        = 0

Write-Host ""
Write-Host "========================================"
Write-Host "  Nguyen Dang AI - Label Relabeler"
Write-Host "========================================"
if ($DryRun) { Write-Host "  [DRY RUN - Khong ghi file]" }
Write-Host ""

foreach ($FileName in $TargetFiles) {
    $FilePath = Join-Path $InputDir $FileName
    if (-not (Test-Path $FilePath)) {
        Write-Host "  Skip (not found): $FileName"
        continue
    }

    Write-Host "Processing: $FileName"
    $RawBytes = [System.IO.File]::ReadAllBytes($FilePath)
    $Content  = [System.Text.Encoding]::UTF8.GetString($RawBytes)
    $FileChanges = 0

    foreach ($Rule in $Rules) {
        $OldLabel   = $Rule[0]
        $NewLabel   = $Rule[1]
        $SearchStr  = "term='" + $OldLabel + "'"
        $ReplaceStr = "term='" + $NewLabel + "'"

        if ($Content.Contains($SearchStr)) {
            $Content = $Content.Replace($SearchStr, $ReplaceStr)
            Write-Host ("  [OK] '{0}'  ->  '{1}'" -f $OldLabel, $NewLabel) -ForegroundColor Green
            $FileChanges++
            $TotalLabelChanges++
        }
    }

    if ($FileChanges -gt 0) {
        $TotalFiles++
        if (-not $DryRun) {
            $OutPath  = $FilePath -replace "\.xml$", "-relabeled.xml"
            $OutBytes = [System.Text.Encoding]::UTF8.GetBytes($Content)
            [System.IO.File]::WriteAllBytes($OutPath, $OutBytes)
            Write-Host ("  Saved: " + (Split-Path $OutPath -Leaf)) -ForegroundColor Cyan
        } else {
            Write-Host ("  [DRY RUN] Would save *-relabeled.xml ({0} label types changed)" -f $FileChanges) -ForegroundColor Yellow
        }
    } else {
        Write-Host "  No label changes needed"
    }
    Write-Host ""
}

Write-Host "========================================"
Write-Host "  RESULT"
Write-Host "========================================"
Write-Host ("  Files with changes   : {0}" -f $TotalFiles)
Write-Host ("  Label types matched  : {0}" -f $TotalLabelChanges)
if ($DryRun) {
    Write-Host ""
    Write-Host "To apply changes, run without -DryRun:" -ForegroundColor Yellow
    Write-Host "  cd docs\blogger && ..\automation\relabel-posts.ps1" -ForegroundColor White
}
Write-Host ""
