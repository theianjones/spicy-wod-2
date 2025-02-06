import {X, CalendarDays, Trophy} from 'lucide-react'
import {useLoaderData} from 'react-router'
import type {Route} from '../+types/root'
import {Button} from '~/components/ui/button'
import {getResultsForWodbyUserId} from '~/lib/results'
import {getWorkoutWithMovementsByIdOrName} from '~/lib/workouts'
import {formatTime} from '~/utils/format-time'
import {WorkoutSchemeIcon} from '~/components/workouts/workout-scheme-icon'
import {AllWodResult} from '~/schemas/models'
import {requireAuth} from '~/middleware/auth'

interface WorkoutPageProps {
  params: {
    name: string
  }
}

export async function loader({request, context, params}: Route.LoaderArgs) {
  const session = await requireAuth(request, context)

  if (!params.name) {
    throw new Response('Not Found', {status: 404})
  }

  const workout = await getWorkoutWithMovementsByIdOrName(params.name, context)

  if (!workout) {
    throw new Response('Not Found', {status: 404})
  }

  const results = await getResultsForWodbyUserId(
    workout.id,
    session.userId,
    context,
  )

  return {workout, results}
}

export default function WorkoutPage({params}: WorkoutPageProps) {
  let {workout, results} = useLoaderData<typeof loader>()

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
            <Button className="bg-black text-white hover:bg-white hover:text-black border-4 border-black text-xl px-8 py-6 font-mono">
              LOG SCORE
            </Button>
          </div>
        </div>
        <div className="flex justify-between pt-8">
          <div className="flex flex-col ">
            <div className="uppercase text-2xl mb-4 font-bold tracking-wide">
              SCHEME
            </div>
            <div className="flex items-center gap-2">
              <WorkoutSchemeIcon scheme={workout.scheme} className="size-6" />
              <span className="uppercase text-xl font-bold tracking-wide">
                {workout.scheme}
              </span>
            </div>
          </div>

          <div className="">
            <h2 className="text-2xl font-bold mb-4">MOVEMENTS</h2>
            <div className="flex flex-wrap gap-2">
              {workout.movements.map((movement) => (
                <div
                  key={movement}
                  className="border-2 border-black px-4 py-2 text-lg"
                >
                  {movement}
                </div>
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
            <ResultsTable results={results} />
          ) : (
            <div className="flex items-center justify-center p-6 text-xl min-h-[300px]">
              No results yet.
            </div>
          )}
        </div>
      </div>

      {/* Add Score Form - Initially Hidden */}
      <div className="fixed inset-0 bg-black/80 hidden items-center justify-center">
        <div className="bg-white border-4 border-black p-8 max-w-2xl w-full mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">LOG NEW SCORE</h2>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-black hover:text-white"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <form className="space-y-6">
            <div className="grid gap-2">
              <label className="text-xl font-bold">TIME</label>
              <input
                type="text"
                className="border-4 border-black p-4 text-2xl font-mono"
                placeholder="00:00"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xl font-bold">NOTES</label>
              <textarea
                className="border-4 border-black p-4 text-xl font-mono min-h-[100px]"
                placeholder="How did it go?"
              />
            </div>
            <Button className="w-full bg-black text-white hover:bg-white hover:text-black border-4 border-black text-xl py-6 font-mono">
              SUBMIT
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

function ResultsTable({results}: {results: AllWodResult[]}) {
  // Find the minimum score (best time)
  const bestScore = Math.min(...results.map((r) => r?.score ?? Infinity))

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b-4 border-black">
          <th className="text-left p-4 text-xl">DATE</th>
          <th className="text-left p-4 text-xl">TIME</th>
          <th className="text-left p-4 text-xl">SCALE</th>
          <th className="text-left p-4 text-xl">NOTES</th>
          <th className="text-left p-4 text-xl"></th>
        </tr>
      </thead>
      <tbody>
        {results.map((result) => (
          <tr
            key={result.id}
            className="border-b-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            <td className="p-4 text-lg">
              {new Date(result?.date ?? 0).toLocaleDateString()}
            </td>
            <td className="p-4 text-lg font-bold">
              <span className="relative flex items-center gap-2">
                {formatTime(result?.score ?? 0)}
                {result?.score === bestScore && <Trophy className="h-5 w-5 " />}
              </span>
            </td>
            <td className="p-4 text-lg">{result?.scale}</td>
            <td className="p-4 text-lg">{result?.notes}</td>
            <td className="p-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white hover:text-black"
              >
                <X className="h-5 w-5" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
