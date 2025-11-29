import { prisma } from '../config/prisma';
export const empresaRepo = {
  create: (data: any) => prisma.empresa.create({ data }),
  findByEmail: (email: string) => prisma.empresa.findUnique({ where: { email } }),
  findById: (id: number) => prisma.empresa.findUnique({ where: { id_empresa: id } }),
  update: (id: number, data: any) => prisma.empresa.update({ where: { id_empresa: id }, data }),
};