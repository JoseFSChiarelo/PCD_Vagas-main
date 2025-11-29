import { prisma } from '../config/prisma';
import { empresaRepo } from '../repositories/empresa.repository';

export const adminService = {
  salvarDeficiencia: (nome: string, descricao?: string) =>
    prisma.deficienciaCatalogo.create({ data: { nome, descricao: descricao ?? null } }),

  salvarBarreira: async (nome: string, descricao?: string, deficienciaId?: number) => {
    if (!deficienciaId) throw { status: 400, message: 'deficienciaId é obrigatório' };
    const def = await prisma.deficienciaCatalogo.findUnique({ where: { id: deficienciaId } });
    if (!def) throw { status: 404, message: 'Deficiência não encontrada' };
    return prisma.barreiraCatalogo.create({ data: { nome, descricao: descricao ?? null, deficienciaId } });
  },

  salvarSubtipoBarreira: async (nome: string, descricao?: string, barreiraId?: number) => {
    if (!barreiraId) throw { status: 400, message: 'barreiraId é obrigatório' };
    const bar = await prisma.barreiraCatalogo.findUnique({ where: { id: barreiraId } });
    if (!bar) throw { status: 404, message: 'Barreira não encontrada' };
    return prisma.subtipoBarreiraCatalogo.create({ data: { nome, descricao: descricao ?? null, barreiraId } });
  },

  salvarAcessibilidade: (nome: string, descricao?: string) =>
    prisma.acessibilidadeCatalogo.create({ data: { nome, descricao: descricao ?? null } }),

  salvarSubtipoAcessibilidade: async (nome: string, descricao?: string, acessibilidadeId?: number) => {
    if (!acessibilidadeId) throw { status: 400, message: 'acessibilidadeId é obrigatório' };
    const acc = await prisma.acessibilidadeCatalogo.findUnique({ where: { id: acessibilidadeId } });
    if (!acc) throw { status: 404, message: 'Acessibilidade não encontrada' };
    return prisma.subtipoAcessibilidadeCatalogo.create({
      data: { nome, descricao: descricao ?? null, acessibilidadeId },
    });
  },

  listarEmpresasPendentes: () => empresaRepo.listarPendentes(),
  aprovarEmpresa: (id: number) => empresaRepo.aprovar(id),

  listarHierarquia: async () => {
    const deficiencias = await prisma.deficienciaCatalogo.findMany({
      include: {
        barreiras: {
          include: {
            subtipos: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });

    const acessibilidades = await prisma.acessibilidadeCatalogo.findMany({
      include: { subtipos: true },
      orderBy: { id: 'asc' },
    });

    return { deficiencias, acessibilidades };
  },
};
