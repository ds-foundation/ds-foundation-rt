# DS Foundation — Design System Contract
Generated: 2026-04-09 | Spec: DTCG 2025.10 | Version: 1.0.0

## You are a design system-aware coding agent.

When generating any UI code, you MUST follow these rules without exception.

## Active Configuration
- Framework: React 18 + Radix UI (headless) + Tailwind CSS v3
- Token format: CSS custom properties — always use `var(--ds-*)` syntax
- Tailwind aliases: `ds.*` utility classes map to `--ds-*` tokens (e.g. `bg-ds-surface`, `text-ds-text`)
- Themes: `light` (default, no attribute) | `dark` (`data-theme="dark"` on `<html>`) | `wireframe` (`data-theme="wireframe"` on `<html>`)
- Build: tsup — all deps bundled except `react`/`react-dom`

## Component Structure

Components live in `packages/react/src/`:

```
components/
  atoms/       Single element or Radix primitive — no DS composition
  molecules/   Composes atoms, moderately complex
  organisms/   Complex, feature-rich, may compose molecules
treasury/      Ripple-specific domain components
```

Import paths follow the layer structure:
- Atoms: `'./components/atoms/MyComponent'`
- Treasury cross-layer: `'../components/atoms/Button'`

## Rules

1. **Never hardcode visual values.** Use only `--ds-*` semantic tokens. Never hex, never arbitrary pixel values that map to a token.

2. **Use semantic tokens, not primitives.** Always reach for `var(--ds-text)`, `var(--ds-primary)`, `var(--ds-border)` — never the raw primitive scale values.

3. **Use Tailwind `ds.*` classes or inline `var(--ds-*)`.** The Tailwind config maps `ds.surface`, `ds.text`, `ds.primary` etc. as utility classes. Use whichever is cleaner for the context — both are valid.

4. **Use Radix primitives for all interactive components.** Buttons, dialogs, dropdowns, tooltips, selects — always wrap the corresponding Radix primitive.

5. **Use `React.forwardRef`.** All components must use `React.forwardRef<HTMLElement, Props>` and spread `...props` onto the root element. Set `ComponentName.displayName`.

6. **Extend the right HTML interface.** Component props should extend `React.HTMLAttributes<HTMLDivElement>` (or the appropriate element) so consumers get full HTML attribute support.

7. **Layer placement matters.**
   - Atom: wraps a single HTML element or Radix primitive. No other DS components.
   - Molecule: composes atoms. No organisms.
   - Organism: complex, may compose molecules and atoms.
   - Treasury: Ripple domain components. May import from any layer.

8. **Place the component in the right directory and export from `packages/react/src/index.ts`.**

## Token Reference

Key semantic tokens (use these — never raw primitives):

| Group | Tokens |
|---|---|
| Surfaces | `--ds-bg`, `--ds-surface`, `--ds-surface-up`, `--ds-sunken` |
| Text | `--ds-text`, `--ds-text-muted`, `--ds-text-disabled`, `--ds-text-inverse` |
| Borders | `--ds-border`, `--ds-border-strong`, `--ds-border-focus` |
| Brand | `--ds-primary`, `--ds-primary-hover`, `--ds-primary-fg`, `--ds-primary-subtle` |
| Feedback | `--ds-feedback-success`, `--ds-feedback-warning`, `--ds-feedback-error`, `--ds-feedback-info` |
| Shadow | `--ds-shadow-xs` … `--ds-shadow-2xl` |

Tailwind equivalents: `bg-ds-surface`, `text-ds-text`, `border-ds-border`, `text-ds-primary`, etc.

The `sketch:` Tailwind variant targets wireframe mode only:
```tsx
<div className="bg-ds-surface sketch:border-dashed sketch:border-2">
```

## Design Principles

Five principles that govern every decision in this system. When in doubt, return to these.

**1. Restraint by default**
Components are neutral at rest. Colour communicates intent, not decoration. Variants and states activate only when they carry meaning.

**2. Token-first, always**
Every visual property — colour, spacing, type, radius, shadow — must come from a `--ds-*` semantic token. Hardcoded values are bugs.

**3. Accessible without configuration**
ARIA attributes, contrast ratios, focus behaviour, and keyboard support are built in. Consuming a component inherits its accessibility — consumers must not need to bolt it on.

**4. Composable, not monolithic**
Components are small and do one thing. A component that handles three concerns is three components that haven't been separated yet.

**5. Three themes, one codebase**
Light, dark, and wireframe are equal first-class themes — not afterthoughts. Token overrides via `data-theme` attribute mean component code never needs to know which theme is active.
