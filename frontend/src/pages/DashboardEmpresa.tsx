import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import Card from '../components/Card';
import { tipoVagaOptions, escolaridadeOptions } from '../constants/enums';

type Catalogo = {
  deficiencias: {
    id: number;
    nome: string;
    barreiras: { id: number; nome: string; subtipos: { id: number; nome: string }[] }[];
  }[];
  acessibilidades: { id: number; nome: string; subtipos: { id: number; nome: string }[] }[];
};

export default function DashboardEmpresa() {
  const [vagas, setVagas] = useState<any[]>([]);
  const [catalogo, setCatalogo] = useState<Catalogo>({ deficiencias: [], acessibilidades: [] });
  const [nova, setNova] = useState<any>({
    deficiencias_compativeis: [] as string[],
    tipo_vaga: 'REMOTA',
    escolaridade_minima: 'FUNDAMENTAL',
    acessibilidades_lista: [] as string[],
  });
  const [erro, setErro] = useState<string>('');

  useEffect(() => {
    api.get('/vagas/empresa/minhas').then((r) => setVagas(r.data));
    api.get('/catalogo').then((r) => setCatalogo(r.data));
  }, []);

  const refreshVagas = async () => {
    const { data } = await api.get('/vagas/empresa/minhas');
    setVagas(data);
  };

  const publicar = async () => {
    try {
      setErro('');
      if (!nova.titulo || nova.titulo.length < 10) throw new Error('Título deve ter ao menos 10 caracteres.');
      if (!nova.descricao) throw new Error('Descrição é obrigatória.');
      if (!nova.beneficios) throw new Error('Informe benefícios.');
      if (!nova.deficiencias_compativeis || nova.deficiencias_compativeis.length === 0)
        throw new Error('Selecione ao menos uma deficiência/barreira.');

      const payload = {
        ...nova,
        deficiencias_compativeis: Array.from(new Set(nova.deficiencias_compativeis || [])),
        acessibilidades_oferecidas:
          (nova.acessibilidades_lista || []).join(', ') || nova.acessibilidades_oferecidas || 'Não informado',
      };
      await api.post('/vagas', payload);
      await refreshVagas();
      alert('Vaga publicada');
    } catch (e: any) {
      setErro(e?.response?.data?.error || e?.message || 'Erro ao publicar vaga');
    }
  };

  const desativar = async (id: number) => {
    await api.post(`/vagas/${id}/desativar`);
    await refreshVagas();
    alert('Vaga desativada (ocultará após 7 dias)');
  };

  const defOptions = catalogo.deficiencias.map((d) => ({ value: String(d.id), label: d.nome }));
  const barreiraOptions =
    catalogo.deficiencias.find((d) => d.id === Number(nova.deficienciaId))?.barreiras.map((b) => ({
      value: String(b.id),
      label: b.nome,
    })) || [];
  const subtipoBarreiraOptions =
    catalogo.deficiencias
      .find((d) => d.id === Number(nova.deficienciaId))
      ?.barreiras.find((b) => b.id === Number(nova.barreiraId))
      ?.subtipos.map((s) => ({ value: String(s.id), label: s.nome })) || [];

  const acessOptions = catalogo.acessibilidades.map((a) => ({ value: String(a.id), label: a.nome }));
  const subtipoAcessOptions =
    catalogo.acessibilidades
      .find((a) => a.id === Number(nova.acessibilidadeId))
      ?.subtipos.map((s) => ({ value: String(s.id), label: s.nome })) || [];

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
                <span>
                  Local: {v.cidade || '-'} / {v.estado || '-'}
                </span>
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
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-title">Nova vaga</p>
            <h2 className="text-lg font-semibold text-brand-dark">Publicar com requisitos claros</h2>
            <p className="text-sm text-gray-600">Informe acessibilidades oferecidas e barreiras compatíveis.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
            <span className="pill">Checklist de acessibilidade</span>
            <span className="pill bg-white border border-brand-light text-brand-dark">Deficiências e subtipos</span>
          </div>
        </div>
        {erro && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {erro}
          </div>
        )}

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
            value={nova.salario || ''}
            onChange={(e) => setNova((f: any) => ({ ...f, salario: e.target.value }))}
            placeholder="Ex: 3500,00 ou 'a combinar'"
          />

          <Input
            id="data_fechamento"
            label="Data de fechamento"
            type="date"
            value={nova.data_fechamento || ''}
            onChange={(e) => setNova((f: any) => ({ ...f, data_fechamento: e.target.value }))}
          />

          <Dropdown
            id="escolaridade_minima"
            label="Escolaridade mínima"
            options={escolaridadeOptions}
            value={nova.escolaridade_minima}
            onChange={(e) => setNova((f: any) => ({ ...f, escolaridade_minima: e.target.value }))}
            placeholder="Selecione a escolaridade mínima"
          />

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-brand-dark">Deficiência / barreira / subtipo</label>
            <div className="grid gap-3 rounded-xl border border-gray-200 bg-white/80 p-3 md:grid-cols-3">
              <Dropdown
                id="deficiencia"
                label="Deficiência"
                options={defOptions}
                value={String(nova.deficienciaId || '')}
                onChange={(e) => {
                  const defId = Number(e.target.value);
                  const defNome = catalogo.deficiencias.find((d) => d.id === defId)?.nome || '';
                  setNova((f: any) => ({
                    ...f,
                    deficienciaId: defId,
                    deficiencias_compativeis: defNome
                      ? Array.from(new Set([...(f.deficiencias_compativeis || []), defNome]))
                      : [...(f.deficiencias_compativeis || [])],
                    barreiraId: undefined,
                    subtipoBarreiraId: undefined,
                  }));
                }}
                placeholder="Selecione"
              />
              <Dropdown
                id="barreira"
                label="Barreira"
                options={barreiraOptions}
                value={String(nova.barreiraId || '')}
                onChange={(e) => {
                  const barreiraId = Number(e.target.value);
                  setNova((f: any) => ({ ...f, barreiraId, subtipoBarreiraId: undefined }));
                }}
                placeholder="Selecione"
              />
              <Dropdown
                id="subtipo-barreira"
                label="Subtipo de barreira"
                options={subtipoBarreiraOptions}
                value={String(nova.subtipoBarreiraId || '')}
                onChange={(e) => {
                  const subtipoBarreiraId = Number(e.target.value);
                  const defNome = catalogo.deficiencias.find((d) => d.id === Number(nova.deficienciaId))?.nome;
                  const barNome = catalogo.deficiencias
                    .find((d) => d.id === Number(nova.deficienciaId))
                    ?.barreiras.find((b) => b.id === Number(nova.barreiraId))?.nome;
                  const subNome = catalogo.deficiencias
                    .find((d) => d.id === Number(nova.deficienciaId))
                    ?.barreiras.find((b) => b.id === Number(nova.barreiraId))
                    ?.subtipos.find((s) => s.id === subtipoBarreiraId)?.nome;
                  setNova((f: any) => {
                    const defs = new Set(f.deficiencias_compativeis || []);
                    if (defNome) defs.add(defNome);
                    if (barNome) defs.add(barNome);
                    if (subNome) defs.add(subNome);
                    return { ...f, subtipoBarreiraId, deficiencias_compativeis: Array.from(defs) };
                  });
                }}
                placeholder="Selecione"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-brand-dark">Acessibilidades oferecidas</label>
            <div className="grid gap-3 rounded-xl border border-gray-200 bg-white/80 p-3 md:grid-cols-3">
              <Dropdown
                id="acessibilidade"
                label="Acessibilidade"
                options={acessOptions}
                value={String(nova.acessibilidadeId || '')}
                onChange={(e) => {
                  const acessibilidadeId = Number(e.target.value);
                  setNova((f: any) => ({ ...f, acessibilidadeId, subtipoAcessibilidadeId: undefined }));
                }}
                placeholder="Selecione"
              />
              <Dropdown
                id="subtipo-acessibilidade"
                label="Subtipo de acessibilidade"
                options={subtipoAcessOptions}
                value={String(nova.subtipoAcessibilidadeId || '')}
                onChange={(e) => {
                  const subtipoAcessibilidadeId = Number(e.target.value);
                  const acc = catalogo.acessibilidades.find((a) => a.id === Number(nova.acessibilidadeId));
                  const subtipoNome = acc?.subtipos.find((s) => s.id === subtipoAcessibilidadeId)?.nome;
                  setNova((f: any) => {
                    const lista = new Set(f.acessibilidades_lista || []);
                    if (acc?.nome) lista.add(acc.nome);
                    if (subtipoNome) lista.add(subtipoNome);
                    return { ...f, subtipoAcessibilidadeId, acessibilidades_lista: Array.from(lista) };
                  });
                }}
                placeholder="Selecione"
              />
              <Input
                id="acessibilidades_oferecidas"
                label="Complemento (texto livre)"
                placeholder="Tecnologias assistivas, apoio psicológico, equipamentos"
                value={nova.acessibilidades_oferecidas || ''}
                onChange={(e) => setNova((f: any) => ({ ...f, acessibilidades_oferecidas: e.target.value }))}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(nova.acessibilidades_lista || []).map((item: string) => (
                <span key={item} className="px-3 py-1 rounded-full bg-brand-light text-brand-dark text-xs font-semibold">
                  {item}
                </span>
              ))}
            </div>
          </div>
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
