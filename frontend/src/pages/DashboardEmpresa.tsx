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
    escolaridade_minima: 'FUNDAMENTAL' // setado como minimo fundamental 
  });

  useEffect(() => {
    api.get('/vagas/empresa/minhas').then(r => setVagas(r.data));
  }, []);

  const publicar = async () => {
    await api.post('/vagas', nova);
    const { data } = await api.get('/vagas/empresa/minhas');
    setVagas(data);
    alert('Vaga publicada');
  };

  const desativar = async (id: number) => {
    await api.post(`/vagas/${id}/desativar`);
    const { data } = await api.get('/vagas/empresa/minhas');
    setVagas(data);
    alert('Vaga desativada (ocultará após 7 dias)');
  };

  return (
    <div aria-label="Dashboard da empresa">
      <h1 className="text-2xl font-semibold text-brand-dark mb-4">Minhas Vagas</h1>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {vagas.map(v => (
          <Card key={v.id_vaga}>
            <h3 className="text-lg font-semibold">{v.titulo}</h3>
            <p className="text-sm">Status: {v.status}</p>
            <Button variant="secondary" onClick={() => desativar(v.id_vaga)}>Desativar</Button>
            <Button onClick={async () => {
              const cand = await api.get(`/candidaturas/vaga/${v.id_vaga}`);
              alert(`Candidatos: ${cand.data.length}`);
            }}>Ver candidatos</Button>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-brand-dark mb-2">Publicar nova vaga</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Input id="titulo" label="Título" value={nova.titulo || ''} onChange={e => setNova((f: any) => ({ ...f, titulo: e.target.value }))} />
        <Input id="descricao" label="Descrição (até 200)" value={nova.descricao || ''} onChange={e => setNova((f: any) => ({ ...f, descricao: e.target.value }))} />
        <Input id="beneficios" label="Benefícios" value={nova.beneficios || ''} onChange={e => setNova((f: any) => ({ ...f, beneficios: e.target.value }))} />

        <Dropdown id="tipo_vaga" label="Tipo da vaga" options={tipoVagaOptions} value={nova.tipo_vaga} onChange={e => setNova((f: any) => ({ ...f, tipo_vaga: e.target.value }))} />

        {nova.tipo_vaga !== 'REMOTA' && (
          <>
            <Input id="cidade" label="Cidade" value={nova.cidade || ''} onChange={e => setNova((f: any) => ({ ...f, cidade: e.target.value }))} />
            <Input id="estado" label="Estado" value={nova.estado || ''} onChange={e => setNova((f: any) => ({ ...f, estado: e.target.value }))} />
          </>
        )}

        <Input id="salario" label="Salário" value={nova.salario || 'não informado'} onChange={e => setNova((f: any) => ({ ...f, salario: e.target.value }))} />
        <Input id="acessibilidades_oferecidas" label="Acessibilidades oferecidas" value={nova.acessibilidades_oferecidas || ''} onChange={e => setNova((f: any) => ({ ...f, acessibilidades_oferecidas: e.target.value }))} />
        <Input id="data_fechamento" label="Data de fechamento" type="date" value={nova.data_fechamento || ''} onChange={e => setNova((f: any) => ({ ...f, data_fechamento: e.target.value }))} />

        <Dropdown id="deficiencias_compativeis" label="Deficiências compatíveis (primeira)" options={deficienciaOptions} value={nova.deficiencias_compativeis[0]} onChange={e => setNova((f: any) => ({ ...f, deficiencias_compativeis: [e.target.value] }))} />

        {/* Novo campo: Escolaridade mínima */}
        <Dropdown
          id="escolaridade_minima"
          label="Escolaridade mínima"
          options={escolaridadeOptions}
          value={nova.escolaridade_minima}
          onChange={e => setNova((f: any) => ({ ...f, escolaridade_minima: e.target.value }))}
          placeholder="Selecione a escolaridade mínima"
        />
      </div>
      <Button className="mt-4" onClick={publicar}>Publicar vaga</Button>
    </div>
  );
}
