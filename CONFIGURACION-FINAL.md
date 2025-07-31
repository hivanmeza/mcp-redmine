# 🔧 Configuración Final MCP Redmine en VS Code

## 🎯 Compatibilidad

**Este MCP está desarrollado específicamente para Redmine 4.1.1.stable**

Para garantizar la funcionalidad completa, asegúrate de usar Redmine 4.1.1.stable. Otras versiones pueden funcionar, pero no están oficialmente soportadas.

## ✅ Estado Actual

El MCP Redmine ha sido **configurado correctamente** en VS Code. El problema anterior se debía a una configuración incorrecta que intentaba instalar el paquete en lugar de ejecutar el servidor.

## 📋 Configuración Aplicada

```json
{
  "servers": {
    "redmine": {
      "type": "stdio",
      "command": "node",
      "args": [
        "C:\\Users\\avni_\\AppData\\Roaming\\npm\\node_modules\\mcp-redmine\\dist\\index.js"
      ],
      "env": {
        "REDMINE_BASE_URL": "http://localhost:3000",
        "REDMINE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## 🚀 Pasos para Completar la Configuración

### 1. **Actualizar Variables de Entorno**

Edita el archivo `mcp.json` y actualiza:

```json
"env": {
  "REDMINE_BASE_URL": "http://tu-servidor-redmine.com",
  "REDMINE_API_KEY": "tu-clave-api-real"
}
```

### 2. **Obtener API Key de Redmine**

1. Inicia sesión en tu Redmine
2. Ve a **Mi cuenta** → **Clave de acceso a la API**
3. Copia la clave generada
4. Reemplaza `"your-api-key-here"` con tu clave real

### 3. **Reiniciar VS Code**

- Cierra completamente VS Code
- Vuelve a abrirlo para cargar la nueva configuración

### 4. **Verificar Funcionamiento**

El MCP debería aparecer activo en VS Code. Puedes probarlo:

- Abriendo el chat de Copilot
- Preguntando: *"¿Qué herramientas de Redmine están disponibles?"*

## 🛠️ Scripts Disponibles

### Configuración Automática
```powershell
.\configure-vscode-mcp.ps1
```

### Configuración con Parámetros
```powershell
.\configure-vscode-mcp.ps1 -RedmineUrl "http://mi-redmine.com" -ApiKey "mi-clave-api"
```

## 🔍 Solución de Problemas

### Error: "Server exited before responding"
- ✅ **Solucionado**: Era por configuración incorrecta
- La configuración ahora apunta al ejecutable correcto

### Error: "ENOENT: no such file or directory"
- ✅ **Solucionado**: Ya no intenta instalar, ejecuta directamente

### Variables de Entorno Incorrectas
```bash
# Verificar que las variables estén configuradas
echo $REDMINE_BASE_URL
echo $REDMINE_API_KEY
```

## 📊 Herramientas Disponibles

Una vez configurado, tendrás acceso a **144 herramientas** MCP:

### 🏗️ Gestión de Proyectos
- `get_projects` - Listar proyectos (con paginación automática)
- `create_project` - Crear proyecto
- `update_project` - Actualizar proyecto
- `delete_project` - Eliminar proyecto

### 🎫 Gestión de Issues
- `get_issues` - Listar issues con filtros avanzados
- `create_issue` - Crear nueva issue
- `update_issue` - Actualizar issue
- `delete_issue` - Eliminar issue

### 👥 Gestión de Usuarios
- `get_users` - Listar usuarios (con paginación automática)
- `create_user` - Crear usuario
- `update_user` - Actualizar usuario
- `delete_user` - Eliminar usuario

### ⏱️ Gestión de Tiempo
- `get_time_entries` - Listar entradas de tiempo
- `create_time_entry` - Crear entrada de tiempo
- `update_time_entry` - Actualizar entrada
- `delete_time_entry` - Eliminar entrada

**¡Y 130+ herramientas más!**

## 🎯 Estado Final

- ✅ **Paquete instalado**: `mcp-redmine@1.0.0`
- ✅ **Configuración corregida**: `mcp.json` actualizado
- ✅ **Paginación automática**: Sin límites de resultados
- ✅ **144 herramientas MCP**: Listas para usar

## 📝 Próximos Pasos

1. **Actualizar credenciales** en `mcp.json`
2. **Reiniciar VS Code**
3. **Probar herramientas** con datos reales
4. **Explorar funcionalidades** avanzadas

---

🎉 **¡MCP Redmine configurado y listo para usar!** 🎉
