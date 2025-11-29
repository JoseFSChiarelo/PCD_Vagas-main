import { z } from 'zod';

export const loginUsuarioSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
});

export const loginEmpresaSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
});

export const loginAdminSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(4),
});
