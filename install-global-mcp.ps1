# Instalación Global Completa de MCP Redmine
# Este script realiza todo el proceso: compilar, empaquetar y publicar globalmente

Write-Host "=== INSTALACIÓN GLOBAL COMPLETA DE MCP REDMINE ===" -ForegroundColor Cyan
Write-Host "Versión objetivo: v1.2.1 - Redmine 4.1.1.stable compatible" -ForegroundColor Green
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Error "Error: No se encontró package.json. Ejecuta este script desde el directorio raíz del proyecto mcp-redmine"
    exit 1
}

# Verificar que Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js detectado: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Error "Error: Node.js no está instalado o no está en el PATH"
    exit 1
}

# Verificar que npm está instalado
try {
    $npmVersion = npm --version
    Write-Host "✓ npm detectado: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Error "Error: npm no está instalado o no está en el PATH"
    exit 1
}

Write-Host ""
Write-Host "=== PASO 1: LIMPIEZA Y PREPARACIÓN ===" -ForegroundColor Yellow

# Limpiar instalación global anterior si existe
Write-Host "Desinstalando versión global anterior (si existe)..." -ForegroundColor Cyan
try {
    npm uninstall -g mcp-redmine 2>$null
    Write-Host "✓ Versión anterior desinstalada" -ForegroundColor Green
}
catch {
    Write-Host "• No había versión anterior instalada" -ForegroundColor Gray
}

# Limpiar directorio de compilación
Write-Host "Limpiando directorio de compilación..." -ForegroundColor Cyan
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✓ Directorio dist eliminado" -ForegroundColor Green
}

# Limpiar node_modules
Write-Host "Limpiando node_modules..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✓ Directorio node_modules eliminado" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== PASO 2: INSTALACIÓN DE DEPENDENCIAS ===" -ForegroundColor Yellow

Write-Host "Instalando dependencias..." -ForegroundColor Cyan
try {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Dependencias instaladas correctamente" -ForegroundColor Green
    }
    else {
        throw "npm install falló"
    }
}
catch {
    Write-Error "Error: Falló la instalación de dependencias"
    exit 1
}

Write-Host ""
Write-Host "=== PASO 3: COMPILACIÓN TYPESCRIPT ===" -ForegroundColor Yellow

Write-Host "Compilando código TypeScript..." -ForegroundColor Cyan
try {
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Compilación exitosa" -ForegroundColor Green
    }
    else {
        throw "npm run build falló"
    }
}
catch {
    Write-Error "Error: Falló la compilación TypeScript"
    exit 1
}

# Verificar que se generaron los archivos compilados
if (-not (Test-Path "dist/index.js")) {
    Write-Error "Error: No se generó el archivo dist/index.js"
    exit 1
}

Write-Host "✓ Archivo dist/index.js generado correctamente" -ForegroundColor Green

Write-Host ""
Write-Host "=== PASO 4: VALIDACIÓN PRE-INSTALACIÓN ===" -ForegroundColor Yellow

# Verificar package.json
Write-Host "Validando package.json..." -ForegroundColor Cyan
$packageJson = Get-Content "package.json" | ConvertFrom-Json

if ($packageJson.name -ne "mcp-redmine") {
    Write-Error "Error: Nombre del paquete incorrecto en package.json"
    exit 1
}

if ($packageJson.version -ne "1.2.1") {
    Write-Error "Error: Versión incorrecta en package.json. Esperada: 1.2.1, Actual: $($packageJson.version)"
    exit 1
}

if (-not $packageJson.bin.'mcp-redmine') {
    Write-Error "Error: Configuración 'bin' faltante en package.json"
    exit 1
}

Write-Host "✓ package.json validado correctamente" -ForegroundColor Green

# Verificar estructura de directorios
$requiredFiles = @(
    "dist/index.js",
    "dist/client/redmine-client.js",
    "dist/tools/help-tool.js",
    "dist/tools/issue-tools.js",
    "dist/tools/project-tools.js"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Error "Error: Archivo requerido faltante: $file"
        exit 1
    }
}

Write-Host "✓ Estructura de archivos validada" -ForegroundColor Green

Write-Host ""
Write-Host "=== PASO 5: INSTALACIÓN GLOBAL ===" -ForegroundColor Yellow

Write-Host "Instalando globalmente mcp-redmine..." -ForegroundColor Cyan
try {
    npm install -g .
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Instalación global exitosa" -ForegroundColor Green
    }
    else {
        throw "npm install -g falló"
    }
}
catch {
    Write-Error "Error: Falló la instalación global"
    exit 1
}

Write-Host ""
Write-Host "=== PASO 6: VERIFICACIÓN POST-INSTALACIÓN ===" -ForegroundColor Yellow

# Verificar que el comando está disponible globalmente
Write-Host "Verificando comando global..." -ForegroundColor Cyan
try {
    $commandPath = Get-Command mcp-redmine -ErrorAction Stop
    Write-Host "✓ Comando mcp-redmine disponible en: $($commandPath.Source)" -ForegroundColor Green
}
catch {
    Write-Error "Error: El comando mcp-redmine no está disponible globalmente"
    exit 1
}

# Verificar versión instalada
Write-Host "Verificando versión instalada..." -ForegroundColor Cyan
try {
    $globalVersion = npm list -g mcp-redmine --depth=0 2>$null | Select-String "mcp-redmine@"
    if ($globalVersion) {
        Write-Host "✓ Versión global: $($globalVersion.ToString().Split('@')[1])" -ForegroundColor Green
    }
    else {
        Write-Warning "No se pudo verificar la versión global, pero la instalación parece exitosa"
    }
}
catch {
    Write-Warning "No se pudo verificar la versión global, pero la instalación parece exitosa"
}

# Verificar ubicación de instalación global
Write-Host "Verificando ubicación de instalación..." -ForegroundColor Cyan
try {
    $globalRoot = npm root -g
    $mcpRedmineGlobal = Join-Path $globalRoot "mcp-redmine"
    if (Test-Path $mcpRedmineGlobal) {
        Write-Host "✓ MCP Redmine instalado en: $mcpRedmineGlobal" -ForegroundColor Green
    }
    else {
        Write-Warning "No se encontró el directorio de instalación global, pero el comando está disponible"
    }
}
catch {
    Write-Warning "No se pudo verificar la ubicación de instalación global"
}

Write-Host ""
Write-Host "=== PASO 7: PRUEBA FUNCIONAL ===" -ForegroundColor Yellow

Write-Host "Realizando prueba funcional básica..." -ForegroundColor Cyan

# Crear archivo de prueba temporal
$testConfig = @"
{
  "mcpServers": {
    "mcp-redmine": {
      "command": "mcp-redmine",
      "env": {
        "REDMINE_URL": "https://example.redmine.com",
        "REDMINE_API_KEY": "test-key"
      }
    }
  }
}
"@

$testConfigFile = "test-config.json"
$testConfig | Out-File -FilePath $testConfigFile -Encoding UTF8

# Verificar que el servidor MCP responde (sin conexión real)
Write-Host "Verificando que el servidor MCP responde..." -ForegroundColor Cyan
try {
    # Ejecutar con timeout para evitar bloqueo
    $process = Start-Process -FilePath "mcp-redmine" -NoNewWindow -PassThru -RedirectStandardOutput "test-output.txt" -RedirectStandardError "test-error.txt"
    Start-Sleep -Seconds 3
    
    if (-not $process.HasExited) {
        $process.Kill()
        Write-Host "✓ Servidor MCP inicia correctamente (proceso terminado)" -ForegroundColor Green
    }
    else {
        Write-Warning "El proceso MCP terminó rápidamente (posible error de configuración)"
    }
}
catch {
    Write-Warning "No se pudo realizar la prueba funcional completa, pero la instalación está completa"
}

# Limpiar archivos de prueba
Remove-Item -Force "test-config.json" -ErrorAction SilentlyContinue
Remove-Item -Force "test-output.txt" -ErrorAction SilentlyContinue
Remove-Item -Force "test-error.txt" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "=== INSTALACIÓN COMPLETADA EXITOSAMENTE ===" -ForegroundColor Green
Write-Host ""
Write-Host "RESUMEN:" -ForegroundColor Cyan
Write-Host "• MCP Redmine v1.2.1 instalado globalmente" -ForegroundColor White
Write-Host "• Compatible con Redmine 4.1.1.stable" -ForegroundColor White
Write-Host "• Comando disponible: mcp-redmine" -ForegroundColor White
Write-Host ""
Write-Host "PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "1. Configura las variables de entorno REDMINE_URL y REDMINE_API_KEY" -ForegroundColor White
Write-Host "2. Agrega mcp-redmine a tu configuración de MCP en VS Code o Claude Desktop" -ForegroundColor White
Write-Host "3. Ejecuta: mcp-redmine para iniciar el servidor" -ForegroundColor White
Write-Host ""
Write-Host "CONFIGURACIÓN EJEMPLO:" -ForegroundColor Yellow
Write-Host "REDMINE_URL=https://tu-redmine.com" -ForegroundColor Gray
Write-Host "REDMINE_API_KEY=tu-api-key-aqui" -ForegroundColor Gray
Write-Host ""
Write-Host "Para más información, consulta: README.md y CONFIGURACION-FINAL.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "¡Instalación global completada!" -ForegroundColor Green