---
"@ds-foundation/react": major
---

Foundation cleanup: remove treasury components, fix all hardcoded values, add 4 new components

- Remove 14 treasury domain components (domain-specific, out of scope for foundation DS)
- Delete ~98 legacy flat-root component files (pre-token drafts, nothing exported them)
- Fix Typography hardcoded px values → DS token CSS vars
- Convert Button to pure CVA — all 4 interaction states (hover/active/focus/disabled) explicit for every variant × colorScheme
- Convert Badge inline styles → Tailwind ds.* classes
- Wire useReducedMotion into Accordion, Carousel, Skeleton
- Remove redundant semantic.dark.css
- Clean up bridge.css hardcoded hex scales
- Add focus ring tokens, interactive state tokens, hifi: Tailwind variant
- Add Sidebar, Kbd, AlertDialog, Menubar components
- Add Vitest + React Testing Library; 39 tests across 8 test files

**Breaking:** `@ds-foundation/react` no longer exports treasury components (MonoAmount, CurrencyBadge, StatusPill, StatusRing, FreshnessChip, UrgencyBadge, BankingWindowDot, DetailCard, IconButton, StateBadge, FormCard, KpiCard, Tag)
