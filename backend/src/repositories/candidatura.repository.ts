import { prisma } from '../config/prisma';

export const candidaturaRepo = {
  create: (id_vaga: number, id_usuario: number) =>
    prisma.vagaUsuario.create({ data: { id_vaga, id_usuario } }),
  exists: (id_vaga: number, id_usuario: number) =>
    prisma.vagaUsuario.findUnique({ where: { id_vaga_id_usuario: { id_vaga, id_usuario } } }),
  listByVaga: (id_vaga: number) => prisma.vagaUsuario.findMany({
    where: { id_vaga },
    include: {
      usuario: {
        select: {
          nome: true,
          escolaridade: true,
          email: true,
          nascimento: true,
          tipo_deficiencia: true,
          acessibilidades_necessarias: true,
        },
      },
    },
  }),
};