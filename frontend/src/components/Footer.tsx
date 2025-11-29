export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-brand-dark text-white py-3" aria-label="Rodapé">
      <div className="container text-sm flex justify-between">
        <span>© {new Date().getFullYear()} IncluiVagas</span>
        <span className="opacity-80">Acessível e inclusivo</span>
      </div>
    </footer>
  );
}