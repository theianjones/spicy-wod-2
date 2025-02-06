import {useForm, type SubmissionResult} from '@conform-to/react'
import {parseWithZod} from '@conform-to/zod'
import {workoutSchema, type Workout} from '~/schemas/models'
import {Button} from '~/components/ui/button'
import {useLoaderData} from 'react-router'
import {loader} from '~/workouts/create'
import {
  ConformSelect,
  ConformTextarea,
  ConformInput,
  ConformMultiSelect,
} from './ui/conform'
import {FormLabel, FormError} from './ui/form'

type FormWorkout = Omit<Workout, 'id'>
const formWorkoutSchema = workoutSchema.omit({id: true})

export function WorkoutForm({lastResult}: {lastResult?: SubmissionResult}) {
  const {movements} = useLoaderData<typeof loader>()
  const [form, fields] = useForm<FormWorkout>({
    id: 'workout',
    shouldValidate: 'onSubmit',
    lastResult,
    onValidate: ({formData}: {formData: FormData}) =>
      parseWithZod(formData, {schema: formWorkoutSchema}),
  })
  const movementOptions = movements.map((movement) => ({
    value: movement.id,
    label: movement.name,
  }))

  return (
    <form
      method="post"
      className="space-y-6 bg-white p-8 border-4 border-black"
      id={form.id}
      onSubmit={form.onSubmit}
    >
      <h1 className="text-3xl font-bold tracking-tight text-black uppercase">
        Create Workout
      </h1>

      {form.errors && <FormError>{form.errors}</FormError>}
      <div className="space-y-4">
        <div>
          <FormLabel
            htmlFor={fields.name.id}
            className="text-sm font-bold uppercase block"
          >
            Workout Name
          </FormLabel>
          <ConformInput meta={fields.name} className="mt-1 block w-full" />
        </div>

        <div>
          <FormLabel
            htmlFor={fields.description.id}
            className="text-sm font-bold uppercase block"
          >
            Description
          </FormLabel>
          <ConformTextarea
            meta={fields.description}
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <FormLabel
            htmlFor={fields.scheme.id}
            className="text-sm font-bold uppercase block"
          >
            Scoring Scheme
          </FormLabel>
          <ConformSelect
            meta={fields.scheme}
            options={[
              {value: 'time', label: 'Time'},
              {value: 'time-with-cap', label: 'Time with Cap'},
              {value: 'pass-fail', label: 'Pass/Fail'},
              {value: 'rounds-reps', label: 'Rounds & Reps'},
              {value: 'reps', label: 'Reps'},
              {value: 'emom', label: 'EMOM'},
              {value: 'load', label: 'Load'},
              {value: 'calories', label: 'Calories'},
              {value: 'points', label: 'Points'},
              {value: 'meters', label: 'Meters'},
              {value: 'feet', label: 'Feet'},
            ]}
            placeholder="Select a scoring scheme"
            className="mt-1 block w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FormLabel htmlFor={fields.repsPerRound.id}>
              Reps Per Round
            </FormLabel>
            <ConformInput
              meta={fields.repsPerRound}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <FormLabel htmlFor={fields.roundsToScore.id}>
              Rounds to Score
            </FormLabel>
            <ConformInput
              meta={fields.roundsToScore}
              className="mt-1 block w-full"
            />
          </div>
        </div>

        <div>
          <FormLabel htmlFor={fields.movements.id}>Movements</FormLabel>
          <ConformMultiSelect
            meta={fields.movements}
            options={movementOptions}
            placeholder="Select movements..."
            className="mt-1"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-black text-white px-4 py-3 uppercase font-bold hover:bg-gray-800 transition-colors"
        >
          Create Workout
        </Button>
      </div>
    </form>
  )
}
