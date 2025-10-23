// DENTRO DE: src/pages/SignUpPage.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FiUserPlus, FiLoader, FiCheckCircle } from 'react-icons/fi';

function SignUpPage() {
  // NOVO: Adicionamos estados para os novos campos
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    // NOVO: Coletamos os dados adicionais em um objeto
    const additionalData = {
      nome: nome,
      cpf: cpf.replace(/\D/g, '') // Remove caracteres não numéricos do CPF
    };

    // NOVO: Passamos os dados adicionais para a função signUp
    const { error } = await signUp(email, password, additionalData);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-sm p-8 space-y-6 bg-slate-800 rounded-2xl shadow-lg border border-slate-700">
        {success ? (
          <div className="text-center text-white">
            <FiCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
            <h1 className="text-2xl font-bold">Cadastro realizado!</h1>
            <p className="mt-2 text-slate-300">
              Enviamos um link de confirmação para o seu e-mail. Por favor, verifique sua caixa de entrada.
            </p>
            <Link to="/login" className="inline-block mt-6 text-indigo-400 hover:text-indigo-300">
              &larr; Voltar para o Login
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">Crie sua Conta</h1>
              <p className="mt-2 text-slate-400">Preencha os dados para começar</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* CAMPO NOME */}
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-slate-300">Nome Completo</label>
                <input id="nome" name="nome" type="text" required value={nome} onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-2 mt-1 text-white bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              {/* CAMPO CPF */}
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-slate-300">CPF</label>
                <input id="cpf" name="cpf" type="text" required value={cpf} onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-2 mt-1 text-white bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              {/* CAMPO EMAIL */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
                <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 mt-1 text-white bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              {/* CAMPO SENHA */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">Senha</label>
                <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 mt-1 text-white bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>

              {error && <p className="text-sm text-red-500 text-center pt-2">{error}</p>}
              
              <div className="pt-2">
                <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed">
                  {loading ? <FiLoader className="animate-spin" /> : <> <FiUserPlus /> Cadastrar </>}
                </button>
              </div>
              <p className="text-sm text-center text-slate-400 pt-2">
                Já tem uma conta?{' '}
                <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
                  Faça o login
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default SignUpPage;