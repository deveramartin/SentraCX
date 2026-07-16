# SentraCX — Trust ASP.NET Core HTTPS Development Certificate (Windows)
# Usage: .\scripts\trust-dev-cert.ps1
#
# Run ONCE after cloning the repo. Adds the dev certificate to the
# Windows CurrentUser certificate store — persists permanently.

Write-Host "▶ Generating HTTPS development certificate..." -ForegroundColor Cyan
dotnet dev-certs https --clean 2>$null
dotnet dev-certs https

Write-Host "▶ Trusting certificate (adds to Windows certificate store)..." -ForegroundColor Cyan
dotnet dev-certs https --trust

Write-Host ""
Write-Host "▶ Verifying..." -ForegroundColor Cyan
$result = dotnet dev-certs https --check --trust 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ All done. The api-crm dev certificate (https://localhost:5005) is trusted." -ForegroundColor Green
    Write-Host "  This is a one-time setup — no need to run again unless the cert expires."
} else {
    Write-Host ""
    Write-Host "⚠ Certificate generated but trust verification failed:" -ForegroundColor Yellow
    Write-Host $result
}
