---
title: "Release Workflow"
description: "Protocolo de release: bump versión, changelog, rama release y PR draft"
type: "module"
parent: "../README.md"
created: "2026-10-05"
version: "1.0.0"
tags: ["workflow", "release", "git", "deployment"]
status: "published"
---

# Release Workflow

**← [Back to Manuals](./README.md)**

## Propósito

Protocolo estandarizado para crear releases en Vektra, asegurando versionamiento semántico, documentación completa, y tags firmados.

## Pre-Release Checklist

- [ ] Todos los tests pasan
- [ ] TypeScript sin errores en src/ y scripts/
- [ ] Build exitoso (`pnpm run build`)
- [ ] Documentación actualizada
- [ ] CHANGELOG.md actualizado
- [ ] No commits pendientes en main
- [ ] Feature branches merged a main

## Proceso de Release

### Paso 1: Preparación

```bash
# Asegurar estar en main
git checkout main
git pull origin main

# Verificar estado
git status
git log --oneline -5
```

### Paso 2: Bump de Versión

**Actualizar package.json:**

```json
{
  "version": "1.0.0"  // bump to next version
}
```

**Decisión de Versión (SemVer):**

| Tipo | Cuándo usar | Ejemplo |
|------|-------------|---------|
| **MAJOR** | Cambios breaking incompatibles, cambios mayores en API | 1.0.0 → 2.0.0 |
| **MINOR** | Nuevas features backward-compatible | 1.0.0 → 1.1.0 |
| **PATCH** | Bug fixes backward-compatible | 1.0.0 → 1.0.1 |

**Clasificación de Madurez:**

| Nivel | Rango de Versión | Descripción |
|-------|------------------|-------------|
| PoC | < 1.0.0 (0.x.x) | Proof of Concept, experimental |
| MVP | 1.0.0 - 1.99.99 (1.x.x) | Minimum Viable Product, estable pero evolucionando |
| Production | ≥ 2.0.0 (2.x.x+) | Production-ready, maduro, API estable |

### Paso 3: CHANGELOG.md

**Formato:**

```markdown
## [1.0.0] - 2026-10-05

### Added
- Feature 1
- Feature 2

### Changed
- Updated something
- Improved something

### Fixed
- Fixed bug 1
- Fixed bug 2

### Removed
- Removed deprecated feature
```

**Reglas:**
- Documentar todos los cambios significativos
- Agrupar por categoría (Added, Changed, Fixed, Removed)
- Incluir fecha de release
- Referenciar issues o PRs si aplica

### Paso 4: Commit de Version Bump

```bash
git add package.json CHANGELOG.md
git commit -m "chore: bump version to 1.0.0"
```

**Regla:** Este commit debe ser único y limpio, solo para version bump.

### Paso 5: Crear Tag Firmado

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
```

**Regla:** Tag debe crearse DESPUÉS del merge a main, nunca antes.

**Verificar tag:**
```bash
git tag -l -n1
git show v1.0.0
```

### Paso 6: Push Changes

```bash
git push origin main
git push origin v1.0.0
```

### Paso 7: GitHub Release

1. **Ir a GitHub**
   - Repository → Releases → "Create a new release"

2. **Configurar Release**
   - Choose tag: `v1.0.0`
   - Release title: `v1.0.0`
   - Description: Copiar contenido de CHANGELOG.md

3. **Publicar**
   - Click "Publish release"

### Paso 8: Post-Release

```bash
# Verificar release
gh release view v1.0.0

# Verificar tags
git tag -l
```

## Rollback (si es necesario)

Si hay un problema crítico con el release:

### Opción 1: Crear Hotfix

```bash
git checkout -b fix/hotfix-issue
# Hacer fix
git commit -m "fix: critical bug"
git push origin fix/hotfix-issue
# Merge a main
# Bump PATCH version
# Crear tag v1.0.1
```

### Opción 2: Delete Tag y Release

```bash
# Local
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0

# GitHub
# Delete release en GitHub UI
```

## Versioning Strategy

### Primera Release (1.0.0)

**Criterios:**
- Todas las features core implementadas
- Dashboard funcional con datos reales
- Documentation completa
- Build y deployment funcionan

### Releases Subsecuentes

**Incremento PATCH (1.0.0 → 1.0.1):**
- Bug fixes
- Pequeñas mejoras
- Documentación updates

**Incremento MINOR (1.0.0 → 1.1.0):**
- Nuevas features
- Nuevas dimensiones de métricas
- Mejoras significativas en UI

**Incremento MAJOR (1.0.0 → 2.0.0):**
- Cambios breaking
- Rediseño mayor de arquitectura
- Cambios en data model

## Branch Protection

### Configuración Recomendada

En GitHub → Settings → Branches:

**Rama main:**
- [x] Require a pull request before merging
- [x] Require approvals (1 approval)
- [x] Require status checks to pass before merging
- [x] Require branches to be up to date before merging
- [x] Do not allow bypassing the above settings

## Checklist de Release

- [ ] Feature branches merged a main
- [ ] No conflicts en main
- [ ] Version bumped en package.json
- [ ] CHANGELOG.md actualizado
- [ ] Commit de version bump creado
- [ ] Tag firmado creado (GPG)
- ] Tag pushed a origin
- [ ] GitHub release creado
- [ ] Release notes pobladas desde CHANGELOG.md
- [ ] Release publicado
