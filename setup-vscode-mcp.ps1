# Script para configurar MCP Redmine en VS Code
$sourceFile = ".\cline_mcp_settings.json"
$targetDir = "$env:APPDATA\Code\User\globalStorage\rooveterinaryinc.roo-cline\settings"
$targetFile = "$targetDir\cline_mcp_settings.json"

Write-Host "🔧 Configurando MCP Redmine en VS Code..." -ForegroundColor Yellow

# Crear directorio si no existe
if (!(Test-Path $targetDir)) {
    Write-Host "📁 Creando directorio de configuración..." -ForegroundColor Blue
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

# Copiar archivo de configuración
if (Test-Path $sourceFile) {
    Write-Host "📋 Copiando configuración MCP..." -ForegroundColor Blue
    Copy-Item $sourceFile $targetFile -Force
    Write-Host "✅ MCP Redmine configurado exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Configuración aplicada en:" -ForegroundColor White
    Write-Host "   $targetFile" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔄 Reinicia VS Code para aplicar los cambios" -ForegroundColor Yellow
    Write-Host "💡 Luego busca 'MCP' en la paleta de comandos para acceder a las herramientas" -ForegroundColor White
}
else {
    Write-Host "❌ No se encontró el archivo de configuración" -ForegroundColor Red
}

Write-Host ""
Write-Host "🧪 Probando instalación global..." -ForegroundColor Yellow
try {
    $version = npm list -g mcp-redmine --depth=0 2>$null
    if ($version -match "mcp-redmine@") {
        Write-Host "✅ MCP Redmine instalado globalmente" -ForegroundColor Green
        Write-Host "📦 $($version -split "`n" | Where-Object { $_ -match "mcp-redmine@" })" -ForegroundColor Gray
    }
    else {
        Write-Host "⚠️  No se pudo verificar la instalación global" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Error al verificar instalación: $($_.Exception.Message)" -ForegroundColor Red
}
