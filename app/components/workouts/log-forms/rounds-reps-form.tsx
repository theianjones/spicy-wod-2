import { useEffect, useMemo, useState } from 'react';
import { useForm, type SubmissionResult } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { ConformInput, ConformTextarea, ConformToggleGroup } from '~/components/ui/conform';
import { FormLabel } from '~/components/ui/form';
import { ToggleGroupItem } from '~/components/ui/toggle-group';
import { Workout } from '~/schemas/models';

export const roundsRepsSchema = (workout: Workout) =>
  z.object({
    rounds: z.coerce.number().int().positive({ message: 'Must be at least 1' }),
    repsPerRound: z.coerce.number().int().positive({ message: 'Must be at least 1' }),
    // This field will be used to store the computed total in scores array
    scores: z.array(z.string()).length(1).optional(),
    scale: z.enum(['rx', 'scaled', 'rx+']),
    workoutId: z.string(),
    notes: z.string().optional(),
  });

interface RoundsRepsLogFormProps {
  workout: Workout;
  lastResult?: SubmissionResult;
}

export function RoundsRepsLogForm({ workout, lastResult }: RoundsRepsLogFormProps) {
  const initialValue = lastResult?.initialValue;
  const schema = useMemo(() => roundsRepsSchema(workout), [workout]);
  const [totalReps, setTotalReps] = useState(0);
  const [roundsValue, setRoundsValue] = useState<number>(workout.roundsToScore || 0);
  const [repsValue, setRepsValue] = useState<number>(workout.repsPerRound || 0);

  const [form, { rounds, repsPerRound, scores, scale, workoutId, notes }] = useForm<
    z.infer<typeof schema>
  >({
    lastResult,
    shouldValidate: 'onBlur',
    defaultValue: {
      notes: null,
      rounds: workout.roundsToScore ?? undefined,
      repsPerRound: workout.repsPerRound ?? undefined,
    },
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema,
      });
    },
  });

  // Handler for rounds input changes
  const handleRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    setRoundsValue(value);
  };

  // Handler for reps input changes
  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    setRepsValue(value);
  };

  // Calculate total reps whenever rounds or repsPerRound changes
  useEffect(() => {
    if (roundsValue && repsValue) {
      const calculatedTotal = roundsValue * repsValue;
      setTotalReps(calculatedTotal);
    } else {
      setTotalReps(0);
    }
  }, [roundsValue, repsValue]);

  return (
    <form method="post" id={form.id} className="p-4 border-2 border-black flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4">Log Rounds & Reps Result</h2>
      <input type="hidden" name={workoutId.name} value={workout.id} />
      <input type="hidden" name={scores?.name} value={totalReps.toString()} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FormLabel htmlFor={rounds.id} className="text-sm font-bold uppercase block">
            Rounds Completed
          </FormLabel>
          <input
            id={rounds.id}
            name={rounds.name}
            type="number"
            className="mt-1 block w-full p-2 border-2 border-black"
            defaultValue={workout.roundsToScore?.toString()}
            onChange={handleRoundsChange}
          />
        </div>

        <div>
          <FormLabel htmlFor={repsPerRound.id} className="text-sm font-bold uppercase block">
            Reps Per Round
          </FormLabel>
          <input
            id={repsPerRound.id}
            name={repsPerRound.name}
            type="number"
            className="mt-1 block w-full p-2 border-2 border-black"
            defaultValue={workout.repsPerRound?.toString()}
            onChange={handleRepsChange}
          />
        </div>
      </div>

      {totalReps > 0 && (
        <div className="mt-4 p-4 border-2 border-black">
          <span className="font-bold">Total Reps: {totalReps}</span>
        </div>
      )}

      <div>
        <FormLabel htmlFor={scale.id} className="text-sm font-bold uppercase block">
          Scale
        </FormLabel>
        <ConformToggleGroup meta={scale} size="lg">
          <ToggleGroupItem value="scaled">Scaled</ToggleGroupItem>
          <ToggleGroupItem value="rx">RX</ToggleGroupItem>
          <ToggleGroupItem value="rx+">RX+</ToggleGroupItem>
        </ConformToggleGroup>
      </div>

      <div className="mt-4">
        <FormLabel htmlFor={notes.id} className="text-sm font-bold uppercase block">
          Notes
        </FormLabel>
        <ConformTextarea meta={notes} className="mt-1 block w-full" />
      </div>

      <Button
        type="submit"
        className="mt-4 bg-black text-white px-4 py-2 hover:bg-white hover:text-black border-2 border-black transition-colors"
      >
        Submit
      </Button>
    </form>
  );
}
