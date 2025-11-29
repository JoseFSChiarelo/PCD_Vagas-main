import { useState, useEffect } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { onlyDigits, formatCelular, formatCEP } from '../../../backend/src/utils/format';
import { buscarEnderecoPorCEP } from '../../../backend/src/utils/endereco';

export default function CadastroEmpresa() {
  const [form, setForm] = useState<any>({});
  const [banner, setBanner] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string; details?: string[] } | null>(null);
  const nav = useNavigate();
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const validate = () => {
    const errs: string[] = [];
    const descricaoVal = (form.descricao || '').trim();
    if (!form.cnpj) errs.push('Informe o CNPJ.');
    if (!form.nome) errs.push('Informe o nome da empresa.');
    if (!form.email) errs.push('Informe o email comercial.');
    if (!form.telefone) errs.push('Informe o telefone comercial.');
    if (!descricaoVal || descricaoVal.length < 10) errs.push('Descrição deve ter pelo menos 10 caracteres.');
    if (!form.cep) errs.push('Informe o CEP.');
    if (!form.cidade) errs.push('Informe a cidade.');
    if (!form.estado) errs.push('Informe o estado.');
    if (!form.senha || form.senha.length < 8) errs.push('Senha deve ter no mínimo 8 caracteres.');
    return errs;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const errs = validate();
      if (errs.length) {
        setToast({ type: 'error', message: 'Confira os campos obrigatórios.', details: errs });
        return;
      }
      await api.post('/empresas', {
        ...form,
        cnpj: onlyDigits(form.cnpj || ''),
        telefone: onlyDigits(form.telefone || ''),
        cep: onlyDigits(form.cep || ''),
      });
      setBanner('Cadastro enviado! Em até 1 dia liberaremos o acesso após aprovação.');
      setToast({ type: 'success', message: 'Cadastro enviado! Em até 1 dia liberaremos o acesso após aprovação.' });
      setTimeout(() => {
        nav('/empresa/login?status=pending');
      }, 800);
    } catch (err: any) {
      console.error(err);
      const resp = err?.response?.data?.error;
      if (typeof resp === 'string') {
        setError(resp);
        setToast({ type: 'error', message: resp });
      } else if (resp?.fieldErrors) {
        const [firstField] = Object.keys(resp.fieldErrors);
        const firstMsg = resp.fieldErrors[firstField]?.[0];
        if (firstField === 'descricao') {
          setError('Descrição deve ter pelo menos 10 caracteres.');
          setToast({ type: 'error', message: 'Descrição deve ter pelo menos 10 caracteres.' });
        } else {
          const msg = firstMsg || 'Erro ao cadastrar empresa';
          setError(msg);
          setToast({ type: 'error', message: msg });
        }
      } else {
        setError('Erro ao cadastrar empresa');
        setToast({ type: 'error', message: 'Erro ao cadastrar empresa' });
      }
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

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10">
          <div className="rounded-2xl shadow-2xl border px-5 py-4 max-w-xl w-full mx-4 bg-white/95 backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={`text-sm font-semibold ${toast.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                  {toast.message}
                </p>
                {toast.details && (
                  <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {toast.details.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setToast(null)}
                aria-label="Fechar aviso"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
      {banner && (
        <div className="rounded-xl border border-brand-light bg-brand-light/70 px-4 py-3 text-sm font-semibold text-brand-dark shadow-sm">
          {banner}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <p className="section-title">Área da empresa</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-brand-dark">Cadastro da empresa</h1>
        <p className="text-sm text-gray-600 max-w-3xl">
          Publique vagas com acessibilidade garantida e acompanhe candidaturas em um painel simples e direto.
        </p>
      </div>

      <Card>
        <form onSubmit={submit} className="space-y-6" aria-label="Cadastro de empresa">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              id="cnpj"
              label="CNPJ"
              value={onlyDigits(form.cnpj || '')}
              onChange={(e) => {
                const digits = onlyDigits(e.target.value).slice(0, 14);
                set('cnpj', digits);
              }}
              maxLength={18}
              inputMode="numeric"
              placeholder="Ex: 00000000000000"
              helperText="Somente números."
            />

            <Input
              id="nome"
              label="Nome da Empresa"
              value={form.nome || ''}
              onChange={(e) => set('nome', e.target.value)}
              maxLength={60}
              placeholder="Nome fantasia ou razão social"
            />

            <Input
              id="email"
              label="Email Comercial"
              type="email"
              value={form.email || ''}
              onChange={(e) => set('email', e.target.value)}
              placeholder="empresa@email.com"
            />

            <Input
              id="telefone"
              label="Telefone Comercial"
              value={formatCelular(onlyDigits(form.telefone || ''))}
              onChange={(e) => {
                const digits = onlyDigits(e.target.value).slice(0, 11);
                set('telefone', digits);
              }}
              maxLength={16}
              inputMode="numeric"
              placeholder="(99) 99999-9999"
            />

            <Input
              id="descricao"
              label="Descrição da Empresa"
              value={form.descricao || ''}
              onChange={(e) => set('descricao', e.target.value)}
              placeholder="Breve descrição da atividade"
              minLength={10}
              helperText="Mínimo 10 caracteres."
            />

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

            <Input id="cidade" label="Cidade" value={form.cidade || ''} onChange={(e) => set('cidade', e.target.value)} />

            <Input id="estado" label="Estado" value={form.estado || ''} onChange={(e) => set('estado', e.target.value)} />

            <Input
              id="senha"
              label="Senha de Acesso"
              type="password"
              value={form.senha || ''}
              onChange={(e) => set('senha', e.target.value)}
              helperText="Use ao menos 8 caracteres."
            />
          </div>

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
