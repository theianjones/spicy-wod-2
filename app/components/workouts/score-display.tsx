import { type Workout } from '~/schemas/models';

interface ScoreDisplayProps {
  workout: Pick<Workout, 'scheme'>;
  score: number;
}

export function ScoreDisplay({ workout, score }: ScoreDisplayProps) {
  if (workout.scheme === 'time') {
    // Convert seconds to MM:SS format
    const minutes = Math.floor(score / 60);
    const seconds = score % 60;
    return (
      <span className="font-mono">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </span>
    );
  }

  if (workout.scheme === 'pass-fail') {
    return (
      <span className={score === 1 ? 'text-green-600' : 'text-red-600'}>
        {score === 1 ? 'Pass' : 'Fail'}
      </span>
    );
  }

  if (workout.scheme === 'rounds-reps') {
    return <span>{score} reps</span>;
  }

  return <span>{score}</span>;
}
