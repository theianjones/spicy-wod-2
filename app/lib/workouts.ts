import { workoutSchema } from "~/schemas/models";
import type { Route } from "../+types/root";

export async function getAllWorkoutsWithMovements({ context }: { context: Route.LoaderArgs["context"] }) {
  const db = context.cloudflare.env.DB
  const result = await db.prepare(`
    SELECT 
      w.*,
      GROUP_CONCAT(m.id) as movement_ids,
      GROUP_CONCAT(m.name) as movement_names,
      GROUP_CONCAT(m.type) as movement_types
    FROM workouts w
    LEFT JOIN workout_movements wm ON w.id = wm.workout_id
    LEFT JOIN movements m ON wm.movement_id = m.id
    GROUP BY w.id
  `).all()



  const workouts = result.results.map((workout) => {
    console.log("workout in getAllWorkouts map", workout)
    const movementNames = workout.movement_names as string
    const movements = movementNames.split(",").map((movement: string) => movement.trim())
    const parsedWorkout = workoutSchema.parse({...workout, movements})
    return parsedWorkout
  })

  console.log("workouts in getAllWorkouts", workouts)

  return {
    workouts
  }
}