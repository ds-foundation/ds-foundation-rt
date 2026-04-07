# Contributing to DS Foundation

## Before you start

Check the registry first — your component may already exist.

```bash
node scripts/validate-registry.mjs   # check for issues in existing specs
```

---

## Adding a component

### 1. Write the spec (designers start here)

Copy `packages/registry/components/_template.mdx` and fill in the fields.

Key fields:
- `id` — kebab-case, matches the component name in code (e.g. `icon-button`)
- `variants` — list every variant. If it's not in the spec, it won't be in code
- `accessibility.role` — the ARIA role of the root element
- `accessibility.wcag` — which WCAG criteria apply (minimum: `1.4.3 Contrast`)
- `accessibility.aria` — required attributes consumers must pass
- `ai-prompt` — one paragraph describing the component for AI code generation

### 2. Add the Storybook story

Create `apps/storybook/src/stories/MyComponent.stories.tsx` showing all variants and states.

### 3. Validate

```bash
node scripts/validate-registry.mjs     # 0 errors required
npm run validate:tokens                 # 0 errors required
npm run typecheck                       # 0 errors required
```

### 4. Add a changeset

```bash
npx changeset
# Choose: patch for fixes, minor for new components, major for breaking changes
```

### 5. Open a PR

Use the PR template. CI will run all validators automatically.

---

## Token naming rules

- Always use semantic tokens: `var(--ds-color-*)`, `var(--ds-spacing-*)`, etc.
- Never hardcode hex values or pixel values that correspond to a token
- See [Token Reference](/tokens) for the full list

---

## Design principles

See [Design Principles](/principles) for the five rules that guide every decision.
