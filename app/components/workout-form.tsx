import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-router";
import { workoutSchema, type Workout } from "~/schemas/models";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { useLoaderData } from "react-router";
import { loader } from "~/workouts/create";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "~/components/ui/command";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useState } from "react";

export function WorkoutForm() {
	const { movements } = useLoaderData<typeof loader>();
	const [searchQuery, setSearchQuery] = useState("");
	const form = useForm<Workout>({
		resolver: zodResolver(workoutSchema),
		defaultValues: {
			name: "",
			description: "",
			scheme: undefined,
			movements: [],
			repsPerRound: undefined,
			roundsToScore: undefined,
		},
	});

	const filteredMovements = movements.filter((movement) =>
		movement.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<Form
			method="post"
			className="space-y-6 bg-white p-8 border-4 border-black"
			style={{
				boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)",
			}}
		>
			<h2 className="text-3xl font-bold tracking-tight text-black uppercase">
				Create Workout
			</h2>

			<FormUI {...form}>
				<div className="space-y-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-bold uppercase">
									Workout Name
								</FormLabel>
								<FormControl>
									<Input
										className="mt-1 block w-full px-3 py-2 bg-gray-100 border-2 border-black text-black placeholder:text-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
										{...field}
									/>
								</FormControl>
								<FormMessage className="text-red-600" />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-bold uppercase">
									Description
								</FormLabel>
								<FormControl>
									<Textarea
										className="mt-1 block w-full px-3 py-2 bg-gray-100 border-2 border-black text-black placeholder:text-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
										{...field}
									/>
								</FormControl>
								<FormMessage className="text-red-600" />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="scheme"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-bold uppercase">
									Scoring Scheme
								</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
									required
								>
									<FormControl>
										<SelectTrigger className="mt-1 w-full px-3 py-2 bg-gray-100 border-2 border-black text-black">
											<SelectValue placeholder="Select a scoring scheme" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="time">Time</SelectItem>
										<SelectItem value="time-with-cap">Time with Cap</SelectItem>
										<SelectItem value="pass-fail">Pass/Fail</SelectItem>
										<SelectItem value="rounds-reps">Rounds & Reps</SelectItem>
										<SelectItem value="reps">Reps</SelectItem>
										<SelectItem value="emom">EMOM</SelectItem>
										<SelectItem value="load">Load</SelectItem>
										<SelectItem value="calories">Calories</SelectItem>
										<SelectItem value="meters">Meters</SelectItem>
										<SelectItem value="feet">Feet</SelectItem>
										<SelectItem value="points">Points</SelectItem>
									</SelectContent>
								</Select>
								<input
									type="hidden"
									name="scheme"
									value={field.value || undefined}
								/>
								<FormMessage className="text-red-600" />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="repsPerRound"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-bold uppercase">
										Reps Per Round
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											min="0"
											className="mt-1 block w-full px-3 py-2 bg-gray-100 border-2 border-black text-black placeholder:text-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
											{...field}
											value={field.value ?? ""}
											onChange={(e) => {
												const value = e.target.value
													? parseInt(e.target.value, 10)
													: undefined;
												field.onChange(value);
											}}
										/>
									</FormControl>
									<FormMessage className="text-red-600" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="roundsToScore"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-bold uppercase">
										Rounds to Score
									</FormLabel>
									<FormControl>
                    <Input
											type="number"
											min="0"
											className="mt-1 block w-full px-3 py-2 bg-gray-100 border-2 border-black text-black placeholder:text-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
											{...field}
											value={field.value ?? ""}
											onChange={(e) => {
												const value = e.target.value
													? parseInt(e.target.value, 10)
													: undefined;
												field.onChange(value);
											}}
										/>
									</FormControl>
									<FormMessage className="text-red-600" />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="movements"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel className="text-sm font-bold uppercase">
									Movements
								</FormLabel>
								<FormControl>
									<div className="border-2 border-black rounded-md">
										<div className="p-2">
											<Input
												ref={field.ref}
												placeholder="Search movements..."
												value={searchQuery}
												onChange={(e) => setSearchQuery(e.target.value)}
												className="border-0 focus:ring-0"
											/>
										</div>
										<ScrollArea className="h-72 w-full">
											<div className="p-2">
												{filteredMovements.length === 0 ? (
													<p className="text-sm text-gray-500 p-2">
														No movements found.
													</p>
												) : (
													[...filteredMovements]
														.sort((a, b) => {
															const aSelected = field.value?.includes(a.id);
															const bSelected = field.value?.includes(b.id);
															if (aSelected === bSelected) {
																// If both selected or both unselected, maintain alphabetical order
																return a.name.localeCompare(b.name);
															}
															// Selected items come first
															return aSelected ? -1 : 1;
														})
														.map((movement) => (
															<div
																key={movement.id}
																className={`flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer ${
																	field.value?.includes(movement.id)
																		? "bg-gray-50"
																		: ""
																}`}
																onClick={() => {
																	const isSelected = field.value?.includes(
																		movement.id
																	);
																	const newValue = isSelected
																		? field.value?.filter(
																				(id) => id !== movement.id
																		  )
																		: [...(field.value || []), movement.id];
																	field.onChange(newValue);
																	setSearchQuery("");
																	form.setFocus("movements");
																}}
															>
																<input
																	type="checkbox"
																	checked={field.value?.includes(movement.id)}
																	className="form-checkbox h-4 w-4 text-black border-black focus:ring-black"
																	readOnly
																/>
																<span className="text-sm font-medium">
																	{movement.name}
																</span>
																<span className="text-xs text-gray-500">
																	({movement.type})
																</span>
															</div>
														))
												)}
											</div>
										</ScrollArea>
									</div>
								</FormControl>
								<FormMessage className="text-red-600" />
							</FormItem>
						)}
					/>

					{/* Add hidden inputs for the movements array */}
					{form.watch("movements")?.map((movementId) => (
						<input
							key={movementId}
							type="hidden"
							name="movements"
							value={movementId}
						/>
					))}

					<Button
						type="submit"
						className="w-full bg-black text-white px-4 py-3 uppercase font-bold hover:bg-gray-800 transition-colors"
					>
						Create Workout
					</Button>
				</div>
			</FormUI>
		</Form>
	);
}
