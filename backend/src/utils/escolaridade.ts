import { Escolaridade } from '@prisma/client';
const ordem: Escolaridade[] = [
  'FUNDAMENTAL',
  'MEDIO',
  'SUPERIOR',
  'MESTRADO',
  'DOUTORADO',
];
export const escolaridadeGTE = (usuarioNivel: Escolaridade, minimo: Escolaridade) =>
  ordem.indexOf(usuarioNivel) >= ordem.indexOf(minimo);