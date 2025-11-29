import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';

export default function DashboardUsuario() {
  const [perfil,setPerfil]=useState<any>(null);
  const [edit,setEdit]=useState<any>({});
  useEffect(()=>{ api.get('/usuarios/me').then(r=>{setPerfil(r.data); setEdit(r.data);}); },[]);
  const salvar = async () => { await api.put('/usuarios/me', edit); alert('Dados atualizados'); };
  if (!perfil) return <p>Carregando...</p>;
  return (
    <div aria-label="Dashboard do usuário" className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-brand-dark mb-4">Meu Perfil</h1>
      <Input id="celular" label="Celular" value={edit.celular||''} onChange={e=>setEdit((f:any)=>({...f,celular:e.target.value}))}/>
      <Input id="cidade" label="Cidade" value={edit.cidade||''} onChange={e=>setEdit((f:any)=>({...f,cidade:e.target.value}))}/>
      <Input id="estado" label="Estado" value={edit.estado||''} onChange={e=>setEdit((f:any)=>({...f,estado:e.target.value}))}/>
      <Input id="acessibilidades_necessarias" label="Acessibilidades necessárias" value={edit.acessibilidades_necessarias||''} onChange={e=>setEdit((f:any)=>({...f,acessibilidades_necessarias:e.target.value}))}/>
      <Button onClick={salvar}>Salvar</Button>
    </div>
  );
}