#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Lista de archivos de tools a actualizar
const toolFiles = [
    'src/tools/project-tools.ts',
    'src/tools/admin-tools.ts',
    'src/tools/advanced-admin-tools.ts',
    'src/tools/project-management-tools.ts',
    'src/tools/content-management-tools.ts'
];

for (const filePath of toolFiles) {
    try {
        console.log(`Updating ${filePath}...`);

        // Leer el archivo
        let content = fs.readFileSync(filePath, 'utf8');

        // Verificar si ya tiene zodToJsonSchema importado
        if (!content.includes('zodToJsonSchema')) {
            // Agregar import de zodToJsonSchema
            content = content.replace(
                "import { z } from 'zod';",
                "import { z } from 'zod';\nimport { zodToJsonSchema } from 'zod-to-json-schema';"
            );
        }

        // Reemplazar todos los inputSchema: z.object con zodToJsonSchema
        content = content.replace(/inputSchema: z\.object\(/g, 'inputSchema: zodToJsonSchema(z.object(');

        // Escribir el archivo actualizado
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Updated ${filePath}`);

    } catch (error) {
        console.error(`✗ Error updating ${filePath}:`, error.message);
    }
}

console.log('Done updating tool files!');
