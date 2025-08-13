# Script para configurar MCP Redmine en VS Code
# Requiere que el paquete ya esté instalado globalmente

param(
    [string]$RedmineUrl = "https://your-redmine-server.com",
    [string]$ApiKey = "your-api-key-here"
)

Write-Host "🔧 Configurando MCP Redmine para VS Code..." -ForegroundColor Green

# Ruta del archivo de configuración MCP de VS Code
$mcpConfigPath = "$env:APPDATA\Code\User\mcp.json"

# Verificar que el paquete esté instalado
$npmGlobalPath = npm prefix -g
$mcpPackagePath = Join-Path $npmGlobalPath "node_modules\mcp-redmine\dist\index.js"

if (-not (Test-Path $mcpPackagePath)) {
    Write-Host "❌ Error: El paquete mcp-redmine no está instalado globalmente." -ForegroundColor Red
    Write-Host "   Ejecuta primero: .\install-mcp-redmine.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Paquete encontrado en: $mcpPackagePath" -ForegroundColor Green

# Crear configuración MCP
$mcpConfig = @{
    servers = @{
        redmine = @{
            type    = "stdio"
            command = "node"
            args    = @($mcpPackagePath)
            env     = @{
                REDMINE_BASE_URL = $RedmineUrl
                REDMINE_API_KEY  = $ApiKey
            }
        }
    }
    inputs  = @()
}

# Convertir a JSON con formato
$jsonConfig = $mcpConfig | ConvertTo-Json -Depth 4

# Crear directorio si no existe
$configDir = Split-Path $mcpConfigPath -Parent
if (-not (Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir -Force | Out-Null
}

# Escribir configuración
$jsonConfig | Out-File -FilePath $mcpConfigPath -Encoding UTF8

Write-Host "✅ Configuración MCP creada en: $mcpConfigPath" -ForegroundColor Green

# Mostrar configuración
Write-Host "`n📋 Configuración aplicada:" -ForegroundColor Cyan
Write-Host "   Servidor: redmine" -ForegroundColor White
Write-Host "   Comando: node $mcpPackagePath" -ForegroundColor White
Write-Host "   URL Redmine: $RedmineUrl" -ForegroundColor White
Write-Host "   API Key: $ApiKey" -ForegroundColor White

Write-Host "`n🚀 Pasos siguientes:" -ForegroundColor Yellow
Write-Host "1. Actualiza REDMINE_BASE_URL con tu servidor Redmine real" -ForegroundColor White
Write-Host "2. Actualiza REDMINE_API_KEY con tu clave API real" -ForegroundColor White
Write-Host "3. Reinicia VS Code para cargar la configuración" -ForegroundColor White
Write-Host "4. Verifica que el MCP aparezca en el panel de extensiones" -ForegroundColor White

Write-Host "`n📝 Para editar la configuración manualmente:" -ForegroundColor Cyan
Write-Host "   Archivo: $mcpConfigPath" -ForegroundColor White

Write-Host "`n🎉 MCP Redmine configurado exitosamente!" -ForegroundColor Green
