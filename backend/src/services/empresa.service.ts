import { empresaRepo } from '../repositories/empresa.repository';
import { hashPassword } from '../utils/bcrypt';

export const empresaService = {
  cadastrar: async (data: any) => {
    const senha = await hashPassword(data.senha);
    return empresaRepo.create({ ...data, senha });
  },
  editar: async (id: number, data: any) => empresaRepo.update(id, data),
  obter: async (id: number) => empresaRepo.findById(id),
};