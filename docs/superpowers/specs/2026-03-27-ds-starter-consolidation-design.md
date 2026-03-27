# Design Spec: DS Starter — Living Design System + Project Template

**Date:** 2026-03-27
**Status:** Approved for implementation
**Author:** Alex Pacheco + Claude

---

## Overview

The goal is to create a single canonical repository — the evolved **Starter** — that serves as the source of truth for how every new project at the team is built. It combines a design system (tokens, components, patterns), a ready-to-run Next.js project template, and a contribution workflow that allows developers and designers to feed new work back into the shared library.

Projects start from this repo and stay connected to it via versioned npm packages. When new components or patterns are approved and merged, every project can update on its own schedule.

---

## Problem Statement

Today there are two disconnected repos with overlapping intent:

- **`ds-foundation-rt`** — a fully scaffolded design system (token pipeline, registry, MCP server, docs, Storybook) with no project template or contribution workflow
- **`mlawless-eng/Starter`** — a Claude Code governance template with rules, an empty Skills directory, and a broken pointer to a design system that doesn't exist yet

Neither is usable on its own. A developer starting a new project has no single place to go, no live connection to a design system, and no established way to contribute new components back.

---

## Design Decision: Consolidate into One Repo

**Recommendation: consolidate.** The Starter repo evolves to absorb ds-foundation's work and gains the project template and contribution infrastructure. `ds-foundation-rt` is retired once the migration is complete.

**Why one repo:**
- The stated goal is a single source of truth — two repos creates two PRs, two CI pipelines, two review locations, and synchronisation overhead
- The team is not large enough to warrant separate ownership of the design system vs. the project template
- No external consumers require a standalone published design system package (yet)
- Simpler mental model: one place to start a project, one place to contribute back

**Phased approach to avoid disruption:**
- **Phase 1** — Build the Next.js template and contribution workflow on top of ds-foundation where it already lives
- **Phase 2** — Migrate everything into the Starter repo; retire ds-foundation-rt

---

## Architecture

### Repository Structure (end state)

```
Starter/  (canonical team repo)
├── packages/
│   ├── tokens/         — Style Dictionary v4 token pipeline (DTCG 2025.10)
│   ├── core/           — Framework-agnostic adapter types and token contracts
│   └── registry/       — Velite MDX pipeline → typed JSON component registry
├── apps/
│   ├── docs/           — Next.js 15 + Nextra documentation site
│   └── storybook/      — Storybook 8 component development and review hub
├── mcp/
│   └── ds-server/      — MCP server exposing registry + tokens to Claude Code
├── template/           — NEW: Next.js 15 project starter (consumed by teams)
├── Skills/             — Claude Code skills (component-gen, token-resolution, etc.)
├── .claude/            — CLAUDE.md workspace rules + registry context snapshot
├── .github/
│   ├── workflows/      — CI: validate, build, publish (Changesets)
│   └── PULL_REQUEST_TEMPLATE/  — Component contribution PR template
├── docs/
│   └── how-to-guide.md — Team onboarding and contribution guide
├── CLAUDE.md           — Master workspace rules
└── turbo.json          — Turborepo build orchestration
```

### Published npm Packages

These packages are published from the monorepo and consumed by projects:

| Package | Contents | Semver policy |
|---------|----------|---------------|
| `@ds/tokens` | CSS variables, Tailwind preset, JS/TS token exports | Minor on new tokens, major on renames |
| `@ds/core` | Adapter types, token contracts | Major on breaking interface changes |
| `@ds/registry` | Component schemas, ARIA specs, adapter mappings | Minor on new components |

### Project Template (`template/`)

A ready-to-run Next.js 15 application with:
- **Auth.js** — authentication wired and configured
- **Prisma** — schema placeholder with PostgreSQL connection
- **Tailwind v4** — pre-configured to import `@ds/tokens` preset
- **CLAUDE.md** — pre-loaded with design system rules (check registry, use `var(--ds-*)` tokens, implement ARIA, wrap Radix primitives)
- **Skills/** — populated with ds-foundation skills (component-generation, token-resolution, registry-validation, accessibility-audit)
- **MCP config** — Claude settings pointing to `localhost:3100` for live registry context
- **`@ds/tokens`, `@ds/core`, `@ds/registry`** — pre-installed in package.json

---

## Contribution Workflow

### Developer/Designer → Design System

1. **Build locally** — Developer or designer creates a new component or pattern in their project
2. **Open PR** — Submits PR to Starter repo adding:
   - Component spec in `packages/registry/` (MDX file: variants, states, ARIA, token usage, Tailwind mappings)
   - Story in `apps/storybook/` for visual review
3. **CI validates automatically** — `validate:registry` runs on PR, checks for hardcoded values, missing ARIA, schema compliance. Fails fast before human review
4. **Storybook preview deploys** — PR branch auto-deploys Storybook so design team can interact with the component rendered in light/dark modes and density scales, without reading code
5. **Design team reviews** — Checks: correct token usage, pattern consistency, accessibility, whether it belongs in the shared library
6. **Merged** — Changesets handles versioning automatically (patch/minor/major based on change type)
7. **Published** — CI publishes updated `@ds/*` packages
8. **Projects update** — `npm update @ds/registry` (and other packages as needed) — each project updates on its own schedule

### Figma → Design System (Designer path)

Designers don't write MDX or open PRs manually. The `publish-figma-connect.mjs` script bridges the gap:
- Designer proposes component in Figma
- Script generates the registry spec and opens a PR automatically
- Same review flow from step 4 onward

---

## How Projects Start

1. Use Starter as a **GitHub Template** — one click creates a new repo pre-populated with `template/` contents
2. Clone the new repo
3. Fill in `.env` (database URL, auth secrets)
4. Run `npm install && npm run dev`
5. Design system tokens, Claude rules, skills, and MCP config are all present from the first commit

No configuration of the design system is required. Tailwind, tokens, CLAUDE.md, and the MCP server config are pre-wired in the template.

---

## How Projects Stay Current

Projects consume `@ds/*` as npm dependencies. To pull the latest components and tokens:

```bash
npm update @ds/tokens @ds/core @ds/registry
```

Version changes follow semver. Breaking changes (token renames, interface changes) are major version bumps and require a deliberate upgrade decision. New components and tokens are minor bumps — safe to auto-update.

---

## Team Onboarding Guide

A `docs/how-to-guide.md` ships as part of the repo covering:
- What this repo is and how it relates to projects
- Step-by-step: start a new project from the template
- Step-by-step: contribute a new component (developer path)
- Step-by-step: contribute a new component (designer/Figma path)
- How the design team reviews and approves contributions
- How to update `@ds/*` packages in an existing project
- Token usage reference (how to use `var(--ds-*)`, when to use semantic vs primitive tokens)
- MCP server setup (for Claude Code users)

The guide is written for team members with no prior knowledge of the system.

---

## CI/CD

| Trigger | Pipeline |
|---------|----------|
| PR opened | `validate:tokens`, `validate:registry`, Storybook preview deploy |
| Merge to main | Full build, Changesets version bump, npm publish |
| Scheduled (weekly) | `npm audit`, token drift check |

**Tools:** GitHub Actions, Changesets, Turborepo remote cache (optional)

---

## Phase Plan

### Phase 1 — Build on ds-foundation-rt (current repo)
- Add `template/` — Next.js 15 app with Auth.js, Prisma, Tailwind + tokens, CLAUDE.md, Skills
- Add `.github/workflows/` — CI validate, build, publish pipelines
- Add `.github/PULL_REQUEST_TEMPLATE/` — component contribution PR template
- Configure Changesets for versioning
- Add `docs/how-to-guide.md`
- Publish `@ds/tokens`, `@ds/core`, `@ds/registry` to npm (or GitHub Packages)
- Wire template to consume published packages

### Phase 2 — Migrate into Starter repo
- Move all of ds-foundation-rt into `mlawless-eng/Starter` (preserve git history via `git subtree` or similar)
- Update GitHub Template flag on Starter repo
- Redirect ds-foundation-rt with archive notice
- Update all internal references

---

## What Is Explicitly Out of Scope

- Multi-tenant or external-facing package publishing (v1 is internal only)
- Automated Figma sync beyond what `publish-figma-connect.mjs` already handles
- A custom CLI (GitHub Template + npm packages is sufficient for v1)
- White-label token override system (planned in ds-foundation architecture, deferred to post-v1)
- Component implementation code in the registry (v1 registry contains specs and mappings only — implementation lives in consumer projects or a future `@ds/components` package)

---

## Success Criteria

- A developer with no prior context can start a new project from the template in under 10 minutes
- A component contribution PR can be reviewed by the design team without reading any code
- All `@ds/*` package consumers can update to the latest components and tokens with a single `npm update` command
- The how-to guide is self-sufficient — no tribal knowledge required to use the system
