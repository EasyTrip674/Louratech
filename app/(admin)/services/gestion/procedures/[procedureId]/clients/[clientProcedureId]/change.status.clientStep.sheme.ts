import { z } from "zod";

export const StatusSchema = z.enum(['PENDING', 'IN_PROGRESS', 'WAITING', 'COMPLETED', 'SKIPPED', 'FAILED', 'NOT_STARTED']);
export type Status = z.infer<typeof StatusSchema>;

export const ChangeStatusSchema = z.object({
  clientStepId: z.string(),
  status: StatusSchema
});
