// DENTRO DE: src/pages/AtivarChavePage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient'; // Seu cliente Supabase
import { FiKey, FiLoader } from 'react-icons/fi';

export default function AtivarChavePage() {
  const [chave, setChave] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log(`Verificando chave via RPC: ${chave}`);

      // 🎯 MUDANÇA PRINCIPAL AQUI:
      // Trocamos supabase.functions.invoke por supabase.rpc
      const { data, error: rpcError } = await supabase.rpc('verificar_licenca_disponivel', {
        p_chave_mestra: chave // O nome do argumento deve bater com o da função SQL
      });

      if (rpcError) {
        // Erros de rede, ou se a função RPC não existir
        console.error("Erro ao chamar RPC:", rpcError);
        throw rpcError;
      }

      // 3. Processa a resposta da função
      // O 'data' aqui já é o objeto JSONB que a função retornou
      if (data.isValid === true) {
        // SUCESSO!
        console.log("Chave válida. Redirecionando para /cadastro-ativado...");
        navigate('/cadastro-ativado', { state: { chave: chave } });
      } else {
        // A chave foi verificada, mas é inválida (não encontrada, já usada, etc.)
        console.warn(`Verificação RPC falhou: ${data.message}`);
        setError(data.message || 'Chave de acesso inválida ou já utilizada.');
      }

    } catch (err) {
      console.error("Erro final no handleVerify:", err);
      setError(err.message || 'Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // O JSX (return) permanece exatamente o mesmo do arquivo anterior.
  // (Omitido aqui por brevidade, mas você deve mantê-lo)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200">
        
        <div className="text-center mb-6">
          <FiKey className="mx-auto h-10 w-10 text-sky-600" />
          <h2 className="mt-4 text-xl md:text-2xl font-bold text-slate-800">Ativar sua Licença</h2>
          <p className="mt-2 text-sm text-gray-500">Insira a chave de acesso que você recebeu para iniciar seu cadastro.</p>
        </div>
        
        <form onSubmit={handleVerify}>
          <div className="mb-4">
            <label htmlFor="chave" className="block text-sm font-medium text-gray-700 mb-1">
              Chave de Acesso
            </label>
            <input
              id="chave"
              type="text"
              value={chave}
              onChange={(e) => setChave(e.target.value)}
              className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-lg shadow-sm p-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none"
              placeholder="PCA-..."
              required
              aria-describedby="chave-error"
            />
          </div>

          {error && (
            <p id="chave-error" className="mt-2 text-sm text-red-600 font-medium">
              {error}
            </p>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading || !chave}
              className="w-full flex justify-center items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <FiLoader className="animate-spin h-5 w-5" /> : null}
              {isLoading ? 'Verificando...' : 'Verificar e Continuar'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-sky-600 hover:text-sky-500 hover:underline">
            Faça login aqui
          </Link>
        </p>

      </div>
    </div>
  );
}