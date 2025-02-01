import { useState } from "react";
import { Form } from "react-router";

interface AuthFormProps {
  mode: "signup" | "login";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full max-w-md mx-auto">
      <Form 
        method="post" 
        className="space-y-6 bg-white p-8 border-4 border-black"
        style={{
          boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)'
        }}
      >
        <h2 className="text-3xl font-bold tracking-tight text-black uppercase">
          {mode === "signup" ? "Sign Up" : "Log In"}
        </h2>

        {error && (
          <div className="bg-red-100 border-2 border-red-700 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-bold uppercase"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border-2 border-black text-black"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-bold uppercase"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border-2 border-black text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white px-4 py-3 uppercase font-bold hover:bg-gray-800 transition-colors"
          >
            {mode === "signup" ? "Create Account" : "Sign In"}
          </button>
        </div>

        <div className="text-center">
          <a 
            href={mode === "signup" ? "/login" : "/signup"}
            className="text-sm underline hover:text-gray-600"
          >
            {mode === "signup" 
              ? "Already have an account? Log in" 
              : "Need an account? Sign up"}
          </a>
        </div>
      </Form>
    </div>
  );
} 