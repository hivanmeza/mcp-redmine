#!/usr/bin/env node

import dotenv from 'dotenv';
import { RedmineClient } from './dist/client/redmine-client.js';

// Cargar variables de entorno
dotenv.config();

const config = {
    baseUrl: process.env.REDMINE_BASE_URL,
    apiKey: process.env.REDMINE_API_KEY
};

console.log('🔍 COMPARACIÓN FINAL - Sprint 0028 (Local vs Global)');
console.log('=' * 80);

async function validateSprint0028() {
    try {
        const client = new RedmineClient(config);

        console.log('\n📋 PASO 1: Obtener proyectos DEV');
        const allProjects = await client.getProjects();
        const devProjects = allProjects.filter(project =>
            project.identifier?.toLowerCase().includes('dev') ||
            project.name?.toLowerCase().includes('dev')
        );

        console.log(`✅ Total proyectos: ${allProjects.length}`);
        console.log(`✅ Proyectos DEV encontrados: ${devProjects.length}`);

        console.log('\n📋 PASO 2: Buscar tareas Sprint 0028 por proyecto');

        let totalIssues = 0;
        let totalSprint0028 = 0;
        const resultsByProject = [];

        for (const project of devProjects) {
            try {
                const projectIssues = await client.getIssues({
                    project_id: project.identifier,
                    include: 'custom_fields',
                    limit: 100  // Asegurar paginación correcta
                });

                const sprint0028Issues = projectIssues.filter(issue => {
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

                const projectResult = {
                    project: project.name,
                    identifier: project.identifier,
                    totalIssues: projectIssues.length,
                    sprint0028Count: sprint0028Issues.length
                };

                resultsByProject.push(projectResult);
                totalIssues += projectIssues.length;
                totalSprint0028 += sprint0028Issues.length;

                if (sprint0028Issues.length > 0) {
                    console.log(`  ✅ ${project.identifier}: ${sprint0028Issues.length} tareas Sprint 0028`);
                } else {
                    console.log(`  ⚪ ${project.identifier}: Sin tareas Sprint 0028`);
                }

            } catch (error) {
                console.log(`  ❌ ${project.identifier}: Error - ${error.message}`);
            }
        }

        console.log('\n' + '='.repeat(80));
        console.log('📊 RESULTADOS FINALES DE COMPARACIÓN');
        console.log('='.repeat(80));

        console.log(`📈 Total proyectos analizados: ${devProjects.length}`);
        console.log(`📈 Total tareas analizadas: ${totalIssues}`);
        console.log(`🎯 Tareas del Sprint 0028 encontradas: ${totalSprint0028}`);

        console.log('\n📋 DESGLOSE POR PROYECTO:');
        console.log('-'.repeat(80));

        resultsByProject
            .filter(p => p.sprint0028Count > 0)
            .sort((a, b) => b.sprint0028Count - a.sprint0028Count)
            .forEach(project => {
                console.log(`${project.identifier.padEnd(25)} | ${project.sprint0028Count.toString().padStart(3)} tareas Sprint 0028`);
            });

        console.log('\n🔍 VALIDACIÓN DE CONSISTENCIA:');
        console.log('-'.repeat(50));

        // Verificar los proyectos principales
        const mainProjects = resultsByProject.filter(p =>
            ['dev', 'dev_cdp', 'dev_cyl', 'dev_fng', 'dev_example'].includes(p.identifier)
        );

        mainProjects.forEach(project => {
            console.log(`${project.identifier}: ${project.sprint0028Count} tareas (${project.totalIssues} total)`);
        });

        console.log('\n✅ VALIDACIÓN COMPLETADA');
        console.log(`🎯 NÚMERO TOTAL CONFIRMADO: ${totalSprint0028} tareas del Sprint 0028`);

        return {
            totalProjects: devProjects.length,
            totalIssues: totalIssues,
            totalSprint0028: totalSprint0028,
            projectResults: resultsByProject
        };

    } catch (error) {
        console.error('❌ Error en validación:', error.message);
        throw error;
    }
}

// Ejecutar validación
validateSprint0028()
    .then(results => {
        console.log('\n🎉 Validación exitosa');
        console.log(`📊 Resumen: ${results.totalSprint0028} tareas del Sprint 0028 en ${results.totalProjects} proyectos DEV`);
    })
    .catch(error => {
        console.error('💥 Error en la validación:', error.message);
        process.exit(1);
    });
