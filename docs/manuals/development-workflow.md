---
title: "Development Workflow"
description: "Protocolo de desarrollo Git: branching strategy, commits, y pull requests"
type: "module"
parent: "README.md"
created: "2026-10-05"
version: "1.0.0"
tags: ["workflow", "git", "development"]
status: "published"
---

# Development Workflow

**← [Back to Manuals](./README.md)**

## Principio Fundamental

**No commits directos a la rama `main`.** Todos los cambios deben pasar por ramas de feature y ser mergeados vía Pull Request.

## Estrategia de Branching

```mermaid
graph TD
    main[main - Producción] -->|PR merge| feat[feat/*]
    fix[fix/*] -->|PR merge| main
    chore[chore/*] -->|PR merge| main
    
    style main fill:#ff6b6b
    style feat fill:#4ecdc4
    style fix fill:#95e1d3
    style chore fill:#feca57
```

| Rama | Propósito | Protección |
|------|-----------|------------|
| `main` | Código de producción, siempre estable | Protegida, sin commits directos |
| `feat/*` | Desarrollo de nuevas features | Merge a main vía PR |
| `fix/*` | Bug fixes | Merge a main vía PR |
| `chore/*` | Tareas de mantenimiento | Merge a main vía PR |

## Protocolo de Feature Development

### Fase 1: Inicio

```bash
git checkout main
git pull origin main
git checkout -b feat/nombre-feature
```

### Fase 2: Desarrollo

**Principios:**
- **Single Responsibility**: Cada componente tiene una responsabilidad clara
- **Organización por concern**: Agrupar componentes lógicamente
- **Tipado estricto**: No usar `any` a menos que sea necesario
- **DRY**: Extraer a utils cuando sea apropiado

**Component Structure:**
```
src/components/
├── app-table/          # Table components
│   ├── AppTableClient.tsx
│   ├── AppTableFilters.tsx
│   ├── AppTableHeader.tsx
│   └── AppTableRow.tsx
├── charts/             # Chart components
│   ├── ActivityMatrixClient.tsx
│   ├── MaturityChartClient.tsx
│   └── TechStackBreakdownClient.tsx
├── RepoModal.tsx        # Shared modal
└── utils.ts             # Shared utilities
```

### Fase 3: Commits

**Formato:**
```
type(scope): description
```

**Types:**
- `feat`: Nueva feature
- `fix`: Bug fix
- `chore`: Mantenimiento
- `docs`: Documentación
- `refactor`: Refactoring
- `style`: Estilo/formatting

**Reglas:**
- Commits agrupados por concern
- Todos los commits deben ser firmados con GPG
- Mensajes descriptivos

### Fase 4: Pull Request

```bash
git push origin feat/nombre-feature
```

- Crear PR en GitHub
- Título descriptivo
- Incluir número de issue si aplica
- Request review

### Fase 5: Merge

1. **Squash merge** (recomendado) - history limpia
2. **Delete feature branch**
   ```bash
   git branch -d feat/nombre-feature
   git push origin --delete feat/nombre-feature
   ```

## Configuración TypeScript

### Estructura

```mermaid
graph TD
    tsconfig[tsconfig.json] -->|Extends| astro[Astro base config]
    scripts[scripts/tsconfig.json] -->|Extends| tsconfig
    scripts -->|Override| node[Node types + NodeNext]
    
    style tsconfig fill:#e1f5ff
    style astro fill:#ff6b6b
    style scripts fill:#4ecdc4
    style node fill:#95e1d3
```

### Reglas de Imports

**Main project (src/):**
- React: Sin import de React (JSX moderno)
- Relative imports: Sin extensión `.js`

**Scripts (scripts/):**
- Node: Con extensión `.js` requerida (ES modules)
- Example: `import type { Repository } from './types.js'`

## Data Ingestion

```bash
gh auth login
pnpm run ingest
```

## Troubleshooting

### TypeScript Errors

**Síntoma:** Cannot find module 'react' o 'react-chartjs-2'

**Solución:**
- Asegurar que `tsconfig.json` extiende `astro/tsconfigs/strict`
- Asegurar que `scripts/tsconfig.json` existe con Node types
- Restart TypeScript server en IDE

### Module Resolution

**Síntoma:** Cannot find module

**Solución:**
- Usar pnpm (no npm/yarn)
- Asegurar que `pnpm-workspace.yaml` existe
- Reinstalar: `rm -rf node_modules && pnpm install`

### Chart.js Types

**Síntoma:** Type incompatibility

**Solución:**
```typescript
weight: 'bold' as const
```

## Referencias

- **[Release Workflow](./release-workflow.md)**: Protocolo de release completo
- **[Dimension 1](../dimension-1-common-practices.md)**: Métricas y scoring
