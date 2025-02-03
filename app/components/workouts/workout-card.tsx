import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Clock, Dumbbell, Activity } from "lucide-react"
import type { Workout } from "~/schemas/models"

interface WorkoutCardProps {
  workout: Workout
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const getSchemeIcon = (scheme: string) => {
    switch (scheme) {
      case "time":
      case "time-with-cap":
        return <Clock className="w-4 h-4" />
      case "load":
        return <Dumbbell className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  return (
    <div className="relative h-full">
      {/* Shadow effect */}
      <div className="absolute inset-0 bg-black translate-x-2 translate-y-2" />

      {/* Card */}
      <Card className="relative bg-white text-black border border-black h-full flex flex-col justify-between">
        <CardHeader className="space-y-4 p-6">
          <div className="space-y-1">
            <div className="uppercase text-xs font-bold tracking-wide">WORKOUT NAME</div>
            <CardTitle className="text-xl font-bold">{workout.name}</CardTitle>
          </div>

          <div className="space-y-1">
            <div className="uppercase text-xs font-bold tracking-wide">DESCRIPTION</div>
            <CardDescription className="text-sm text-black">{workout.description}</CardDescription>
          </div>

          <div className="space-y-1">
            <div className="uppercase text-xs font-bold tracking-wide">SCORING SCHEME</div>
            <Badge variant="outline" className="rounded-sm bg-white text-black border-black">
              {getSchemeIcon(workout.scheme)}
              <span className="ml-1 uppercase text-xs">{workout.scheme}</span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="border-t border-black p-6 space-y-4">
          {(workout.roundsToScore || workout.repsPerRound) && (
            <div className="grid grid-cols-2 gap-4">
              {workout.repsPerRound && (
                <div className="space-y-1">
                  <div className="uppercase text-xs font-bold tracking-wide">REPS PER ROUND</div>
                  <div className="text-sm">{workout.repsPerRound}</div>
                </div>
              )}
              {workout.roundsToScore && (
                <div className="space-y-1">
                  <div className="uppercase text-xs font-bold tracking-wide">ROUNDS TO SCORE</div>
                  <div className="text-sm">{workout.roundsToScore}</div>
                </div>
              )}
            </div>
          )}

          {workout.movements && workout.movements.length > 0 && (
            <div className="space-y-1">
              <div className="uppercase text-xs font-bold tracking-wide">MOVEMENTS</div>
              <div className="flex flex-wrap gap-2">
                {workout.movements.map((movement) => (
                  <Badge
                    key={movement}
                    variant="secondary"
                    className="rounded-sm bg-gray-100 text-black border-none text-xs"
                  >
                    {movement}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

