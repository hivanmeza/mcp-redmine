# Script para verificar la instalación global del MCP Server de Redmine

Write-Host "🔍 Verificando instalación global del MCP Server de Redmine..." -ForegroundColor Cyan
Write-Host ""

# Verificar archivo de configuración global
$mcpConfigFile = "$env:APPDATA\Code\User\mcp.json"

if (Test-Path $mcpConfigFile) {
    Write-Host "✅ Archivo de configuración encontrado:" -ForegroundColor Green
    Write-Host "   📍 $mcpConfigFile" -ForegroundColor Gray
    
    # Verificar contenido
    $config = Get-Content $mcpConfigFile -Raw | ConvertFrom-Json
    
    if ($config.servers -and $config.servers."redmine-mcp-server") {
        Write-Host "✅ Servidor Redmine configurado correctamente" -ForegroundColor Green
        
        $server = $config.servers."redmine-mcp-server"
        Write-Host "   🚀 Comando: $($server.command)" -ForegroundColor Gray
        Write-Host "   📂 Script: $($server.args[0])" -ForegroundColor Gray
        Write-Host "   🌐 URL: $($server.env.REDMINE_BASE_URL)" -ForegroundColor Gray
        
        # Verificar que el archivo del servidor existe
        if (Test-Path $server.args[0]) {
            Write-Host "✅ Archivo del servidor encontrado" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Archivo del servidor NO encontrado: $($server.args[0])" -ForegroundColor Red
            Write-Host "   💡 Ejecuta: npm run build" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "❌ Configuración del servidor Redmine no encontrada" -ForegroundColor Red
    }
}
else {
    Write-Host "❌ Archivo de configuración NO encontrado" -ForegroundColor Red
    Write-Host "   💡 Ejecuta el script de instalación primero" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Pasos siguientes:" -ForegroundColor Magenta
Write-Host "1. Reinicia VS Code completamente" -ForegroundColor White
Write-Host "2. Abre cualquier workspace" -ForegroundColor White
Write-Host "3. Presiona Ctrl+Shift+P" -ForegroundColor White
Write-Host "4. Busca 'MCP' para acceder a las herramientas" -ForegroundColor White
Write-Host ""
Write-Host "🛠️  Herramientas disponibles: 33+ herramientas de Redmine" -ForegroundColor Cyan
