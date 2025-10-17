// DENTRO DE: src/pages/FuncionariosPage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { FiPlus, FiLoader, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const PAGE_SIZE = 20; // Define o tamanho da página como uma constante

export default function FuncionariosPage() {
  const { companyId } = useParams();
  // ✅ Pega o totalWorkers do context
  const { workers, totalWorkers, isWorkersLoading, fetchWorkers } = useData();
  
  // ✅ Novo estado para controlar a página atual
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (companyId) {
      // Passa a página atual (em formato 0-based) para a função de busca
      fetchWorkers(companyId, currentPage - 1, PAGE_SIZE);
    }
  }, [companyId, currentPage, fetchWorkers]); // useEffect agora depende da currentPage

  const totalPages = Math.ceil(totalWorkers / PAGE_SIZE);

  if (isWorkersLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <FiLoader className="animate-spin text-4xl text-sky-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Gestão de Funcionários</h1>
          <p className="text-gray-500 mt-1">
            Exibindo {workers.length} de {totalWorkers} trabalhadores.
          </p>
        </div>
        <Link
          to={`/dashboard/${companyId}/funcionarios/novo`}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <FiPlus />
          Adicionar Funcionário
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            {/* ... o thead da sua tabela permanece o mesmo ... */}
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="p-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Nome</th>
                <th className="p-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">CPF</th>
                <th className="p-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Matrícula</th>
                <th className="p-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {workers.length > 0 ? (
                workers.map(worker => (
                  <tr key={worker.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    <td className="p-4">
                      <Link 
                        to={`/dashboard/${companyId}/funcionarios/${worker.id}`} 
                        className="text-slate-800 font-medium hover:text-sky-600 hover:underline"
                      >
                        {worker.nome}
                      </Link>
                    </td>
                    <td className="p-4 text-gray-600">{worker.cpf}</td>
                    <td className="p-4 text-gray-600">{worker.matricula || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                        worker.status === 'ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {worker.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-gray-500">
                    Nenhum funcionário cadastrado para esta empresa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* ✅ SEÇÃO DE CONTROLES DE PAGINAÇÃO */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft />
              Anterior
            </button>
            
            <span className="text-sm text-gray-700">
              Página <span className="font-semibold">{currentPage}</span> de <span className="font-semibold">{totalPages}</span>
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}