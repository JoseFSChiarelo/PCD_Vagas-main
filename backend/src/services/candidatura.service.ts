import { candidaturaRepo } from '../repositories/candidatura.repository';
import { vagaRepo } from '../repositories/vaga.repository';
import { usuarioRepo } from '../repositories/usuario.repository';
import { Escolaridade, StatusVaga } from '@prisma/client';
import { escolaridadeGTE } from '../utils/escolaridade';

export const candidaturaService = {
  candidatar: async (id_vaga: number, id_usuario: number) => {
    const [vaga, usuario] = await Promise.all([
      vagaRepo.findById(id_vaga),
      usuarioRepo.findById(id_usuario),
    ]);
    if (!vaga) throw { status: 404, message: 'Vaga não encontrada' };
    if (!usuario) throw { status: 404, message: 'Usuário não encontrado' };

    // valida vaga ativa e não expirada
    if (vaga.status !== StatusVaga.ATIVO) throw { status: 400, message: 'Vaga não está ativa' };
    if (vaga.data_fechamento && vaga.data_fechamento < new Date()) throw { status: 400, message: 'Vaga expirada' };

    // match de deficiência: pelo menos uma compatível
    const comp = vaga.deficiencias_compativeis.includes(usuario.tipo_deficiencia);
    if (!comp) throw { status: 400, message: 'Deficiência não compatível com a vaga' };

    // escolaridade mínima: vamos assumir campo minimo na vaga? Não especificado; usaremos SUPERVISÃO via regra abaixo:
    // Para demonstrar, consideraremos que a vaga exige ao menos MEDIO se não informado:
    const minimo: Escolaridade = 'MEDIO';
    if (!escolaridadeGTE(usuario.escolaridade, minimo)) throw { status: 400, message: 'Escolaridade abaixo do mínimo' };

    // duplicidade
    const exists = await candidaturaRepo.exists(id_vaga, id_usuario);
    if (exists) throw { status: 409, message: 'Já candidato a esta vaga' };

    return candidaturaRepo.create(id_vaga, id_usuario);
  },
  listarCandidatosParaEmpresa: async (id_vaga: number) => {
    const candidatos = await candidaturaRepo.listByVaga(id_vaga);
    // mapear idade
    return candidatos.map(c => {
      const idade = new Date().getFullYear() - c.usuario.nascimento.getFullYear();
      return {
        nome: c.usuario.nome,
        escolaridade: c.usuario.escolaridade,
        email: c.usuario.email,
        idade,
        deficiencia: c.usuario.tipo_deficiencia,
        acessibilidade_necessaria: c.usuario.acessibilidades_necessarias,
        createdAt: c.createdAt,
      };
    });
  },
};