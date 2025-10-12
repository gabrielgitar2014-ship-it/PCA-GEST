// DENTRO DE: src/components/FuncionarioTabs/ExamesTab.jsx

import { Link, useParams } from 'react-router-dom';
import { FiLoader, FiPlus } from 'react-icons/fi';

export default function ExamesTab({ exams, isLoading }) {
  const { companyId, workerId } = useParams();

  return (
    // O container agora tem fundo branco e será o painel completo da aba
    <div className="bg-white p-8 rounded-b-lg shadow-sm border border-t-0 border-gray-200">
      
      {/* SEÇÃO DE AÇÕES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-6 border-b">
        
        {/* Lado Esquerdo: Adicionar Nova Audiometria */}
        <div>
          <h3 className="font-semibold text-slate-700 mb-2">Lançar Novo Exame</h3>
          <p className="text-sm text-gray-500 mb-4">Clique no botão para abrir a ficha completa de cadastro de uma nova audiometria.</p>
          <Link
            to={`/dashboard/${companyId}/funcionarios/${workerId}/audiometrias/nova`}
            className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full md:w-auto"
          >
            <FiPlus />
            Inserir Nova Audiometria
          </Link>
        </div>

        {/* Lado Direito: Agendar Exame Futuro */}
        <div>
          <h3 className="font-semibold text-slate-700 mb-2">Agendar Próximo Exame</h3>
          <p className="text-sm text-gray-500 mb-4">Marque uma data para a próxima avaliação sequencial do funcionário.</p>
          <div className="flex gap-2">
            <input type="date" className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
            <button className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg">Agendar</button>
          </div>
        </div>
      </div>

      {/* SEÇÃO DE HISTÓRICO DE EXAMES */}
      <h2 className="text-xl font-semibold text-slate-700 mb-4">Histórico de Exames</h2>
      {isLoading ? (
        <div className="text-center p-8"><FiLoader className="animate-spin text-2xl text-sky-500 mx-auto" /></div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 font-semibold text-sm text-gray-600">Data do Exame</th>
                <th className="p-4 font-semibold text-sm text-gray-600">Tipo</th>
                <th className="p-4 font-semibold text-sm text-gray-600">Classificação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {exams.length > 0 ? (
                exams.map(exam => (
                  <tr key={exam.id} className="hover:bg-gray-50">
                    <td className="p-4">{new Date(exam.data_exame).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                    <td className="p-4 capitalize">{exam.tipo_exame}</td>
                    <td className="p-4 capitalize">{exam.classificacao}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" className="text-center p-8 text-gray-500">Nenhum exame encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}