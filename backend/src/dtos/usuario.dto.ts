import { z } from 'zod';
import { cpfRegex } from '../utils/cpfCnpj';

export const createUsuarioSchema = z.object({
  cpf: z.string().regex(cpfRegex, 'CPF inválido'),
  email: z.string().email(),
  celular: z.string().min(8),
  nome: z.string().min(2),
  nascimento: z.string().datetime().or(z.string()), // aceitar ISO, validar no service
  sexo: z.enum(['MASCULINO','FEMININO','NAO_BINARIO','PREFERE_NAO_INFORMAR']),
  escolaridade: z.enum(['FUNDAMENTAL','MEDIO','SUPERIOR','MESTRADO','DOUTORADO']),
  tipo_deficiencia: z.enum(['FISICA','AUDITIVA','VISUAL','INTELECTUAL','PSICOSOCIAL','MULTIPLA','OUTRA']),
  subtipo_deficiencia: z.string(),
  barreiras: z.string(),
  acessibilidades_necessarias: z.string(),
  buscando_emprego: z.boolean().default(true),
  cep: z.string(),
  cidade: z.string(),
  estado: z.string(),
  senha: z.string().min(6),
});

export const updateUsuarioSchema = createUsuarioSchema.partial().omit({ senha: true, cpf: true, email: true });