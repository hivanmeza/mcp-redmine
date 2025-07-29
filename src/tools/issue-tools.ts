import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { RedmineClient } from '../client/redmine-client.js';

// Tool for getting journals of a specific issue
const getIssueJournalsSchema = z.object({
  issueId: z.number().describe('Issue ID')
});

export const getIssueJournalsTool = {
  name: 'get_issue_journals',
  description: 'Get journals (history/comments) of a specific issue by ID',
  inputSchema: getIssueJournalsSchema,
  jsonSchema: zodToJsonSchema(getIssueJournalsSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const issue = await client.getIssueWithOptions(args.issueId, { include: 'journals' });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(issue.journals ?? [], null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting issue journals: ${error.message}`
          }
        ]
      };
    }
  }
};

// Tool for listing issues
const listIssuesSchema = z.object({
  project_id: z.number().optional().describe('Filter by project ID'),
  status_id: z.union([z.number(), z.literal('open'), z.literal('closed'), z.literal('*')]).optional().describe('Filter by status ID or open/closed/*'),
  assigned_to_id: z.union([z.number(), z.literal('me')]).optional().describe('Filter by assigned user ID or "me"'),
  author_id: z.number().optional().describe('Filter by author user ID'),
  tracker_id: z.number().optional().describe('Filter by tracker ID'),
  priority_id: z.number().optional().describe('Filter by priority ID'),
  created_on: z.string().optional().describe('Filter by creation date (>=2023-01-01 or 2023-01-01|2023-12-31)'),
  updated_on: z.string().optional().describe('Filter by update date (>=2023-01-01 or 2023-01-01|2023-12-31)'),
  subject: z.string().optional().describe('Filter by subject text'),
  limit: z.number().optional().describe('Number of issues to return (default: 25)'),
  offset: z.number().optional().describe('Number of issues to skip'),
  sort: z.string().optional().describe('Sort criteria (e.g., "id:desc", "updated_on:desc")')
});

export const listIssuesTool = {
  name: 'list_issues',
  description: 'List issues in Redmine with optional filters',
  inputSchema: listIssuesSchema,
  jsonSchema: zodToJsonSchema(listIssuesSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const issues = await client.getIssues(args);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(issues, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing issues: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for getting a specific issue
const getIssueSchema = z.object({
  issueId: z.number().describe('Issue ID')
});

export const getIssueTool = {
  name: 'get_issue',
  description: 'Get details of a specific issue by ID',
  inputSchema: getIssueSchema,
  jsonSchema: zodToJsonSchema(getIssueSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const issue = await client.getIssue(args.issueId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(issue, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting issue: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for creating a new issue
const createIssueSchema = z.object({
  project_id: z.number().describe('Project ID'),
  tracker_id: z.number().describe('Tracker ID'),
  subject: z.string().describe('Issue subject'),
  description: z.string().optional().describe('Issue description'),
  status_id: z.number().optional().describe('Status ID'),
  priority_id: z.number().optional().describe('Priority ID'),
  assigned_to_id: z.number().optional().describe('Assigned user ID'),
  category_id: z.number().optional().describe('Category ID'),
  fixed_version_id: z.number().optional().describe('Target version ID'),
  parent_issue_id: z.number().optional().describe('Parent issue ID'),
  start_date: z.string().optional().describe('Start date (YYYY-MM-DD)'),
  due_date: z.string().optional().describe('Due date (YYYY-MM-DD)'),
  estimated_hours: z.number().optional().describe('Estimated hours'),
  done_ratio: z.number().optional().describe('Progress percentage (0-100)')
});

export const createIssueTool = {
  name: 'create_issue',
  description: 'Create a new issue in Redmine',
  inputSchema: createIssueSchema,
  jsonSchema: zodToJsonSchema(createIssueSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const issue = await client.createIssue(args);
      return {
        content: [
          {
            type: 'text',
            text: `Issue created successfully:\n${JSON.stringify(issue, null, 2)}`
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error creating issue: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for updating an issue
const updateIssueSchema = z.object({
  issueId: z.number().describe('Issue ID'),
  subject: z.string().optional().describe('Issue subject'),
  description: z.string().optional().describe('Issue description'),
  status_id: z.number().optional().describe('Status ID'),
  priority_id: z.number().optional().describe('Priority ID'),
  assigned_to_id: z.number().optional().describe('Assigned user ID'),
  category_id: z.number().optional().describe('Category ID'),
  fixed_version_id: z.number().optional().describe('Target version ID'),
  parent_issue_id: z.number().optional().describe('Parent issue ID'),
  start_date: z.string().optional().describe('Start date (YYYY-MM-DD)'),
  due_date: z.string().optional().describe('Due date (YYYY-MM-DD)'),
  estimated_hours: z.number().optional().describe('Estimated hours'),
  done_ratio: z.number().optional().describe('Progress percentage (0-100)'),
  notes: z.string().optional().describe('Update notes/comments')
});

export const updateIssueTool = {
  name: 'update_issue',
  description: 'Update an existing issue',
  inputSchema: updateIssueSchema,
  jsonSchema: zodToJsonSchema(updateIssueSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const { issueId, ...updates } = args;
      const issue = await client.updateIssue(issueId, updates);
      return {
        content: [
          {
            type: 'text',
            text: `Issue updated successfully:\n${JSON.stringify(issue, null, 2)}`
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error updating issue: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for deleting an issue
const deleteIssueSchema = z.object({
  issueId: z.number().describe('Issue ID')
});

export const deleteIssueTool = {
  name: 'delete_issue',
  description: 'Delete an issue from Redmine',
  inputSchema: deleteIssueSchema,
  jsonSchema: zodToJsonSchema(deleteIssueSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      await client.deleteIssue(args.issueId);
      return {
        content: [
          {
            type: 'text',
            text: `Issue ${args.issueId} deleted successfully`
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error deleting issue: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

export const issueTools = [
  getIssueJournalsTool,
  listIssuesTool,
  getIssueTool,
  createIssueTool,
  updateIssueTool,
  deleteIssueTool
];
