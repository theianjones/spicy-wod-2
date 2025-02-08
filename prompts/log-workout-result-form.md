# Log Workout Result Form

## Prerequisites

1. Ensure the workout object includes a valid `scheme` property (e.g. `"time"`, `"pass-fail"`, `"rounds-reps"`), and if applicable, the `repsPerRound` and `roundsToScore` fields.
2. Confirm the Zod schemas in `~/schemas/models.ts` reflect any necessary validations for workout results.
3. Verify that the results table in the database is set up to store a single numeric score.
4. Ensure that the project is using **pnpm** for package management and the existing styling adheres to a brutalist aesthetic.
5. Node.js v18+ must be installed. Verify with:
   ```bash
   node -v
   ```
6. pnpm must be installed. Verify with:
   ```bash
   pnpm -v
   ```
7. Ensure the project builds without errors and that the current workout pages (e.g. app/workouts/[name].tsx) and UI components (app/components/ui/form.tsx and app/components/ui/conform.tsx) are working.
8. Confirm that TypeScript and React are correctly configured in the project.

## Execution Steps

1. **Create the Time Log Form Component**

   - Create a file at `app/components/workouts/log-forms/time-form.tsx`.
   - This component should use the `Form` component from `app/components/ui/form.tsx` and `ConformInput` from `app/components/ui/conform.tsx`.
   - It must validate that the workout's scheme is `'time'` and on submit convert the "MM:SS" input into seconds.

   ```diff
   // app/components/workouts/log-forms/time-form.tsx
   + import React from 'react';
   + import { Form } from '~/components/ui/form';
   + import { ConformInput } from '~/components/ui/conform';
   +
   + export function TimeLogForm({ workout }) {
   +   if (workout.scheme !== 'time') {
   +     return null;
   +   }
   +
   +   const handleSubmit = (event) => {
   +     event.preventDefault();
   +     const formData = new FormData(event.target);
   +     const timeInput = formData.get('time');
   +     // Parse time input assumed in "MM:SS" format
   +     const [minutes, seconds] = timeInput.split(':').map(Number);
   +     const totalSeconds = minutes * 60 + seconds;
   +     // Submit totalSeconds as the workout score (single number)
   +     console.log('Submitting score (seconds):', totalSeconds);
   +   };
   +
   +   return (
   +     <Form method="post" onSubmit={handleSubmit} className="p-4 border">
   +       <h2 className="text-2xl font-bold mb-4">Log Time Score</h2>
   +       <ConformInput
   +         meta={{ name: 'time', id: 'time', required: true, errors: null, initialValue: '' }}
   +         label="Enter Time (MM:SS)"
   +         type="text"
   +       />
   +       <button type="submit" className="mt-4 bg-black text-white px-4 py-2">
   +         Submit
   +       </button>
   +     </Form>
   +   );
   + }
   ```

2. **Create the Pass/Fail Log Form Component**

   - Create a file at `app/components/workouts/log-forms/passfail-form.tsx`.
   - This component must validate that the workout's scheme is `'pass-fail'` and render toggle buttons for Pass and Fail.
   - It should submit a score of 1 for pass and 0 for fail.

   ```diff
   // app/components/workouts/log-forms/passfail-form.tsx
   + import React, { useState } from 'react';
   + import { Form } from '~/components/ui/form';
   +
   + export function PassFailLogForm({ workout }) {
   +   if (workout.scheme !== 'pass-fail') {
   +     return null;
   +   }
   +
   +   const [result, setResult] = useState(null);
   +
   +   const handleSubmit = (event) => {
   +     event.preventDefault();
   +     // Store score as 1 for pass and 0 for fail
   +     const score = result === 'pass' ? 1 : 0;
   +     console.log('Submitting pass/fail score:', score);
   +   };
   +
   +   return (
   +     <Form method="post" onSubmit={handleSubmit} className="p-4 border">
   +       <h2 className="text-2xl font-bold mb-4">Log Pass/Fail Score</h2>
   +       <div>
   +         <button
   +           type="button"
   +           onClick={() => setResult('pass')}
   +           className={`px-4 py-2 ${result === 'pass' ? 'bg-green-500' : 'bg-gray-200'}`}
   +         >
   +           Pass
   +         </button>
   +         <button
   +           type="button"
   +           onClick={() => setResult('fail')}
   +           className={`px-4 py-2 ml-4 ${result === 'fail' ? 'bg-red-500' : 'bg-gray-200'}`}
   +         >
   +           Fail
   +         </button>
   +       </div>
   +       <button type="submit" className="mt-4 bg-black text-white px-4 py-2">
   +         Submit
   +       </button>
   +     </Form>
   +   );
   + }
   ```

3. **Create the Rounds-Reps (Reps) Log Form Component**

   - Create a file at `app/components/workouts/log-forms/reps-form.tsx`.
   - This component should validate that the workout's scheme is `'rounds-reps'`.
   - Render a set of inputs equal to the workout's `roundsToScore` value. Use `ConformInput` for each round.
   - On submit, sum up the input values and submit the total number of reps as the score.

   ```diff
   // app/components/workouts/log-forms/reps-form.tsx
   + import React from 'react';
   + import { Form } from '~/components/ui/form';
   + import { ConformInput } from '~/components/ui/conform';
   +
   + export function RepsLogForm({ workout }) {
   +   if (workout.scheme !== 'rounds-reps') {
   +     return null;
   +   }
   +
   +   const rounds = workout.roundsToScore || 0;
   +
   +   const handleSubmit = (event) => {
   +     event.preventDefault();
   +     const formData = new FormData(event.target);
   +     let totalReps = 0;
   +     for (let i = 1; i <= rounds; i++) {
   +       const reps = Number(formData.get(`round-${i}`)) || 0;
   +       totalReps += reps;
   +     }
   +     console.log('Submitting total reps score:', totalReps);
   +   };
   +
   +   return (
   +     <Form method="post" onSubmit={handleSubmit} className="p-4 border">
   +       <h2 className="text-2xl font-bold mb-4">Log Rounds & Reps Score</h2>
   +       {Array.from({ length: rounds }, (_, i) => (
   +         <ConformInput
   +           key={i}
   +           meta={{
   +             name: `round-${i + 1}`,
   +             id: `round-${i + 1}`,
   +             required: true,
   +             errors: null,
   +             initialValue: '',
   +           }}
   +           label={`Reps in Round ${i + 1}`}
   +           type="number"
   +         />
   +       ))}
   +       <button type="submit" className="mt-4 bg-black text-white px-4 py-2">
   +         Submit
   +       </button>
   +     </Form>
   +   );
   + }
   ```

4. **Integrate the Log Form Components into the Workout Details Page**

   - Edit the file `app/workouts/[name].tsx` to replace the static "LOG SCORE" button with conditional rendering.
   - Import the new log form components and render the correct form based on the workout's scheme.

   ```diff
   // app/workouts/[name].tsx
   + import { TimeLogForm } from '~/components/workouts/log-forms/time-form';
   + import { PassFailLogForm } from '~/components/workouts/log-forms/passfail-form';
   + import { RepsLogForm } from '~/components/workouts/log-forms/reps-form';
   ...
   - <Button className="bg-black text-white hover:bg-white hover:text-black border-4 border-black text-xl px-8 py-6 font-mono">
   -   LOG SCORE
   - </Button>
   + {workout.scheme === 'time' && <TimeLogForm workout={workout} />}
   + {workout.scheme === 'pass-fail' && <PassFailLogForm workout={workout} />}
   + {workout.scheme === 'rounds-reps' && <RepsLogForm workout={workout} />}
   ```

5. **Create a Utility Component for Rendering the Score Display**
   - Create a file at `app/components/workouts/score-display.tsx`.
   - This component should take a workout and a result score (a single number) and render it in a human-friendly format.
   - For example, convert seconds into MM:SS for the "time" scheme, display "Pass" or "Fail" for the "pass-fail" scheme, and append "reps" for the "rounds-reps" scheme.
   ```diff
   // app/components/workouts/score-display.tsx
   + import React from 'react';
   +
   + export function ScoreDisplay({ workout, score }) {
   +   if (workout.scheme === 'time') {
   +     // Convert seconds to MM:SS format
   +     const minutes = Math.floor(score / 60);
   +     const seconds = score % 60;
   +     return <span>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>;
   +   }
   +
   +   if (workout.scheme === 'pass-fail') {
   +     return <span>{score === 1 ? 'Pass' : 'Fail'}</span>;
   +   }
   +
   +   if (workout.scheme === 'rounds-reps') {
   +     return <span>{score} reps</span>;
   +   }
   +
   +   return <span>{score}</span>;
   + }
   ```

## Validation Checkpoints

1. Validate that each form component file exists:
   ```bash
   test -f app/components/workouts/log-forms/time-form.tsx && echo "TimeLogForm exists"
   ```
   ```bash
   test -f app/components/workouts/log-forms/passfail-form.tsx && echo "PassFailLogForm exists"
   ```
   ```bash
   test -f app/components/workouts/log-forms/reps-form.tsx && echo "RepsLogForm exists"
   ```
2. Verify integration in the workout details page:
   ```bash
   grep -q 'TimeLogForm' app/workouts/[name].tsx && echo "Integration of TimeLogForm OK"
   ```
3. Check the score-display component exists:
   ```bash
   test -f app/components/workouts/score-display.tsx && echo "ScoreDisplay exists"
   ```

## Error Handling

- If file creation fails, re-run the file creation step and check write permissions.
  ```bash
  echo "Error: Component file not found. Verify directory permissions and file paths."
  ```
- If the conditional rendering in the [name].tsx file fails (e.g. missing imports), use:
  ```bash
  grep -R "TimeLogForm" app/workouts/[name].tsx || echo "TimeLogForm import missing"
  ```
- If form submissions log invalid score values, check that the conversion logic (parsing "MM:SS" or summing rounds) is error-free and that inputs are provided in the correct format.

## Post-Execution

1. Run linter and build commands to ensure there are no syntax or type errors:
   ```bash
   pnpm run lint && pnpm run build
   ```
2. Open the workout detail page, verify that for each workout scheme the correct log form is rendered.
3. Manually verify that form submissions log the correct score (a single number) to the console.
