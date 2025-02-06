import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const SESSION_DURATION = 24 * 60 * 60; // 24 hours in seconds

export const sessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  email: z.string().email(),
  createdAt: z.number(),
  expiresAt: z.number(),
});

export type Session = z.infer<typeof sessionSchema>;

export async function createSession(
  context: { cloudflare: { env: { USER_SESSIONS: KVNamespace } } },
  userId: string,
  email: string
): Promise<{ sessionId: string; session: Session }> {
  const sessionId = uuidv4();
  const now = Math.floor(Date.now() / 1000);

  const session: Session = {
    id: sessionId,
    userId,
    email,
    createdAt: now,
    expiresAt: now + SESSION_DURATION,
  };

  await context.cloudflare.env.USER_SESSIONS.put(sessionId, JSON.stringify(session), {
    expirationTtl: SESSION_DURATION,
  });

  return { sessionId, session };
}

export async function getSession(
  context: { cloudflare: { env: { USER_SESSIONS: KVNamespace } } },
  sessionId: string
): Promise<Session | null> {
  const sessionData = await context.cloudflare.env.USER_SESSIONS.get(sessionId);

  if (!sessionData) {
    return null;
  }

  try {
    const session = sessionSchema.parse(JSON.parse(sessionData));
    const now = Math.floor(Date.now() / 1000);

    if (session.expiresAt < now) {
      await destroySession(context, sessionId);
      return null;
    }

    return session;
  } catch (error) {
    return null;
  }
}

export async function destroySession(
  context: { cloudflare: { env: { USER_SESSIONS: KVNamespace } } },
  sessionId: string
): Promise<void> {
  await context.cloudflare.env.USER_SESSIONS.delete(sessionId);
}

export async function requireSession(
  request: Request,
  context: { cloudflare: { env: { USER_SESSIONS: KVNamespace } } }
): Promise<Session> {
  const sessionId = request.headers.get('Cookie')?.match(/sessionId=([^;]+)/)?.[1];

  if (!sessionId) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const session = await getSession(context, sessionId);

  if (!session) {
    throw new Response('Unauthorized', { status: 401 });
  }

  return session;
}

export function createSessionCookie(sessionId: string): string {
  return `sessionId=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DURATION}`;
}
