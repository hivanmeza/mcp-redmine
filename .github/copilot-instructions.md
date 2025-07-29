<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Redmine MCP Server Instructions

This is a Model Context Protocol (MCP) server for interacting with Redmine project management software. The server provides tools to manage projects, issues, users, time entries, and other Redmine resources.

## Key Information

- This project uses TypeScript and the @modelcontextprotocol/sdk
- The main server code is in `src/index.ts`
- Tools are organized into separate modules in the `src/tools/` directory
- The Redmine client wrapper is in `src/client/redmine-client.ts`
- Type definitions are in `src/types/redmine.ts`

## Architecture

- **Server**: Main MCP server that handles tool registration and execution
- **Client**: Redmine API client that wraps axios for HTTP requests
- **Tools**: Individual MCP tools grouped by functionality:
  - Project tools: CRUD operations for projects
  - Issue tools: CRUD operations for issues
  - Admin tools: User management and system information
  - Project management tools: Time entries, versions, categories

## Development Guidelines

- Follow the MCP SDK patterns for tool definitions
- Use Zod schemas for input validation
- Handle errors gracefully and return meaningful error messages
- Maintain type safety throughout the codebase
- Use environment variables for configuration

## Useful Resources

You can find more info and examples at https://modelcontextprotocol.io/llms-full.txt
Additional MCP examples: https://github.com/modelcontextprotocol/create-python-server
