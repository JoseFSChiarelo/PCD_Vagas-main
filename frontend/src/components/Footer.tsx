export default function Footer() {
  return (
    <footer
      className="mt-12 border-t border-brand-light/60 bg-white/80 backdrop-blur"
      aria-label="Rodapé"
    >
      <div className="container flex flex-col gap-4 py-6 text-sm text-gray-700 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-base font-semibold text-brand-dark">IncluiVagas</p>
          <p className="text-gray-500">Inclusão, acessibilidade e conexões reais.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="px-3 py-1 rounded-full bg-brand-light text-brand-dark font-semibold">
            © {new Date().getFullYear()} IncluiVagas
          </span>
          <span className="text-gray-500">Suporte: contato@incluivagas.com</span>
        </div>
      </div>
    </footer>
  );
}
