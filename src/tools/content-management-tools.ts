import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { RedmineClient } from '../client/redmine-client.js';

const listIssueRelationsSchema = z.object({
    issueId: z.number().describe('Issue ID')
  });

const createIssueRelationSchema = z.object({
    issueId: z.number().describe('Source issue ID'),
    issue_to_id: z.number().describe('Target issue ID'),
    relation_type: z.enum(['relates', 'duplicates', 'duplicated', 'blocks', 'blocked', 'precedes', 'follows', 'copied_to', 'copied_from']).describe('Type of relation'),
    delay: z.number().optional().describe('Delay in days (for precedes/follows relations)')
  });

const deleteIssueRelationSchema = z.object({
    relationId: z.number().describe('Relation ID to delete')
  });

const listWikiPagesSchema = z.object({
    projectId: z.union([z.number(), z.string()]).describe('Project ID or identifier')
  });

const getWikiPageSchema = z.object({
    projectId: z.union([z.number(), z.string()]).describe('Project ID or identifier'),
    pageTitle: z.string().describe('Wiki page title')
  });

const createWikiPageSchema = z.object({
    projectId: z.union([z.number(), z.string()]).describe('Project ID or identifier'),
    pageTitle: z.string().describe('Wiki page title'),
    text: z.string().describe('Wiki page content (textile format)'),
    comments: z.string().optional().describe('Comments about the changes')
  });

const deleteWikiPageSchema = z.object({
    projectId: z.union([z.number(), z.string()]).describe('Project ID or identifier'),
    pageTitle: z.string().describe('Wiki page title to delete')
  });

// Tool for listing issue relations
export const listIssueRelationsTool = {
  name: 'list_issue_relations',
  description: 'List all relations for a specific issue',
  inputSchema: listIssueRelationsSchema,
  jsonSchema: zodToJsonSchema(listIssueRelationsSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const relations = await client.getIssueRelations(args.issueId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(relations, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing issue relations: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for creating issue relation
export const createIssueRelationTool = {
  name: 'create_issue_relation',
  description: 'Create a relation between two issues',
  inputSchema: createIssueRelationSchema,
  jsonSchema: zodToJsonSchema(createIssueRelationSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const { issueId, ...relationData } = args;
      const relation = await client.createIssueRelation(issueId, relationData);
      return {
        content: [
          {
            type: 'text',
            text: `Issue relation created successfully:\n${JSON.stringify(relation, null, 2)}`
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error creating issue relation: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for deleting issue relation
export const deleteIssueRelationTool = {
  name: 'delete_issue_relation',
  description: 'Delete a specific issue relation',
  inputSchema: deleteIssueRelationSchema,
  jsonSchema: zodToJsonSchema(deleteIssueRelationSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      await client.deleteIssueRelation(args.relationId);
      return {
        content: [
          {
            type: 'text',
            text: `Issue relation ${args.relationId} deleted successfully`
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error deleting issue relation: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for listing wiki pages
export const listWikiPagesTool = {
  name: 'list_wiki_pages',
  description: 'List all wiki pages for a specific project',
  inputSchema: listWikiPagesSchema,
  jsonSchema: zodToJsonSchema(listWikiPagesSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const wikiPages = await client.getWikiPages(args.projectId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(wikiPages, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing wiki pages: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for getting a wiki page
export const getWikiPageTool = {
  name: 'get_wiki_page',
  description: 'Get content of a specific wiki page',
  inputSchema: getWikiPageSchema,
  jsonSchema: zodToJsonSchema(getWikiPageSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const wikiPage = await client.getWikiPage(args.projectId, args.pageTitle);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(wikiPage, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting wiki page: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for creating/updating wiki page
export const createWikiPageTool = {
  name: 'create_wiki_page',
  description: 'Create or update a wiki page',
  inputSchema: createWikiPageSchema,
  jsonSchema: zodToJsonSchema(createWikiPageSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const { projectId, pageTitle, ...wikiPageData } = args;
      const wikiPage = await client.createWikiPage(projectId, pageTitle, wikiPageData);
      return {
        content: [
          {
            type: 'text',
            text: `Wiki page created/updated successfully:\n${JSON.stringify(wikiPage, null, 2)}`
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error creating/updating wiki page: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for deleting wiki page
export const deleteWikiPageTool = {
  name: 'delete_wiki_page',
  description: 'Delete a wiki page',
  inputSchema: deleteWikiPageSchema,
  jsonSchema: zodToJsonSchema(deleteWikiPageSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      await client.deleteWikiPage(args.projectId, args.pageTitle);
      return {
        content: [
          {
            type: 'text',
            text: `Wiki page "${args.pageTitle}" deleted successfully`
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error deleting wiki page: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

export const contentManagementTools = [
  listIssueRelationsTool,
  createIssueRelationTool,
  deleteIssueRelationTool,
  listWikiPagesTool,
  getWikiPageTool,
  createWikiPageTool,
  deleteWikiPageTool
];
