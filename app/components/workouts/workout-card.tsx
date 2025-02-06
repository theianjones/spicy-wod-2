import { memo } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

import { Badge } from '~/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import type { Workout } from '~/schemas/models';
import { WorkoutSchemeIcon } from './workout-scheme-icon';

interface WorkoutCardProps {
  workout: Workout;
}

function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <div className="relative h-full group">
      {/* Shadow effect */}
      <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-300" />

      {/* Card */}
      <Card className="relative bg-white text-black border border-black h-full flex flex-col justify-between rounded-none">
        <CardHeader className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold">{workout.name}</CardTitle>
            </div>
          </div>

          <div className="space-y-1">
            <Badge variant="outline" className="bg-white text-black border-black rounded-none">
              <WorkoutSchemeIcon scheme={workout.scheme} />
              <span className="ml-1 uppercase text-xs">{workout.scheme}</span>
            </Badge>
          </div>

          <div className="space-y-1">
            <CardDescription className="text-sm text-blac font-semibold">
              {workout.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className=" p-6 space-y-4">
          {(Boolean(workout.roundsToScore) || Boolean(workout.repsPerRound)) && (
            <div className="grid grid-cols-2 gap-4">
              {workout.repsPerRound && (
                <div className="space-y-1">
                  <div className="uppercase text-xs font-bold tracking-wide">REPS PER ROUND</div>
                  <div className="text-sm">{workout.repsPerRound}</div>
                </div>
              )}
              {workout.roundsToScore && (
                <div className="space-y-1">
                  <div className="text-sm">{workout.roundsToScore}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            {workout.movements && workout.movements.length > 0 && (
              <div className="space-y-1">
                <div className="flex flex-wrap gap-2">
                  {workout.movements.slice(0, 2).map(movement => (
                    <Badge
                      key={movement}
                      variant="secondary"
                      className="border border-black text-black bg-white text-xs rounded-none"
                    >
                      {movement}
                    </Badge>
                  ))}
                  {workout.movements.length > 2 && (
                    <Badge
                      variant="secondary"
                      className="border border-black text-black bg-white text-xs rounded-none"
                    >
                      +{workout.movements.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
          <Link
            to={`/workouts/${workout.name}`}
            className="border border-black text-black text-xs px-1 py-0.5 rounded-none flex items-center gap-1 font-semibold"
          >
            Details
            <span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

const MemoizedWorkoutCard = memo(WorkoutCard);

export { MemoizedWorkoutCard as WorkoutCard };
