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
		<div className="container mx-auto py-6">
			<div className="flex flex-col space-y-6">
				<div className="flex items-center justify-between">
					<h1 className="text-center text-4xl font-black uppercase">Your Workouts</h1>
					<Link
						to="/workouts/create"
						className="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
					>
						Create Workout
					</Link>
				</div>

				<WorkoutGrid workouts={workouts} />
			</div>
		</div>
	);
}
