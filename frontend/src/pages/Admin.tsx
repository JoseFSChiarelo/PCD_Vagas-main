import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

type Empresa = {
  id_empresa: number;
  nome: string;
  email: string;
  cnpj: string;
  telefone?: string;
  descricao?: string;
  cidade?: string;
  estado?: string;
};

type ResourceConfig = {
  key: string;
  title: string;
  placeholder: string;
  endpoint: string;
  helper?: string;
  parentKey?: 'deficiencia' | 'barreira' | 'acessibilidade';
};

const resources: ResourceConfig[] = [
  { key: 'deficiencia', title: 'Deficiência', placeholder: 'Ex: Auditiva', endpoint: '/admin/deficiencias' },
  { key: 'barreira', title: 'Barreira', placeholder: 'Ex: Comunicação', endpoint: '/admin/barreiras', parentKey: 'deficiencia' },
  { key: 'subtipo_barreira', title: 'Subtipo de barreira', placeholder: 'Ex: Legendas em vídeos', endpoint: '/admin/barreiras/subtipos', parentKey: 'barreira' },
  { key: 'acessibilidade', title: 'Acessibilidade', placeholder: 'Ex: Libras', endpoint: '/admin/acessibilidades' },
  { key: 'subtipo_acessibilidade', title: 'Subtipo de acessibilidade', placeholder: 'Ex: Intérprete em tempo real', endpoint: '/admin/acessibilidades/subtipos', parentKey: 'acessibilidade' },
];

export default function Admin() {
  const nav = useNavigate();
  const [email, setEmail] = useState('adm@gmail.com');
  const [senha, setSenha] = useState('adm123');
  const [authError, setAuthError] = useState('');
  const [logando, setLogando] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, { nome: string; descricao: string }>>(
    () => Object.fromEntries(resources.map((r) => [r.key, { nome: '', descricao: '' }])),
  );
  const [salvando, setSalvando] = useState<string | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const hasToken = useMemo(
    () => !!localStorage.getItem('token_admin') || !!localStorage.getItem('token_usuario') || !!localStorage.getItem('token_empresa'),
    [],
  );
  const [catalogo, setCatalogo] = useState<any>({ deficiencias: [], acessibilidades: [] });
  const [loadingCatalogo, setLoadingCatalogo] = useState(false);
  const [openTipo, setOpenTipo] = useState<string | null>(null);
  const [parentSelection, setParentSelection] = useState<Record<string, string>>({});

  const parentOptions = useMemo(() => {
    const defOps = (catalogo.deficiencias || []).map((d: any) => ({ value: String(d.id), label: d.nome }));
    const barreiraOps = (catalogo.deficiencias || [])
      .flatMap((d: any) => (d.barreiras || []).map((b: any) => ({ value: String(b.id), label: `${d.nome} • ${b.nome}` })));
    const acessOps = (catalogo.acessibilidades || []).map((a: any) => ({ value: String(a.id), label: a.nome }));
    return {
      deficiencia: defOps,
      barreira: barreiraOps,
      acessibilidade: acessOps,
    };
  }, [catalogo]);

  useEffect(() => {
    const carregarPendentes = async () => {
      setLoadingEmpresas(true);
      try {
        const { data } = await api.get('/admin/empresas/pendentes');
        setEmpresas(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingEmpresas(false);
      }
    };

    const carregarCatalogo = async () => {
      setLoadingCatalogo(true);
      try {
        const { data } = await api.get('/admin/catalogo');
        setCatalogo(data || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCatalogo(false);
      }
    };

    if (hasToken) {
      carregarPendentes();
      carregarCatalogo();
    }
  }, []);

  const handleSave = async (resource: ResourceConfig) => {
    const payload = formValues[resource.key];
    if (!payload?.nome) return alert('Preencha o nome antes de salvar.');
    const parentKey = resource.parentKey;
    if (parentKey) {
      const selected = parentSelection[resource.key];
      if (!selected) return alert('Selecione o vínculo antes de salvar.');
      if (resource.key === 'barreira') (payload as any).deficienciaId = Number(selected);
      if (resource.key === 'subtipo_barreira') (payload as any).barreiraId = Number(selected);
      if (resource.key === 'subtipo_acessibilidade') (payload as any).acessibilidadeId = Number(selected);
    }
    try {
      setSalvando(resource.key);
      await api.post(resource.endpoint, payload);
      alert(`${resource.title} cadastrada com sucesso`);
      setFormValues((f) => ({ ...f, [resource.key]: { nome: '', descricao: '' } }));
      if (resource.parentKey) {
        setParentSelection((p) => ({ ...p, [resource.key]: '' }));
      }
      const { data } = await api.get('/admin/catalogo');
      setCatalogo(data || {});
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || 'Erro ao salvar');
    } finally {
      setSalvando(null);
    }
  };

  const aprovar = async (id: number) => {
    try {
      await api.post(`/admin/empresas/${id}/aprovar`);
      setEmpresas((list) => list.filter((e) => e.id_empresa !== id));
      alert('Empresa aprovada');
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || 'Erro ao aprovar');
    }
  };

  const loginAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      setLogando(true);
      const { data } = await api.post('/auth/admin/login', { email, senha });
      if (data?.token) {
        localStorage.setItem('token_admin', data.token);
        window.location.reload();
        return;
      }
      throw new Error('Token não retornado');
    } catch (err: any) {
      console.error(err);
      setAuthError(err?.response?.data?.error || 'Falha ao fazer login de administrador');
    } finally {
      setLogando(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token_admin');
    nav(0);
  };

  if (!hasToken) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-4">
          <div>
            <p className="section-title">Admin</p>
            <h1 className="text-2xl font-semibold text-brand-dark">Login do administrador</h1>
            <p className="text-sm text-gray-600">
              Use as credenciais de teste para acessar o painel e gerenciar cadastros.
            </p>
          </div>
          {authError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {authError}
            </div>
          )}
          <form onSubmit={loginAdmin} className="space-y-3">
            <Input
              id="admin-email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="admin-senha"
              label="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <Button type="submit" className="w-full" disabled={logando}>
              {logando ? 'Entrando...' : 'Entrar como admin'}
            </Button>
            <p className="text-xs text-gray-500">Teste: adm@gmail.com / adm123</p>
          </form>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold text-brand-dark">O que você pode fazer</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Cadastrar deficiências, barreiras e acessibilidades.</li>
            <li>• Aprovar cadastros de empresas pendentes.</li>
            <li>• Garantir que o conteúdo siga boas práticas de inclusão.</li>
          </ul>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="section-title">Administração</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-brand-dark">Painel do administrador</h1>
        <p className="text-sm text-gray-600">
          Cadastre novas taxonomias (deficiências, barreiras e acessibilidades) e aprove empresas pendentes.
        </p>
        <div className="flex flex-wrap gap-3">
          <span className="pill bg-brand-light text-brand-dark">Logado como admin</span>
          <Button variant="secondary" onClick={logout}>
            Sair
          </Button>
        </div>
      </div>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-brand-dark">Mapa de deficiências → barreiras → subtipos</h2>
        {loadingCatalogo && <p className="text-sm text-gray-600">Carregando catálogo...</p>}
        <div className="space-y-3">
          {(catalogo.deficiencias || []).map((def: any) => (
            <div key={def.id} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-brand-dark">{def.nome}</p>
                <span className="text-xs text-gray-500">{(def.barreiras || []).length} barreira(s)</span>
              </div>
              {def.descricao && <p className="text-xs text-gray-600">{def.descricao}</p>}
              <div className="mt-2 space-y-2">
                {(def.barreiras || []).map((b: any) => (
                  <div key={b.id} className="rounded-lg border border-brand-light bg-brand-light/40 px-3 py-2">
                    <div className="flex items-center justify-between text-sm text-brand-dark">
                      <span>{b.nome}</span>
                      <span className="text-xs text-gray-600">{(b.subtipos || []).length} subtipo(s)</span>
                    </div>
                    {b.descricao && <p className="text-xs text-gray-600">{b.descricao}</p>}
                    {b.subtipos && b.subtipos.length > 0 && (
                      <ul className="mt-1 space-y-1 text-xs text-gray-700">
                        {b.subtipos.map((s: any) => (
                          <li key={s.id} className="rounded border border-gray-200 bg-white px-2 py-1">
                            {s.nome}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                {(def.barreiras || []).length === 0 && (
                  <p className="text-xs text-gray-500">Nenhuma barreira vinculada.</p>
                )}
              </div>
            </div>
          ))}
          {(catalogo.deficiencias || []).length === 0 && (
            <p className="text-sm text-gray-500">Nenhuma deficiência cadastrada.</p>
          )}
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-brand-dark">Mapa de acessibilidades → subtipos</h2>
        {loadingCatalogo && <p className="text-sm text-gray-600">Carregando catálogo...</p>}
        <div className="space-y-3">
          {(catalogo.acessibilidades || []).map((acc: any) => (
            <div key={acc.id} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-brand-dark">{acc.nome}</p>
                <span className="text-xs text-gray-500">{(acc.subtipos || []).length} subtipo(s)</span>
              </div>
              {acc.descricao && <p className="text-xs text-gray-600">{acc.descricao}</p>}
              {acc.subtipos && acc.subtipos.length > 0 && (
                <ul className="mt-2 space-y-1 text-xs text-gray-700">
                  {acc.subtipos.map((s: any) => (
                    <li key={s.id} className="rounded border border-gray-200 bg-white px-2 py-1">
                      {s.nome}
                    </li>
                  ))}
                </ul>
              )}
              {(!acc.subtipos || acc.subtipos.length === 0) && (
                <p className="text-xs text-gray-500">Nenhum subtipo vinculado.</p>
              )}
            </div>
          ))}
          {(catalogo.acessibilidades || []).length === 0 && (
            <p className="text-sm text-gray-500">Nenhuma acessibilidade cadastrada.</p>
          )}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {resources.map((res) => (
          <Card key={res.key} className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-brand-dark">{res.title}</h2>
              <p className="text-sm text-gray-600">
                Informe um nome claro e, se necessário, um complemento para orientar empresas e candidatos.
              </p>
            </div>
            <Input
              id={`${res.key}-nome`}
              label="Nome"
              placeholder={res.placeholder}
              value={formValues[res.key]?.nome || ''}
              onChange={(e) => setFormValues((f) => ({ ...f, [res.key]: { ...f[res.key], nome: e.target.value } }))}
            />
            <Input
              id={`${res.key}-descricao`}
              label="Descrição (opcional)"
              placeholder="Detalhe o uso, exemplo ou orientação"
              value={formValues[res.key]?.descricao || ''}
              onChange={(e) =>
                setFormValues((f) => ({ ...f, [res.key]: { ...f[res.key], descricao: e.target.value } }))
              }
            />
            {res.parentKey && (
              <Dropdown
                id={`${res.key}-parent`}
                label={
                  res.parentKey === 'deficiencia'
                    ? 'Vincular à deficiência'
                    : res.parentKey === 'barreira'
                    ? 'Vincular à barreira'
                    : 'Vincular à acessibilidade'
                }
                options={parentOptions[res.parentKey] || []}
                value={parentSelection[res.key] || ''}
                onChange={(e) => setParentSelection((p) => ({ ...p, [res.key]: e.target.value }))}
                placeholder="Selecione para vincular"
              />
            )}
            <div className="flex justify-end">
              <Button disabled={salvando === res.key} onClick={() => handleSave(res)}>
                {salvando === res.key ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-brand-dark">Empresas pendentes</h2>
            <p className="text-sm text-gray-600">Analise dados completos e aprove o cadastro.</p>
          </div>
          <span className="pill">{empresas.length} pendente(s)</span>
        </div>

        {loadingEmpresas && <p className="text-sm text-gray-700">Carregando...</p>}
        {!loadingEmpresas && empresas.length === 0 && (
          <p className="text-sm text-gray-700">Nenhuma empresa aguardando aprovação.</p>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          {empresas.map((emp) => (
            <div key={emp.id_empresa} className="rounded-xl border border-brand-light bg-white/70 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-brand-dark">{emp.nome}</h3>
                  <p className="text-xs text-gray-600">{emp.email}</p>
                </div>
                <span className="pill">CNPJ: {emp.cnpj}</span>
              </div>
              <div className="mt-2 space-y-1 text-xs text-gray-700">
                <p>Telefone: {emp.telefone || '—'}</p>
                <p>
                  Local: {emp.cidade || '—'} / {emp.estado || '—'}
                </p>
                <p className="text-gray-600">{emp.descricao || 'Sem descrição'}</p>
              </div>
              <div className="mt-3 flex justify-end">
                <Button onClick={() => aprovar(emp.id_empresa)}>Aprovar empresa</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
