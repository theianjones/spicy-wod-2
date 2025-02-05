import { Link, useLoaderData } from "react-router"
import { getAllWorkoutsWithMovements } from "~/lib/workouts";
import type { Route } from "../+types/root";
import WorkoutGrid from "~/components/workouts/workout-grid";
import { requireAuth } from "~/middleware/auth";

export async function loader({ request, context }: Route.LoaderArgs) {
	const session = await requireAuth(request, context);
	const allWorkouts = await getAllWorkoutsWithMovements({ context });
	return { workouts: allWorkouts.workouts };
}

export default function WorkoutsIndex() {
	const { workouts } = useLoaderData<typeof loader>();

	return (
		<div className="container mx-auto py-8 max-w-7xl">
			<div className="flex flex-col">
				<h1 className="text-4xl font-black uppercase">Your Workouts</h1>
				<WorkoutGrid workouts={workouts} />
			</div>
		</div>
	);
}
