import { z } from 'zod';
import { cnpjRegex } from '../utils/cpfCnpj';

export const createEmpresaSchema = z.object({
  cnpj: z.string().regex(cnpjRegex, 'CNPJ inválido'),
  nome: z.string().min(2),
  email: z.string().email(),
  telefone: z.string().min(8),
  descricao: z.string().min(10),
  cep: z.string(),
  cidade: z.string(),
  estado: z.string(),
  senha: z.string().min(6),
});

export const updateEmpresaSchema = createEmpresaSchema.partial().omit({ senha: true, cnpj: true, email: true });
