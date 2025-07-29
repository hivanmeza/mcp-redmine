# 🌐 Instalación Global del MCP Server de Redmine

## ✅ Configuración Completada

El MCP Server de Redmine ha sido configurado globalmente en VS Code y está disponible en cualquier workspace.

### 📍 Ubicación de la Configuración

```
%APPDATA%\Code\User\mcp.json
```

### 🔧 Configuración Instalada


```json
{
  "servers": {
    "redmine-mcp-server": {
      "type": "stdio",
      "command": "node",
      "args": ["D:\\reposhmeza\\MCPs\\mcp-redmine\\dist\\index.js"],
      "env": {
        "REDMINE_BASE_URL": "https://your-redmine-server.com/redmine",
        "REDMINE_API_KEY": "your-api-key-here",
        "LOG_LEVEL": "info"
      },
      "description": "MCP Server para integración con Redmine - Gestión de proyectos, issues, usuarios y más"
    }
  }
}
```

> **Para obtener el listado de usuarios desde la API REST:**
>
> **GET** `https://your-redmine-server.com/redmine/users.json?limit=100`
>
> Header: `X-Redmine-API-Key: your-api-key-here`

## 🚀 Cómo Usar

### 1. Reiniciar VS Code
Para que los cambios tomen efecto, reinicia VS Code completamente.

### 2. Acceder a las Herramientas MCP
En cualquier workspace:
- Presiona `Ctrl+Shift+P`
- Busca "MCP" o "Model Context Protocol"
- Selecciona las herramientas de Redmine disponibles

### 3. Herramientas Disponibles (33+ herramientas)

#### 📋 Gestión de Proyectos
- `list_projects` - Listar todos los proyectos
- `get_project` - Obtener detalles de un proyecto específico
- `create_project` - Crear nuevo proyecto
- `update_project` - Actualizar proyecto existente
- `delete_project` - Eliminar proyecto

#### 🎫 Gestión de Issues
- `list_issues` - Listar issues con filtros avanzados
- `get_issue` - Obtener detalles completos de un issue
- `create_issue` - Crear nueva incidencia
- `update_issue` - Actualizar issue existente
- `delete_issue` - Eliminar issue

#### 🔗 Relaciones de Issues
- `list_issue_relations` - Ver relaciones entre issues
- `create_issue_relation` - Crear relaciones (blocks, relates, etc.)
- `delete_issue_relation` - Eliminar relaciones

#### 👥 Administración
- `list_users` - Listar usuarios del sistema
- `get_current_user` - Información del usuario actual
- `list_trackers` - Tipos de issues disponibles
- `list_issue_statuses` - Estados de issues
- `list_roles` - Roles del sistema
- `list_groups` - Grupos de usuarios

#### 📚 Wiki y Contenido
- `list_wiki_pages` - Páginas de wiki
- `get_wiki_page` - Contenido de página específica
- `create_wiki_page` - Crear/actualizar página wiki
- `delete_wiki_page` - Eliminar página wiki

#### 🔍 Búsqueda y Archivos
- `search` - Búsqueda global en Redmine
- `upload_file` - Subir archivos adjuntos
- `get_attachment` - Información de archivos adjuntos

## 🔄 Actualización del Servidor

Si realizas cambios al código del MCP server:

```bash
# 1. Compilar los cambios
npm run build

# 2. No es necesario reconfigurar, la configuración global apunta al archivo compilado
# 3. Solo reinicia VS Code si es necesario
```

## 🛠️ Troubleshooting

### El servidor no aparece en VS Code
1. Verifica que el archivo existe: `%APPDATA%\Code\User\mcp.json`
2. Reinicia VS Code completamente
3. Verifica que Node.js esté instalado y accesible

### Error al ejecutar herramientas
1. Verifica que el servidor esté compilado: `dist/index.js` debe existir
2. Verifica las credenciales de Redmine en la configuración
3. Verifica conectividad a: `https://your-redmine-server.com/redmine`

### Cambiar configuración
Para cambiar URL o API key:
1. Edita directamente: `%APPDATA%\Code\User\mcp.json`
2. O vuelve a ejecutar: `Copy-Item ".\mcp-global-config.json" "$env:APPDATA\Code\User\mcp.json" -Force`

## ✨ Beneficios de la Configuración Global

- ✅ **Disponible en cualquier workspace** - No necesitas configurar cada proyecto
- ✅ **Una sola configuración** - Cambia una vez, funciona en todos lados
- ✅ **Acceso inmediato** - Ctrl+Shift+P desde cualquier archivo
- ✅ **Productividad mejorada** - Gestiona Redmine sin salir de VS Code

¡Disfruta usando el MCP Server de Redmine integrado en VS Code! 🎉
