import {type PlatformProxy} from 'wrangler'

type GetLoadContextArgs = {
  request: Request
  context: {
    cloudflare: Omit<PlatformProxy<Env>, 'dispose' | 'caches' | 'cf'> & {
      caches: PlatformProxy<Env>['caches'] | CacheStorage
      cf: Request['cf']
    }
  }
}

declare module 'react-router' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface AppLoadContext extends ReturnType<typeof getLoadContext> {}
}

export function getLoadContext({context}: GetLoadContextArgs) {
  return context
}
