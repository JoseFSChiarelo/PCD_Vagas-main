import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

export default function VagaDetalhe() {
  const { id } = useParams();
  const [vaga, setVaga] = useState<any>(null);
  const nav = useNavigate();
  const isLoggedUser = !!localStorage.getItem('token_usuario');

  useEffect(() => {
    api
      .get(`/vagas/${id}`)
      .then((r) => setVaga(r.data))
      .catch(() => setVaga(null));
  }, [id]);

  if (!vaga) {
    return (
      <Card>
        <p className="text-sm text-gray-700">Vaga não encontrada.</p>
      </Card>
    );
  }

  const candidatar = async () => {
    if (!isLoggedUser) return nav('/usuario/login');
    await api.post('/candidaturas', { id_vaga: Number(id) });
    alert('Candidatura enviada!');
  };

  return (
    <div className="space-y-4" aria-label="Detalhes da vaga">
      <div className="space-y-1">
        <p className="section-title">Detalhes</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-brand-dark">{vaga.titulo}</h1>
        <p className="text-sm text-gray-600">
          Modalidade: {vaga.tipo_vaga} • Local: {vaga.cidade || '-'} / {vaga.estado || '-'}
        </p>
      </div>

      {!isLoggedUser ? (
        <Card className="space-y-3">
          <p className="text-sm text-gray-700">
            Faça login para ver detalhes completos e se candidatar com um clique.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => nav('/usuario/login')}>Fazer login</Button>
            <Button variant="secondary" onClick={() => nav('/usuario/cadastro')}>
              Criar conta
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1 text-sm text-gray-800">
              <p>
                <span className="font-semibold text-brand-dark">Descrição:</span> {vaga.descricao}
              </p>
              <p>
                <span className="font-semibold text-brand-dark">Benefícios:</span> {vaga.beneficios}
              </p>
              <p>
                <span className="font-semibold text-brand-dark">Tipo:</span> {vaga.tipo_vaga}
              </p>
              <p>
                <span className="font-semibold text-brand-dark">Escolaridade mínima:</span> {vaga.escolaridade_minima}
              </p>
            </div>

            <div className="space-y-1 text-sm text-gray-800">
              <p>
                <span className="font-semibold text-brand-dark">Local:</span> {vaga.cidade || '-'} / {vaga.estado || '-'}
              </p>
              <p>
                <span className="font-semibold text-brand-dark">Salário:</span> {vaga.salario}
              </p>
              <p>
                <span className="font-semibold text-brand-dark">Acessibilidades oferecidas:</span>{' '}
                {vaga.acessibilidades_oferecidas}
              </p>
              <p>
                <span className="font-semibold text-brand-dark">Deficiências compatíveis:</span>{' '}
                {vaga.deficiencias_compativeis?.join(', ')}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={candidatar} aria-label="Me candidatar">
              Me candidatar
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
