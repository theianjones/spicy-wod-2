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
            <CardDescription className="text-sm text-black font-semibold whitespace-pre-wrap">
              {workout.description}
            </CardDescription>
          </div>
        </CardHeader>


        <CardFooter className="flex justify-between">
          <div>
            {workout.movements && workout.movements.length > 0 && (
              <div className="space-y-1">
                <div className="flex flex-wrap gap-2">
                  {workout.movements.slice(0, 2).map(movement => (
                    <Link
                      key={movement}
                      to={`/movements/${movement}`}
                      className="border border-black text-black bg-white text-xs rounded-none px-2 py-1 hover:bg-gray-100"
                    >
                      {movement}
                    </Link>
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
            to={`/workouts/${workout.userId ? workout.id : workout.name.toLowerCase()}`}
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
