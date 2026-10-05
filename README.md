---
title: Vektra - GitHub Application Portfolio Dashboard
description: Zero-cost static Application Portfolio Management Dashboard for tracking developmental progress across GitHub repositories
---

# Vektra - GitHub Application Portfolio Dashboard

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=flat-square&logo=github)](https://nesxtep-software.github.io/vekra/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Astro](https://img.shields.io/badge/Astro-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chart.js&logoColor=white)](https://www.chartjs.org/)

A zero-cost static Application Portfolio Management (APM) Dashboard designed to track developmental progress across software repositories in the nesxtep-software GitHub Organization.

## Tech Stack
- **Framework:** Astro 4.x (Static Site Generation)
- **Styling:** Tailwind CSS + Lucide Icons
- **Charting:** Chart.js + react-chartjs-2
- **API Client:** @octokit/graphql
- **Deployment:** GitHub Pages via GitHub Actions

## Features

### Executive Dashboard
- **Metric Cards:** High-level KPIs including total applications, production assets, high momentum apps, and average maturity score
- **Maturity Distribution:** Bar chart showing application count across maturity levels (Concept → Production)
- **Activity & Velocity Matrix:** Scatter chart plotting days since last commit vs maturity score
- **Tech Stack Breakdown:** Doughnut chart showing primary language distribution

### Application Table
- Searchable and filterable data table listing all applications
- Columns: App Name, Status Tag, Version, Milestone Progress, Last Commit Date, Health Indicators, GitHub Link
- Filters: Search by name/language, Category (Production, Active MVP, Concept)
- Sort options: Last Updated, Maturity Score, Open Issues

### Automated Data Pipeline
- GitHub GraphQL API integration for harvesting repository metrics
- Scheduled daily refresh via GitHub Actions
- Tracks: release tags, commit recency, milestone completion, open/closed issues, file tree footprints

## Maturity Scoring

The dashboard calculates a maturity score (0-100%) based on:
- **+10** if README.md exists
- **+15** if package.json exists with version != 0.0.0
- **+20** if Dockerfile or docker-compose.yml exists
- **+25** for open/closed issue completion ratio
- **+30** if commits within last 30 days (+15 if within 60 days)
- **Automatic Level 5** if repo has `production` topic

### Maturity Levels
- **Level 1: Concept & Spec** (Score 0–20)
- **Level 2: Architecture** (Score 21–45)
- **Level 3: Core MVP** (Score 46–70)
- **Level 4: Staging / Beta** (Score 71–90)
- **Level 5: Production** (Score 91–100 or manually flagged)

## Getting Started

### Prerequisites
- Node.js 20.x
- GitHub Personal Access Token with `repo` scope

### Installation

```bash
# Clone the repository
git clone https://github.com/nesxtep-software/vekra.git
cd vekra

# Install dependencies
npm install

# Run the development server
npm run dev
```

### Ingesting GitHub Data

To fetch real data from your GitHub organization:

```bash
# Set your GitHub token
export GITHUB_TOKEN=your_token_here
export GITHUB_ORG=nesxtep-software

# Run the ingestion script
npm run ingest
```

### Building for Production

```bash
npm run build
npm run preview
```

## GitHub Actions Setup

1. Add the following secrets to your repository:
   - `PORTFOLIO_GITHUB_TOKEN`: GitHub Personal Access Token with `repo` scope
   - `GITHUB_TOKEN`: Automatically provided by GitHub Actions

2. The workflow will:
   - Run daily at 00:00 UTC
   - Refresh telemetry data
   - Deploy to GitHub Pages

## Project Structure

```
├── .github/
│   └── workflows/
│       └── refresh-telemetry.yml
├── scripts/
│   └── ingest-github-telemetry.mjs
├── src/
│   ├── components/
│   │   ├── MetricCards.astro
│   │   ├── MaturityChart.astro
│   │   ├── ActivityMatrix.astro
│   │   ├── AppTable.astro
│   │   └── TechStackBreakdown.astro
│   ├── data/
│   │   └── portfolio-telemetry.json
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
├── astro.config.mjs
├── package.json
└── tailwind.config.mjs
```

## License

MIT
