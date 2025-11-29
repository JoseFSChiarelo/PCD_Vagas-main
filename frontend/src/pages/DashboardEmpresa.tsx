import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import Card from '../components/Card';
import { deficienciaOptions, tipoVagaOptions, escolaridadeOptions } from '../constants/enums';

export default function DashboardEmpresa() {
  const [vagas, setVagas] = useState<any[]>([]);
  const [nova, setNova] = useState<any>({
    deficiencias_compativeis: ['FISICA'],
    tipo_vaga: 'REMOTA',
    escolaridade_minima: 'FUNDAMENTAL',
  });

  useEffect(() => {
    api.get('/vagas/empresa/minhas').then((r) => setVagas(r.data));
  }, []);

  const refreshVagas = async () => {
    const { data } = await api.get('/vagas/empresa/minhas');
    setVagas(data);
  };

  const publicar = async () => {
    await api.post('/vagas', nova);
    await refreshVagas();
    alert('Vaga publicada');
  };

  const desativar = async (id: number) => {
    await api.post(`/vagas/${id}/desativar`);
    await refreshVagas();
    alert('Vaga desativada (ocultará após 7 dias)');
  };

  return (
    <div className="space-y-4" aria-label="Dashboard da empresa">
      <div className="space-y-1">
        <p className="section-title">Painel da empresa</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-brand-dark">Gerencie suas vagas</h1>
        <p className="text-sm text-gray-600">
          Veja status, candidatos e publique novas oportunidades com checklist de acessibilidade.
        </p>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-brand-dark">Vagas publicadas</h2>
          <span className="pill">{vagas.length} ativa(s)</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {vagas.map((v) => (
            <div key={v.id_vaga} className="rounded-xl border border-brand-light bg-white/70 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-brand-dark">{v.titulo}</h3>
                  <p className="text-xs text-gray-600">Status: {v.status}</p>
                </div>
                <span className="pill">{v.tipo_vaga}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-700">
                <span>Escolaridade: {v.escolaridade_minima || 'Não informada'}</span>
                <span>Local: {v.cidade || '-'} / {v.estado || '-'}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => desativar(v.id_vaga)}>
                  Desativar
                </Button>
                <Button
                  onClick={async () => {
                    const cand = await api.get(`/candidaturas/vaga/${v.id_vaga}`);
                    alert(`Candidatos: ${cand.data.length}`);
                  }}
                >
                  Ver candidatos
                </Button>
              </div>
            </div>
          ))}
          {vagas.length === 0 && <p className="text-sm text-gray-700">Nenhuma vaga publicada ainda.</p>}
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-brand-dark">Publicar nova vaga</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            id="titulo"
            label="Título"
            value={nova.titulo || ''}
            onChange={(e) => setNova((f: any) => ({ ...f, titulo: e.target.value }))}
            placeholder="Ex: Analista de Suporte"
          />
          <Input
            id="descricao"
            label="Descrição (até 200)"
            value={nova.descricao || ''}
            onChange={(e) => setNova((f: any) => ({ ...f, descricao: e.target.value }))}
            maxLength={200}
            placeholder="Resumo do desafio e do dia a dia"
          />
          <Input
            id="beneficios"
            label="Benefícios"
            value={nova.beneficios || ''}
            onChange={(e) => setNova((f: any) => ({ ...f, beneficios: e.target.value }))}
            placeholder="Plano de saúde, VR, apoio psicológico..."
          />

          <Dropdown
            id="tipo_vaga"
            label="Tipo da vaga"
            options={tipoVagaOptions}
            value={nova.tipo_vaga}
            onChange={(e) => setNova((f: any) => ({ ...f, tipo_vaga: e.target.value }))}
            placeholder="Selecione"
          />

          {nova.tipo_vaga !== 'REMOTA' && (
            <>
              <Input
                id="cidade"
                label="Cidade"
                value={nova.cidade || ''}
                onChange={(e) => setNova((f: any) => ({ ...f, cidade: e.target.value }))}
              />
              <Input
                id="estado"
                label="Estado"
                value={nova.estado || ''}
                onChange={(e) => setNova((f: any) => ({ ...f, estado: e.target.value }))}
              />
            </>
          )}

          <Input
            id="salario"
            label="Salário"
            value={nova.salario || 'não informado'}
            onChange={(e) => setNova((f: any) => ({ ...f, salario: e.target.value }))}
          />
          <Input
            id="acessibilidades_oferecidas"
            label="Acessibilidades oferecidas"
            value={nova.acessibilidades_oferecidas || ''}
            onChange={(e) => setNova((f: any) => ({ ...f, acessibilidades_oferecidas: e.target.value }))}
            placeholder="Tecnologias assistivas, apoio, adaptações"
          />
          <Input
            id="data_fechamento"
            label="Data de fechamento"
            type="date"
            value={nova.data_fechamento || ''}
            onChange={(e) => setNova((f: any) => ({ ...f, data_fechamento: e.target.value }))}
          />

          <Dropdown
            id="deficiencias_compativeis"
            label="Deficiências compatíveis (primeira)"
            options={deficienciaOptions}
            value={nova.deficiencias_compativeis[0]}
            onChange={(e) => setNova((f: any) => ({ ...f, deficiencias_compativeis: [e.target.value] }))}
            placeholder="Selecione"
          />

          <Dropdown
            id="escolaridade_minima"
            label="Escolaridade mínima"
            options={escolaridadeOptions}
            value={nova.escolaridade_minima}
            onChange={(e) => setNova((f: any) => ({ ...f, escolaridade_minima: e.target.value }))}
            placeholder="Selecione a escolaridade mínima"
          />
        </div>
        <div className="flex justify-end">
          <Button className="px-6" onClick={publicar}>
            Publicar vaga
          </Button>
        </div>
      </Card>
    </div>
  );
}
