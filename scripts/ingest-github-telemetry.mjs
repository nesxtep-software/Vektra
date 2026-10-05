#!/usr/bin/env node

import { graphql } from '@octokit/graphql';
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const GITHUB_ORG = process.env.GITHUB_ORG || 'nesxtep-software';

// Get GitHub token from gh-cli
function getGitHubToken() {
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

const QUERY = `
query FetchOrgPortfolioMetrics($org: String!, $cursor: String) {
  organization(login: $org) {
    repositories(first: 100, after: $cursor, isFork: false) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        name
        description
        isArchived
        primaryLanguage {
          name
        }
        pushedAt
        stargazerCount
        repositoryTopics(first: 10) {
          nodes { topic { name } }
        }
        packageJson: object(expression: "HEAD:package.json") {
          ... on Blob { text }
        }
        dockerfile: object(expression: "HEAD:Dockerfile") {
          ... on Blob { text }
        }
        dockerCompose: object(expression: "HEAD:docker-compose.yml") {
          ... on Blob { text }
        }
        readme: object(expression: "HEAD:README.md") {
          ... on Blob { text }
        }
        openIssues: issues(states: OPEN) { totalCount }
        closedIssues: issues(states: CLOSED) { totalCount }
        milestones(states: OPEN, first: 1) {
          nodes {
            title
            dueOn
            openIssues: issues(states: OPEN) { totalCount }
            closedIssues: issues(states: CLOSED) { totalCount }
          }
        }
        latestRelease { name tagName publishedAt }
        releases(first: 5, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            name
            tagName
            isLatest
            isDraft
            publishedAt
          }
        }
        refs(refPrefix: "refs/tags/", first: 10) {
          nodes {
            name
            target {
              ... on Tag {
                message
              }
            }
          }
        }
      }
    }
  }
}
`;

async function fetchAllRepositories() {
  const repositories = [];
  let cursor = null;
  let hasNextPage = true;

  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${GITHUB_TOKEN}`,
    },
  });

  while (hasNextPage) {
    console.log(`Fetching repositories with cursor: ${cursor || 'initial'}`);
    const data = await graphqlWithAuth(QUERY, {
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

function calculateMaturityScore(repo) {
  let score = 0;

  // Documentation (Weight: 10%)
  // +10 if README.md exists
  if (repo.readme) {
    score += 10;
  }

  // Versioning (Weight: 25%)
  // +25 if package.json exists with valid SemVer version (not 0.0.0)
  if (repo.packageJson) {
    try {
      const packageData = JSON.parse(repo.packageJson.text);
      const version = packageData.version || '0.0.0';
      if (version !== '0.0.0') {
        score += 25;
      }
    } catch (e) {
      // Invalid JSON, skip
    }
  }

  // Release Evidence (Weight: 30%)
  // +20 if has GitHub releases (non-draft)
  const releases = repo.releases?.nodes || [];
  const hasRelease = releases.some(r => !r.isDraft);
  if (hasRelease) {
    score += 20;
  }

  // +10 if has version tags (SemVer pattern)
  const tags = repo.refs?.nodes || [];
  const hasVersionTag = tags.some(t => /^v?\d+\.\d+\.\d+/.test(t.name));
  if (hasVersionTag) {
    score += 10;
  }

  // Containerization (Weight: 10%)
  // +10 if Dockerfile or docker-compose.yml exists
  // Note: Not required for web apps, but good for microservices
  if (repo.dockerfile || repo.dockerCompose) {
    score += 10;
  }

  // Issue Management (Weight: 10%)
  // +0 to +10 based on issue completion ratio
  const totalIssues = repo.openIssues.totalCount + repo.closedIssues.totalCount;
  if (totalIssues > 0) {
    const completionRatio = repo.closedIssues.totalCount / totalIssues;
    score += Math.round(completionRatio * 10);
  }

  // Recent Activity (Weight: 15%)
  // +15 if commits within last 30 days, +12 if within 60 days, +8 if within 180 days, +5 if within 1 year
  const pushedAt = new Date(repo.pushedAt);
  const now = new Date();
  const daysSinceLastCommit = Math.floor((now - pushedAt) / (1000 * 60 * 60 * 24));

  if (daysSinceLastCommit <= 30) {
    score += 15;
  } else if (daysSinceLastCommit <= 60) {
    score += 12;
  } else if (daysSinceLastCommit <= 180) {
    score += 8;
  } else if (daysSinceLastCommit <= 365) {
    score += 5;
  }

  // Production topic bonus (optional manual signal)
  // Check for production topic - gives extra boost but not required
  const isProduction = repo.repositoryTopics.nodes.some(
    (t) => t.topic.name === 'production'
  );
  if (isProduction) {
    score += 5; // Reduced from 15 - just a bonus now
  }

  return Math.min(score, 100);
}

function getMaturityLevel(score) {
  if (score <= 30) return 'Level 1: Concept & Spec';
  if (score <= 50) return 'Level 2: Architecture';
  if (score <= 70) return 'Level 3: Core MVP';
  if (score <= 85) return 'Level 4: Staging / Beta';
  return 'Level 5: Production';
}

function extractVersion(repo) {
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

async function main() {
  console.log(`Fetching repositories for ${GITHUB_ORG}...`);
  const repositories = await fetchAllRepositories();
  console.log(`Found ${repositories.length} repositories`);

  const processedRepos = repositories.map((repo) => {
    const maturityScore = calculateMaturityScore(repo);
    const maturityLevel = getMaturityLevel(maturityScore);

    return {
      name: repo.name,
      description: repo.description || '',
      primaryLanguage: repo.primaryLanguage?.name || 'Unknown',
      topics: repo.repositoryTopics.nodes.map((t) => t.topic.name),
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
      latestRelease: repo.latestRelease,
      releases: repo.releases?.nodes || [],
      tags: repo.refs?.nodes || [],
      hasPackageJson: !!repo.packageJson,
      version: extractVersion(repo),
      hasDockerfile: !!repo.dockerfile,
      hasDockerCompose: !!repo.dockerCompose,
      hasReadme: !!repo.readme,
      maturityScore,
      maturityLevel,
    };
  });

  const telemetry = {
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
