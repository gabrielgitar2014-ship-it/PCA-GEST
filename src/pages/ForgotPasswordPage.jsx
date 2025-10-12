// NOVO ARQUIVO: src/pages/ForgotPasswordPage.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FiMail, FiLoader, FiCheckCircle } from 'react-icons/fi';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { resetPasswordForEmail } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const { error } = await resetPasswordForEmail(email);

    if (error) {
      setError('Não foi possível enviar o link. Verifique o e-mail informado.');
    } else {
      setMessage('Link de recuperação enviado! Verifique sua caixa de entrada e a pasta de spam.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-sm p-8 space-y-8 bg-slate-800 rounded-2xl shadow-lg border border-slate-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Recuperar Senha</h1>
          <p className="mt-2 text-slate-400">
            Insira seu e-mail para receber o link de redefinição.
          </p>
        </div>
        
        {message ? (
          <div className="text-center p-4 bg-slate-900 rounded-lg border border-green-500">
            <FiCheckCircle className="mx-auto text-green-500 h-8 w-8 mb-2" />
            <p className="text-white">{message}</p>
            <Link to="/login" className="mt-4 inline-block font-semibold text-indigo-400 hover:text-indigo-300">
                Voltar para o Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
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
            
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? <FiLoader className="animate-spin" /> : (
                  <>
                    <FiMail />
                    Enviar Link de Recuperação
                  </>
                )}
              </button>
            </div>

            <p className="text-sm text-center text-slate-400">
              Lembrou a senha?{' '}
              <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
                Faça login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
