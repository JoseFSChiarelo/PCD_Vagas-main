import { useState } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    title: 'Contrate com confiança',
    description: 'Fluxo guiado, campos obrigatórios claros e checklist de acessibilidades para publicar vagas inclusivas.',
    tag: 'Para empresas',
    cta: { label: 'Publicar vaga agora', to: '/empresa/login' },
    gradient: 'from-brand-dark via-brand to-brand-accent',
  },
  {
    title: 'Candidatura que respeita o ritmo',
    description: 'Veja requisitos antes de se logar, salve seus dados e volte depois. Transparência em cada etapa.',
    tag: 'Para pessoas candidatas',
    cta: { label: 'Explorar vagas', to: '/vagas' },
    gradient: 'from-indigo-900 via-brand-dark to-sky-600',
  },
  {
    title: 'Apoio à decisão inclusiva',
    description: 'Painéis claros, status de vagas, número de candidaturas e comunicação direta com candidatos PCD.',
    tag: 'Visão geral',
    cta: { label: 'Ver dashboards', to: '/empresa/login' },
    gradient: 'from-sky-800 via-brand to-blue-400',
  },
];

export default function Carousel() {
  const [i, setI] = useState(0);
  const next = () => setI((i + 1) % slides.length);
  const prev = () => setI((i - 1 + slides.length) % slides.length);
  const slide = slides[i];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r shadow-xl" aria-label="Destaques da plataforma">
      <div className={`bg-gradient-to-r ${slide.gradient} px-8 py-10 text-white`}>
        <span className="pill bg-white/20 text-white border border-white/40">{slide.tag}</span>
        <h1 className="mt-4 text-3xl md:text-4xl font-semibold leading-snug">{slide.title}</h1>
        <p className="mt-3 max-w-2xl text-base md:text-lg text-white/90">{slide.description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={slide.cta.to}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-dark shadow-lg transition hover:-translate-y-0.5"
          >
            {slide.cta.label}
            <span aria-hidden>→</span>
          </Link>
          <button
            onClick={() => setI(Math.floor(Math.random() * slides.length))}
            className="inline-flex items-center gap-2 rounded-xl border border-white/70 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Ver outro destaque
          </button>
        </div>
      </div>

      <div className="absolute inset-y-0 left-0 flex items-center px-4">
        <button
          onClick={prev}
          className="rounded-full bg-white/80 text-brand-dark p-2 shadow-md hover:-translate-y-0.5 transition"
          aria-label="Destaque anterior"
        >
          ‹
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center px-4">
        <button
          onClick={next}
          className="rounded-full bg-white/80 text-brand-dark p-2 shadow-md hover:-translate-y-0.5 transition"
          aria-label="Próximo destaque"
        >
          ›
        </button>
      </div>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2" aria-label="Indicadores de destaque">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`h-2 w-2 rounded-full ${idx === i ? 'bg-white' : 'bg-white/50'}`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
