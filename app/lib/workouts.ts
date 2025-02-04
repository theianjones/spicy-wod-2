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
    return workoutSchema.transform((data) => ({
      ...data,
      movements: workout.movement_names ?
        (workout.movement_names as string).split(',').map(movement => movement.trim())
        : []
    })).parse(workout)
  })

  return {
    workouts
  }
}


export async function getWorkoutWithMovementsByIdOrName(idOrName: string, context: Route.LoaderArgs["context"]) {

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
      WHERE w.id = ? OR LOWER(w.name) = LOWER(?)
      GROUP BY w.id
    `).bind(idOrName, idOrName).first()

  return workoutSchema.transform((data) => ({
    ...data,
    movements: result?.movement_names ?
      (result.movement_names as string).split(',').map(movement => movement.trim())
      : []
  })).parse(result)
}
