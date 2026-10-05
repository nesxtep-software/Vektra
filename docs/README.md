---
title: "Vektra Metrics & Dimensions"
description: "Business logic and metrics collected by Vektra for GitHub organization portfolio management"
---

# Vektra Metrics & Dimensions

**← [Back to Main README](../README.md)**

## Overview

Vektra automatically collects and analyzes GitHub telemetry to measure the maturity and operational readiness of repositories across the `nesxtep-software` organization. The metrics are organized into dimensions, each focusing on specific aspects of software engineering and production readiness.

## Business Logic

### Purpose

Vektra provides a zero-cost, automated dashboard for:
- **Portfolio visibility**: See all organization repositories in one place
- **Maturity assessment**: Understand the development stage of each project
- **Operational readiness**: Identify which applications are production-ready
- **Trend analysis**: Track progress and momentum across the portfolio
- **Resource allocation**: Make informed decisions about where to focus effort

### Use Cases

- **Technical leadership**: Assess the health and progress of the entire software portfolio
- **Product management**: Understand which features and projects are ready for production
- **Team coordination**: Identify areas needing attention or investment
- **Strategic planning**: Make data-driven decisions about roadmap and priorities

## Dimensions

Vektra organizes metrics into logical dimensions, each measuring different aspects of software maturity:

### Dimension 1: Common Software Engineering Practices

**Purpose**: Measures foundational practices that apply to any software project, regardless of technology stack or deployment method.

**Metrics**:
- Repository basics (metadata, default branch)
- Documentation (README, CONTRIBUTING, CHANGELOG)
- Version management (SemVer, tags, releases)
- Issue & milestone management
- CI/CD & automation (GitHub Actions)
- Community & governance (LICENSE, topics)

**Classification**: Based on semantic versioning
- Level 1: PoC (< 1.0.0)
- Level 2: MVP (1.0.0 - 1.99.99)
- Level 3: Production (≥ 2.0.0)

**See**: [Dimension 1: Common Software Engineering Practices](./dimension-1-common-practices.md)

### Additional Dimensions (To Be Defined)

Future dimensions will measure:
- **Dimension 2**: Security & Compliance
- **Dimension 3**: Quality & Testing
- **Dimension 4**: Performance & Reliability
- **Dimension 5**: Developer Experience
- *Add more as needed*

## Data Collection

### Source
- **GitHub GraphQL API**: Real-time data from repositories
- **GitHub CLI (gh)**: Authenticated access to organization data
- **Local JSON**: Generated telemetry file (gitignored for local PoC)

### Refresh Frequency
- **Local**: Manual refresh via `mise run ingest`
- **Production**: GitHub Actions workflow (disabled for local PoC)

### Data Scope
- **Included**: Active, non-forked repositories
- **Excluded**: Archived repositories (39 total → 30 active)
- **Organization**: `nesxtep-software`

## Implementation Notes

### Technology Stack
- **Astro**: Static site generator
- **React**: Interactive components
- **Chart.js**: Data visualization
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **GitHub GraphQL API**: Data source

### Deployment
- **Current**: Local-only PoC
- **Future**: GitHub Pages (optional)
- **Mode**: Static output (no server required)

### Limitations
- **GitHub API rate limits**: 5000 requests/hour with authenticated token
- **GraphQL complexity**: Cannot query all fields in single request
- **Offline mode**: Requires GitHub API access for data refresh

## Contributing

When adding new dimensions or metrics:
1. Document the business logic in this README
2. Create a dedicated dimension document with frontmatter
3. Update the ingestion script to collect new data
4. Update the UI to display new metrics
5. Test with local data refresh

## Version History

- **v1.0**: Initial implementation with Dimension 1
  - Common Software Engineering Practices
  - SemVer-based classification
  - Repository telemetry collection
