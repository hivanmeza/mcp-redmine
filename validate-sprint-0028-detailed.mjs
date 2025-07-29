#!/usr/bin/env node

import dotenv from 'dotenv';
import { RedmineClient } from './dist/client/redmine-client.js';

// Cargar variables de entorno
dotenv.config();

const config = {
    baseUrl: process.env.REDMINE_BASE_URL,
    apiKey: process.env.REDMINE_API_KEY
};

console.log('🔍 VALIDACIÓN DETALLADA - Sprint 0028 con Paginación Completa');
console.log('=' * 80);

async function validateWithFullPagination() {
    try {
        const client = new RedmineClient(config);

        console.log('\n📋 PASO 1: Obtener TODOS los proyectos DEV');
        const allProjects = await client.getProjects();
        const devProjects = allProjects.filter(project =>
            project.identifier?.toLowerCase().includes('dev') ||
            project.name?.toLowerCase().includes('dev')
        );

        console.log(`✅ Total proyectos en sistema: ${allProjects.length}`);
        console.log(`✅ Proyectos DEV encontrados: ${devProjects.length}`);

        console.log('\n📋 PASO 2: Obtener TODAS las tareas con paginación manual');

        let grandTotalIssues = 0;
        let grandTotalSprint0028 = 0;
        const detailedResults = [];

        for (const project of devProjects) {
            console.log(`\n🔍 Analizando: ${project.name} (${project.identifier})`);

            try {
                // Obtener TODAS las tareas del proyecto usando paginación manual
                let allProjectIssues = [];
                let offset = 0;
                const limit = 100;
                let hasMore = true;

                while (hasMore) {
                    const batchIssues = await client.getIssues({
                        project_id: project.identifier,
                        include: 'custom_fields',
                        limit: limit,
                        offset: offset
                    });

                    console.log(`   📦 Batch offset ${offset}: ${batchIssues.length} tareas`);

                    if (batchIssues.length === 0) {
                        hasMore = false;
                    } else {
                        allProjectIssues.push(...batchIssues);
                        offset += limit;

                        // Si obtuvimos menos del límite, es la última página
                        if (batchIssues.length < limit) {
                            hasMore = false;
                        }
                    }
                }

                console.log(`   📊 TOTAL tareas en proyecto: ${allProjectIssues.length}`);

                // Filtrar tareas del Sprint 0028
                const sprint0028Issues = allProjectIssues.filter(issue => {
                    if (issue.custom_fields && Array.isArray(issue.custom_fields)) {
                        return issue.custom_fields.some(field => {
                            const fieldName = field.name?.toLowerCase() || '';
                            const fieldValue = field.value?.toString() || '';
                            return (fieldName.includes('sprint') || fieldName.includes('iteration'))
                                && fieldValue.includes('0028');
                        });
                    }
                    return false;
                });

                const result = {
                    project: project.name,
                    identifier: project.identifier,
                    totalIssues: allProjectIssues.length,
                    sprint0028Count: sprint0028Issues.length,
                    pagesProcessed: Math.ceil(allProjectIssues.length / limit)
                };

                detailedResults.push(result);
                grandTotalIssues += allProjectIssues.length;
                grandTotalSprint0028 += sprint0028Issues.length;

                if (sprint0028Issues.length > 0) {
                    console.log(`   ✅ Sprint 0028: ${sprint0028Issues.length} tareas encontradas`);

                    // Mostrar algunas tareas de ejemplo
                    console.log(`   📋 Ejemplos:`);
                    sprint0028Issues.slice(0, 3).forEach((issue, index) => {
                        console.log(`      ${index + 1}. ${issue.subject} (ID: ${issue.id})`);
                    });
                } else {
                    console.log(`   ⚪ Sin tareas del Sprint 0028`);
                }

            } catch (error) {
                console.log(`   ❌ Error: ${error.message}`);
                detailedResults.push({
                    project: project.name,
                    identifier: project.identifier,
                    totalIssues: 0,
                    sprint0028Count: 0,
                    error: error.message
                });
            }
        }

        console.log('\n' + '='.repeat(100));
        console.log('📊 RESULTADOS FINALES CON PAGINACIÓN COMPLETA');
        console.log('='.repeat(100));

        console.log(`📈 Total proyectos DEV analizados: ${devProjects.length}`);
        console.log(`📈 Total tareas analizadas: ${grandTotalIssues}`);
        console.log(`🎯 Tareas del Sprint 0028 encontradas: ${grandTotalSprint0028}`);

        console.log('\n📋 DESGLOSE DETALLADO POR PROYECTO:');
        console.log('-'.repeat(100));
        console.log('PROYECTO'.padEnd(30) + 'TOTAL TAREAS'.padEnd(15) + 'SPRINT 0028'.padEnd(15) + 'PÁGINAS');
        console.log('-'.repeat(100));

        detailedResults.forEach(result => {
            const pages = result.pagesProcessed || 0;
            console.log(
                result.identifier.padEnd(30) +
                result.totalIssues.toString().padEnd(15) +
                result.sprint0028Count.toString().padEnd(15) +
                pages.toString()
            );
        });

        // Comparar con resultado anterior
        console.log('\n🔍 COMPARACIÓN DE RESULTADOS:');
        console.log('-'.repeat(60));
        console.log(`Primera ejecución: 907 tareas Sprint 0028`);
        console.log(`Segunda ejecución: 317 tareas Sprint 0028`);
        console.log(`Esta ejecución:    ${grandTotalSprint0028} tareas Sprint 0028`);

        // Proyectos con más tareas Sprint 0028
        const topProjects = detailedResults
            .filter(p => p.sprint0028Count > 0)
            .sort((a, b) => b.sprint0028Count - a.sprint0028Count)
            .slice(0, 10);

        console.log('\n🏆 TOP 10 PROYECTOS CON MÁS TAREAS SPRINT 0028:');
        console.log('-'.repeat(60));
        topProjects.forEach((project, index) => {
            console.log(`${(index + 1).toString().padStart(2)}. ${project.identifier.padEnd(25)} - ${project.sprint0028Count} tareas`);
        });

        return {
            totalProjects: devProjects.length,
            totalIssues: grandTotalIssues,
            totalSprint0028: grandTotalSprint0028,
            results: detailedResults
        };

    } catch (error) {
        console.error('❌ Error en validación:', error.message);
        throw error;
    }
}

// Ejecutar validación
validateWithFullPagination()
    .then(results => {
        console.log('\n🎉 VALIDACIÓN COMPLETA EXITOSA');
        console.log(`📊 RESULTADO FINAL: ${results.totalSprint0028} tareas del Sprint 0028`);
        console.log(`📈 Procesadas: ${results.totalIssues} tareas totales en ${results.totalProjects} proyectos DEV`);
    })
    .catch(error => {
        console.error('💥 Error en la validación:', error.message);
        process.exit(1);
    });
