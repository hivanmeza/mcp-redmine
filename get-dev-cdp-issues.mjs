#!/usr/bin/env node

// Script para obtener issues del proyecto DEV_CDP con estados específicos
import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar el servidor MCP
const serverPath = join(__dirname, 'dist', 'index.js');

console.log('🚀 Iniciando MCP Server de Redmine...\n');

const mcpServer = spawn('node', [serverPath], {
    stdio: 'pipe',
    env: {
        ...process.env,
        REDMINE_BASE_URL: 'https://your-redmine-server.com/redmine',
        REDMINE_API_KEY: 'your-api-key-here',
        LOG_LEVEL: 'info'
    }
});

// Función para enviar mensaje al servidor MCP
function sendMCPMessage(message) {
    return new Promise((resolve, reject) => {
        const messageStr = JSON.stringify(message) + '\n';

        let response = '';
        const timeout = setTimeout(() => {
            reject(new Error('Timeout esperando respuesta del servidor MCP'));
        }, 15000);

        const dataHandler = (data) => {
            response += data.toString();
            const lines = response.split('\n');

            for (const line of lines) {
                if (line.trim()) {
                    try {
                        const parsed = JSON.parse(line);
                        if (parsed.id === message.id) {
                            clearTimeout(timeout);
                            mcpServer.stdout.removeListener('data', dataHandler);
                            resolve(parsed);
                            return;
                        }
                    } catch (e) {
                        // Ignorar líneas que no son JSON válido
                    }
                }
            }
        };

        mcpServer.stdout.on('data', dataHandler);
        mcpServer.stdin.write(messageStr);
    });
}

// Obtener issues del proyecto DEV_CDP
async function getDevCdpIssues() {

    try {
        // 1. Inicializar
        console.log('📡 Inicializando servidor MCP...');
        let initResponse;
        try {
            initResponse = await sendMCPMessage({
                jsonrpc: '2.0',
                id: 1,
                method: 'initialize',
                params: {
                    protocolVersion: '2024-11-05',
                    capabilities: {
                        roots: { listChanged: true },
                        sampling: {}
                    },
                    clientInfo: {
                        name: 'dev-cdp-issues-client',
                        version: '1.0.0'
                    }
                }
            });
        } catch (err) {
            console.error('❌ No se pudo inicializar la API MCP. ¿Está corriendo el servidor?');
            throw err;
        }

        if (!initResponse || !initResponse.result) {
            console.error('❌ La API MCP no respondió correctamente a initialize.');
            process.exit(1);
        }
        console.log('✅ Servidor inicializado');

        // CONSULTA DE USUARIOS
        console.log('\n👥 Obteniendo listado de usuarios de Redmine...');
        let usersResponse;
        try {
            usersResponse = await sendMCPMessage({
                jsonrpc: '2.0',
                id: 2,
                method: 'tools/call',
                params: {
                    name: 'list_users',
                    arguments: {
                        limit: 100
                    }
                }
            });
        } catch (err) {
            console.error('❌ No se pudo consultar usuarios. ¿La API MCP está activa?');
            throw err;
        }

        if (usersResponse.result && usersResponse.result.content) {
            const content = usersResponse.result.content[0];
            if (content.type === 'text') {
                const users = JSON.parse(content.text);
                console.log(`\n📋 Usuarios encontrados (${users.length}):`);
                users.forEach((user, idx) => {
                    console.log(`${idx + 1}. 👤 ${user.firstname} ${user.lastname} (${user.login}) - ID: ${user.id}`);
                });
            } else {
                console.log('❌ Formato de respuesta inesperado al listar usuarios');
            }
        } else {
            console.log('❌ Error obteniendo usuarios:', usersResponse.error || 'Respuesta inesperada');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        mcpServer.kill();
        process.exit(0);
    }
}

// Manejar errores del proceso
mcpServer.on('error', (error) => {
    console.error('❌ Error del servidor MCP:', error);
    process.exit(1);
});

mcpServer.stderr.on('data', (data) => {
    console.error('stderr:', data.toString());
});

// Esperar un momento para que el servidor se inicie
setTimeout(() => {
    getDevCdpIssues();
}, 1000);
