# Helios component overrides

This app wraps and extends Helios primitives to tweak layout and behavior. Key deviations:

- **AppFrame (`app/components/app-frame*`)**: Minimal wrappers that mirror Helios layout slots but keep the DOM/CSS under our control so we can grid the header/sidebar/main without Helios’ internal container.
- **AppSideNav (`app/components/app-side-nav*`)**: Custom side nav that mirrors Helios’ API but:
  - Supports external `isMinimized`/`onRegister` plumbing (instead of Helios’ internal state).
  - Hides/dims only main content on mobile; scrim is inset to avoid blocking the nav; panel uses explicit z-index.
  - Template-only links/items instead of the Helios toggle, with optional `@model` on links.
- **Styles (`app/styles/app.scss`)**: Sidebar block diverges from Helios—fixed/inset positioning, scrim inset, and z-index adjustments for the panel.

When touching these components, keep in mind they intentionally replace Helios behavior; prefer updating this doc when behavior changes.
