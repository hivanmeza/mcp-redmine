#!/usr/bin/env node

import dotenv from 'dotenv';
import { RedmineClient } from './dist/client/redmine-client.js';

// Cargar variables de entorno
dotenv.config();

const config = {
    baseUrl: process.env.REDMINE_BASE_URL,
    apiKey: process.env.REDMINE_API_KEY
};

console.log('🔍 Validando tareas del Sprint 0028 - Proyecto DEV y subproyectos...');
console.log('📋 Buscando en campo personalizado "Sprint" con valor "0028"');

try {
    const client = new RedmineClient(config);

    // Primero obtener todos los proyectos que contengan "dev"
    console.log('📋 Obteniendo proyectos relacionados con DEV...');
    const allProjects = await client.getProjects();

    // Filtrar proyectos que contengan "dev" en su identificador o nombre
    const devProjects = allProjects.filter(project =>
        project.identifier?.toLowerCase().includes('dev') ||
        project.name?.toLowerCase().includes('dev')
    );

    console.log(`✅ Encontrados ${devProjects.length} proyectos DEV:`);
    devProjects.forEach((project, index) => {
        console.log(`${index + 1}. ${project.name} (${project.identifier})`);
    });

    console.log('\n🎯 Buscando tareas con campo personalizado Sprint = "0028"...');

    let totalIssues = 0;
    const sprintIssues = [];

    // Buscar en cada proyecto DEV las tareas que contengan "0028" en el asunto o descripción
    for (const project of devProjects) {
        console.log(`\n🔍 Analizando proyecto: ${project.name} (${project.identifier})`);

        try {
            // Obtener todas las tareas del proyecto incluyendo campos personalizados
            const projectIssues = await client.getIssues({
                project_id: project.identifier,
                include: 'custom_fields'
            });

            console.log(`   📊 Total tareas en proyecto: ${projectIssues.length}`);

            // Filtrar tareas que tengan "0028" en el campo personalizado Sprint
            const sprint0028Issues = projectIssues.filter(issue => {
                // Buscar en campos personalizados (custom_fields)
                if (issue.custom_fields && Array.isArray(issue.custom_fields)) {
                    return issue.custom_fields.some(field => {
                        // Buscar campo que sea "Sprint" o similar
                        const fieldName = field.name?.toLowerCase() || '';
                        const fieldValue = field.value?.toString() || '';

                        return (fieldName.includes('sprint') || fieldName.includes('iteration'))
                            && fieldValue.includes('0028');
                    });
                }
                return false;
            });

            if (sprint0028Issues.length > 0) {
                console.log(`   ✅ Tareas del Sprint 0028 encontradas: ${sprint0028Issues.length}`);
                sprintIssues.push(...sprint0028Issues.map(issue => ({
                    ...issue,
                    project_name: project.name,
                    project_id: project.identifier
                })));
            } else {
                console.log(`   ⚪ No se encontraron tareas del Sprint 0028`);
            }

            totalIssues += projectIssues.length;

        } catch (error) {
            console.log(`   ❌ Error al obtener tareas del proyecto ${project.identifier}: ${error.message}`);
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 RESUMEN SPRINT 0028 - PROYECTO DEV Y SUBPROYECTOS');
    console.log('='.repeat(80));

    console.log(`📈 Total proyectos analizados: ${devProjects.length}`);
    console.log(`📈 Total tareas analizadas: ${totalIssues}`);
    console.log(`🎯 Tareas del Sprint 0028 encontradas: ${sprintIssues.length}`);

    if (sprintIssues.length > 0) {
        console.log('\n📋 DETALLE DE TAREAS DEL SPRINT 0028:');
        console.log('='.repeat(80));

        // Agrupar por proyecto
        const issuesByProject = {};
        sprintIssues.forEach(issue => {
            if (!issuesByProject[issue.project_id]) {
                issuesByProject[issue.project_id] = {
                    name: issue.project_name,
                    issues: []
                };
            }
            issuesByProject[issue.project_id].issues.push(issue);
        });

        // Mostrar tareas agrupadas por proyecto
        Object.entries(issuesByProject).forEach(([projectId, projectData]) => {
            console.log(`\n🏗️ PROYECTO: ${projectData.name} (${projectId})`);
            console.log(`   📊 Tareas del Sprint 0028: ${projectData.issues.length}`);
            console.log('-'.repeat(80));

            projectData.issues.forEach((issue, index) => {
                console.log(`${index + 1}. ${issue.subject}`);
                console.log(`   🆔 ID: ${issue.id}`);
                console.log(`   📊 Estado: ${issue.status?.name || 'N/A'}`);
                console.log(`   👤 Asignado a: ${issue.assigned_to?.name || 'Sin asignar'}`);
                console.log(`   🏷️ Tracker: ${issue.tracker?.name || 'N/A'}`);
                console.log(`   📅 Creado: ${issue.created_on ? new Date(issue.created_on).toLocaleDateString('es-ES') : 'N/A'}`);
                console.log(`   🔄 Actualizado: ${issue.updated_on ? new Date(issue.updated_on).toLocaleDateString('es-ES') : 'N/A'}`);

                // Mostrar campos personalizados relacionados con Sprint
                if (issue.custom_fields && Array.isArray(issue.custom_fields)) {
                    const sprintFields = issue.custom_fields.filter(field => {
                        const fieldName = field.name?.toLowerCase() || '';
                        return fieldName.includes('sprint') || fieldName.includes('iteration');
                    });

                    sprintFields.forEach(field => {
                        console.log(`   🏃 ${field.name}: ${field.value || 'Sin valor'}`);
                    });
                }

                if (issue.description && issue.description.length > 0) {
                    const shortDesc = issue.description.length > 150
                        ? issue.description.substring(0, 147) + '...'
                        : issue.description;
                    console.log(`   📝 Descripción: ${shortDesc}`);
                }
                console.log('-'.repeat(40));
            });
        });

        // Estadísticas por estado
        console.log('\n📊 ESTADÍSTICAS POR ESTADO:');
        console.log('='.repeat(40));
        const statusCount = {};
        sprintIssues.forEach(issue => {
            const status = issue.status?.name || 'Sin estado';
            statusCount[status] = (statusCount[status] || 0) + 1;
        });

        Object.entries(statusCount).forEach(([status, count]) => {
            console.log(`${status}: ${count} tareas`);
        });

        // Estadísticas por asignado
        console.log('\n👥 ESTADÍSTICAS POR ASIGNADO:');
        console.log('='.repeat(40));
        const assignedCount = {};
        sprintIssues.forEach(issue => {
            const assigned = issue.assigned_to?.name || 'Sin asignar';
            assignedCount[assigned] = (assignedCount[assigned] || 0) + 1;
        });

        Object.entries(assignedCount).forEach(([assigned, count]) => {
            console.log(`${assigned}: ${count} tareas`);
        });

        // Estadísticas por tracker
        console.log('\n🏷️ ESTADÍSTICAS POR TRACKER:');
        console.log('='.repeat(40));
        const trackerCount = {};
        sprintIssues.forEach(issue => {
            const tracker = issue.tracker?.name || 'Sin tracker';
            trackerCount[tracker] = (trackerCount[tracker] || 0) + 1;
        });

        Object.entries(trackerCount).forEach(([tracker, count]) => {
            console.log(`${tracker}: ${count} tareas`);
        });

    } else {
        console.log('\n⚠️ No se encontraron tareas del Sprint 0028 en los proyectos DEV analizados.');
        console.log('💡 Verifica que:');
        console.log('   - Las tareas tengan un campo personalizado "Sprint" con valor "0028"');
        console.log('   - Los proyectos DEV estén correctamente identificados');
        console.log('   - Tienes permisos para ver las tareas y campos personalizados de estos proyectos');
        console.log('   - El campo personalizado Sprint esté configurado correctamente en Redmine');
    }

} catch (error) {
    console.error('❌ Error al validar las tareas del Sprint 0028:', error.message);
    if (error.response) {
        console.error('📡 Respuesta del servidor:', error.response.status, error.response.statusText);
        console.error('📄 Datos de respuesta:', error.response.data);
    }
}
