import { Link, useLoaderData } from 'react-router';

import WorkoutGrid from '~/components/workouts/workout-grid';
import { getAllMovements } from '~/lib/movements';
import { getAllWorkoutsWithMovements, workoutFiltersSchema } from '~/lib/workouts';
import { requireAuth } from '~/middleware/auth';
import type { Route } from '../+types/root';

export async function loader({ request, context }: Route.LoaderArgs) {
  const session = await requireAuth(request, context);
  const url = new URL(request.url);

  const filters = workoutFiltersSchema.parse({
    name: url.searchParams.get('name'),
    scheme: url.searchParams.get('scheme'),
    movements: url.searchParams.getAll('movements'),
  });

  const allWorkouts = await getAllWorkoutsWithMovements({ context, filters });
  const movements = await getAllMovements({ context });
  return { workouts: allWorkouts.workouts, movements: movements.movements };
}

export default function WorkoutsIndex() {
  const { workouts, movements } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex flex-col">
        <h1 className="text-4xl font-black uppercase">Your Workouts</h1>
        <WorkoutGrid workouts={workouts} movements={movements} />
      </div>
    </div>
  );
}
