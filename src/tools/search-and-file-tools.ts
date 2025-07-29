import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { RedmineClient } from '../client/redmine-client.js';

// Tool for searching in Redmine
const searchSchema = z.object({
  query: z.string().describe('Search query'),
  titles_only: z.boolean().optional().describe('Search only in titles'),
  all_words: z.boolean().optional().describe('All words must be present'),
  scope: z.enum(['issues', 'news', 'documents', 'changesets', 'wiki_pages', 'messages']).optional().describe('Limit search to specific content type'),
  limit: z.number().optional().describe('Number of results to return'),
  offset: z.number().optional().describe('Number of results to skip')
});

export const searchTool = {
  name: 'search',
  description: 'Search across Redmine content (requires Redmine 3.3+)',
  inputSchema: searchSchema,
  jsonSchema: zodToJsonSchema(searchSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const { query, ...options } = args;
      const results = await client.search(query, options);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(results, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error searching: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for uploading files
const uploadFileSchema = z.object({
  filename: z.string().describe('Name of the file to upload'),
  fileContent: z.string().describe('Base64 encoded file content'),
  contentType: z.string().optional().describe('MIME type of the file')
});

export const uploadFileTool = {
  name: 'upload_file',
  description: 'Upload a file to Redmine and get an upload token for attaching to issues',
  inputSchema: uploadFileSchema,
  jsonSchema: zodToJsonSchema(uploadFileSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      // Convert base64 to buffer
      const fileBuffer = Buffer.from(args.fileContent, 'base64');
      const uploadToken = await client.uploadFile(fileBuffer, args.filename);
      return {
        content: [
          {
            type: 'text',
            text: `File uploaded successfully. Upload token: ${uploadToken.token}\nUse this token to attach the file to issues.`
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error uploading file: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for getting attachment details
const getAttachmentSchema = z.object({
  attachmentId: z.number().describe('Attachment ID')
});

export const getAttachmentTool = {
  name: 'get_attachment',
  description: 'Get details of a specific attachment',
  inputSchema: getAttachmentSchema,
  jsonSchema: zodToJsonSchema(getAttachmentSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const attachment = await client.getAttachment(args.attachmentId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(attachment, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting attachment: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for listing news
const listNewsSchema = z.object({
  projectId: z.union([z.number(), z.string()]).optional().describe('Project ID or identifier (optional, if not provided, lists all news)')
});

export const listNewsTool = {
  name: 'list_news',
  description: 'List news articles from Redmine',
  inputSchema: listNewsSchema,
  jsonSchema: zodToJsonSchema(listNewsSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const news = await client.getNews(args.projectId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(news, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing news: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

// Tool for listing queries
const listQueriesSchema = z.object({});

export const listQueriesTool = {
  name: 'list_queries',
  description: 'List saved queries in Redmine',
  inputSchema: listQueriesSchema,
  jsonSchema: zodToJsonSchema(listQueriesSchema),
  handler: async (args: any, client: RedmineClient) => {
    try {
      const queries = await client.getQueries();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(queries, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing queries: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
};

export const searchAndFileTools = [
  searchTool,
  uploadFileTool,
  getAttachmentTool,
  listNewsTool,
  listQueriesTool
];
