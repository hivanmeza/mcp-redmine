# 📦 Instalación del MCP Redmine

## Archivos de instalación generados:

### 1. Paquete principal
- **`mcp-redmine-1.0.0.tgz`** - Paquete compilado y listo para instalación (54.4 kB)

### 2. Scripts de instalación
- **`install-mcp-redmine.ps1`** - Script automatizado de instalación global
- **`install-global-mcp.ps1`** - Script de configuración en VS Code
- **`verify-global-installation.ps1`** - Script de verificación

## 🚀 Instalación rápida

### Opción 1: Instalación automática
```powershell
# Ejecutar como administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\install-mcp-redmine.ps1
```

### Opción 2: Instalación manual
```bash
# Instalar globalmente desde el paquete
npm install -g ./mcp-redmine-1.0.0.tgz

# Verificar instalación
npm list -g mcp-redmine
```

## 📝 Configuración en VS Code

Agregar al archivo de configuración MCP:

```json
{
  "mcpServers": {
    "redmine": {
      "command": "node",
      "args": [
        "C:\\Users\\[usuario]\\AppData\\Roaming\\npm\\node_modules\\mcp-redmine\\dist\\index.js"
      ],
      "env": {
        "REDMINE_BASE_URL": "http://tu-servidor-redmine.com",
        "REDMINE_API_KEY": "tu-api-key"
      }
    }
  }
}
```

## ✨ Características incluidas

- **Paginación automática** - Obtiene todos los resultados sin límites
- **144 herramientas MCP** - Gestión completa de Redmine
- **Tipos TypeScript** - Completamente tipado
- **Documentación completa** - Manuales de instalación y uso

## 🔧 Endpoints optimizados

Todos los endpoints principales ahora iteran automáticamente:
- `getProjects()` - Obtiene todos los proyectos (144 total)
- `getUsers()` - Obtiene todos los usuarios (47 total)
- `getIssues()` - Con paginación inteligente
- `getGroups()`, `getRoles()`, `getTrackers()`, etc.

## 📊 Tamaño del paquete

- **Tamaño comprimido**: 54.4 kB
- **Tamaño descomprimido**: 455.9 kB
- **Total de archivos**: 83
- **Incluye**: Código fuente + compilado + documentación + ejemplos

## 🌐 Distribución

El paquete `mcp-redmine-1.0.0.tgz` está listo para:
- Instalación local con `npm install`
- Distribución en registros npm
- Instalación desde archivo
- Integración en proyectos existentes
