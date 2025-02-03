import { z } from "zod";

// Movement type enum as a const for type safety
const MovementType = {
  STRENGTH: "strength",
  GYMNASTIC: "gymnastic",
  MONOSTRUCTURAL: "monostructural",
} as const;

// Base movement schema without ID
export const createMovementSchema = z.object({
  name: z.string().min(1, "Movement name is required"),
  type: z.enum([MovementType.STRENGTH, MovementType.GYMNASTIC, MovementType.MONOSTRUCTURAL], {
    required_error: "Movement type is required",
    invalid_type_error: "Invalid movement type",
  }),
});

// Movement schema with ID for existing movements
export const movementSchema = createMovementSchema.extend({
  id: z.string().min(1),
});

// Type for creating a new movement
export type CreateMovement = z.infer<typeof createMovementSchema>;

// Type for an existing movement
export type Movement = z.infer<typeof movementSchema>;

// Movement type enum export
export const MOVEMENT_TYPES = Object.values(MovementType);
