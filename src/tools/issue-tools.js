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
exports.issueTools = exports.deleteIssueTool = exports.updateIssueTool = exports.createIssueTool = exports.getIssueTool = exports.listIssuesTool = void 0;
var zod_1 = require("zod");
// Tool for listing issues
exports.listIssuesTool = {
    name: 'list_issues',
    description: 'List issues in Redmine with optional filters',
    inputSchema: zod_1.z.object({
        project_id: zod_1.z.number().optional().describe('Filter by project ID'),
        status_id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal('open'), zod_1.z.literal('closed'), zod_1.z.literal('*')]).optional().describe('Filter by status ID or open/closed/*'),
        assigned_to_id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal('me')]).optional().describe('Filter by assigned user ID or "me"'),
        author_id: zod_1.z.number().optional().describe('Filter by author user ID'),
        tracker_id: zod_1.z.number().optional().describe('Filter by tracker ID'),
        priority_id: zod_1.z.number().optional().describe('Filter by priority ID'),
        created_on: zod_1.z.string().optional().describe('Filter by creation date (>=2023-01-01 or 2023-01-01|2023-12-31)'),
        updated_on: zod_1.z.string().optional().describe('Filter by update date (>=2023-01-01 or 2023-01-01|2023-12-31)'),
        subject: zod_1.z.string().optional().describe('Filter by subject text'),
        limit: zod_1.z.number().optional().describe('Number of issues to return (default: 25)'),
        offset: zod_1.z.number().optional().describe('Number of issues to skip'),
        sort: zod_1.z.string().optional().describe('Sort criteria (e.g., "id:desc", "updated_on:desc")')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var issues, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getIssues(args)];
                case 1:
                    issues = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(issues, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_1 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error listing issues: ".concat(error_1.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for getting a specific issue
exports.getIssueTool = {
    name: 'get_issue',
    description: 'Get details of a specific issue by ID',
    inputSchema: zod_1.z.object({
        issueId: zod_1.z.number().describe('Issue ID')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var issue, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getIssue(args.issueId)];
                case 1:
                    issue = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(issue, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_2 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error getting issue: ".concat(error_2.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for creating a new issue
exports.createIssueTool = {
    name: 'create_issue',
    description: 'Create a new issue in Redmine',
    inputSchema: zod_1.z.object({
        project_id: zod_1.z.number().describe('Project ID'),
        tracker_id: zod_1.z.number().describe('Tracker ID'),
        subject: zod_1.z.string().describe('Issue subject'),
        description: zod_1.z.string().optional().describe('Issue description'),
        status_id: zod_1.z.number().optional().describe('Status ID'),
        priority_id: zod_1.z.number().optional().describe('Priority ID'),
        assigned_to_id: zod_1.z.number().optional().describe('Assigned user ID'),
        category_id: zod_1.z.number().optional().describe('Category ID'),
        fixed_version_id: zod_1.z.number().optional().describe('Target version ID'),
        parent_issue_id: zod_1.z.number().optional().describe('Parent issue ID'),
        start_date: zod_1.z.string().optional().describe('Start date (YYYY-MM-DD)'),
        due_date: zod_1.z.string().optional().describe('Due date (YYYY-MM-DD)'),
        estimated_hours: zod_1.z.number().optional().describe('Estimated hours'),
        done_ratio: zod_1.z.number().optional().describe('Progress percentage (0-100)')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var issue, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.createIssue(args)];
                case 1:
                    issue = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Issue created successfully:\n".concat(JSON.stringify(issue, null, 2))
                                }
                            ]
                        }];
                case 2:
                    error_3 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error creating issue: ".concat(error_3.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for updating an issue
exports.updateIssueTool = {
    name: 'update_issue',
    description: 'Update an existing issue',
    inputSchema: zod_1.z.object({
        issueId: zod_1.z.number().describe('Issue ID'),
        subject: zod_1.z.string().optional().describe('Issue subject'),
        description: zod_1.z.string().optional().describe('Issue description'),
        status_id: zod_1.z.number().optional().describe('Status ID'),
        priority_id: zod_1.z.number().optional().describe('Priority ID'),
        assigned_to_id: zod_1.z.number().optional().describe('Assigned user ID'),
        category_id: zod_1.z.number().optional().describe('Category ID'),
        fixed_version_id: zod_1.z.number().optional().describe('Target version ID'),
        parent_issue_id: zod_1.z.number().optional().describe('Parent issue ID'),
        start_date: zod_1.z.string().optional().describe('Start date (YYYY-MM-DD)'),
        due_date: zod_1.z.string().optional().describe('Due date (YYYY-MM-DD)'),
        estimated_hours: zod_1.z.number().optional().describe('Estimated hours'),
        done_ratio: zod_1.z.number().optional().describe('Progress percentage (0-100)'),
        notes: zod_1.z.string().optional().describe('Update notes/comments')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var issueId, updates, issue, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    issueId = args.issueId, updates = __rest(args, ["issueId"]);
                    return [4 /*yield*/, client.updateIssue(issueId, updates)];
                case 1:
                    issue = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Issue updated successfully:\n".concat(JSON.stringify(issue, null, 2))
                                }
                            ]
                        }];
                case 2:
                    error_4 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error updating issue: ".concat(error_4.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for deleting an issue
exports.deleteIssueTool = {
    name: 'delete_issue',
    description: 'Delete an issue from Redmine',
    inputSchema: zod_1.z.object({
        issueId: zod_1.z.number().describe('Issue ID')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.deleteIssue(args.issueId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Issue ".concat(args.issueId, " deleted successfully")
                                }
                            ]
                        }];
                case 2:
                    error_5 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error deleting issue: ".concat(error_5.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
exports.issueTools = [
    exports.listIssuesTool,
    exports.getIssueTool,
    exports.createIssueTool,
    exports.updateIssueTool,
    exports.deleteIssueTool
];
