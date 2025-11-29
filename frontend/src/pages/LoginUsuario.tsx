import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { api } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginUsuario() {
  const [email,setEmail]=useState(''); const [senha,setSenha]=useState(''); const [error,setError]=useState('');
  const nav = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/usuario/login', { email, senha });
      localStorage.setItem('token_usuario', data.token);
      nav('/usuario/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Erro ao logar');
    }
  };
  return (
    <form onSubmit={submit} className="max-w-md mx-auto" aria-label="Login de usuário">
      <h1 className="text-2xl font-semibold text-brand-dark mb-4">Entrar como Usuário</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-2" role="alert">{error}</div>}
      <Input id="email" label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <Input id="senha" label="Senha" type="password" value={senha} onChange={e=>setSenha(e.target.value)} />
      <Button type="submit" aria-label="Entrar">Entrar</Button>
      <p className="mt-3 text-sm">Não tem conta? <Link to="/usuario/cadastro" className="text-brand-accent underline">Cadastre-se</Link></p>
    </form>
  );
}