#!/usr/bin/env node

import { RedmineClient } from './client/redmine-client.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testRedmineConnection() {
  try {
    console.log('🔄 Testing Redmine connection...');
    
    const baseUrl = process.env.REDMINE_BASE_URL;
    const apiKey = process.env.REDMINE_API_KEY;
    
    if (!baseUrl || !apiKey) {
      throw new Error('REDMINE_BASE_URL and REDMINE_API_KEY environment variables are required');
    }
    
    console.log(`📡 Connecting to: ${baseUrl}`);
    
    const client = new RedmineClient({
      baseUrl,
      apiKey
    });
    
    // Test basic connection by getting current user
    console.log('👤 Getting current user...');
    const currentUser = await client.getCurrentUser();
    console.log(`✅ Connected as: ${currentUser.firstname} ${currentUser.lastname} (${currentUser.login})`);
    
    // Test projects
    console.log('📋 Getting projects...');
    const projects = await client.getProjects({ limit: 5 });
    console.log(`✅ Found ${projects.length} projects`);
    projects.forEach(project => {
      console.log(`  - ${project.name} (${project.identifier})`);
    });
    
    // Test trackers
    console.log('🏷️  Getting trackers...');
    const trackers = await client.getTrackers();
    console.log(`✅ Found ${trackers.length} trackers`);
    trackers.forEach(tracker => {
      console.log(`  - ${tracker.name}`);
    });
    
    // Test issue statuses
    console.log('📊 Getting issue statuses...');
    const statuses = await client.getIssueStatuses();
    console.log(`✅ Found ${statuses.length} issue statuses`);
    statuses.forEach(status => {
      console.log(`  - ${status.name} ${status.is_closed ? '(closed)' : '(open)'}`);
    });
    
    console.log('\n🎉 All tests passed! Redmine MCP Server is ready to use.');
    
  } catch (error: any) {
    console.error('❌ Connection test failed:', error.message);
    if (error.response) {
      console.error('📡 HTTP Status:', error.response.status);
      console.error('📝 Response:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the test
testRedmineConnection();
