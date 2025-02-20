import { useForm, type SubmissionResult } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { ConformMinutesSecondsInput, ConformSelect, ConformTextarea } from '~/components/ui/conform';
import { FormLabel, FormMessage } from '~/components/ui/form';
import { Workout } from '~/schemas/models';

export const resultsSchema = (roundsToScore: number) =>
  z.object({
    scores: z.string().refine(
      val => {
        const scores = JSON.parse(val);
        return Object.values(scores).length === roundsToScore;
      },
      {
        message: 'You must log a score for each round',
      }
    ),
    scale: z.enum(['rx', 'scaled', 'rx+']),
    workoutId: z.string(),
    notes: z.string().optional(),
  });

interface TimeLogFormProps {
  workout: Workout;
  lastResult?: SubmissionResult;
}

export function TimeLogForm({ workout, lastResult }: TimeLogFormProps) {
  console.log({ workout });
  const initialValue = lastResult?.initialValue;
  const transformedInitialScore = initialValue?.scores;
  const [form, { scores, scale, workoutId, notes }] = useForm({
    id: 'time-log-form',
    lastResult,
    shouldValidate: 'onBlur',
    defaultValue: {
      notes: null
    },
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: resultsSchema(workout.roundsToScore ?? 1),
      });
    },
  });

  return (
    <form method="post" className="p-4 border-2 border-black flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4">Log Time Score</h2>
      <input type="hidden" name={workoutId.name} value={workout.id} />
      <div className="flex gap-4">
        <ConformMinutesSecondsInput meta={scores} numberOfRounds={workout.roundsToScore ?? 1} />
      </div>
      <div>
        <FormLabel htmlFor={scale.id} className="text-sm font-bold uppercase block">
          Scale
        </FormLabel>
        <ConformSelect
          meta={scale}
          options={[
            { value: 'scaled', label: 'Scaled' },
            { value: 'rx', label: 'RX' },
            { value: 'rx+', label: 'RX+' },
          ]}
          placeholder="Select a scoring scheme"
          className="mt-1 block w-full"
        />
        <FormMessage>{scale.errors}</FormMessage>
      </div>
      <div className="mt-4">
          <FormLabel htmlFor={notes.id} className="text-sm font-bold uppercase block">
            Notes
          </FormLabel>
          <ConformTextarea meta={notes} className="mt-1 block w-full" />
          <FormMessage>{notes.errors}</FormMessage>
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
