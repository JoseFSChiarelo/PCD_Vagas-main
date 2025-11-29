import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { api } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginUsuario() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/usuario/login', { email, senha });
      localStorage.setItem('token_usuario', data.token);
      nav('/usuario/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Erro ao entrar. Confira os dados.');
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <form onSubmit={submit} className="space-y-4" aria-label="Login de usuário">
          <div className="space-y-1">
            <p className="section-title">Área da pessoa candidata</p>
            <h1 className="text-2xl font-semibold text-brand-dark">Entrar como usuário</h1>
            <p className="text-sm text-gray-600">
              Acesse suas candidaturas, edite dados e acompanhe o status das vagas com feedback claro.
            </p>
          </div>

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
            <Button type="submit" aria-label="Entrar">
              Entrar
            </Button>
            <Link to="/usuario/cadastro" className="text-sm font-semibold text-brand-dark underline">
              Criar conta agora
            </Link>
          </div>
        </form>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-dark">Por que criar sua conta?</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Salve seus dados e aplique em um clique.</li>
          <li>• Veja acessibilidades e requisitos antes de se candidatar.</li>
          <li>• Receba retorno direto da empresa pelo painel.</li>
        </ul>
      </Card>
    </div>
  );
}
