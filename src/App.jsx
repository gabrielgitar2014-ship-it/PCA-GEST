import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importando os provedores e componentes necessários
import { DataProvider } from './contexts/DataContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MainLayout from './components/MainLayout.jsx';

// Importando todas as páginas
import LoginPage from './pages/LoginPage.jsx';
import AtivarChavePage from './pages/AtivarChavePage.jsx';
import CadastroAtivadoPage from './pages/CadastroAtivadoPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import CompanySelection from './pages/CompanySelection.jsx';
import Dashboard from './pages/Dashboard.jsx';
import FuncionariosPage from './pages/FuncionariosPage.jsx';
import FuncionarioCreatePage from './pages/FuncionarioCreatePage.jsx';
import FuncionarioDetailPage from './pages/FuncionarioDetailPage.jsx';
import AudiometriaCreatePage from './pages/AudiometriaCreatePage.jsx';
import AudiometriaDetailPage from './pages/AudiometriaDetailPage.jsx';
import CasosParaAnalisePage from './pages/CasosParaAnalisePage.jsx';
import CasosDeAgravamentoPage from './pages/CasosDeAgravamentoPage.jsx';
import MeuPerfilPage from './pages/MeuPerfilPage.jsx';
import LicencaPage from './pages/LicencaPage.jsx';
import RelatoriosPage from './pages/RelatoriosPage.jsx';
import GaiChatPage from './pages/GaiChatPage.jsx';
import AudiometriasPage from './pages/AudiometriasPage.jsx';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <div className="bg-gray-50 min-h-screen">
            <Routes>
              {/* --- Rotas Públicas --- */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/ativar-chave" element={<AtivarChavePage />} />
              <Route path="/cadastro-ativado" element={<CadastroAtivadoPage />} />
              <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
              <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
              
              {/* --- Rotas Protegidas --- */}
              <Route path="/" element={<ProtectedRoute><CompanySelection /></ProtectedRoute>} />
              
              {/* Layout principal que depende de um :companyId */}
              <Route path="/dashboard/:companyId" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                {/* Todas as rotas aqui dentro são relativas e herdam o :companyId */}
                <Route index element={<Dashboard />} />
                <Route path="funcionarios" element={<FuncionariosPage />} />
                <Route path="funcionarios/novo" element={<FuncionarioCreatePage />} />
                <Route path="funcionarios/:workerId" element={<FuncionarioDetailPage />} />
                <Route path="funcionarios/:workerId/audiometrias/nova" element={<AudiometriaCreatePage />} />
                <Route path="funcionarios/:workerId/audiometrias/:examId" element={<AudiometriaDetailPage />} />
                <Route path="audiometrias" element={<AudiometriasPage />} />
                <Route path="casos-para-analise" element={<CasosParaAnalisePage />} />
                <Route path="casos-de-agravamento" element={<CasosDeAgravamentoPage />} />
                <Route path="relatorios" element={<RelatoriosPage />} />
                <Route path="gai-chat" element={<GaiChatPage />} />

                {/* ✅ ROTAS DE PERFIL E LICENÇA CORRIGIDAS PARA SEREM RELATIVAS */}
                <Route path="meu-perfil" element={<MeuPerfilPage />} />
                <Route path="licenca" element={<LicencaPage />} />
              </Route>
            </Routes>
          </div>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

