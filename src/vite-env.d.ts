/// <reference types="vite/client" />

declare module '*.module.styl' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

interface ImportMetaEnv {
  readonly VITE_SYBILION_API_BASE_URL: string;
  readonly VITE_AUTH_MODE?: 'mock' | 'auth0';
  readonly VITE_AUTH0_DOMAIN?: string;
  readonly VITE_AUTH0_CLIENT_ID?: string;
  readonly VITE_AUTH0_AUDIENCE?: string;
  readonly VITE_AUTH0_CONNECTION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
