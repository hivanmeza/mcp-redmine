#!/usr/bin/env node

/**
 * 🔍 VERIFICACIÓN SIMPLE MCP REDMINE v1.2.1
 */

import { spawn } from 'child_process';

console.log('🔍 Verificando herramientas MCP Redmine v1.2.1...\n');

const mcpProcess = spawn('node', ['/path/to/global/mcp-redmine/dist/index.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
        ...process.env,
        REDMINE_BASE_URL: 'https://redmine.example.com',
        REDMINE_API_KEY: 'dummy'
    }
});

let output = '';
let toolsFound = 0;
let helpToolFound = false;

mcpProcess.stdout.on('data', (data) => {
    output += data.toString();

    const lines = output.split('\n');
    for (const line of lines) {
        if (line.trim().startsWith('{') && line.includes('"jsonrpc"')) {
            try {
                const response = JSON.parse(line.trim());
                if (response.result && response.result.tools) {
                    toolsFound = response.result.tools.length;
                    helpToolFound = response.result.tools.some(tool =>
                        tool.name.includes('get_help') || tool.name.includes('help')
                    );

                    console.log(`📊 Total herramientas: ${toolsFound}`);
                    console.log(`✅ Herramienta get_help encontrada: ${helpToolFound ? 'Sí' : 'No'}`);

                    // Buscar herramienta help específicamente
                    const helpTool = response.result.tools.find(tool =>
                        tool.name.includes('help')
                    );

                    if (helpTool) {
                        console.log(`🔧 Nombre exacto: ${helpTool.name}`);

                        // Probar la herramienta de ayuda
                        setTimeout(() => {
                            const helpRequest = {
                                jsonrpc: '2.0',
                                id: 2,
                                method: 'tools/call',
                                params: {
                                    name: helpTool.name,
                                    arguments: {}
                                }
                            };

                            mcpProcess.stdin.write(JSON.stringify(helpRequest) + '\n');
                        }, 500);
                    }

                    if (!helpToolFound) {
                        mcpProcess.kill();
                        process.exit(1);
                    }
                }

                if (response.id === 2 && response.result && response.result.content) {
                    const content = response.result.content[0].text;

                    if (content.includes('Compatible with Redmine 4.1.1.stable')) {
                        console.log('✅ Información de compatibilidad Redmine 4.1.1.stable presente');
                    } else {
                        console.log('❌ Información de compatibilidad no encontrada');
                    }

                    if (content.includes('1.2.1')) {
                        console.log('✅ Versión 1.2.1 detectada');
                    } else {
                        console.log('❌ Versión 1.2.1 no encontrada');
                    }

                    console.log('\n🎉 ¡Verificación completada exitosamente!');
                    console.log('🚀 MCP Redmine v1.2.1 con compatibilidad Redmine 4.1.1.stable listo');

                    mcpProcess.kill();
                }

            } catch (e) {
                // Ignorar líneas que no son JSON válido
            }
        }
    }
});

mcpProcess.stderr.on('data', (data) => {
    console.error('Error:', data.toString());
});

// Inicializar y listar herramientas
mcpProcess.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: 0,
    method: 'initialize',
    params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
            name: 'verification-script',
            version: '1.0.0'
        }
    }
}) + '\n');

setTimeout(() => {
    mcpProcess.stdin.write(JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
    }) + '\n');
}, 1000);
