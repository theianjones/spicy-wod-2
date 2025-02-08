import { useNavigate, useRouteLoaderData } from 'react-router';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { TimeLogForm } from '~/components/workouts/log-forms/time-form';
import { requireAuth } from '~/middleware/auth';
import { loader as parentLoader } from '~/routes/workouts/[name]';
import type { Route } from '../workouts/+types/log-result';

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAuth(request, context);
  return null;
}

export const action = async ({ request, context }: Route.ActionArgs) => {
  await requireAuth(request, context);
  return null;
};

export default function LogWorkoutResult() {
  const data = useRouteLoaderData<typeof parentLoader>('routes/workouts/[name]');
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
        {workout.scheme === 'time' && <TimeLogForm workout={workout} />}
      </DialogContent>
    </Dialog>
  );
}
