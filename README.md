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

Before starting local development, make sure you have the following prerequisites:
- Node.js installed
- pnpm installed (`npm install -g pnpm`)
- Wrangler CLI installed (`pnpm install -g wrangler`)

1. Install dependencies:
```sh
pnpm install
```

2. Set up your local database:
```sh
# Create a local D1 database
wrangler d1 create dev-spicy-wod

# Apply database migrations
pnpm db:apply

# Seed the database with initial data
pnpm db:seed
```

For a complete reference of all available D1 database commands, see the [Cloudflare D1 Wrangler Commands documentation](https://developers.cloudflare.com/d1/wrangler-commands/).

3. Create a `.env` file in the root directory with the following variables (replace values with your own):

```sh
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_database_id
CLOUDFLARE_D1_TOKEN=your_d1_token
```

4. Start the development server:
```sh
pnpm dev
```

The application should now be running at `http://localhost:5173`

To run with Wrangler (simulating production environment):
```sh
pnpm build
pnpm start
```

## Database Management with Drizzle Studio

You can use Drizzle Studio to view and manage your database with a visual interface. To start Drizzle Studio:

```sh
# Start Drizzle Studio
pnpm db:studio

# By default, it will be available at https://local.drizzle.studio/
```

This will open a web interface where you can:
- Browse your database tables
- View and edit records
- Run SQL queries
- Monitor database schema