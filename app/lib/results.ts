import { Route } from "../+types/root";
import { allWodResultSchema, } from "~/schemas/models";

export async function getResultsForWodbyUserId(workoutId: string, userId: string, context: Route.LoaderArgs["context"]) {
  const db = context.cloudflare.env.DB;

  const result = await db.prepare(`
    SELECT 
    results.id,
    results.user_id as userId,
    results.type,
    wod_results.workout_id as workoutId,
    results.date,
    results.notes,
    wod_results.scale,
    wod_sets.score,
    wod_sets.set_number as setNumber
    FROM results
    INNER JOIN wod_results ON results.id = wod_results.id
    LEFT JOIN wod_sets ON wod_results.id = wod_sets.result_id
    WHERE results.user_id = ?
        AND wod_results.workout_id = ?
        AND results.type = 'wod'
    ORDER BY results.date desc, wod_sets.set_number;
  `).bind(userId, workoutId).all()

  return result.results.map((result) => allWodResultSchema.parse(result));;
}
