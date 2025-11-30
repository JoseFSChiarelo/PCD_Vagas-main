import { useEffect, useState } from 'react';
import Input from '../components/Input';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import Card from '../components/Card';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { escolaridadeOptions, sexoOptions, deficienciaOptions } from '../constants/enums';
import { onlyDigits, formatCelular, formatCEP } from '../../../backend/src/utils/format';
import { buscarEnderecoPorCEP } from '../../../backend/src/utils/endereco';

export default function CadastroUsuario() {
  const [form, setForm] = useState<any>({});
  const [catalogo, setCatalogo] = useState<any>({ deficiencias: [], acessibilidades: [] });
  const [loadingCatalogo, setLoadingCatalogo] = useState(true);
  const nav = useNavigate();
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const appendText = (k: string, v: string) => {
    if (!v) return;
    setForm((f: any) => {
      const current = f[k] ? String(f[k]) : '';
      if (!current) return { ...f, [k]: v };
      const alreadyHas = current.toLowerCase().includes(v.toLowerCase());
      return alreadyHas ? f : { ...f, [k]: `${current}; ${v}` };
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/usuarios', {
        ...form,
        cpf: onlyDigits(form.cpf || ''),
        celular: onlyDigits(form.celular || ''),
        cep: onlyDigits(form.cep || ''),
      });
      nav('/usuario/login');
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || 'Erro ao cadastrar usuario');
    }
  };

  useEffect(() => {
    const preencherEndereco = async () => {
      const resultado = await buscarEnderecoPorCEP(form.cep || '');
      if (resultado) {
        set('cidade', resultado.cidade);
        set('estado', resultado.estado);
      }
    };

    preencherEndereco();
  }, [form.cep]);

  useEffect(() => {
    const carregarCatalogo = async () => {
      try {
        const { data } = await api.get('/catalogo');
        setCatalogo(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCatalogo(false);
      }
    };
    carregarCatalogo();
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="section-title">Perfil da pessoa candidata</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-brand-dark">Cadastro de Usuario</h1>
        <p className="text-sm text-gray-600 max-w-3xl">
          Preencha apenas o essencial. Campos sensiveis como CPF e telefone sao usados apenas para identificacao e contato
          com as empresas.
        </p>
      </div>

      <Card>
        <div className="space-y-3 mb-6">
          <div>
            <p className="section-title">Referencias do nosso banco</p>
            <p className="text-sm text-gray-700">
              Veja deficiencias, barreiras e acessibilidades ja cadastradas. Clique para preencher rapidamente os campos de
              barreiras, subtipos ou acessibilidades necessarias.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-brand-dark">Barreiras e subtipos</p>
              {loadingCatalogo ? (
                <p className="text-xs text-gray-600">Carregando catalogo...</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {catalogo?.deficiencias?.flatMap((d: any) =>
                    d.barreiras?.map((b: any) => (
                      <button
                        key={`barreira-${b.id}`}
                        type="button"
                        className="pill bg-white border border-brand-dark/20 hover:border-brand-dark hover:-translate-y-0.5 transition"
                        onClick={() => appendText('barreiras', b.nome)}
                        aria-label={`Adicionar barreira ${b.nome}`}
                      >
                        {b.nome}
                        {b.subtipos?.length ? (
                          <span className="ml-1 text-[11px] text-gray-600">
                            ({b.subtipos.map((s: any) => s.nome).join(', ')})
                          </span>
                        ) : null}
                      </button>
                    ))
                  ) || <p className="text-xs text-gray-600">Nenhuma barreira cadastrada</p>}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-brand-dark">Acessibilidades e subtipos</p>
              {loadingCatalogo ? (
                <p className="text-xs text-gray-600">Carregando catalogo...</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {catalogo?.acessibilidades?.map((a: any) => (
                    <button
                      key={`acc-${a.id}`}
                      type="button"
                      className="pill bg-white border border-brand-dark/20 hover:border-brand-dark hover:-translate-y-0.5 transition"
                      onClick={() => appendText('acessibilidades_necessarias', a.nome)}
                      aria-label={`Adicionar acessibilidade ${a.nome}`}
                    >
                      {a.nome}
                      {a.subtipos?.length ? (
                        <span className="ml-1 text-[11px] text-gray-600">
                          ({a.subtipos.map((s: any) => s.nome).join(', ')})
                        </span>
                      ) : null}
                    </button>
                  )) || <p className="text-xs text-gray-600">Nenhuma acessibilidade cadastrada</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-6" aria-label="Cadastro de usuario">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              id="cpf"
              label="CPF"
              value={onlyDigits(form.cpf || '')}
              onChange={(e) => {
                const digits = onlyDigits(e.target.value).slice(0, 11);
                set('cpf', digits);
              }}
              maxLength={11}
              inputMode="numeric"
              pattern="\d*"
              placeholder="Ex: 00000000000"
              helperText="Somente numeros, usados para validar seu perfil."
            />

            <Input
              id="email"
              label="Email"
              type="email"
              value={form.email || ''}
              onChange={(e) => set('email', e.target.value)}
              placeholder="meuemail@mail.com"
            />

            <Input
              id="celular"
              label="Celular"
              value={formatCelular(onlyDigits(form.celular || ''))}
              onChange={(e) => {
                const digits = onlyDigits(e.target.value).slice(0, 11);
                set('celular', digits);
              }}
              maxLength={16}
              inputMode="numeric"
              placeholder="(99) 99999-9999"
              helperText="Usado para contato da empresa."
            />

            <Input
              id="nome"
              label="Nome"
              value={form.nome || ''}
              onChange={(e) => set('nome', e.target.value)}
              maxLength={60}
              placeholder="Nome e sobrenome"
            />

            <Input
              id="nascimento"
              label="Data de Nascimento"
              type="date"
              value={form.nascimento || ''}
              onChange={(e) => set('nascimento', e.target.value)}
            />

            <Dropdown
              id="sexo"
              label="Sexo"
              options={sexoOptions}
              value={form.sexo || ''}
              onChange={(e) => set('sexo', e.target.value)}
              placeholder="Selecione"
            />

            <Dropdown
              id="escolaridade"
              label="Nivel de Escolaridade"
              options={escolaridadeOptions}
              value={form.escolaridade || ''}
              onChange={(e) => set('escolaridade', e.target.value)}
              placeholder="Selecione"
            />

            <Dropdown
              id="tipo_deficiencia"
              label="Tipo de deficiencia"
              options={deficienciaOptions}
              value={form.tipo_deficiencia || ''}
              onChange={(e) => set('tipo_deficiencia', e.target.value)}
              placeholder="Selecione"
            />

            <Input
              id="subtipo_deficiencia"
              label="Subtipo"
              value={form.subtipo_deficiencia || ''}
              onChange={(e) => set('subtipo_deficiencia', e.target.value)}
              placeholder="Ex: mobilidade reduzida"
            />

            <Input
              id="barreiras"
              label="Barreiras"
              value={form.barreiras || ''}
              onChange={(e) => set('barreiras', e.target.value)}
              placeholder="Ex: acessibilidade fisica, digital, comunicacao"
            />

            <Input
              id="acessibilidades_necessarias"
              label="Acessibilidades necessarias"
              value={form.acessibilidades_necessarias || ''}
              onChange={(e) => set('acessibilidades_necessarias', e.target.value)}
              placeholder="Tecnologias assistivas, apoio, adaptacoes"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Input
              id="cep"
              label="CEP"
              value={formatCEP(onlyDigits(form.cep || ''))}
              onChange={(e) => {
                const digits = onlyDigits(e.target.value).slice(0, 8);
                set('cep', digits);
              }}
              maxLength={10}
              inputMode="numeric"
              placeholder="99999-999"
              helperText="Buscamos cidade/estado automaticamente."
            />

            <Input
              id="cidade"
              label="Cidade"
              value={form.cidade || ''}
              onChange={(e) => set('cidade', e.target.value)}
            />

            <Input
              id="estado"
              label="Estado"
              value={form.estado || ''}
              onChange={(e) => set('estado', e.target.value)}
            />
          </div>

          <Input
            id="senha"
            label="Senha"
            type="password"
            value={form.senha || ''}
            onChange={(e) => set('senha', e.target.value)}
            helperText="Use ao menos 8 caracteres para manter sua conta protegida."
          />

          <div className="flex justify-end">
            <Button type="submit" className="px-6">
              Cadastrar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
