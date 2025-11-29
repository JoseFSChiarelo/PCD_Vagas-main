import { z } from 'zod';

export const createVagaSchema = z.object({
  titulo: z.string().min(10),
  descricao: z.string().max(200),
  beneficios: z.string(),
  deficiencias_compativeis: z.array(z.string()).min(1),  tipo_vaga: z.enum(['REMOTA','HIBRIDA','PRESENCIAL']),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  salario: z.string(),
  acessibilidades_oferecidas: z.string(),
  data_fechamento: z.string().optional(),
  escolaridade_minima: z.enum(['FUNDAMENTAL', 'MEDIO', 'SUPERIOR', 'MESTRADO', 'DOUTORADO']),
});

export const updateVagaSchema = createVagaSchema.partial();