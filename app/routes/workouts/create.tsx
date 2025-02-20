import { parseWithZod } from '@conform-to/zod';
import { redirect, useActionData } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { WorkoutForm } from '~/components/workout-form';
import { getAllMovements } from '~/lib/movements';
import { requireAuth } from '~/middleware/auth';
import { workoutSchema } from '~/schemas/models';
import type { Route } from '../workouts/+types/create';

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAuth(request, context);
  return getAllMovements({ context });
}

export async function action({ request, context }: Route.ActionArgs) {
  const session = await requireAuth(request, context);
  const db = context.cloudflare.env.DB;
  const formData = await request.formData();
  const workoutId = uuidv4();

  const submission = await parseWithZod(formData, {
    schema: workoutSchema.omit({ id: true }),
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const data = submission.value;

  try {
    // First verify the user exists
    const userExists = await db
      .prepare('SELECT id FROM users WHERE id = ?')
      .bind(session.userId)
      .first();

    if (!userExists) {
      throw new Error('User not found');
    }

    // Create workout with transaction to ensure data consistency
    await db.batch([
      db
        .prepare(
          `
        INSERT INTO workouts (
          id, name, description, scheme, time_cap,
          reps_per_round, rounds_to_score,
          tiebreak_scheme, secondary_scheme,
          created_at, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
      `
        )
        .bind(
          workoutId,
          data.name,
          data.description,
          data.scheme,
          data.timeCap ?? null,
          data.repsPerRound ?? null,
          data.roundsToScore ?? null,
          data.tiebreakScheme ?? null,
          data.secondaryScheme ?? null,
          session.userId
        ),

      ...(data.movements?.map(movementId =>
        db
          .prepare(
            `
          INSERT INTO workout_movements (id, workout_id, movement_id)
          VALUES (?, ?, ?)
        `
          )
          .bind(uuidv4(), workoutId, movementId)
      ) ?? []),
    ]);

    return redirect('/workouts');
  } catch (error) {
    console.error('Error creating workout:', error);
    // Return more specific error message
    return submission.reply({
      formErrors: [
        error instanceof Error
          ? error.message
          : 'Internal server error - Foreign key constraint failed',
      ],
    });
  }
}

export default function CreateWorkoutPage() {
  const lastResult = useActionData<typeof action>();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <WorkoutForm lastResult={lastResult} />
      </div>
    </div>
  );
}
