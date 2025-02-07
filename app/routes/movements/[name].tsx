import { useLoaderData } from 'react-router';
import { z } from 'zod';
import { WorkoutCard } from '~/components/workouts/workout-card';
import { getMovementByIdWithWorkouts } from '~/lib/movements';
import { requireAuth } from '~/middleware/auth';
import type { Route } from '../../+types/root';

const loaderParamsSchema = z.object({
  name: z.string(),
});

export async function loader({ params, context, request }: Route.LoaderArgs) {
  await requireAuth(request, context);
  const { name } = loaderParamsSchema.parse(params);
  const { movement, workouts } = await getMovementByIdWithWorkouts({ context, name });

  return { movement, workouts };
}

export default function MovementPage() {
  const { movement, workouts } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">{movement.name}</h1>

      <div className="mb-8 border p-6">
        <h2 className="text-2xl font-semibold mb-4">Movement Details</h2>
        <div className="space-y-2">
          <p className="text-lg">
            <span className="font-medium">Type:</span>{' '}
            <span className="border px-2 py-1">{movement.type}</span>
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Featured In Workouts</h2>
        <div className="flex flex-wrap gap-4">
          {workouts.map(workout => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      </div>
    </div>
  );
}
