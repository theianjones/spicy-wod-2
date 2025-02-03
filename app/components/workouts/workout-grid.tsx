import { useState } from "react"
import { Input } from "~/components/ui/input"
import { WorkoutCard } from "./workout-card"
import type { Workout } from "~/schemas/models"

export default function WorkoutsGrid({ workouts }: { workouts: Workout[] }) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredWorkouts = workouts.filter(
    (workout) =>
      workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.movements?.some((movement) => movement.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-center text-4xl font-black uppercase mb-8">SPICY WOD</h1>
          <p className="text-sm uppercase tracking-wide">Browse and discover your next training session</p>
        </div>

        <div className="relative max-w-md mx-auto">
          <Input
            type="search"
            placeholder="Search workouts..."
            className="w-full bg-white border-black rounded-none placeholder:text-black/60 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      </div>
    </div>
  )
}

