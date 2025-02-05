import { useState } from "react";
import { Input } from "~/components/ui/input";
import { WorkoutCard } from "./workout-card";
import type { Workout } from "~/schemas/models";
import { Link } from "react-router";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { MultiSelect } from "~/components/ui/multi-select";
import { SearchAndFilters } from "./search-and-filters";

export default function WorkoutsGrid({ workouts }: { workouts: Workout[] }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedScheme, setSelectedScheme] = useState<string>("all");
	const [selectedMovements, setSelectedMovements] = useState<string[]>([]);

	const uniqueSchemes = Array.from(new Set(workouts.map((w) => w.scheme)));
	const uniqueMovements = Array.from(
		new Set(workouts.flatMap((w) => w.movements ?? []))
	).sort();


	const filteredWorkouts = workouts.filter((workout) => {
		const matchesSearch =
			workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			workout.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			workout.movements?.some((movement) =>
				movement?.toLowerCase().includes(searchQuery.toLowerCase())
			);

		const matchesScheme =
			selectedScheme === "all" || workout.scheme === selectedScheme;
		const matchesMovements =
			selectedMovements.length === 0 ||
			selectedMovements.every((movement) =>
				workout.movements?.includes(movement)
			);

		return matchesSearch && matchesScheme && matchesMovements;
	});

	return (
		<div className="min-h-screen bg-white text-black">
			<div className="max-w-7xl mx-auto space-y-8">
				<div className="relative mt-8 space-y-4">
					<div className="flex items-center justify-between gap-4">
            <SearchAndFilters
              searchQuery={searchQuery}
              selectedScheme={selectedScheme}
              selectedMovements={selectedMovements}
              uniqueSchemes={uniqueSchemes}
              uniqueMovements={uniqueMovements}
              onSearchChange={setSearchQuery}
              onSchemeChange={setSelectedScheme}
              onMovementsChange={setSelectedMovements}
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
					{filteredWorkouts.map((workout) => (
						<WorkoutCard key={workout.id} workout={workout} />
					))}
				</div>
			</div>
		</div>
	);
}
