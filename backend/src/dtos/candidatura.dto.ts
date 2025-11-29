import { z } from 'zod';
export const candidaturaSchema = z.object({
  id_vaga: z.number().int(),
});