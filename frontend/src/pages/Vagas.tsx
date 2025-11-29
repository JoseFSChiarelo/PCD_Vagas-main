import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

export default function Vagas() {
  const [vagas, setVagas] = useState<any[]>([]);
  useEffect(() => {
    api.get('/vagas').then(r => setVagas(r.data));
  }, []);
  return (
    <div aria-label="Lista de vagas">
      <h1 className="text-2xl font-semibold text-brand-dark mb-4">Vagas</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {vagas.map((v) => (
          <Card key={v.id_vaga}>
            <h3 className="text-xl font-semibold">{v.titulo}</h3>
            <p className="text-sm text-gray-600">Tipo: {v.tipo_vaga}</p>
            <p className="text-sm text-gray-600">Local: {v.cidade || '—'}/{v.estado || '—'}</p>
            <Link to={`/vaga/${v.id_vaga}`} className="text-brand-accent underline" aria-label={`Detalhes da vaga ${v.titulo}`}>Ver detalhes</Link>
          </Card>
        ))}
      </div>
    </div>
  );
}