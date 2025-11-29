import { usuarioRepo } from '../repositories/usuario.repository';
import { hashPassword } from '../utils/bcrypt';

export const usuarioService = {
  cadastrar: async (data: any) => {
    const nascimento = new Date(data.nascimento);
    const senha = await hashPassword(data.senha);
    return usuarioRepo.create({ ...data, nascimento, senha });
  },
  editar: async (id: number, data: any) => usuarioRepo.update(id, data),
  obter: async (id: number) => usuarioRepo.findById(id),
};