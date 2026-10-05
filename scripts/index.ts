#!/usr/bin/env node

import { graphql } from '@octokit/graphql';
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import type { Repository, ProcessedRepository, Telemetry } from './types.js';
import { QUERY } from './graphql.js';
import { calculateMaturityScore, getMaturityLevel } from './scoring.js';

const GITHUB_ORG = process.env.GITHUB_ORG || 'nesxtep-software';

// Get GitHub token from gh-cli
function getGitHubToken(): string {
  try {
    const token = execSync('gh auth token', { encoding: 'utf-8' }).trim();
    return token;
  } catch (error) {
    console.error('Failed to get GitHub token from gh-cli. Make sure gh-cli is installed and authenticated.');
    console.error('Run: gh auth login');
    process.exit(1);
  }
}

const GITHUB_TOKEN = getGitHubToken();

async function fetchAllRepositories(): Promise<Repository[]> {
  const repositories: Repository[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${GITHUB_TOKEN}`,
    },
  });

  while (hasNextPage) {
    console.log(`Fetching repositories with cursor: ${cursor || 'initial'}`);
    const data: { organization: { repositories: { nodes: Repository[]; pageInfo: { hasNextPage: boolean; endCursor: string } } } } = await graphqlWithAuth(QUERY, {
      org: GITHUB_ORG,
      cursor,
    });

    const repos = data.organization.repositories.nodes.filter(
      (repo) => !repo.isArchived
    );
    repositories.push(...repos);

    hasNextPage = data.organization.repositories.pageInfo.hasNextPage;
    cursor = data.organization.repositories.pageInfo.endCursor;
  }

  return repositories;
}

function extractVersion(repo: Repository): string | null {
  if (repo.packageJson) {
    try {
      const packageData = JSON.parse(repo.packageJson.text);
      return packageData.version || null;
    } catch (e) {
      return null;
    }
  }
  return null;
}

async function main(): Promise<void> {
  console.log(`Fetching repositories for ${GITHUB_ORG}...`);
  const repositories = await fetchAllRepositories();
  console.log(`Found ${repositories.length} repositories`);

  const processedRepos: ProcessedRepository[] = repositories.map((repo) => {
    const maturityScore = calculateMaturityScore(repo);
    const version = extractVersion(repo);
    const maturityLevel = getMaturityLevel({
      version,
      maturityScore,
      latestRelease: repo.latestRelease,
    });

    return {
      name: repo.name,
      description: repo.description || '',
      primaryLanguage: repo.primaryLanguage?.name || 'Unknown',
      topics: repo.repositoryTopics.nodes.map((t: any) => t.topic.name),
      pushedAt: repo.pushedAt,
      stargazerCount: repo.stargazerCount,
      openIssues: repo.openIssues.totalCount,
      closedIssues: repo.closedIssues.totalCount,
      milestone: repo.milestones.nodes[0]
        ? {
            title: repo.milestones.nodes[0].title,
            dueOn: repo.milestones.nodes[0].dueOn,
            openIssues: repo.milestones.nodes[0].openIssues.totalCount,
            closedIssues: repo.milestones.nodes[0].closedIssues.totalCount,
          }
        : null,
      latestRelease: repo.latestRelease || null,
      releases: repo.releases?.nodes || [],
      tags: repo.refs?.nodes || [],
      hasPackageJson: !!repo.packageJson,
      version,
      hasReadme: !!repo.readme,
      hasLicense: !!repo.license,
      hasContributing: !!repo.contributing,
      hasChangelog: !!repo.changelog,
      hasWorkflows: !!(repo.workflows?.entries && repo.workflows.entries.length > 0),
      defaultBranch: 'main',
      maturityScore,
      maturityLevel,
    };
  });

  const telemetry: Telemetry = {
    generatedAt: new Date().toISOString(),
    repositories: processedRepos,
  };

  const outputPath = resolve(process.cwd(), 'src/data/portfolio-telemetry.json');
  writeFileSync(outputPath, JSON.stringify(telemetry, null, 2));
  console.log(`Telemetry written to ${outputPath}`);
  console.log(`Note: This file is gitignored - only used for local development`);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
