import { empresaRepo } from '../repositories/empresa.repository';

type CatalogoItem = {
  id: number;
  nome: string;
  descricao?: string | undefined;
  tipo: string;
  createdAt: Date;
  parentId?: number | undefined;
  parentTipo?: string | undefined;
};

const catalogoMemoria: CatalogoItem[] = [];
let seq = 1;

function adicionarCatalogo(tipo: string, nome: string, descricao?: string, parentId?: number, parentTipo?: string) {
  const item: CatalogoItem = {
    id: seq++,
    nome,
    tipo,
    createdAt: new Date(),
    descricao: descricao ?? undefined,
    parentId: parentId ?? undefined,
    parentTipo: parentId ? parentTipo : undefined,
  };
  catalogoMemoria.push(item);
  return item;
}

export const adminService = {
  salvarDeficiencia: (nome: string, descricao?: string) => adicionarCatalogo('deficiencia', nome, descricao),
  salvarBarreira: (nome: string, descricao?: string, deficienciaId?: number) => {
    if (!deficienciaId) throw { status: 400, message: 'deficienciaId é obrigatório' };
    const def = catalogoMemoria.find((c) => c.id === deficienciaId && c.tipo === 'deficiencia');
    if (!def) throw { status: 404, message: 'Deficiência não encontrada' };
    return adicionarCatalogo('barreira', nome, descricao, deficienciaId, 'deficiencia');
  },
  salvarSubtipoBarreira: (nome: string, descricao?: string, barreiraId?: number) => {
    if (!barreiraId) throw { status: 400, message: 'barreiraId é obrigatório' };
    const bar = catalogoMemoria.find((c) => c.id === barreiraId && c.tipo === 'barreira');
    if (!bar) throw { status: 404, message: 'Barreira não encontrada' };
    return adicionarCatalogo('subtipo_barreira', nome, descricao, barreiraId, 'barreira');
  },
  salvarAcessibilidade: (nome: string, descricao?: string) => adicionarCatalogo('acessibilidade', nome, descricao),
  salvarSubtipoAcessibilidade: (nome: string, descricao?: string, acessibilidadeId?: number) => {
    if (!acessibilidadeId) throw { status: 400, message: 'acessibilidadeId é obrigatório' };
    const acc = catalogoMemoria.find((c) => c.id === acessibilidadeId && c.tipo === 'acessibilidade');
    if (!acc) throw { status: 404, message: 'Acessibilidade não encontrada' };
    return adicionarCatalogo('subtipo_acessibilidade', nome, descricao, acessibilidadeId, 'acessibilidade');
  },

  listarEmpresasPendentes: () => empresaRepo.listarPendentes(),
  aprovarEmpresa: (id: number) => empresaRepo.aprovar(id),

  // exposicao opcional para depurar
  listarCatalogo: () => catalogoMemoria,
  listarCatalogoPorTipo: () => {
    return catalogoMemoria.reduce<Record<string, CatalogoItem[]>>((acc, item) => {
      const list = acc[item.tipo] || [];
      list.push(item);
      acc[item.tipo] = list;
      return acc;
    }, {});
  },
  listarHierarquia: () => {
    const deficiencias = catalogoMemoria
      .filter((c) => c.tipo === 'deficiencia')
      .map((def) => {
        const barreiras = catalogoMemoria
          .filter((b) => b.tipo === 'barreira' && b.parentId === def.id && b.parentTipo === 'deficiencia')
          .map((bar) => {
            const subtipos = catalogoMemoria.filter(
              (s) => s.tipo === 'subtipo_barreira' && s.parentId === bar.id && s.parentTipo === 'barreira',
            );
            return { ...bar, subtipos };
          });
        return { ...def, barreiras };
      });

    const acessibilidades = catalogoMemoria
      .filter((c) => c.tipo === 'acessibilidade')
      .map((acc) => {
        const subtipos = catalogoMemoria.filter(
          (s) => s.tipo === 'subtipo_acessibilidade' && s.parentId === acc.id && s.parentTipo === 'acessibilidade',
        );
        return { ...acc, subtipos };
      });

    return { deficiencias, acessibilidades };
  },
};
