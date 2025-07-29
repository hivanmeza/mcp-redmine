// Redmine API Types
export interface RedmineConfig {
  baseUrl: string;
  // Authentication options
  apiKey?: string;
  username?: string;
  password?: string;
  // User impersonation (requires admin privileges)
  impersonateUser?: string;
}

export interface RedmineProject {
  id: number;
  name: string;
  identifier: string;
  description?: string;
  status: number;
  created_on: string;
  updated_on: string;
}

export interface RedmineIssue {
  id: number;
  project: {
    id: number;
    name: string;
  };
  tracker: {
    id: number;
    name: string;
  };
  status: {
    id: number;
    name: string;
  };
  priority: {
    id: number;
    name: string;
  };
  author: {
    id: number;
    name: string;
  };
  assigned_to?: {
    id: number;
    name: string;
  };
  subject: string;
  description?: string;
  start_date?: string;
  due_date?: string;
  done_ratio: number;
  estimated_hours?: number;
  created_on: string;
  updated_on: string;
  journals?: RedmineJournal[];
}

export interface RedmineJournal {
  id: number;
  user: {
    id: number;
    name: string;
  };
  notes?: string;
  created_on: string;
  details?: Array<{
    property: string;
    name: string;
    old_value?: string;
    new_value?: string;
  }>;
}

export interface RedmineUser {
  id: number;
  login: string;
  firstname: string;
  lastname: string;
  mail: string;
  created_on: string;
  last_login_on?: string;
}

export interface RedmineTracker {
  id: number;
  name: string;
  default_status: {
    id: number;
    name: string;
  };
}

export interface RedmineIssueStatus {
  id: number;
  name: string;
  is_closed: boolean;
}

export interface RedmineIssuePriority {
  id: number;
  name: string;
  is_default: boolean;
}

export interface RedmineCustomField {
  id: number;
  name: string;
  customized_type: string;
  field_format: string;
  regexp: string;
  min_length?: number;
  max_length?: number;
  is_required: boolean;
  is_filter: boolean;
  searchable: boolean;
  multiple: boolean;
  default_value?: string;
  visible: boolean;
}

export interface RedmineTimeEntry {
  id: number;
  project: {
    id: number;
    name: string;
  };
  issue?: {
    id: number;
  };
  user: {
    id: number;
    name: string;
  };
  activity: {
    id: number;
    name: string;
  };
  hours: number;
  comments?: string;
  spent_on: string;
  created_on: string;
  updated_on: string;
}

export interface RedmineVersion {
  id: number;
  project: {
    id: number;
    name: string;
  };
  name: string;
  description?: string;
  status: string;
  due_date?: string;
  sharing: string;
  created_on: string;
  updated_on: string;
}

export interface RedmineIssueCategory {
  id: number;
  project: {
    id: number;
    name: string;
  };
  name: string;
  assigned_to?: {
    id: number;
    name: string;
  };
}

export interface RedmineRole {
  id: number;
  name: string;
  assignable: boolean;
  builtin: number;
  permissions: string[];
}

export interface RedmineGroup {
  id: number;
  name: string;
  users?: RedmineUser[];
}

export interface RedmineProjectMembership {
  id: number;
  project: {
    id: number;
    name: string;
  };
  user?: {
    id: number;
    name: string;
  };
  group?: {
    id: number;
    name: string;
  };
  roles: RedmineRole[];
}

export interface RedmineIssueRelation {
  id: number;
  issue_id: number;
  issue_to_id: number;
  relation_type: 'relates' | 'duplicates' | 'duplicated' | 'blocks' | 'blocked' | 'precedes' | 'follows' | 'copied_to' | 'copied_from';
  delay?: number;
}

export interface RedmineWikiPage {
  title: string;
  text: string;
  comments?: string;
  version: number;
  author: {
    id: number;
    name: string;
  };
  created_on: string;
  updated_on: string;
}

export interface RedmineQuery {
  id: number;
  name: string;
  is_public: boolean;
  project_id?: number;
}

export interface RedmineAttachment {
  id: number;
  filename: string;
  filesize: number;
  content_type: string;
  description?: string;
  content_url: string;
  author: {
    id: number;
    name: string;
  };
  created_on: string;
}

export interface RedmineUploadToken {
  token: string;
}

export interface RedmineNews {
  id: number;
  project: {
    id: number;
    name: string;
  };
  title: string;
  summary: string;
  description: string;
  author: {
    id: number;
    name: string;
  };
  created_on: string;
}

export interface RedmineActivity {
  id: number;
  name: string;
  is_default: boolean;
}

// API Response Types
export interface RedmineListResponse<T> {
  [key: string]: T[] | number;
  total_count: number;
  offset: number;
  limit: number;
}

export interface RedmineItemResponse<T> {
  [key: string]: T;
}

// Filter and Query Types
export interface RedmineIssueFilters {
  project_id?: number;
  status_id?: number | 'open' | 'closed' | '*';
  assigned_to_id?: number | 'me';
  author_id?: number;
  tracker_id?: number;
  priority_id?: number;
  created_on?: string;
  updated_on?: string;
  subject?: string;
  limit?: number;
  offset?: number;
  sort?: string;
}

export interface RedmineProjectFilters {
  limit?: number;
  offset?: number;
  include?: string[];
}

// User Filters (for endpoint documentation clarity)
export interface RedmineUserFilters {
  limit?: number;
  offset?: number;
  name?: string;
  group_id?: number;
  status?: number;
}
