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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminTools = exports.listIssuePrioritiesTool = exports.listIssueStatusesTool = exports.listTrackersTool = exports.getCurrentUserTool = exports.getUserTool = exports.listUsersTool = void 0;
var zod_1 = require("zod");
// Tool for listing users
exports.listUsersTool = {
    name: 'list_users',
    description: 'List all users in Redmine',
    inputSchema: zod_1.z.object({}),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var users, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getUsers()];
                case 1:
                    users = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(users, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_1 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error listing users: ".concat(error_1.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for getting a specific user
exports.getUserTool = {
    name: 'get_user',
    description: 'Get details of a specific user by ID',
    inputSchema: zod_1.z.object({
        userId: zod_1.z.number().describe('User ID')
    }),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var user, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getUser(args.userId)];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(user, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_2 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error getting user: ".concat(error_2.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for getting current user
exports.getCurrentUserTool = {
    name: 'get_current_user',
    description: 'Get details of the current authenticated user',
    inputSchema: zod_1.z.object({}),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var user, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getCurrentUser()];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(user, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_3 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error getting current user: ".concat(error_3.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for listing trackers
exports.listTrackersTool = {
    name: 'list_trackers',
    description: 'List all issue trackers in Redmine',
    inputSchema: zod_1.z.object({}),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var trackers, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getTrackers()];
                case 1:
                    trackers = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(trackers, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_4 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error listing trackers: ".concat(error_4.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for listing issue statuses
exports.listIssueStatusesTool = {
    name: 'list_issue_statuses',
    description: 'List all issue statuses in Redmine',
    inputSchema: zod_1.z.object({}),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var statuses, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getIssueStatuses()];
                case 1:
                    statuses = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(statuses, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_5 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error listing issue statuses: ".concat(error_5.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// Tool for listing issue priorities
exports.listIssuePrioritiesTool = {
    name: 'list_issue_priorities',
    description: 'List all issue priorities in Redmine',
    inputSchema: zod_1.z.object({}),
    handler: function (args, client) { return __awaiter(void 0, void 0, void 0, function () {
        var priorities, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.getIssuePriorities()];
                case 1:
                    priorities = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(priorities, null, 2)
                                }
                            ]
                        }];
                case 2:
                    error_6 = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error listing issue priorities: ".concat(error_6.message)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
exports.adminTools = [
    exports.listUsersTool,
    exports.getUserTool,
    exports.getCurrentUserTool,
    exports.listTrackersTool,
    exports.listIssueStatusesTool,
    exports.listIssuePrioritiesTool
];
