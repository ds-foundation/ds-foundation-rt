## Component Contribution

**Closes:** #<!-- issue number if originated from a designer proposal -->

### What this adds
<!-- One sentence: what component or pattern, and what it's used for -->

### Registry spec
- [ ] MDX spec added to `packages/registry/`
- [ ] All variants defined in the spec
- [ ] ARIA attributes listed in the `accessibility.aria` array
- [ ] No hardcoded hex values — all values use `var(--ds-*)` tokens
- [ ] Tailwind adapter mappings included in `adapters.tailwind`

### Storybook
- [ ] Story added to `apps/storybook/`
- [ ] Light and dark theme both checked in the story
- [ ] All variants shown in the story

### Checklist
- [ ] `npm run validate:registry` passes locally
- [ ] `npm run build` passes locally
- [ ] Changeset added (`npx changeset` — choose `minor` for new components)

### Chromatic preview
<!-- Chromatic will post a link here automatically after CI runs -->

### Design notes
<!-- Anything the design team should know when reviewing — edge cases, constraints, open questions -->
