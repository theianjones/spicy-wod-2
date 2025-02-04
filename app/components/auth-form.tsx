import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-router";
import {
	loginSchema,
	signupSchema,
	type LoginFormData,
	type SignupFormData,
} from "~/schemas/auth";
import { Button } from "~/components/ui/button";
import {
	Form as FormUI,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useState } from "react";

interface AuthFormProps {
	mode: "signup" | "login";
}

export function AuthForm({ mode }: AuthFormProps) {
	const [error, setError] = useState<string | null>(null);
	const form = useForm<LoginFormData | SignupFormData>({
		resolver: zodResolver(mode === "signup" ? signupSchema : loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(data: LoginFormData | SignupFormData) {
		setError(null);

		const formData = new FormData();
		formData.append("email", data.email);
		formData.append("password", data.password);

		console.log("form.formState.errors", form.formState.errors);

		try {
			const response = await fetch(`/${mode}`, {
				method: "POST",
				body: formData,
			});

			if (response.status === 400) {
				setError("User already exists");
				return;
			}

			if (!response.ok) {
				setError("Something went wrong. Please try again.");
				return;
			}

      
			// Redirect will be handled by the response
		} catch (err) {
			setError("An unexpected error occurred");
		}
	}

	return (
		<div className="w-full max-w-md mx-auto p-4">
			<Form
				method="post"
				className="space-y-6 bg-white p-8 border-4 border-black"
				style={{
					boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)",
				}}
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<h1 className="text-3xl font-bold tracking-tight text-black uppercase">
					{mode === "signup" ? "Sign Up" : "Log In"}
				</h1>

				<FormUI {...form}>
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-bold uppercase">
										Email
									</FormLabel>
									<FormControl>
										<Input
											type="email"
											className="mt-1 block w-full px-3 py-2 bg-gray-100 border-2 border-black text-black placeholder:text-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
											{...field}
											{...form.register("email", {
												required: "Email is required",
												pattern: {
													value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
													message: "Please enter a valid email address",
												},
												validate: {
													notEmpty: (value) =>
														value.trim() !== "" || "Email cannot be empty",
													validFormat: (value) => {
														// Check for basic email format
														const hasAtSymbol = value.includes("@");
														const hasDomain = value
															.split("@")[1]
															?.includes(".");
														if (!hasAtSymbol) return "Email must contain @";
														if (!hasDomain)
															return "Email must contain a valid domain";
														return true;
													},
												},
											})}
										/>
									</FormControl>
									<FormMessage className="text-red-600" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-bold uppercase">
										Password
									</FormLabel>
									<FormControl>
										<Input
											type="password"
											className="mt-1 block w-full px-3 py-2 bg-gray-100 border-2 border-black text-black placeholder:text-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
											{...field}
											{...form.register("password", {
												required: "Password is required",
												minLength: {
													value: 8,
													message:
														"Password must be at least 8 characters long",
												},
											})}
										/>
									</FormControl>
									<FormMessage className="text-red-600" />
								</FormItem>
							)}
						/>

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
				</FormUI>

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
