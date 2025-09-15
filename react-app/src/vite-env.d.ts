/// <reference types="vite/client" />

// CSS Modules type declarations
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Vite environment variables
interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly VITE_APP_TITLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Global type augmentations for testing
declare global {
  const __DEV__: boolean;
  const __PROD__: boolean;
}