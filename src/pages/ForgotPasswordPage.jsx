// DENTRO DE: src/pages/ForgotPasswordPage.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; [span_0](start_span)//[span_0](end_span)
import { FiMail, FiLoader, FiCheckCircle } from 'react-icons/fi';

function ForgotPasswordPage() {
  const [email, setEmail] = useState(''); [span_1](start_span)//[span_1](end_span)
  const [loading, setLoading] = useState(false); [span_2](start_span)//[span_2](end_span)
  const [error, setError] = useState(''); [span_3](start_span)//[span_3](end_span)
  const [message, setMessage] = useState('');
  const { resetPasswordForEmail } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault(); [span_4](start_span)//[span_4](end_span)
    setError('');
    setMessage('');
    setLoading(true);

    // A função resetPasswordForEmail virá do seu AuthContext
    const { error } = await resetPasswordForEmail(email);

    if (error) {
      setError('Não foi possível enviar o link. Verifique o e-mail informado.');
    } else {
      setMessage('Link de recuperação enviado! Verifique sua caixa de entrada.');
    }
    setLoading(false); [span_5](start_span)//[span_5](end_span)
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
              <label
                htmlFor="email"
                [span_6](start_span)className="block text-sm font-medium text-slate-300" //[span_6](end_span)
              >
                Email
              </label>
              <input
                [span_7](start_span)id="email" //[span_7](end_span)
                name="email"
                type="email"
                autoComplete="email"
                [span_8](start_span)required //[span_8](end_span)
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                [span_9](start_span)className="w-full px-4 py-2 mt-2 text-white bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" //[span_9](end_span)
              />
            </div>
            
            [span_10](start_span){error && <p className="text-sm text-red-500 text-center">{error}</p>} {/*[span_10](end_span) */}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  [span_11](start_span)<FiLoader className="animate-spin" /> //[span_11](end_span)
                ) : (
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
