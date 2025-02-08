import { parseWithZod } from '@conform-to/zod';
import { redirect, useActionData } from 'react-router';
import { z } from 'zod';
import { verifyPassword } from '~/utils/auth';
import { createSession, createSessionCookie } from '~/utils/session';
import { AuthForm } from '~/components/auth-form';
import { redirectIfAuthenticated } from '~/middleware/auth';
import { userSchema } from '~/schemas/models';
import type { Route } from '../authentication/+types/login';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function loader({ request, context }: Route.LoaderArgs) {
  await redirectIfAuthenticated(request, context);
  return null;
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: loginSchema });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const { email, password } = submission.value;
  const db = context.cloudflare.env.DB;

  // Find user
  const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
  const userValidation = userSchema.safeParse(user);

  if (!userValidation.success) {
    return submission.reply({
      formErrors: ['Something went wrong'],
    });
  }

  // Verify password
  const isValid = verifyPassword(
    password,
    userValidation.data.password_salt,
    userValidation.data.hashed_password
  );

  if (!isValid || !userValidation.data.id) {
    return submission.reply({
      formErrors: ['Invalid email or password'],
    });
  }

  // Create session
  const { sessionId } = await createSession(context, userValidation.data.id, email);

  return redirect('/', {
    headers: {
      'Set-Cookie': createSessionCookie(sessionId),
    },
  });
}

export default function LoginPage() {
  const lastResult = useActionData<typeof action>();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8">
      <AuthForm mode="login" lastResult={lastResult} />
    </div>
  );
}
