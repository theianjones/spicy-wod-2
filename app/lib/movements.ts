import { eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { movementSchema, workoutSchema } from '~/schemas/models';
import * as schema from '../../db/schema';
import type { Route } from '../+types/root';

export async function getAllMovements({ context }: { context: Route.LoaderArgs['context'] }) {
  const db = context.cloudflare.env.DB;
  const result = await db.prepare('SELECT * FROM movements').all();

  const movements = result.results.map(movement => movementSchema.parse(movement));

  return {
    movements,
  };
}

export async function getMovementByIdWithWorkouts({
  context,
  name,
}: {
  context: Route.LoaderArgs['context'];
  name: string;
}) {
  const db = drizzle(context.cloudflare.env.DB, { schema });

  const result = await db
    .select({
      movement: schema.movements,
      workouts: {
        id: schema.workouts.id,
        name: schema.workouts.name,
        description: schema.workouts.description,
        scheme: schema.workouts.scheme,
        roundsToScore: schema.workouts.roundsToScore,
        repsPerRound: schema.workouts.repsPerRound,
        userId: schema.workouts.userId,
      },
    })
    .from(schema.movements)
    .leftJoin(schema.workoutMovements, eq(schema.movements.id, schema.workoutMovements.movementId))
    .leftJoin(schema.workouts, eq(schema.workoutMovements.workoutId, schema.workouts.id))
    .where(eq(sql`LOWER(${schema.movements.name})`, name.toLowerCase()))
    .all();

  const movement = movementSchema.parse(result[0].movement);
  const workouts = workoutSchema
    .array()
    .parse(result.filter(r => r.workouts !== null).map(r => r.workouts));

  return {
    movement,
    workouts,
  };
}
