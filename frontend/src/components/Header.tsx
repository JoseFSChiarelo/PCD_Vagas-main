import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-brand DEFAULT text-white shadow z-50" aria-label="Cabeçalho principal">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2" aria-label="Ir para a página inicial">
          <span className="font-bold text-xl">IncluiVagas</span>
        </Link>
        <nav aria-label="Menu principal">
          <ul className="flex items-center gap-6">
            <li><Link to="/vagas" className="hover:underline">Vagas</Link></li>
            <li><Link to="/empresa/login" className="bg-brand-accent px-3 py-2 rounded" aria-label="Login Empresa">Empresa</Link></li>
            <li><Link to="/usuario/login" className="border border-white px-3 py-2 rounded" aria-label="Login Usuário">Usuário</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}