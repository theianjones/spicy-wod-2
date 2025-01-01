# Welcome to React Router + Cloudflare Workers!

- 📖 [React Router docs](https://reactrouter.com/en/main)
- 📖 [React Router Cloudflare docs](https://reactrouter.com/en/main/guides/vite#cloudflare)

## Development

Run the dev server:

```sh
pnpm dev
```

To run Wrangler:

```sh
pnpm build
pnpm start
```

## Typegen

Generate types for your Cloudflare bindings in `wrangler.toml`:

```sh
pnpm run typegen
```

You will need to rerun typegen whenever you make changes to `wrangler.toml`.

## Deployment

If you don't already have an account, then [create a cloudflare account here](https://dash.cloudflare.com/sign-up) and after verifying your email address with Cloudflare, go to your dashboard and set up your free custom Cloudflare Workers subdomain.

Once that's done, you should be able to deploy your app:

```sh
pnpm run deploy
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.

## Project Notes

This project has been upgraded from Remix v2 to React Router v7 following the [official migration guide](https://reactrouter.com/dev/upgrading/remix). Package management is handled using pnpm instead of npm.

## Local Development

Run the following commands to set up the database:

```sh
pnpm db:migrate
pnpm db:seed
```
