import { Input } from "~/components/ui/input"
import { Link } from "react-router"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { MultiSelect } from "~/components/ui/multi-select"
import { Workout } from "~/schemas/models"
import { useEffect, useState } from "react"

interface SearchAndFiltersProps {
  workouts: Workout[]
  onFiltered: (workouts: Workout[]) => void
}

export function SearchAndFilters({
    workouts,
    onFiltered,
}: SearchAndFiltersProps) {

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

  const movementOptions = uniqueMovements.map(movement => ({
    label: movement,
    value: movement,
  }))

  useEffect(() => {
    onFiltered(filteredWorkouts);
  }, [filteredWorkouts, onFiltered]);

  return (
    <div className="flex flex-row w-full gap-4">
        <Input
          type="search"
          placeholder="Search workouts..."
          className="flex font-medium text-sm text-muted-foreground w-full p-2 border-[3px] border-black min-h-12 h-auto items-center justify-between bg-white hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-100 [&_svg]:pointer-events-auto max-w-md focus:border-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex items-center gap-4 w-full">
          <MultiSelect
            options={movementOptions}
            placeholder="Filter by movements"
            onValueChange={setSelectedMovements}
            className="max-w-[455px]"
            maxCount={2}
          />
          
          <Select value={selectedScheme} onValueChange={setSelectedScheme}>
            <SelectTrigger className="rounded-none border-black w-fit whitespace-nowrap min-w-[120px]">
              <SelectValue placeholder="Filter by scheme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" >All schemes</SelectItem>
              {uniqueSchemes.map((scheme) => (
                <SelectItem key={scheme} value={scheme} className="whitespace-nowrap">
                  {scheme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
    </div>
  )
}