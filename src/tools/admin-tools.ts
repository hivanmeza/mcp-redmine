import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { RedmineClient } from '../client/redmine-client.js';

const listUsersSchema = z.object({});

const getUserSchema = z.object({
    userId: z.number().describe('User ID')
  });

const getCurrentUserSchema = z.object({});

const listTrackersSchema = z.object({});

const listIssueStatusesSchema = z.object({});

const listIssuePrioritiesSchema = z.object({});

// Tool for listing users
export const listUsersTool = {
  name: 'list_users',
  description: 'List all users in Redmine',
  inputSchema: listUsersSchema,
  jsonSchema: zodToJsonSchema(listUsersSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const users = await client.getUsers();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(users, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing users: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for getting a specific user
export const getUserTool = {
  name: 'get_user',
  description: 'Get details of a specific user by ID',
  inputSchema: getUserSchema,
  jsonSchema: zodToJsonSchema(getUserSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const user = await client.getUser(args.userId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(user, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting user: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for getting current user
export const getCurrentUserTool = {
  name: 'get_current_user',
  description: 'Get details of the current authenticated user',
  inputSchema: getCurrentUserSchema,
  jsonSchema: zodToJsonSchema(getCurrentUserSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const user = await client.getCurrentUser();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(user, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting current user: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for listing trackers
export const listTrackersTool = {
  name: 'list_trackers',
  description: 'List all issue trackers in Redmine',
  inputSchema: listTrackersSchema,
  jsonSchema: zodToJsonSchema(listTrackersSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const trackers = await client.getTrackers();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(trackers, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing trackers: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for listing issue statuses
export const listIssueStatusesTool = {
  name: 'list_issue_statuses',
  description: 'List all issue statuses in Redmine',
  inputSchema: listIssueStatusesSchema,
  jsonSchema: zodToJsonSchema(listIssueStatusesSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const statuses = await client.getIssueStatuses();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(statuses, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing issue statuses: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for listing issue priorities
export const listIssuePrioritiesTool = {
  name: 'list_issue_priorities',
  description: 'List all issue priorities in Redmine',
  inputSchema: listIssuePrioritiesSchema,
  jsonSchema: zodToJsonSchema(listIssuePrioritiesSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const priorities = await client.getIssuePriorities();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(priorities, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing issue priorities: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

export const adminTools = [
  listUsersTool,
  getUserTool,
  getCurrentUserTool,
  listTrackersTool,
  listIssueStatusesTool,
  listIssuePrioritiesTool
];
