// DENTRO DE: src/pages/CadastroAtivadoPage.jsx

import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { FiUserPlus, FiLoader } from 'react-icons/fi';

export default function CadastroAtivadoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const chave = location.state?.chave;

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!chave) {
      console.warn("Acesso negado à página de cadastro. Nenhuma chave fornecida.");
      navigate('/ativar-chave');
    }
  }, [chave, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log('[handleSignUp] Iniciando cadastro...'); // ✅ LOG 1: Início da função

    if (formData.password !== formData.confirmPassword) {
      console.warn('[handleSignUp] Erro: As senhas não coincidem.'); // ✅ LOG 2: Erro de senha
      setError('As senhas não coincidem.');
      return;
    }
    if (formData.password.length < 6) {
      console.warn('[handleSignUp] Erro: Senha muito curta.'); // ✅ LOG 3: Erro de senha
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);
    setError('');

    // ✅ LOG 4: Dados que serão enviados
    console.log('[handleSignUp] Dados do formulário:', formData);
    console.log('[handleSignUp] Chave mestra a ser usada:', chave);

    const signUpData = {
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          chave_mestra: chave,
          nome: formData.nome,
          cpf: formData.cpf.replace(/\D/g, ''), // Remove formatação
        },
      },
    };

    // ✅ LOG 5: Objeto exato passado para supabase.auth.signUp
    console.log('[handleSignUp] Objeto enviado para supabase.auth.signUp:', signUpData);

    try {
      const { error: signUpError } = await supabase.auth.signUp(signUpData);

      if (signUpError) {
        // ✅ LOG 6: Erro retornado pelo signUp ANTES de jogar
        console.error('[handleSignUp] Erro retornado por supabase.auth.signUp:', signUpError); 
        throw signUpError;
      }

      // ✅ LOG 7: Sucesso
      console.log('[handleSignUp] Cadastro realizado com sucesso! Redirecionando para login.');
      alert('Cadastro realizado com sucesso! Por favor, verifique seu e-mail para confirmar sua conta.');
      navigate('/login');

    } catch (err) {
      // ✅ LOG 8: Erro capturado no bloco catch (pode ser o signUpError ou outro)
      console.error('[handleSignUp] Erro capturado no bloco catch:', err); 
      setError(err.message || 'Ocorreu um erro ao realizar o cadastro.');
    } finally {
      // ✅ LOG 9: Finalizando (sempre executa)
      console.log('[handleSignUp] Finalizando execução (finally).');
      setIsLoading(false);
    }
  };
  
  if (!chave) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-blue p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <FiUserPlus className="mx-auto h-12 w-12 text-sky-600" />
          <h2 className="mt-4 text-2xl font-bold text-slate-800">Finalize seu Cadastro</h2>
          <p className="mt-2 text-sm text-gray-500">Sua chave foi validada. Agora, crie sua conta.</p>
        </div>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input type="text" name="nome" onChange={handleChange} className="mt-1 w-full input-style" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" onChange={handleChange} className="mt-1 w-full input-style" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF</label>
            <input type="text" name="cpf" onChange={handleChange} className="mt-1 w-full input-style" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input type="password" name="password" onChange={handleChange} className="mt-1 w-full input-style" placeholder="Mínimo 6 caracteres" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
            <input type="password" name="confirmPassword" onChange={handleChange} className="mt-1 w-full input-style" required />
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400"
            >
              {isLoading ? <FiLoader className="animate-spin" /> : 'Criar Conta e Ativar Licença'}
            </button>
          </div>
        </form>
         <p className="mt-6 text-center text-sm text-gray-500">
          Já ativou sua chave?{' '}
          <Link to="/login" className="font-medium text-sky-600 hover:text-sky-500">
            Faça login aqui
          </Link>
        </p>
      </div>
    </div>
  );
}

// Pequeno CSS Helper
const styles = `
  .input-style {
    background-color: #F9FAFB;
    border: 1px solid #D1D5DB;
    border-radius: 0.5rem;
    padding: 0.75rem;
    transition: all 0.2s;
  }
  .input-style:focus {
    outline: none;
    ring: 2px;
    ring-color: #0284c7;
  }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);