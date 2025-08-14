import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { RedmineClient } from '../client/redmine-client.js';

const listRolesSchema = z.object({});

const listGroupsSchema = z.object({});

const getGroupSchema = z.object({
    groupId: z.number().describe('Group ID')
  });

const createGroupSchema = z.object({
    name: z.string().describe('Group name'),
    user_ids: z.array(z.number()).optional().describe('Array of user IDs to add to the group')
  });

const listProjectMembershipsSchema = z.object({
    projectId: z.union([z.number(), z.string()]).describe('Project ID or identifier')
  });

const createProjectMembershipSchema = z.object({
    projectId: z.union([z.number(), z.string()]).describe('Project ID or identifier'),
    user_id: z.number().optional().describe('User ID (required if group_id not provided)'),
    group_id: z.number().optional().describe('Group ID (required if user_id not provided)'),
    role_ids: z.array(z.number()).describe('Array of role IDs to assign')
  });

const listTimeEntryActivitiesSchema = z.object({});

// Tool for listing roles
export const listRolesTool = {
  name: 'list_roles',
  description: 'List all roles in Redmine',
  inputSchema: listRolesSchema,
  jsonSchema: zodToJsonSchema(listRolesSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const roles = await client.getRoles();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(roles, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing roles: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for listing groups
export const listGroupsTool = {
  name: 'list_groups',
  description: 'List all groups in Redmine',
  inputSchema: listGroupsSchema,
  jsonSchema: zodToJsonSchema(listGroupsSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const groups = await client.getGroups();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(groups, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing groups: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for getting a specific group
export const getGroupTool = {
  name: 'get_group',
  description: 'Get details of a specific group including its users',
  inputSchema: getGroupSchema,
  jsonSchema: zodToJsonSchema(getGroupSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const group = await client.getGroup(args.groupId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(group, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting group: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for creating a group
export const createGroupTool = {
  name: 'create_group',
  description: 'Create a new group in Redmine',
  inputSchema: createGroupSchema,
  jsonSchema: zodToJsonSchema(createGroupSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const group = await client.createGroup(args);
      return {
        content: [
          {
            type: 'text',
            text: `Group created successfully:\n${JSON.stringify(group, null, 2)}`
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error creating group: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for listing project memberships
export const listProjectMembershipsTool = {
  name: 'list_project_memberships',
  description: 'List all memberships for a specific project',
  inputSchema: listProjectMembershipsSchema,
  jsonSchema: zodToJsonSchema(listProjectMembershipsSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const memberships = await client.getProjectMemberships(args.projectId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(memberships, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing project memberships: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for creating project membership
export const createProjectMembershipTool = {
  name: 'create_project_membership',
  description: 'Add a user or group to a project with specific roles',
  inputSchema: createProjectMembershipSchema,
  jsonSchema: zodToJsonSchema(createProjectMembershipSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const { projectId, ...membershipData } = args;
      const membership = await client.createProjectMembership(projectId, membershipData);
      return {
        content: [
          {
            type: 'text',
            text: `Project membership created successfully:\n${JSON.stringify(membership, null, 2)}`
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error creating project membership: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for listing time entry activities
export const listTimeEntryActivitiesTool = {
  name: 'list_time_entry_activities',
  description: 'List all time entry activities available in Redmine',
  inputSchema: listTimeEntryActivitiesSchema,
  jsonSchema: zodToJsonSchema(listTimeEntryActivitiesSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const activities = await client.getTimeEntryActivities();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(activities, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing time entry activities: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

export const advancedAdminTools = [
  listRolesTool,
  listGroupsTool,
  getGroupTool,
  createGroupTool,
  listProjectMembershipsTool,
  createProjectMembershipTool,
  listTimeEntryActivitiesTool
];
