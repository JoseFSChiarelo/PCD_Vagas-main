import { Navigate } from 'react-router-dom';

type Props = { children: React.ReactNode; role: 'usuario' | 'empresa' };
export default function ProtectedRoute({ children, role }: Props) {
  const tokenUser = localStorage.getItem('token_usuario');
  const tokenCompany = localStorage.getItem('token_empresa');
  const ok = role === 'usuario' ? !!tokenUser : !!tokenCompany;
  if (!ok) return <Navigate to={role === 'usuario' ? '/usuario/login' : '/empresa/login'} replace />;
  return <>{children}</>;
}