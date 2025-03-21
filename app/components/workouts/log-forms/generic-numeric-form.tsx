import { useMemo, useState } from 'react';
import { useForm, type SubmissionResult } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { ConformTextarea, ConformToggleGroup } from '~/components/ui/conform';
import { FormLabel } from '~/components/ui/form';
import { ToggleGroupItem } from '~/components/ui/toggle-group';
import { Workout } from '~/schemas/models';

export const numericSchema = (workout: Workout) =>
  z.object({
    scores: z.array(z.string()).length(1),
    scale: z.enum(['rx', 'scaled', 'rx+']),
    workoutId: z.string(),
    notes: z.string().optional(),
  });

interface GenericNumericLogFormProps {
  workout: Workout;
  lastResult?: SubmissionResult;
}

export function GenericNumericLogForm({ workout, lastResult }: GenericNumericLogFormProps) {
  const initialValue = lastResult?.initialValue;
  const schema = useMemo(() => numericSchema(workout), [workout]);
  const [score, setScore] = useState<string>('');

  const [form, { scores, scale, workoutId, notes }] = useForm<z.infer<typeof schema>>({
    lastResult,
    shouldValidate: 'onBlur',
    defaultValue: {
      notes: null,
    },
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema,
      });
    },
  });

  // Get the appropriate label based on the workout scheme
  const getSchemeLabel = () => {
    switch (workout.scheme) {
      case 'reps':
        return 'Repetitions';
      case 'emom':
        return 'EMOM Rounds';
      case 'load':
        return 'Load (lbs)';
      case 'calories':
        return 'Calories';
      case 'meters':
        return 'Meters';
      case 'feet':
        return 'Feet';
      case 'points':
        return 'Points';
      default:
        return 'Score';
    }
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScore(e.target.value);
  };

  return (
    <form method="post" className="p-4 border-2 border-black flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4">
        Log {workout.scheme.charAt(0).toUpperCase() + workout.scheme.slice(1)} Result
      </h2>
      <input type="hidden" name={workoutId.name} value={workout.id} />
      <input type="hidden" name={scores.name} value={score} />

      <div>
        <FormLabel htmlFor="score-input" className="text-sm font-bold uppercase block">
          {getSchemeLabel()}
        </FormLabel>
        <input
          id="score-input"
          type="number"
          className="mt-1 block w-full p-2 border-2 border-black"
          value={score}
          onChange={handleScoreChange}
          min="0"
        />
      </div>

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
