import fs from 'node:fs';
import path from 'node:path';
import type { UserConfig } from 'vite';

const DEFAULT_PORT = 3000;
const SYBILION_API_ENV = 'VITE_SYBILION_API_BASE_URL';

export type SybilionStandaloneViteDevOptions = {
  mode: string;
  /** Directory containing `.env*` files. @default process.cwd() */
  envDir?: string;
  /** Prefix proxied to Sybilion API (SDK `apiPrefix`). @default `/api` */
  apiPrefix?: string;
};

let warnedMissingApiUrl = false;

function parsePort(raw: string | undefined): number {
  if (raw == null || raw === '') return DEFAULT_PORT;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0 || n > 65_535) return DEFAULT_PORT;
  return n;
}

function normalizeApiPrefix(apiPrefix: string): string {
  return apiPrefix.startsWith('/') ? apiPrefix : `/${apiPrefix}`;
}

/**
 * Read a key from `.env*` files only.
 * Vite's loadEnv merges process.env, so a shell that sourced the backend `.env`
 * (PORT=8080, production API URL) can override frontend/.env and break the dev
 * proxy — a previous shell-env-overrides-.env regression shipped HTTP 404 on every /api call.
 */
function readDotenvKey(envDir: string, mode: string, key: string): string | undefined {
  const candidates = [
    path.join(envDir, `.env.${mode}.local`),
    path.join(envDir, `.env.${mode}`),
    path.join(envDir, '.env.local'),
    path.join(envDir, '.env'),
  ];
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq < 1) continue;
      if (trimmed.slice(0, eq) === key) {
        return trimmed.slice(eq + 1).trim();
      }
    }
  }
  return undefined;
}

/**
 * Vite `server` + `preview` fragment for standalone Sybilion SPAs: same-origin `/api` in dev,
 * proxied to `VITE_SYBILION_API_BASE_URL`. Uses `PORT` from frontend `.env` (default `3000`).
 */
export function sybilionStandaloneViteDev(
  options: SybilionStandaloneViteDevOptions,
): Pick<UserConfig, 'server' | 'preview'> {
  const envDir = options.envDir ?? process.cwd();
  const apiPrefix = normalizeApiPrefix(options.apiPrefix ?? '/api');
  const port = parsePort(readDotenvKey(envDir, options.mode, 'PORT'));
  const target = (readDotenvKey(envDir, options.mode, SYBILION_API_ENV) ?? '').replace(
    /\/$/,
    '',
  );

  const proxy: NonNullable<UserConfig['server']>['proxy'] = {};

  if (target) {
    proxy[apiPrefix] = {
      target,
      changeOrigin: true,
      secure: true,
    };
  } else if (options.mode === 'development' && !warnedMissingApiUrl) {
    warnedMissingApiUrl = true;
    console.warn(
      `[@sybilion/uilib] ${SYBILION_API_ENV} is not set in frontend/.env; API dev proxy disabled.`,
    );
  }

  const serverPreview = {
    port,
    proxy,
  };

  return {
    server: serverPreview,
    preview: serverPreview,
  };
}
