---
title: Vektra - GitHub Application Portfolio Dashboard
description: Zero-cost static Application Portfolio Management Dashboard for tracking developmental progress across GitHub repositories
---

# Vektra - GitHub Application Portfolio Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Astro](https://img.shields.io/badge/Astro-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chart.js&logoColor=white)](https://www.chartjs.org/)

A zero-cost static Application Portfolio Management (APM) Dashboard designed to track developmental progress across software repositories in the nesxtep-software GitHub Organization.

## Business Logic & Metrics

Vektra automatically collects and analyzes GitHub telemetry to measure repository maturity and operational readiness. The metrics are organized into dimensions:

- **Dimension 1**: Common Software Engineering Practices (Repository basics, documentation, versioning, CI/CD, governance)

For detailed business logic and metric definitions, see the [docs folder](./docs/README.md).

## Tech Stack
- **Framework:** Astro 4.x (Static Site Generation)
- **Styling:** Tailwind CSS + Lucide Icons
- **Charting:** Chart.js + react-chartjs-2
- **API Client:** @octokit/graphql
- **Language:** TypeScript
- **Package Manager:** pnpm (via mise)
- **CLI Tools:** GitHub CLI (gh)

## Features

### Executive Dashboard
- **Metric Cards:** High-level KPIs including total applications, production assets, high momentum apps, and average maturity score
- **Maturity Distribution:** Bar chart showing application count across maturity levels (PoC → MVP → Production)
- **Activity & Velocity Matrix:** Scatter chart plotting days since last commit vs maturity score
- **Tech Stack Breakdown:** Doughnut chart showing primary language distribution

### Application Table
- Searchable and filterable data table listing all applications
- Columns: App Name, Status Tag, Version, Milestone Progress, Last Commit Date, Health Indicators, GitHub Link
- Filters: Search by name/language, Category (Production, MVP, PoC)
- Sort options: Last Updated, Maturity Score, Open Issues
- **Details Modal**: Click any app name to view detailed characteristics, technical details, and milestone progress

### Automated Data Pipeline
- GitHub GraphQL API integration for harvesting repository metrics
- Local data refresh via `mise run ingest`
- Tracks: releases, tags, CI/CD workflows, documentation, versioning, issues, milestones

## Getting Started

### Prerequisites
- Node.js 20.x
- GitHub CLI (gh) installed and authenticated
- pnpm (via mise)

### Installation

```bash
# Clone the repository
git clone https://github.com/nesxtep-software/Vektra.git
cd vektra

# Install dependencies (via mise)
mise install

# Run the development server
mise run dev
```

### Ingesting GitHub Data

To fetch real data from your GitHub organization:

```bash
# Ensure gh-cli is authenticated
gh auth login

# Run the ingestion script
mise run ingest
```

The script will:
- Fetch all active repositories from the organization
- Measure maturity based on Common Software Engineering Practices
- Generate `src/data/portfolio-telemetry.json` (gitignored for local PoC)

### Building for Production

```bash
# Build the static site
mise run build

# Preview the build
mise run preview
```

## Project Structure

```
├── .github/
│   └── workflows/
│       └── refresh-telemetry.yml (disabled for local PoC)
├── docs/
│   ├── README.md (Business logic & metrics definitions)
│   └── dimension-1-common-practices.md (Dimension 1 specification)
├── scripts/
│   └── ingest-github-telemetry.mjs (GitHub telemetry ingestion)
├── src/
│   ├── components/
│   │   ├── MetricCards.astro
│   │   ├── MaturityChart.astro + MaturityChartClient.tsx
│   │   ├── ActivityMatrix.astro + ActivityMatrixClient.tsx
│   │   ├── TechStackBreakdown.astro + TechStackBreakdownClient.tsx
│   │   ├── AppTable.astro + AppTableClient.tsx
│   │   └── Layout.astro
│   ├── data/
│   │   ├── portfolio-telemetry.json (generated, gitignored)
│   │   └── portfolio-telemetry.json.example
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
├── .mise.toml (mise configuration)
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Development Notes

### Current State
- **Mode**: Local-only PoC (static site generation)
- **Data**: Local JSON file (gitignored)
- **Deployment**: GitHub Pages disabled
- **GitHub Actions**: Telemetry refresh workflow disabled

### TypeScript Configuration
- Build runs without `astro check` due to React/Chart.js type resolution issues
- IDE may show lint errors for React imports (false positives, doesn't affect runtime)
- Runtime/build works correctly despite IDE diagnostics

### Git Workflow
- Repository: `nesxtep-software/Vektra`
- Default branch: `main`
- Feature branch: `feat/implement-portfolio-dashboard`
- Draft PR: Open for review

## License

MIT
