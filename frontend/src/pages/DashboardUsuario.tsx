import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Input from '../components/Input';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import Card from '../components/Card';
import { deficienciaOptions, escolaridadeOptions } from '../constants/enums';

export default function DashboardUsuario() {
  const [perfil, setPerfil] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editMode, setEditMode] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [vagas, setVagas] = useState<any[]>([]);
  const [loadingVagas, setLoadingVagas] = useState(true);
  const nav = useNavigate();

  const carregarPerfil = async () => {
    try {
      const { data } = await api.get('/usuarios/me');
      setPerfil(data);
      setEditForm(data);
      carregarVagas();
    } catch (err) {
      console.error(err);
      alert('Nao foi possivel carregar seu perfil.');
    }
  };

  const carregarVagas = async () => {
    try {
      setLoadingVagas(true);
      const { data } = await api.get('/vagas/compativeis');
      setVagas(data);
    } catch (err) {
      console.error(err);
      alert('Erro ao buscar vagas compativeis.');
    } finally {
      setLoadingVagas(false);
    }
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSalvando(true);
      await api.put('/usuarios/me', editForm);
      setPerfil((prev: any) => ({ ...prev, ...editForm }));
      setEditMode(false);
      await carregarVagas();
      alert('Dados atualizados');
    } catch (err) {
      console.error(err);
      alert('Nao foi possivel salvar agora.');
    } finally {
      setSalvando(false);
    }
  };

  if (!perfil) {
    return (
      <Card>
        <p className="text-sm text-gray-700">Carregando seu painel...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6" aria-label="Dashboard do candidato">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="section-title">Painel do candidato</p>
          <h1 className="text-3xl font-semibold text-brand-dark">Bem-vindo, {perfil.nome?.split(' ')[0] || 'candidato'}</h1>
          <p className="text-sm text-gray-700 max-w-3xl">
            Revise suas informacoes de acesso e encontre vagas alinhadas ao seu perfil, deficiencia e necessidades de acessibilidade.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={carregarVagas}>
            Recalcular vagas
          </Button>
          <Button onClick={() => setEditMode((v) => !v)}>
            {editMode ? 'Fechar edicao' : 'Atualizar cadastro'}
          </Button>
        </div>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill">Deficiencia: {perfil.tipo_deficiencia || 'Informar'}</span>
            <span className="pill">Subtipo: {perfil.subtipo_deficiencia || 'Informar'}</span>
            <span className="pill">Barreiras: {perfil.barreiras || 'Descrever'}</span>
            <span className="pill">
              Acessibilidades: {perfil.acessibilidades_necessarias ? perfil.acessibilidades_necessarias : 'Listar necessidades'}
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-3 text-sm text-gray-800">
            <div>
              <p className="font-semibold text-brand-dark">Local</p>
              <p>{perfil.cidade || '-'} / {perfil.estado || '-'}</p>
            </div>
            <div>
              <p className="font-semibold text-brand-dark">Contato</p>
              <p>{perfil.email}</p>
              <p>{perfil.celular}</p>
            </div>
            <div>
              <p className="font-semibold text-brand-dark">Escolaridade</p>
              <p>{perfil.escolaridade || 'Nao informado'}</p>
            </div>
          </div>
        </div>
      </Card>

      {editMode && (
        <Card className="space-y-6" aria-label="Formulario de edicao do perfil">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-brand-dark">Atualizar cadastro</h2>
              <p className="text-sm text-gray-600">
                Ajuste celular, localidade, deficiencia, barreiras e necessidades de acessibilidade. As vagas recomendadas serao recalculadas apos salvar.
              </p>
            </div>
          </div>

          <form onSubmit={salvar} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                id="celular"
                label="Celular"
                value={editForm.celular || ''}
                onChange={(e) => setEditForm((f: any) => ({ ...f, celular: e.target.value }))}
              />
              <Dropdown
                id="escolaridade"
                label="Escolaridade"
                options={escolaridadeOptions}
                value={editForm.escolaridade || ''}
                onChange={(e) => setEditForm((f: any) => ({ ...f, escolaridade: e.target.value }))}
                placeholder="Selecione"
              />
              <Input
                id="cidade"
                label="Cidade"
                value={editForm.cidade || ''}
                onChange={(e) => setEditForm((f: any) => ({ ...f, cidade: e.target.value }))}
              />
              <Input
                id="estado"
                label="Estado"
                value={editForm.estado || ''}
                onChange={(e) => setEditForm((f: any) => ({ ...f, estado: e.target.value }))}
              />
              <Dropdown
                id="tipo_deficiencia"
                label="Tipo de deficiencia"
                options={deficienciaOptions}
                value={editForm.tipo_deficiencia || ''}
                onChange={(e) => setEditForm((f: any) => ({ ...f, tipo_deficiencia: e.target.value }))}
                placeholder="Selecione"
              />
              <Input
                id="subtipo_deficiencia"
                label="Subtipo"
                value={editForm.subtipo_deficiencia || ''}
                onChange={(e) => setEditForm((f: any) => ({ ...f, subtipo_deficiencia: e.target.value }))}
                placeholder="Ex: mobilidade reduzida"
              />
              <Input
                id="barreiras"
                label="Barreiras encontradas"
                value={editForm.barreiras || ''}
                onChange={(e) => setEditForm((f: any) => ({ ...f, barreiras: e.target.value }))}
                helperText="Ex: fisica, comunicacao, digital. Detalhe se ha subtipos especificos."
              />
              <Input
                id="acessibilidades_necessarias"
                label="Acessibilidades necessarias"
                value={editForm.acessibilidades_necessarias || ''}
                onChange={(e) => setEditForm((f: any) => ({ ...f, acessibilidades_necessarias: e.target.value }))}
                helperText="Tecnologias assistivas, interpretacao, apoio humano ou ajustes no ambiente."
              />
            </div>

            <label className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
              <input
                type="checkbox"
                checked={!!editForm.buscando_emprego}
                onChange={(e) => setEditForm((f: any) => ({ ...f, buscando_emprego: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-brand-dark focus:ring-brand-dark"
              />
              Estou buscando uma nova oportunidade
            </label>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" type="button" onClick={() => setEditMode(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar alteracoes'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-title">Vagas compativeis</p>
            <h2 className="text-2xl font-semibold text-brand-dark">Oportunidades alinhadas ao seu perfil</h2>
            <p className="text-sm text-gray-700">
              Filtramos vagas que aceitam {perfil.tipo_deficiencia?.toLowerCase() || 'a sua deficiencia'} e mostram acessibilidades oferecidas.
            </p>
          </div>
          <Button variant="secondary" onClick={() => nav('/vagas')}>
            Ver todas as vagas
          </Button>
        </div>

        {loadingVagas ? (
          <Card>
            <p className="text-sm text-gray-700">Calculando melhores vagas para voce...</p>
          </Card>
        ) : vagas.length === 0 ? (
          <Card>
            <p className="text-sm text-gray-700">
              Nenhuma vaga compativel encontrada agora. Atualize suas preferencias ou volte mais tarde para conferir novas oportunidades.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {vagas.map((v) => (
              <Card key={v.id_vaga} className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Compatibilidade</p>
                    <h3 className="text-xl font-semibold text-brand-dark">{v.titulo}</h3>
                    <p className="text-sm text-gray-600">
                      {v.empresa?.nome ? `${v.empresa.nome} • ` : ''}
                      {v.cidade || v.empresa?.cidade || '-'} / {v.estado || v.empresa?.estado || '-'}
                    </p>
                  </div>
                  <span className="pill">{v.tipo_vaga}</span>
                </div>

                <div className="text-sm text-gray-800 space-y-1">
                  <p>Beneficios: {v.beneficios || 'Informar no detalhe'}</p>
                  <p>Escolaridade minima: {v.escolaridade_minima || 'Consultar vaga'}</p>
                  <p>Acessibilidades oferecidas: {v.acessibilidades_oferecidas || 'Sob demanda'}</p>
                  <p>Deficiencias aceitas: {Array.isArray(v.deficiencias_compativeis) ? v.deficiencias_compativeis.join(', ') : 'Consultar'}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
                  <span>
                    Compatibilidade por aceitar {perfil.tipo_deficiencia} {perfil.subtipo_deficiencia ? `(${perfil.subtipo_deficiencia})` : ''} e considerar suas barreiras.
                  </span>
                  <Button variant="secondary" onClick={() => nav(`/vaga/${v.id_vaga}`)}>
                    Ver detalhes
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
