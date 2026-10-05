// Type definitions for GitHub telemetry ingestion

export interface Repository {
  name: string;
  description: string;
  isArchived: boolean;
  primaryLanguage?: {
    name: string;
  };
  pushedAt: string;
  stargazerCount: number;
  repositoryTopics: {
    nodes: {
      topic: {
        name: string;
      };
    }[];
  };
  packageJson?: {
    text: string;
  };
  readme?: {
    text: string;
  };
  license?: {
    text: string;
  };
  contributing?: {
    text: string;
  };
  changelog?: {
    text: string;
  };
  workflows?: {
    entries: {
      name: string;
    }[];
  };
  openIssues: {
    totalCount: number;
  };
  closedIssues: {
    totalCount: number;
  };
  milestones: {
    nodes: {
      title: string;
      dueOn: string | null;
      openIssues: {
        totalCount: number;
      };
      closedIssues: {
        totalCount: number;
      };
    }[];
  };
  latestRelease?: {
    name: string;
    tagName: string;
    publishedAt: string;
  };
  releases?: {
    nodes: {
      name: string | null;
      tagName: string;
      isLatest: boolean;
      isDraft: boolean;
      publishedAt: string;
    }[];
  };
  refs?: {
    nodes: {
      name: string;
      target?: {
        message?: string;
      };
    }[];
  };
}

export interface ProcessedRepository {
  name: string;
  description: string;
  primaryLanguage: string;
  topics: string[];
  pushedAt: string;
  stargazerCount: number;
  openIssues: number;
  closedIssues: number;
  milestone: {
    title: string;
    dueOn: string | null;
    openIssues: number;
    closedIssues: number;
  } | null;
  latestRelease: {
    name: string;
    tagName: string;
    publishedAt: string;
  } | null;
  releases: {
    name: string | null;
    tagName: string;
    isLatest: boolean;
    isDraft: boolean;
    publishedAt: string;
  }[];
  tags: {
    name: string;
    target?: {
      message?: string;
    };
  }[];
  hasPackageJson: boolean;
  version: string | null;
  hasReadme: boolean;
  hasLicense: boolean;
  hasContributing: boolean;
  hasChangelog: boolean;
  hasWorkflows: boolean;
  defaultBranch: string;
  maturityScore: number;
  maturityLevel: string;
}

export interface Telemetry {
  generatedAt: string;
  repositories: ProcessedRepository[];
}
