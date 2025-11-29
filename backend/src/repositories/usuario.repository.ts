import { prisma } from '../config/prisma';
import { Escolaridade, Sexo, TipoDeficiencia } from '@prisma/client';

export const usuarioRepo = {
  create: (data: {
    cpf: string; email: string; celular: string; nome: string; nascimento: Date;
    sexo: Sexo; escolaridade: Escolaridade; tipo_deficiencia: TipoDeficiencia;
    subtipo_deficiencia: string; barreiras: string; acessibilidades_necessarias: string;
    buscando_emprego: boolean; cep: string; cidade: string; estado: string; senha: string;
  }) => prisma.usuario.create({ data }),
  findByEmail: (email: string) => prisma.usuario.findUnique({ where: { email } }),
  findById: (id: number) => prisma.usuario.findUnique({ where: { id_usuario: id } }),
  update: (id: number, data: any) => prisma.usuario.update({ where: { id_usuario: id }, data }),
};