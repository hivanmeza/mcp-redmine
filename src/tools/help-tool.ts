import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { RedmineClient } from '../client/redmine-client.js';

// Schema for help tool
const getHelpSchema = z.object({
    tool_name: z.string().optional().describe('Get help for a specific tool (optional)'),
    category: z.enum(['issues', 'projects', 'admin', 'advanced-admin', 'project-management', 'content-management', 'search', 'all']).optional().describe('Filter tools by category'),
    format: z.enum(['markdown', 'json', 'plain']).optional().default('markdown').describe('Output format')
});

// Tool documentation data
const toolDocumentation: Record<string, {
    category: string;
    description: string;
    required_params: string[];
    optional_params: string[];
    example: any;
    response_example: any;
}> = {
    // Issues Category
    'list_issues': {
        category: 'issues',
        description: 'List issues in Redmine with optional filters',
        required_params: [],
        optional_params: [
            'project_id (number): Filter by project ID',
            'status_id (number|string): Filter by status ID or "open"/"closed"/"*"',
            'assigned_to_id (number|string): Filter by assigned user ID or "me"',
            'author_id (number): Filter by author user ID',
            'tracker_id (number): Filter by tracker ID',
            'priority_id (number): Filter by priority ID',
            'created_on (string): Filter by creation date (>=2023-01-01)',
            'updated_on (string): Filter by update date (>=2023-01-01)',
            'subject (string): Filter by subject text',
            'limit (number): Number of issues to return (default: 25)',
            'offset (number): Number of issues to skip',
            'sort (string): Sort criteria (e.g., "id:desc", "updated_on:desc")'
        ],
        example: {
            project_id: 1,
            status_id: 'open',
            limit: 10,
            sort: 'updated_on:desc'
        },
        response_example: {
            issues: [
                {
                    id: 123,
                    subject: 'Fix login bug',
                    status: { name: 'New' },
                    assigned_to: { name: 'John Doe' }
                }
            ]
        }
    },

    'get_issue': {
        category: 'issues',
        description: 'Get details of a specific issue by ID',
        required_params: ['issueId (number): Issue ID'],
        optional_params: [],
        example: { issueId: 123 },
        response_example: {
            issue: {
                id: 123,
                subject: 'Fix login bug',
                description: 'Users cannot login with special characters',
                status: { name: 'New' },
                project: { name: 'MyProject' }
            }
        }
    },

    'get_issue_journals': {
        category: 'issues',
        description: 'Get journals (history/comments) of a specific issue by ID',
        required_params: ['issueId (number): Issue ID'],
        optional_params: [],
        example: { issueId: 123 },
        response_example: {
            journals: [
                {
                    id: 1,
                    notes: 'Initial issue creation',
                    user: { name: 'John Doe' },
                    created_on: '2025-01-29T10:00:00Z'
                }
            ]
        }
    },

    'create_issue': {
        category: 'issues',
        description: 'Create a new issue in Redmine',
        required_params: [
            'project_id (number): Project ID',
            'tracker_id (number): Tracker ID',
            'subject (string): Issue subject'
        ],
        optional_params: [
            'description (string): Issue description',
            'status_id (number): Status ID',
            'priority_id (number): Priority ID',
            'assigned_to_id (number): Assigned user ID',
            'category_id (number): Category ID',
            'fixed_version_id (number): Target version ID',
            'parent_issue_id (number): Parent issue ID',
            'start_date (string): Start date (YYYY-MM-DD)',
            'due_date (string): Due date (YYYY-MM-DD)',
            'estimated_hours (number): Estimated hours',
            'done_ratio (number): Progress percentage (0-100)'
        ],
        example: {
            project_id: 1,
            tracker_id: 2,
            subject: 'Fix login bug',
            description: 'Users cannot login with special characters in passwords',
            priority_id: 3,
            assigned_to_id: 5
        },
        response_example: {
            issue: {
                id: 124,
                subject: 'Fix login bug',
                project: { id: 1, name: 'MyProject' },
                status: { name: 'New' }
            }
        }
    },

    'update_issue': {
        category: 'issues',
        description: 'Update an existing issue',
        required_params: ['issueId (number): Issue ID'],
        optional_params: [
            'subject (string): Issue subject',
            'description (string): Issue description',
            'status_id (number): Status ID',
            'priority_id (number): Priority ID',
            'assigned_to_id (number): Assigned user ID',
            'category_id (number): Category ID',
            'fixed_version_id (number): Target version ID',
            'parent_issue_id (number): Parent issue ID',
            'start_date (string): Start date (YYYY-MM-DD)',
            'due_date (string): Due date (YYYY-MM-DD)',
            'estimated_hours (number): Estimated hours',
            'done_ratio (number): Progress percentage (0-100)',
            'notes (string): Update notes/comments'
        ],
        example: {
            issueId: 123,
            status_id: 2,
            done_ratio: 50,
            notes: 'Progress update: 50% completed'
        },
        response_example: {
            issue: {
                id: 123,
                subject: 'Fix login bug',
                status: { name: 'In Progress' },
                done_ratio: 50
            }
        }
    },

    'delete_issue': {
        category: 'issues',
        description: 'Delete an issue from Redmine',
        required_params: ['issueId (number): Issue ID'],
        optional_params: [],
        example: { issueId: 123 },
        response_example: {
            message: 'Issue 123 deleted successfully'
        }
    },

    // Projects Category
    'list_projects': {
        category: 'projects',
        description: 'List all projects in Redmine',
        required_params: [],
        optional_params: [
            'include (string): Additional data to include (e.g., "trackers,issue_categories")',
            'limit (number): Number of projects to return',
            'offset (number): Number of projects to skip'
        ],
        example: { include: 'trackers', limit: 20 },
        response_example: {
            projects: [
                {
                    id: 1,
                    name: 'MyProject',
                    identifier: 'myproject',
                    description: 'Project description',
                    status: 1
                }
            ]
        }
    },

    'get_project': {
        category: 'projects',
        description: 'Get details of a specific project by ID or identifier',
        required_params: ['projectId (number|string): Project ID or identifier'],
        optional_params: [
            'include (string): Additional data to include (e.g., "trackers,issue_categories,enabled_modules")'
        ],
        example: { projectId: 'myproject', include: 'trackers,issue_categories' },
        response_example: {
            project: {
                id: 1,
                name: 'MyProject',
                identifier: 'myproject',
                trackers: [{ id: 1, name: 'Bug' }],
                issue_categories: [{ id: 1, name: 'Development' }]
            }
        }
    },

    'create_project': {
        category: 'projects',
        description: 'Create a new project in Redmine',
        required_params: [
            'name (string): Project name',
            'identifier (string): Project identifier (unique)'
        ],
        optional_params: [
            'description (string): Project description',
            'homepage (string): Project homepage URL',
            'is_public (boolean): Whether project is public',
            'parent_id (number): Parent project ID',
            'inherit_members (boolean): Inherit members from parent',
            'tracker_ids (array): Enabled tracker IDs',
            'enabled_module_names (array): Enabled module names'
        ],
        example: {
            name: 'New Project',
            identifier: 'new-project',
            description: 'A new project for testing',
            is_public: false,
            tracker_ids: [1, 2, 3]
        },
        response_example: {
            project: {
                id: 2,
                name: 'New Project',
                identifier: 'new-project',
                status: 1
            }
        }
    },

    // Search Category
    'search': {
        category: 'search',
        description: 'Search across Redmine content (requires Redmine 3.3+)',
        required_params: ['query (string): Search query'],
        optional_params: [
            'titles_only (boolean): Search only in titles',
            'all_words (boolean): All words must be present',
            'scope (string): Limit search to specific content type (issues, news, documents, changesets, wiki_pages, messages)',
            'limit (number): Number of results to return',
            'offset (number): Number of results to skip'
        ],
        example: {
            query: 'login bug',
            scope: 'issues',
            limit: 10
        },
        response_example: {
            results: [
                {
                    id: 123,
                    title: 'Fix login bug',
                    type: 'issue',
                    description: 'Users cannot login...'
                }
            ]
        }
    },

    // Admin Category
    'list_users': {
        category: 'admin',
        description: 'List all users in Redmine',
        required_params: [],
        optional_params: [
            'status (number): User status filter (1=active, 2=registered, 3=locked)',
            'name (string): Filter by name',
            'group_id (number): Filter by group membership',
            'limit (number): Number of users to return',
            'offset (number): Number of users to skip'
        ],
        example: { status: 1, limit: 50 },
        response_example: {
            users: [
                {
                    id: 1,
                    login: 'admin',
                    firstname: 'Redmine',
                    lastname: 'Admin',
                    mail: 'admin@example.com',
                    status: 1
                }
            ]
        }
    },

    'get_current_user': {
        category: 'admin',
        description: 'Get details of the current authenticated user',
        required_params: [],
        optional_params: [],
        example: {},
        response_example: {
            user: {
                id: 1,
                login: 'admin',
                firstname: 'Redmine',
                lastname: 'Admin',
                mail: 'admin@example.com',
                api_key: 'abcd1234...'
            }
        }
    }
};

const categoryDescriptions: Record<string, string> = {
    'issues': 'Tools for managing Redmine issues (create, read, update, delete)',
    'projects': 'Tools for managing Redmine projects and project settings',
    'admin': 'Administrative tools for user and system management',
    'advanced-admin': 'Advanced administrative tools for groups, roles, and memberships',
    'project-management': 'Tools for time tracking, versions, and project components',
    'content-management': 'Tools for wiki pages, attachments, and content management',
    'search': 'Tools for searching and file operations',
    'all': 'All available tools across all categories'
};

function generateMarkdownHelp(toolName?: string, category?: string): string {
    let output = `# MCP Redmine Server - Tool Documentation\n\n`;
    output += `**Version**: 1.2.0 | **Total Tools**: ${Object.keys(toolDocumentation).length + 1}\n\n`; if (toolName && toolDocumentation[toolName]) {
        const tool = toolDocumentation[toolName];
        output += generateToolMarkdown(toolName, tool);
    } else if (category && category !== 'all') {
        output += `## Category: ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
        output += `${categoryDescriptions[category]}\n\n`;

        const categoryTools = Object.entries(toolDocumentation)
            .filter(([_, tool]) => tool.category === category);

        if (categoryTools.length === 0) {
            output += `No tools found in category "${category}"\n\n`;
        } else {
            categoryTools.forEach(([name, tool]) => {
                output += generateToolMarkdown(name, tool);
            });
        }
    } else {
        // Show all categories overview
        output += `## Available Categories\n\n`;
        Object.entries(categoryDescriptions).forEach(([cat, desc]) => {
            if (cat !== 'all') {
                const toolCount = Object.values(toolDocumentation)
                    .filter(tool => tool.category === cat).length;
                output += `### ${cat} (${toolCount} tools)\n${desc}\n\n`;
            }
        });

        output += `## Quick Tool Reference\n\n`;
        Object.entries(toolDocumentation).forEach(([name, tool]) => {
            output += `- **${name}**: ${tool.description}\n`;
        });

        output += `\n## Usage Examples\n\n`;
        output += `Get help for a specific tool:\n`;
        output += `\`\`\`json\n{"tool_name": "create_issue"}\n\`\`\`\n\n`;
        output += `Get help for a category:\n`;
        output += `\`\`\`json\n{"category": "issues"}\n\`\`\`\n\n`;
    }

    return output;
}

function generateToolMarkdown(name: string, tool: any): string {
    let output = `## Tool: \`${name}\`\n\n`;
    output += `**Category**: ${tool.category} | **Description**: ${tool.description}\n\n`;

    if (tool.required_params.length > 0) {
        output += `### Required Parameters\n`;
        tool.required_params.forEach((param: string) => {
            output += `- ${param}\n`;
        });
        output += `\n`;
    }

    if (tool.optional_params.length > 0) {
        output += `### Optional Parameters\n`;
        tool.optional_params.forEach((param: string) => {
            output += `- ${param}\n`;
        });
        output += `\n`;
    }

    output += `### Example Usage\n`;
    output += `\`\`\`json\n${JSON.stringify(tool.example, null, 2)}\n\`\`\`\n\n`;

    output += `### Example Response\n`;
    output += `\`\`\`json\n${JSON.stringify(tool.response_example, null, 2)}\n\`\`\`\n\n`;

    output += `---\n\n`;
    return output;
}

function generateJsonHelp(toolName?: string, category?: string): any {
    if (toolName && toolDocumentation[toolName]) {
        return {
            tool: toolName,
            ...toolDocumentation[toolName]
        };
    }

    if (category && category !== 'all') {
        const categoryTools: Record<string, any> = Object.entries(toolDocumentation)
            .filter(([_, tool]) => tool.category === category)
            .reduce((acc: Record<string, any>, [name, tool]) => {
                acc[name] = tool;
                return acc;
            }, {});

        return {
            category,
            description: categoryDescriptions[category],
            tools: categoryTools
        };
    }

    return {
        server: 'MCP Redmine Server',
        version: '1.2.0',
        total_tools: Object.keys(toolDocumentation).length + 1,
        categories: categoryDescriptions,
        tools: toolDocumentation
    };
}

function generatePlainHelp(toolName?: string, category?: string): string {
    if (toolName && toolDocumentation[toolName]) {
        const tool = toolDocumentation[toolName];
        return `Tool: ${toolName}\nDescription: ${tool.description}\nCategory: ${tool.category}\nExample: ${JSON.stringify(tool.example)}`;
    }

    if (category && category !== 'all') {
        const categoryTools = Object.entries(toolDocumentation)
            .filter(([_, tool]) => tool.category === category);

        return `Category: ${category}\nTools: ${categoryTools.map(([name]) => name).join(', ')}`;
    }

    return `MCP Redmine Server v1.2.0\nTotal Tools: ${Object.keys(toolDocumentation).length + 1}\nCategories: ${Object.keys(categoryDescriptions).filter(c => c !== 'all').join(', ')}`;
}

export const getHelpTool = {
    name: 'get_help',
    description: 'Get comprehensive help and documentation for all MCP Redmine tools',
    inputSchema: getHelpSchema,
    jsonSchema: zodToJsonSchema(getHelpSchema),
    handler: async (args: any, client: RedmineClient) => {
        try {
            const { tool_name, category, format = 'markdown' } = args;

            let helpContent: string;

            switch (format) {
                case 'json':
                    helpContent = JSON.stringify(generateJsonHelp(tool_name, category), null, 2);
                    break;
                case 'plain':
                    helpContent = generatePlainHelp(tool_name, category);
                    break;
                case 'markdown':
                default:
                    helpContent = generateMarkdownHelp(tool_name, category);
                    break;
            }

            return {
                content: [
                    {
                        type: 'text',
                        text: helpContent
                    }
                ]
            };
        } catch (error: any) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error generating help: ${error.message}`
                    }
                ],
                isError: true
            };
        }
    }
};

export const helpTools = [getHelpTool];
