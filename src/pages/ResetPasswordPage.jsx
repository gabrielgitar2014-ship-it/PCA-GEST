// DENTRO DE: src/pages/ResetPasswordPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FiKey, FiLoader, FiCheckCircle } from 'react-icons/fi';

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { updatePassword } = useAuth(); // Precisaremos criar esta função no AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);

    if (error) {
      setError('Não foi possível atualizar a senha. O link pode ter expirado.');
    } else {
      setMessage('Senha atualizada com sucesso! Você será redirecionado para o login.');
      setTimeout(() => {
        navigate('/login'); // Redireciona para o login após o sucesso
      }, 3000);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-sm p-8 space-y-8 bg-slate-800 rounded-2xl shadow-lg border border-slate-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Crie uma Nova Senha</h1>
          <p className="mt-2 text-slate-400">
            Digite sua nova senha abaixo.
          </p>
        </div>

        {message ? (
          <div className="text-center p-4 bg-slate-900 rounded-lg border border-green-500">
            <FiCheckCircle className="mx-auto text-green-500 h-8 w-8 mb-2" />
            <p className="text-white">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                [span_12](start_span)className="block text-sm font-medium text-slate-300" //[span_12](end_span)
              >
                Nova Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                [span_13](start_span)required //[span_13](end_span)
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                [span_14](start_span)className="w-full px-4 py-2 mt-2 text-white bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" //[span_14](end_span)
              />
            </div>
            
            [span_15](start_span){error && <p className="text-sm text-red-500 text-center">{error}</p>} {/*[span_15](end_span) */}

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
                    <FiKey />
                    Atualizar Senha
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
