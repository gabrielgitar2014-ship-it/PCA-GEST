// DENTRO DE: src/components/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FiLoader } from 'react-icons/fi';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // 1. Enquanto a autenticação está sendo verificada, mostramos um loader
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FiLoader className="animate-spin text-4xl text-indigo-400" />
      </div>
    );
  }

  // 2. Se a verificação terminou e não há usuário, redireciona para o login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Se há um usuário, renderiza o componente filho (a página protegida)
  return children;
}

export default ProtectedRoute;