#!/usr/bin/env pwsh
# Script de instalación global del MCP Redmine
# Ejecutar como administrador: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

Write-Host "🚀 Instalando MCP Redmine globalmente..." -ForegroundColor Green


#!/usr/bin/env pwsh
# install-mcp-redmine.ps1
# Automated installer for MCP Redmine (Windows PowerShell)
# Ensure you have set: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

Write-Host "Installing MCP Redmine..."

try {
    # 1) Install dependencies
    Write-Host "Step 1/5: npm install"
    npm install
    if ($LASTEXITCODE -ne 0) { throw "npm install failed with exit code $LASTEXITCODE" }

    # 2) Build
    Write-Host "Step 2/5: npm run build"
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "npm run build failed with exit code $LASTEXITCODE" }

    # 3) Pack
    Write-Host "Step 3/5: npm pack"
    npm pack
    if ($LASTEXITCODE -ne 0) { throw "npm pack failed with exit code $LASTEXITCODE" }

    # 4) Ensure .env exists
    $envPath = Join-Path $PSScriptRoot ".env"
    $envExamplePath = Join-Path $PSScriptRoot ".env.example"
    if (-not (Test-Path $envPath) -and (Test-Path $envExamplePath)) {
        Copy-Item -Path $envExamplePath -Destination $envPath -Force
        Write-Host "Created .env from .env.example"
    }

    # 5) Find the created package and install globally
    Write-Host "Step 4/5: locating package"
    $packageTgz = Get-ChildItem -Path $PSScriptRoot -Filter "mcp-redmine-*.tgz" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if (-not $packageTgz) { throw "No package .tgz found in $PSScriptRoot" }

    Write-Host "Step 5/5: npm install -g $($packageTgz.FullName)"
    npm install -g --no-audit --no-fund $packageTgz.FullName
    if ($LASTEXITCODE -ne 0) { throw "Global npm install failed with exit code $LASTEXITCODE" }

    Write-Host "MCP Redmine installed successfully"

    # Verification (optional)
    Write-Host "Verifying installation (npm list -g mcp-redmine --depth=0)"
    npm list -g mcp-redmine --depth=0

} catch {
    Write-Host "ERROR: $($_)" -ForegroundColor Red
    exit 1
}
