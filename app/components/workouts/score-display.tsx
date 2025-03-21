import { type Workout } from '~/schemas/models';

interface ScoreDisplayProps {
  workout: Pick<Workout, 'scheme'>;
  score: number;
}

export function ScoreDisplay({ workout, score }: ScoreDisplayProps) {
  switch (workout.scheme) {
    case 'time':
    case 'time-with-cap':
      // Convert seconds to MM:SS format
      const minutes = Math.floor(score / 60);
      const seconds = score % 60;
      return (
        <span className="font-mono">
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </span>
      );

    case 'pass-fail':
      return (
        <span className={score === 1 ? 'text-green-600' : 'text-red-600'}>
          {score === 1 ? 'Pass' : 'Fail'}
        </span>
      );

    case 'rounds-reps':
      return <span>{score} reps</span>;

    case 'reps':
      return <span>{score} reps</span>;

    case 'emom':
      return <span>{score} rounds</span>;

    case 'load':
      return <span>{score} lbs</span>;

    case 'calories':
      return <span>{score} cal</span>;

    case 'meters':
      return <span>{score} m</span>;

    case 'feet':
      return <span>{score} ft</span>;

    case 'points':
      return <span>{score} pts</span>;

    default:
      return <span>{score}</span>;
  }
}
