import { redirect } from 'react-router';

import { getSession } from '~/utils/session';
import type { Route } from '../+types/root';

export async function requireAuth(request: Request, context: Route.LoaderArgs['context']) {
  const sessionId = request.headers.get('Cookie')?.match(/sessionId=([^;]+)/)?.[1];

  if (!sessionId) {
    throw redirect('/login');
  }

  const session = await getSession(context, sessionId);

  if (!session) {
    throw redirect('/login');
  }

  return session;
}

export async function redirectIfAuthenticated(
  request: Request,
  context: Route.LoaderArgs['context']
) {
  const sessionId = request.headers.get('Cookie')?.match(/sessionId=([^;]+)/)?.[1];

  if (!sessionId) {
    return;
  }

  const session = await getSession(context, sessionId);

  if (session) {
    throw redirect('/');
  }
}
