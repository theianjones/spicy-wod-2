import { useMemo } from 'react';
import { useForm, type SubmissionResult } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { ConformTextarea, ConformToggleGroup } from '~/components/ui/conform';
import { FormLabel } from '~/components/ui/form';
import { ToggleGroupItem } from '~/components/ui/toggle-group';
import { Workout } from '~/schemas/models';

export const passFailSchema = (workout: Workout) =>
  z.object({
    scores: z.array(z.enum(['1', '0'])).length(1),
    scale: z.enum(['rx', 'scaled', 'rx+']),
    workoutId: z.string(),
    notes: z.string().optional(),
  });

interface PassFailLogFormProps {
  workout: Workout;
  lastResult?: SubmissionResult;
}

export function PassFailLogForm({ workout, lastResult }: PassFailLogFormProps) {
  const initialValue = lastResult?.initialValue;
  const schema = useMemo(() => passFailSchema(workout), [workout]);

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

  return (
    <form method="post" className="p-4 border-2 border-black flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4">Log Pass/Fail Result</h2>
      <input type="hidden" name={workoutId.name} value={workout.id} />

      <div>
        <FormLabel htmlFor={scores.id} className="text-sm font-bold uppercase block">
          Result
        </FormLabel>
        <input type="hidden" id={scores.id} name={scores.name} value="" />
        <ConformToggleGroup meta={scores} size="lg">
          <ToggleGroupItem
            value="1"
            className="bg-green-100 data-[state=on]:bg-green-600 data-[state=on]:text-white"
          >
            Pass
          </ToggleGroupItem>
          <ToggleGroupItem
            value="0"
            className="bg-red-100 data-[state=on]:bg-red-600 data-[state=on]:text-white"
          >
            Fail
          </ToggleGroupItem>
        </ConformToggleGroup>
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
