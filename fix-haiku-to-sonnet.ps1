# MoAI-ADK Haiku to Sonnet Migration Script (PowerShell)
# Purpose: Permanently replace all Haiku references with Sonnet
# Usage: Run this after /alfred:0-project if Haiku appears

Write-Host "🔄 Starting Haiku to Sonnet migration..." -ForegroundColor Cyan

# 1. Fix agent model configurations
Write-Host "📝 Updating agent configurations..." -ForegroundColor Yellow
$agents = @(
    "doc-syncer",
    "git-manager",
    "trust-checker",
    "quality-gate",
    "tdd-implementer"
)

foreach ($agent in $agents) {
    $file = ".claude\agents\alfred\$agent.md"
    if (Test-Path $file) {
        (Get-Content $file) -replace 'model: haiku', 'model: sonnet' | Set-Content $file
        Write-Host "  ✅ Updated $agent" -ForegroundColor Green
    }
}

# 2. Fix command configurations
Write-Host "📝 Updating command configurations..." -ForegroundColor Yellow
$syncFile = ".claude\commands\alfred\3-sync.md"
if (Test-Path $syncFile) {
    (Get-Content $syncFile) -replace 'model: "haiku"', 'model: "sonnet"' | Set-Content $syncFile
    Write-Host "  ✅ Updated alfred:3-sync" -ForegroundColor Green
}

# 3. Update CLAUDE.md if exists
if (Test-Path "CLAUDE.md") {
    Write-Host "📝 Updating CLAUDE.md..." -ForegroundColor Yellow
    $content = Get-Content "CLAUDE.md"
    $content = $content -replace 'Haiku 4\.5', 'Sonnet 4.5'
    $content = $content -replace '(?<!c)haiku', 'sonnet'  # Avoid replacing in 'Haiku'
    Set-Content "CLAUDE.md" $content
    Write-Host "  ✅ Updated CLAUDE.md" -ForegroundColor Green
}

# 4. Verify changes
Write-Host ""
Write-Host "🔍 Verification:" -ForegroundColor Cyan
Write-Host "Remaining Haiku references in agents:"
$haikuFiles = Get-ChildItem ".claude\agents\alfred\*.md" -ErrorAction SilentlyContinue |
    Select-String "model: haiku" -List |
    Select-Object -ExpandProperty Path

if ($haikuFiles) {
    $haikuFiles | ForEach-Object { Write-Host "  ⚠️ $_" -ForegroundColor Red }
} else {
    Write-Host "  ✅ None found!" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Migration complete!" -ForegroundColor Green
Write-Host "💡 Tip: Commit these changes to Git to preserve them:" -ForegroundColor Cyan
Write-Host "  git add .claude/ CLAUDE.md" -ForegroundColor Gray
Write-Host "  git commit -m 'fix: migrate all agents from Haiku to Sonnet'" -ForegroundColor Gray