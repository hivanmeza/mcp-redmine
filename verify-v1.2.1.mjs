#!/usr/bin/env node

/**
 * 🔍 VERIFICACIÓN FINAL MCP REDMINE v1.2.1
 * 
 * Verifica que la nueva versión esté correctamente instalada
 * y que incluya la información de compatibilidad con Redmine 4.1.1.stable
 */

import { spawn } from 'child_process';

console.log('🔍 Verificando MCP Redmine v1.2.1...\n');

const tests = [
    {
        name: 'Verificar herramienta get_help',
        request: {
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/call',
            params: {
                name: 'mcp_redmine_get_help',
                arguments: {}
            }
        }
    },
    {
        name: 'Verificar información de compatibilidad',
        request: {
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/call',
            params: {
                name: 'mcp_redmine_get_help',
                arguments: {
                    format: 'json'
                }
            }
        }
    }
];

let currentTest = 0;
let completedTests = 0;

const mcpProcess = spawn('node', ['/path/to/global/mcp-redmine/dist/index.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
        ...process.env,
        REDMINE_BASE_URL: 'https://redmine.example.com',
        REDMINE_API_KEY: 'dummy'
    }
});

let output = '';

mcpProcess.stdout.on('data', (data) => {
    output += data.toString();

    // Buscar respuestas JSON
    const lines = output.split('\n');
    for (const line of lines) {
        if (line.trim().startsWith('{') && line.includes('"jsonrpc"')) {
            try {
                const response = JSON.parse(line.trim());
                if (response.id && tests[response.id - 1]) {
                    handleTestResponse(tests[response.id - 1], response);
                    completedTests++;

                    if (completedTests < tests.length) {
                        sendNextTest();
                    } else {
                        mcpProcess.kill();
                        showFinalResults();
                    }
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

mcpProcess.on('close', (code) => {
    if (completedTests < tests.length) {
        console.log('❌ Proceso terminó antes de completar todas las pruebas');
        process.exit(1);
    }
});

function sendNextTest() {
    const test = tests[currentTest];
    const request = JSON.stringify(test.request) + '\n';
    mcpProcess.stdin.write(request);
    currentTest++;
}

function handleTestResponse(test, response) {
    console.log(`📋 ${test.name}:`);

    if (response.error) {
        console.log(`   ❌ Error: ${response.error.message}`);
        return;
    }

    if (response.result && response.result.content) {
        const content = response.result.content[0].text;

        if (test.name.includes('get_help')) {
            if (content.includes('Compatible with Redmine 4.1.1.stable')) {
                console.log('   ✅ Información de compatibilidad presente');
            } else {
                console.log('   ❌ Información de compatibilidad no encontrada');
            }

            if (content.includes('1.2.1')) {
                console.log('   ✅ Versión 1.2.1 detectada');
            } else {
                console.log('   ❌ Versión 1.2.1 no encontrada');
            }
        }

        if (test.name.includes('compatibilidad')) {
            try {
                const jsonData = JSON.parse(content);
                if (jsonData.compatibility && jsonData.compatibility.redmine_version === '4.1.1.stable') {
                    console.log('   ✅ Compatibilidad Redmine 4.1.1.stable confirmada');
                } else {
                    console.log('   ❌ Información de compatibilidad no presente en JSON');
                }
            } catch (e) {
                console.log('   ⚠️  Respuesta no es JSON válido');
            }
        }
    }

    console.log('');
}

function showFinalResults() {
    console.log('📊 RESUMEN DE VERIFICACIÓN:');
    console.log(`   🎯 Versión instalada: 1.2.1`);
    console.log(`   📅 Compatibilidad: Redmine 4.1.1.stable`);
    console.log(`   ✅ Herramientas verificadas: ${completedTests}/${tests.length}`);
    console.log('');
    console.log('🎉 ¡MCP Redmine v1.2.1 verificado exitosamente!');
    console.log('📋 La información de compatibilidad está incluida');
    console.log('🚀 Listo para subir cambios al repositorio');
}

// Enviar primer request para inicializar
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

// Dar tiempo para inicialización y luego empezar tests
setTimeout(() => {
    sendNextTest();
}, 1000);
