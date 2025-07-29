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
exports.contentManagementTools = exports.deleteWikiPageTool = exports.createWikiPageTool = exports.getWikiPageTool = exports.listWikiPagesTool = exports.deleteIssueRelationTool = exports.createIssueRelationTool = exports.listIssueRelationsTool = void 0;
var zod_1 = require("zod");
// Tool for listing issue relations
exports.listIssueRelationsTool = {
    name: 'list_issue_relations',
    description: 'List all relations for a specific issue',
    inputSchema: zod_1.z.object({
        issueId: zod_1.z.number().describe('Issue ID')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var relations, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getIssueRelations(args.issueId)];
                case 1:
                    relations = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(relations, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_1 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error listing issue relations: ".concat(error_1.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for creating issue relation
exports.createIssueRelationTool = {
    name: 'create_issue_relation',
    description: 'Create a relation between two issues',
    inputSchema: zod_1.z.object({
        issueId: zod_1.z.number().describe('Source issue ID'),
        issue_to_id: zod_1.z.number().describe('Target issue ID'),
        relation_type: zod_1.z.enum(['relates', 'duplicates', 'duplicated', 'blocks', 'blocked', 'precedes', 'follows', 'copied_to', 'copied_from']).describe('Type of relation'),
        delay: zod_1.z.number().optional().describe('Delay in days (for precedes/follows relations)')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var issueId, relationData, relation, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    issueId = args.issueId, relationData = __rest(args, ["issueId"]);
                    return [4 /*yield*/, client.createIssueRelation(issueId, relationData)];
                case 1:
                    relation = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Issue relation created successfully:\n".concat(JSON.stringify(relation, null, 2))
                                }
                            ]
                        }];
                case 2:
                    error_2 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error creating issue relation: ".concat(error_2.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for deleting issue relation
exports.deleteIssueRelationTool = {
    name: 'delete_issue_relation',
    description: 'Delete a specific issue relation',
    inputSchema: zod_1.z.object({
        relationId: zod_1.z.number().describe('Relation ID to delete')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.deleteIssueRelation(args.relationId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Issue relation ".concat(args.relationId, " deleted successfully")
                                }
                            ]
                        }];
                case 2:
                    error_3 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error deleting issue relation: ".concat(error_3.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for listing wiki pages
exports.listWikiPagesTool = {
    name: 'list_wiki_pages',
    description: 'List all wiki pages for a specific project',
    inputSchema: zod_1.z.object({
        projectId: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).describe('Project ID or identifier')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var wikiPages, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getWikiPages(args.projectId)];
                case 1:
                    wikiPages = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(wikiPages, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_4 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error listing wiki pages: ".concat(error_4.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for getting a wiki page
exports.getWikiPageTool = {
    name: 'get_wiki_page',
    description: 'Get content of a specific wiki page',
    inputSchema: zod_1.z.object({
        projectId: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).describe('Project ID or identifier'),
        pageTitle: zod_1.z.string().describe('Wiki page title')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var wikiPage, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getWikiPage(args.projectId, args.pageTitle)];
                case 1:
                    wikiPage = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(wikiPage, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_5 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error getting wiki page: ".concat(error_5.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for creating/updating wiki page
exports.createWikiPageTool = {
    name: 'create_wiki_page',
    description: 'Create or update a wiki page',
    inputSchema: zod_1.z.object({
        projectId: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).describe('Project ID or identifier'),
        pageTitle: zod_1.z.string().describe('Wiki page title'),
        text: zod_1.z.string().describe('Wiki page content (textile format)'),
        comments: zod_1.z.string().optional().describe('Comments about the changes')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var projectId, pageTitle, wikiPageData, wikiPage, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    projectId = args.projectId, pageTitle = args.pageTitle, wikiPageData = __rest(args, ["projectId", "pageTitle"]);
                    return [4 /*yield*/, client.createWikiPage(projectId, pageTitle, wikiPageData)];
                case 1:
                    wikiPage = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Wiki page created/updated successfully:\n".concat(JSON.stringify(wikiPage, null, 2))
                                }
                            ]
                        }];
                case 2:
                    error_6 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error creating/updating wiki page: ".concat(error_6.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for deleting wiki page
exports.deleteWikiPageTool = {
    name: 'delete_wiki_page',
    description: 'Delete a wiki page',
    inputSchema: zod_1.z.object({
        projectId: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).describe('Project ID or identifier'),
        pageTitle: zod_1.z.string().describe('Wiki page title to delete')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.deleteWikiPage(args.projectId, args.pageTitle)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Wiki page \"".concat(args.pageTitle, "\" deleted successfully")
                                }
                            ]
                        }];
                case 2:
                    error_7 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error deleting wiki page: ".concat(error_7.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
exports.contentManagementTools = [
    exports.listIssueRelationsTool,
    exports.createIssueRelationTool,
    exports.deleteIssueRelationTool,
    exports.listWikiPagesTool,
    exports.getWikiPageTool,
    exports.createWikiPageTool,
    exports.deleteWikiPageTool
];
