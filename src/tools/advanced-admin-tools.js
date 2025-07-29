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
exports.advancedAdminTools = exports.listTimeEntryActivitiesTool = exports.createProjectMembershipTool = exports.listProjectMembershipsTool = exports.createGroupTool = exports.getGroupTool = exports.listGroupsTool = exports.listRolesTool = void 0;
var zod_1 = require("zod");
// Tool for listing roles
exports.listRolesTool = {
    name: 'list_roles',
    description: 'List all roles in Redmine',
    inputSchema: zod_1.z.object({}),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var roles, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getRoles()];
                case 1:
                    roles = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(roles, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_1 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error listing roles: ".concat(error_1.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for listing groups
exports.listGroupsTool = {
    name: 'list_groups',
    description: 'List all groups in Redmine',
    inputSchema: zod_1.z.object({}),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var groups, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getGroups()];
                case 1:
                    groups = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(groups, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_2 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error listing groups: ".concat(error_2.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for getting a specific group
exports.getGroupTool = {
    name: 'get_group',
    description: 'Get details of a specific group including its users',
    inputSchema: zod_1.z.object({
        groupId: zod_1.z.number().describe('Group ID')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var group, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getGroup(args.groupId)];
                case 1:
                    group = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(group, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_3 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error getting group: ".concat(error_3.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for creating a group
exports.createGroupTool = {
    name: 'create_group',
    description: 'Create a new group in Redmine',
    inputSchema: zod_1.z.object({
        name: zod_1.z.string().describe('Group name'),
        user_ids: zod_1.z.array(zod_1.z.number()).optional().describe('Array of user IDs to add to the group')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var group, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.createGroup(args)];
                case 1:
                    group = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Group created successfully:\n".concat(JSON.stringify(group, null, 2))
                                }
                            ]
                        }];
                case 2:
                    error_4 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error creating group: ".concat(error_4.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for listing project memberships
exports.listProjectMembershipsTool = {
    name: 'list_project_memberships',
    description: 'List all memberships for a specific project',
    inputSchema: zod_1.z.object({
        projectId: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).describe('Project ID or identifier')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var memberships, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getProjectMemberships(args.projectId)];
                case 1:
                    memberships = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(memberships, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_5 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error listing project memberships: ".concat(error_5.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for creating project membership
exports.createProjectMembershipTool = {
    name: 'create_project_membership',
    description: 'Add a user or group to a project with specific roles',
    inputSchema: zod_1.z.object({
        projectId: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).describe('Project ID or identifier'),
        user_id: zod_1.z.number().optional().describe('User ID (required if group_id not provided)'),
        group_id: zod_1.z.number().optional().describe('Group ID (required if user_id not provided)'),
        role_ids: zod_1.z.array(zod_1.z.number()).describe('Array of role IDs to assign')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var projectId, membershipData, membership, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    projectId = args.projectId, membershipData = __rest(args, ["projectId"]);
                    return [4 /*yield*/, client.createProjectMembership(projectId, membershipData)];
                case 1:
                    membership = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Project membership created successfully:\n".concat(JSON.stringify(membership, null, 2))
                                }
                            ]
                        }];
                case 2:
                    error_6 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error creating project membership: ".concat(error_6.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for listing time entry activities
exports.listTimeEntryActivitiesTool = {
    name: 'list_time_entry_activities',
    description: 'List all time entry activities available in Redmine',
    inputSchema: zod_1.z.object({}),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var activities, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getTimeEntryActivities()];
                case 1:
                    activities = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(activities, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_7 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error listing time entry activities: ".concat(error_7.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
exports.advancedAdminTools = [
    exports.listRolesTool,
    exports.listGroupsTool,
    exports.getGroupTool,
    exports.createGroupTool,
    exports.listProjectMembershipsTool,
    exports.createProjectMembershipTool,
    exports.listTimeEntryActivitiesTool
];
