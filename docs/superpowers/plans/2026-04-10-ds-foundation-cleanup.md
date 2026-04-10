# DS Foundation Cleanup & Hardening — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up `ds-foundation-rt` into a solid, simplified React + Radix UI design system — removing treasury components, eliminating structural debt, implementing all interaction states via tokens, and adding four missing layout/utility components from DS-Michelangelo.

**Architecture:** Turborepo monorepo. Token pipeline lives in `packages/tokens` (DTCG 2025.10 → Style Dictionary → CSS vars). React components in `packages/react/src/components/` use Tailwind `ds.*` utility classes exclusively — no inline style color objects. All interaction states (hover, active, focus, disabled) driven by semantic CSS custom properties. Four new components (Sidebar, Kbd, AlertDialog, Menubar) added as organisms/atoms following existing Radix + CVA + forwardRef pattern.

**Tech Stack:** React 18 · Radix UI primitives · Tailwind CSS v3 · CVA (class-variance-authority) · tsup (ESM+CJS) · Vitest + React Testing Library (added in this plan) · Storybook 10 · Turborepo

---

## File Map — What Changes Where

| File | Action | Why |
|---|---|---|
| `packages/react/src/*.tsx` (~98 files) | **Delete** | Legacy pre-token drafts — nothing exported from index.ts |
| `packages/react/src/utils.ts` (root) | **Delete** | Duplicate of `components/utils.ts` |
| `packages/react/src/treasury/` (14 components + 14 stories) | **Delete** | Out-of-scope domain components |
| `packages/react/src/index.ts` | **Modify** | Remove treasury export block |
| `packages/react/src/styles/semantic.dark.css` | **Delete** | Redundant — dark aliases already inherit from variables.dark.css |
| `packages/react/src/styles/styles.css` | **Modify** | Remove `semantic.dark.css` import |
| `packages/react/src/bridge.css` | **Modify** | Remove hardcoded `--gray-*`, `--blue-*`, `--green-*` hex scales |
| `packages/react/src/bridge-dark.css` | **Modify** | Same cleanup |
| `packages/react/src/styles/semantic.css` | **Modify** | Add interactive, focus-ring, and feedback-button tokens |
| `packages/react/tailwind.config.ts` | **Modify** | Add `ds.*` entries for new tokens + `hifi:` variant |
| `packages/react/src/components/atoms/Typography.tsx` | **Modify** | Replace hardcoded px values with `--ds-font-size-*` vars |
| `packages/react/src/components/atoms/Button.tsx` | **Modify** | Convert to pure CVA (no inline styles) with all 4 interaction states |
| `packages/react/src/components/atoms/Badge.tsx` | **Modify** | Same — convert inline styles to `ds.*` Tailwind classes |
| `apps/storybook/.storybook/preview.ts` | **Modify** | Add wireframe theme to theme list |
| `packages/react/src/components/atoms/useReducedMotion.ts` | **Move** → `components/utils/` | Already in utils/, just confirming location |
| `packages/react/src/components/organisms/Accordion.tsx` | **Modify** | Wire `useReducedMotion` — skip animation when true |
| `packages/react/src/components/organisms/Carousel.tsx` | **Modify** | Wire `useReducedMotion` |
| `packages/react/src/components/atoms/Skeleton.tsx` | **Modify** | Wire `useReducedMotion` |
| `packages/react/src/components/organisms/Sidebar.tsx` | **Create** | New compound component (11 sub-parts) |
| `packages/react/src/components/atoms/Kbd.tsx` | **Create** | New keyboard shortcut display component |
| `packages/react/src/components/organisms/AlertDialog.tsx` | **Create** | New Radix-based confirm dialog (10 sub-parts) |
| `packages/react/src/components/organisms/Menubar.tsx` | **Create** | New Radix-based horizontal menubar |
| `packages/react/src/components/organisms/Sidebar.stories.tsx` | **Create** | Storybook stories |
| `packages/react/src/components/atoms/Kbd.stories.tsx` | **Create** | Storybook stories |
| `packages/react/src/components/organisms/AlertDialog.stories.tsx` | **Create** | Storybook stories |
| `packages/react/src/components/organisms/Menubar.stories.tsx` | **Create** | Storybook stories |
| `packages/react/src/index.ts` | **Modify** | Add 4 new component exports |
| `packages/react/vitest.config.ts` | **Create** | Vitest config with jsdom + RTL |
| `packages/react/src/test/setup.ts` | **Create** | RTL setup file |
| `packages/react/src/components/atoms/Button.test.tsx` | **Create** | Button interaction state tests |
| `packages/react/src/components/atoms/Typography.test.tsx` | **Create** | Typography token compliance tests |
| `packages/react/src/components/organisms/Sidebar.test.tsx` | **Create** | Sidebar render tests |
| `packages/react/src/components/atoms/Kbd.test.tsx` | **Create** | Kbd render test |
| `CONTRIBUTING.md` | **Modify** | Document styling approach, interaction state pattern, test requirement |
| `README.md` | **Modify** | Update component list, remove treasury references |

---

## Task 1: Delete legacy flat root component files

**Files:**
- Delete: all `packages/react/src/*.tsx` (~98 files)
- Delete: `packages/react/src/utils.ts` (root level only)

These are pre-token-integration drafts. None are imported by `index.ts` or any layered component. Safe to batch-delete.

- [ ] **Step 1: Verify nothing imports from root-level tsx files**

```bash
cd ~/Documents/Projects/ds-foundation
grep -r "from '\.\./[A-Z]" packages/react/src/components/ | head -20
grep -r "from '\.\/[A-Z]" packages/react/src/index.ts | head -20
```

Expected: no matches (index.ts imports only from `./components/` and `./treasury/`).

- [ ] **Step 2: Delete the flat root files**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react/src
# Delete all .tsx files at this exact level (not in subdirectories)
find . -maxdepth 1 -name "*.tsx" -delete
# Delete duplicate root utils.ts
rm -f utils.ts
```

- [ ] **Step 3: Verify build still passes (TypeScript check)**

```bash
cd ~/Documents/Projects/ds-foundation
npm run check 2>&1 | tail -20
```

Expected: no new errors (any pre-existing errors are fine; this should not introduce new ones).

- [ ] **Step 4: Commit**

```bash
cd ~/Documents/Projects/ds-foundation
git add -A packages/react/src/
git commit -m "chore: remove legacy flat-root component files

These ~98 tsx files were pre-token-integration drafts from before the
atoms/molecules/organisms layered structure was established. Nothing in
index.ts or any layered component imported them. Safe to remove."
```

---

## Task 2: Remove treasury components

**Files:**
- Delete: `packages/react/src/treasury/` (entire directory)
- Modify: `packages/react/src/index.ts` — remove treasury export block

- [ ] **Step 1: Delete treasury directory**

```bash
rm -rf ~/Documents/Projects/ds-foundation/packages/react/src/treasury
```

- [ ] **Step 2: Remove treasury exports from index.ts**

Open `packages/react/src/index.ts`. Remove everything from `// ── Treasury ───` through the end of the file. The last organism export is `Timeline`.

The section to remove (approximately):
```ts
// ── Treasury ───────────────────────────────────
export * from './treasury/MonoAmount';
export * from './treasury/CurrencyBadge';
export * from './treasury/StatusPill';
export * from './treasury/StatusRing';
export * from './treasury/FreshnessChip';
export * from './treasury/UrgencyBadge';
export * from './treasury/BankingWindowDot';
export * from './treasury/DetailCard';
export * from './treasury/IconButton';
export * from './treasury/StateBadge';
export { FormCard, type FormCardProps } from './treasury/FormCard';
export { KpiCard, type KpiCardProps } from './treasury/KpiCard';
export { Tag, type TagProps } from './treasury/Tag';
```

- [ ] **Step 3: Also remove treasury doc pages from apps/docs**

```bash
cd ~/Documents/Projects/ds-foundation
# List and remove treasury doc pages
ls apps/docs/pages/components/ | grep -E "banking|currency|detail-card|freshness|icon-button|kpi|mono|state-badge|status|urgency|form-card|tag"
# Remove each found file
rm -f apps/docs/pages/components/banking-window-dot.mdx
rm -f apps/docs/pages/components/currency-badge.mdx
rm -f apps/docs/pages/components/detail-card.mdx
rm -f apps/docs/pages/components/freshness-chip.mdx
rm -f apps/docs/pages/components/icon-button.mdx
rm -f apps/docs/pages/components/kpi-card.mdx
rm -f apps/docs/pages/components/mono-amount.mdx
rm -f apps/docs/pages/components/state-badge.mdx
rm -f apps/docs/pages/components/status-pill.mdx
rm -f apps/docs/pages/components/status-ring.mdx
rm -f apps/docs/pages/components/urgency-badge.mdx
rm -f apps/docs/pages/components/form-card.mdx
rm -f apps/docs/pages/components/tag.mdx
```

Also remove any treasury references from `apps/docs/pages/components/_meta.ts`.

- [ ] **Step 4: TypeScript check**

```bash
cd ~/Documents/Projects/ds-foundation && npm run check 2>&1 | tail -20
```

Expected: no errors referencing treasury paths.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat!: remove treasury components

Treasury components (MonoAmount, StatusPill, StatusRing, FreshnessChip,
UrgencyBadge, BankingWindowDot, DetailCard, IconButton, StateBadge,
FormCard, KpiCard, Tag, CurrencyBadge) are domain-specific to Ripple
payments and out of scope for this foundation design system."
```

---

## Task 3: Remove redundant CSS files and clean up bridge.css

**Files:**
- Delete: `packages/react/src/styles/semantic.dark.css`
- Modify: `packages/react/src/styles/styles.css` — remove the `semantic.dark.css` import
- Modify: `packages/react/src/bridge.css` — remove hardcoded hex scale block
- Modify: `packages/react/src/bridge-dark.css` — same cleanup

**Why semantic.dark.css is safe to remove:** Every alias in it (like `--ds-bg: var(--ds-color-surface-page)`) points to a `--ds-color-*` variable. The dark overrides for those `--ds-color-*` vars are already applied by `variables.dark.css` on `[data-theme="dark"]`. The aliases don't need to be re-declared — they already resolve to the dark values automatically.

- [ ] **Step 1: Remove semantic.dark.css**

```bash
rm ~/Documents/Projects/ds-foundation/packages/react/src/styles/semantic.dark.css
```

- [ ] **Step 2: Remove the import in styles.css**

Read `packages/react/src/styles/styles.css`. Remove the line:
```css
@import './semantic.dark.css';
```

- [ ] **Step 3: Remove hardcoded hex scales from bridge.css**

Open `packages/react/src/bridge.css`. Remove the entire block that looks like:

```css
/* Legacy Ripple ML brand color scale — hardcoded hex */
:root {
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  /* ... all --gray-*, --blue-*, --green-* hardcoded hex entries */
}
```

Keep only the shadcn/ui convention mappings (the block that maps `--background`, `--foreground`, `--primary`, `--card`, `--popover`, etc. to `var(--ds-color-*)` vars). Do the same in `bridge-dark.css`.

- [ ] **Step 4: Build styles to verify nothing breaks**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react
npx tailwindcss -i src/styles/styles.css -o /tmp/test-styles.css --config tailwind.config.ts 2>&1
```

Expected: build completes with no errors.

- [ ] **Step 5: Commit**

```bash
cd ~/Documents/Projects/ds-foundation
git add -A
git commit -m "chore: remove redundant semantic.dark.css and bridge hardcoded hex scales

semantic.dark.css was redundant — dark aliases inherit correctly from
variables.dark.css without needing re-declaration.

bridge.css/bridge-dark.css hardcoded gray/blue/green hex scales are
removed; the shadcn convention mapping block is preserved."
```

---

## Task 4: Set up Vitest + React Testing Library

**Files:**
- Create: `packages/react/vitest.config.ts`
- Create: `packages/react/src/test/setup.ts`
- Modify: `packages/react/package.json` — add test deps + test script
- Modify: `turbo.json` — add test pipeline task

- [ ] **Step 1: Install test dependencies**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react
npm install --save-dev vitest @vitest/coverage-v8 @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom 2>&1 | tail -5
```

- [ ] **Step 2: Create vitest.config.ts**

```ts
// packages/react/vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/components/**/*.tsx'],
      exclude: ['src/components/**/*.stories.tsx'],
    },
  },
})
```

- [ ] **Step 3: Create src/test/setup.ts**

```ts
// packages/react/src/test/setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Add test script to packages/react/package.json**

Open `packages/react/package.json`. Add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

- [ ] **Step 5: Add test pipeline to turbo.json**

Open `turbo.json`. Add to the `"tasks"` object:
```json
"test": {
  "dependsOn": ["^build"],
  "outputs": ["coverage/**"]
}
```

- [ ] **Step 6: Run to confirm setup works (no tests yet — expected zero pass)**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react
npx vitest run 2>&1 | tail -10
```

Expected: "No test files found" or 0 tests run — not an error.

- [ ] **Step 7: Commit**

```bash
cd ~/Documents/Projects/ds-foundation
git add -A
git commit -m "chore: add Vitest + React Testing Library to packages/react"
```

---

## Task 5: Add interactive state tokens and focus ring tokens

These tokens are missing from `semantic.css` and `tailwind.config.ts`. They're required before fixing Button and Badge (Task 6).

**Files:**
- Modify: `packages/react/src/styles/semantic.css`
- Modify: `packages/react/tailwind.config.ts`

- [ ] **Step 1: Add tokens to semantic.css**

Open `packages/react/src/styles/semantic.css`. After the `/* ── Easing */` block at the end, add:

```css
  /* ── Interactive states ─────────────────────────── */
  --ds-interactive:          var(--ds-color-interactive-default);
  --ds-interactive-hover:    var(--ds-color-interactive-hover);
  --ds-interactive-active:   var(--ds-color-interactive-active);
  --ds-interactive-disabled: var(--ds-color-interactive-disabled);
  --ds-interactive-selected: var(--ds-color-interactive-selected);
  --ds-interactive-selected-bg: var(--ds-color-interactive-selected-bg);

  /* ── Focus ring ─────────────────────────────────── */
  --ds-focus-ring-color:  var(--ds-color-border-focus);
  --ds-focus-ring-width:  2px;
  --ds-focus-ring-offset: 2px;

  /* ── Feedback — button-usable sets ─────────────── */
  --ds-success-text:    var(--ds-color-feedback-success-text);
  --ds-success-border:  var(--ds-color-feedback-success-border);
  --ds-warning-text:    var(--ds-color-feedback-warning-text);
  --ds-warning-border:  var(--ds-color-feedback-warning-border);
  --ds-danger-text:     var(--ds-color-feedback-error-text);
  --ds-danger-border:   var(--ds-color-feedback-error-border);
  --ds-info-text:       var(--ds-color-feedback-info-text);
  --ds-info-border:     var(--ds-color-feedback-info-border);

  /* ── Primary active state ───────────────────────── */
  --ds-primary-active:  var(--ds-color-brand-primary-active);
```

- [ ] **Step 2: Add new ds.* entries to tailwind.config.ts**

Open `packages/react/tailwind.config.ts`. In the `colors.ds` object, add after the existing entries:

```ts
// Interactive states
interactive:          'var(--ds-interactive)',
'interactive-hover':  'var(--ds-interactive-hover)',
'interactive-active': 'var(--ds-interactive-active)',
'interactive-disabled': 'var(--ds-interactive-disabled)',
'interactive-selected': 'var(--ds-interactive-selected)',
'interactive-selected-bg': 'var(--ds-interactive-selected-bg)',

// Primary active
'primary-active': 'var(--ds-primary-active)',

// Focus ring
'focus-ring': 'var(--ds-focus-ring-color)',

// Feedback text + border (for outline/ghost buttons)
'success-text':   'var(--ds-success-text)',
'success-border': 'var(--ds-success-border)',
'warning-text':   'var(--ds-warning-text)',
'warning-border': 'var(--ds-warning-border)',
'danger-text':    'var(--ds-danger-text)',
'danger-border':  'var(--ds-danger-border)',
'info-text':      'var(--ds-info-text)',
'info-border':    'var(--ds-info-border)',

// Feedback backgrounds (for hover fills on outline buttons)
'feedback-success-bg': 'var(--ds-feedback-success-bg)',
'feedback-error-bg':   'var(--ds-feedback-error-bg)',
'feedback-warning-bg': 'var(--ds-feedback-warning-bg)',
'feedback-info-bg':    'var(--ds-feedback-info-bg)',
```

- [ ] **Step 3: Add hifi: Tailwind variant to tailwind.config.ts plugins array**

```ts
plugin(function ({ addVariant }) {
  addVariant('sketch', '[data-theme="wireframe"] &')
  addVariant('hifi', ':not([data-theme="wireframe"]) &')   // ← add this line
}),
```

- [ ] **Step 4: Verify Tailwind build**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react
npx tailwindcss -i src/styles/styles.css -o /tmp/test-styles.css --config tailwind.config.ts 2>&1
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
cd ~/Documents/Projects/ds-foundation
git add -A
git commit -m "feat: add interactive state, focus ring, and feedback tokens

Adds --ds-interactive-*, --ds-focus-ring-*, --ds-primary-active,
feedback text/border/bg aliases to semantic.css and the corresponding
ds.* Tailwind utility keys. Also adds hifi: variant (complement to
sketch:) to tailwind.config."
```

---

## Task 6: Fix Typography.tsx — replace hardcoded px with token vars

**Files:**
- Modify: `packages/react/src/components/atoms/Typography.tsx`
- Create: `packages/react/src/components/atoms/Typography.test.tsx`

Token mapping (verified from `packages/tokens/build/css/variables.css`):
| Component | Old | Token | CSS var |
|---|---|---|---|
| Display | `text-[72px]` | 7xl | `--ds-font-size-7xl` (4.5rem) |
| H1 | `text-[48px]` | 5xl | `--ds-font-size-5xl` (3rem) |
| H2 | `text-[36px]` | 4xl | `--ds-font-size-4xl` (2.25rem) |
| H3 | `text-[28px]` | 3xl | `--ds-font-size-3xl` (1.875rem) |
| H4 | `text-[24px]` | 2xl | `--ds-font-size-2xl` (1.5rem) |
| H5 | `text-[20px]` | xl | `--ds-font-size-xl` (1.25rem) |
| BodyLarge | `text-[20px]` | xl | `--ds-font-size-xl` (1.25rem) |
| Body | `text-[16px]` | md | `--ds-font-size-md` (1rem) |
| BodySmall | `text-[14px]` | sm | `--ds-font-size-sm` (0.875rem) |
| Caption | `text-[12px]` | xs | `--ds-font-size-xs` (0.75rem) |

Line-height token mapping (from `--ds-font-leading-*`):
| Value | Token |
|---|---|
| 1.1 | `--ds-font-leading-tight` (closest: 1.25) |
| 1.25, 1.2 | `--ds-font-leading-tight` (1.25) |
| 1.3, 1.35, 1.4 | `--ds-font-leading-snug` (1.375) |
| 1.5, 1.6 | `--ds-font-leading-normal` (1.5) |

- [ ] **Step 1: Write the failing test**

Create `packages/react/src/components/atoms/Typography.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { Display, H1, H2, H3, H4, H5, BodyLarge, Body, BodySmall, Caption } from './Typography'

// Each typography variant must use CSS var references, not hardcoded px values.
// We test the className contains 'var(--ds-font-size-' as a proxy for token compliance.
const components = [Display, H1, H2, H3, H4, H5, BodyLarge, Body, BodySmall, Caption] as const

describe('Typography', () => {
  test.each([
    [Display, 'Display', 'var(--ds-font-size-7xl)'],
    [H1, 'H1', 'var(--ds-font-size-5xl)'],
    [H2, 'H2', 'var(--ds-font-size-4xl)'],
    [H3, 'H3', 'var(--ds-font-size-3xl)'],
    [H4, 'H4', 'var(--ds-font-size-2xl)'],
    [H5, 'H5', 'var(--ds-font-size-xl)'],
    [BodyLarge, 'BodyLarge', 'var(--ds-font-size-xl)'],
    [Body, 'Body', 'var(--ds-font-size-md)'],
    [BodySmall, 'BodySmall', 'var(--ds-font-size-sm)'],
    [Caption, 'Caption', 'var(--ds-font-size-xs)'],
  ])('%s uses token CSS var %s', (Component, _name, expectedVar) => {
    const { container } = render(<Component>text</Component>)
    const el = container.firstElementChild as HTMLElement
    expect(el.className).toContain(expectedVar)
  })

  test('Display renders as h1', () => {
    render(<Display>Title</Display>)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  test('Caption renders as span', () => {
    const { container } = render(<Caption>note</Caption>)
    expect(container.querySelector('span')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — confirm it fails**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react
npx vitest run src/components/atoms/Typography.test.tsx 2>&1 | tail -20
```

Expected: FAIL — className contains `text-[72px]` not `var(--ds-font-size-7xl)`.

- [ ] **Step 3: Replace Typography.tsx with token-compliant version**

Replace the entire file content of `packages/react/src/components/atoms/Typography.tsx`:

```tsx
import * as React from "react"
import { cn } from "../utils"

interface TypographyProps extends React.HTMLAttributes<HTMLElement> { }

const Display = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h1 ref={ref} className={cn(
      "text-[length:var(--ds-font-size-7xl)] font-bold leading-[var(--ds-font-leading-tight)] tracking-tight",
      className
    )} {...props} />
  )
)
Display.displayName = "Display"

const H1 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h1 ref={ref} className={cn(
      "text-[length:var(--ds-font-size-5xl)] font-bold leading-[var(--ds-font-leading-tight)] tracking-tight",
      className
    )} {...props} />
  )
)
H1.displayName = "H1"

const H2 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn(
      "text-[length:var(--ds-font-size-4xl)] font-bold leading-[var(--ds-font-leading-tight)] tracking-tight",
      className
    )} {...props} />
  )
)
H2.displayName = "H2"

const H3 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn(
      "text-[length:var(--ds-font-size-3xl)] font-semibold leading-[var(--ds-font-leading-snug)] tracking-tight",
      className
    )} {...props} />
  )
)
H3.displayName = "H3"

const H4 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h4 ref={ref} className={cn(
      "text-[length:var(--ds-font-size-2xl)] font-semibold leading-[var(--ds-font-leading-snug)] tracking-tight",
      className
    )} {...props} />
  )
)
H4.displayName = "H4"

const H5 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn(
      "text-[length:var(--ds-font-size-xl)] font-semibold leading-[var(--ds-font-leading-snug)] tracking-tight",
      className
    )} {...props} />
  )
)
H5.displayName = "H5"

const BodyLarge = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn(
      "text-[length:var(--ds-font-size-xl)] font-normal leading-[var(--ds-font-leading-relaxed)]",
      className
    )} {...props} />
  )
)
BodyLarge.displayName = "BodyLarge"

const Body = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn(
      "text-[length:var(--ds-font-size-md)] font-normal leading-[var(--ds-font-leading-normal)]",
      className
    )} {...props} />
  )
)
Body.displayName = "Body"

const BodySmall = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn(
      "text-[length:var(--ds-font-size-sm)] font-normal leading-[var(--ds-font-leading-normal)]",
      className
    )} {...props} />
  )
)
BodySmall.displayName = "BodySmall"

const Caption = React.forwardRef<HTMLSpanElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn(
      "text-[length:var(--ds-font-size-xs)] font-normal leading-[var(--ds-font-leading-snug)] text-ds-text-muted",
      className
    )} {...props} />
  )
)
Caption.displayName = "Caption"

export { Display, H1, H2, H3, H4, H5, BodyLarge, Body, BodySmall, Caption }
```

Note: `text-[length:var(--ds-font-size-*)]` uses Tailwind's CSS-type hint (`length:`) so it generates `font-size` not `--tw-...` ambiguous property.

- [ ] **Step 4: Run test — confirm pass**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react
npx vitest run src/components/atoms/Typography.test.tsx 2>&1 | tail -10
```

Expected: 12 tests pass.

- [ ] **Step 5: Commit**

```bash
cd ~/Documents/Projects/ds-foundation
git add -A
git commit -m "fix(Typography): replace hardcoded px values with DS token CSS vars

Fixes violation of the 'hardcoded values are bugs' design principle.
All font sizes now reference --ds-font-size-* custom properties, and
line-heights reference --ds-font-leading-* tokens."
```

---

## Task 7: Fix Button.tsx — pure CVA with all 4 interaction states

**Files:**
- Modify: `packages/react/src/components/atoms/Button.tsx`
- Create: `packages/react/src/components/atoms/Button.test.tsx`

This task converts Button from inline CSSProperties objects to a pure CVA + Tailwind `ds.*` classes approach. All 4 interaction states (hover, active, focus-visible, disabled) are explicit for every variant × colorScheme combination.

- [ ] **Step 1: Write the failing tests**

Create `packages/react/src/components/atoms/Button.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  test('renders with default variant and colorScheme', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  test('shows loading spinner and sets aria-busy when isLoading', () => {
    render(<Button isLoading>Save</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-busy', 'true')
    expect(btn).toBeDisabled()
  })

  test('shows loadingText when provided and isLoading', () => {
    render(<Button isLoading loadingText="Saving…">Save</Button>)
    expect(screen.getByText('Saving…')).toBeInTheDocument()
  })

  test('is disabled when disabled prop set', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  test('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Go</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('does not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Go</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  test('renders leftIcon', () => {
    render(<Button leftIcon={<span data-testid="icon" />}>With icon</Button>)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  test('no inline style color props — uses Tailwind classes only', () => {
    const { container } = render(<Button>Test</Button>)
    const btn = container.querySelector('button')!
    // backgroundColor and color should not be set as inline styles
    expect(btn.style.backgroundColor).toBe('')
    expect(btn.style.color).toBe('')
  })
})
```

- [ ] **Step 2: Run tests — confirm failures (specifically the inline style test)**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react
npx vitest run src/components/atoms/Button.test.tsx 2>&1 | tail -20
```

Expected: most pass, but `no inline style color props` fails.

- [ ] **Step 3: Replace Button.tsx with pure CVA implementation**

Replace the entire file content of `packages/react/src/components/atoms/Button.tsx`:

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Loader2 } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils"

type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link'
type ButtonColorScheme = 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon'

const ICON_DIMENSION: Record<ButtonSize, string> = {
  xs: '14px', sm: '14px', md: '16px', lg: '16px', xl: '16px', icon: '16px',
}

const buttonVariants = cva(
  // Base — layout, typography, focus ring, disabled
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border font-medium ' +
  'transition-colors duration-ds-fast ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg ' +
  'disabled:pointer-events-none disabled:opacity-50 ' +
  'aria-busy:pointer-events-none',
  {
    variants: {
      size: {
        xs:   'h-7 px-2.5 text-xs',
        sm:   'h-8 px-3 text-sm',
        md:   'h-10 px-4 text-sm',
        lg:   'h-11 px-6 text-base',
        xl:   'h-12 px-8 text-base',
        icon: 'h-10 w-10 p-0',
      },
      // variant and colorScheme are placeholders — real classes are in compoundVariants
      variant:     { solid: '', outline: '', ghost: '', link: 'underline-offset-4 hover:underline' },
      colorScheme: { primary: '', success: '', warning: '', danger: '', neutral: '' },
    },
    compoundVariants: [
      // ── Solid ────────────────────────────────────────────────────────────
      {
        variant: 'solid', colorScheme: 'primary',
        className: 'bg-ds-primary text-ds-primary-fg border-transparent hover:bg-ds-primary-hover active:bg-ds-primary-active',
      },
      {
        variant: 'solid', colorScheme: 'success',
        className: 'bg-ds-success text-ds-text-inverse border-transparent hover:opacity-90 active:opacity-75',
      },
      {
        variant: 'solid', colorScheme: 'warning',
        className: 'bg-ds-warning text-ds-text-inverse border-transparent hover:opacity-90 active:opacity-75',
      },
      {
        variant: 'solid', colorScheme: 'danger',
        className: 'bg-ds-danger text-ds-text-inverse border-transparent hover:opacity-90 active:opacity-75',
      },
      {
        variant: 'solid', colorScheme: 'neutral',
        className: 'bg-ds-surface-up text-ds-text border-ds-border hover:bg-ds-surface hover:border-ds-border-strong active:bg-ds-sunken',
      },
      // ── Outline ──────────────────────────────────────────────────────────
      {
        variant: 'outline', colorScheme: 'primary',
        className: 'bg-transparent text-ds-primary border-ds-primary hover:bg-ds-primary-subtle active:bg-ds-primary-subtle',
      },
      {
        variant: 'outline', colorScheme: 'success',
        className: 'bg-transparent text-ds-success-text border-ds-success-border hover:bg-ds-feedback-success-bg active:bg-ds-feedback-success-bg',
      },
      {
        variant: 'outline', colorScheme: 'warning',
        className: 'bg-transparent text-ds-warning-text border-ds-warning-border hover:bg-ds-feedback-warning-bg active:bg-ds-feedback-warning-bg',
      },
      {
        variant: 'outline', colorScheme: 'danger',
        className: 'bg-transparent text-ds-danger-text border-ds-danger-border hover:bg-ds-feedback-error-bg active:bg-ds-feedback-error-bg',
      },
      {
        variant: 'outline', colorScheme: 'neutral',
        className: 'bg-transparent text-ds-text border-ds-border hover:bg-ds-surface-up active:bg-ds-sunken',
      },
      // ── Ghost ────────────────────────────────────────────────────────────
      {
        variant: 'ghost', colorScheme: 'primary',
        className: 'bg-transparent text-ds-primary border-transparent hover:bg-ds-primary-subtle active:bg-ds-primary-subtle',
      },
      {
        variant: 'ghost', colorScheme: 'success',
        className: 'bg-transparent text-ds-success border-transparent hover:bg-ds-feedback-success-bg active:bg-ds-feedback-success-bg',
      },
      {
        variant: 'ghost', colorScheme: 'warning',
        className: 'bg-transparent text-ds-warning border-transparent hover:bg-ds-feedback-warning-bg active:bg-ds-feedback-warning-bg',
      },
      {
        variant: 'ghost', colorScheme: 'danger',
        className: 'bg-transparent text-ds-danger border-transparent hover:bg-ds-feedback-error-bg active:bg-ds-feedback-error-bg',
      },
      {
        variant: 'ghost', colorScheme: 'neutral',
        className: 'bg-transparent text-ds-text border-transparent hover:bg-ds-surface-up active:bg-ds-sunken',
      },
      // ── Link ─────────────────────────────────────────────────────────────
      {
        variant: 'link', colorScheme: 'primary',
        className: 'bg-transparent text-ds-primary border-transparent hover:text-ds-primary-hover',
      },
      {
        variant: 'link', colorScheme: 'neutral',
        className: 'bg-transparent text-ds-text border-transparent hover:text-ds-text-muted',
      },
      {
        variant: 'link', colorScheme: 'danger',
        className: 'bg-transparent text-ds-danger border-transparent',
      },
      {
        variant: 'link', colorScheme: 'success',
        className: 'bg-transparent text-ds-success border-transparent',
      },
      {
        variant: 'link', colorScheme: 'warning',
        className: 'bg-transparent text-ds-warning border-transparent',
      },
    ],
    defaultVariants: { variant: 'solid', colorScheme: 'primary', size: 'md' },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  colorScheme?: ButtonColorScheme
  size?: ButtonSize
  isLoading?: boolean
  loadingText?: string
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'solid',
      colorScheme = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const iconDim = ICON_DIMENSION[size]

    const wrapIcon = (icon: React.ReactElement) => (
      <span
        className="shrink-0 [&>svg]:w-full [&>svg]:h-full"
        style={{ width: iconDim, height: iconDim }}
        aria-hidden="true"
      >
        {icon}
      </span>
    )

    const leftSlot = isLoading
      ? wrapIcon(<Loader2 className="animate-spin" />)
      : leftIcon
        ? wrapIcon(leftIcon)
        : null

    const rightSlot = !isLoading && rightIcon ? wrapIcon(rightIcon) : null

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, colorScheme, size }), className)}
        disabled={isLoading || disabled}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {leftSlot}
        {isLoading && loadingText ? loadingText : children}
        {rightSlot}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
export type { ButtonVariant, ButtonColorScheme, ButtonSize }
```

- [ ] **Step 4: Run tests — confirm all pass**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react
npx vitest run src/components/atoms/Button.test.tsx 2>&1 | tail -10
```

Expected: 8/8 pass.

- [ ] **Step 5: TypeScript check**

```bash
cd ~/Documents/Projects/ds-foundation && npm run check 2>&1 | grep -E "error|Error" | head -10
```

Expected: no new errors.

- [ ] **Step 6: Commit**

```bash
cd ~/Documents/Projects/ds-foundation
git add -A
git commit -m "fix(Button): convert to pure CVA with all interaction states

Removes inline CSSProperties color objects. All 4 states (hover, active,
focus-visible, disabled) are now explicit Tailwind ds.* classes for every
variant × colorScheme combination. No inline styles remain."
```

---

## Task 8: Fix Badge.tsx — convert inline styles to Tailwind classes

**Files:**
- Modify: `packages/react/src/components/atoms/Badge.tsx`

Read the current Badge.tsx to understand its color approach, then convert inline styles to Tailwind `ds.*` classes following the same pattern as Button.

- [ ] **Step 1: Read current Badge.tsx**

```bash
gh api repos/ds-foundation/ds-foundation-rt/contents/packages/react/src/components/atoms/Badge.tsx --jq '.content' | base64 -d
```

Or read locally: `cat ~/Documents/Projects/ds-foundation/packages/react/src/components/atoms/Badge.tsx`

- [ ] **Step 2: Update Badge to use Tailwind ds.* classes**

Badge typically has `variant` (solid/outline/subtle) × `colorScheme` (primary/success/warning/danger/neutral/info). Replace any inline style color objects with CVA compound variants following the same pattern as Button Task 7.

The general pattern:
- `solid primary`: `bg-ds-primary text-ds-primary-fg`
- `solid success`: `bg-ds-success text-ds-text-inverse`
- `subtle primary`: `bg-ds-primary-subtle text-ds-primary`
- `subtle success`: `bg-ds-feedback-success-bg text-ds-success-text`
- `outline primary`: `bg-transparent border-ds-primary text-ds-primary`

(Adjust based on what you see in the actual Badge file.)

- [ ] **Step 3: TypeScript check**

```bash
cd ~/Documents/Projects/ds-foundation && npm run check 2>&1 | grep -E "error" | head -10
```

- [ ] **Step 4: Commit**

```bash
cd ~/Documents/Projects/ds-foundation
git add -A
git commit -m "fix(Badge): convert inline styles to Tailwind ds.* classes"
```

---

## Task 9: Wire useReducedMotion into animated components

**Files:**
- Modify: `packages/react/src/components/organisms/Accordion.tsx`
- Modify: `packages/react/src/components/organisms/Carousel.tsx`
- Modify: `packages/react/src/components/atoms/Skeleton.tsx`

The hook is already at `packages/react/src/components/utils/useReducedMotion.ts` and returns `boolean`.

- [ ] **Step 1: Read each file to understand current animation approach**

```bash
cat ~/Documents/Projects/ds-foundation/packages/react/src/components/organisms/Accordion.tsx
cat ~/Documents/Projects/ds-foundation/packages/react/src/components/atoms/Skeleton.tsx
```

- [ ] **Step 2: Update Accordion.tsx**

Import and use the hook in `AccordionContent`:

```tsx
import { useReducedMotion } from '../utils/useReducedMotion'

// Inside AccordionContent component:
const prefersReducedMotion = useReducedMotion()
// Add to the className:
// prefersReducedMotion ? '' : 'data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up'
```

The final className for AccordionContent should be:
```tsx
className={cn(
  "overflow-hidden text-sm",
  !prefersReducedMotion && "data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
  className
)}
```

- [ ] **Step 3: Update Skeleton.tsx**

Skeleton uses a pulse/shimmer animation. Wire the hook:

```tsx
import { useReducedMotion } from '../utils/useReducedMotion'

// Inside Skeleton:
const prefersReducedMotion = useReducedMotion()
// Remove the animate-pulse class when prefersReducedMotion is true
className={cn(
  "rounded-md bg-ds-surface-up",
  !prefersReducedMotion && "animate-pulse",
  className
)}
```

- [ ] **Step 4: Update Carousel.tsx**

Carousel uses Embla. Check if Embla has a reduced motion option; if so, pass it. If not, disable CSS transitions:

```tsx
import { useReducedMotion } from '../utils/useReducedMotion'
// In the CarouselContent or item wrapper, add:
// style={{ transition: prefersReducedMotion ? 'none' : undefined }}
```

- [ ] **Step 5: TypeScript check + commit**

```bash
cd ~/Documents/Projects/ds-foundation && npm run check 2>&1 | grep error | head -5
git add -A
git commit -m "feat: wire useReducedMotion into Accordion, Carousel, Skeleton"
```

---

## Task 10: Add wireframe theme to Storybook

**Files:**
- Modify: `apps/storybook/.storybook/preview.ts`

- [ ] **Step 1: Update preview.ts**

Open `apps/storybook/.storybook/preview.ts`. The current themes list:
```ts
list: [
  { name: 'light', class: '', color: '#f8fafc' },
  { name: 'dark', class: 'dark', color: '#0f172a', default: false },
],
```

Add wireframe entry:
```ts
list: [
  { name: 'light', class: '', color: '#f8fafc' },
  { name: 'dark', class: 'dark', color: '#0f172a', default: false },
  { name: 'wireframe', class: 'wireframe', color: '#e2e8f0', default: false },
],
```

The `class` value maps to the `data-theme` attribute value per the `attribute: 'data-theme'` setting already in the config.

- [ ] **Step 2: Verify Storybook starts**

```bash
cd ~/Documents/Projects/ds-foundation && npx storybook dev --port 6006 &
sleep 8 && curl -s http://localhost:6006 | grep -c "storybook" && kill %1
```

Expected: returns 1+ (Storybook HTML is served).

- [ ] **Step 3: Commit**

```bash
cd ~/Documents/Projects/ds-foundation
git add apps/storybook/.storybook/preview.ts
git commit -m "fix(storybook): add wireframe theme to addon-themes list"
```

---

## Task 11: Add Sidebar component

**Files:**
- Create: `packages/react/src/components/organisms/Sidebar.tsx`
- Create: `packages/react/src/components/organisms/Sidebar.stories.tsx`
- Create: `packages/react/src/components/organisms/Sidebar.test.tsx`
- Modify: `packages/react/src/index.ts`

Ported from DS-Michelangelo, updated to use `ds.*` Tailwind classes.

- [ ] **Step 1: Write the failing test**

Create `packages/react/src/components/organisms/Sidebar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import {
  Sidebar, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton,
} from './Sidebar'

describe('Sidebar', () => {
  test('renders sidebar with header, content, footer', () => {
    render(
      <Sidebar>
        <SidebarHeader>Header</SidebarHeader>
        <SidebarContent>Content</SidebarContent>
        <SidebarFooter>Footer</SidebarFooter>
      </Sidebar>
    )
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  test('SidebarMenuButton renders as button', () => {
    render(
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>Dashboard</SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument()
  })

  test('SidebarMenuButton marks active with aria-current', () => {
    render(<SidebarMenuButton isActive>Active Item</SidebarMenuButton>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'page')
  })

  test('SidebarGroupLabel renders label text', () => {
    render(<SidebarGroupLabel>Settings</SidebarGroupLabel>)
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — confirm it fails (component doesn't exist)**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react
npx vitest run src/components/organisms/Sidebar.test.tsx 2>&1 | tail -10
```

Expected: FAIL — cannot find module.

- [ ] **Step 3: Create Sidebar.tsx**

Create `packages/react/src/components/organisms/Sidebar.tsx`:

```tsx
import * as React from "react"
import { cn } from "../utils"

const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col h-full w-64 border-r border-ds-border bg-ds-surface", className)}
      {...props}
    />
  )
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-4 py-3 border-b border-ds-border", className)} {...props} />
  )
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 overflow-y-auto", className)} {...props} />
  )
)
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-4 py-3 border-t border-ds-border", className)} {...props} />
  )
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-2 py-3", className)} {...props} />
  )
)
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-3 py-1.5 text-xs font-semibold text-ds-text-muted uppercase tracking-wider", className)}
      {...props}
    />
  )
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-0.5", className)} {...props} />
  )
)
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("space-y-0.5", className)} {...props} />
  )
)
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
  )
)
SidebarMenuItem.displayName = "SidebarMenuItem"

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, isActive = false, ...props }, ref) => (
    <button
      ref={ref}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-ds-text",
        "transition-colors duration-ds-fast",
        "hover:bg-ds-surface-up hover:text-ds-text",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-1",
        "disabled:pointer-events-none disabled:opacity-50",
        isActive && "bg-ds-interactive-selected-bg text-ds-interactive-selected font-semibold",
        className
      )}
      {...props}
    />
  )
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarSeparator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => (
    <hr ref={ref} className={cn("my-2 border-ds-border", className)} {...props} />
  )
)
SidebarSeparator.displayName = "SidebarSeparator"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
}
export type { SidebarMenuButtonProps }
```

- [ ] **Step 4: Run test — confirm pass**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react
npx vitest run src/components/organisms/Sidebar.test.tsx 2>&1 | tail -10
```

Expected: 4/4 pass.

- [ ] **Step 5: Create Sidebar.stories.tsx**

Create `packages/react/src/components/organisms/Sidebar.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Home, Settings, Users, BarChart2, FileText } from 'lucide-react'
import {
  Sidebar, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator,
} from './Sidebar'

const meta: Meta<typeof Sidebar> = {
  title: 'Organisms/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof Sidebar>

const SidebarDemo = ({ activeItem = 'Dashboard' }: { activeItem?: string }) => (
  <Sidebar>
    <SidebarHeader>
      <span className="text-sm font-bold text-ds-text">Acme Inc</span>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          {[
            { label: 'Dashboard', icon: Home },
            { label: 'Reports', icon: BarChart2 },
            { label: 'Documents', icon: FileText },
          ].map(({ label, icon: Icon }) => (
            <SidebarMenuItem key={label}>
              <SidebarMenuButton isActive={label === activeItem}>
                <Icon className="h-4 w-4" />
                {label}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarSeparator />
      <SidebarGroup>
        <SidebarGroupLabel>Admin</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {[{ label: 'Users', icon: Users }, { label: 'Settings', icon: Settings }].map(({ label, icon: Icon }) => (
              <SidebarMenuItem key={label}>
                <SidebarMenuButton isActive={label === activeItem}>
                  <Icon className="h-4 w-4" />
                  {label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <span className="text-xs text-ds-text-muted">v1.0.0</span>
    </SidebarFooter>
  </Sidebar>
)

export const Default: Story = {
  render: () => <div style={{ height: '400px', display: 'flex' }}><SidebarDemo /></div>,
}

export const WithActiveItem: Story = {
  render: () => <div style={{ height: '400px', display: 'flex' }}><SidebarDemo activeItem="Reports" /></div>,
}
```

- [ ] **Step 6: Add exports to index.ts**

In `packages/react/src/index.ts`, after the `Timeline` export, add:

```ts
export {
  Sidebar, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator,
  type SidebarMenuButtonProps,
} from './components/organisms/Sidebar';
```

- [ ] **Step 7: TypeScript check + commit**

```bash
cd ~/Documents/Projects/ds-foundation && npm run check 2>&1 | grep error | head -5
git add -A
git commit -m "feat(Sidebar): add compound Sidebar organism

Ported from DS-Michelangelo, updated to use ds.* Tailwind classes.
Includes Header, Content, Footer, Group, GroupLabel, GroupContent,
Menu, MenuItem, MenuButton (with isActive state), Separator."
```

---

## Task 12: Add Kbd component

**Files:**
- Create: `packages/react/src/components/atoms/Kbd.tsx`
- Create: `packages/react/src/components/atoms/Kbd.stories.tsx`
- Create: `packages/react/src/components/atoms/Kbd.test.tsx`
- Modify: `packages/react/src/index.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/react/src/components/atoms/Kbd.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { Kbd } from './Kbd'

describe('Kbd', () => {
  test('renders keyboard text', () => {
    render(<Kbd>⌘K</Kbd>)
    expect(screen.getByText('⌘K')).toBeInTheDocument()
  })

  test('renders as kbd element', () => {
    const { container } = render(<Kbd>Enter</Kbd>)
    expect(container.querySelector('kbd')).toBeInTheDocument()
  })

  test('accepts className override', () => {
    const { container } = render(<Kbd className="custom-class">Tab</Kbd>)
    expect(container.querySelector('kbd')).toHaveClass('custom-class')
  })
})
```

- [ ] **Step 2: Run test — confirm it fails**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react
npx vitest run src/components/atoms/Kbd.test.tsx 2>&1 | tail -10
```

- [ ] **Step 3: Create Kbd.tsx**

Create `packages/react/src/components/atoms/Kbd.tsx`:

```tsx
import * as React from "react"
import { cn } from "../utils"

const Kbd = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(
        "inline-flex items-center rounded border border-ds-border bg-ds-sunken",
        "px-1.5 py-0.5 text-[length:var(--ds-font-size-2xs)] font-mono font-medium text-ds-text-muted",
        "shadow-ds-xs",
        "sketch:rounded-none sketch:border-black sketch:bg-white sketch:font-sans",
        className
      )}
      {...props}
    />
  )
)
Kbd.displayName = "Kbd"

export { Kbd }
```

- [ ] **Step 4: Run test — confirm pass**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react
npx vitest run src/components/atoms/Kbd.test.tsx 2>&1 | tail -10
```

Expected: 3/3 pass.

- [ ] **Step 5: Create Kbd.stories.tsx**

Create `packages/react/src/components/atoms/Kbd.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Kbd } from './Kbd'

const meta: Meta<typeof Kbd> = {
  title: 'Atoms/Kbd',
  component: Kbd,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Kbd>

export const Default: Story = { args: { children: '⌘K' } }
export const Enter: Story = { args: { children: 'Enter' } }
export const Shortcut: Story = {
  render: () => (
    <div className="flex items-center gap-1 text-sm text-ds-text-muted">
      Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to open
    </div>
  ),
}
```

- [ ] **Step 6: Export from index.ts**

Add after Separator export:
```ts
export { Kbd } from './components/atoms/Kbd';
```

- [ ] **Step 7: Commit**

```bash
cd ~/Documents/Projects/ds-foundation
git add -A
git commit -m "feat(Kbd): add keyboard shortcut display component"
```

---

## Task 13: Add AlertDialog component

**Files:**
- Create: `packages/react/src/components/organisms/AlertDialog.tsx`
- Create: `packages/react/src/components/organisms/AlertDialog.stories.tsx`
- Create: `packages/react/src/components/organisms/AlertDialog.test.tsx`
- Modify: `packages/react/src/index.ts`

- [ ] **Step 1: Install Radix AlertDialog primitive (if not present)**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react
grep "@radix-ui/react-alert-dialog" package.json
```

If not found:
```bash
npm install @radix-ui/react-alert-dialog
```

- [ ] **Step 2: Write the failing test**

Create `packages/react/src/components/organisms/AlertDialog.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from './AlertDialog'

describe('AlertDialog', () => {
  test('opens when trigger is clicked', async () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
    await userEvent.click(screen.getByText('Delete', { selector: 'button' }))
    expect(screen.getByText('Confirm deletion')).toBeInTheDocument()
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument()
  })

  test('closes when Cancel is clicked', async () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run test — confirm it fails**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react
npx vitest run src/components/organisms/AlertDialog.test.tsx 2>&1 | tail -10
```

- [ ] **Step 4: Create AlertDialog.tsx**

Create `packages/react/src/components/organisms/AlertDialog.tsx`:

```tsx
import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cn } from "../utils"
import { Button } from "../atoms/Button"

const AlertDialog = AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
        "rounded-lg border border-ds-border bg-ds-surface p-6 shadow-ds-lg",
        "duration-200",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-2", className)} {...props} />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-6", className)} {...props} />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-[length:var(--ds-font-size-lg)] font-semibold text-ds-text", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-[length:var(--ds-font-size-sm)] text-ds-text-muted", className)}
    {...props}
  />
))
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, children, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} asChild>
    <Button variant="solid" colorScheme="danger" className={className} {...props}>
      {children}
    </Button>
  </AlertDialogPrimitive.Action>
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, children, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel ref={ref} asChild>
    <Button variant="outline" colorScheme="neutral" className={className} {...props}>
      {children}
    </Button>
  </AlertDialogPrimitive.Cancel>
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog, AlertDialogTrigger, AlertDialogPortal, AlertDialogOverlay,
  AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
}
```

- [ ] **Step 5: Run test — confirm pass**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react
npx vitest run src/components/organisms/AlertDialog.test.tsx 2>&1 | tail -10
```

Expected: 2/2 pass.

- [ ] **Step 6: Create AlertDialog.stories.tsx**

Create `packages/react/src/components/organisms/AlertDialog.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogAction, AlertDialogCancel } from './AlertDialog'
import { Button } from '../atoms/Button'

const meta: Meta = { title: 'Organisms/AlertDialog', tags: ['autodocs'] }
export default meta
type Story = StoryObj

export const DeleteConfirmation: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" colorScheme="danger">Delete record</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the record.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}
```

- [ ] **Step 7: Add exports to index.ts + TypeScript check + commit**

```ts
export {
  AlertDialog, AlertDialogTrigger, AlertDialogPortal, AlertDialogOverlay,
  AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
} from './components/organisms/AlertDialog';
```

```bash
cd ~/Documents/Projects/ds-foundation && npm run check 2>&1 | grep error | head -5
git add -A
git commit -m "feat(AlertDialog): add Radix-based confirmation dialog"
```

---

## Task 14: Add Menubar component

**Files:**
- Create: `packages/react/src/components/organisms/Menubar.tsx`
- Create: `packages/react/src/components/organisms/Menubar.stories.tsx`
- Create: `packages/react/src/components/organisms/Menubar.test.tsx`
- Modify: `packages/react/src/index.ts`

- [ ] **Step 1: Install Radix Menubar primitive (if not present)**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react
grep "@radix-ui/react-menubar" package.json
# If not found:
npm install @radix-ui/react-menubar
```

- [ ] **Step 2: Write the failing test**

Create `packages/react/src/components/organisms/Menubar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { Menubar, MenubarMenu, MenubarTrigger } from './Menubar'

describe('Menubar', () => {
  test('renders menubar with triggers', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    )
    expect(screen.getByRole('menubar')).toBeInTheDocument()
    expect(screen.getByText('File')).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run test — confirm it fails**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react
npx vitest run src/components/organisms/Menubar.test.tsx 2>&1 | tail -10
```

- [ ] **Step 4: Create Menubar.tsx**

Create `packages/react/src/components/organisms/Menubar.tsx`:

```tsx
import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "../utils"

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center gap-1 rounded-md border border-ds-border bg-ds-surface px-1",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarMenu = MenubarPrimitive.Menu
const MenubarGroup = MenubarPrimitive.Group
const MenubarPortal = MenubarPrimitive.Portal
const MenubarSub = MenubarPrimitive.Sub
const MenubarRadioGroup = MenubarPrimitive.RadioGroup

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded px-3 py-1.5",
      "text-[length:var(--ds-font-size-sm)] font-medium text-ds-text",
      "outline-none",
      "hover:bg-ds-surface-up",
      "focus:bg-ds-surface-up",
      "data-[state=open]:bg-ds-surface-up",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => (
  <MenubarPortal>
    <MenubarPrimitive.Content
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-48 overflow-hidden rounded-md border border-ds-border bg-ds-surface p-1 shadow-ds-md",
        "data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </MenubarPortal>
))
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded px-2 py-1.5",
      "text-[length:var(--ds-font-size-sm)] text-ds-text outline-none",
      "focus:bg-ds-surface-up focus:text-ds-text",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded py-1.5 pl-8 pr-2",
      "text-[length:var(--ds-font-size-sm)] text-ds-text outline-none",
      "focus:bg-ds-surface-up",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded py-1.5 pl-8 pr-2",
      "text-[length:var(--ds-font-size-sm)] text-ds-text outline-none",
      "focus:bg-ds-surface-up",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-[length:var(--ds-font-size-xs)] font-semibold text-ds-text-muted",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-ds-border", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("ml-auto text-[length:var(--ds-font-size-xs)] text-ds-text-muted tracking-widest", className)}
    {...props}
  />
)
MenubarShortcut.displayName = "MenubarShortcut"

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded px-2 py-1.5",
      "text-[length:var(--ds-font-size-sm)] text-ds-text outline-none",
      "focus:bg-ds-surface-up data-[state=open]:bg-ds-surface-up",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-32 overflow-hidden rounded-md border border-ds-border bg-ds-surface p-1 shadow-ds-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

export {
  Menubar, MenubarMenu, MenubarGroup, MenubarPortal, MenubarSub, MenubarRadioGroup,
  MenubarTrigger, MenubarContent, MenubarItem, MenubarCheckboxItem, MenubarRadioItem,
  MenubarLabel, MenubarSeparator, MenubarShortcut, MenubarSubTrigger, MenubarSubContent,
}
```

- [ ] **Step 5: Run test — confirm pass**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react
npx vitest run src/components/organisms/Menubar.test.tsx 2>&1 | tail -10
```

Expected: 1/1 pass.

- [ ] **Step 6: Create Menubar.stories.tsx**

Create `packages/react/src/components/organisms/Menubar.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem,
  MenubarSeparator, MenubarShortcut, MenubarCheckboxItem, MenubarLabel } from './Menubar'

const meta: Meta<typeof Menubar> = {
  title: 'Organisms/Menubar',
  component: Menubar,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Menubar>

export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
          <MenubarItem>New Window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print… <MenubarShortcut>⌘P</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Text</MenubarLabel>
          <MenubarCheckboxItem checked>Word Wrap</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem>Find <MenubarShortcut>⌘F</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
}
```

- [ ] **Step 7: Add exports to index.ts + TypeScript check + commit**

```ts
export {
  Menubar, MenubarMenu, MenubarGroup, MenubarPortal, MenubarSub, MenubarRadioGroup,
  MenubarTrigger, MenubarContent, MenubarItem, MenubarCheckboxItem, MenubarRadioItem,
  MenubarLabel, MenubarSeparator, MenubarShortcut, MenubarSubTrigger, MenubarSubContent,
} from './components/organisms/Menubar';
```

```bash
cd ~/Documents/Projects/ds-foundation && npm run check 2>&1 | grep error | head -5
git add -A
git commit -m "feat(Menubar): add Radix-based horizontal menubar"
```

---

## Task 15: Run full test suite and fix any failures

- [ ] **Step 1: Run all tests**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react
npx vitest run 2>&1 | tail -30
```

Expected: all tests pass. Fix any failures before proceeding.

- [ ] **Step 2: Full build check**

```bash
cd ~/Documents/Projects/ds-foundation && npm run build 2>&1 | tail -20
```

Expected: build succeeds with no errors.

- [ ] **Step 3: TypeScript check**

```bash
cd ~/Documents/Projects/ds-foundation && npm run check 2>&1 | grep -E "^.*error" | head -20
```

Expected: 0 errors.

---

## Task 16: Update CONTRIBUTING.md and README.md

**Files:**
- Modify: `CONTRIBUTING.md`
- Modify: `README.md`

- [ ] **Step 1: Update CONTRIBUTING.md**

Add the following sections to CONTRIBUTING.md after the existing "Component placement" section:

**Styling convention (add this):**
```markdown
## Styling Convention

All components use **Tailwind `ds.*` utility classes exclusively** for color, spacing,
and typography. Inline `style` props are never used for design token values.

Rules:
- Colors: `bg-ds-surface`, `text-ds-text`, `border-ds-border`
- Interactive states must always be declared: `hover:`, `active:`, `focus-visible:`, `disabled:`
- Focus ring pattern: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2`
- Disabled pattern: `disabled:pointer-events-none disabled:opacity-50`
- Never hardcode colors, sizes, or spacing. If a token doesn't exist, add it to semantic.css first.
```

**Testing requirement (add this):**
```markdown
## Testing

Every new component and every modified component requires tests. Use Vitest + React Testing Library.

Run tests: `npm test` (from `packages/react/`)

Requirements:
- Render test (component renders without error)
- Interaction state test for interactive components (click, keyboard)
- Accessibility attribute test (aria-*, role) for components with semantic meaning
- No snapshot tests — test behavior, not markup
```

- [ ] **Step 2: Update README.md**

Remove treasury component references from the component list. Update the "Components" section to reflect the current component count and add the four new additions (Sidebar, Kbd, AlertDialog, Menubar).

- [ ] **Step 3: Commit**

```bash
cd ~/Documents/Projects/ds-foundation
git add CONTRIBUTING.md README.md
git commit -m "docs: update CONTRIBUTING and README after foundation cleanup

Documents the Tailwind-only styling convention, interaction state
pattern, and testing requirements. Removes treasury component references."
```

---

## Task 17: Final validation and PR

- [ ] **Step 1: Run all tests one final time**

```bash
cd ~/Documents/Projects/ds-foundation/packages/react && npx vitest run 2>&1 | tail -10
```

- [ ] **Step 2: Full build**

```bash
cd ~/Documents/Projects/ds-foundation && npm run build 2>&1 | tail -10
```

- [ ] **Step 3: Validate tokens**

```bash
cd ~/Documents/Projects/ds-foundation && npm run validate:tokens 2>&1 | tail -10
```

- [ ] **Step 4: TypeScript check**

```bash
cd ~/Documents/Projects/ds-foundation && npm run check 2>&1 | grep error | head -10
```

- [ ] **Step 5: Create changeset**

```bash
cd ~/Documents/Projects/ds-foundation && npx changeset
```

Select `@ds-foundation/react` — **major** version bump (treasury removal is a breaking change).

Summary: "Remove treasury components, fix all hardcoded values, add Sidebar/Kbd/AlertDialog/Menubar, standardise interaction states"

- [ ] **Step 6: Push branch and open PR**

```bash
git push -u origin feat/foundation-cleanup-v2
gh pr create \
  --title "feat!: foundation cleanup — remove treasury, fix tokens, add 4 components" \
  --body "$(cat <<'EOF'
## Summary
- Remove 14 treasury components (domain-specific, out of scope for foundation DS)
- Delete ~98 legacy flat-root component files (pre-token drafts, nothing exported them)
- Fix Typography hardcoded px values → DS token CSS vars
- Convert Button to pure CVA — all 4 interaction states (hover/active/focus/disabled) explicit for every variant × colorScheme
- Convert Badge inline styles → Tailwind ds.* classes
- Wire useReducedMotion into Accordion, Carousel, Skeleton
- Remove redundant semantic.dark.css
- Clean up bridge.css hardcoded hex scales
- Add focus ring tokens, interactive state tokens, hifi: Tailwind variant
- Add Sidebar, Kbd, AlertDialog, Menubar components (from DS-Michelangelo, adapted to ds.* token approach)
- Add Vitest + React Testing Library; tests for all new + modified components
- Update CONTRIBUTING.md: styling convention, testing requirements

## Breaking changes
- `@ds-foundation/react` no longer exports treasury components

## Test plan
- [ ] All Vitest tests pass
- [ ] Full build succeeds
- [ ] Token validation passes
- [ ] TypeScript check clean
- [ ] Storybook renders all 3 themes (light/dark/wireframe)
- [ ] Button: all variant × colorScheme combos have visible hover + active + focus states
- [ ] Typography: no hardcoded px values in rendered output

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Remove treasury ← Task 2
- [x] Delete flat root files ← Task 1
- [x] Fix Typography hardcoded px ← Task 6
- [x] Fix Button inline styles + add all interaction states ← Task 7
- [x] Fix Badge inline styles ← Task 8
- [x] Remove semantic.dark.css ← Task 3
- [x] Clean bridge.css hardcoded hex ← Task 3
- [x] Add focus ring / interactive tokens ← Task 5
- [x] Add hifi: Tailwind variant ← Task 5
- [x] Wire useReducedMotion ← Task 9
- [x] Add wireframe to Storybook ← Task 10
- [x] Add Sidebar ← Task 11
- [x] Add Kbd ← Task 12
- [x] Add AlertDialog ← Task 13
- [x] Add Menubar ← Task 14
- [x] Tests for all new + modified components ← Tasks 4, 6, 7, 11, 12, 13, 14
- [x] Update docs ← Task 16
- [x] PR ← Task 17

**Not in this plan (documented as future work):**
- Peer dep / tree-shaking refactor (documented in CONTRIBUTING.md)
- Retroactive tests for all ~60 existing components
- ds/docs page updates for Sidebar, Kbd, AlertDialog, Menubar
