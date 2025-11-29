import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import LoginUsuario from '../pages/LoginUsuario';
import LoginEmpresa from '../pages/LoginEmpresa';
import DashboardUsuario from '../pages/DashboardUsuario';
import DashboardEmpresa from '../pages/DashboardEmpresa';
import Vagas from '../pages/Vagas';
import VagaDetalhe from '../pages/VagaDetalhe';
import CadastroUsuario from '../pages/CadastroUsuario';
import CadastroEmpresa from '../pages/CadastroEmpresa';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'usuario/login', element: <LoginUsuario /> },
      { path: 'empresa/login', element: <LoginEmpresa /> },
      { path: 'usuario/cadastro', element: <CadastroUsuario /> },
      { path: 'empresa/cadastro', element: <CadastroEmpresa /> },
      { path: 'vagas', element: <Vagas /> },
      { path: 'vaga/:id', element: <VagaDetalhe /> },
      {
        path: 'usuario/dashboard',
        element: (
          <ProtectedRoute role="usuario">
            <DashboardUsuario />
          </ProtectedRoute>
        ),
      },
      {
        path: 'empresa/dashboard',
        element: (
          <ProtectedRoute role="empresa">
            <DashboardEmpresa />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}