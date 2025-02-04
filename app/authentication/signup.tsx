import { redirect } from "react-router";
import type { Route } from "../+types/root";
import { AuthForm } from "~/components/auth-form";
import { generateSalt, hashPassword, validatePassword } from "~/utils/auth";
import { v4 as uuidv4 } from "uuid";
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

  // Validate password
  const passwordError = validatePassword(password);
  if (passwordError) {
    throw new Response(passwordError, { status: 400 });
  }

  // Check if user already exists
  const existingUser = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
  if (existingUser) {
    throw new Response("User already exists", { status: 400 });
  }

  // Create new user
  const userId = uuidv4();
  const salt = generateSalt();
  const hash = hashPassword(password, salt);

  await db.prepare(`
    INSERT INTO users (id, email, hashed_password, password_salt, joined_at) 
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    userId,
    email,
    hash,
    salt,
    new Date().toISOString()
  ).run();

  // Create session
  const { sessionId } = await createSession(context, userId, email);
  
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

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-black uppercase mb-8">
          Spicy WOD
        </h1>
      </div>

      <AuthForm mode="signup" />
    </div>
  );
}