param(
    [switch]$SkipWebBuild,
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$seanimeRoot = Join-Path $repoRoot "seanime"
$siteDownloads = Join-Path $repoRoot "site\downloads"
$stagingRoot = Join-Path $repoRoot ".desktop-build"
$packageRoot = Join-Path $stagingRoot "Shiori-Windows-x64"
$buildSource = Join-Path $stagingRoot "source"
$archivePath = Join-Path $siteDownloads "Shiori-Windows-x64.zip"
$checksumPath = "$archivePath.sha256"
$resourceRc = Join-Path $buildSource "shiori_resource.rc"
$resourceObject = Join-Path $buildSource "shiori_resource_windows_amd64.syso"
$resourceIcon = Join-Path $buildSource "shiori-build.ico"

if (-not $stagingRoot.StartsWith($repoRoot, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to clean a staging path outside the repository."
}

if (Test-Path -LiteralPath $stagingRoot) {
    Remove-Item -LiteralPath $stagingRoot -Recurse -Force
}
New-Item -ItemType Directory -Path $packageRoot -Force | Out-Null
New-Item -ItemType Directory -Path $siteDownloads -Force | Out-Null

if (-not $SkipWebBuild) {
    Push-Location (Join-Path $seanimeRoot "seanime-web")
    try {
        & npm.cmd run build
        if ($LASTEXITCODE -ne 0) { throw "Frontend build failed." }
        Copy-Item -Path ".\out\*" -Destination "..\web" -Recurse -Force
    }
    finally {
        Pop-Location
    }
}

if (-not $SkipTests) {
    Push-Location $seanimeRoot
    try {
        $env:CGO_ENABLED = "0"
        & go test ./internal/server ./internal/core
        if ($LASTEXITCODE -ne 0) { throw "Go tests failed." }
    }
    finally {
        Pop-Location
    }
}

# Build from a clean temporary source tree so old frontend chunks and the owner's
# original art drop in seanime/web never inflate the downloadable application.
& robocopy.exe $seanimeRoot $buildSource /E /XD ".git" "dev-datadir" "seanime-web" "web" /XF "*.exe" /NFL /NDL /NJH /NJS /NC /NS /NP
if ($LASTEXITCODE -gt 7) { throw "Could not prepare the clean desktop build tree." }
New-Item -ItemType Directory -Path (Join-Path $buildSource "web") -Force | Out-Null
Copy-Item -Path (Join-Path $seanimeRoot "seanime-web\out\*") -Destination (Join-Path $buildSource "web") -Recurse -Force

try {
    Copy-Item -LiteralPath (Join-Path $repoRoot "site\favicon.ico") -Destination $resourceIcon -Force
    Set-Content -LiteralPath $resourceRc -Value '1 ICON "shiori-build.ico"' -Encoding ascii
    $windres = Get-Command windres.exe -ErrorAction SilentlyContinue
    if ($windres) {
        & $windres.Source --target=pe-x86-64 --input-format=rc --output-format=coff $resourceRc $resourceObject
    }
    if (-not $windres -or $LASTEXITCODE -ne 0) {
        Write-Warning "The installed windres cannot emit a 64-bit icon resource. The packaged Shiori tray icon will still be used."
        Remove-Item -LiteralPath $resourceObject -Force -ErrorAction SilentlyContinue
    }

    Push-Location $buildSource
    try {
        $env:CGO_ENABLED = "0"
        & go build -o (Join-Path $packageRoot "Shiori.exe") -trimpath -ldflags="-s -w -H=windowsgui" .
        if ($LASTEXITCODE -ne 0) { throw "Desktop executable build failed." }
    }
    finally {
        Pop-Location
    }
}
finally {
    Remove-Item -LiteralPath $resourceRc -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $resourceObject -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $resourceIcon -Force -ErrorAction SilentlyContinue
}

Copy-Item -LiteralPath (Join-Path $repoRoot "site\favicon.ico") -Destination (Join-Path $packageRoot "Shiori.ico") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "desktop\README.txt") -Destination (Join-Path $packageRoot "README.txt") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "desktop\SOURCE.txt") -Destination (Join-Path $packageRoot "SOURCE.txt") -Force
Copy-Item -LiteralPath (Join-Path $seanimeRoot "LICENSE") -Destination (Join-Path $packageRoot "LICENSE.txt") -Force

$providerDestination = Join-Path $packageRoot "providers"
New-Item -ItemType Directory -Path $providerDestination -Force | Out-Null
Copy-Item -Path (Join-Path $seanimeRoot "dev-datadir\extensions\*.json") -Destination $providerDestination -Force

if (Test-Path -LiteralPath $archivePath) {
    Remove-Item -LiteralPath $archivePath -Force
}
if (Test-Path -LiteralPath $checksumPath) {
    Remove-Item -LiteralPath $checksumPath -Force
}
Compress-Archive -Path (Join-Path $packageRoot "*") -DestinationPath $archivePath -CompressionLevel Optimal

$hash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()
Set-Content -LiteralPath $checksumPath -Value "$hash  Shiori-Windows-x64.zip" -Encoding ascii

$archive = Get-Item -LiteralPath $archivePath
Write-Host "Built $($archive.FullName)"
Write-Host "Size: $([Math]::Round($archive.Length / 1MB, 1)) MB"
Write-Host "SHA-256: $hash"

Remove-Item -LiteralPath $stagingRoot -Recurse -Force
