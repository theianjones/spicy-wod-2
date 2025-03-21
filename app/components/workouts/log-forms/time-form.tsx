import { useMemo, useState } from 'react';
import { useForm, type SubmissionResult } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { object, z } from 'zod';
import { zu } from 'zod_utilz';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import {
  ConformInput,
  ConformMinutesSecondsInput,
  ConformSelect,
  ConformTextarea,
  ConformToggleGroup,
} from '~/components/ui/conform';
import { FormLabel, FormMessage } from '~/components/ui/form';
import { ToggleGroupItem } from '~/components/ui/toggle-group';
import { Workout } from '~/schemas/models';

export const resultsSchema = (workout: Workout, extendedForCap = false) =>
  z.object({
    scores: z
      .preprocess(val => {
        if (typeof val === 'string') return [val];
        return val;
      }, z.array(z.string()))
      .refine(
        val => {
          const roundsToScore = workout.roundsToScore ?? 1;
          return val.length === roundsToScore;
        },
        {
          message: `You must log a score for each round.`,
        }
      ),
    scale: z.enum(['rx', 'scaled', 'rx+']),
    workoutId: z.string(),
    notes: z.string().optional(),
    // Include these fields if it's a time-with-cap workout
    isTimeCapped: extendedForCap ? z.boolean().optional() : z.undefined(),
    repsCompleted: extendedForCap
      ? z.coerce.number().int().nonnegative().optional()
      : z.undefined(),
  });

interface TimeLogFormProps {
  workout: Workout;
  lastResult?: SubmissionResult;
  extendedForCap?: boolean;
}

export function TimeLogForm({ workout, lastResult, extendedForCap = false }: TimeLogFormProps) {
  console.log({ workout });
  const initialValue = lastResult?.initialValue;
  const transformedInitialScore = initialValue?.scores;
  const [isTimeCapped, setIsTimeCapped] = useState(false);

  const schema = useMemo(() => resultsSchema(workout, extendedForCap), [workout, extendedForCap]);
  const [
    form,
    { scores, scale, workoutId, notes, repsCompleted, isTimeCapped: isTimeCappedField },
  ] = useForm<z.infer<typeof schema>>({
    lastResult,
    shouldValidate: 'onBlur',
    defaultValue: {
      notes: null,
      isTimeCapped: false,
    },
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema,
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

      {extendedForCap && (
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={isTimeCappedField?.id}
              name={isTimeCappedField?.name}
              checked={isTimeCapped}
              onCheckedChange={(checked: boolean | 'indeterminate') => {
                setIsTimeCapped(checked === true);
                if (isTimeCappedField?.name) {
                  const input = document.createElement('input');
                  input.type = 'hidden';
                  input.name = isTimeCappedField.name;
                  input.value = checked ? 'true' : 'false';
                  document.getElementsByName(isTimeCappedField.name)[0]?.replaceWith(input);
                }
              }}
            />
            <FormLabel htmlFor={isTimeCappedField?.id} className="text-sm font-bold uppercase">
              Hit Time Cap?
            </FormLabel>
          </div>

          {isTimeCapped && (
            <div className="mt-4">
              <FormLabel htmlFor={repsCompleted?.id} className="text-sm font-bold uppercase block">
                Reps Completed After Cap
              </FormLabel>
              <ConformInput meta={repsCompleted} type="number" className="mt-1 block w-full" />
            </div>
          )}
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
