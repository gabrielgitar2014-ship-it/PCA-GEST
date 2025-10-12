// DENTRO DE: src/pages/LoginPage.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FiLogIn, FiLoader } from 'react-icons/fi';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signInWithEmail } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signInWithEmail(email, password);

    if (error) {
      setError('Credenciais inválidas. Verifique seu e-mail e senha.');
      setLoading(false);
    } else {
      // O onAuthStateChange no AuthContext cuidará de atualizar o estado.
      // A navegação será tratada pelo componente de Rota Protegida,
      // mas podemos dar um empurrão inicial aqui.
      navigate('/');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-sm p-8 space-y-8 bg-slate-800 rounded-2xl shadow-lg border border-slate-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Login</h1>
          <p className="mt-2 text-slate-400">Acesse sua conta para continuar</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-white bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300"
              >
                Senha
              </label>
              <div className="text-sm">
                <Link to="/recuperar-senha" className="font-semibold text-indigo-400 hover:text-indigo-300">
                  Esqueceu a senha?
                </Link>
              </div>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-white bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <FiLoader className="animate-spin" />
              ) : (
                <>
                  <FiLogIn />
                  Entrar
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-center text-slate-400">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
