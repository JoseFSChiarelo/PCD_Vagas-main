/// <reference types="node" />
import 'dotenv/config';
import { prisma } from '../src/config/prisma';
import { Escolaridade, StatusVaga, TipoDeficiencia, TipoVaga } from '@prisma/client';

type VagaSeed = {
  titulo: string;
  descricao: string;
  beneficios?: string;
  tipo_vaga: TipoVaga;
  cidade?: string;
  estado?: string;
  salario?: string;
  acessibilidades_oferecidas?: string;
  deficiencias_compativeis: TipoDeficiencia[];
  escolaridade_minima: Escolaridade;
};

const vagasFantasmas: VagaSeed[] = [
  {
    titulo: 'Analista de Acessibilidade Digital',
    descricao: 'Garantir acessibilidade WCAG em produtos e apoiar squads com testes usando leitor de tela.',
    beneficios: 'VR, VA, plano de saude, auxilio home office.',
    tipo_vaga: TipoVaga.REMOTA,
    salario: 'R$ 8.500',
    acessibilidades_oferecidas: 'Compatibilidade com leitor de tela, navegacao por teclado, ferramentas acessiveis.',
    deficiencias_compativeis: [TipoDeficiencia.VISUAL],
    escolaridade_minima: Escolaridade.SUPERIOR,
  },
  {
    titulo: 'Especialista em Libras e Inclusao',
    descricao: 'Atuar como ponto focal para comunicacao inclusiva, revisao de materiais e treinamentos em Libras.',
    beneficios: 'Plano de saude, VT, VR, apoio psicologico.',
    tipo_vaga: TipoVaga.HIBRIDA,
    cidade: 'Sao Paulo',
    estado: 'SP',
    salario: 'R$ 6.200',
    acessibilidades_oferecidas: 'Interpretacao de Libras, legendagem de videos, comunicacao escrita clara.',
    deficiencias_compativeis: [TipoDeficiencia.AUDITIVA],
    escolaridade_minima: Escolaridade.MEDIO,
  },
  {
    titulo: 'Engenheiro de Produto - Mobilidade',
    descricao: 'Desenvolver solucoes e desenhar fluxos pensando em pessoas com mobilidade reduzida.',
    beneficios: 'VR, VA, plano odontologico, gympass.',
    tipo_vaga: TipoVaga.PRESENCIAL,
    cidade: 'Curitiba',
    estado: 'PR',
    salario: 'R$ 10.000',
    acessibilidades_oferecidas: 'Rampas, elevador, mobiliario ajustavel, vagas de estacionamento reservadas.',
    deficiencias_compativeis: [TipoDeficiencia.FISICA],
    escolaridade_minima: Escolaridade.SUPERIOR,
  },
  {
    titulo: 'Assistente Administrativo Inclusivo',
    descricao: 'Rotinas administrativas com trilha de onboarding simplificada e mentor dedicado.',
    beneficios: 'VR, plano de saude, trilha de desenvolvimento.',
    tipo_vaga: TipoVaga.PRESENCIAL,
    cidade: 'Recife',
    estado: 'PE',
    salario: 'R$ 2.800',
    acessibilidades_oferecidas: 'Treinamento em linguagem simples, feedback estruturado, ambiente organizado.',
    deficiencias_compativeis: [TipoDeficiencia.INTELECTUAL],
    escolaridade_minima: Escolaridade.MEDIO,
  },
  {
    titulo: 'Analista de Bem-Estar e Clima',
    descricao: 'Planejar programas de saude mental, moderar grupos de apoio e criar politicas anticapacitistas.',
    beneficios: 'Plano de saude, apoio terapeutico, horario flexivel.',
    tipo_vaga: TipoVaga.HIBRIDA,
    cidade: 'Porto Alegre',
    estado: 'RS',
    salario: 'R$ 5.500',
    acessibilidades_oferecidas: 'Politicas anti estigma, carga ajustavel, ambiente com sala silenciosa.',
    deficiencias_compativeis: [TipoDeficiencia.PSICOSOCIAL],
    escolaridade_minima: Escolaridade.SUPERIOR,
  },
  {
    titulo: 'Coordenador de Diversidade e Inclusao',
    descricao: 'Liderar estrategias de D&I e articular redes de apoio entre funcionarios.',
    beneficios: 'VR, VA, bonus anual, plano de saude.',
    tipo_vaga: TipoVaga.HIBRIDA,
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    salario: 'R$ 12.000',
    acessibilidades_oferecidas: 'Plano de adaptacoes sob demanda e recursos combinados.',
    deficiencias_compativeis: [TipoDeficiencia.MULTIPLA],
    escolaridade_minima: Escolaridade.SUPERIOR,
  },
  {
    titulo: 'Analista de Dados Inclusivo',
    descricao: 'Criar dashboards e acompanhar indicadores de diversidade, com flexibilidade de formato de trabalho.',
    beneficios: 'Auxilio home office, VR, plano de saude.',
    tipo_vaga: TipoVaga.REMOTA,
    salario: 'R$ 7.200',
    acessibilidades_oferecidas: 'Equipamentos adaptados sob demanda, horarios flexiveis, gestor capacitado.',
    deficiencias_compativeis: [TipoDeficiencia.OUTRA],
    escolaridade_minima: Escolaridade.SUPERIOR,
  },
];

async function main() {
  const empresa =
    (await prisma.empresa.findFirst({ where: { aprovada: true } })) ||
    (await prisma.empresa.findFirst());

  if (!empresa) {
    throw new Error('Nenhuma empresa encontrada para associar vagas.');
  }

  console.log(`Usando empresa id=${empresa.id_empresa} (${empresa.nome}) para criar vagas fantasmas.`);

  for (const vaga of vagasFantasmas) {
    const existente = await prisma.vaga.findFirst({
      where: { titulo: vaga.titulo, empresaId: empresa.id_empresa },
    });

    if (existente) {
      console.log(`Vaga "${vaga.titulo}" ja existe. Pulando...`);
      continue;
    }

    await prisma.vaga.create({
      data: {
        ...vaga,
        empresaId: empresa.id_empresa,
        status: StatusVaga.ATIVO,
        data_fechamento: null,
      },
    });
    console.log(`Criada vaga fantasma: ${vaga.titulo}`);
  }

  console.log('Seed de vagas fantasmas finalizado.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
