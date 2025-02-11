import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router';
import type { LinksFunction } from 'react-router';

import { getSession } from '~/utils/session';
import { Header } from '~/components/header';
import type { Route } from './+types/root';

import './tailwind.css';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export async function loader({ request, context }: Route.LoaderArgs) {
  const sessionId = request.headers.get('Cookie')?.match(/sessionId=([^;]+)/)?.[1];
  const session = sessionId ? await getSession(context, sessionId) : null;
  return { isAuthenticated: !!session };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  const isAuthenticated = data?.isAuthenticated ?? false;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header isAuthenticated={isAuthenticated} />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
