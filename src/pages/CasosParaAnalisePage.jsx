// DENTRO DE: src/pages/CasosParaAnalisePage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { FiLoader, FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const PAGE_SIZE = 20;

const ResultBadge = ({ result }) => {
  if (!result) return null;
  let colorClasses = 'bg-gray-100 text-gray-800';
  if (result === 'agravamento' || result === 'agravamento_bilateral') {
    colorClasses = 'bg-red-100 text-red-800';
  } else if (result === 'desencadeamento' || result === 'mudanca_unilateral') {
    colorClasses = 'bg-yellow-100 text-yellow-800';
  }
  const label = result.replace(/_/g, ' ');
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${colorClasses}`}>
      {label}
    </span>
  );
};

export default function CasosParaAnalisePage() {
  const { companyId } = useParams();
  const { casosParaAnalise, totalCasosParaAnalise, areCasosLoading, fetchCasosParaAnalise } = useData();
  
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (companyId) {
      fetchCasosParaAnalise(companyId, currentPage - 1, PAGE_SIZE);
    }
  }, [companyId, currentPage, fetchCasosParaAnalise]);

  const totalPages = Math.ceil(totalCasosParaAnalise / PAGE_SIZE);

  if (areCasosLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <FiLoader className="animate-spin text-4xl text-sky-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link to={`/dashboard/${companyId}`} className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-800 font-semibold mb-4">
          <FiArrowLeft /> Voltar para o Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">Casos para Análise</h1>
        <p className="text-gray-500 mt-1">
          Exibindo {casosParaAnalise.length} de {totalCasosParaAnalise} caso(s) com alteração.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="p-4 font-semibold text-sm text-gray-600">Nome do Trabalhador</th>
                <th className="p-4 font-semibold text-sm text-gray-600">Data do Exame</th>
                <th className="p-4 font-semibold text-sm text-gray-600">Tipo de Alteração</th>
              </tr>
            </thead>
            <tbody>
              {casosParaAnalise.length > 0 ? (
                casosParaAnalise.map(caso => (
                  <tr key={caso.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    <td className="p-4">
                      <Link 
                        to={`/dashboard/${companyId}/funcionarios/${caso.trabalhadores.id}`} 
                        className="text-slate-800 font-medium hover:text-sky-600 hover:underline"
                      >
                        {caso.trabalhadores.nome}
                      </Link>
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(caso.data_exame).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </td>
                    <td className="p-4">
                      <ResultBadge result={caso.resultado_analise || caso.classificacao} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center p-8 text-gray-500">
                    Nenhum caso com alteração encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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