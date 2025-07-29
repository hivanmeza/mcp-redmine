#!/usr/bin/env pwsh
# Script de instalación global del MCP Redmine
# Ejecutar como administrador: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

Write-Host "🚀 Instalando MCP Redmine globalmente..." -ForegroundColor Green

# Instalar el paquete globalmente desde el archivo .tgz
$packagePath = Join-Path $PSScriptRoot "mcp-redmine-1.0.0.tgz"

if (Test-Path $packagePath) {
    Write-Host "📦 Instalando desde: $packagePath" -ForegroundColor Yellow
    npm install -g $packagePath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MCP Redmine instalado exitosamente" -ForegroundColor Green
        
        # Verificar la instalación
        Write-Host "🔍 Verificando instalación..." -ForegroundColor Yellow
        $globalPath = npm list -g mcp-redmine --depth=0 2>$null
        if ($globalPath) {
            Write-Host "✅ Verificación exitosa" -ForegroundColor Green
            Write-Host "📍 Ubicación: $globalPath" -ForegroundColor Cyan
        }
        
        Write-Host ""
        Write-Host "📝 Para configurar en VS Code:" -ForegroundColor Yellow
        Write-Host "1. Abrir configuración de VS Code (Ctrl+,)" -ForegroundColor White
        Write-Host "2. Buscar 'mcp.servers'" -ForegroundColor White
        Write-Host "3. Agregar configuración del servidor Redmine" -ForegroundColor White
        Write-Host ""
        Write-Host "📖 Ver GLOBAL-INSTALLATION.md para más detalles" -ForegroundColor Cyan
        
    }
    else {
        Write-Host "❌ Error en la instalación" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "❌ No se encontró el archivo mcp-redmine-1.0.0.tgz" -ForegroundColor Red
    Write-Host "🔧 Ejecutar 'npm run build && npm pack' primero" -ForegroundColor Yellow
    exit 1
}
