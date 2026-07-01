# FRONTEND_AGENTS.md — the one doc build-frontend reads first

This is the single, comprehensive context for assembling a Sybilion demo frontend.
Read this file plus your demo's **§ 3.8 Frontend Assembly Spec** in `app_plan.md`.
Everything you need to compose pages is here: which layer to use for what, exact
imports, prop stubs, and the tested composition recipes. You **execute** the
recipe the intake selected — you do not invent layout.

The five docs that used to be required boot reading
(`uilib-standalone-apps.md`, `shell-contract.json`, `frontend-interaction-patterns.md`,
`AGENT_UI_GLOSSARY.md`, `CONSTITUTION.md` + `25-api-contract.mdc`) are now **deep
reference** — open them only when this file points you there.

---

## 1. The UI layers — uilib-first (use the right one)

`@sybilion/uilib` is the **primary** UI layer. It is a full design system — layout
chrome, every common primitive (`Button`, `Card`, `Table`, `Select`, `Tabs`,
`Dialog`, `Drawer`, `Sheet`, `Chip`, `Progress`, `Skeleton`, `Switch`, `Slider`,
`Tooltip`, `Input`, `Label`, `ChartContainer`), **and** the Sybilion-branded data
widgets. Reach for uilib first. shadcn is reduced to a **single** local file: the
primitives uilib does not ship. Do not pull a shadcn component that has a uilib
equivalent — mixing the two is what made past demos look inconsistent.

| Layer | Package / location | Use for | Import |
|---|---|---|---|
| **Sybilion design system (PRIMARY)** | `@sybilion/uilib` | App layout + page chrome AND all common primitives (buttons, cards, tables, selects, tabs, dialogs, badges, inputs, charts) AND the Sybilion data widgets (forecast charts, maps, dataset nav) | `import { Button, Card, Table } from '@sybilion/uilib'` |
| **shadcn/ui (ONE FILE ONLY)** | `@/components/ui/alert` | `Alert` / `AlertDescription` — the inline error banner uilib does not ship | `import { Alert, AlertDescription } from '@/components/ui/alert'` |
| **Demo compositions** | `@/components/demo/*`, `@/components/charts/*` | Pre-built blocks tuned for Sybilion demos (KPI cards, data tables, forecast chart) — thin uilib-based wrappers | `import { MetricCard } from '@/components/demo/MetricCard'` |
| **Interaction primitives** | `@/components/*`, `@/hooks/*` (shell-shipped) | The audited P-01..P-08 behaviours | `import { AsyncJobCard } from '@/components/AsyncJobCard'` |
| **Utilities** | `@/lib/utils` | `cn()` class merge | `import { cn } from '@/lib/utils'` |

**Layer-split rule (do not cross):**
- **uilib-first.** If a primitive exists in uilib (§ 3.1), use it. The only local `@/components/ui/` file is `alert.tsx` (§ 3.2). For Popover, RadioGroup, ScrollArea, Textarea — use uilib equivalents or install the npm package and import directly (e.g. `import { toast } from 'sonner'`). Do NOT copy additional files into `src/components/ui/`. There is no shadcn `Button`/`Card`/`Table`/`Select`/`Tabs`/`Dialog`/`Chip`/`Input` — those are uilib.
- Layout chrome — `AppLayout`, header menus, sidebar, `ChatSheet`, `PageHeader` / `PageContent` / `PageContentSection` — is **always** `@sybilion/uilib`. Never rebuild it.
- Page-level loading uses the **shell** skeletons (`TableSkeleton` / `ChartSkeleton` / `CardSkeleton`), the audited P-06 primitives — not a bare `Skeleton` at page first paint.
- Charts: use `@/components/charts/ForecastChart` for forecasts; use the Sybilion `@sybilion/uilib` widgets (`ChartAreaInteractive`, `PerformanceChart`, `DriverMap`, ...) when the demo is built around them; for other custom charts wrap Recharts in uilib's `ChartContainer` (§ 4).

---

## 2. Absolute rules

- **Read this file + § 3.8 before writing code.** Do not guess imports or props — they are listed below.
- **Never modify the shell.** The editable set is exactly `AppSidebar.tsx` (nav items), `App.tsx` (routes), `package.json` (add deps), and the page bodies — everything else copied from the template is immutable. The authoritative path-by-path list lives in [`shell-contract.json`](../shell-contract.json) (`editable_paths` / `immutable_paths`, machine) and [`uilib-standalone-apps.md` § 1](../../../docs/uilib-standalone-apps.md) (prose). Do not re-derive it from memory.
- **`AppSidebar.tsx` is navigation-ONLY.** You edit it to add/rename nav `<SidebarMenuItem>` entries — nothing else. **Never** import a custom component, a data hook, `apiClient`, `useEffect`, or any insight/KPI/alert widget into it. uilib's `SidebarContent` is nav chrome: it gives an arbitrary widget no content padding and no contrast (a hand-rolled `bg-card` panel renders borderless and edge-glued against the rail — this is the "side panel looks terrible" bug). Insights, drift/alert callouts, KPIs and any data-driven panel go **on the page** as a `Card` / `MetricCard` in a `PageContentSection`. Enforced deterministically by `audit-build-plan.sh` (`[MISS]` on a custom import or `useEffect`/`apiClient`/`fetch` in `AppSidebar.tsx`).
- **Theme is immutable.** Tokens live in `standalone-global.css` (`oklch`). Use semantic classes (`bg-card`, `text-muted-foreground`, `border`, `text-foreground`) and the chart tokens (`var(--chart-1)` ... `var(--chart-5)`). Never hardcode hex, never swap fonts, never add a second theme.
- **No inline CSS for layout/spacing.** Use Tailwind utility classes. Inline `style` is only acceptable for a dynamic value that cannot be a class (e.g. a computed chart height).
- **Spacing hierarchy within a section.** Use these `gap-N` floors — never mix `gap-*` on the parent with `mt-*`/`mb-*` on individual children (all spacing belongs on the parent):
  - `gap-6` (24 px) — between wide panels or side-by-side charts (compare views)
  - `gap-4` (16 px) — between `Card`s, `MetricCard`s, or content blocks in a grid; this is the **minimum for any sibling card group**
  - `gap-3` (12 px) — compact toolbars and inline control rows (`<div className="flex items-end gap-3">`)
  - `gap-2` (8 px) — icon-to-label or badge-to-text pairs inside a single control
  Between a section heading / `CardTitle` and the content below it, rely on `CardContent` or `PageContentSection` built-in padding — do not insert an extra `<div className="mt-…">` spacer.
- **`#app-modal` portal must be present in `index.html`.** `@sybilion/uilib` `Dialog`, `Sheet`, and `Popover` render into `<div id="app-modal">`. The template ships this div — never remove it. Without it the component mounts silently with no visible output and no console error. Enforced by `assert-template-sanity.sh` check 5. In Vitest, add `document.body.innerHTML += '<div id="app-modal"></div>'` in `test/setup.ts` if uilib Dialog is rendered in tests.
- **Raw `<button>` / `<input>` elements and the CSS reset.** `standalone-global.css` resets `padding:0; border:0` inside `@layer base`. Tailwind utilities (`px-3`, `border`) live in `@layer utilities` and correctly override the reset — so classes work without `!important`. The exception: if you ever see padding or border utilities having no effect on a raw element, the cause is a specificity conflict (e.g. a more-specific selector elsewhere). Prefer `uilib Button` for all interactive controls; use raw `<button>` only for custom-shaped controls (pill toggles, icon-only) and verify visually.
- **Use the padded surfaces — never hand-roll a faux-card.** Any boxed content (a panel, KPI, insight, callout, stat tile) is a uilib `Card`/`CardContent` or a demo `MetricCard` — they ship the correct padding, border, radius and theme-aware contrast. Do **not** paint a card by hand with a raw `<div className="border bg-card p-…">`: hand-rolled padding is inconsistent (text glued to the edge) and `bg-card`/`border` on the wrong surface renders invisibly. A raw `<div>` is only for pure layout (flex/grid wrappers), never as a content container with its own border/background.
- **No `any`.** TypeScript is `strict`. Type `apiClient` responses against `app_plan.md § 3.2` verbatim.
- **Defensive access on backend fields.** Guard every value off `apiClient`: `(x.value ?? 0).toLocaleString()`, `(x.list ?? []).map(...)`, `if (!data || data.length === 0)` as the first line of chart components.
- **Never leak a raw fetch/parse error into the UI.** Every `apiClient` call MUST go through ONE shared `request<T>()` helper (§ 3.6) that checks `res.ok` **before** `res.json()` and throws a clean, typed `Error` with a friendly message. Calling `res.json()` on a non-OK response (a 404/500 HTML page, or the dev-server's `index.html` fallback when a path is wrong) throws `SyntaxError: Unexpected token '<' … is not valid JSON` — and if that raw exception reaches the screen the demo looks broken. The P-07 channel renders a **fixed, human message** (e.g. *"We couldn't load forecasts. Retry."*), **never** the caught `error.message` / exception text. The visual gate (`visual-validate.sh`) now **hard-fails** on a rendered raw error string (`is not valid JSON`, `Cannot read properties of undefined`, `Failed to fetch`, `TypeError:`, `[object Object]`, …), so a leaked exception will block validate — not just look bad.
- **P-07 — error channel.** Errors go **inline** (field) or in a **banner** (`<div role="alert">`, page/session scope) showing a friendly message (see the rule above — never the raw exception). **Never** `toast.error` / `toast.danger` / `toast.warning` — it is forbidden and audited. Sonner `toast()` is allowed for **success / info only** (e.g. `toast.success('Forecast queued.')`).
- **Page structure is always** `PageHeader` -> `PageContent` -> `PageContentSection` (uilib). Never use `AppShell` directly. **`PageContentSection` is the unit of vertical rhythm** — one logical block per section (the controls toolbar is one section; each result/card group is the next). The shell spaces sections for you, so do not stack a heavy control (e.g. a solid `Button`) flush against the next block with a bare `<div>`; keep the controls row inside its own `PageContentSection` and the results in the following one. Group the action button **with** its input (`<div className="flex items-end gap-3">` containing the `Select` + `Button`) so the toolbar reads as one row, not a button floating over the content below.
- **Layout must survive narrow viewports AND wide data** (the #1 source of rendered visual bugs):
  - **Charts in a grid/flex cell need `min-w-0` on the cell.** A `grid`/flex item defaults to `min-width: auto`, so a chart's intrinsic content width pushes the track wider than its share and overflows the page. Any cell holding `ForecastChart` / `ChartContainer` / a Sybilion chart widget (`ChartAreaInteractive`, `PerformanceChart`, ...) MUST be `<div className="min-w-0">…</div>` (or the grid `grid-cols-[minmax(0,1fr)_minmax(0,1fr)]`).
  - **Multi-column grids start single-column.** Use `grid grid-cols-1 gap-N md:grid-cols-2` (or `sm:`), never a bare `grid-cols-2`/`grid-cols-3` that stays multi-column at 390 px.
  - **Tabular data uses the `DataTable` recipe** (§ 3.3) — it ships horizontal-overflow handling. Do not inline a raw uilib `<Table>` in a page; wide tables without an `overflow-x-auto` wrapper push the page past the viewport.
- **Primary view = `src/pages/DashboardPage.tsx`** at `/dashboard`. Replace its body. Never add a route at `/`; never add a sibling sidebar item duplicating "Dashboard" (you may relabel it in `AppSidebar.tsx`).
- **Every replaced `*Page.tsx` opens with the journey JSDoc** (`User Journey (see app_plan § 1.5)` + the `P-NN` IDs it implements) — see § 5.

---

## 3. Component inventory

### 3.1 `@sybilion/uilib` — the primary layer (everything below imports from `@sybilion/uilib`)

Layout + page chrome:

| Component | Use | Notes |
|---|---|---|
| `PageHeader` | Page title row | props: `title`, `subheader`, `breadcrumbs?`, `actions?` |
| `PageContent` / `PageContentSection` | Body wrapper / vertical section | always wrap sections |
| `useTheme` | `{ theme, toggleTheme }` | already wired in the shell |

Common primitives (use these, NOT a shadcn copy):

| Import from `@sybilion/uilib` | Notes / gotchas |
|---|---|
| `Button` | variants per uilib; default `<button>` |
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardAction` | `Card` takes `paddingSize?: 's'\|'m'\|'l'`. `CardContent` auto-scrolls; pass `noScroll` for fixed tiles. `CardTitle` renders via a deferred-overflow tooltip — pass plain string children, size via `className` (see AGENT_UI_GLOSSARY gotchas) |
| `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableHead`, `TableRow`, `TableCell` | `TableCell` is a `<td>` (accepts `colSpan`, `className`) |
| `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` | `value` / `onValueChange` |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | `Tabs variant="button"` for toolbar-style tabs |
| `Dialog`, `Drawer`, `Sheet` (+ their parts) | modals / side panels |
| `Chip` | `variant?: 'neutral'\|'line'\|'active'\|'filled'\|'accent'\|'positive'\|'negative'\|'yellow'`; optional `dot`, `trend`, `squared` |
| `Input` | `size?: 'sm'\|'md'\|'lg'`, `variant?: 'default'\|'clean'`; supports `type="textarea"` for multiline |
| `Label`, `LabeledInput` | form labels |
| `Checkbox`, `Switch`, `Slider`, `Toggle`, `ToggleGroup`, `NumberControl` | inputs / toggles |
| `Progress`, `Skeleton`, `Sparkline`, `Separator`, `Avatar`, `Breadcrumb`, `DropdownMenu`, `Tooltip` | misc |
| `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`, `type ChartConfig` | Recharts wrappers for custom charts (§ 4) |

Sybilion data widgets:

| Component | Use | Notes |
|---|---|---|
| `ChartAreaInteractive` | Interactive forecast chart (overlays: pin / intervals / thresholds) | see AGENT_UI_GLOSSARY.md + vendored AGENT card |
| `PerformanceChart` | Forecast model performance (per-horizon + spaghetti) | host supplies `PerformanceChartPayload` |
| `DriverMap` | World map with driver badges | host supplies `drivers`, `selectedDriver`, `setSelectedDriver` |
| `DriversComparisonChart` | Drivers vs target backtests | needs `BacktestsComponentPayload` |
| `SidebarDatasetsItemsGrouped` | Dataset sidebar nav | groups by `target_type`/`regions`/`categories` |

Deep prop reference + per-widget AGENT cards: [`AGENT_UI_GLOSSARY.md`](AGENT_UI_GLOSSARY.md). 66 canonical usage examples ship in the package at `node_modules/@sybilion/uilib/src/docs/pages/*.tsx` (rewrite their `#uilib/...` imports to `@sybilion/uilib`). Authoritative export list: `grep '^export' node_modules/@sybilion/uilib/dist/esm/types/src/index.d.ts`.

### 3.2 shadcn/ui — `@/components/ui/alert` (ONE FILE ONLY)

The shell ships exactly **one** local shadcn file — `alert.tsx`. Everything else is uilib (§ 3.1). Do **not** copy additional files into `src/components/ui/` — `ls src/components/ui/` must list only `alert.tsx` after your build. For primitives not yet in uilib, install the npm package and import directly; do not hand-roll a local wrapper.

| Import | Components | Why kept |
|---|---|---|
| `@/components/ui/alert` | `Alert`, `AlertTitle`, `AlertDescription` | uilib has no inline alert banner (P-07 error banner) |

**Common gaps — import directly, no local copy:**

| Need | How |
|---|---|
| Toast / success notice | `npm install sonner` → `import { toast } from 'sonner'`; mount `<Toaster />` once in `AppLayout`. P-07: `toast.success`/`toast.info` only — never `toast.error` |
| RadioGroup | uilib `@sybilion/uilib` (check first) or `@radix-ui/react-radio-group` |
| Textarea | uilib `Input` with `type="textarea"` prop or install `@radix-ui/react-textarea` |
| Popover | uilib `Tooltip`, `Dialog`, or `DropdownMenu` — pick the closest fit |
| ScrollArea | native CSS `overflow-y: auto` on a sized container |

### 3.3 Demo compositions — `@/components/demo/*` and `@/components/charts/*`

Thin, typed wrappers built **on uilib primitives** (Card, Table, Chip, Input/Select, ChartContainer). Reuse them as-is — their public props are unchanged; do not fork shadcn equivalents.

| Component | Import | Key props |
|---|---|---|
| `ForecastChart` | `@/components/charts/ForecastChart` | `data: ForecastDataPoint[]`, `todayDate?`, `unit?`, `historicalLabel?`, `forecastLabel?`, `bandLabel?`, `height?` — historical + forecast split on one axis |
| `ForecastQuantileChart` | `@/components/demo/ForecastQuantileChart` | `forecast?: ForecastArtifact`, `loading?`, `error?` — p10/p50/p90 from `GET /api/forecasts/:id`; uses `normalizeForecastArtifact` internally |
| `MetricCard` | `@/components/demo/MetricCard` | `title`, `value`, `unit?`, `delta?`, `trend?: 'up'\|'down'\|'neutral'`, `description?` |
| `DataTable<T>` | `@/components/demo/DataTable` | `columns: Column<T>[]`, `data: T[]`, `keyField: keyof T`, `emptyMessage?`, `onRowClick?` |
| `StatusBadge` | `@/components/demo/StatusBadge` | `status: 'active'\|'pending'\|'error'\|'info'\|'neutral'`, `label?` |
| `FilterBar` | `@/components/demo/FilterBar` | `searchValue?`, `onSearchChange?`, `searchPlaceholder?`, `selects?: { placeholder, options, value?, onChange? }[]` |

`ForecastDataPoint`: `{ date: string; historical?: number; forecast?: number; quantileLow?: number; quantileHigh?: number }`.
`Column<T>`: `{ key: keyof T; header: string; render?: (value, row) => ReactNode; align?: 'left'|'right'|'center' }`.

### 3.4 Interaction patterns P-01..P-08 — the mechanical table (canonical)

You do **not** reinvent these — import the shell primitive and apply the rule.
Apply each pattern wherever `app_plan.md § 3.7` (or § 3.8 per-view) says the demo
uses it. These are the exact mechanics the build audit (`audit-build-plan.sh`)
greps for; the "when/why" rationale is the only thing that lives in the deep-dive.

| Pattern | Trigger in app_plan | Import + what you do |
|---|---|---|
| **P-01 Async Job Card** | A view's "Primary action + feedback" references `(P-01)` (forecasts, exports, batch jobs) | `@/components/AsyncJobCard`. Pass `jobId`, `title`, `submittedAt`, `status`, microcopy overrides. Polling lives in `useForecastPolling` (§ 3.5). NEVER write your own status state machine. |
| **P-02 Master-Detail** | Two routes `/path` and `/path/:id` in § 3.3 | Two pages, two `<Route>`s. Detail uses `useParams<{id:string}>()`. List `onRowClick` -> `navigate(\`/path/${row.id}\`)`. Breadcrumb uses `<Link>` (never `history.back()`). Don't push the full row through router state. |
| **P-03 URL-Synced Filters & Pagination** | View's "URL-synced state" lists keys (e.g. `?zone&status&page`) | `@/hooks/useUrlState`. Read with it, write `setUrl({ key })`. Never `useState` for any filter/sort/page value listed in § 3.3. |
| **P-04 Empty State** | Every list view AND every view with an "Empty state" line | `@/components/EmptyState`. `<EmptyState what why cta={{ label, onClick OR href }} />` when empty OR a fetch 404s. Copy verbatim from § 3.3. ONE primary CTA. Filtered no-results -> CTA is `Clear filters`, clears the P-03 state. |
| **P-05 Optimistic List Insert** | View's "Optimistic behaviour" references `(P-05)` | React 19 `useOptimistic` in the list page. On submit: `startTransition(() => addOptimistic({ id:'tmp-...' }))` -> `await apiClient.submit()` -> `refetch()`. On failure `refetch()` removes the temp row AND surface an inline error (P-07). Add `// INTERACTION: P-05` at file top. |
| **P-06 Skeleton vs Spinner** | View's "Loading strategy" line | `TableSkeleton`/`ChartSkeleton` from `@/components/Skeleton` on first paint. Single-button refresh -> inline spinner inside the button. No loading state for ops < 300 ms. No bare `<Spinner>` at page level in any `*Page.tsx`. |
| **P-07 Error Channel** | View's "Error channel" line | Inline below the field for field errors. Persistent banner above the page for 5xx/network (`role="alert"` — a `<div role="alert">` or shadcn `Alert`; uilib ships no `Banner`). **Never** `toast.error`/`toast.warning`/`toast.danger` (forbidden + audited). Sonner `toast.success()`/`toast.info()` for success/info only. |
| **P-08 Compare** | View named "Compare ..." in § 3.3 | Two mirror panels reading `?left=` / `?right=` (P-03). Skeleton per panel (P-06). Delta region full-width below. Sticky controls bar at top. |

### 3.5 Forecast jobs — polling + rehydration (P-01 internals)

Forecasts run for many minutes; the DB is the source of truth, **not** React state.

- **Polling cadence lives in the frontend.** The backend status route returns
  immediately with `{status, settled, forecast?}`. You build the state machine
  `idle -> pending -> polling -> completed | failed | timeout` with
  `setTimeout(..., 2000)` (>= 2 s). The `timeout` display branch is your mapping
  of a terminal `failed`/`canceled` whose `terminal_reason` is a timeout (the SDK
  `status` enum has no `"timeout"` member). **No app-side wall-clock cap** (no
  `Date.now() - startTime > N`). Never `await` a status call expecting it to block.
- **Hook signature is `useForecastPolling({ jobId })`** — `jobId` is a constructor
  argument, not derived from `useState`. Works the same for a fresh submission
  (id from `POST /api/forecasts`) or a rehydration loop (id from the active-jobs
  lookup).
- **Rehydrate on mount.** Every page that displays/submits forecasts MUST, on first
  mount: (1) call the active-jobs lookup the backend exposes
  (`GET /api/forecasts?status=pending,running` or whatever § 3.2 names);
  (2) instantiate the polling hook for each returned row so the job resumes
  streaming into the same in-progress card (no "new submission" UI on rehydration);
  (3) surface terminal rows in the history view. Vitest MUST mount the page with an
  active-jobs response of two in-flight rows and assert both polling streams start.

### 3.5.1 Quantile charts on completed forecasts (binding)

SDK-backed demos that show **p10/p50/p90 bands** on `/forecasts/:id` or compare views MUST use the shell's immutable wiring — do not reimplement in page files.

| Piece | Path | Rule |
|---|---|---|
| Normalizer | `@/lib/forecastArtifact` → `normalizeForecastArtifact()` | Backend returns `forecast: { months: string[], p10/p50/p90: number[] }`. Never read `.month` / `.value` on `p50[i]` unless you called the normalizer first. |
| Chart | `@/components/demo/ForecastQuantileChart` | Pass `forecast={detail.forecast}` from `GET /api/forecasts/:id`. Host in `<div className="min-w-0">` (chart has `min-height: 360px`). |
| Types | Re-export or mirror `ForecastArtifact` from `forecastArtifact.ts` in `apiClient.ts` | `months?: string[]` and `p10/p50/p90` as `number[] \| ForecastQuantilePoint[]`. |

**Anti-pattern (blank chart):** `p50.map((p) => p.value)` when the API returns numbers — every point is `undefined` and Recharts draws nothing.

**Historical + forecast on one axis:** one `ForecastChart` (§ 3.3), never two side-by-side panels. Import `mapJobToForecastChartData` from `@/lib/forecastChartData` (immutable); pass `todayDate={bridgeDate}`. Backend must return `input.timeseries` on `GET /api/forecasts/:id` (SDK jobs: fetch `input.json`). See [`docs/demo-forecast-charts.md`](../../../docs/demo-forecast-charts.md) § "Bridge row".

| Piece | Path | Rule |
|---|---|---|
| Journey mapper | `@/lib/forecastChartData` → `mapJobToForecastChartData()` | Sole source of `ForecastDataPoint[]` for journey charts — no inline mappers |
| Journey chart | `@/components/charts/ForecastChart` | `data` + `todayDate` from mapper; host in `<div className="min-w-0 overflow-hidden">` |

Full contract: [`docs/demo-forecast-charts.md`](../../../docs/demo-forecast-charts.md). Gate: `bash .cursor/scripts/assert-forecast-chart-wiring.sh`.

### 3.6 apiClient typing — mirror `app_plan.md § 3.2` verbatim

For each endpoint, declare a TS interface with **every** response field listed in
§ 3.2 (JSON name, not the camelCase derivation). Optional fields get `?:`; required
fields don't. Do not invent fields the spec omits; do not elide fields it lists.
Field-by-field triangulation (`app_plan § 3.2` <-> Go `json:` tags <-> this TS
interface <-> Dojo `ExpectBody`) is enforced by Dojo subset match + Layer 3
integration tests in validate.

**One guarded `request<T>()` helper — every call goes through it.** Do NOT scatter
bare `fetch().then(r => r.json())` across pages. The helper checks `res.ok` BEFORE
parsing, so a non-OK HTML response can never reach `JSON.parse` and leak
`Unexpected token '<' … is not valid JSON` into the UI (§ 2 rule). Callers
`try/catch` it and feed a **fixed, friendly** message to the P-07 channel — never
the raw `error.message`.

```ts
// src/lib/apiClient.ts
export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); this.name = 'ApiError'; }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    // Read the body as TEXT (it may be HTML, not JSON) and surface a clean message.
    const detail = await res.text().catch(() => '');
    throw new ApiError(res.status, `Request to ${path} failed (${res.status}).${detail ? ' ' + detail.slice(0, 200) : ''}`);
  }
  // 204 / empty body -> undefined (don't JSON.parse "")
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const apiClient = {
  listForecasts: () => request<ForecastRow[]>('/api/forecasts'),
  // …one method per § 3.2 endpoint, each typed against its § 3.2 interface
};
```

Page usage — catch and show a friendly message, never the exception text:

```ts
try {
  const rows = await apiClient.listForecasts();
  setData(rows);
} catch {
  setError('We couldn\u2019t load forecasts. Please retry.'); // P-07 banner copy, NOT err.message
}
```

---

### 3.7 Agent chat (ChatSheet + live copilot)

The shell ships header copilot wiring — do not rebuild a custom chat drawer unless `app_plan.md` explicitly requires different UX.

| Piece | Location | Role |
|---|---|---|
| `ChatProvider` | `AppProviders.tsx` (immutable) | Supplies `sendChatMessage` + `userSwitchKey` to the tree |
| `templateSendChatMessage` | `src/lib/templateChatSend.ts` (immutable) | POST `{VITE_AGENT_SERVICE_URL}/chat` with Sybilion JWT Bearer token |
| `ChatSheet` | `@sybilion/uilib` | Header chat UI — pass in `PageHeader.actions` |

**Modes** (see `shell-contract.json` `auth`):

- **`VITE_AUTH_MODE=mock`** or no `VITE_AGENT_SERVICE_URL` → local echo stub (`Echo (template): …`).
- **Live copilot** → `VITE_AUTH_MODE=auth0` **and** `VITE_AGENT_SERVICE_URL` set. User must sign in; `templateSendChatMessage` reads the Sybilion JWT from localStorage and POSTs to `{url}/chat`.

When `app_plan.md` declares agent chat, preserve `ChatSheet` in `PageHeader.actions` on views that need copilot (the template stub on `DashboardPage.tsx` shows the pattern). Use the shell's `ChatProvider` + `templateSendChatMessage` — do not wire a separate fetch to the agent service.

---

## 4. Composition recipes (the intake picks one per view)

### Forecast Dashboard
```
PageHeader (title + subheader)
PageContent
  PageContentSection -> grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 -> MetricCard x4 (KPIs)
  PageContentSection -> ForecastChart (data, todayDate, unit, height)
  PageContentSection -> FilterBar (P-03) + DataTable
```
Reference implementation: `src/pages/DashboardPage.tsx`. Async submit -> `AsyncJobCard` (P-01); empty -> `EmptyState` (P-04); first paint -> `ChartSkeleton`/`TableSkeleton` (P-06).

### Risk Monitor
```
PageHeader
PageContent
  PageContentSection -> grid grid-cols-1 gap-4 sm:grid-cols-3 -> MetricCard x3 (risk / VaR / exposure)
  PageContentSection -> Tabs (uilib; Overview | By Region | By Category) -> DataTable + StatusBadge
  PageContentSection -> Alert (@/components/ui/alert; role="alert" for warnings)
```

### Driver Ranking
```
PageHeader
PageContent
  PageContentSection -> DriverMap (uilib; host supplies drivers + selection)
  PageContentSection -> FilterBar (P-03) + DataTable (driver, importance, trend)
```

### Forecast detail (P-02)
```
PageHeader (metadata from GET /api/forecasts/:id)
PageContent
  PageContentSection -> min-w-0 wrapper -> ForecastQuantileChart (forecast prop)
```
Use `ChartSkeleton` while loading. Copy Sybilion job id from `sybilion_job_id`.

### Compare (P-08)
```
PageHeader
PageContent
  PageContentSection -> grid grid-cols-1 gap-6 md:grid-cols-2 -> ForecastQuantileChart x2 (?a= / ?b= via useUrlState)
                        each chart in its own <div className="min-w-0"> so recharts shrinks instead of overflowing
  PageContentSection -> DataTable (metric delta, full width)
```
Skeleton per panel (P-06). The `min-w-0` on each chart cell is mandatory — without it the two charts overflow the page on narrow viewports (see § 2 layout rule).

### uilib primitive recipes (when a demo composition is not enough)

Prefer the demo compositions in § 3.3. When you need a primitive directly, import it from `@sybilion/uilib` — never re-implement it.

```tsx
import { Card, CardHeader, CardContent } from '@sybilion/uilib';

<Card paddingSize="m">
  <CardHeader title="Zone exposure" description="Last 24 months" />
  <CardContent>{/* body */}</CardContent>
</Card>;
```

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sybilion/uilib';

<Select value={zone} onValueChange={setZone}>
  <SelectTrigger className="w-[180px]"><SelectValue placeholder="Zone" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="lisboa">Lisboa</SelectItem>
  </SelectContent>
</Select>;
```

Custom (non-forecast) chart — wrap one Recharts chart in uilib's `ChartContainer`; colours come from the `ChartConfig` (mapped to `--color-<key>` CSS vars), referencing the shell chart tokens (`var(--chart-1)` … `var(--chart-5)`), never hardcoded hex:

```tsx
import { Bar, BarChart, XAxis } from 'recharts';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@sybilion/uilib';

const config = { value: { label: 'Value', color: 'var(--chart-1)' } } satisfies ChartConfig;

<ChartContainer config={config} className="aspect-auto w-full" style={{ height: 240 }}>
  <BarChart data={data}>
    <XAxis dataKey="label" />
    <Bar dataKey="value" fill="var(--color-value)" radius={4} />
    <ChartTooltip content={<ChartTooltipContent />} />
  </BarChart>
</ChartContainer>;
```

---

## 5. Required page JSDoc (every replaced `src/pages/*Page.tsx`)

```tsx
/**
 * User Journey (see app_plan § 1.5):
 *   step 2: pick zone Lisboa -> updates ?zone (P-03)
 *   step 3: click Run forecast -> AsyncJobCard pending->running (P-01)
 *
 * Interaction patterns applied: P-01, P-03, P-04, P-06, P-07
 */
```
The build audit greps every page file for `User Journey` and at least one `P-NN`.

---

## 6. Conventions

- Pages: `<Name>Page.tsx` in `src/pages/`; one component per § 3.3 view; one `<Route>` each in `App.tsx`.
- Demo components: PascalCase in `@/components/demo/`.
- Handlers: `handle<Action>` (e.g. `handleFilterChange`). Data hooks: `use<Resource>`.
- All customer-visible copy is English (en-US), verbatim from `app_plan.md` Part 2 / § 3.8.
- Forecast polling + rehydration: see § 3.5 (binding rationale in `CONSTITUTION.md` + `.cursor/rules/25-api-contract.mdc`).

---

## 7. Deep reference (open only when pointed here)

- Editable/immutable matrix + pinned deps: [`shell-contract.json`](../shell-contract.json), [`uilib-standalone-apps.md`](../../../docs/uilib-standalone-apps.md) § 1.
- Interaction behaviour P-01..P-08: [`frontend-interaction-patterns.md`](../../../docs/frontend-interaction-patterns.md).
- uilib widget props: [`AGENT_UI_GLOSSARY.md`](AGENT_UI_GLOSSARY.md).
- Binding principles (forecast persist/rehydrate, SPA auth modes mock|auth0, API triangulation): [`CONSTITUTION.md`](../../../CONSTITUTION.md) + [`25-api-contract.mdc`](../../../.cursor/rules/25-api-contract.mdc).
