import { CalendarDays, Trophy, X } from 'lucide-react';
import { Form, Link, Outlet, redirect, useLoaderData } from 'react-router';
import { Button } from '~/components/ui/button';
import { ScoreDisplay } from '~/components/workouts/score-display';
import { WorkoutSchemeIcon } from '~/components/workouts/workout-scheme-icon';
import { deleteWodResult, getResultsForWodbyUserId } from '~/lib/results';
import { getWorkoutWithMovementsByIdOrName } from '~/lib/workouts';
import { requireAuth } from '~/middleware/auth';
import { AllWodResult, type Workout } from '~/schemas/models';
import type { Route } from '../workouts/+types/[name]';


export async function action({ request, context, params }: Route.ActionArgs) {
  const session = await requireAuth(request, context);
  const formData = await request.formData();
  const resultId = formData.get('resultId') as string;

  if (!resultId) {
    throw new Response('Result ID is required', { status: 400 });
  }

  // Delete the result
  await deleteWodResult(resultId, context);

  // Redirect back to the workout page
  return redirect(`/workouts/${params.name}`);
}

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const session = await requireAuth(request, context);

  if (!params.name) {
    throw new Response('Not Found', { status: 404 });
  }

  const workout = await getWorkoutWithMovementsByIdOrName(params.name, context);

  if (!workout || !workout.id) {
    throw new Response('Not Found', { status: 404 });
  }

  const results = await getResultsForWodbyUserId(workout.id, session.userId, context);

  return { workout, results };
}

export default function WorkoutPage() {
  const { workout, results } = useLoaderData<typeof loader>();

  return (
    <div className="bg-white p-4 font-mono max-w-screen-xl mx-auto">
      {/* Header */}
      <header className="border-4 border-black p-6 mb-8">
        <div className="flex justify-between">
          <div>
            <h1 className="text-6xl font-bold mb-4">{workout.name}</h1>
            <p className="text-xl border-l-4 border-black pl-4 whitespace-pre-wrap">
              {workout.description}
            </p>
          </div>
          <div className="flex flex-col gap-4 justify-between">
            <Button
              className="bg-black text-white hover:bg-white hover:text-black border-4 border-black text-xl px-8 py-6 font-mono"
              asChild
            >
              <Link to="log-result">LOG SCORE</Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-between pt-8">
          <div className="flex flex-col ">
            <div className="uppercase text-2xl mb-4 font-bold tracking-wide">SCHEME</div>
            <div className="flex items-center gap-2">
              <WorkoutSchemeIcon scheme={workout.scheme} className="size-6" />
              <span className="uppercase text-xl font-bold tracking-wide">{workout.scheme}</span>
            </div>
          </div>

          <div className="">
            <h2 className="text-2xl font-bold mb-4">MOVEMENTS</h2>
            <div className="flex flex-wrap gap-2">
              {workout.movements?.map(movement => (
                <Link
                  key={movement}
                  to={`/movements/${movement}`}
                  className="border-2 border-black px-4 py-2 text-lg hover:bg-gray-100"
                >
                  {movement}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Logbook */}
      <div className="border-4 border-black">
        <div className="border-b-4 border-black p-6">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <CalendarDays className="h-8 w-8" />
            LOGBOOK
          </h2>
        </div>

        <div className="overflow-x-auto">
          {results.length > 0 ? (
            <ResultsTable results={results} workout={workout} />
          ) : (
            <div className="flex items-center justify-center p-6 text-xl min-h-[300px]">
              No results yet.
            </div>
          )}
        </div>
      </div>

      {/* Add Score Form */}
      <Outlet />
    </div>
  );
}

function ResultsTable({
  results,
  workout,
}: {
  results: AllWodResult[];
  workout: Pick<Workout, 'scheme'>;
}) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b-4 border-black">
          <th className="text-left p-4 text-xl">DATE</th>
          <th className="text-left p-4 text-xl">SCORE</th>
          <th className="text-left p-4 text-xl">SCALE</th>
          <th className="text-left p-4 text-xl">NOTES</th>
          <th className="text-left p-4 text-xl"></th>
        </tr>
      </thead>
      <tbody>
        {results.map(result => (
          <tr
            key={result.id}
            className="border-b-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            <td className="p-4 text-lg">{new Date(result?.date ?? 0).toLocaleDateString()}</td>
            <td className="p-4 text-lg font-bold">
              <span className="relative flex items-center gap-2">
                {result.sets.map(set => (
                  <div key={set.setNumber} className="flex items-center gap-1">
                    {result.sets.length > 1 && (
                      <span className="text-sm text-gray-500">({set.setNumber})</span>
                    )}
                    <ScoreDisplay workout={workout} score={set.score ?? 0} />
                  </div>
                ))}
              </span>
            </td>
            <td className="p-4 text-lg">{result?.scale}</td>
            <td className="p-4 text-lg">{result?.notes}</td>
            <td className="p-4">
              <Form
                method="post"
                onSubmit={event => {
                  if (!confirm('Are you sure you want to delete this result?')) {
                    event.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="resultId" value={result.id} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white hover:text-black"
                  type="submit"
                >
                  <X className="h-5 w-5" />
                </Button>
              </Form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
