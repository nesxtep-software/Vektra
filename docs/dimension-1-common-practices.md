---
title: "Dimension 1: Common Software Engineering Practices"
description: "Measurements for foundational software engineering practices that apply to any software project"
weight: 1
---

# Dimension 1: Common Software Engineering Practices

**← [Back to Metrics & Dimensions](./README.md) | [Main README](../README.md)**

## Overview

This dimension measures the foundational software engineering practices that apply to any software project, regardless of technology stack or deployment method. These are the basic building blocks of a healthy, maintainable codebase.

## Measurements

### Repository Basics
- **Repository metadata**: Name, description, primary language
- **Default branch**: Confirmed (main/master)
- **Protected branches**: Branch protection rules enabled

### Documentation
- **README.md**: Project documentation exists
- **Contributing guidelines (CONTRIBUTING.md)**: How to contribute
- **Changelog (CHANGELOG.md)**: Version history and changes

### Version Management
- **Semantic versioning (SemVer)**: Proper version format (major.minor.patch)
- **Tags**: Git version tags
- **Releases**: GitHub releases with versioned artifacts

### Issue & Milestone Management
- **Issues**: Open and closed issues
- **Issue completion ratio**: Percentage of issues resolved
- **Milestones**: Current milestone and progress tracking
- **Milestone sync**: Milestone version should align with current release (penalty if outdated)

### CI/CD & Automation
- **GitHub Actions workflows**: CI/CD configuration files in `.github/workflows/`
- **Automated testing**: Test workflows present

### Community & Governance
- **License (LICENSE)**: Open source license file
- **Topics**: Repository topics for discoverability (GitHub-native)

## Classification (Based on SemVer)

The maturity level is primarily determined by semantic versioning:

| Level | Version Range | Description |
|-------|---------------|-------------|
| **Level 1: PoC** | < 1.0.0 (0.x.x) | Proof of Concept, experimental, not yet stable |
| **Level 2: MVP** | 1.0.0 - 1.99.99 (1.x.x) | Minimum Viable Product, stable but evolving |
| **Level 3: Production** | ≥ 2.0.0 (2.x.x+) | Production-ready, mature, stable API |

## Scoring Weights

| Category | Weight | Points |
|----------|--------|--------|
| Documentation | 15% | |
| - README.md | | +5 |
| - CONTRIBUTING.md | | +5 |
| - CHANGELOG.md | | +5 |
| CI/CD & Automation | 15% | +15 (GitHub Actions workflows) |
| Community & Governance | 10% | +10 (LICENSE) |
| Versioning & Releases | 40% | |
| - PoC (< 1.0.0) | | +10 |
| - MVP (1.x.x) | | +25 |
| - Production (≥ 2.0.0) | | +30 |
| - GitHub releases | | +5 |
| - Version tags | | +5 |
| Issue Management | 10% | +0 to +10 (completion ratio) |
| Recent Activity | 10% | +10 (≤30d), +5 (≤60d) |
| **Total** | **100%** | **100 points** |

## Penalties

- **Milestone sync**: -10 points if milestone version is significantly older than current release
  - Only penalizes outdated milestones (milestone < release version)
  - Future milestones (milestone > release version) are OK

## Notes

- **Not included**: Branch count (not meaningful), automated testing coverage (provided by Austral), linting/testing configs (provided by Austral)
- **Manual vs Automated**: All measurements are automated from GitHub API, no manual intervention required
- **Deployment-agnostic**: Works for any deployment model (serverless, containers, static, libraries)
- **Technology-agnostic**: Applies to any programming language or framework
