import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { RedmineClient } from '../client/redmine-client.js';

const listProjectsSchema = z.object({
    limit: z.number().optional().describe('Number of projects to return (default: 25)'),
    offset: z.number().optional().describe('Number of projects to skip'),
    include: z.array(z.string()).optional().describe('Additional data to include (trackers, issue_categories, enabled_modules)')
  });

const getProjectSchema = z.object({
    projectId: z.union([z.number(), z.string()]).describe('Project ID or identifier')
  });

const createProjectSchema = z.object({
    name: z.string().describe('Project name'),
    identifier: z.string().describe('Project identifier (unique)'),
    description: z.string().optional().describe('Project description'),
    is_public: z.boolean().optional().describe('Whether the project is public'),
    inherit_members: z.boolean().optional().describe('Whether to inherit members from parent project'),
    parent_id: z.number().optional().describe('Parent project ID')
  });

const updateProjectSchema = z.object({
    projectId: z.union([z.number(), z.string()]).describe('Project ID or identifier'),
    name: z.string().optional().describe('Project name'),
    description: z.string().optional().describe('Project description'),
    is_public: z.boolean().optional().describe('Whether the project is public'),
    status: z.number().optional().describe('Project status (1=active, 5=closed)')
  });

const deleteProjectSchema = z.object({
    projectId: z.union([z.number(), z.string()]).describe('Project ID or identifier')
  });

// Tool for listing projects
export const listProjectsTool = {
  name: 'list_projects',
  description: 'List all projects in Redmine',
  inputSchema: listProjectsSchema,
  jsonSchema: zodToJsonSchema(listProjectsSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const projects = await client.getProjects(args);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(projects, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing projects: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for getting a specific project
export const getProjectTool = {
  name: 'get_project',
  description: 'Get details of a specific project by ID or identifier',
  inputSchema: getProjectSchema,
  jsonSchema: zodToJsonSchema(getProjectSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const project = await client.getProject(args.projectId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(project, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting project: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for creating a new project
export const createProjectTool = {
  name: 'create_project',
  description: 'Create a new project in Redmine',
  inputSchema: createProjectSchema,
  jsonSchema: zodToJsonSchema(createProjectSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const project = await client.createProject(args);
      return {
        content: [
          {
            type: 'text',
            text: `Project created successfully:\n${JSON.stringify(project, null, 2)}`
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error creating project: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for updating a project
export const updateProjectTool = {
  name: 'update_project',
  description: 'Update an existing project',
  inputSchema: updateProjectSchema,
  jsonSchema: zodToJsonSchema(updateProjectSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const { projectId, ...updates } = args;
      const project = await client.updateProject(projectId, updates);
      return {
        content: [
          {
            type: 'text',
            text: `Project updated successfully:\n${JSON.stringify(project, null, 2)}`
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error updating project: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for deleting a project
export const deleteProjectTool = {
  name: 'delete_project',
  description: 'Delete a project from Redmine',
  inputSchema: deleteProjectSchema,
  jsonSchema: zodToJsonSchema(deleteProjectSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      await client.deleteProject(args.projectId);
      return {
        content: [
          {
            type: 'text',
            text: `Project ${args.projectId} deleted successfully`
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error deleting project: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

export const projectTools = [
  listProjectsTool,
  getProjectTool,
  createProjectTool,
  updateProjectTool,
  deleteProjectTool
];
