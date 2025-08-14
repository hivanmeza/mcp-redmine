import axios, { AxiosInstance } from 'axios';
import {
  RedmineActivity,
  RedmineAttachment,
  RedmineConfig,
  RedmineGroup,
  RedmineIssue,
  RedmineIssueCategory,
  RedmineIssueFilters,
  RedmineIssuePriority,
  RedmineIssueRelation,
  RedmineIssueStatus,
  RedmineItemResponse,
  RedmineListResponse,
  RedmineNews,
  RedmineProject,
  RedmineProjectFilters,
  RedmineProjectMembership,
  RedmineQuery,
  RedmineRole,
  RedmineTimeEntry,
  RedmineTracker,
  RedmineUploadToken,
  RedmineUser,
  RedmineVersion,
  RedmineWikiPage
} from '../types/redmine.js';

export class RedmineClient {
  private client: AxiosInstance;
  private config: RedmineConfig;

  constructor(config: RedmineConfig) {
    this.config = config;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Configure authentication
    let auth;
    if (config.apiKey) {
      headers['X-Redmine-API-Key'] = config.apiKey;
    } else if (config.username && config.password) {
      auth = {
        username: config.username,
        password: config.password
      };
    } else {
      throw new Error('Either apiKey or username/password must be provided');
    }

    // Configure user impersonation if specified
    if (config.impersonateUser) {
      headers['X-Redmine-Switch-User'] = config.impersonateUser;
    }

    this.client = axios.create({
      baseURL: config.baseUrl,
      headers,
      auth,
    });
  }

  // Projects
  async getProjects(filters?: RedmineProjectFilters): Promise<RedmineProject[]> {
    let projects: RedmineProject[] = [];
    let offset = filters?.offset || 0;
    const limit = filters?.limit || 100;
    let include = filters?.include ? `&include=${filters.include.join(',')}` : '';

    while (true) {
      const response = await this.client.get<RedmineListResponse<RedmineProject>>(`/projects.json?limit=${limit}&offset=${offset}${include}`);
      const batch = response.data.projects as RedmineProject[];
      if (!batch || batch.length === 0) break;
      projects = projects.concat(batch);
      if (batch.length < limit) break;
      offset += limit;
    }
    return projects;
  }

  async getProject(projectId: number | string): Promise<RedmineProject> {
    const response = await this.client.get<RedmineItemResponse<RedmineProject>>(`/projects/${projectId}.json`);
    return response.data.project as RedmineProject;
  }

  async createProject(project: Partial<RedmineProject>): Promise<RedmineProject> {
    const response = await this.client.post<RedmineItemResponse<RedmineProject>>('/projects.json', { project });
    return response.data.project as RedmineProject;
  }

  async updateProject(projectId: number | string, project: Partial<RedmineProject>): Promise<RedmineProject> {
    const response = await this.client.put<RedmineItemResponse<RedmineProject>>(`/projects/${projectId}.json`, { project });
    return response.data.project as RedmineProject;
  }

  async deleteProject(projectId: number | string): Promise<void> {
    await this.client.delete(`/projects/${projectId}.json`);
  }

  // Issues
  async getIssues(filters?: RedmineIssueFilters): Promise<RedmineIssue[]> {
    // Si no se especifica limit o offset, usar paginación automática
    if (!filters?.limit && !filters?.offset) {
      let issues: RedmineIssue[] = [];
      let offset = 0;
      const limit = 100;

      while (true) {
        const params = new URLSearchParams();
        if (filters?.project_id) params.append('project_id', filters.project_id.toString());
        if (filters?.status_id) params.append('status_id', filters.status_id.toString());
        if (filters?.assigned_to_id) params.append('assigned_to_id', filters.assigned_to_id.toString());
        if (filters?.author_id) params.append('author_id', filters.author_id.toString());
        if (filters?.tracker_id) params.append('tracker_id', filters.tracker_id.toString());
        if (filters?.priority_id) params.append('priority_id', filters.priority_id.toString());
        if (filters?.created_on) params.append('created_on', filters.created_on);
        if (filters?.updated_on) params.append('updated_on', filters.updated_on);
        if (filters?.subject) params.append('subject', filters.subject);
        if (filters?.sort) params.append('sort', filters.sort);
        params.append('limit', limit.toString());
        params.append('offset', offset.toString());

        const response = await this.client.get<RedmineListResponse<RedmineIssue>>(`/issues.json?${params}`);
        const batch = response.data.issues as RedmineIssue[];
        if (!batch || batch.length === 0) break;
        issues = issues.concat(batch);
        if (batch.length < limit) break;
        offset += limit;
      }
      return issues;
    } else {
      // Usar parámetros especificados por el usuario
      const params = new URLSearchParams();
      if (filters?.project_id) params.append('project_id', filters.project_id.toString());
      if (filters?.status_id) params.append('status_id', filters.status_id.toString());
      if (filters?.assigned_to_id) params.append('assigned_to_id', filters.assigned_to_id.toString());
      if (filters?.author_id) params.append('author_id', filters.author_id.toString());
      if (filters?.tracker_id) params.append('tracker_id', filters.tracker_id.toString());
      if (filters?.priority_id) params.append('priority_id', filters.priority_id.toString());
      if (filters?.created_on) params.append('created_on', filters.created_on);
      if (filters?.updated_on) params.append('updated_on', filters.updated_on);
      if (filters?.subject) params.append('subject', filters.subject);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());
      if (filters?.sort) params.append('sort', filters.sort);

      const response = await this.client.get<RedmineListResponse<RedmineIssue>>(`/issues.json?${params}`);
      return response.data.issues as RedmineIssue[];
    }
  }

  async getIssue(issueId: number): Promise<RedmineIssue> {
    return this.getIssueWithOptions(issueId);
  }

  async getIssueWithOptions(issueId: number, options?: { include?: string | string[] }): Promise<RedmineIssue> {
    let includeParam = '';
    if (options?.include) {
      if (Array.isArray(options.include)) {
        includeParam = `?include=${options.include.join(',')}`;
      } else {
        includeParam = `?include=${options.include}`;
      }
    }
    const response = await this.client.get<RedmineItemResponse<RedmineIssue>>(`/issues/${issueId}.json${includeParam}`);
    return response.data.issue as RedmineIssue;
  }

  async createIssue(issue: Partial<RedmineIssue>): Promise<RedmineIssue> {
    const response = await this.client.post<RedmineItemResponse<RedmineIssue>>('/issues.json', { issue });
    return response.data.issue as RedmineIssue;
  }

  async updateIssue(issueId: number, issue: Partial<RedmineIssue>): Promise<RedmineIssue> {
    const response = await this.client.put<RedmineItemResponse<RedmineIssue>>(`/issues/${issueId}.json`, { issue });
    return response.data.issue as RedmineIssue;
  }

  async deleteIssue(issueId: number): Promise<void> {
    await this.client.delete(`/issues/${issueId}.json`);
  }

  // Users
  async getUsers(): Promise<RedmineUser[]> {
    let users: RedmineUser[] = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const response = await this.client.get<RedmineListResponse<RedmineUser>>(`/users.json?limit=${limit}&offset=${offset}`);
      const batch = response.data.users as RedmineUser[];
      if (!batch || batch.length === 0) break;
      users = users.concat(batch);
      if (batch.length < limit) break;
      offset += limit;
    }
    return users;
  }

  async getUser(userId: number): Promise<RedmineUser> {
    const response = await this.client.get<RedmineItemResponse<RedmineUser>>(`/users/${userId}.json`);
    return response.data.user as RedmineUser;
  }

  async getCurrentUser(): Promise<RedmineUser> {
    const response = await this.client.get<RedmineItemResponse<RedmineUser>>('/users/current.json');
    return response.data.user as RedmineUser;
  }

  // Trackers
  async getTrackers(): Promise<RedmineTracker[]> {
    let trackers: RedmineTracker[] = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const response = await this.client.get<RedmineListResponse<RedmineTracker>>(`/trackers.json?limit=${limit}&offset=${offset}`);
      const batch = response.data.trackers as RedmineTracker[];
      if (!batch || batch.length === 0) break;
      trackers = trackers.concat(batch);
      if (batch.length < limit) break;
      offset += limit;
    }
    return trackers;
  }

  // Issue Statuses
  async getIssueStatuses(): Promise<RedmineIssueStatus[]> {
    let statuses: RedmineIssueStatus[] = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const response = await this.client.get<RedmineListResponse<RedmineIssueStatus>>(`/issue_statuses.json?limit=${limit}&offset=${offset}`);
      const batch = response.data.issue_statuses as RedmineIssueStatus[];
      if (!batch || batch.length === 0) break;
      statuses = statuses.concat(batch);
      if (batch.length < limit) break;
      offset += limit;
    }
    return statuses;
  }

  // Issue Priorities
  async getIssuePriorities(): Promise<RedmineIssuePriority[]> {
    let priorities: RedmineIssuePriority[] = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const response = await this.client.get<RedmineListResponse<RedmineIssuePriority>>(`/enumerations/issue_priorities.json?limit=${limit}&offset=${offset}`);
      const batch = response.data.issue_priorities as RedmineIssuePriority[];
      if (!batch || batch.length === 0) break;
      priorities = priorities.concat(batch);
      if (batch.length < limit) break;
      offset += limit;
    }
    return priorities;
  }

  // Time Entries
  async getTimeEntries(filters?: { issue_id?: number; project_id?: number; user_id?: number; limit?: number; offset?: number }): Promise<RedmineTimeEntry[]> {
    const params = new URLSearchParams();
    if (filters?.issue_id) params.append('issue_id', filters.issue_id.toString());
    if (filters?.project_id) params.append('project_id', filters.project_id.toString());
    if (filters?.user_id) params.append('user_id', filters.user_id.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await this.client.get<RedmineListResponse<RedmineTimeEntry>>(`/time_entries.json?${params}`);
    return response.data.time_entries as RedmineTimeEntry[];
  }

  async createTimeEntry(timeEntry: Partial<RedmineTimeEntry>): Promise<RedmineTimeEntry> {
    const response = await this.client.post<RedmineItemResponse<RedmineTimeEntry>>('/time_entries.json', { time_entry: timeEntry });
    return response.data.time_entry as RedmineTimeEntry;
  }

  // Versions
  async getVersions(projectId: number | string): Promise<RedmineVersion[]> {
    const response = await this.client.get<RedmineListResponse<RedmineVersion>>(`/projects/${projectId}/versions.json`);
    return response.data.versions as RedmineVersion[];
  }

  async createVersion(projectId: number | string, version: Partial<RedmineVersion>): Promise<RedmineVersion> {
    const response = await this.client.post<RedmineItemResponse<RedmineVersion>>(`/projects/${projectId}/versions.json`, { version });
    return response.data.version as RedmineVersion;
  }

  // Issue Categories
  async getIssueCategories(projectId: number | string): Promise<RedmineIssueCategory[]> {
    const response = await this.client.get<RedmineListResponse<RedmineIssueCategory>>(`/projects/${projectId}/issue_categories.json`);
    return response.data.issue_categories as RedmineIssueCategory[];
  }

  async createIssueCategory(projectId: number | string, category: Partial<RedmineIssueCategory>): Promise<RedmineIssueCategory> {
    const response = await this.client.post<RedmineItemResponse<RedmineIssueCategory>>(`/projects/${projectId}/issue_categories.json`, { issue_category: category });
    return response.data.issue_category as RedmineIssueCategory;
  }

  // Roles
  async getRoles(): Promise<RedmineRole[]> {
    let roles: RedmineRole[] = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const response = await this.client.get<RedmineListResponse<RedmineRole>>(`/roles.json?limit=${limit}&offset=${offset}`);
      const batch = response.data.roles as RedmineRole[];
      if (!batch || batch.length === 0) break;
      roles = roles.concat(batch);
      if (batch.length < limit) break;
      offset += limit;
    }
    return roles;
  }

  // Groups
  async getGroups(): Promise<RedmineGroup[]> {
    let groups: RedmineGroup[] = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const response = await this.client.get<RedmineListResponse<RedmineGroup>>(`/groups.json?limit=${limit}&offset=${offset}`);
      const batch = response.data.groups as RedmineGroup[];
      if (!batch || batch.length === 0) break;
      groups = groups.concat(batch);
      if (batch.length < limit) break;
      offset += limit;
    }
    return groups;
  }

  async getGroup(groupId: number): Promise<RedmineGroup> {
    const response = await this.client.get<RedmineItemResponse<RedmineGroup>>(`/groups/${groupId}.json?include=users`);
    return response.data.group as RedmineGroup;
  }

  async createGroup(group: Partial<RedmineGroup>): Promise<RedmineGroup> {
    const response = await this.client.post<RedmineItemResponse<RedmineGroup>>('/groups.json', { group });
    return response.data.group as RedmineGroup;
  }

  // Project Memberships
  async getProjectMemberships(projectId: number | string): Promise<RedmineProjectMembership[]> {
    const response = await this.client.get<RedmineListResponse<RedmineProjectMembership>>(`/projects/${projectId}/memberships.json`);
    return response.data.memberships as RedmineProjectMembership[];
  }

  async createProjectMembership(projectId: number | string, membership: Partial<RedmineProjectMembership>): Promise<RedmineProjectMembership> {
    const response = await this.client.post<RedmineItemResponse<RedmineProjectMembership>>(`/projects/${projectId}/memberships.json`, { membership });
    return response.data.membership as RedmineProjectMembership;
  }

  // Issue Relations
  async getIssueRelations(issueId: number): Promise<RedmineIssueRelation[]> {
    const response = await this.client.get<RedmineListResponse<RedmineIssueRelation>>(`/issues/${issueId}/relations.json`);
    return response.data.relations as RedmineIssueRelation[];
  }

  async createIssueRelation(issueId: number, relation: Partial<RedmineIssueRelation>): Promise<RedmineIssueRelation> {
    const response = await this.client.post<RedmineItemResponse<RedmineIssueRelation>>(`/issues/${issueId}/relations.json`, { relation });
    return response.data.relation as RedmineIssueRelation;
  }

  async deleteIssueRelation(relationId: number): Promise<void> {
    await this.client.delete(`/relations/${relationId}.json`);
  }

  // Wiki Pages
  async getWikiPage(projectId: number | string, pageTitle: string): Promise<RedmineWikiPage> {
    const response = await this.client.get<RedmineItemResponse<RedmineWikiPage>>(`/projects/${projectId}/wiki/${pageTitle}.json`);
    return response.data.wiki_page as RedmineWikiPage;
  }

  async getWikiPages(projectId: number | string): Promise<RedmineWikiPage[]> {
    const response = await this.client.get<RedmineListResponse<RedmineWikiPage>>(`/projects/${projectId}/wiki/index.json`);
    return response.data.wiki_pages as RedmineWikiPage[];
  }

  async createWikiPage(projectId: number | string, pageTitle: string, wikiPage: Partial<RedmineWikiPage>): Promise<RedmineWikiPage> {
    const response = await this.client.put<RedmineItemResponse<RedmineWikiPage>>(`/projects/${projectId}/wiki/${pageTitle}.json`, { wiki_page: wikiPage });
    return response.data.wiki_page as RedmineWikiPage;
  }

  async updateWikiPage(projectId: number | string, pageTitle: string, wikiPage: Partial<RedmineWikiPage>): Promise<RedmineWikiPage> {
    const response = await this.client.put<RedmineItemResponse<RedmineWikiPage>>(`/projects/${projectId}/wiki/${pageTitle}.json`, { wiki_page: wikiPage });
    return response.data.wiki_page as RedmineWikiPage;
  }

  async deleteWikiPage(projectId: number | string, pageTitle: string): Promise<void> {
    await this.client.delete(`/projects/${projectId}/wiki/${pageTitle}.json`);
  }

  // Queries
  async getQueries(): Promise<RedmineQuery[]> {
    let queries: RedmineQuery[] = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const response = await this.client.get<RedmineListResponse<RedmineQuery>>(`/queries.json?limit=${limit}&offset=${offset}`);
      const batch = response.data.queries as RedmineQuery[];
      if (!batch || batch.length === 0) break;
      queries = queries.concat(batch);
      if (batch.length < limit) break;
      offset += limit;
    }
    return queries;
  }

  // Attachments and File Upload
  async uploadFile(fileContent: Buffer, filename: string): Promise<RedmineUploadToken> {
    const response = await this.client.post<RedmineItemResponse<RedmineUploadToken>>(`/uploads.json?filename=${encodeURIComponent(filename)}`, fileContent, {
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    });
    return response.data.upload as RedmineUploadToken;
  }

  async getAttachment(attachmentId: number): Promise<RedmineAttachment> {
    const response = await this.client.get<RedmineItemResponse<RedmineAttachment>>(`/attachments/${attachmentId}.json`);
    return response.data.attachment as RedmineAttachment;
  }

  // News
  async getNews(projectId?: number | string): Promise<RedmineNews[]> {
    let news: RedmineNews[] = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const url = projectId ? `/projects/${projectId}/news.json?limit=${limit}&offset=${offset}` : `/news.json?limit=${limit}&offset=${offset}`;
      const response = await this.client.get<RedmineListResponse<RedmineNews>>(url);
      const batch = response.data.news as RedmineNews[];
      if (!batch || batch.length === 0) break;
      news = news.concat(batch);
      if (batch.length < limit) break;
      offset += limit;
    }
    return news;
  }

  // Time Entry Activities
  async getTimeEntryActivities(): Promise<RedmineActivity[]> {
    let activities: RedmineActivity[] = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const response = await this.client.get<RedmineListResponse<RedmineActivity>>(`/enumerations/time_entry_activities.json?limit=${limit}&offset=${offset}`);
      const batch = response.data.time_entry_activities as RedmineActivity[];
      if (!batch || batch.length === 0) break;
      activities = activities.concat(batch);
      if (batch.length < limit) break;
      offset += limit;
    }
    return activities;
  }

  // Search (requires Redmine 3.3+)
  async search(query: string, options?: { titles_only?: boolean; all_words?: boolean; scope?: string; limit?: number; offset?: number }): Promise<any> {
    const params = new URLSearchParams();
    params.append('q', query);
    if (options?.titles_only) params.append('titles_only', '1');
    if (options?.all_words) params.append('all_words', '1');
    if (options?.scope) params.append('scope', options.scope);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());

    const response = await this.client.get(`/search.json?${params}`);
    return response.data;
  }
}
