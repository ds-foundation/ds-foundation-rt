# Design Principles

Five principles that govern every decision in DS Foundation. When a component decision is unclear, return to these.

---

## 1. Restraint by default

Components are neutral at rest. Colour communicates intent, not decoration.

A button that changes colour on hover is telling the user it is interactive. A card that glows on hover is just noise. Every visual treatment should carry meaning — if you cannot name the meaning, remove the treatment.

**In practice:**
- Default state is always the quietest state
- Hover, focus, and active states add just enough signal to communicate what is happening
- Animation is used for orientation (where did the panel go?) not decoration (look at this transition)
- Density is a feature: use space to separate things that need separating, not to fill emptiness

---

## 2. Token-first, always

Every visual property — colour, spacing, type scale, radius, shadow — comes from a `--ds-*` semantic token. There are no exceptions. Hardcoded values are bugs.

This is not a preference. A hardcoded hex value breaks the moment a theme changes. A token value responds automatically to light, dark, and wireframe themes with zero component-level code.

**In practice:**
- `color: var(--ds-text)` ✓ — `color: #1a1a1a` ✗
- `background: var(--ds-surface)` ✓ — `background: #ffffff` ✗
- `border-color: var(--ds-border)` ✓ — `border-color: rgba(0,0,0,0.12)` ✗
- If a value you need doesn't have a token, add one to the token layer — don't hardcode

---

## 3. Accessible without configuration

ARIA attributes, colour contrast, focus behaviour, and keyboard support are built into every component. Consuming a component means inheriting its accessibility — consumers must not need to add ARIA to make it work.

Accessibility cannot be an afterthought. A component that fails WCAG AA is not done.

**In practice:**
- Every interactive component ships with correct role, aria-label patterns, and keyboard navigation
- Focus indicators are always visible — never `outline: none` without an equivalent
- Colour contrast meets WCAG AA in all three themes
- Screen reader text is included where visual affordances are ambiguous

---

## 4. Composable, not monolithic

Components are small and do one thing. Complex UI is built by combining components, not by making one component handle every case.

A component that handles three concerns is three components that haven't been separated yet. If a component's props list is growing to accommodate edge cases, that is a signal to split it.

**In practice:**
- Atoms wrap a single element or Radix primitive — no DS composition inside
- Molecules combine atoms to solve a specific UX pattern
- Organisms are complex, self-contained sections — not general-purpose utilities
- Treasury components are domain-specific; they compose freely from any layer

---

## 5. Three themes, one codebase

Light, dark, and wireframe are equal first-class themes. No theme is an afterthought, no theme is an override. Component code never checks which theme is active — the token layer does all the work.

Wireframe mode is a brand-neutral palette for prototyping and customer research. It removes Ripple branding to let product decisions stand on their own merit before visual design adds emphasis.

**In practice:**
- All three themes pass WCAG AA contrast before a component ships
- Component code contains no `if (theme === 'dark')` logic — ever
- `data-theme` attribute on `<html>` is the only mechanism that changes theme
- The `sketch:` Tailwind variant is the only wireframe-specific escape hatch

---

## Applied together

These principles form a system, not a checklist. A component can be token-first, accessible, and composable — and still violate restraint by adding visual noise. Check all five before marking work done.

When they conflict, the order of priority is:

1. **Accessible** — a component that fails accessibility is not shippable
2. **Token-first** — a component that hardcodes values breaks all themes
3. **Restraint** — a component that is visually noisy erodes trust
4. **Composable** — a monolithic component is technical debt, not a blocker
5. **Three themes** — theme gaps can be patched; the others cannot
