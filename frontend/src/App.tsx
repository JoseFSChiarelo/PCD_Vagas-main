import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

import Home from './pages/Home'
import LoginUsuario from './pages/LoginUsuario'
import LoginEmpresa from './pages/LoginEmpresa'
import CadastroUsuario from './pages/CadastroUsuario'
import CadastroEmpresa from './pages/CadastroEmpresa'
import Vagas from './pages/Vagas'
import VagaDetalhe from './pages/VagaDetalhe'
import DashboardUsuario from './pages/DashboardUsuario'
import DashboardEmpresa from './pages/DashboardEmpresa'
import Admin from './pages/Admin'

export default function App() {
  return (
    <div className="min-h-screen pb-16">
      <Header />
      <main className="container pt-24 space-y-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/usuario/login" element={<LoginUsuario />} />
          <Route path="/empresa/login" element={<LoginEmpresa />} />
          <Route path="/usuario/cadastro" element={<CadastroUsuario />} />
          <Route path="/empresa/cadastro" element={<CadastroEmpresa />} />
          <Route path="/vagas" element={<Vagas />} />
          <Route path="/vaga/:id" element={<VagaDetalhe />} />
          <Route path="/usuario/dashboard" element={<DashboardUsuario />} />
          <Route path="/empresa/dashboard" element={<DashboardEmpresa />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
