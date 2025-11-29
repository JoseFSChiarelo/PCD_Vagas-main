import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';

export default function VagaDetalhe() {
  const { id } = useParams();
  const [vaga,setVaga]=useState<any>(null);
  const nav = useNavigate();
  const isLoggedUser = !!localStorage.getItem('token_usuario');

  useEffect(() => {
    api.get(`/vagas/${id}`).then(r=>setVaga(r.data)).catch(()=>setVaga(null));
  }, [id]);

  if (!vaga) return <p>Vaga não encontrada.</p>;

  const candidatar = async () => {
    if (!isLoggedUser) return nav('/usuario/login');
    await api.post('/candidaturas', { id_vaga: Number(id) });
    alert('Candidatura enviada!');
  };

  return (
    <div aria-label="Detalhes da vaga">
      <h1 className="text-2xl font-semibold text-brand-dark mb-2">{vaga.titulo}</h1>
      {!isLoggedUser ? (
        <p>Faça login para ver detalhes completos e se candidatar.</p>
      ) : (
        <div className="space-y-2">
          <p><strong>Descrição:</strong> {vaga.descricao}</p>
          <p><strong>Benefícios:</strong> {vaga.beneficios}</p>
          <p><strong>Deficiências compatíveis:</strong> {vaga.deficiencias_compativeis.join(', ')}</p>
          <p><strong>Tipo:</strong> {vaga.tipo_vaga}</p>
          <p><strong>Escolaridade mínima:</strong> {vaga.escolaridade_minima}</p>
          <p><strong>Local:</strong> {vaga.cidade || '—'}/{vaga.estado || '—'}</p>
          <p><strong>Salário:</strong> {vaga.salario}</p>
          <p><strong>Acessibilidades oferecidas:</strong> {vaga.acessibilidades_oferecidas}</p>

          <Button onClick={candidatar} aria-label="Me candidatar">Me candidatar</Button>
        </div>
      )}
    </div>
  );
}