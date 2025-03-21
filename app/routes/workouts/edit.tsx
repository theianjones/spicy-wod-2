import { parseWithZod } from '@conform-to/zod';
import { redirect, useActionData, useLoaderData } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { WorkoutForm } from '~/components/workout-form';
import { getAllMovements } from '~/lib/movements';
import { getWorkoutWithMovementsByIdOrName } from '~/lib/workouts';
import { requireAuth } from '~/middleware/auth';
import { workoutSchema } from '~/schemas/models';
import type { Route } from '../workouts/+types/edit';

export async function loader({ params, request, context }: Route.LoaderArgs) {
  await requireAuth(request, context);
  const { id } = params;
  if (!id) {
    throw new Response('Workout ID is required', { status: 400 });
  }
  const workout = await getWorkoutWithMovementsByIdOrName(id, context);
  if (!workout) {
    throw new Response('Workout not found', { status: 404 });
  }
  const { movements } = await getAllMovements({ context });
  return { workout, movements };
}

export async function action({ request, context, params }: Route.ActionArgs) {
  const session = await requireAuth(request, context);
  const db = context.cloudflare.env.DB;
  const formData = await request.formData();
  const { id } = params;
  if (!id) {
    throw new Response('Workout ID is required', { status: 400 });
  }

  const submission = await parseWithZod(formData, {
    schema: workoutSchema.omit({ id: true }),
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const data = submission.value;

  try {
    if (data.movements) {
      // verify all movements exist and get their IDs
      const movementQuery = `SELECT id FROM movements WHERE id IN (${data.movements
        .map(() => '?')
        .join(',')})`;

      const { results: existingMovements } = await db
        .prepare(movementQuery)
        .bind(...data.movements)
        .all();

      if (existingMovements.length !== data.movements.length) {
        const foundIds = existingMovements.map(m => m.id);
        const missingIds = data.movements.filter((id: string) => !foundIds.includes(id));
        throw new Error(`Movements not found: ${missingIds.join(', ')}`);
      }
    }

    // Update workout first
    const workoutQuery = `
      UPDATE workouts 
      SET name = ?, description = ?, scheme = ?, 
          reps_per_round = ?, rounds_to_score = ?,
          tiebreak_scheme = ?, secondary_scheme = ?
      WHERE id = ?
    `;

    await db
      .prepare(workoutQuery)
      .bind(
        data.name,
        data.description,
        data.scheme,
        data.repsPerRound ?? null,
        data.roundsToScore ?? null,
        data.tiebreakScheme ?? null,
        data.secondaryScheme ?? null,
        id
      )
      .run();

    // Delete existing workout movements
    await db.prepare('DELETE FROM workout_movements WHERE workout_id = ?').bind(id).run();

    // Create new workout movements
    if (data.movements) {
      for (const movementId of data.movements) {
        const movementLinkQuery = `
          INSERT INTO workout_movements (id, workout_id, movement_id)
          VALUES (?, ?, ?)
        `;

        const linkValues = [uuidv4(), id, movementId];

        await db
          .prepare(movementLinkQuery)
          .bind(...linkValues)
          .run();
      }
    }

    return redirect(`/workouts/${id}`);
  } catch (error) {
    console.error('Error updating workout:', error);
    return submission.reply({ formErrors: ['Internal server error'] });
  }
}

export default function EditWorkoutPage() {
  const { workout, movements } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <WorkoutForm lastResult={lastResult} initialData={workout} mode="edit" />
      </div>
    </div>
  );
}
