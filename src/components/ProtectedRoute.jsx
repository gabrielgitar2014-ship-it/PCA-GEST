// DENTRO DE: src/components/ProtectedRoute.jsx

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Ajuste o caminho se necessário
import { FiLoader } from 'react-icons/fi'; // Ou seu ícone de loading

// Componente de Loading simples (ou importe o seu)
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <FiLoader className="animate-spin text-4xl text-sky-500" />
  </div>
);

function ProtectedRoute({ children }) {
  // ✅ Pega user, loading E isLicenseValid
  const { user, loading, isLicenseValid } = useAuth(); 
  const location = useLocation();

  // 1. Mostra Loading enquanto:
  //    - O AuthContext ainda está carregando a sessão inicial (loading = true)
  //    - OU a verificação da licença ainda não terminou (isLicenseValid = null)
  if (loading || isLicenseValid === null) {
    console.log(`[ProtectedRoute] Estado de carregamento: loading=${loading}, isLicenseValid=${isLicenseValid}`);
    return <LoadingScreen />;
  }

  // 2. Se não está carregando, verifica:
  //    - Se NÃO há usuário logado
  //    - OU se a licença NÃO é válida
  if (!user || !isLicenseValid) {
    console.warn(`[ProtectedRoute] Acesso negado! User: ${!!user}, LicenseValid: ${isLicenseValid}. Redirecionando para /login.`);
    // Redireciona para login, passando a rota original e um possível erro
    return <Navigate 
             to="/login" 
             state={{ from: location, error: !user ? 'unauthenticated' : 'license_invalid' }} 
             replace 
           />;
  }

  // 3. Se passou por tudo, permite o acesso
  console.log("[ProtectedRoute] Acesso permitido.");
  return children;
}

export default ProtectedRoute;