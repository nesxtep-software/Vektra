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
        license: object(expression: "HEAD:LICENSE") {
          ... on Blob { text }
        }
        contributing: object(expression: "HEAD:CONTRIBUTING.md") {
          ... on Blob { text }
        }
        changelog: object(expression: "HEAD:CHANGELOG.md") {
          ... on Blob { text }
        }
        workflows: object(expression: "HEAD:.github/workflows") {
          ... on Tree {
            entries {
              name
            }
          }
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
  let penalty = 0;

  // Documentation (Weight: 15%)
  // +5 if README.md exists
  if (repo.readme) {
    score += 5;
  }
  // +5 if CONTRIBUTING.md exists
  if (repo.contributing) {
    score += 5;
  }
  // +5 if CHANGELOG.md exists
  if (repo.changelog) {
    score += 5;
  }

  // CI/CD & Automation (Weight: 15%)
  // +15 if has GitHub Actions workflows (CI/CD)
  const hasWorkflows = repo.workflows?.entries?.length > 0;
  if (hasWorkflows) {
    score += 15;
  }

  // Community & Governance (Weight: 10%)
  // +10 if LICENSE exists
  if (repo.license) {
    score += 10;
  }

  // Versioning & Release Evidence (Weight: 40%)
  // Parse version from package.json or latest release
  let version = null;
  if (repo.packageJson) {
    try {
      const packageData = JSON.parse(repo.packageJson.text);
      version = packageData.version || null;
    } catch (e) {
      // Invalid JSON, skip
    }
  }

  // Fallback to latest release if no package.json version
  if (!version && repo.latestRelease?.tagName) {
    version = repo.latestRelease.tagName.replace(/^v/, '');
  }

  if (version) {
    const [major, minor, patch] = version.split('.').map(Number);

    // Version-based scoring
    if (major < 1) {
      // PoC: 0.x.x versions
      score += 10;
    } else if (major === 1) {
      // MVP: 1.x.x versions
      score += 25;
    } else {
      // Production: 2.x.x and above
      score += 30;
    }

    // Additional points for release evidence
    const releases = repo.releases?.nodes || [];
    const hasRelease = releases.some(r => !r.isDraft);
    if (hasRelease) {
      score += 5;
    }

    const tags = repo.refs?.nodes || [];
    const hasVersionTag = tags.some(t => /^v?\d+\.\d+\.\d+/.test(t.name));
    if (hasVersionTag) {
      score += 5;
    }
  }

  // Issue Management (Weight: 10%)
  // +0 to +10 based on issue completion ratio
  const totalIssues = repo.openIssues.totalCount + repo.closedIssues.totalCount;
  if (totalIssues > 0) {
    const completionRatio = repo.closedIssues.totalCount / totalIssues;
    score += Math.round(completionRatio * 10);
  }

  // Recent Activity (Weight: 10%)
  // +10 if commits within last 30 days, +5 if within 60 days
  const pushedAt = new Date(repo.pushedAt);
  const now = new Date();
  const daysSinceLastCommit = Math.floor((now - pushedAt) / (1000 * 60 * 60 * 24));

  if (daysSinceLastCommit <= 30) {
    score += 10;
  } else if (daysSinceLastCommit <= 60) {
    score += 5;
  }

  // Penalty: Milestone contains version that doesn't match latest release
  // Only penalize if milestone has a version number that's significantly different from current release
  if (repo.milestone && repo.latestRelease) {
    const milestoneTitle = repo.milestone.title.toLowerCase();
    const releaseTag = repo.latestRelease.tagName.toLowerCase().replace(/^v/, '');

    // Extract version from milestone title (e.g., "v1.0.0" or "1.0.0")
    const milestoneVersionMatch = milestoneTitle.match(/v?(\d+\.\d+\.\d+)/);

    if (milestoneVersionMatch) {
      const milestoneVersion = milestoneVersionMatch[1];

      // Check if milestone version is different from release version
      // If milestone is tracking a different version (e.g., next release), that's OK
      // Only penalize if milestone is outdated (milestone version < release version)
      const [mMajor, mMinor, mPatch] = milestoneVersion.split('.').map(Number);
      const [rMajor, rMinor, rPatch] = releaseTag.split('.').map(Number);

      // If milestone version is significantly older than release, penalize
      if (mMajor < rMajor || (mMajor === rMajor && mMinor < rMinor)) {
        penalty += 10;
      }
    }
  }

  return Math.max(0, Math.min(score - penalty, 100));
}

function getMaturityLevel(repo) {
  // Check version-based level first
  let version = repo.version;
  if (!version && repo.latestRelease?.tagName) {
    version = repo.latestRelease.tagName.replace(/^v/, '');
  }

  if (version) {
    const [major] = version.split('.').map(Number);

    if (major < 1) {
      return 'Level 1: PoC';
    } else if (major === 1) {
      return 'Level 2: MVP';
    } else {
      return 'Level 3: Production';
    }
  }

  // Fallback to score-based levels if no version
  const score = repo.maturityScore;
  if (score <= 30) return 'Level 1: PoC';
  if (score <= 60) return 'Level 2: MVP';
  return 'Level 3: Production';
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
    const maturityLevel = getMaturityLevel(repo);

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
      hasLicense: !!repo.license,
      hasContributing: !!repo.contributing,
      hasChangelog: !!repo.changelog,
      hasWorkflows: repo.workflows?.entries?.length > 0,
      defaultBranch: repo.defaultBranchRef?.name || 'main',
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
