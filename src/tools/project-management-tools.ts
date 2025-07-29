import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { RedmineClient } from '../client/redmine-client.js';

const listTimeEntriesSchema = z.object({
    issue_id: z.number().optional().describe('Filter by issue ID'),
    project_id: z.number().optional().describe('Filter by project ID'),
    user_id: z.number().optional().describe('Filter by user ID'),
    limit: z.number().optional().describe('Number of entries to return (default: 25)'),
    offset: z.number().optional().describe('Number of entries to skip')
  });

const createTimeEntrySchema = z.object({
    issue_id: z.number().optional().describe('Issue ID (required if project_id not provided)'),
    project_id: z.number().optional().describe('Project ID (required if issue_id not provided)'),
    spent_on: z.string().describe('Date when time was spent (YYYY-MM-DD)'),
    hours: z.number().describe('Number of hours spent'),
    activity_id: z.number().describe('Activity ID'),
    comments: z.string().optional().describe('Comments about the time spent')
  });

const listVersionsSchema = z.object({
    projectId: z.union([z.number(), z.string()]).describe('Project ID or identifier')
  });

const createVersionSchema = z.object({
    projectId: z.union([z.number(), z.string()]).describe('Project ID or identifier'),
    name: z.string().describe('Version name'),
    description: z.string().optional().describe('Version description'),
    status: z.enum(['open', 'locked', 'closed']).optional().describe('Version status'),
    due_date: z.string().optional().describe('Due date (YYYY-MM-DD)'),
    sharing: z.enum(['none', 'descendants', 'hierarchy', 'tree', 'system']).optional().describe('Sharing mode')
  });

const listIssueCategoresSchema = z.object({
    projectId: z.union([z.number(), z.string()]).describe('Project ID or identifier')
  });

const createIssueCategorySchema = z.object({
    projectId: z.union([z.number(), z.string()]).describe('Project ID or identifier'),
    name: z.string().describe('Category name'),
    assigned_to_id: z.number().optional().describe('Default assignee user ID')
  });

// Tool for listing time entries
export const listTimeEntriesTool = {
  name: 'list_time_entries',
  description: 'List time entries in Redmine with optional filters',
  inputSchema: listTimeEntriesSchema,
  jsonSchema: zodToJsonSchema(listTimeEntriesSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const timeEntries = await client.getTimeEntries(args);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(timeEntries, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing time entries: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for creating a time entry
export const createTimeEntryTool = {
  name: 'create_time_entry',
  description: 'Create a new time entry in Redmine',
  inputSchema: createTimeEntrySchema,
  jsonSchema: zodToJsonSchema(createTimeEntrySchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const timeEntry = await client.createTimeEntry(args);
      return {
        content: [
          {
            type: 'text',
            text: `Time entry created successfully:\n${JSON.stringify(timeEntry, null, 2)}`
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error creating time entry: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for listing versions
export const listVersionsTool = {
  name: 'list_versions',
  description: 'List all versions for a specific project',
  inputSchema: listVersionsSchema,
  jsonSchema: zodToJsonSchema(listVersionsSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const versions = await client.getVersions(args.projectId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(versions, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing versions: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for creating a version
export const createVersionTool = {
  name: 'create_version',
  description: 'Create a new version for a project',
  inputSchema: createVersionSchema,
  jsonSchema: zodToJsonSchema(createVersionSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const { projectId, ...versionData } = args;
      const version = await client.createVersion(projectId, versionData);
      return {
        content: [
          {
            type: 'text',
            text: `Version created successfully:\n${JSON.stringify(version, null, 2)}`
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error creating version: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for listing issue categories
export const listIssueCategoresTool = {
  name: 'list_issue_categories',
  description: 'List all issue categories for a specific project',
  inputSchema: listIssueCategoresSchema,
  jsonSchema: zodToJsonSchema(listIssueCategoresSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const categories = await client.getIssueCategories(args.projectId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(categories, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing issue categories: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for creating an issue category
export const createIssueCategoryTool = {
  name: 'create_issue_category',
  description: 'Create a new issue category for a project',
  inputSchema: createIssueCategorySchema,
  jsonSchema: zodToJsonSchema(createIssueCategorySchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const { projectId, ...categoryData } = args;
      const category = await client.createIssueCategory(projectId, categoryData);
      return {
        content: [
          {
            type: 'text',
            text: `Issue category created successfully:\n${JSON.stringify(category, null, 2)}`
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error creating issue category: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

export const projectManagementTools = [
  listTimeEntriesTool,
  createTimeEntryTool,
  listVersionsTool,
  createVersionTool,
  listIssueCategoresTool,
  createIssueCategoryTool
];
