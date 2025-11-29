import { useState } from 'react';

const images = [
  { src: '/img/car1.jpg', alt: 'Colaboração em equipe' },
  { src: '/img/car2.jpg', alt: 'Inclusão no ambiente de trabalho' },
  { src: '/img/car3.jpg', alt: 'Acessibilidade e tecnologia' },
];

export default function Carousel() {
  const [i, setI] = useState(0);
  const next = () => setI((i+1) % images.length);
  const prev = () => setI((i-1+images.length) % images.length);
  return (
    <div className="relative" aria-label="Carrossel de imagens">
      <img src={images[i].src} alt={images[i].alt} className="w-full h-64 object-cover rounded" />
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-brand-dark text-white px-2 py-1 rounded" aria-label="Imagem anterior">‹</button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-dark text-white px-2 py-1 rounded" aria-label="Próxima imagem">›</button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2" aria-label="Indicadores">
        {images.map((_, idx) => (
          <span key={idx} className={`w-2 h-2 rounded-full ${idx===i?'bg-brand-accent':'bg-white/70'}`} aria-hidden="true" />
        ))}
      </div>
    </div>
  );
}