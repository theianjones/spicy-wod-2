import { movementSchema } from "~/schemas/models";
import type { Route } from "../+types/root";

export async function getAllMovements({ context }: { context: Route.LoaderArgs["context"] }) {
  const db = context.cloudflare.env.DB
  const result = await db.prepare("SELECT * FROM movements").all()

  const movements = result.results.map((movement) => movementSchema.parse(movement))
  
  return {
      movements
  }
}