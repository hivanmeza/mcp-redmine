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
exports.RedmineClient = void 0;
var axios_1 = require("axios");
var RedmineClient = /** @class */ (function () {
    function RedmineClient(config) {
        this.config = config;
        var headers = {
            'Content-Type': 'application/json',
        };
        // Configure authentication
        var auth;
        if (config.apiKey) {
            headers['X-Redmine-API-Key'] = config.apiKey;
        }
        else if (config.username && config.password) {
            auth = {
                username: config.username,
                password: config.password
            };
        }
        else {
            throw new Error('Either apiKey or username/password must be provided');
        }
        // Configure user impersonation if specified
        if (config.impersonateUser) {
            headers['X-Redmine-Switch-User'] = config.impersonateUser;
        }
        this.client = axios_1.default.create({
            baseURL: config.baseUrl,
            headers: headers,
            auth: auth,
        });
    }
    // Projects
    RedmineClient.prototype.getProjects = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        if (filters === null || filters === void 0 ? void 0 : filters.limit)
                            params.append('limit', filters.limit.toString());
                        if (filters === null || filters === void 0 ? void 0 : filters.offset)
                            params.append('offset', filters.offset.toString());
                        if (filters === null || filters === void 0 ? void 0 : filters.include)
                            params.append('include', filters.include.join(','));
                        return [4 /*yield*/, this.client.get("/projects.json?".concat(params))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.projects];
                }
            });
        });
    };
    RedmineClient.prototype.getProject = function (projectId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get("/projects/".concat(projectId, ".json"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.project];
                }
            });
        });
    };
    RedmineClient.prototype.createProject = function (project) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.post('/projects.json', { project: project })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.project];
                }
            });
        });
    };
    RedmineClient.prototype.updateProject = function (projectId, project) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.put("/projects/".concat(projectId, ".json"), { project: project })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.project];
                }
            });
        });
    };
    RedmineClient.prototype.deleteProject = function (projectId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.delete("/projects/".concat(projectId, ".json"))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Issues
    RedmineClient.prototype.getIssues = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        if (filters === null || filters === void 0 ? void 0 : filters.project_id)
                            params.append('project_id', filters.project_id.toString());
                        if (filters === null || filters === void 0 ? void 0 : filters.status_id)
                            params.append('status_id', filters.status_id.toString());
                        if (filters === null || filters === void 0 ? void 0 : filters.assigned_to_id)
                            params.append('assigned_to_id', filters.assigned_to_id.toString());
                        if (filters === null || filters === void 0 ? void 0 : filters.author_id)
                            params.append('author_id', filters.author_id.toString());
                        if (filters === null || filters === void 0 ? void 0 : filters.tracker_id)
                            params.append('tracker_id', filters.tracker_id.toString());
                        if (filters === null || filters === void 0 ? void 0 : filters.priority_id)
                            params.append('priority_id', filters.priority_id.toString());
                        if (filters === null || filters === void 0 ? void 0 : filters.created_on)
                            params.append('created_on', filters.created_on);
                        if (filters === null || filters === void 0 ? void 0 : filters.updated_on)
                            params.append('updated_on', filters.updated_on);
                        if (filters === null || filters === void 0 ? void 0 : filters.subject)
                            params.append('subject', filters.subject);
                        if (filters === null || filters === void 0 ? void 0 : filters.limit)
                            params.append('limit', filters.limit.toString());
                        if (filters === null || filters === void 0 ? void 0 : filters.offset)
                            params.append('offset', filters.offset.toString());
                        if (filters === null || filters === void 0 ? void 0 : filters.sort)
                            params.append('sort', filters.sort);
                        return [4 /*yield*/, this.client.get("/issues.json?".concat(params))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.issues];
                }
            });
        });
    };
    RedmineClient.prototype.getIssue = function (issueId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get("/issues/".concat(issueId, ".json"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.issue];
                }
            });
        });
    };
    RedmineClient.prototype.createIssue = function (issue) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.post('/issues.json', { issue: issue })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.issue];
                }
            });
        });
    };
    RedmineClient.prototype.updateIssue = function (issueId, issue) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.put("/issues/".concat(issueId, ".json"), { issue: issue })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.issue];
                }
            });
        });
    };
    RedmineClient.prototype.deleteIssue = function (issueId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.delete("/issues/".concat(issueId, ".json"))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Users
    RedmineClient.prototype.getUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get('/users.json')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.users];
                }
            });
        });
    };
    RedmineClient.prototype.getUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get("/users/".concat(userId, ".json"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.user];
                }
            });
        });
    };
    RedmineClient.prototype.getCurrentUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get('/users/current.json')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.user];
                }
            });
        });
    };
    // Trackers
    RedmineClient.prototype.getTrackers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get('/trackers.json')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.trackers];
                }
            });
        });
    };
    // Issue Statuses
    RedmineClient.prototype.getIssueStatuses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get('/issue_statuses.json')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.issue_statuses];
                }
            });
        });
    };
    // Issue Priorities
    RedmineClient.prototype.getIssuePriorities = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get('/enumerations/issue_priorities.json')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.issue_priorities];
                }
            });
        });
    };
    // Time Entries
    RedmineClient.prototype.getTimeEntries = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        if (filters === null || filters === void 0 ? void 0 : filters.issue_id)
                            params.append('issue_id', filters.issue_id.toString());
                        if (filters === null || filters === void 0 ? void 0 : filters.project_id)
                            params.append('project_id', filters.project_id.toString());
                        if (filters === null || filters === void 0 ? void 0 : filters.user_id)
                            params.append('user_id', filters.user_id.toString());
                        if (filters === null || filters === void 0 ? void 0 : filters.limit)
                            params.append('limit', filters.limit.toString());
                        if (filters === null || filters === void 0 ? void 0 : filters.offset)
                            params.append('offset', filters.offset.toString());
                        return [4 /*yield*/, this.client.get("/time_entries.json?".concat(params))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.time_entries];
                }
            });
        });
    };
    RedmineClient.prototype.createTimeEntry = function (timeEntry) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.post('/time_entries.json', { time_entry: timeEntry })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.time_entry];
                }
            });
        });
    };
    // Versions
    RedmineClient.prototype.getVersions = function (projectId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get("/projects/".concat(projectId, "/versions.json"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.versions];
                }
            });
        });
    };
    RedmineClient.prototype.createVersion = function (projectId, version) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.post("/projects/".concat(projectId, "/versions.json"), { version: version })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.version];
                }
            });
        });
    };
    // Issue Categories
    RedmineClient.prototype.getIssueCategories = function (projectId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get("/projects/".concat(projectId, "/issue_categories.json"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.issue_categories];
                }
            });
        });
    };
    RedmineClient.prototype.createIssueCategory = function (projectId, category) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.post("/projects/".concat(projectId, "/issue_categories.json"), { issue_category: category })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.issue_category];
                }
            });
        });
    };
    // Roles
    RedmineClient.prototype.getRoles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get('/roles.json')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.roles];
                }
            });
        });
    };
    // Groups
    RedmineClient.prototype.getGroups = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get('/groups.json')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.groups];
                }
            });
        });
    };
    RedmineClient.prototype.getGroup = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get("/groups/".concat(groupId, ".json?include=users"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.group];
                }
            });
        });
    };
    RedmineClient.prototype.createGroup = function (group) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.post('/groups.json', { group: group })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.group];
                }
            });
        });
    };
    // Project Memberships
    RedmineClient.prototype.getProjectMemberships = function (projectId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get("/projects/".concat(projectId, "/memberships.json"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.memberships];
                }
            });
        });
    };
    RedmineClient.prototype.createProjectMembership = function (projectId, membership) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.post("/projects/".concat(projectId, "/memberships.json"), { membership: membership })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.membership];
                }
            });
        });
    };
    // Issue Relations
    RedmineClient.prototype.getIssueRelations = function (issueId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get("/issues/".concat(issueId, "/relations.json"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.relations];
                }
            });
        });
    };
    RedmineClient.prototype.createIssueRelation = function (issueId, relation) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.post("/issues/".concat(issueId, "/relations.json"), { relation: relation })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.relation];
                }
            });
        });
    };
    RedmineClient.prototype.deleteIssueRelation = function (relationId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.delete("/relations/".concat(relationId, ".json"))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Wiki Pages
    RedmineClient.prototype.getWikiPage = function (projectId, pageTitle) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get("/projects/".concat(projectId, "/wiki/").concat(pageTitle, ".json"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.wiki_page];
                }
            });
        });
    };
    RedmineClient.prototype.getWikiPages = function (projectId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get("/projects/".concat(projectId, "/wiki/index.json"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.wiki_pages];
                }
            });
        });
    };
    RedmineClient.prototype.createWikiPage = function (projectId, pageTitle, wikiPage) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.put("/projects/".concat(projectId, "/wiki/").concat(pageTitle, ".json"), { wiki_page: wikiPage })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.wiki_page];
                }
            });
        });
    };
    RedmineClient.prototype.updateWikiPage = function (projectId, pageTitle, wikiPage) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.put("/projects/".concat(projectId, "/wiki/").concat(pageTitle, ".json"), { wiki_page: wikiPage })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.wiki_page];
                }
            });
        });
    };
    RedmineClient.prototype.deleteWikiPage = function (projectId, pageTitle) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.delete("/projects/".concat(projectId, "/wiki/").concat(pageTitle, ".json"))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Queries
    RedmineClient.prototype.getQueries = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get('/queries.json')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.queries];
                }
            });
        });
    };
    // Attachments and File Upload
    RedmineClient.prototype.uploadFile = function (fileContent, filename) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.post("/uploads.json?filename=".concat(encodeURIComponent(filename)), fileContent, {
                            headers: {
                                'Content-Type': 'application/octet-stream'
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.upload];
                }
            });
        });
    };
    RedmineClient.prototype.getAttachment = function (attachmentId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get("/attachments/".concat(attachmentId, ".json"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.attachment];
                }
            });
        });
    };
    // News
    RedmineClient.prototype.getNews = function (projectId) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = projectId ? "/projects/".concat(projectId, "/news.json") : '/news.json';
                        return [4 /*yield*/, this.client.get(url)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.news];
                }
            });
        });
    };
    // Time Entry Activities
    RedmineClient.prototype.getTimeEntryActivities = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get('/enumerations/time_entry_activities.json')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.time_entry_activities];
                }
            });
        });
    };
    // Search (requires Redmine 3.3+)
    RedmineClient.prototype.search = function (query, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        params.append('q', query);
                        if (options === null || options === void 0 ? void 0 : options.titles_only)
                            params.append('titles_only', '1');
                        if (options === null || options === void 0 ? void 0 : options.all_words)
                            params.append('all_words', '1');
                        if (options === null || options === void 0 ? void 0 : options.scope)
                            params.append('scope', options.scope);
                        if (options === null || options === void 0 ? void 0 : options.limit)
                            params.append('limit', options.limit.toString());
                        if (options === null || options === void 0 ? void 0 : options.offset)
                            params.append('offset', options.offset.toString());
                        return [4 /*yield*/, this.client.get("/search.json?".concat(params))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    return RedmineClient;
}());
exports.RedmineClient = RedmineClient;
