import { WorkoutCard } from "./workout-card";
import type { Movement, Workout } from "~/schemas/models";
import { Link } from "react-router";
import { SearchAndFilters } from "./search-and-filters";

export default function WorkoutsGrid({ workouts, movements }: { workouts: Workout[], movements: Movement[] }) {

	return (
		<div className="min-h-screen bg-white text-black">
			<div className="max-w-7xl mx-auto space-y-8">
				<div className="relative mt-8 space-y-4">
					<div className="flex items-center justify-between gap-4">
            <SearchAndFilters
                movements={movements}
            />

						<Link
							to="/workouts/create"
							className="min-h-12 inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 whitespace-nowrap"
						>
							Create Workout
						</Link>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{workouts.map((workout) => (
						<WorkoutCard key={workout.id} workout={workout} />
					))}
				</div>
			</div>
		</div>
	);
}
