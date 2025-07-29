#!/usr/bin/env node

import * as dotenv from 'dotenv';
import { RedmineClient } from './client/redmine-client.js';

// Load environment variables
dotenv.config();

async function listProjects() {
    try {
        console.log('📋 Obteniendo lista completa de proyectos...\n');

        const baseUrl = process.env.REDMINE_BASE_URL;
        const apiKey = process.env.REDMINE_API_KEY;

        if (!baseUrl || !apiKey) {
            throw new Error('REDMINE_BASE_URL and REDMINE_API_KEY environment variables are required');
        }

        const client = new RedmineClient({
            baseUrl,
            apiKey
        });

        // El cliente ahora itera automáticamente hasta obtener todos los proyectos
        const projects = await client.getProjects();

        console.log(`✅ Total de proyectos encontrados: ${projects.length}\n`);
        console.log('📄 LISTA DETALLADA DE PROYECTOS:\n');
        console.log('='.repeat(80));

        projects.forEach((project, index) => {
            console.log(`${index + 1}. ${project.name}`);
            console.log(`   📍 Identificador: ${project.identifier}`);
            console.log(`   📊 Estado: ${project.status === 1 ? '🟢 Activo' : '🔴 Cerrado'}`);
            console.log(`   📅 Creado: ${new Date(project.created_on).toLocaleDateString('es-ES')}`);
            console.log(`   🔄 Actualizado: ${new Date(project.updated_on).toLocaleDateString('es-ES')}`);
            if (project.description) {
                console.log(`   📝 Descripción: ${project.description.substring(0, 100)}${project.description.length > 100 ? '...' : ''}`);
            }
            console.log('-'.repeat(80));
        });

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('📡 HTTP Status:', error.response.status);
            console.error('📝 Response:', error.response.data);
        }
    }
}

listProjects();
