Below is a step‐by‐step guide for creating an “edit workout” form that is essentially a copy of the workout “create” form but pre‑populated with the workout’s existing data so that the user can update it.

---

**High-Level Summary:**  
You will create a new route file in the workouts folder (e.g. “edit.tsx”) that reuses the WorkoutForm component from the create page. The new form will load the existing workout data via a loader, pre‑populate the form fields, and update the workout record in the database in the action function.

---

**Step 0: Create a New Branch**  
- **Action:** Create and switch to a new branch specifically for the workout edit form task:
  ~~~bash
  git checkout -b feature/workout-edit-form | cat
  ~~~
- **Verification:** Confirm the branch was created successfully:
  ~~~bash
  git branch | cat
  ~~~
- **Commit:** No commit is required at this stage.

---

**Step 1: Create the New Route File**  
- **Action:** In the workouts route folder, create a new file named `edit.tsx`:
  ~~~bash
  touch app/routes/workouts/edit.tsx
  ~~~
- **Verification:** Open the file to ensure it exists:
  ~~~bash
  ls app/routes/workouts | grep edit.tsx | cat
  ~~~
- **Commit:** Stage and commit the new file:
  ~~~bash
  git add app/routes/workouts/edit.tsx
  git commit -m "feat: add empty workout edit route file for workout edit form" -m "created edit.tsx file in workouts route folder" | cat
  ~~~

---

**Step 2: Set Up the Loader to Load Existing Workout Data**  
- **Action:** In `edit.tsx`, add a loader that retrieves the workout details using an existing function (e.g. `getWorkoutWithMovementsByIdOrName`). Assume the workout id (or name) is passed as a route parameter (for example, `/workouts/edit/:id`):
  ~~~tsx
  // app/routes/workouts/edit.tsx
  import { useLoaderData, redirect } from 'react-router';
  import { getWorkoutWithMovementsByIdOrName } from '~/lib/workouts';
  import { requireAuth } from '~/middleware/auth';
  import type { Route } from '../workouts/+types/edit'; // create a type stub if needed
  
  export async function loader({ params, request, context }: Route.LoaderArgs) {
    await requireAuth(request, context);
    const { id } = params;
    if (!id) {
      throw new Response('Workout ID is required', { status: 400 });
    }
    const workout = await getWorkoutWithMovementsByIdOrName(id, context);
    if (!workout) {
      throw new Response('Workout not found', { status: 404 });
    }
    return { workout };
  }
  
  export default function EditWorkoutPage() {
    const { workout } = useLoaderData<typeof loader>();
    // Later we will pass the workout data as default values to the form
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">Edit Workout</h1>
        <WorkoutEditForm workout={workout} />
      </div>
    );
  }
  ~~~
- **Verification:** Save the file and verify that the loader returns a workout object when you navigate to `/workouts/edit/<id>`.
- **Commit:** Stage and commit your changes:
  ~~~bash
  git add app/routes/workouts/edit.tsx
  git commit -m "feat: add loader to edit workout form" -m "loader retrieves workout by id using getWorkoutWithMovementsByIdOrName" | cat
  ~~~

---

**Step 3: Create the WorkoutEditForm Component**  
- **Action:** Create a new component file (or define it within the same file) for the workout edit form. You can reuse the WorkoutForm component from the create page as a starting point. For example, create a file at `app/components/workout-edit-form.tsx`:
  ~~~bash
  touch app/components/workout-edit-form.tsx
  ~~~
- Open the file and add the following code:
  ~~~tsx
  // app/components/workout-edit-form.tsx
  import { useForm, type SubmissionResult } from '@conform-to/react';
  import { parseWithZod } from '@conform-to/zod';
  import { WorkoutForm } from '~/components/workout-form'; // assume WorkoutForm is the create form component
  import { workoutSchema } from '~/schemas/models';
  
  interface WorkoutEditFormProps {
    workout: ReturnType<typeof workoutSchema.parse>;
  }
  
  export function WorkoutEditForm({ workout }: WorkoutEditFormProps) {
    // Reuse the WorkoutForm component but pass in initial values based on the workout data
    // Optionally, you might want to pre-populate default values using workout data
    return (
      // You can pass the workout object as default values to the underlying form if WorkoutForm supports it.
      <WorkoutForm initialData={workout} mode="edit" />
    );
  }
  ~~~
  
  *(Note: If the existing WorkoutForm does not accept initial values, update it to support an `initialData` prop which sets default values in the useForm hook.)*
- **Verification:** Open the file and check that the component is exported correctly.
- **Commit:** Stage and commit your changes:
  ~~~bash
  git add app/components/workout-edit-form.tsx
  git commit -m "feat: add WorkoutEditForm component" -m "component reuses WorkoutForm for editing with initialData prop" | cat
  ~~~

---

**Step 4: Update the WorkoutForm Component to Support Editing**  
- **Action:** Modify the existing `WorkoutForm` component (found in `app/components/workout-form.tsx`) to accept an optional `initialData` prop and a `mode` prop (either "create" or "edit"). For example, update the form initialization so that if `initialData` is provided, the form fields are pre-populated:
  ~~~tsx
  // app/components/workout-form.tsx (excerpt)
  import { useForm, type SubmissionResult } from '@conform-to/react';
  import { parseWithZod } from '@conform-to/zod';
  import { useLoaderData } from 'react-router';
  import { Button } from '~/components/ui/button';
  import { workoutSchema } from '~/schemas/models';
  import { ConformInput, ConformMultiSelect, ConformSelect, ConformTextarea } from './ui/conform';
  
  type FormWorkout = Omit<ReturnType<typeof workoutSchema.parse>, 'id'>;
  
  interface WorkoutFormProps {
    lastResult?: SubmissionResult;
    initialData?: FormWorkout;
    mode?: 'create' | 'edit';
  }
  
  export function WorkoutForm({ lastResult, initialData, mode = 'create' }: WorkoutFormProps) {
    const [form, fields] = useForm<FormWorkout>({
      id: 'workout',
      shouldValidate: 'onSubmit',
      lastResult,
      defaultValue: initialData,  // pre-populate with workout data if editing
      onValidate: ({ formData }: { formData: FormData }) =>
        parseWithZod(formData, { schema: workoutSchema.omit({ id: true }) }),
    });
  
    // ... the rest of the component remains the same
    return (
      <form
        method="post"
        className="space-y-6 bg-white p-8 border-4 border-black"
        id={form.id}
        onSubmit={form.onSubmit}
      >
        <h1 className="text-3xl font-bold tracking-tight text-black uppercase">
          {mode === 'edit' ? 'Edit Workout' : 'Create Workout'}
        </h1>
        {/* ... rest of form fields */}
        <Button
          type="submit"
          className="w-full bg-black text-white px-4 py-3 uppercase font-bold hover:bg-gray-800 transition-colors"
        >
          {mode === 'edit' ? 'Save Changes' : 'Create Workout'}
        </Button>
      </form>
    );
  }
  ~~~
- **Verification:** Verify that when the `WorkoutForm` component is used with an `initialData` prop and mode set to "edit", the header text and button text change accordingly.
- **Commit:** Stage and commit your changes:
  ~~~bash
  git add app/components/workout-form.tsx
  git commit -m "feat: update WorkoutForm to support editing" -m "added initialData and mode props to pre-populate form for edit" | cat
  ~~~

---

**Step 5: Update the Action Function in edit.tsx to Update the Workout**  
- **Action:** In the `edit.tsx` route file, add an action that will update the workout record in the database rather than inserting a new one. For example:
  ~~~tsx
  // Append in app/routes/workouts/edit.tsx
  import { redirect } from 'react-router';
  import { workoutSchema } from '~/schemas/models';
  
  export async function action({ request, context, params }: Route.ActionArgs) {
    const db = context.cloudflare.env.DB;
    const formData = await request.formData();
    const submission = await parseWithZod(formData, { schema: workoutSchema.omit({ id: true }) });
  
    if (submission.status !== 'success') {
      return submission.reply();
    }
  
    const data = submission.value;
    const { id } = params;
    if (!id) {
      throw new Response('Workout ID is required', { status: 400 });
    }
  
    try {
      // Example SQL update query – adjust column names as necessary
      await db
        .prepare(
          `
          UPDATE workouts 
          SET name = ?, description = ?, scheme = ?, reps_per_round = ?, rounds_to_score = ?,
              tiebreak_scheme = ?, secondary_scheme = ?
          WHERE id = ?
          `
        )
        .bind(
          data.name,
          data.description,
          data.scheme,
          data.repsPerRound ?? null,
          data.roundsToScore ?? null,
          data.tiebreakScheme ?? null,
          data.secondaryScheme ?? null,
          id
        )
        .run();
  
      // Optionally update workout movements if provided
      // (You might need to remove existing movements and insert new links)
  
      return redirect(`/workouts/${id}`);
    } catch (error) {
      console.error('Error updating workout:', error);
      return submission.reply({ formErrors: ['Internal server error'] });
    }
  }
  ~~~
- **Verification:** Test the update by editing a workout and verifying that the changes are reflected in the database.
- **Commit:** Stage and commit the action changes:
  ~~~bash
  git add app/routes/workouts/edit.tsx
  git commit -m "feat: implement action for workout edit form" -m "action updates workout record in DB" | cat
  ~~~

---

**Step 6: Add or Update Tests / Verification Steps**  
- **Action:** If automated tests exist for workout creation, add similar tests for workout editing. Otherwise, perform manual verification:
  - Run the application.
  - Navigate to a workout’s edit page (e.g. `/workouts/edit/<id>`).
  - Verify that the form fields are pre-populated with existing data.
  - Make changes and submit.
  - Confirm that the workout data has been updated (check the workout details page).
  ~~~bash
  # Run your test suite if available
  npm test | cat
  ~~~
- **Commit:** Stage and commit any new or updated tests:
  ~~~bash
  git add path/to/tests/
  git commit -m "test: add tests for workout edit form" -m "ensure workout edit functionality works as expected" | cat
  ~~~

---

**Step 7: Push the Branch and Create a Pull Request**  
- **Action:** Push your branch to GitHub:
  ~~~bash
  git push -u origin feature/workout-edit-form | cat
  ~~~
- **Verification:** Verify your branch was pushed:
  ~~~bash
  git branch -vv | cat
  ~~~
- **Action:** Create a pull request using the GitHub CLI with a body file for the PR description. First, create a temporary PR description file:
  ~~~bash
  cat > /tmp/pr-description.md << 'EOF'
  ## Summary
  This PR adds a workout edit form by reusing the existing workout create form component. It loads the existing workout data, pre-populates the form fields, and updates the workout record upon submission.
  
  ## Changes Made
  - Created a new route file at `app/routes/workouts/edit.tsx` with loader and action.
  - Added a new `WorkoutEditForm` component in `app/components/workout-edit-form.tsx`.
  - Updated `WorkoutForm` to accept `initialData` and a `mode` prop.
  - Implemented an update action in the edit route.
  
  ## Testing
  - Verified manually by editing a workout and confirming the updates.
  - Automated tests updated/added.
  
  ## Additional Notes
  None.
  EOF
  ~~~
- **Action:** Use the temporary file to create the PR:
  ~~~bash
  gh pr create --title "feat: Implement workout edit form" --body-file /tmp/pr-description.md | cat
  ~~~
- **Action:** Remove the temporary file:
  ~~~bash
  rm /tmp/pr-description.md | cat
  ~~~
- **Verification:** Check the URL output by the command to ensure the PR was created.

---

**Step 8: Return to Main Branch**  
- **Action:** Switch back to the main branch:
  ~~~bash
  git checkout main | cat
  ~~~
- **Verification:** Confirm you’re on main:
  ~~~bash
  git branch --show-current | cat
  ~~~
- **Commit:** No commit required.

---

By following these steps, you will have successfully added a workout edit form that mirrors the create form but edits an existing workout.