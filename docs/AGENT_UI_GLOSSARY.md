# Agent UI glossary (`@sybilion/uilib`)

Short reference for automation agents composing screens in standalone apps built from this template. **Do not duplicate prop lists here** — use the links under each entry when wiring real code.

For template boundaries (what you may edit), see [README.md](../README.md#instructions-for-coding-agents).

## How to extend this file

Keep each component to: what it does, optional default import line, **one pointer** (uilib docs source page and/or `node_modules/@sybilion/uilib/dist/esm/types/…`). Preserve brevity; add new rows as primitives appear.

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
