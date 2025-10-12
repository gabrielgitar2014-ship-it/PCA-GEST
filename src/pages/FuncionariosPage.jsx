// DENTRO DE: src/pages/FuncionariosPage.jsx

import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { FiPlus, FiLoader } from 'react-icons/fi';

export default function FuncionariosPage() {
  const { companyId } = useParams();
  const { workers, isWorkersLoading, fetchWorkers } = useData();

  useEffect(() => {
    if (companyId) {
      fetchWorkers(companyId);
    }
  }, [companyId, fetchWorkers]);

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
          <p className="text-gray-500 mt-1">Cadastre e gerencie os trabalhadores da empresa.</p>
        </div>
        <Link
          to={`/dashboard/${companyId}/funcionarios/novo`}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <FiPlus />
          Adicionar Funcionário
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-left">
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
                <tr key={worker.id} className="border-b border-gray-100 last:border-b-0">
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
    </div>
  );
}