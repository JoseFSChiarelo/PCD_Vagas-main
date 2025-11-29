import { useEffect, useState } from 'react';
import Input from '../components/Input';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { escolaridadeOptions, sexoOptions, deficienciaOptions } from '../constants/enums';
import { onlyDigits, formatCelular, formatCEP } from "../../../backend/src/utils/format";
import { buscarEnderecoPorCEP } from '../../../backend/src/utils/endereco';


export default function CadastroUsuario() {
  const [form, setForm] = useState<any>({});
  const nav = useNavigate();
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  // Submissão
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/usuarios', {
        ...form,
        cpf: onlyDigits(form.cpf || ''),       // garante só dígitos
        celular: onlyDigits(form.celular || ''), // garante só dígitos
        cep: onlyDigits(form.cep || ''),       // garante só dígitos
      });
      nav('/usuario/login');
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || 'Erro ao cadastrar usuário');
    }
  };

  // Busca cidade/UF pelo CEP
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
    <form onSubmit={submit} className="max-w-2xl mx-auto" aria-label="Cadastro de usuário">
      <h1 className="text-2xl font-semibold text-brand-dark mb-4">Cadastro de Usuário</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {/* CPF: só números, sem formatação visual */}
        <Input
          id="cpf"
          label="CPF"
          value={onlyDigits(form.cpf || '')}
          onChange={e => {
            const digits = onlyDigits(e.target.value).slice(0, 11); // limite 11
            set('cpf', digits);
          }}
          maxLength={11}
          inputMode="numeric"
          pattern="\d*"
          placeholder="Ex: 00000000000"
        />
        {/* traz em formato e-mail*/}
        <Input
          id="email"
          label="Email"
          type="email"
          value={form.email || ''}
          onChange={e => set('email', e.target.value)}
          placeholder="meuemail@mail.com"
        />

        {/* Celular: mostra formatado, guarda só dígitos */}
        <Input
          id="celular"
          label="Celular"
          value={formatCelular(onlyDigits(form.celular || ''))}
          onChange={e => {
            const digits = onlyDigits(e.target.value).slice(0, 11);
            set('celular', digits);
          }}
          maxLength={16}
          inputMode="numeric"
          placeholder="(99) 99999-9999"
        />


        <Input id="nome" label="Nome" value={form.nome || ''} onChange={e => set('nome', e.target.value)} maxLength={60} placeholder="Nome e Sobrenome" />

        <Input id="nascimento" label="Data de Nascimento" type="date" value={form.nascimento || ''} onChange={e => set('nascimento', e.target.value)} />

        <Dropdown id="sexo" label="Sexo" options={sexoOptions} value={form.sexo || ''} onChange={e => set('sexo', e.target.value)} placeholder="EX: MASCULINO" />

        <Dropdown id="escolaridade" label="Nível de Escolaridade" options={escolaridadeOptions} value={form.escolaridade || ''} onChange={e => set('escolaridade', e.target.value)} placeholder="-" />

        <Dropdown id="tipo_deficiencia" label="Tipo de deficiência" options={deficienciaOptions} value={form.tipo_deficiencia || ''} onChange={e => set('tipo_deficiencia', e.target.value)} placeholder="-" />

        <Input id="subtipo_deficiencia" label="Subtipo" value={form.subtipo_deficiencia || ''} onChange={e => set('subtipo_deficiencia', e.target.value)} placeholder="" />

        <Input id="barreiras" label="Barreiras" value={form.barreiras || ''} onChange={e => set('barreiras', e.target.value)} />
        <Input id="acessibilidades_necessarias" label="Acessibilidades necessárias" value={form.acessibilidades_necessarias||''} onChange={e=>set('acessibilidades_necessarias',e.target.value)} />

        {/* CEP: mostra formatado, guarda só dígitos */}
        <Input
          id="cep"
          label="CEP"
          value={formatCEP(onlyDigits(form.cep || ''))}
          onChange={e => {
            const digits = onlyDigits(e.target.value).slice(0, 8);
            set('cep', digits);
          }}
          maxLength={10} // "99999-999"
          inputMode="numeric"
          placeholder="99999-999"
        />

        <Input id="cidade" label="Cidade" value={form.cidade || ''} onChange={e => set('cidade', e.target.value)} />

        <Input id="estado" label="Estado" value={form.estado || ''} onChange={e => set('estado', e.target.value)} />

        <Input id="senha" label="Senha" type="password" value={form.senha || ''} onChange={e => set('senha', e.target.value)} />
      </div>
      <Button type="submit" className="mt-4">Cadastrar</Button>
    </form>
  );
}
