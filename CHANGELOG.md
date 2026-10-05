# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-05

### Added
- Initial implementation of Vektra portfolio dashboard
- Dimension 1: Common Software Engineering Practices metrics
- Repository telemetry collection from GitHub GraphQL API
- Interactive table with search, filter, and sort
- Maturity chart visualization (Chart.js)
- Activity matrix chart
- Tech stack breakdown chart
- Repository details modal
- TypeScript configuration with Astro base config
- Separate TypeScript config for Node scripts
- pnpm workspace configuration
- Documentation structure (docs/ and docs/manuals/)
- Development workflow documentation
- Release workflow documentation

### Changed
- Organized components by concern (app-table/, charts/)
- Refactored AppTableClient from 411 to 102 lines
- Switched from npm to pnpm package manager
- Updated TypeScript to 5.9.3
- Configured modern JSX transform (react-jsx)
- Improved module resolution with Astro base config

### Fixed
- Resolved TypeScript module resolution issues
- Fixed milestone property access in scoring logic
- Normalized latestRelease from undefined to null
- Fixed boolean type for hasWorkflows property
- Added explicit .js extensions for Node scripts (ES modules)
- Fixed Chart.js type errors with `as const` literals

### Removed
- Disabled GitHub Actions workflow (no active behavior)
- Removed .vscode folder from version control
- Removed deprecated VS Code settings

### Documentation
- Added docs/README.md for metrics and dimensions
- Added docs/dimension-1-common-practices.md for Dimension 1 specification
- Added docs/manuals/README.md for operational procedures
- Added docs/manuals/development-workflow.md for Git workflow
- Added docs/manuals/release-workflow.md for release process
- Added bidirectional navigation links between documentation files
