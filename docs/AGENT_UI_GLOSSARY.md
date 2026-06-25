# Agent UI glossary (`@sybilion/uilib`)

Short reference for automation agents composing screens in standalone apps built from this template. **Do not duplicate prop lists here** — use the links under each entry when wiring real code.

> The single comprehensive context is [`FRONTEND_AGENTS.md`](FRONTEND_AGENTS.md) (layer split, full component inventory, composition recipes). This glossary is the deep prop reference for the `@sybilion/uilib` widgets plus the shadcn nuances at the bottom.

For template boundaries (what you may edit), see [README.md](../README.md#instructions-for-coding-agents).

## How to extend this file

Keep each component to: what it does, optional default import line, **one pointer** (uilib docs source page and/or `node_modules/@sybilion/uilib/dist/esm/types/…`). Preserve brevity; add new rows as primitives appear. The upstream per-widget `AGENT.md` cards are vendored below under "Widget AGENT cards" — refresh them when bumping uilib.

---

## Components

### `ChartAreaInteractive`

Interactive chart: **historical** and **forecast** lines, plus **quantile bands** when an overlay is active (`mode` and backing data supplied by the app).

**Overlays** (optional `mode`):

- **`pin`** — draggable marker on the time axis to pick a **month** and align/compare values at that point.
- **`intervals`** — choose **lower and upper forecast quantiles** and show the **uncertainty band** between them.
- **`thresholds`** — set **upper/lower threshold** levels on the forecast (often snapped to discrete values from the series/quantiles) to highlight band-style regions.

Default import:

```ts
import { ChartAreaInteractive, chartConfig } from "@sybilion/uilib";
```

Implementation details live in **`@sybilion/uilib`** (not thin app re-exports). After install, inspect generated types under `node_modules/@sybilion/uilib/dist/esm/types/`. For a working demo mirroring `#uilib/...` internal imports → use `import … from '@sybilion/uilib'` in your app instead, see **`ChartAreaInteractive`** in the Sybilion uilib repo: `src/docs/pages/ChartAreaInteractivePage.tsx` (path inside the `@sybilion/uilib` package source).

### `SidebarDatasetsItemsGrouped`

**Sidebar navigation** for **`SybilionDatasetSnapshot`** rows: expandable **groups** keyed by **`groupBy`** (**`target_type`**, **`regions`**, or **`categories`**). Leaves show dataset titles; selection and clicks are wired in the host (**`SidebarDatasetsItemsGroupedPage`** mirrors the handlers). **`preItems`** / **`postItems`** optional slots for sibling menu chrome.

The package also exports **`groupSidebarDatasets`** if you need the same grouping rules outside this widget.

Default import:

```ts
import {
  SidebarDatasetsItemsGrouped,
  groupSidebarDatasets,
} from "@sybilion/uilib";
```

Example usage in uilib sources: **`src/docs/pages/SidebarDatasetsItemsGroupedPage.tsx`**; see also **`src/docs/pages/StandaloneAppLayoutPage/StandaloneAppLayoutPage.tsx`** (mock **`MOCK_DATASETS`**). In the docs app sidebar, **`SidebarDatasetsItemsGrouped`** lives under the **Widgets** section.

### `DriverMap`

**World map** with **driver badges** positioned by region/coordinates, **world-level drivers** in a bottom strip, **fade transitions**, optional **loading overlay** (`MapBackground` + **`LoadingSpinner`**), and **keyboard navigation** (left/right arrows between on-map drivers when one is selected). Host supplies **`drivers`**, **`isLoading`**, **`selectedDriver`**, and **`setSelectedDriver`** (same selection pattern as the main app’s drivers view).

The package also exports **`MapBackground`**, **`LoadingSpinner`**, **`getCategoryIcon`**, **`getDriverImportance`**, **`getHighestImportanceDriver`**, and the **geography helpers** used to resolve positions (`geographicToSVG`, **`getResponsiveCoordinates`**, etc.) and the **`DriverData`** shape.

Default import:

```ts
import {
  DriverMap,
  type DriverData,
  getHighestImportanceDriver,
} from "@sybilion/uilib";
```

Example usage in uilib sources: **`src/docs/pages/DriverMapPage.tsx`** (docs sidebar: **Widgets** → **DriverMap**). After install, inspect generated types under `node_modules/@sybilion/uilib/dist/esm/types/`.

### `PerformanceChart`

High-level **forecast performance** widget built on **`ChartAreaInteractive`**. Two tabs:

- **Per horizon plot** — 24-month window; **`HorizonsSelector`** picks **`horizon_*`** from **`performanceData`**; lines for **model**, **drift**, optional **custom performance** matrix; footer legend toggles series; **`PerformanceTable`** shows MAE/MAPE and optional adjust-parameters / edit-custom-data actions.
- **Spaghetti plots** — all horizons overlaid (model + drift groups + custom matrix + optional user forecast series).

**Host supplies (not inside widget):** analysis selection, API fetch, **`performanceData`** (**`PerformanceChartPayload`**), **`historicalData`**, optional **`forecastData`**, **`customPerformanceMatrix`**, loading/empty hints (**`runAnalysisHint`**, **`statusHint`**). See **`PerformanceChartPage`** for mock wiring.

Default import:

```ts
import {
  PerformanceChart,
  type PerformanceChartPayload,
  type PerformanceViewTab,
} from "@sybilion/uilib";
```

Example usage in uilib sources: **`src/docs/pages/PerformanceChartPage.tsx`** (docs sidebar: **Widgets** → **PerformanceChart**); deeper notes: **`src/components/widgets/PerformanceChart/AGENT.md`**. After install, inspect generated types under `node_modules/@sybilion/uilib/dist/esm/types/…/PerformanceChart`.

### `DriversComparisonChart`

**Drivers vs target** backtests chart: normalized target + driver series from **`BacktestsComponentPayload`** (**`@sybilion/platform-sdk`**), optional **`datasetHistorical`** overlay, **`ChartAreaInteractive`** with brush time range, **table below chart** — row click toggles series visibility (first N drivers visible by default).

**Host supplies:** fetch **`BacktestsComponentPayload`** per selected analysis, **`datasetHistorical`**, analysis selector UI above the widget (e.g. **`AnalysesSelector`** — see **`sybilion-client`** **`DriversComparisonTab`**), **`seriesInitKey`** when analysis changes, loading/error hints.

Default import:

```ts
import { DriversComparisonChart } from "@sybilion/uilib";
import type { BacktestsComponentPayload } from "@sybilion/platform-sdk";
```

Example usage in uilib sources: **`src/docs/pages/DriversComparisonChartPage.tsx`** (docs sidebar: **Widgets** → **DriversComparisonChart**); deeper notes: **`src/components/widgets/DriversComparisonChart/AGENT.md`**. After install, inspect generated types under `node_modules/@sybilion/uilib/dist/esm/types/…/DriversComparisonChart`.

---

## Widget AGENT cards (vendored from the uilib repo)

These are the upstream LLM-prompt cards for the data widgets, copied verbatim from the **private** `Sybilion-AI/uilib` repo (they are **not** shipped in the npm package, so they cannot be read from `node_modules`). Source: `src/components/{ui,widgets}/<Name>/AGENT.md` on `main`, vendored against the uilib version pinned in [`shell-contract.json`](../shell-contract.json) (`uilib_version`). **Refresh these when bumping `@sybilion/uilib`** — `gh api repos/Sybilion-AI/uilib/git/trees/main?recursive=1 --jq '.tree[].path | select(test("AGENT"))'` lists them. The authoring contract (≤18 lines/card; Renders / Use when / Not when / Host provides / Report tile / Requires / Empty-loading) is the first card below.

### Authoring contract (`src/components/widgets/AGENT.md`)

Each card ≤18 lines, signal-only. **Include:** Renders (1 sentence); Use when / Not when; Host provides (3–5 bullets); Report tile (one line or "Not used"); Requires (prop names + role); Empty/loading (one line). **Do not include:** import examples; type/doc/demo/glossary links; page-shell boilerplate; related-components lists unless choosing between exports; implementation/styling/keyboard notes unless binding-relevant; secrets, env vars, API URLs.

### `ChartAreaInteractive` (`src/components/ui/ChartAreaInteractive/AGENT.md`)

- **Renders:** time-series chart with historical line, forecast lines, optional pin / quantile-band / threshold overlays.
- **Use when:** custom forecast UI with overlays or full chart control. **Not when:** packaged performance or drivers-comparison views (use `PerformanceChart` or `DriversComparisonChart`).
- **Host provides:** `chartData`, `forecastData` built from API; `timeRange` / `onTimeRangeChange` or brush-only range; optional `mode` (pin | intervals | thresholds) + overlay state; analysis selector and fetch outside widget.
- **Report tile:** `dataset_card` — host loads dataset + analysis; chart inside dashboard card.
- **Requires:** `chartData`; `forecastData`; `loading`; `toggleLegendSeries` / `ensureAnalysisSeriesVisible` when legend is external.
- **Empty/loading:** `loading`, `error`; empty data shows chart empty state via host message props.

### `PerformanceChart` (`src/components/widgets/PerformanceChart/AGENT.md`)

- **Renders:** forecast performance on `ChartAreaInteractive` — per-horizon tab (24m window, MAE/MAPE table) and spaghetti tab (all horizons overlaid).
- **Use when:** dataset performance tab with horizon selector and error metrics. **Not when:** simple forecast card or driver backtests — use `ChartAreaInteractive` or `DriversComparisonChart`.
- **Host provides:** `performanceData` (`PerformanceChartPayload`) and `historicalData` from performance API; analysis selection and fetch outside widget; optional `forecastData`, `customPerformanceMatrix`, `userSeries` for spaghetti.
- **Report tile:** `performance_chart` — host loads performance payload + dataset series; built-in analysis selector.
- **Requires:** `performanceData` (model/drift forecasts + metrics); `historicalData` (baseline series); `loading` / `chartLoading` / `performanceDataLoading` (spinners); `runAnalysisHint` / `statusHint` (empty states).
- **Empty/loading:** loading props show shimmer/spinner; null `performanceData` with `runAnalysisHint` prompts to run analysis.

### `DriversComparisonChart` (`src/components/widgets/DriversComparisonChart/AGENT.md`)

- **Renders:** target vs drivers backtests chart with `ChartAreaInteractive` plus table; row click toggles series visibility.
- **Use when:** drivers comparison tab with normalized target and driver series from backtests payload. **Not when:** geographic map or performance horizons — use `DriverMap` or `PerformanceChart`.
- **Host provides:** `payload` (`BacktestsComponentPayload` from platform SDK, host fetch per analysis); optional `datasetHistorical` overlay; `seriesInitKey` when selected analysis changes; `viewTab` / `onViewTabChange` (`lagged` calendar-aligned, or `overlapped` driver series shifted backward by parsed lag months).
- **View tabs:** host renders uilib `Tabs variant="button"` with **Lagged** / **Overlapped** in the toolbar (analysis selector left, tabs right). Chart applies `applyDriversComparisonViewToPayload` internally.
- **Report tile:** `drivers_comparison_chart` — host loads normalized backtests payload + dataset historical; built-in analysis selector.
- **Requires:** `payload` (target + driver `normalized_series`); `loading` / `chartLoading` (spinners); `seriesInitKey` (reset visible series on analysis or view-tab change); `runAnalysisHint` / `statusHint` (empty/error text).
- **Lag column:** **Lagged** shows API `lag` string (may be a range); **Overlapped** shows single `N month(s)` from `parseLagMonthsFromLabel` (range uses max month). **Historical window:** lead-in anchored to the lagged (unshifted) view; switching tabs does not change historical extent when floor is pinned.
- **Empty/loading:** loading props shimmer chart; null `payload` with `runAnalysisHint` prompts to run analysis.

### `DriverMap` (`src/components/widgets/DriverMap/AGENT.md`)

- **Renders:** world map with regional driver badges, bottom strip for world-level drivers, selection highlight.
- **Use when:** geographic driver exploration for one analysis. **Not when:** driver detail metrics card alone (pair with `DriverCard`) or normalized series chart (use `DriversComparisonChart`).
- **Host provides:** `drivers` as `DriverData[]` from analysis API; controlled `selectedDriver` + `setSelectedDriver`; `isLoading` while fetching.
- **Report tile:** `drivers_map` — tile resolves analysis id, fetches drivers, passes list + selection (EmbeddedAnalysisSelector pattern).
- **Requires:** `drivers`; `isLoading`; `selectedDriver`; `setSelectedDriver`.
- **Empty/loading:** `isLoading` shows overlay; empty `drivers` leaves map without badges.

### `SidebarDatasetsItemsGrouped` (`src/components/widgets/SidebarDatasetsItemsGrouped/AGENT.md`)

- **Renders:** expandable sidebar groups of datasets (by target type, regions, or categories).
- **Use when:** app shell needs grouped dataset navigation. **Not when:** in-page or report content (no sidebar slot).
- **Host provides:** `datasets` list (`SidebarDatasetsItemsGroupedDataset`); `groupBy`, `selectedDatasetId`, `onDatasetClick`; optional `preItems` / `postItems`, `defaultExpandedGroupNames`.
- **Report tile:** Not used in report tiles.
- **Requires:** `datasets`; `groupBy`; `onDatasetClick` for navigation.
- **Empty/loading:** empty `datasets` renders no groups; loading handled by host before pass-in.

---

## uilib component gotchas (compile traps)

These `@sybilion/uilib` components compile but reject the props an agent usually assumes (the shadcn-style API). Use the corrected shapes. The list of components that are **absent** from uilib (and their shadcn replacements) is the machine list in [`shell-contract.json`](../shell-contract.json) (`missing_in_uilib`) — this section only covers the ones that exist but behave unexpectedly.

| Component | Real variants / API | Common mis-use |
|---|---|---|
| `Badge` | `variant?: 'default' \| 'outline' \| 'red' \| 'yellow' \| 'green'` | Do **not** use `'destructive'` / `'secondary'`. Map `High` risk → `'red'`, `Medium` → `'yellow'`, `Low` → `'green'`. |
| `CardTitle` | Extends `TextWithDeferTooltipProps` = `Omit<ComponentProps<'div'>, 'style'>` — so it **does** accept string `children` and renders them through a deferred-overflow tooltip. The only quirk: the native `style` prop is omitted. | Pass plain string children (`<CardTitle>Zone exposure</CardTitle>`); set sizing via `className`, not `style`. For a non-tooltip heading, a plain `<h3 className="…">` is also fine. |
| `SybilionAppHeader` | Accepts `user: { name; email; avatar } \| null`. | Renders an empty avatar slot when `user.avatar === ''` — the template default (`FAKE_USER.picture === ''`). Provide a fallback by overriding `FAKE_USER` (template change). |

> `SignInPage` / `SybilionSignInPanel` / `SybilionAuthLayout` exist in uilib but the template does not use them — auth is mocked (see [`uilib-standalone-apps.md` § 6](../../../docs/uilib-standalone-apps.md)). When unsure whether a name exists, `grep '^export.*<Name>' node_modules/@sybilion/uilib/dist/esm/types/index.d.ts` — the typed surface is authoritative.

---

## shadcn/ui — one local file only

uilib is the primary layer; the shell keeps exactly **one** local shadcn file — `src/components/ui/alert.tsx` (see [`FRONTEND_AGENTS.md`](FRONTEND_AGENTS.md) § 3.2 and [`shell-contract.json`](../shell-contract.json) `kept_components`). There is no shadcn `Form`/`Button`/`Card`/`Input`/`Chart`/`Sonner` — those are uilib or direct npm imports. Do not copy additional files into `src/components/ui/`.

### Forms

There is no shadcn `Form` wrapper. Build forms with `react-hook-form` (`+ @hookform/resolvers` + `zod`, all shipped) driving uilib `Input` + `Label`:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Label } from '@sybilion/uilib';

const schema = z.object({ zone: z.string().min(1, 'Pick a zone.') });

function ForecastForm() {
  const { register, handleSubmit, formState: { errors } } =
    useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { zone: '' } });
  return (
    <form onSubmit={handleSubmit((values) => console.log(values))}>
      <Label htmlFor="zone">Zone</Label>
      <Input id="zone" {...register('zone')} />
      {errors.zone ? <p role="alert" className="text-sm text-red-600">{errors.zone.message}</p> : null}
      <Button type="submit">Run forecast</Button>
    </form>
  );
}
```

Field errors render inline (P-07) — never as toasts.

### Sonner — success / info toasts only (P-07)

There is no local `@/components/ui/sonner.tsx` wrapper. Import directly from the package:

```tsx
import { Toaster } from 'sonner';
import { toast } from 'sonner';

// Mount <Toaster /> once in AppLayout or a top-level page.
// Call toast() anywhere.
toast.success('Forecast queued.');
toast.info('Drivers refreshed.');
// NEVER toast.error / toast.warning / toast.danger — P-07 forbids error toasts.
// Errors go inline (field) or in a <div role="alert"> banner (page/session) — use @/components/ui/alert for the banner.
```

If `sonner` is not in `package.json`, run `npm install sonner` and add it as a dependency.

### Custom charts

`ChartContainer` / `ChartTooltip` / `ChartConfig` now come from **`@sybilion/uilib`** (not a shadcn `@/components/ui/chart`). For forecasts use `@/components/charts/ForecastChart`; for other custom charts see the `ChartContainer` recipe in [`FRONTEND_AGENTS.md`](FRONTEND_AGENTS.md) § 4. The shell defines `--chart-1` … `--chart-5` (oklch, light + dark) in `standalone-global.css`.
