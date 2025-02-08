import { destroySession } from '~/utils/session';
import type { Route } from '../authentication/+types/logout';

export async function action({ request, context }: Route.ActionArgs) {
  const sessionId = request.headers.get('Cookie')?.match(/sessionId=([^;]+)/)?.[1];

  if (sessionId) {
    await destroySession(context, sessionId);
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/login',
      'Set-Cookie': 'sessionId=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
}
