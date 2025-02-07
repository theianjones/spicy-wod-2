# Movement Pages Implementation

## Prerequisites

1. Verify database schema access ✅
   ```bash
   pnpm drizzle-kit studio
   ```
2. Verify existing workouts functionality ✅
   ```bash
   curl http://localhost:8787/workouts
   ```

## Execution Steps

1. Create movement route file:

   ```typescript
   // app/routes/movements.$id.tsx
   import { useLoaderData } from 'react-router';
   import { json } from '@react-router/cloudflare';
   import { eq } from 'drizzle-orm';
   import { movements, workoutMovements, workouts } from '~/schemas/models';

   export async function loader({ params, context }) {
     const { id } = params;
     const db = context.cloudflare.env.DB;

     const movement = await db.query.movements.findFirst({
       where: eq(movements.id, id),
     });

     if (!movement) {
       throw new Response('Movement not found', { status: 404 });
     }

     const relatedWorkouts = await db
       .select()
       .from(workouts)
       .innerJoin(workoutMovements, eq(workouts.id, workoutMovements.workoutId))
       .where(eq(workoutMovements.movementId, id));

     return json({ movement, relatedWorkouts });
   }

   export default function MovementPage() {
     const { movement, relatedWorkouts } = useLoaderData();

     return (
       <div className="container mx-auto p-6">
         <h1 className="text-3xl font-bold mb-6">{movement.name}</h1>

         <div className="mb-6">
           <h2 className="text-xl font-semibold mb-2">Movement Details</h2>
           <div className="border p-4">
             <p><span className="font-medium">Type:</span> {movement.type}</p>
           </div>
         </div>

         <div>
           <h2 className="text-xl font-semibold mb-2">Featured In Workouts</h2>
           <div className="grid gap-4">
             {relatedWorkouts.map((workout) => (
               <div key={workout.id} className="border p-4">
                 <h3 className="font-medium">{workout.name}</h3>
                 <p>{workout.description}</p>
               </div>
             ))}
           </div>
         </div>
       </div>
     );
   }
   ```

2. Update workout card component to make movement tags clickable:

   ```typescript
   // app/components/workouts/workout-card.tsx
   import { Link } from 'react-router';

   // ... existing imports ...

   // Inside the WorkoutCard component where movements are rendered:
   {movements.map((movement) => (
     <Link
       key={movement.id}
       to={`/movements/${movement.id}`}
       className="inline-block border px-2 py-1 mr-2 mb-2 hover:bg-gray-100"
     >
       {movement.name}
     </Link>
   ))}
   ```

## Validation Checkpoints

1. Verify route file creation:

   ```bash
   test -f app/routes/movements.$id.tsx && echo "Route file exists"
   ```

2. Test movement page loading:

   ```bash
   curl http://localhost:8787/movements/[existing-movement-id]
   ```

3. Verify movement links in workout cards:
   ```bash
   grep -r "Link.*movements" app/components/workouts/workout-card.tsx
   ```

## Error Handling

1. If movement not found:

   - Ensure 404 response is properly handled
   - Verify error boundary exists in route
   - Check database connection

2. If related workouts query fails:

   - Verify join conditions
   - Check table relationships
   - Ensure proper error handling middleware

3. If movement links don't work:
   - Verify Link component imports
   - Check routing configuration
   - Validate movement IDs in database

## Post-Execution

1. Test all movement links:

   ```bash
   pnpm test
   ```

2. Verify mobile responsiveness:

   ```bash
   curl -H "User-Agent: Mobile" http://localhost:8787/movements/[id]
   ```

3. Check performance:
   ```bash
   curl -w "%{time_total}\n" -o /dev/null -s http://localhost:8787/movements/[id]
   ```
