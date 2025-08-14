# Redmine MCP Server

A Model Context Protocol (MCP) server that provides seamless integration with Redmine project management software. This server allows AI assistants to interact with Redmine through a comprehensive set of tools for managing projects, issues, users, time tracking, and more.

## 🎯 Compatibility

**Compatible with Redmine 4.1.1.stable**

This MCP server has been developed and tested specifically for Redmine 4.1.1.stable. While it may work with other versions, optimal functionality is guaranteed with this version.

## Features

### Project Management
- List, create, update, and delete projects
- Manage project versions and roadmaps
- Handle issue categories

### Issue Tracking
- Comprehensive issue CRUD operations
- Advanced filtering and search capabilities
- Issue assignment and status management
- Progress tracking and time estimation

### User Management
- List users and get user details
- Current user information
- User assignment to issues

### Time Tracking
- Create and list time entries
- Associate time with issues or projects
- Activity-based time logging

### System Information
- List available trackers
- Get issue statuses and priorities
- System configuration details

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd mcp-redmine
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your Redmine server details:
```
REDMINE_BASE_URL=https://your-redmine-server.com
REDMINE_API_KEY=your_api_key_here
```

4. Build the project:
```bash
npm run build
```

## Usage

### Development
Run in development mode with auto-reload:
```bash
npm run dev
```

### Production
Build and run the server:
```bash
npm run build
npm start
```

### Configuration

The server supports multiple authentication methods. Configure one of the following:

**Option 1: API Key (Recommended)**
- `REDMINE_BASE_URL`: Your Redmine server URL
- `REDMINE_API_KEY`: Your Redmine API key

**Option 2: Username/Password**
- `REDMINE_BASE_URL`: Your Redmine server URL  
- `REDMINE_USERNAME`: Your Redmine username
- `REDMINE_PASSWORD`: Your Redmine password

**Optional Configuration:**
- `REDMINE_IMPERSONATE_USER`: Username to impersonate (requires admin privileges)

## Available Tools

### Project Tools

- `list_projects`: List all projects with optional filtering
- `get_project`: Get specific project details
- `create_project`: Create a new project
- `update_project`: Update existing project
- `delete_project`: Delete a project

### Issue Tools

- `list_issues`: List issues with extensive filtering options
- `get_issue`: Get specific issue details
- `create_issue`: Create a new issue
- `update_issue`: Update existing issue
- `delete_issue`: Delete an issue

### Issue Relations

- `list_issue_relations`: List all relations for an issue
- `create_issue_relation`: Create relations between issues (relates, duplicates, blocks, etc.)
- `delete_issue_relation`: Delete issue relations

### Admin Tools

- `list_users`: List all users
- `get_user`: Get specific user details
- `get_current_user`: Get current authenticated user
- `list_trackers`: List issue trackers
- `list_issue_statuses`: List available issue statuses
- `list_issue_priorities`: List issue priorities

### Advanced Admin Tools

- `list_roles`: List all roles in Redmine
- `list_groups`: List all user groups
- `get_group`: Get specific group details with users
- `create_group`: Create new user groups
- `list_project_memberships`: List project memberships
- `create_project_membership`: Add users/groups to projects with roles
- `list_time_entry_activities`: List available time entry activities

### Project Management Tools

- `list_time_entries`: List time entries with filtering
- `create_time_entry`: Log time against issues or projects
- `list_versions`: List project versions
- `create_version`: Create new project version
- `list_issue_categories`: List issue categories
- `create_issue_category`: Create new issue category

### Wiki Management

- `list_wiki_pages`: List all wiki pages for a project
- `get_wiki_page`: Get specific wiki page content
- `create_wiki_page`: Create or update wiki pages
- `delete_wiki_page`: Delete wiki pages

### Search and Files

- `search`: Search across all Redmine content (requires Redmine 3.3+)
- `upload_file`: Upload files and get tokens for attachment
- `get_attachment`: Get attachment details
- `list_news`: List news articles
- `list_queries`: List saved queries

## MCP Integration

To use this server with an MCP client, configure it as follows:

```json
{
  "servers": {
    "redmine": {
      "type": "stdio",
      "command": "node",
      "args": ["dist/index.js"]
    }
  }
}
```

## Development

### Project Structure
```
src/
├── index.ts                    # Main server entry point
├── client/
│   └── redmine-client.ts      # Redmine API client
├── tools/
│   ├── project-tools.ts       # Project management tools
│   ├── issue-tools.ts         # Issue tracking tools
│   ├── admin-tools.ts         # Administrative tools
│   └── project-management-tools.ts # Time tracking and versioning
└── types/
    └── redmine.ts             # TypeScript type definitions
```

### Building
```bash
npm run build
```

### Development with auto-reload
```bash
npm run dev
```

## API Key Setup

1. Log into your Redmine instance
2. Go to "My account" (top-right menu)
3. Click on "API access key" in the right sidebar
4. Click "Show" to reveal your API key
5. Copy this key to your `.env` file

## Requirements

- Node.js 18 or higher
- Redmine 4.0+ with REST API enabled
- Valid Redmine API key

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions:
- Check the [Redmine API documentation](https://www.redmine.org/projects/redmine/wiki/Rest_api)
- Review the [MCP specification](https://modelcontextprotocol.io/)
- Open an issue in this repository
