// DENTRO DE: src/components/FuncionarioTabs/ExamesTab.jsx

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { FiLoader, FiPlus, FiFileText, FiInfo } from 'react-icons/fi';

// Objeto para traduzir os valores do banco para textos mais amigáveis e com acentuação
const displayLabels = {
  // Motivo do Exame (PCMSO)
  admissional: 'Admissional',
  periodico: 'Periódico',
  retorno_trabalho: 'Retorno ao Trabalho',
  mudanca_risco: 'Mudança de Risco',
  demissional: 'Demissional',
  // Tipo de Audiograma (PCA)
  referencia: 'Referência',
  sequencial: 'Sequencial',
  reteste: 'Reteste',
  // Novos resultados da análise
  mudanca_unilateral: 'Mudança Unilateral',
  agravamento_bilateral: 'Agravamento Bilateral',
  normal: 'Normal',
  agravamento: 'Agravamento',
  desencadeamento: 'Desencadeamento',
};

// Componente de Badge para estilizar os resultados
const ResultBadge = ({ result, examType }) => {
  // Regra 1: Se for um exame de referência, exibe um badge azul informativo
  if (examType === 'referencia') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-200">
        <FiInfo />
        Referência
      </span>
    );
  }

  if (!result) return <span className="text-gray-400">N/A</span>;

  let colorClasses = 'bg-gray-100 text-gray-800 ring-gray-200'; // Padrão para 'normal'
  
  // Regra 2: Para alertas fortes (bilaterais ou agravamento)
  if (result === 'agravamento' || result === 'agravamento_bilateral') {
    colorClasses = 'bg-red-100 text-red-800 ring-red-200';
  } 
  // Regra 3: Para alertas de atenção (unilaterais ou desencadeamento)
  else if (result === 'desencadeamento' || result === 'mudanca_unilateral') {
    colorClasses = 'bg-yellow-100 text-yellow-800 ring-yellow-200';
  }

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium capitalize ring-1 ring-inset ${colorClasses}`}>
      {displayLabels[result] || result}
    </span>
  );
};

export default function ExamesTab({ exams, isLoading }) {
  const { companyId, workerId } = useParams();
  const { createAgendamento } = useData();

  const [agendamentoDate, setAgendamentoDate] = useState('');
  const [isAgendando, setIsAgendando] = useState(false);

  const handleAgendarExame = async () => {
    if (!agendamentoDate) {
      alert('Por favor, selecione uma data para o agendamento.');
      return;
    }
    setIsAgendando(true);
    try {
      await createAgendamento({
        trabalhador_id: workerId,
        data_agendamento: agendamentoDate,
        status: 'agendado',
        tipo_exame: 'Audiometria',
      });
      alert('Exame agendado com sucesso!');
      setAgendamentoDate('');
    } catch (error) {
      console.error('Erro ao agendar exame:', error);
      alert('Não foi possível agendar o exame. Tente novamente.');
    } finally {
      setIsAgendando(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-b-lg shadow-sm border border-t-0 border-gray-200">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-6 border-b">
        <div>
          <h3 className="font-semibold text-slate-700 mb-2">Lançar Novo Exame</h3>
          <p className="text-sm text-gray-500 mb-4">Clique para abrir a ficha de cadastro de uma nova audiometria.</p>
          <Link
            to={`/dashboard/${companyId}/funcionarios/${workerId}/audiometrias/nova`}
            className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto"
          >
            <FiPlus />
            Inserir Nova Audiometria
          </Link>
        </div>
        <div>
          <h3 className="font-semibold text-slate-700 mb-2">Agendar Próximo Exame</h3>
          <p className="text-sm text-gray-500 mb-4">Marque uma data para a próxima avaliação sequencial.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input 
              type="date" 
              value={agendamentoDate}
              onChange={(e) => setAgendamentoDate(e.target.value)}
              className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none" 
            />
            <button 
              onClick={handleAgendarExame}
              disabled={isAgendando}
              className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400"
            >
              {isAgendando ? 'Agendando...' : 'Agendar'}
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-slate-700 mb-4">Histórico de Exames</h2>
      {isLoading ? (
        <div className="text-center p-8"><FiLoader className="animate-spin text-2xl text-sky-500 mx-auto" /></div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-left text-gray-600">Data</th>
                <th className="px-4 py-3 font-semibold text-left text-gray-600">Motivo (PCMSO)</th>
                <th className="px-4 py-3 font-semibold text-left text-gray-600">Tipo (PCA)</th>
                <th className="px-4 py-3 font-semibold text-left text-gray-600">Análise (Sistema)</th>
                <th className="px-4 py-3 font-semibold text-left text-gray-600">Classificação (Profissional)</th>
                <th className="px-4 py-3 font-semibold text-left text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {exams && exams.length > 0 ? (
                exams.map(exam => (
                  <tr key={exam.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">
                      {new Date(exam.data_exame).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {displayLabels[exam.motivo_exame] || exam.motivo_exame}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {displayLabels[exam.tipo_audiograma] || exam.tipo_audiograma}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <ResultBadge result={exam.resultado_analise} examType={exam.tipo_audiograma} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <ResultBadge result={exam.classificacao} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <a href="#" className="text-sky-600 hover:text-sky-800 font-semibold">Detalhes</a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-500">
                    <FiFileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    Nenhum exame encontrado para este funcionário.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}