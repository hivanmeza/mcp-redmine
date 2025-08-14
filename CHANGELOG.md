# Changelog

## [1.2.0] - 2025-01-29

### 🎯 Compatibilidad
- **Redmine 4.1.1.stable**: Desarrollado y optimizado específicamente para esta versión
- Garantía de funcionalidad completa con Redmine 4.1.1.stable
- Compatibilidad con otras versiones no garantizada

### ✨ Nueva Funcionalidad
- **🆕 Herramienta de Ayuda Integrada**: Nueva herramienta `get_help` para autodocumentación
  - Ayuda general de todas las herramientas disponibles
  - Documentación específica por herramienta individual
  - Filtrado por categorías (issues, projects, admin, etc.)
  - Múltiples formatos de salida (markdown, json, plain)
  - Ejemplos de uso y respuestas para cada herramienta
  - Documentación siempre actualizada con la versión instalada

### 📊 Mejoras en la Experiencia de Usuario
- **Self-Service**: Los usuarios pueden descubrir herramientas sin documentación externa
- **Onboarding**: Facilita el aprendizaje para nuevos usuarios
- **Productividad**: Reduce tiempo de consulta de documentación
- **Ejemplos Prácticos**: Cada herramienta incluye ejemplos de uso reales

### 🔧 Detalles Técnicos
- Total de herramientas documentadas: 43 (incluye nueva herramienta de ayuda)
- Categorías organizadas: issues, projects, admin, advanced-admin, project-management, content-management, search
- Formatos soportados: markdown (default), json, plain text
- Documentación auto-generada desde definiciones de herramientas

### 📚 Ejemplos de Uso de la Nueva Herramienta

**Ayuda general:**
```json
{
  "tool_name": "get_help"
}
```

**Ayuda específica de herramienta:**
```json
{
  "tool_name": "get_help",
  "arguments": {
    "tool_name": "create_issue"
  }
}
```

**Ayuda por categoría:**
```json
{
  "tool_name": "get_help", 
  "arguments": {
    "category": "issues"
  }
}
```

**Formato JSON:**
```json
{
  "tool_name": "get_help",
  "arguments": {
    "tool_name": "get_issue",
    "format": "json"
  }
}
```

## [1.1.1] - 2025-01-29

### Arreglado
- **CRÍTICO**: Corregido error de validación de esquemas en runtime
  - Error: "tool.inputSchema.parse is not a function"
  - Causa: zodToJsonSchema convierte Zod schemas a JSON Schema, pero MCP SDK espera Zod schemas con método parse()
  - Solución: Patrón dual schema - mantiene Zod schema para validación runtime y JSON Schema para exposición MCP
  - Afectaba todas las 42 herramientas del servidor
- Implementado script automatizado para actualizar esquemas en todos los archivos de herramientas
- Todas las herramientas ahora validan correctamente argumentos en runtime
- Mantiene compatibilidad con Visual Studio 2022 mediante JSON Schema en protocolo MCP

### Técnico
- Cada herramienta ahora tiene:
  - `inputSchema`: Schema Zod original para validación runtime
  - `jsonSchema`: JSON Schema convertido para protocolo MCP
- Modificado `ListToolsRequestSchema` handler para usar `jsonSchema` en respuesta
- Todas las herramientas compilan y ejecutan sin errores

## [1.1.0] - 2025-01-29hangelog

## [1.1.0] - 2025-01-28

### ✨ Added
- **Nueva herramienta `get_issue_journals`**: Obtener historial completo y comentarios de issues
- **Compatibilidad con Visual Studio 2022**: Todas las herramientas ahora usan JSON Schema
- **Conversión automática Zod a JSON Schema**: Usando `zod-to-json-schema`

### 🔧 Changed
- **Actualización de schemas**: Migración de Zod directo a JSON Schema para compatibilidad MCP
- **Mejora en herramientas de issues**: Mayor información disponible en respuestas

### 🐛 Fixed
- **Corrección de sintaxis**: Solucionados errores de compilación en múltiples archivos
- **Importaciones**: Arregladas importaciones corruptas en content-management-tools

### 📚 Documentation
- **Guías de instalación**: Documentación para Visual Studio 2022
- **Pruebas de funcionalidad**: Ejemplos completos de uso

### 🛠️ Technical Details
- **42 herramientas** disponibles con JSON Schema válido
- **6 categorías** de herramientas: Issues, Search, Projects, Admin, Advanced Admin, Project Management, Content Management
- **Compilación sin errores** en TypeScript
- **Instalación global** funcionando correctamente

## [1.0.0] - 2025-01-15

### ✨ Initial Release
- **Herramientas básicas de Redmine**: Issues, Projects, Users, etc.
- **Protocolo MCP**: Implementación completa del protocolo
- **Cliente Redmine**: Wrapper completo de la API de Redmine
- **Autenticación**: Soporte para API Key y usuario/contraseña
