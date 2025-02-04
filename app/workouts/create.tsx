import { redirect } from "react-router";
import { v4 as uuidv4 } from "uuid";
import type { Route } from "../+types/root";
import { WorkoutForm } from "~/components/workout-form";
import { Workout, workoutSchema } from "~/schemas/models";
import { getAllMovements } from "~/lib/movements";
import { extractFormData } from "~/utils/extract-form-data";
import { requireAuth } from "~/middleware/auth";

export async function loader({ request, context }: Route.LoaderArgs) {
	const session = await requireAuth(request, context);
	return getAllMovements({ context });
}

export async function action({ request, context }: Route.ActionArgs) {
	const session = await requireAuth(request, context);
	const db = context.cloudflare.env.DB;
	const formData = await request.formData();
	const workoutId = uuidv4();

	const data = extractFormData(workoutSchema.omit({ id: true }), formData);

	console.log(data)
	try {
		if (data.movements) {
			// verify all movements exist and get their IDs
			const movementQuery = `SELECT id FROM movements WHERE id IN (${data.movements
				.map(() => "?")
				.join(",")})`;

			const { results: existingMovements } = await db
				.prepare(movementQuery)
				.bind(...data.movements)
				.all();

			if (existingMovements.length !== data.movements.length) {
				const foundIds = existingMovements.map((m) => m.id);
				const missingIds = data.movements.filter((id: string) => !foundIds.includes(id));
				throw new Error(`Movements not found: ${missingIds.join(", ")}`);
			}
		}

		// Create workout first
		const workoutQuery = `
			INSERT INTO workouts (
				id, name, description, scheme, 
				reps_per_round, rounds_to_score,
				tiebreak_scheme, secondary_scheme,
				created_at, user_id
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`;

		await db
			.prepare(workoutQuery)
			.bind(
				workoutId,
				data.name,
				data.description,
				data.scheme,
				data.repsPerRound ?? null,
				data.roundsToScore ?? null,
				data.tiebreakScheme ?? null,
				data.secondaryScheme ?? null,
				new Date().toISOString(),
				session.userId
			)
			.run();

		if (data.movements) {
			// Then create workout movements one by one
			for (const movementId of data.movements) {
				const movementLinkQuery = `
					INSERT INTO workout_movements (id, workout_id, movement_id)
					VALUES (?, ?, ?)
				`;

				const linkValues = [uuidv4(), workoutId, movementId];

				await db
					.prepare(movementLinkQuery)
					.bind(...linkValues)
					.run();
			}
		}

		return redirect("/workouts");
	} catch (error) {
		console.error("Error creating workout:", error);
		throw new Response(
			error instanceof Error ? error.message : "Invalid form data",
			{ status: 400 }
		);
	}
}

export default function CreateWorkoutPage() {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h1 className="text-center text-4xl font-black uppercase mb-8">
					Spicy WOD
				</h1>
			</div>

			<div className="sm:mx-auto sm:w-full sm:max-w-xl">
				<WorkoutForm />
			</div>
		</div>
	);
}
