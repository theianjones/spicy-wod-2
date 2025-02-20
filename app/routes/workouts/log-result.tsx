import { parseWithZod } from '@conform-to/zod';
import { redirect, useActionData, useNavigate, useRouteLoaderData } from 'react-router';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { resultsSchema, TimeLogForm } from '~/components/workouts/log-forms/time-form';
import { requireAuth } from '~/middleware/auth';
import { loader as parentLoader } from '~/routes/workouts/[name]';
import type { Route } from '../workouts/+types/log-result';
import { getWorkoutWithMovementsByIdOrName } from '~/lib/workouts';
import { v4 as uuidv4 } from 'uuid';


export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAuth(request, context);
  return null;
}

export const action = async ({ request, context }: Route.ActionArgs) => {
  const session = await requireAuth(request, context);
  const db = context.cloudflare.env.DB;


  const formData = await request.formData();
  const workoutId = formData.get('workoutId') as string;
  const workout = await getWorkoutWithMovementsByIdOrName(workoutId, context);


  const scores = JSON.parse(formData.get('scores') as string)
  formData.set('scores', JSON.stringify(scores));

  console.log({formData})

  const submission = parseWithZod(formData, { schema: resultsSchema(workout.roundsToScore ?? 1) });

  console.log({submission})

  if (submission.status !== 'success') return submission.reply();

  const data = submission.value;

  const resultId = uuidv4();

  console.log({data, scores: Object.values(scores)})

  try {
    // Insert base result
    await db.prepare(`
      INSERT INTO results (id, user_id, date, type, notes)
      VALUES (?, ?, CURRENT_TIMESTAMP, 'wod', ?)
    `).bind(resultId, session.userId, data?.notes ?? null).run();

    // Insert WOD result
    await db.prepare(`
      INSERT INTO wod_results (id, workout_id, scale)
      VALUES (?, ?, ?)
    `).bind(resultId, workoutId, data.scale).run();

    // Insert scores as sets
    const arrayOfScores = Object.values(scores);
    for (let i = 0; i < arrayOfScores.length; i++) {
      await db.prepare(`
        INSERT INTO wod_sets (id, result_id, score, set_number)
        VALUES (?, ?, ?, ?)
      `).bind(uuidv4(), resultId, arrayOfScores[i], i + 1).run();
    }

    return redirect(`/workouts/${workout.name.toLowerCase()}`);
  } catch (error) {
    console.error('Error logging result:', error);
    return submission.reply({ formErrors: ['Internal server error'] });
  }
};

export default function LogWorkoutResult() {
  const data = useRouteLoaderData<typeof parentLoader>('routes/workouts/[name]');
  const lastResult = useActionData<typeof action>();
  const navigate = useNavigate();

  if (!data) {
    return navigate('..');
  }

  const { workout } = data;

  return (
    <Dialog open onOpenChange={() => navigate('..')}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Workout Result</DialogTitle>
        </DialogHeader>
        {workout.scheme === 'time' && <TimeLogForm workout={workout} lastResult={lastResult} />}
      </DialogContent>
    </Dialog>
  );
}
