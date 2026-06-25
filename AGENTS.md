---
description: 
alwaysApply: false
---

# Agent guide — Sybilion standalone app (Path 1)

Primary instructions for **coding agents** extending this template. Human-oriented setup stays in [README.md](./README.md).

## Scope and allowed edits

| Area                     | Files                                                                       |
| ------------------------ | --------------------------------------------------------------------------- |
| New workspace screens    | `src/pages/*`                                                               |
| Sidebar labels and links | `src/AppSidebar.tsx`                                                        |
| Path constants           | `src/workspace/workspaceNav.ts`                                             |
| Minimal routes           | `src/App.tsx` — add `<Route>` + imports only; do not refactor auth or shell |

**Out of scope** unless explicitly requested: `src/AppLayout.tsx`, `src/AppProviders.tsx`, `vite.config.ts`, Auth0/sign-in pipelines, `.env` / branding scripts.

## Mandatory page skeleton

Every authenticated route in the main column:

1. **PageHeader** — `title`, optional `subheader`, `breadcrumbs`, optional `actions`
2. **PageContent**
3. One or more **PageContentSection**

Do not put charts, tables, or tools in `AppLayout` header/footer.

Full rules: `@sybilion/uilib` → `src/components/ui/Page/AGENT.md` (or `node_modules/@sybilion/uilib/src/...`).

## Layout catalog

| Primitive               | Role                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| **PageHeader**          | Page title row above body                                                                        |
| **PageContent**         | Body wrapper; `max-width: var(--page-width)`                                                     |
| **PageContentSection**  | Vertical section; owns page-x-padding                                                            |
| **PageColumns**         | Multi-column row; omit `fill` for 2–4 equal columns; `left`/`right` for 2-column main+aside only |
| **PageXScroll**         | Horizontal scroll with page-aligned inset                                                        |
| **PageTabs**            | Tab bar + optional panels; never inside `PageContentSection`                                     |
| **GridLayout**          | Responsive card/tile grid inside a section                                                       |
| **Card** / **Foldable** | Grouped content inside sections                                                                  |
| **SectionHeader**       | In-section `##`-level heading block                                                              |
| **PageEmptyCanvas**     | Empty state with title, hint, optional CTA                                                       |

Import from `@sybilion/uilib`. Types: `dist/esm/types/index.d.ts`.

## Anti-patterns

- **PageTabs** inside **PageContentSection**
- `style={{…}}` for layout/spacing on page structure
- Tailwind (or other) utilities for **structural** layout (flex/grid/padding on shell primitives)
- Nesting **PageHeader** / **AppShell** inside section content
- Second shell around the whole page

## Layout recipes

### Simple page

`PageHeader` → `PageContent` → single `PageContentSection`.

### Tabbed page (unified)

`PageHeader` → `PageContent` → `PageTabs` with each tab `content` wrapping `PageContentSection`.

### Tabbed page (split)

`PageHeader` → `PageTabs` (items with `content: null`) → `PageContent` with panel bodies.

### Columns

Inside one `PageContentSection`:

| Columns        | Recipe                                                           |
| -------------- | ---------------------------------------------------------------- |
| 2 equal        | `PageColumns columns={[a, b]}`                                   |
| 2 main + aside | `PageColumns fill="left"` or `fill="right"` — **2 columns only** |
| 3 equal        | `PageColumns columns={[a, b, c]}`                                |
| 4 equal        | `PageColumns columns={[a, b, c, d]}`                             |

Do not use `left`/`right` for 3–4 columns. Use **GridLayout** for auto-wrapping card/tile grids.

### Horizontal scroll

`PageXScroll` inside a section (or rely on `PageTabs` list scroll).

### Grid dashboard

`PageContentSection` → `GridLayout` → cards/widgets.

## Widget discovery

1. Read the glossary index: `node_modules/@sybilion/uilib/dist/agent-glossary/workspace.index.md` (or monorepo `uilib/dist/agent-glossary/workspace.index.md`).
2. Open the linked `AGENT.md` for the component you need before using it.
3. Browse exports in `dist/esm/types/index.d.ts`.
4. uilib docs samples: `uilib/src/docs/pages/`.

## Styling

- Custom CSS only in co-located `ComponentName.styl` next to the component.
- Use tokens: `var(--page-x-padding)`, `var(--page-width)`, `var(--p-*)`, Stylus `pageXPadding()`.
- Global tokens live in `src/standalone-global.css` (`:root`).

## Workspace glossary

Built profile for full workspace pages: `uilib/dist/agent-glossary/workspace.index.md` (run `yarn build:agent-glossary` in uilib). Content/report profile index: `content.index.md`; embedded LLM bodies: `content.prompt.md`.
