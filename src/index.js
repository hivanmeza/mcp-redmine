#!/usr/bin/env node
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var types_js_1 = require("@modelcontextprotocol/sdk/types.js");
var redmine_client_js_1 = require("./client/redmine-client.js");
var project_tools_js_1 = require("./tools/project-tools.js");
var issue_tools_js_1 = require("./tools/issue-tools.js");
var admin_tools_js_1 = require("./tools/admin-tools.js");
var project_management_tools_js_1 = require("./tools/project-management-tools.js");
var advanced_admin_tools_js_1 = require("./tools/advanced-admin-tools.js");
var content_management_tools_js_1 = require("./tools/content-management-tools.js");
var search_and_file_tools_js_1 = require("./tools/search-and-file-tools.js");
var dotenv = require("dotenv");
// Load environment variables
dotenv.config();
var RedmineMCPServer = /** @class */ (function () {
    function RedmineMCPServer() {
        this.redmineClient = null;
        this.server = new index_js_1.Server({
            name: 'redmine-mcp-server',
            version: '0.1.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        // Combine all tools
        this.tools = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], project_tools_js_1.projectTools, true), issue_tools_js_1.issueTools, true), admin_tools_js_1.adminTools, true), project_management_tools_js_1.projectManagementTools, true), advanced_admin_tools_js_1.advancedAdminTools, true), content_management_tools_js_1.contentManagementTools, true), search_and_file_tools_js_1.searchAndFileTools, true);
        this.setupToolHandlers();
        this.setupErrorHandling();
    }
    RedmineMCPServer.prototype.setupToolHandlers = function () {
        var _this = this;
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        tools: this.tools.map(function (tool) { return ({
                            name: tool.name,
                            description: tool.description,
                            inputSchema: tool.inputSchema,
                        }); }),
                    }];
            });
        }); });
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, function (request) { return __awaiter(_this, void 0, void 0, function () {
            var _a, name, args, tool, validatedArgs, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.params, name = _a.name, args = _a.arguments;
                        // Initialize Redmine client if not already done
                        if (!this.redmineClient) {
                            this.initializeRedmineClient();
                        }
                        tool = this.tools.find(function (t) { return t.name === name; });
                        if (!tool) {
                            throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, "Tool ".concat(name, " not found"));
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        validatedArgs = tool.inputSchema.parse(args);
                        return [4 /*yield*/, tool.handler(validatedArgs, this.redmineClient)];
                    case 2: 
                    // Execute the tool
                    return [2 /*return*/, _b.sent()];
                    case 3:
                        error_1 = _b.sent();
                        if (error_1.name === 'ZodError') {
                            throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, "Invalid arguments for tool ".concat(name, ": ").concat(error_1.message));
                        }
                        throw new types_js_1.McpError(types_js_1.ErrorCode.InternalError, "Error executing tool ".concat(name, ": ").concat(error_1.message));
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    RedmineMCPServer.prototype.initializeRedmineClient = function () {
        var baseUrl = process.env.REDMINE_BASE_URL;
        var apiKey = process.env.REDMINE_API_KEY;
        var username = process.env.REDMINE_USERNAME;
        var password = process.env.REDMINE_PASSWORD;
        var impersonateUser = process.env.REDMINE_IMPERSONATE_USER;
        if (!baseUrl) {
            throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidRequest, 'REDMINE_BASE_URL environment variable is required');
        }
        if (!apiKey && (!username || !password)) {
            throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidRequest, 'Either REDMINE_API_KEY or both REDMINE_USERNAME and REDMINE_PASSWORD environment variables are required');
        }
        this.redmineClient = new redmine_client_js_1.RedmineClient({
            baseUrl: baseUrl,
            apiKey: apiKey,
            username: username,
            password: password,
            impersonateUser: impersonateUser,
        });
    };
    RedmineMCPServer.prototype.setupErrorHandling = function () {
        var _this = this;
        this.server.onerror = function (error) {
            console.error('[MCP Error]', error);
        };
        process.on('SIGINT', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.server.close()];
                    case 1:
                        _a.sent();
                        process.exit(0);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    RedmineMCPServer.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var transport;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transport = new stdio_js_1.StdioServerTransport();
                        return [4 /*yield*/, this.server.connect(transport)];
                    case 1:
                        _a.sent();
                        console.error('Redmine MCP server running on stdio');
                        return [2 /*return*/];
                }
            });
        });
    };
    return RedmineMCPServer;
}());
var server = new RedmineMCPServer();
server.run().catch(console.error);
