# Sybilion standalone app template

Vite + React SPA using **`@sybilion/uilib`** (layout, theme, Auth0 via `SybilionAuthProvider`) and **`@sybilion/platform-sdk`** (Sybilion API). Use this folder as a starting point, then add product routes and data.

## Instructions for coding agents

**Start here:** [AGENTS.md](./AGENTS.md) — scope, page skeleton, layout catalog, recipes, anti-patterns, and widget discovery.

This README covers human setup (install, env, Vite, theming). Do not duplicate agent layout rules here.

## Quick start

1. Copy the folder to your app location (or work in place) and set `name` in `package.json`.
2. `yarn install` — refreshes `public/logo.svg` and `public/sybilion_bg.svg` from the installed uilib package (`postinstall`).
3. Copy `.env.example` → `.env` and fill Auth0 + API values.
4. `yarn dev` — Vite listens on `PORT` (default **3000** via [`vite-sybilion-standalone-dev.ts`](./vite-sybilion-standalone-dev.ts)).

## Global CSS and fonts

**`src/main.tsx`** imports **`./standalone-global.css`**: CSS variables (`:root` / `.dark`), base `html`/`body` rules, and `@font-face` for Manrope + KMR Apparat via **`src/fonts/`** (woff2 files alongside `fonts.css`). When you copy the template to another repo, keep this tree; tweak tokens in `standalone-global.css` if the product diverges from Sybilion defaults.

## Environment variables

| Variable                     | Purpose                                                                                 |
| ---------------------------- | --------------------------------------------------------------------------------------- |
| `PORT`                       | Dev/preview server port; **3000** matches typical Auth0 localhost URLs.                 |
| `VITE_SYBILION_API_BASE_URL` | Sybilion API origin (no trailing slash). Proxy target in dev; production SDK `baseUrl`. |
| `VITE_AUTH0_DOMAIN`          | Auth0 tenant domain.                                                                    |
| `VITE_AUTH0_CLIENT_ID`       | Auth0 SPA application client id.                                                        |

In **development**, `src/libs/sybilion-sdk.ts` uses `baseUrl: ''` so `/api/...` stays same-origin and Vite proxies `/api` to `VITE_SYBILION_API_BASE_URL`. In **production** builds, the client calls `VITE_SYBILION_API_BASE_URL` directly; the API must allow **CORS** for your deploy origin (unless you terminate API on the same host).

Configure Auth0 **Allowed Callback URLs**, **Allowed Logout URLs**, and **Allowed Web Origins** for `http://localhost:<PORT>` and your deployed origins.

## Vite config

[`vite.config.ts`](./vite.config.ts) spreads **`sybilionStandaloneViteDev({ mode })`** from [`vite-sybilion-standalone-dev.ts`](./vite-sybilion-standalone-dev.ts) and adds:

- **`resolve.dedupe`** — one copy of `react`, `react-dom`, `react-router`, `react-router-dom` (avoids invalid hook call / broken Radix context).
- **`resolve.alias`** — pin `@radix-ui/*` to the app root `node_modules` so Vite does not bundle two Radix trees.

Do not drop these unless you know the dependency tree is already deduped.

## Dependency versions

Align **`react`**, **`react-dom`**, **`react-router-dom`**, **`@auth0/auth0-react`**, and **`vite`** with the versions used by your pinned **`@sybilion/uilib`** (see its `package.json` `peerDependencies` / `devDependencies`). Use Yarn **`resolutions`** for `@types/react*` if needed. Mismatched React majors cause subtle runtime failures.

## Where to extend the app

| Area                      | Files                                                                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Routes                    | `src/App.tsx` — authenticated `<Routes>` inside `AppLayout`; `/sign-in` stays outside the shell.                                                        |
| Global tokens + fonts     | `src/standalone-global.css`, `src/fonts/*` — imported once from `main.tsx`.                                                                             |
| Auth + theme wrappers     | `src/AppProviders.tsx`                                                                                                                                  |
| API client                | `src/libs/sybilion-sdk.ts` — single `createSybilionSDK` instance; `getToken` reads the same key as `sybilionTokenStorageKey` on `SybilionAuthProvider`. |
| New screens               | `src/pages/*` — see [AGENTS.md](./AGENTS.md).                                                                                                           |
| Sidebar + nav constants   | `src/AppSidebar.tsx`, `src/workspace/workspaceNav.ts`                                                                                                   |
| Component `AGENT.md` docs | Co-located in `@sybilion/uilib` — see [AGENTS.md](./AGENTS.md#widget-discovery)                                                                         |

### Theming

`ThemeProvider` (`allowLocalStorage`) wraps the app under `SybilionAuthProvider`. `AppLayout` uses **`useTheme()`** and passes `theme` / `onThemeToggle` into `SybilionAppHeader`.

### Sign-in / branding

`SignInPage` uses `SybilionAuthLayout`. Hero background defaults to **`/sybilion_bg.svg`**; logo uses **`/logo.svg`** (via uilib `Logo` / env). After `yarn install`, both files live under `public/`.

## Further reading

- [AGENTS.md](./AGENTS.md) — coding agent layout and composition rules
- [Auth0 configuration (sybilion-client)](https://github.com/Mir-Insight/sybilion-client/blob/main/docs/auth0-configuration-guide.md)
- [Server auth verification](https://github.com/Mir-Insight/sybilion-client/blob/main/docs/server-auth-verification.md)
- Discover components: `node_modules/@sybilion/uilib/dist/esm/types/index.d.ts` or uilib `src/index.ts`.
