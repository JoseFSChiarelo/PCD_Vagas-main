import { vagaRepo } from '../repositories/vaga.repository';
import { StatusVaga, TipoVaga } from '@prisma/client';

export const vagaService = {
  publicar: async (empresaId: number, data: any) => {
    if (data.tipo_vaga !== 'REMOTA') {
      if (!data.cidade || !data.estado) throw { status: 400, message: 'Cidade e estado são obrigatórios para vaga não remota' };
    }
    const data_fechamento = data.data_fechamento ? new Date(data.data_fechamento) : null;
    return vagaRepo.create({ ...data, empresaId, data_fechamento, status: StatusVaga.ATIVO });
  },
  editar: async (id: number, data: any) => vagaRepo.update(id, data),
  desativar: async (id: number) => vagaRepo.update(id, { status: StatusVaga.DESATIVADO }),
  detalhar: async (id: number) => {
    await vagaRepo.setExpiredIfNeeded(id);
    return vagaRepo.findById(id);
  },
  listarPublicas: async () => vagaRepo.listPublic(),
  listarEmpresa: async (empresaId: number) => vagaRepo.listByEmpresa(empresaId),
};