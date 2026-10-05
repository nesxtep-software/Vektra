import type { Repository } from './types';

export function calculateMaturityScore(repo: Repository): number {
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
  const hasWorkflows = repo.workflows?.entries && repo.workflows.entries.length > 0;
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
  let version: string | null = null;
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
    const hasRelease = releases.some((r) => !r.isDraft);
    if (hasRelease) {
      score += 5;
    }

    const tags = repo.refs?.nodes || [];
    const hasVersionTag = tags.some((t) => /^v?\d+\.\d+\.\d+/.test(t.name));
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
  const daysSinceLastCommit = Math.floor(
    (now.getTime() - pushedAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLastCommit <= 30) {
    score += 10;
  } else if (daysSinceLastCommit <= 60) {
    score += 5;
  }

  // Penalty: Milestone contains version that doesn't match latest release
  // Only penalize if milestone has a version number that's significantly different from current release
  const milestone = repo.milestones?.nodes[0];
  if (milestone && repo.latestRelease) {
    const milestoneTitle = milestone.title.toLowerCase();
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

export function getMaturityLevel(repo: { version: string | null; maturityScore: number; latestRelease?: { tagName: string } }): string {
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
