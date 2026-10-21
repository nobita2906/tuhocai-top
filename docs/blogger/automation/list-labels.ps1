[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$c = [System.IO.File]::ReadAllText('d:\ai-website-cloner-template\docs\blogger\workflowfree-blogger-posts.xml', [System.Text.Encoding]::UTF8)
$p = [regex]"scheme='http://www\.blogger\.com/atom/ns#' term='([^']+)'"
$ms = $p.Matches($c)
$labels = $ms | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
foreach ($l in $labels) {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($l)
    $hex = ($bytes | ForEach-Object { $_.ToString("X2") }) -join " "
    Write-Host "$l  HEX=[$hex]"
}
