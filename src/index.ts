#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { RedmineClient } from './client/redmine-client.js';
import { adminTools } from './tools/admin-tools.js';
import { advancedAdminTools } from './tools/advanced-admin-tools.js';
import { contentManagementTools } from './tools/content-management-tools.js';
import { helpTools } from './tools/help-tool.js';
import { issueTools } from './tools/issue-tools.js';
import { projectManagementTools } from './tools/project-management-tools.js';
import { projectTools } from './tools/project-tools.js';
import { searchAndFileTools } from './tools/search-and-file-tools.js';

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--version') || args.includes('-v')) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const packagePath = join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
  console.log(`mcp-redmine v${packageJson.version}`);
  process.exit(0);
}

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
MCP Redmine Server v1.1.0
==========================

A Model Context Protocol server for Redmine project management integration.

Usage:
  mcp-redmine [options]

Options:
  --version, -v    Show version number
  --help, -h       Show this help message

Environment Variables:
  REDMINE_URL      Base URL of your Redmine instance
  REDMINE_API_KEY  Your Redmine API key
  REDMINE_USERNAME Username for basic auth (if not using API key)
  REDMINE_PASSWORD Password for basic auth (if not using API key)

Features:
  • 43 tools for complete Redmine integration (including help tool)
  • Compatible with Visual Studio 2022
  • Support for issues, projects, users, time tracking, and more
  • JSON Schema validation for all tools
  • Integrated help system with get_help tool

Visit: https://github.com/your-repo/mcp-redmine for documentation
`);
  process.exit(0);
}

// Load environment variables
dotenv.config();

class RedmineMCPServer {
  private server: Server;
  private redmineClient: RedmineClient | null = null;
  private tools: any[];

  constructor() {
    this.server = new Server(
      {
        name: 'redmine-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Combine all tools
    this.tools = [
      ...helpTools,
      ...projectTools,
      ...issueTools,
      ...adminTools,
      ...projectManagementTools,
      ...advancedAdminTools,
      ...contentManagementTools,
      ...searchAndFileTools,
    ];

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.tools.map(tool => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.jsonSchema || tool.inputSchema,
        })),
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      // Initialize Redmine client if not already done
      if (!this.redmineClient) {
        this.initializeRedmineClient();
      }

      // Find the requested tool
      const tool = this.tools.find(t => t.name === name);
      if (!tool) {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Tool ${name} not found`
        );
      }

      try {
        // Validate arguments against the tool's schema
        const validatedArgs = tool.inputSchema.parse(args);

        // Execute the tool
        return await tool.handler(validatedArgs, this.redmineClient!);
      } catch (error: any) {
        if (error.name === 'ZodError') {
          throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid arguments for tool ${name}: ${error.message}`
          );
        }

        throw new McpError(
          ErrorCode.InternalError,
          `Error executing tool ${name}: ${error.message}`
        );
      }
    });
  }

  private initializeRedmineClient(): void {
    const baseUrl = process.env.REDMINE_BASE_URL;
    const apiKey = process.env.REDMINE_API_KEY;
    const username = process.env.REDMINE_USERNAME;
    const password = process.env.REDMINE_PASSWORD;
    const impersonateUser = process.env.REDMINE_IMPERSONATE_USER;

    if (!baseUrl) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        'REDMINE_BASE_URL environment variable is required'
      );
    }

    if (!apiKey && (!username || !password)) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        'Either REDMINE_API_KEY or both REDMINE_USERNAME and REDMINE_PASSWORD environment variables are required'
      );
    }

    this.redmineClient = new RedmineClient({
      baseUrl: baseUrl,
      apiKey: apiKey,
      username: username,
      password: password,
      impersonateUser: impersonateUser,
    });
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Redmine MCP server running on stdio');
  }
}

const server = new RedmineMCPServer();
server.run().catch(console.error);
