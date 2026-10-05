# Contributing to Vektra

Thank you for your interest in contributing to Vektra!

## Development Setup

### Prerequisites
- Node.js 22.x
- pnpm (package manager)
- GitHub CLI (gh)
- GPG key configured for signed commits

### Installation

```bash
pnpm install
```

### Development

```bash
# Start development server
pnpm run dev

# Ingest fresh data from GitHub
pnpm run ingest

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## Workflow

Vektra follows a strict Git workflow. See [Development Workflow](docs/manuals/development-workflow.md) for complete details.

### Key Rules

1. **No direct commits to main** - All changes must go through feature branches
2. **Signed commits** - All commits must be GPG signed
3. **Conventional commits** - Use `feat:`, `fix:`, `chore:`, `docs:` prefixes
4. **Release prep on feature branch** - CHANGELOG.md and version bump must be done on feature branch before merge

### Branch Naming

- `feat/*` - New features
- `fix/*` - Bug fixes
- `chore/*` - Maintenance tasks

### Commit Format

```
type(scope): description

[type: optional body]
```

## Code Style

- **TypeScript strict mode** - No `any` types unless absolutely necessary
- **Component organization** - Group by concern (app-table/, charts/)
- **Single responsibility** - Each component has one clear purpose
- **DRY** - Extract common logic to utils

## Adding New Dimensions

When adding new maturity dimensions:

1. Document business logic in `docs/README.md`
2. Create dimension document in `docs/dimension-X-name.md`
3. Update types in `scripts/types.ts`
4. Update scoring logic in `scripts/scoring.ts`
5. Update ingestion script in `scripts/index.ts`
6. Add UI components to display new metrics
7. Test with local data refresh

## Documentation

Vektra has comprehensive documentation:

- [Metrics & Dimensions](docs/README.md) - Business logic and metric definitions
- [Manuals](docs/manuals/README.md) - Development and release workflows
- [Development Workflow](docs/manuals/development-workflow.md) - Git workflow and branching
- [Release Workflow](docs/manuals/release-workflow.md) - Release process

## Testing

Before committing:

```bash
# Type check
pnpm run astro check

# Build check
pnpm run build
```

## Questions?

For questions about the project, open an issue or reach out to the nesxtep-software team.
