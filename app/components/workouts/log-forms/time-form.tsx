import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { ConformMinutesSecondsInput, ConformToggleGroup } from '~/components/ui/conform';
import { ToggleGroupItem } from '~/components/ui/toggle-group';
import { Workout } from '~/schemas/models';

export const resultsSchema = z.object({
  scores: z.array(z.number()),
  scale: z.enum(['rx', 'scaled', 'rx+']),
  workoutId: z.string(),
});

interface TimeLogFormProps {
  workout: Workout;
}

export function TimeLogForm({ workout }: TimeLogFormProps) {
  const [, { scores, scale, workoutId }] = useForm({
    id: 'time-log-form',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: resultsSchema });
    },
    defaultValue: {},
    onSubmit(event) {
      const formData = new FormData(event.currentTarget);
      console.log(formData.get('scores'));
    },
  });

  return (
    <form method="post" className="p-4 border-2 border-black flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4">Log Time Score</h2>
      <input type="hidden" name={workoutId.name} value={workout.id} />
      <div className="flex gap-4">
        <ConformMinutesSecondsInput meta={scores} numberOfRounds={workout.roundsToScore ?? 1} />
      </div>
      <ConformToggleGroup meta={scale} label="Scale" size="lg">
        <ToggleGroupItem value="scaled">Scaled</ToggleGroupItem>
        <ToggleGroupItem value="rx">RX</ToggleGroupItem>
        <ToggleGroupItem value="rx+">RX+</ToggleGroupItem>
      </ConformToggleGroup>
      <Button
        type="submit"
        className="mt-4 bg-black text-white px-4 py-2 hover:bg-white hover:text-black border-2 border-black transition-colors"
      >
        Submit
      </Button>
    </form>
  );
}
