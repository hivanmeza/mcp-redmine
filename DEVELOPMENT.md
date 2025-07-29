# Desarrollo y Debugging del MCP Server de Redmine

## Configuración VS Code

Este proyecto está configurado para desarrollo óptimo en VS Code con las siguientes características:

### Tareas Disponibles (Ctrl+Shift+P > "Tasks: Run Task")

1. **build** - Compila el proyecto TypeScript
2. **watch** - Ejecuta en modo desarrollo con auto-reload
3. **test-connection** - Prueba la conexión con Redmine
4. **clean** - Limpia la carpeta dist

### Configuraciones de Debug (F5)

1. **Debug MCP Server** - Ejecuta la versión compilada con debugging
2. **Debug MCP Server (Development)** - Ejecuta desde TypeScript con debugging en tiempo real

## Cómo Usar

### 1. Configurar Variables de Entorno

Asegúrate de que el archivo `.env` contiene tus credenciales de Redmine:

```bash
REDMINE_BASE_URL=https://your-redmine-server.com/redmine
REDMINE_API_KEY=your-api-key-here
LOG_LEVEL=info
```

### 2. Probar la Conexión

```bash
npm run test-connection:prod
```

### 3. Ejecutar en Modo Desarrollo

```bash
npm run dev
```

### 4. Debugging en VS Code

1. Presiona `F5` para iniciar el debugger
2. Selecciona "Debug MCP Server (Development)" para debugging en tiempo real
3. Coloca breakpoints en el código TypeScript

### 5. Integración con MCP Clients

#### Configuración Local (Workspace)
El archivo `.vscode/mcp.json` está configurado para usar con clients MCP:

```json
{
  "servers": {
    "redmine-mcp-server": {
      "type": "stdio",
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "REDMINE_BASE_URL": "https://your-redmine-server.com/redmine",
        "REDMINE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

#### Configuración Global (VS Code)
Para usar el MCP server en cualquier workspace de VS Code:

1. **Instalación Automática:**
   ```bash
   # Copiar configuración global
   Copy-Item ".\mcp-global-config.json" "$env:APPDATA\Code\User\mcp.json" -Force
   ```

2. **Instalación Manual:**
   - Crear archivo: `%APPDATA%\Code\User\mcp.json`
   - Copiar la configuración de `mcp-global-config.json`

3. **Verificar instalación:**
   ```bash
   Get-Content "$env:APPDATA\Code\User\mcp.json"
   ```

**⚠️ Importante:** Después de configurar globalmente:
- Reinicia VS Code completamente
- El servidor estará disponible en cualquier workspace
- Usa `Ctrl+Shift+P` → "MCP" para acceder a las herramientas

## Herramientas Disponibles

El MCP Server incluye las siguientes herramientas:

### Gestión de Proyectos
- `list_projects` - Listar proyectos
- `get_project` - Obtener detalles de proyecto
- `create_project` - Crear proyecto
- `update_project` - Actualizar proyecto
- `delete_project` - Eliminar proyecto

### Gestión de Issues
- `list_issues` - Listar issues con filtros
- `get_issue` - Obtener detalles de issue
- `create_issue` - Crear issue
- `update_issue` - Actualizar issue
- `delete_issue` - Eliminar issue

### Relaciones de Issues
- `list_issue_relations` - Listar relaciones
- `create_issue_relation` - Crear relaciones (blocks, relates, etc.)
- `delete_issue_relation` - Eliminar relaciones

### Administración
- `list_users` - Listar usuarios
- `get_current_user` - Usuario actual
- `list_trackers` - Listar tipos de issue
- `list_issue_statuses` - Estados de issues
- `list_roles` - Roles del sistema
- `list_groups` - Grupos de usuarios

### Wiki y Contenido
- `list_wiki_pages` - Páginas wiki
- `get_wiki_page` - Contenido de página
- `create_wiki_page` - Crear/actualizar wiki
- `delete_wiki_page` - Eliminar página

### Archivos y Búsqueda
- `search` - Búsqueda global
- `upload_file` - Subir archivos
- `get_attachment` - Detalles de adjuntos

## Tips de Desarrollo

1. **Logs**: Cambia `LOG_LEVEL=debug` en `.env` para más información
2. **Hot Reload**: Usa `npm run dev` para desarrollo con recarga automática
3. **Testing**: Usa `npm run test-connection:prod` antes de integrar
4. **Debugging**: Los source maps están habilitados para debugging fácil

## Estructura del Proyecto

```
src/
├── index.ts                    # Servidor MCP principal
├── test-connection.ts          # Script de prueba de conexión
├── client/
│   └── redmine-client.ts      # Cliente API de Redmine
├── tools/                     # Herramientas MCP organizadas por funcionalidad
│   ├── project-tools.ts
│   ├── issue-tools.ts
│   ├── admin-tools.ts
│   ├── advanced-admin-tools.ts
│   ├── content-management-tools.ts
│   └── search-and-file-tools.ts
└── types/
    └── redmine.ts             # Definiciones de tipos TypeScript
```
