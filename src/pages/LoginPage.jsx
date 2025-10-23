// DENTRO DE: src/pages/LoginPage.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FiLogIn, FiLoader, FiAlertCircle } from 'react-icons/fi';
// ✅ CORREÇÃO APLICADA AQUI: Ajustado o caminho de importação
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); 
  const { signInWithEmail } = useAuth();

  useEffect(() => {
    if (location.state?.error === 'license_invalid') {
      setError('Sua licença não está ativa (pode ter sido suspensa, expirada ou não encontrada). Entre em contato com o suporte.');
      window.history.replaceState({}, document.title) 
    } else if (location.state?.error === 'unauthenticated') {
      // Opcional
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);
    const { error: signInError } = await signInWithEmail(email, password);

    if (signInError) {
      setError('Credenciais inválidas. Verifique seu e-mail e senha.');
      setLoading(false);
    } else {
      navigate('/'); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white-800 rounded-2xl shadow-lg border border-slate-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Login</h1>
          <p className="mt-2 text-slate-400">Acesse sua conta para continuar</p>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-red-900 border-red-700 text-red-100">
            <FiAlertCircle className="h-5 w-5 text-red-300" /> 
            <AlertTitle className="font-semibold text-red-200">Erro de Acesso</AlertTitle>
            <AlertDescription className="text-sm text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
            <input
              id="email" name="email" type="email" autoComplete="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-white bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">Senha</label>
              <div className="text-sm">
                <Link to="/recuperar-senha" className="font-semibold text-indigo-400 hover:text-indigo-300">
                  Esqueceu a senha?
                </Link>
              </div>
            </div>
            <input
              id="password" name="password" type="password" autoComplete="current-password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-white bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (<FiLoader className="animate-spin" />) : (<><FiLogIn /> Entrar</>)}
            </button>
          </div>
          <p className="text-sm text-center text-slate-400">
            Não tem uma conta?{' '}
            <Link to="/ativar-chave" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Ative sua licença
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;