// Generated by Wrangler
// After adding bindings to `wrangler.toml`, regenerate this interface via `npm run cf-typegen`
interface Env {
  DB: D1Database;
  USER_SESSIONS: KVNamespace;
}

declare module "@cloudflare/workers-types" {
  export interface PlatformProxy {
    env: Env;
  }
}
