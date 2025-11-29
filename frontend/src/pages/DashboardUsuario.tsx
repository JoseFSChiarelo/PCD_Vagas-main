import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

export default function DashboardUsuario() {
  const [perfil, setPerfil] = useState<any>(null);
  const [edit, setEdit] = useState<any>({});

  useEffect(() => {
    api.get('/usuarios/me').then((r) => {
      setPerfil(r.data);
      setEdit(r.data);
    });
  }, []);

  const salvar = async () => {
    await api.put('/usuarios/me', edit);
    alert('Dados atualizados');
  };

  if (!perfil) {
    return (
      <Card>
        <p className="text-sm text-gray-700">Carregando...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4" aria-label="Dashboard do usuário">
      <div className="space-y-1">
        <p className="section-title">Meu perfil</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-brand-dark">Ajuste suas preferências</h1>
        <p className="text-sm text-gray-600">Atualize contato, localização e acessibilidades necessárias.</p>
      </div>

      <Card className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            id="celular"
            label="Celular"
            value={edit.celular || ''}
            onChange={(e) => setEdit((f: any) => ({ ...f, celular: e.target.value }))}
          />
          <Input
            id="cidade"
            label="Cidade"
            value={edit.cidade || ''}
            onChange={(e) => setEdit((f: any) => ({ ...f, cidade: e.target.value }))}
          />
          <Input
            id="estado"
            label="Estado"
            value={edit.estado || ''}
            onChange={(e) => setEdit((f: any) => ({ ...f, estado: e.target.value }))}
          />
          <Input
            id="acessibilidades_necessarias"
            label="Acessibilidades necessárias"
            value={edit.acessibilidades_necessarias || ''}
            onChange={(e) => setEdit((f: any) => ({ ...f, acessibilidades_necessarias: e.target.value }))}
            helperText="Tecnologias assistivas, adaptações ou apoios necessários."
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={salvar}>Salvar alterações</Button>
        </div>
      </Card>
    </div>
  );
}
