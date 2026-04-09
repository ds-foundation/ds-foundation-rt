# SP3 — Wireframe Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the react package file layout, add a brand-neutral wireframe CSS theme, implement DesignSystemProvider/ThemeToggle/useTheme for runtime theme switching, add the `sketch:` Tailwind variant, and set up Changesets for changelog management.

**Architecture:** CSS-only theme switching via `data-theme` attribute on `<html>`. `semantic.wireframe.css` overrides all `--ds-*` color tokens to a neutral gray/blue palette without touching component code. `DesignSystemProvider` is a React context that manages theme state and writes the attribute; `ThemeToggle` is a ready-made button built on the existing Button component.

**Tech Stack:** React 18, TypeScript, CSS Custom Properties, Tailwind CSS v3 (plugin API for custom variant), `@changesets/cli`

---

## File Map

| File | Action | Notes |
|---|---|---|
| `packages/react/src/components/` | Create directory | Destination for all 59 `.tsx` component files |
| `packages/react/src/styles/` | Create directory | Destination for all CSS files |
| `packages/react/src/*.tsx` | Move → `src/components/` | 59 component files + story files |
| `packages/react/src/utils.ts` | Move → `src/components/utils.ts` | Internal CN helper; import paths inside components unchanged |
| `packages/react/src/styles.css` | Move → `src/styles/styles.css` | Add wireframe import |
| `packages/react/src/semantic.css` | Move → `src/styles/semantic.css` | Path only |
| `packages/react/src/semantic.dark.css` | Move → `src/styles/semantic.dark.css` | Path only |
| `packages/react/src/styles/semantic.wireframe.css` | Create | New wireframe theme overrides |
| `packages/react/src/index.ts` | Modify | Update all `'./Name'` → `'./components/Name'`; add new exports |
| `packages/react/src/components/DesignSystemProvider.tsx` | Create | Theme context + `useTheme` hook |
| `packages/react/src/components/ThemeToggle.tsx` | Create | Toggle button cycling light → dark → wireframe |
| `packages/react/tailwind.config.ts` | Modify | Add `sketch:` variant plugin |
| `packages/react/package.json` | Modify | Update build script input path |
| `CHANGELOG.md` | Create | Repo root; initial content covers SP1 + SP2 + SP3 |
| `packages/react/CHANGELOG.md` | Create | Per-package changelog |
| `packages/tokens/CHANGELOG.md` | Create | Per-package changelog |
| `.changeset/config.json` | Create | Changesets monorepo config |

---

## Task 1: Migrate File Layout

**Files:**
- Move: `packages/react/src/*.tsx` → `packages/react/src/components/`
- Move: `packages/react/src/utils.ts` → `packages/react/src/components/utils.ts`
- Move: `packages/react/src/styles.css`, `semantic.css`, `semantic.dark.css` → `packages/react/src/styles/`
- Modify: `packages/react/src/index.ts`
- Modify: `packages/react/package.json` (build script)

**Why utils.ts moves to components/:** All 59 components import `'./utils'`. If utils stayed in `src/`, components would need `'../utils'` — 59 files to update. Moving utils to `src/components/utils.ts` means zero import changes inside component files.

- [ ] **Step 1: Create destination directories**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt/packages/react/src
mkdir -p components styles
```

- [ ] **Step 2: Move component files**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt/packages/react/src
git mv *.tsx components/
git mv utils.ts components/
```

Expected: `git mv` reports each file moved. No errors.

- [ ] **Step 3: Move CSS files**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt/packages/react/src
git mv styles.css semantic.css semantic.dark.css styles/
```

Expected: three files moved, no errors.

- [ ] **Step 4: Update index.ts import paths**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt
node -e "
const fs = require('fs');
const path = 'packages/react/src/index.ts';
let c = fs.readFileSync(path, 'utf8');
// Replace all from './Name' with from './components/Name'
// Matches both PascalCase (components) and camelCase starts (none in this file)
c = c.replace(/from '\.\/([^']+)'/g, (match, name) => {
  // Skip if already has a path separator (subpaths like './components/...')
  if (name.includes('/')) return match;
  return \`from './components/\${name}'\`;
});
fs.writeFileSync(path, c);
console.log('Updated index.ts');
"
```

Verify the output:
```bash
head -5 packages/react/src/index.ts
```
Expected:
```ts
export * from './components/MonoAmount';
export * from './components/CurrencyBadge';
```

- [ ] **Step 5: Update build script in package.json**

Read `packages/react/package.json`, find the `build` script:
```json
"build": "tailwindcss -i src/styles.css -o dist/styles.css --config tailwind.config.ts && tsup"
```

Change to:
```json
"build": "tailwindcss -i src/styles/styles.css -o dist/styles.css --config tailwind.config.ts && tsup"
```

Use Edit tool — find and replace only the input path.

- [ ] **Step 6: Run TypeScript check**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt/packages/react && npx tsc --noEmit --project tsconfig.json
```

Expected: exits 0, zero errors. If errors appear: they are almost certainly import path issues — check that `index.ts` paths all say `'./components/Name'` not `'./Name'`.

- [ ] **Step 7: Verify the build compiles**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt && npm run build --workspace=packages/react 2>&1 | tail -10
```

Expected: `dist/index.js`, `dist/index.cjs`, `dist/styles.css` produced with no errors.

- [ ] **Step 8: Commit**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt
git add packages/react/src/
git add packages/react/package.json
git commit -m "$(cat <<'EOF'
refactor(react): reorganize src layout — components/ and styles/ subdirectories

Move all 59 component .tsx files and utils.ts to src/components/.
Move styles.css, semantic.css, semantic.dark.css to src/styles/.
Update index.ts import paths and build script input path.
Zero API changes — exports are identical.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Wireframe CSS Theme

**Files:**
- Create: `packages/react/src/styles/semantic.wireframe.css`
- Modify: `packages/react/src/styles/styles.css`

- [ ] **Step 1: Create the wireframe theme CSS file**

Create `packages/react/src/styles/semantic.wireframe.css` with exactly this content:

```css
/* Wireframe theme — brand-neutral palette for rapid prototyping.
   Applied via [data-theme="wireframe"] on <html>.
   Feedback tokens (success/warning/error/info) are intentionally omitted —
   they cascade from :root and retain full semantic meaning for customer testing. */

[data-theme="wireframe"] {
  /* Surfaces */
  --ds-bg:         #f5f5f5;
  --ds-surface:    #ffffff;
  --ds-surface-up: #ebebeb;
  --ds-overlay:    rgba(0, 0, 0, 0.4);
  --ds-sunken:     #e0e0e0;

  /* Text */
  --ds-text:          #1a1a1a;
  --ds-text-muted:    #666666;
  --ds-text-disabled: #aaaaaa;
  --ds-text-inverse:  #ffffff;

  /* Borders */
  --ds-border:        #cccccc;
  --ds-border-strong: #999999;
  --ds-border-focus:  #4a7fa5;

  /* Brand — generic blue, intentionally not Ripple-branded */
  --ds-primary:        #4a7fa5;
  --ds-primary-hover:  #3a6f95;
  --ds-primary-fg:     #ffffff;
  --ds-primary-subtle: #ddeaf4;
}
```

- [ ] **Step 2: Add wireframe import to styles.css**

Read `packages/react/src/styles/styles.css`. It currently ends with:
```css
@import "./semantic.dark.css";
@tailwind base;
```

Add the wireframe import between `semantic.dark.css` and `@tailwind base`:
```css
@import "./semantic.dark.css";
@import "./semantic.wireframe.css";
@tailwind base;
```

- [ ] **Step 3: Build and verify the CSS output contains wireframe rules**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt && npm run build --workspace=packages/react 2>&1 | tail -5
grep -c 'data-theme="wireframe"' packages/react/dist/styles.css
```

Expected: build succeeds; grep returns `1` (the wireframe block is present).

- [ ] **Step 4: Commit**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt
git add packages/react/src/styles/semantic.wireframe.css packages/react/src/styles/styles.css
git commit -m "$(cat <<'EOF'
feat(react): add wireframe CSS theme — [data-theme="wireframe"] token overrides

Brand-neutral gray/blue palette for rapid prototyping. Feedback tokens
(success/warning/error/info) intentionally omitted — inherit from light mode.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: `sketch:` Tailwind Variant

**Files:**
- Modify: `packages/react/tailwind.config.ts`

- [ ] **Step 1: Read the current tailwind.config.ts**

Read `packages/react/tailwind.config.ts`. Locate the `plugins` array (it exists — `tailwindcss-animate` is already there).

- [ ] **Step 2: Add the `sketch:` variant plugin**

In the `plugins` array, add the new plugin entry. The file imports look like:
```ts
import plugin from 'tailwindcss/plugin'
```
If that import is missing, add it at the top. Then in `plugins`:

```ts
plugins: [
  require('tailwindcss-animate'),
  plugin(function ({ addVariant }) {
    addVariant('sketch', '[data-theme="wireframe"] &')
  }),
],
```

- [ ] **Step 3: Verify the variant is recognized**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt && npm run build --workspace=packages/react 2>&1 | tail -5
```

Expected: build succeeds with no errors. (The variant generates no output unless a class uses it, but the build must not error.)

- [ ] **Step 4: Commit**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt
git add packages/react/tailwind.config.ts
git commit -m "feat(react): add sketch: Tailwind variant for wireframe-specific class overrides"
```

---

## Task 4: DesignSystemProvider + useTheme

**Files:**
- Create: `packages/react/src/components/DesignSystemProvider.tsx`
- Modify: `packages/react/src/index.ts`

- [ ] **Step 1: Create DesignSystemProvider.tsx**

Create `packages/react/src/components/DesignSystemProvider.tsx` with exactly this content:

```tsx
import * as React from "react"

export type Theme = 'light' | 'dark' | 'wireframe'

const VALID_THEMES: Theme[] = ['light', 'dark', 'wireframe']

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

export interface DesignSystemProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

function DesignSystemProvider({
  children,
  defaultTheme = 'light',
}: DesignSystemProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme
    const stored = localStorage.getItem('ds-theme') as Theme | null
    return stored && VALID_THEMES.includes(stored) ? stored : defaultTheme
  })

  React.useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', theme)
    }
    localStorage.setItem('ds-theme', theme)
  }, [theme])

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

DesignSystemProvider.displayName = 'DesignSystemProvider'

function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a DesignSystemProvider')
  }
  return ctx
}

export { DesignSystemProvider, useTheme }
```

- [ ] **Step 2: Add exports to index.ts**

Append to the end of `packages/react/src/index.ts`:

```ts
// Theme provider
export { DesignSystemProvider, useTheme } from './components/DesignSystemProvider';
export type { Theme, DesignSystemProviderProps } from './components/DesignSystemProvider';
```

- [ ] **Step 3: Run TypeScript check**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt/packages/react && npx tsc --noEmit --project tsconfig.json
```

Expected: exits 0. If `React.useState` or `React.useEffect` complain, verify the file starts with `import * as React from "react"` exactly as shown.

- [ ] **Step 4: Commit**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt
git add packages/react/src/components/DesignSystemProvider.tsx packages/react/src/index.ts
git commit -m "$(cat <<'EOF'
feat(react): add DesignSystemProvider and useTheme hook

React context managing light/dark/wireframe theme state. Persists
selection to localStorage. Writes data-theme attribute to <html>.
Removes attribute when theme is 'light' (light is the default/base).

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: ThemeToggle

**Files:**
- Create: `packages/react/src/components/ThemeToggle.tsx`
- Modify: `packages/react/src/index.ts`

- [ ] **Step 1: Create ThemeToggle.tsx**

Create `packages/react/src/components/ThemeToggle.tsx` with exactly this content:

```tsx
import * as React from "react"
import { Sun, Moon, PenLine } from "lucide-react"
import { Button } from "./Button"
import { useTheme } from "./DesignSystemProvider"
import type { Theme } from "./DesignSystemProvider"

const NEXT_THEME: Record<Theme, Theme> = {
  light:     'dark',
  dark:      'wireframe',
  wireframe: 'light',
}

const NEXT_LABEL: Record<Theme, string> = {
  light:     'Switch to dark theme',
  dark:      'Switch to wireframe theme',
  wireframe: 'Switch to light theme',
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(NEXT_THEME[theme])}
      aria-label={NEXT_LABEL[theme]}
    >
      {theme === 'light'     && <Sun className="w-4 h-4" />}
      {theme === 'dark'      && <Moon className="w-4 h-4" />}
      {theme === 'wireframe' && <PenLine className="w-4 h-4" />}
    </Button>
  )
}

ThemeToggle.displayName = 'ThemeToggle'

export { ThemeToggle }
```

- [ ] **Step 2: Add export to index.ts**

Append to the end of `packages/react/src/index.ts` (after the DesignSystemProvider export added in Task 4):

```ts
export { ThemeToggle } from './components/ThemeToggle';
```

- [ ] **Step 3: Run TypeScript check**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt/packages/react && npx tsc --noEmit --project tsconfig.json
```

Expected: exits 0. `PenLine` is in `lucide-react` (verify: `grep -r "PenLine" node_modules/lucide-react/dist/lucide-react.js | head -1` — if not found, use `Pencil` instead which is definitely available).

- [ ] **Step 4: Commit**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt
git add packages/react/src/components/ThemeToggle.tsx packages/react/src/index.ts
git commit -m "feat(react): add ThemeToggle — cycles light → dark → wireframe on click"
```

---

## Task 6: Changesets Setup + CHANGELOG.md

**Files:**
- Create: `.changeset/config.json`
- Modify: root `package.json` (add devDependency + scripts)
- Create: `CHANGELOG.md` (repo root)
- Create: `packages/react/CHANGELOG.md`
- Create: `packages/tokens/CHANGELOG.md`

- [ ] **Step 1: Install @changesets/cli**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt
npm install --save-dev @changesets/cli
```

Expected: `@changesets/cli` added to root `package.json` devDependencies.

- [ ] **Step 2: Initialise changesets**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt
npx changeset init
```

Expected: creates `.changeset/config.json` and `.changeset/README.md`.

- [ ] **Step 3: Update .changeset/config.json**

Read the generated `.changeset/config.json`. Replace its contents with:

```json
{
  "$schema": "https://unpkg.com/@changesets/config/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["apps/docs"]
}
```

- [ ] **Step 4: Add changeset scripts to root package.json**

Read root `package.json`. In the `scripts` block, add:

```json
"changeset": "changeset",
"version-packages": "changeset version"
```

- [ ] **Step 5: Create initial CHANGELOG.md files**

Create `CHANGELOG.md` at repo root:

```markdown
# Changelog

All notable changes to this project are documented in this file.
Per-package changelogs are in `packages/*/CHANGELOG.md`.

## 0.3.0 — 2026-04-09

### Added
- SP3: Wireframe theme (`[data-theme="wireframe"]`), `DesignSystemProvider`, `useTheme`, `ThemeToggle`
- SP3: `sketch:` Tailwind variant for wireframe-specific class overrides
- SP3: Repo layout — components in `src/components/`, styles in `src/styles/`
- Changesets for changelog management

## 0.2.0 — 2026-04-09

### Added
- SP2: Badge — `color`, `variant` (solid/subtle/outline), `size`, `dot` props
- SP2: Button — `colorScheme`, `isLoading`, `loadingText`, `leftIcon`, `rightIcon`; expanded sizes
- SP2: Input — `label`, `helperText`, `errorText`, `size`, `leftAdornment`, `rightAdornment`
- SP2: Textarea — `label`, `helperText`, `errorText`, `size`
- SP2: Card — `elevated`, `glass`; `CardHeader.actions`; `CardFooter.align`; `CardDivider`

## 0.1.0 — 2026-04-09

### Added
- SP1: DTCG token build pipeline (`@ds-foundation/tokens`)
- SP1: Semantic CSS alias layer (`--ds-*` custom properties)
- SP1: Dark mode via `[data-theme="dark"]`
- SP1: Tailwind config with `ds.*` color scale, shadow, easing, and transition tokens
- SP1: 59 React components migrated from bridge classes to `ds.*` Tailwind utilities
```

Create `packages/react/CHANGELOG.md`:

```markdown
# @ds-foundation/react — Changelog

## 0.3.0 — 2026-04-09

### Added
- Wireframe theme CSS (`[data-theme="wireframe"]`)
- `DesignSystemProvider`, `useTheme`, `ThemeToggle`
- `sketch:` Tailwind variant
- Repo layout: `src/components/` and `src/styles/`

## 0.2.0 — 2026-04-09

### Added
- Badge, Button, Input, Textarea, Card API upgrades (see root CHANGELOG)

## 0.1.0 — 2026-04-09

### Added
- Initial release — 59 components with `ds.*` token-based styling
```

Create `packages/tokens/CHANGELOG.md`:

```markdown
# @ds-foundation/tokens — Changelog

## 0.1.0 — 2026-04-09

### Added
- Initial release — DTCG token build outputting `--ds-color-*` CSS custom properties
- Light and dark variable files (`variables.css`, `variables.dark.css`)
```

- [ ] **Step 6: Commit everything**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt
git add .changeset/ CHANGELOG.md packages/react/CHANGELOG.md packages/tokens/CHANGELOG.md package.json package-lock.json
git commit -m "chore: add Changesets + initial CHANGELOG.md files for all packages"
```

---

## Task 7: Validate + Smoke Test

**No file changes — verification only.**

- [ ] **Step 1: Zero hardcoded palette classes in new files**

```bash
grep -rn "bg-blue-\|bg-green-\|bg-orange-\|text-blue-\|text-green-\|#[0-9a-fA-F]\{6\}" \
  packages/react/src/components/DesignSystemProvider.tsx \
  packages/react/src/components/ThemeToggle.tsx
```

Expected: zero matches.

- [ ] **Step 2: TypeScript — zero errors**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt/packages/react && npx tsc --noEmit --project tsconfig.json
```

Expected: exits 0.

- [ ] **Step 3: React package builds**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt && npm run build --workspace=packages/react 2>&1 | tail -10
```

Expected: `dist/index.js`, `dist/index.cjs`, `dist/styles.css` — all produced without errors.

- [ ] **Step 4: Verify wireframe CSS in built output**

```bash
grep -c 'data-theme="wireframe"' packages/react/dist/styles.css
grep 'ds-primary' packages/react/dist/styles.css | grep 'wireframe' | head -3
```

Expected: first grep returns `1`; second grep shows `--ds-primary: #4a7fa5` inside the wireframe block.

- [ ] **Step 5: Docs app builds**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt && npm run build --workspace=apps/docs 2>&1 | tail -20
```

Expected: Next.js build completes without errors.

- [ ] **Step 6: Verify DesignSystemProvider and ThemeToggle are exported**

```bash
grep -n "DesignSystemProvider\|ThemeToggle\|useTheme" packages/react/src/index.ts
```

Expected: three lines — one for each export.

- [ ] **Step 7: Verify sketch: variant is in tailwind config**

```bash
grep -n "sketch\|addVariant" packages/react/tailwind.config.ts
```

Expected: both strings present.
