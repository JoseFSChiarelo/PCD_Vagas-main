import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

export default function Vagas() {
  const [vagas, setVagas] = useState<any[]>([]);

  useEffect(() => {
    api.get('/vagas').then((r) => setVagas(r.data));
  }, []);

  const formatLocal = (cidade?: string, estado?: string) => {
    if (!cidade && !estado) return 'Local não informado';
    return `${cidade || '-'} / ${estado || '-'}`;
  };

  return (
    <div className="space-y-4" aria-label="Lista de vagas">
      <div className="space-y-1">
        <p className="section-title">Vagas abertas</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-brand-dark">Encontre oportunidades acessíveis</h1>
        <p className="text-sm text-gray-600">
          Cards trazem tipo da vaga, local, escolaridade mínima e acessibilidades oferecidas.
        </p>
      </div>

      {vagas.length === 0 && (
        <Card>
          <p className="text-sm text-gray-700">Nenhuma vaga disponível no momento. Volte em breve ou ajuste seus filtros.</p>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {vagas.map((v) => (
          <Card key={v.id_vaga} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-xl font-semibold text-brand-dark">{v.titulo}</h3>
                <p className="text-sm text-gray-600">Modalidade: {v.tipo_vaga}</p>
              </div>
              <span className="pill">{v.tipo_vaga}</span>
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <p>Local: {formatLocal(v.cidade, v.estado)}</p>
              <p>Escolaridade mínima: {v.escolaridade_minima || 'Não informada'}</p>
              {v.acessibilidades_oferecidas && (
                <p className="text-xs text-gray-600">
                  Acessibilidades: {v.acessibilidades_oferecidas}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-brand-dark">
              <span>
                Deficiências compatíveis:{' '}
                {Array.isArray(v.deficiencias_compativeis)
                  ? v.deficiencias_compativeis.join(', ')
                  : 'Consultar detalhes'}
              </span>
              <Link
                to={`/vaga/${v.id_vaga}`}
                className="text-brand-dark underline decoration-2 underline-offset-4"
                aria-label={`Detalhes da vaga ${v.titulo}`}
              >
                Ver detalhes →
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
