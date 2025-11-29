import { useMemo, useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { api } from '../services/api';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function LoginEmpresa() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();
   const location = useLocation();

  const pendingBanner = useMemo(() => {
    const status = new URLSearchParams(location.search).get('status');
    return status === 'pending';
  }, [location.search]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/empresa/login', { email, senha });
      localStorage.setItem('token_empresa', data.token);
      nav('/empresa/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Erro ao entrar. Confira os dados.');
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <form onSubmit={submit} className="space-y-4" aria-label="Login de empresa">
          <div className="space-y-1">
            <p className="section-title">Área da empresa</p>
            <h1 className="text-2xl font-semibold text-brand-dark">Entrar como empresa</h1>
            <p className="text-sm text-gray-600">
              Publique vagas acessíveis, acompanhe candidaturas e dê retorno com poucos cliques.
            </p>
          </div>

          {pendingBanner && (
            <div className="rounded-xl border border-brand-light bg-brand-light/70 px-3 py-2 text-sm font-semibold text-brand-dark" role="status">
              Cadastro recebido! Em até 1 dia a conta será aprovada para login.
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}

          <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            id="senha"
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit">Entrar</Button>
            <Link to="/empresa/cadastro" className="text-sm font-semibold text-brand-dark underline">
              Criar conta da empresa
            </Link>
          </div>
        </form>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-dark">O que sua equipe ganha</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Cards de vaga com acessibilidades e requisitos claros.</li>
          <li>• Dashboard com status, candidaturas e controle de publicação.</li>
          <li>• Comunicação mais humana com pessoas candidatas PCD.</li>
        </ul>
      </Card>
    </div>
  );
}
