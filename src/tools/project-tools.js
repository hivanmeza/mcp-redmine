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
exports.projectTools = exports.deleteProjectTool = exports.updateProjectTool = exports.createProjectTool = exports.getProjectTool = exports.listProjectsTool = void 0;
var zod_1 = require("zod");
// Tool for listing projects
exports.listProjectsTool = {
    name: 'list_projects',
    description: 'List all projects in Redmine',
    inputSchema: zod_1.z.object({
        limit: zod_1.z.number().optional().describe('Number of projects to return (default: 25)'),
        offset: zod_1.z.number().optional().describe('Number of projects to skip'),
        include: zod_1.z.array(zod_1.z.string()).optional().describe('Additional data to include (trackers, issue_categories, enabled_modules)')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var projects, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getProjects(args)];
                case 1:
                    projects = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(projects, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_1 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error listing projects: ".concat(error_1.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for getting a specific project
exports.getProjectTool = {
    name: 'get_project',
    description: 'Get details of a specific project by ID or identifier',
    inputSchema: zod_1.z.object({
        projectId: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).describe('Project ID or identifier')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var project, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getProject(args.projectId)];
                case 1:
                    project = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(project, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_2 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error getting project: ".concat(error_2.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for creating a new project
exports.createProjectTool = {
    name: 'create_project',
    description: 'Create a new project in Redmine',
    inputSchema: zod_1.z.object({
        name: zod_1.z.string().describe('Project name'),
        identifier: zod_1.z.string().describe('Project identifier (unique)'),
        description: zod_1.z.string().optional().describe('Project description'),
        is_public: zod_1.z.boolean().optional().describe('Whether the project is public'),
        inherit_members: zod_1.z.boolean().optional().describe('Whether to inherit members from parent project'),
        parent_id: zod_1.z.number().optional().describe('Parent project ID')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var project, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.createProject(args)];
                case 1:
                    project = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Project created successfully:\n".concat(JSON.stringify(project, null, 2))
                                }
                            ]
                        }];
                case 2:
                    error_3 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error creating project: ".concat(error_3.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for updating a project
exports.updateProjectTool = {
    name: 'update_project',
    description: 'Update an existing project',
    inputSchema: zod_1.z.object({
        projectId: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).describe('Project ID or identifier'),
        name: zod_1.z.string().optional().describe('Project name'),
        description: zod_1.z.string().optional().describe('Project description'),
        is_public: zod_1.z.boolean().optional().describe('Whether the project is public'),
        status: zod_1.z.number().optional().describe('Project status (1=active, 5=closed)')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var projectId, updates, project, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    projectId = args.projectId, updates = __rest(args, ["projectId"]);
                    return [4 /*yield*/, client.updateProject(projectId, updates)];
                case 1:
                    project = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Project updated successfully:\n".concat(JSON.stringify(project, null, 2))
                                }
                            ]
                        }];
                case 2:
                    error_4 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error updating project: ".concat(error_4.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for deleting a project
exports.deleteProjectTool = {
    name: 'delete_project',
    description: 'Delete a project from Redmine',
    inputSchema: zod_1.z.object({
        projectId: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).describe('Project ID or identifier')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.deleteProject(args.projectId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Project ".concat(args.projectId, " deleted successfully")
                                }
                            ]
                        }];
                case 2:
                    error_5 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error deleting project: ".concat(error_5.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
exports.projectTools = [
    exports.listProjectsTool,
    exports.getProjectTool,
    exports.createProjectTool,
    exports.updateProjectTool,
    exports.deleteProjectTool
];
