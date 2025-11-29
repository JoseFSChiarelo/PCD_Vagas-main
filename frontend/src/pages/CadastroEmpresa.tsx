import { useState, useEffect } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { onlyDigits, formatCelular, formatCEP } from '../../../backend/src/utils/format';
import { buscarEnderecoPorCEP } from '../../../backend/src/utils/endereco';

export default function CadastroEmpresa() {
  const [form, setForm] = useState<any>({});
  const nav = useNavigate();
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  // Submissão
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação opcional do CNPJ
    // if (!cnpj.isValid(form.cnpj || '')) {
    //   alert("CNPJ inválido. Verifique os números digitados.");
    //   return;
    // }

    try {
      await api.post('/empresas', {
        ...form,
        cnpj: onlyDigits(form.cnpj || ''),
        telefone: onlyDigits(form.telefone || ''),
        cep: onlyDigits(form.cep || ''),
      });
      nav('/empresa/login');
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || 'Erro ao cadastrar empresa');
    }
  };

  // Preenchimento automático de cidade/estado via CEP
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
    <form onSubmit={submit} className="max-w-2xl mx-auto" aria-label="Cadastro de empresa">
      <h1 className="text-2xl font-semibold text-brand-dark mb-4">Cadastro de Empresa</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          id="cnpj"
          label="CNPJ"
          value={onlyDigits(form.cnpj || '')}
          onChange={e => {
            const digits = onlyDigits(e.target.value).slice(0, 14);
            set('cnpj', digits);
          }}
          maxLength={18}
          inputMode="numeric"
          placeholder="Ex: 00000000000000"
        />

        <Input id="nome" label="Nome da Empresa" value={form.nome || ''} onChange={e => set('nome', e.target.value)} maxLength={60} placeholder="Nome Fantasia ou Razão Social" />

        <Input id="email" label="Email Comercial" type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} placeholder="empresa@email.com" />

        <Input
          id="telefone"
          label="Telefone Comercial"
          value={formatCelular(onlyDigits(form.telefone || ''))}
          onChange={e => {
            const digits = onlyDigits(e.target.value).slice(0, 11);
            set('telefone', digits);
          }}
          maxLength={16}
          inputMode="numeric"
          placeholder="(99) 99999-9999"
        />

        <Input id="descricao" label="Descrição da Empresa" value={form.descricao || ''} onChange={e => set('descricao', e.target.value)} placeholder="Breve descrição da atividade" />

        <Input
          id="cep"
          label="CEP"
          value={formatCEP(onlyDigits(form.cep || ''))}
          onChange={e => {
            const digits = onlyDigits(e.target.value).slice(0, 8);
            set('cep', digits);
          }}
          maxLength={10}
          inputMode="numeric"
          placeholder="99999-999"
        />

        <Input id="cidade" label="Cidade" value={form.cidade || ''} onChange={e => set('cidade', e.target.value)} />

        <Input id="estado" label="Estado" value={form.estado || ''} onChange={e => set('estado', e.target.value)} />

        <Input id="senha" label="Senha de Acesso" type="password" value={form.senha || ''} onChange={e => set('senha', e.target.value)} />
      </div>
      <Button type="submit" className="mt-4">Cadastrar</Button>
    </form>
  );
}