import { useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { Form } from "react-router";
import { workoutSchema, type Workout } from "~/schemas/models";
import { Button } from "~/components/ui/button";
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
import { MultiSelect } from "~/components/ui/multi-select";
import { ConformSelect, ConformTextarea, ConformInput, ConformMultiSelect } from "./ui/conform";

export function WorkoutForm() {
	const { movements } = useLoaderData<typeof loader>();
	const [form, fields] = useForm<Workout>({
		id: "workout",
		shouldValidate: "onSubmit",
		onValidate: ({ formData }: { formData: FormData }) => 
			parse(formData, { schema: workoutSchema })
	});

	const defaultValue = fields.movements.defaultValue;
	const selectedMovements = typeof defaultValue === 'string'
		? defaultValue.split(',')
		: (defaultValue || []);

	const movementOptions = movements.map(movement => ({
		value: movement.id,
		label: movement.name
	}));

	const handleMovementsChange = (values: string[]) => {
		const input = document.createElement('input');
		input.type = 'hidden';
		input.name = fields.movements.name;
		input.value = values.join(',');
		form.ref.current?.appendChild(input);
		form.ref.current?.requestSubmit();
	};

	console.log(fields.movements)
	return (
		<form
			method="post"
			className="space-y-6 bg-white p-8 border-4 border-black"
		>
			<h2 className="text-3xl font-bold tracking-tight text-black uppercase">
				Create Workout
			</h2>

			<div className="space-y-4">
				<div>
					<label
						htmlFor={fields.name.id}
						className="text-sm font-bold uppercase block"
					>
						Workout Name
					</label>
					<ConformInput	
						config={fields.name}
						className="mt-1 block w-full"
					/>
					{fields.name.errors && (
						<div className="text-red-600 text-sm mt-1">
							{fields.name.errors}
						</div>
					)}
				</div>

				<div>
					<label
						htmlFor={fields.description.id}
						className="text-sm font-bold uppercase block"
					>
						Description
					</label>
					<ConformTextarea
						config={fields.description}
						className="mt-1 block w-full"
					/>
					{fields.description.errors && (
						<div className="text-red-600 text-sm mt-1">
							{fields.description.errors}
						</div>
					)}
				</div>

				<div>
					<label
						htmlFor={fields.scheme.id}
						className="text-sm font-bold uppercase block"
					>
						Scoring Scheme
					</label>
					<ConformSelect
						config={fields.scheme}
						options={[
							{ value: 'time', label: 'Time' },
							{ value: 'time-with-cap', label: 'Time with Cap' },
							{ value: 'pass-fail', label: 'Pass/Fail' },
							{ value: 'rounds-reps', label: 'Rounds & Reps' },
							{ value: 'reps', label: 'Reps' },
							{ value: 'emom', label: 'EMOM' },
							{ value: 'load', label: 'Load' },
							{ value: 'calories', label: 'Calories' },
							{ value: 'points', label: 'Points' },
							{ value: 'meters', label: 'Meters' },
							{ value: 'feet', label: 'Feet' },
						]}
						placeholder="Select a scoring scheme"
						className="mt-1 block w-full"
					/>
					{fields.scheme.errors && (
						<div className="text-red-600 text-sm mt-1">
							{fields.scheme.errors}
						</div>
					)}
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<label
							htmlFor={fields.repsPerRound.id}
							className="text-sm font-bold uppercase block"
						>
							Reps Per Round
						</label>
						<ConformInput
							config={fields.repsPerRound}
							className="mt-1 block w-full"
						/>
						{fields.repsPerRound.errors && (
							<div className="text-red-600 text-sm mt-1">
								{fields.repsPerRound.errors}
							</div>
						)}
					</div>

					<div>
						<label
							htmlFor={fields.roundsToScore.id}
							className="text-sm font-bold uppercase block"
						>
							Rounds to Score
						</label>
						<ConformInput
							config={fields.roundsToScore}
							className="mt-1 block w-full"
						/>
						{fields.roundsToScore.errors && (
							<div className="text-red-600 text-sm mt-1">
								{fields.roundsToScore.errors}
							</div>
						)}
					</div>
				</div>

				<div>
					<label
						htmlFor={fields.movements.id}
						className="text-sm font-bold uppercase block"
					>
						Movements
					</label>
					<ConformMultiSelect
						config={fields.movements}
						options={movementOptions}
						defaultValue={selectedMovements}
						placeholder="Select movements..."
						className="mt-1"
					/>
					{fields.movements.errors && (
						<div className="text-red-600 text-sm mt-1">
							{fields.movements.errors}
						</div>
					)}
				</div>

				<Button
					type="submit"
					className="w-full bg-black text-white px-4 py-3 uppercase font-bold hover:bg-gray-800 transition-colors"
				>
					Create Workout
				</Button>
			</div>
		</form>
	);
}
