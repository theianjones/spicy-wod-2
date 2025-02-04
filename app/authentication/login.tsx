import { redirect } from "react-router";
import type { Route } from "../authentication/+types/login";
import { AuthForm } from "~/components/auth-form";
import { verifyPassword } from "~/utils/auth";
import { userSchema } from "~/schemas/models";
import { createSession, createSessionCookie } from "~/utils/session";
import { redirectIfAuthenticated } from "~/middleware/auth";

export async function loader({ request, context }: Route.LoaderArgs) {
  await redirectIfAuthenticated(request, context);
  return null;
}

export async function action({ request, context }: Route.ActionArgs) {
  const db = context.cloudflare.env.DB;
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Find user
  const user = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
  const userValidation = userSchema.safeParse(user);

  if (!userValidation.success) {
    throw new Response("Invalid email or password", { status: 401 });
  }

  // Verify password
  const isValid = verifyPassword(password, userValidation.data.password_salt, userValidation.data.hashed_password);

  if (!isValid) {
    throw new Response("Invalid email or password", { status: 401 });
  }

  // Create session
  const { sessionId } = await createSession(context, userValidation.data.id, email);
  
  // Create response with session cookie
  const response = new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": createSessionCookie(sessionId),
    },
  });

  return response;
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-black uppercase mb-8">
          Spicy WOD
        </h1>
      </div>

      <AuthForm mode="login" />
    </div>
  );
} 