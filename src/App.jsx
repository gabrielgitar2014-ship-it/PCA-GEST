// DENTRO DE: src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Importando os provedores de contexto
import { DataProvider } from '@/contexts/DataContext';
import { AuthProvider } from '@/contexts/AuthContext';

// 2. Importando os componentes de layout e proteção
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/MainLayout';

// 3. Importando todas as páginas da aplicação
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import CompanySelection from '@/pages/CompanySelection';
import Dashboard from '@/pages/Dashboard';
import FuncionariosPage from '@/pages/FuncionariosPage';
import FuncionarioCreatePage from '@/pages/FuncionarioCreatePage';
import FuncionarioDetailPage from '@/pages/FuncionarioDetailPage';
import AudiometriaCreatePage from '@/pages/AudiometriaCreatePage';
import CasosParaAnalisePage from '@/pages/CasosParaAnalisePage';
import CasosDeAgravamentoPage from '@/pages/CasosDeAgravamentoPage';
import MeuPerfilPage from '@/pages/MeuPerfilPage'; // Importa a nova página de perfil

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <div className="bg-gray-100 min-h-screen text-slate-700">
            <Routes>
              {/* --- ROTAS PÚBLICAS --- */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<SignUpPage />} />
              <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
              <Route path="/update-password" element={<ResetPasswordPage />} />

              {/* --- ROTAS PROTEGIDAS --- */}
              
              {/* Rota da Seleção de Empresa (não usa o MainLayout) */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <CompanySelection />
                  </ProtectedRoute>
                }
              />

              {/* Rota de Layout para o Dashboard e páginas internas */}
              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard/:companyId" element={<Dashboard />} />
                <Route path="/dashboard/:companyId/funcionarios" element={<FuncionariosPage />} />
                <Route path="/dashboard/:companyId/funcionarios/novo" element={<FuncionarioCreatePage />} />
                <Route path="/dashboard/:companyId/funcionarios/:workerId" element={<FuncionarioDetailPage />} />
                <Route path="/dashboard/:companyId/funcionarios/:workerId/audiometrias/nova" element={<AudiometriaCreatePage />} />
                
                <Route path="/dashboard/:companyId/casos-para-analise" element={<CasosParaAnalisePage />} />
                <Route path="/dashboard/:companyId/casos-de-agravamento" element={<CasosDeAgravamentoPage />} />
                
                {/* Rota para a página de perfil do usuário */}
                <Route path="/meu-perfil" element={<MeuPerfilPage />} />
              </Route>
            </Routes>
          </div>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;