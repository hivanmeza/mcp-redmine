#!/usr/bin/env node

import dotenv from 'dotenv';
import { RedmineClient } from './dist/client/redmine-client.js';

// Cargar variables de entorno
dotenv.config();

const config = {
    baseUrl: process.env.REDMINE_BASE_URL,
    apiKey: process.env.REDMINE_API_KEY
};

console.log('🎫 Obteniendo tareas del proyecto dev_cdp...');

try {
    const client = new RedmineClient(config);

    // Obtener tareas del proyecto dev_cdp con filtros específicos
    const filters = {
        project_id: 'dev_cdp',  // ID del proyecto dev_cdp
        status_id: '1,2',       // Status 1=Nueva, 2=En proceso
    };

    const issues = await client.getIssues(filters);

    console.log(`✅ Total de tareas encontradas: ${issues.length}`);
    console.log('📄 LISTA DE TAREAS DEL PROYECTO DEV_CDP:');
    console.log('='.repeat(80));

    issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.subject}`);
        console.log(`   🆔 ID: ${issue.id}`);
        console.log(`   📊 Estado: ${issue.status?.name || 'N/A'}`);
        console.log(`   👤 Asignado a: ${issue.assigned_to?.name || 'Sin asignar'}`);
        console.log(`   📅 Creado: ${issue.created_on ? new Date(issue.created_on).toLocaleDateString('es-ES') : 'N/A'}`);
        console.log(`   🔄 Actualizado: ${issue.updated_on ? new Date(issue.updated_on).toLocaleDateString('es-ES') : 'N/A'}`);
        if (issue.description && issue.description.length > 0) {
            const shortDesc = issue.description.length > 100
                ? issue.description.substring(0, 97) + '...'
                : issue.description;
            console.log(`   📝 Descripción: ${shortDesc}`);
        }
        console.log('-'.repeat(80));
    });

    // Mostrar estadísticas por estado
    const statusCount = {};
    issues.forEach(issue => {
        const status = issue.status?.name || 'Sin estado';
        statusCount[status] = (statusCount[status] || 0) + 1;
    });

    console.log('\n📊 ESTADÍSTICAS POR ESTADO:');
    console.log('='.repeat(40));
    Object.entries(statusCount).forEach(([status, count]) => {
        console.log(`${status}: ${count} tareas`);
    });

} catch (error) {
    console.error('❌ Error al obtener las tareas:', error.message);
    if (error.response) {
        console.error('📡 Respuesta del servidor:', error.response.status, error.response.statusText);
        console.error('📄 Datos de respuesta:', error.response.data);
    }
}
