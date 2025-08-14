"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAndFileTools = exports.listQueriesTool = exports.listNewsTool = exports.getAttachmentTool = exports.uploadFileTool = exports.searchTool = void 0;
var zod_1 = require("zod");
// Tool for searching in Redmine
exports.searchTool = {
    name: 'search',
    description: 'Search across Redmine content (requires Redmine 3.3+)',
    inputSchema: zod_1.z.object({
        query: zod_1.z.string().describe('Search query'),
        titles_only: zod_1.z.boolean().optional().describe('Search only in titles'),
        all_words: zod_1.z.boolean().optional().describe('All words must be present'),
        scope: zod_1.z.enum(['issues', 'news', 'documents', 'changesets', 'wiki_pages', 'messages']).optional().describe('Limit search to specific content type'),
        limit: zod_1.z.number().optional().describe('Number of results to return'),
        offset: zod_1.z.number().optional().describe('Number of results to skip')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var query, options, results, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = args.query, options = __rest(args, ["query"]);
                    return [4 /*yield*/, client.search(query, options)];
                case 1:
                    results = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(results, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_1 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error searching: ".concat(error_1.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for uploading files
exports.uploadFileTool = {
    name: 'upload_file',
    description: 'Upload a file to Redmine and get an upload token for attaching to issues',
    inputSchema: zod_1.z.object({
        filename: zod_1.z.string().describe('Name of the file to upload'),
        fileContent: zod_1.z.string().describe('Base64 encoded file content'),
        contentType: zod_1.z.string().optional().describe('MIME type of the file')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var fileBuffer, uploadToken, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    fileBuffer = Buffer.from(args.fileContent, 'base64');
                    return [4 /*yield*/, client.uploadFile(fileBuffer, args.filename)];
                case 1:
                    uploadToken = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "File uploaded successfully. Upload token: ".concat(uploadToken.token, "\nUse this token to attach the file to issues.")
                                }
                            ]
                        }];
                case 2:
                    error_2 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error uploading file: ".concat(error_2.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for getting attachment details
exports.getAttachmentTool = {
    name: 'get_attachment',
    description: 'Get details of a specific attachment',
    inputSchema: zod_1.z.object({
        attachmentId: zod_1.z.number().describe('Attachment ID')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var attachment, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getAttachment(args.attachmentId)];
                case 1:
                    attachment = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(attachment, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_3 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error getting attachment: ".concat(error_3.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for listing news
exports.listNewsTool = {
    name: 'list_news',
    description: 'List news articles from Redmine',
    inputSchema: zod_1.z.object({
        projectId: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).optional().describe('Project ID or identifier (optional, if not provided, lists all news)')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var news, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getNews(args.projectId)];
                case 1:
                    news = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(news, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_4 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error listing news: ".concat(error_4.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for listing queries
exports.listQueriesTool = {
    name: 'list_queries',
    description: 'List saved queries in Redmine',
    inputSchema: zod_1.z.object({}),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var queries, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getQueries()];
                case 1:
                    queries = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(queries, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_5 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error listing queries: ".concat(error_5.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
exports.searchAndFileTools = [
    exports.searchTool,
    exports.uploadFileTool,
    exports.getAttachmentTool,
    exports.listNewsTool,
    exports.listQueriesTool
];
