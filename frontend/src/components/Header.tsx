import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header
      className="fixed top-0 z-50 w-full border-b border-white/70 bg-white/80 backdrop-blur-xl"
      aria-label="Cabeçalho principal"
    >
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3" aria-label="Ir para a página inicial">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white shadow-md">
            <span className="text-lg font-bold">IV</span>
          </div>
          <div className="leading-tight">
            <p className="text-lg font-semibold text-brand-dark">IncluiVagas</p>
            <p className="text-xs text-gray-500">Talento PCD no centro da decisão</p>
          </div>
        </Link>

        <nav aria-label="Menu principal">
          <ul className="flex items-center gap-3 text-sm font-semibold text-brand-dark">
            <li>
              <Link to="/vagas" className="px-3 py-2 rounded-lg hover:bg-brand-light transition">
                Vagas
              </Link>
            </li>
            <li>
              <Link to="/admin" className="px-3 py-2 rounded-lg hover:bg-brand-light transition">
                Admin
              </Link>
            </li>
            <li>
              <Link
                to="/empresa/login"
                className="px-4 py-2 rounded-xl bg-brand-dark text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
                aria-label="Acessar área da empresa"
              >
                Publicar vaga
              </Link>
            </li>
            <li>
              <Link
                to="/usuario/login"
                className="px-4 py-2 rounded-xl border border-brand-dark text-brand-dark hover:bg-brand-light transition"
                aria-label="Acessar área da pessoa candidata"
              >
                Entrar
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
