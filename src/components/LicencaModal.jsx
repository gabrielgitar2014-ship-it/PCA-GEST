// DENTRO DE: src/components/LicencaModal.jsx

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Key, Package, ChevronsUp, Calendar, X, ShoppingCart, User } from 'lucide-react';

export default function LicencaModal({ licenca }) {
  const navigate = useNavigate();

  const handleClose = () => {
    // Ao fechar, volta para a página anterior
    navigate(-1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        // Formato DD/MM/YYYY
        return new Date(dateString).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'UTC' // Adiciona timezone para evitar problemas de data off-by-one
        });
    } catch(e) {
        console.error("Erro formatando data:", e);
        return "Inválida";
    }
  };

  return (
    <div className="fixed inset-0 bg- bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 m-4 relative"
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">Minha Licença</h2>
        
        {licenca ? (
          <div className="space-y-3">
            
            {/* ✅ CORREÇÃO APLICADA AQUI */}
            <div className="p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center text-gray-500 mb-1">
                <User size={14} className="mr-2" />
                <span className="text-xs font-semibold uppercase tracking-wider">Titular da Licença</span>
              </div>
              {/* Usa licenca.nome_dono */}
              <p className="text-base font-medium text-slate-800">{licenca.nome_dono || 'Não identificado'}</p> 
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center text-gray-500 mb-1">
                  <Package size={14} className="mr-2" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Pacote</span>
                </div>
                <p className="text-base font-medium text-slate-800">{licenca.nome_pacote || 'N/A'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center text-gray-500 mb-1">
                  <ChevronsUp size={14} className="mr-2" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Tokens</span>
                </div>
                {/* Verifica se tokens_usados e max_tokens são números */}
                <p className="text-base font-medium text-slate-800">
                    {typeof licenca.tokens_usados === 'number' ? licenca.tokens_usados : '?'} / {typeof licenca.max_tokens === 'number' ? licenca.max_tokens : '?'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center text-gray-500 mb-1">
                <Calendar size={14} className="mr-2" />
                <span className="text-xs font-semibold uppercase tracking-wider">Data de Ativação</span>
              </div>
              <p className="text-base font-medium text-slate-800">{formatDate(licenca.data_ativacao)}</p>
            </div>
            
            <div className="pt-4 text-center">
                <button disabled className="flex items-center justify-center gap-2 w-full bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                    <ShoppingCart size={18}/>
                    <span className="text-sm">Comprar mais Tokens (Em breve)</span>
                </button>
            </div>

          </div>
        ) : (
          <p className="text-center text-gray-600">Nenhuma licença ativa foi encontrada para a sua conta.</p>
        )}
      </motion.div>
    </div>
  );
}