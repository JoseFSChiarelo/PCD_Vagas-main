import 'dotenv/config';
import { prisma } from '../src/config/prisma';
import process from 'process';

type Subtipo = { nome: string; descricao?: string };
type Barreira = { nome: string; descricao?: string; subtipos?: Subtipo[] };
type Deficiencia = { nome: string; descricao?: string; barreiras?: Barreira[] };
type Acessibilidade = { nome: string; descricao?: string; subtipos?: Subtipo[] };

const dados: { deficiencias: Deficiencia[]; acessibilidades: Acessibilidade[] } = {
  deficiencias: [
    {
      nome: 'Deficiência física',
      descricao: 'Alterações no sistema neuromusculoesquelético que afetam mobilidade, coordenação motora ou postura.',
      barreiras: [
        { nome: 'Barreira urbanística', descricao: 'Obstáculos nas vias públicas, calçadas e espaços urbanos.' },
        { nome: 'Barreira arquitetônica', descricao: 'Desenho de prédios e ambientes internos sem acessibilidade.' },
        { nome: 'Barreira nos transportes', descricao: 'Meios de transporte sem equipamentos ou espaço adequado.' },
        { nome: 'Barreira tecnológica', descricao: 'Máquinas e sistemas sem adaptações para mobilidade reduzida.' },
        { nome: 'Barreira atitudinal', descricao: 'Preconceitos e recusa de adaptações razoáveis.' },
      ],
    },
    {
      nome: 'Deficiência auditiva',
      descricao: 'Perda parcial ou total da audição, em um ou ambos os ouvidos, em graus variáveis.',
      barreiras: [
        {
          nome: 'Barreira na comunicação e informação',
          descricao: 'Falta de Libras, legendas, textos escritos e outros recursos visuais.',
        },
        { nome: 'Barreira tecnológica', descricao: 'Sistemas baseados apenas em voz/telefone.' },
        { nome: 'Barreira atitudinal', descricao: 'Preconceito, gritar ou supor baixa inteligência.' },
      ],
    },
    {
      nome: 'Deficiência visual',
      descricao: 'Cegueira, baixa visão, visão monocular ou redução importante do campo visual.',
      barreiras: [
        { nome: 'Barreira urbanística', descricao: 'Falta de piso tátil e semáforo sonoro.' },
        { nome: 'Barreira arquitetônica', descricao: 'Escadas sem contraste, má sinalização interna.' },
        { nome: 'Barreira na comunicação e informação', descricao: 'Materiais só em imagem, sem audiodescrição.' },
        { nome: 'Barreira tecnológica', descricao: 'Sistemas incompatíveis com leitores de tela.' },
      ],
    },
    {
      nome: 'Deficiência intelectual',
      descricao: 'Funcionamento intelectual abaixo da média, com limitações adaptativas antes dos 18 anos.',
      barreiras: [
        { nome: 'Barreira de comunicação', descricao: 'Linguagem técnica e instruções confusas.' },
        { nome: 'Barreira atitudinal', descricao: 'Infantilização e superproteção.' },
        { nome: 'Barreira organizacional', descricao: 'Processos rígidos e treinamentos rápidos.' },
      ],
    },
    {
      nome: 'Deficiência psicossocial (mental)',
      descricao: 'Condições de saúde mental com limitações significativas em diversas áreas da vida.',
      barreiras: [
        { nome: 'Barreira atitudinal', descricao: 'Estigma, piadas, medo injustificado.' },
        { nome: 'Barreira organizacional', descricao: 'Ambientes caóticos e metas abusivas.' },
        { nome: 'Barreira de comunicação', descricao: 'Feedback agressivo, falta de escuta.' },
      ],
    },
    {
      nome: 'Transtorno do Espectro Autista (TEA)',
      descricao: 'Condição do neurodesenvolvimento que afeta comunicação e interação social.',
      barreiras: [
        { nome: 'Barreira ambiental/sensorial', descricao: 'Ruído, luz forte, cheiros intensos.' },
        { nome: 'Barreira de comunicação', descricao: 'Ironia, duplo sentido, falta de clareza.' },
        { nome: 'Barreira atitudinal', descricao: 'Julgar comportamentos típicos do espectro como “frescura”.' },
      ],
    },
    {
      nome: 'Deficiência múltipla',
      descricao: 'Associação de duas ou mais deficiências na mesma pessoa.',
      barreiras: [{ nome: 'Barreira combinada', descricao: 'Soma das barreiras presentes em cada deficiência.' }],
    },
  ],
  acessibilidades: [
    {
      nome: 'Acessibilidade arquitetônica',
      descricao: 'Adaptações em prédios e ambientes internos.',
      subtipos: [
        { nome: 'Rampas de acesso', descricao: 'Substituem ou complementam escadas.' },
        { nome: 'Elevadores e plataformas elevatórias', descricao: 'Acesso entre andares.' },
        { nome: 'Banheiro acessível', descricao: 'Barras de apoio, espaço de giro, lavatório acessível.' },
        { nome: 'Portas e corredores alargados', descricao: 'Garantem passagem de cadeira de rodas.' },
      ],
    },
    {
      nome: 'Acessibilidade urbanística',
      descricao: 'Adaptações em ruas, calçadas e espaços públicos.',
      subtipos: [
        { nome: 'Piso tátil', descricao: 'Orienta pessoas cegas ou com baixa visão.' },
        { nome: 'Rebaixamento de calçadas', descricao: 'Facilita travessia com cadeira de rodas.' },
        { nome: 'Semáforo sonoro', descricao: 'Aviso sonoro para travessia segura.' },
      ],
    },
    {
      nome: 'Acessibilidade nos transportes',
      descricao: 'Veículos, estações e pontos adaptados.',
      subtipos: [
        { nome: 'Veículos com elevador/plataforma', descricao: 'Embarque de cadeirantes com autonomia.' },
        { nome: 'Assentos reservados', descricao: 'Lugares para pessoas com mobilidade reduzida.' },
        { nome: 'Espaço para cadeira de rodas', descricao: 'Área para fixação segura.' },
      ],
    },
    {
      nome: 'Acessibilidade na comunicação',
      descricao: 'Recursos em Libras, Braille, leitura fácil, audiodescrição, legendas.',
      subtipos: [
        { nome: 'Intérprete de Libras', descricao: 'Participação de pessoas surdas sinalizantes.' },
        { nome: 'Legendas em vídeos', descricao: 'Treinamentos e comunicados acessíveis.' },
        { nome: 'Material em Braille', descricao: 'Para leitura por pessoas cegas.' },
        { nome: 'Audiodescrição', descricao: 'Descreve elementos visuais em vídeos.' },
        { nome: 'Leitura fácil', descricao: 'Linguagem simplificada.' },
      ],
    },
    {
      nome: 'Acessibilidade atitudinal',
      descricao: 'Mudanças de comportamento e políticas de combate ao capacitismo.',
      subtipos: [
        { nome: 'Treinamentos de sensibilização', descricao: 'Formação em comportamento inclusivo.' },
        { nome: 'Políticas de combate ao capacitismo', descricao: 'Normas internas contra discriminação.' },
        { nome: 'Canais de denúncia de discriminação', descricao: 'Estrutura formal para apurar casos.' },
      ],
    },
    {
      nome: 'Acessibilidade instrumental',
      descricao: 'Adaptação de objetos, ferramentas e mobiliário.',
      subtipos: [
        { nome: 'Mobiliário regulável', descricao: 'Mesas e cadeiras com ajuste de altura.' },
        { nome: 'Dispositivos de entrada adaptados', descricao: 'Teclados especiais, mouses adaptados.' },
        { nome: 'Talheres grossos e utensílios adaptados', descricao: 'Facilitam uso com preensão reduzida.' },
      ],
    },
    {
      nome: 'Acessibilidade digital',
      descricao: 'Sistemas compatíveis com tecnologias assistivas e UX acessível.',
      subtipos: [
        { nome: 'Compatibilidade com leitor de tela', descricao: 'Uso de rótulos, hierarquia correta.' },
        { nome: 'Navegação por teclado', descricao: 'Uso sem mouse.' },
        { nome: 'Bom contraste e fontes escaláveis', descricao: 'Apoio para baixa visão/daltonismo.' },
        { nome: 'Formulários acessíveis', descricao: 'Campos identificados e erros claros.' },
      ],
    },
  ],
};

async function upsertDef(def: Deficiencia) {
  const existing = await prisma.deficienciaCatalogo.findFirst({ where: { nome: def.nome } });
  if (existing) return existing;
  return prisma.deficienciaCatalogo.create({ data: { nome: def.nome, descricao: def.descricao ?? null } });
}

async function upsertBarreira(defId: number, b: Barreira) {
  const existing = await prisma.barreiraCatalogo.findFirst({ where: { nome: b.nome, deficienciaId: defId } });
  if (existing) return existing;
  return prisma.barreiraCatalogo.create({
    data: { nome: b.nome, descricao: b.descricao ?? null, deficienciaId: defId },
  });
}

async function upsertSubtipoBarreira(barreiraId: number, s: Subtipo) {
  const existing = await prisma.subtipoBarreiraCatalogo.findFirst({ where: { nome: s.nome, barreiraId } });
  if (existing) return existing;
  return prisma.subtipoBarreiraCatalogo.create({
    data: { nome: s.nome, descricao: s.descricao ?? null, barreiraId },
  });
}

async function upsertAcessibilidade(a: Acessibilidade) {
  const existing = await prisma.acessibilidadeCatalogo.findFirst({ where: { nome: a.nome } });
  if (existing) return existing;
  return prisma.acessibilidadeCatalogo.create({ data: { nome: a.nome, descricao: a.descricao ?? null } });
}

async function upsertSubtipoAcessibilidade(acessibilidadeId: number, s: Subtipo) {
  const existing = await prisma.subtipoAcessibilidadeCatalogo.findFirst({
    where: { nome: s.nome, acessibilidadeId },
  });
  if (existing) return existing;
  return prisma.subtipoAcessibilidadeCatalogo.create({
    data: { nome: s.nome, descricao: s.descricao ?? null, acessibilidadeId },
  });
}

async function main() {
  for (const def of dados.deficiencias) {
    const defRecord = await upsertDef(def);
    for (const b of def.barreiras || []) {
      const bRecord = await upsertBarreira(defRecord.id, b);
      for (const s of b.subtipos || []) {
        await upsertSubtipoBarreira(bRecord.id, s);
      }
    }
  }

  for (const acc of dados.acessibilidades) {
    const accRecord = await upsertAcessibilidade(acc);
    for (const s of acc.subtipos || []) {
      await upsertSubtipoAcessibilidade(accRecord.id, s);
    }
  }

  console.log('Catálogo carregado com sucesso.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
