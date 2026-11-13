# Rebuild the standalone macterm site and deploy it to Vercel (project macterm-001m)
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

# 1. build
npm run build:macterm 2>&1 | Select-Object -Last 2

# 2. restore static deploy config (build wipes dist)
Copy-Item -LiteralPath "$PSScriptRoot\vercel.static.json" -Destination "dist-macterm\vercel.json" -Force

# 3. strip media the page never references (keeps upload under Vercel limits)
Remove-Item -LiteralPath "dist-macterm\macterm\Recording_10_28_2026_8_35_08_AM.mp4" -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath "dist-macterm\macterm\before footer.png" -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath "dist-macterm\macterm\design.png" -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath "dist-macterm\products_ogi" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath "dist-macterm\.env.local" -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath "dist-macterm\.gitignore" -Force -ErrorAction SilentlyContinue
# keep only macterm.html, vercel.json, logo + favicons, assets/, macterm/
Get-ChildItem dist-macterm -File | Where-Object { $_.Name -notmatch '^macterm\.html$|^vercel\.json$|^logo\.png$|^favicon\.png$|^favicon\.ico$' } | Remove-Item -Force -ErrorAction SilentlyContinue

# 4. link + deploy
Push-Location dist-macterm
vercel link --yes --project macterm-001m
vercel --prod --yes
Pop-Location
