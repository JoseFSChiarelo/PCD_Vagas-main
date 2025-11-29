import Carousel from '../components/Carousel';
import Card from '../components/Card';

export default function Home() {
  return (
    <div className="space-y-8">
      <Carousel />
      <section aria-label="Benefícios de contratar um PCD">
        <h2 className="text-2xl font-semibold text-brand-dark">Benefícios de contratar um PCD</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <Card><p>Diversidade fortalece a inovação e melhora resultados.</p></Card>
          <Card><p>Ambientes inclusivos aumentam engajamento e retenção.</p></Card>
          <Card><p>Conformidade com legislações e responsabilidade social.</p></Card>
        </div>
      </section>
      <section aria-label="Como contratar um PCD">
        <h2 className="text-2xl font-semibold text-brand-dark">Como contratar um PCD</h2>
        <ol className="list-decimal ml-6 mt-2">
          <li>Defina requisitos acessíveis.</li>
          <li>Publique a vaga com acessibilidades oferecidas.</li>
          <li>Selecione candidatos de forma justa.</li>
        </ol>
      </section>
      <section aria-label="PCD: saiba seus direitos e benefícios">
        <h2 className="text-2xl font-semibold text-brand-dark">PCD: direitos e benefícios</h2>
        <p>Informações essenciais sobre legislação, acessibilidade e oportunidades.</p>
      </section>
    </div>
  );
}