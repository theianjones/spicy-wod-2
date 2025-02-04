import { useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { Form } from "react-router";
import {
	loginSchema,
	signupSchema,
	type LoginFormData,
	type SignupFormData,
} from "~/schemas/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { ConformInput } from "./ui/conform";

interface AuthFormProps {
	mode: "signup" | "login";
}

export function AuthForm({ mode }: AuthFormProps) {
	const [error, setError] = useState<string | null>(null);
	const [form, fields] = useForm<LoginFormData | SignupFormData>({
		id: mode,
		shouldValidate: "onBlur",
		onValidate: ({ formData }: { formData: FormData }) => 
			parse(formData, { schema: mode === "signup" ? signupSchema : loginSchema }),
	});

	return (
		<div className="w-full max-w-md mx-auto p-4">
			<Form
				method="post"
				className="space-y-6 bg-white p-8 border-4 border-black"
				style={{
					boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)",
				}}
				{...form.props}
			>
				<h1 className="text-3xl font-bold tracking-tight text-black uppercase">
					{mode === "signup" ? "Sign Up" : "Log In"}
				</h1>

				<div className="space-y-4">
					<div>
						<label 
							htmlFor={fields.email.id}
							className="text-sm font-bold uppercase block"
						>
							Email
						</label>
						<ConformInput
							config={fields.email}
							className="mt-1 block w-full"
						/>
						{fields.email.errors && (
							<div className="text-red-600 text-sm mt-1">
								{fields.email.errors}
							</div>
						)}
					</div>

					<div>
						<label 
							htmlFor={fields.password.id}
							className="text-sm font-bold uppercase block"
						>
							Password
						</label>
						<ConformInput
							config={fields.password}
							type="password"
							className="mt-1 block w-full"
						/>
						{fields.password.errors && (
							<div className="text-red-600 text-sm mt-1">
								{fields.password.errors}
							</div>
						)}
					</div>

					<Button
						type="submit"
						className="w-full bg-black text-white px-4 py-3 uppercase font-bold hover:bg-gray-800 transition-colors"
					>
						{mode === "signup" ? "Create Account" : "Sign In"}
					</Button>

					{error && (
						<div className="p-3 text-sm bg-red-100 border-2 border-red-600 text-red-600 rounded">
							{error}
						</div>
					)}
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
