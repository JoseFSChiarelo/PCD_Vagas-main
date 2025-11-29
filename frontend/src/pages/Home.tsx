import Carousel from '../components/Carousel';
import Card from '../components/Card';

export default function Home() {
  return (
    <div className="space-y-12">
      <Carousel />

      <section aria-label="Fluxo para empresas e pessoas candidatas" className="space-y-3">
        <p className="section-title">Fluxo guiado</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-brand-dark">
          Contratação inclusiva em poucos passos
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <div className="pill">Empresas</div>
            <h3 className="mt-3 text-lg font-semibold text-brand-dark">Monte a vaga com clareza</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              <li>• Campos obrigatórios indicados e checklist de acessibilidades.</li>
              <li>• Sugestão de escolaridade mínima e modalidade (remota, híbrida ou presencial).</li>
              <li>• Publicação rápida e painel de controle em tempo real.</li>
            </ul>
          </Card>
          <Card>
            <div className="pill">Pessoas candidatas</div>
            <h3 className="mt-3 text-lg font-semibold text-brand-dark">Veja se a vaga te abraça</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              <li>• Transparência nos requisitos antes do login.</li>
              <li>• Acessibilidades oferecidas visíveis logo no card.</li>
              <li>• Candidatura em um clique após salvar seus dados.</li>
            </ul>
          </Card>
          <Card>
            <div className="pill">Inclusão contínua</div>
            <h3 className="mt-3 text-lg font-semibold text-brand-dark">Experiência acolhedora</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              <li>• Linguagem simples, contrastes altos e foco visível.</li>
              <li>• Mensagens de status claras para cada ação.</li>
              <li>• Espaçamento generoso para leituras com conforto.</li>
            </ul>
          </Card>
        </div>
      </section>

      <section aria-label="Benefícios de contratar um PCD" className="space-y-3">
        <p className="section-title">Impacto real</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-brand-dark">Benefícios de contratar PCD</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="text-lg font-semibold text-brand-dark">Diversidade que inova</h3>
            <p className="mt-2 text-sm text-gray-700">
              Equipes diversas entregam melhores soluções e refletem seus clientes com mais autenticidade.
            </p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-brand-dark">Engajamento e retenção</h3>
            <p className="mt-2 text-sm text-gray-700">
              Ambientes inclusivos elevam o pertencimento, reduzindo turnover e reforçando a cultura.
            </p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-brand-dark">Responsabilidade social</h3>
            <p className="mt-2 text-sm text-gray-700">
              Cumprimento das leis de inclusão e impacto positivo na reputação e na marca empregadora.
            </p>
          </Card>
        </div>
      </section>

      <section aria-label="Como contratar um PCD" className="space-y-3">
        <p className="section-title">Passo a passo</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-brand-dark">Como contratar com segurança</h2>
        <ol className="ml-5 space-y-2 rounded-2xl border border-brand-light bg-white/80 px-5 py-4 text-sm text-gray-800 shadow-sm">
          <li>1. Defina requisitos acessíveis e descreva a atividade de forma simples.</li>
          <li>2. Informe as acessibilidades oferecidas e a modalidade de trabalho.</li>
          <li>3. Selecione de maneira justa, dando retorno claro para cada candidatura.</li>
        </ol>
      </section>

      <section aria-label="PCD: saiba seus direitos e benefícios" className="space-y-3">
        <p className="section-title">Direitos e suporte</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-brand-dark">PCD: direitos e benefícios</h2>
        <p className="text-sm md:text-base text-gray-700 max-w-3xl">
          A plataforma reforça acessibilidade, oferece campos específicos para necessidades e mostra, já no cartão da vaga,
          se há recursos oferecidos. Transparência e acolhimento em cada etapa.
        </p>
      </section>
    </div>
  );
}
