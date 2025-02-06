import {Activity, Clock, Dumbbell} from 'lucide-react'
import {cn} from '~/lib/utils'
import type {Workout} from '~/schemas/models'

export const WorkoutSchemeIcon = ({
  scheme,
  className,
}: {
  scheme: Workout['scheme']
  className?: string
}) => {
  switch (scheme) {
    case 'time':
    case 'time-with-cap':
      return <Clock className={cn('size-4', className)} />
    case 'load':
      return <Dumbbell className={cn('size-4', className)} />
    default:
      return <Activity className={cn('size-4', className)} />
  }
}
