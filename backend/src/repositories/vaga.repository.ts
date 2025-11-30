import { prisma } from '../config/prisma';
import { StatusVaga, TipoDeficiencia } from '@prisma/client';

export const vagaRepo = {
  create: (data: any) => prisma.vaga.create({ data }),
  update: (id: number, data: any) => prisma.vaga.update({ where: { id_vaga: id }, data }),
  findById: (id: number) => prisma.vaga.findUnique({ where: { id_vaga: id } }),
  listPublic: () => prisma.vaga.findMany({
    where: { status: StatusVaga.ATIVO, OR: [{ data_fechamento: null }, { data_fechamento: { gt: new Date() } }] },
    select: { id_vaga: true, titulo: true, tipo_vaga: true, cidade: true, estado: true, status: true },
    orderBy: { createdAt: 'desc' },
  }),
  setExpiredIfNeeded: async (id: number) => {
    const vaga = await prisma.vaga.findUnique({ where: { id_vaga: id } });
    if (vaga?.data_fechamento && vaga.status === StatusVaga.ATIVO && vaga.data_fechamento < new Date()) {
      await prisma.vaga.update({ where: { id_vaga: id }, data: { status: StatusVaga.EXPIRADO } });
    }
  },
  listByEmpresa: (empresaId: number) => prisma.vaga.findMany({ where: { empresaId } }),
  listCompatByTipo: (tipo: TipoDeficiencia) =>
    prisma.vaga.findMany({
      where: {
        status: StatusVaga.ATIVO,
        deficiencias_compativeis: { has: tipo },
        OR: [{ data_fechamento: null }, { data_fechamento: { gt: new Date() } }],
      },
      select: {
        id_vaga: true,
        titulo: true,
        tipo_vaga: true,
        cidade: true,
        estado: true,
        salario: true,
        beneficios: true,
        escolaridade_minima: true,
        acessibilidades_oferecidas: true,
        deficiencias_compativeis: true,
        status: true,
        empresa: { select: { nome: true, cidade: true, estado: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
};
