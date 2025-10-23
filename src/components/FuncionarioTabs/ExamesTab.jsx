// DENTRO DE: src/components/FuncionarioTabs/ExamesTab.jsx

import { Link, useParams } from 'react-router-dom';
import { Loader, Plus, ArrowRight } from 'lucide-react';
import { useState } from 'react'; 
import { useData } from '@/contexts/DataContext'; 
import { toast } from 'sonner'; // Importa o toast para feedback

export default function ExamesTab({ exams, isLoading }) {
  const { companyId, workerId } = useParams();
  
  const { createAgendamento } = useData();
  const [agendamentoDate, setAgendamentoDate] = useState('');
  const [isAgendando, setIsAgendando] = useState(false);

  const handleAgendar = async () => {
    if (!agendamentoDate) {
      toast.error('Por favor, selecione uma data para o agendamento.');
      return;
    }
    
    setIsAgendando(true);
    
    try {
      // ===================================================================
      // ✅ CORREÇÃO DO ERRO (empresa_id) APLICADA AQUI
      // ===================================================================
      const scheduleData = {
        trabalhador_id: workerId,
        empresa_id: companyId, // <-- CORREÇÃO: Adiciona o ID da empresa
        data_agendamento: agendamentoDate,
        tipo_exame: 'Periódico', 
        status: 'agendado'      
      };

      const { error } = await createAgendamento(scheduleData);

      // ===================================================================
      // ✅ CONFIRMAÇÃO DE SUCESSO (Como solicitado)
      // ===================================================================
      if (error) {
        toast.error('Erro ao agendar exame.', { description: error.message });
      } else {
        toast.success('Exame agendado com sucesso!'); // <-- MENSAGEM DE CONFIRMAÇÃO
        setAgendamentoDate(''); 
      }
    } catch (err) {
      toast.error('Ocorreu um erro inesperado.', { description: err.message });
    } finally {
      setIsAgendando(false);
    }
  };
  
  return (
    <div className="bg-white p-8 rounded-b-lg shadow-sm border border-t-0 border-gray-200">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-6 border-b">
        {/* Bloco 1: Lançar Novo Exame */}
        <div>
          <h3 className="font-semibold text-slate-700 mb-2">Lançar Novo Exame</h3>
          <p className="text-sm text-gray-500 mb-4">Clique para abrir a ficha de cadastro de uma nova audiometria.</p>
          <Link
            to={`/dashboard/${companyId}/funcionarios/${workerId}/audiometrias/nova`}
            className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full md:w-auto"
          >
            <Plus size={18} />
            Inserir Nova Audiometria
          </Link>
        </div>
        
        {/* Bloco 2: Agendar Próximo Exame */}
        <div>
          <h3 className="font-semibold text-slate-700 mb-2">Agendar Próximo Exame</h3>
          <p className="text-sm text-gray-500 mb-4">Marque uma data para a próxima avaliação do funcionário.</p>
          <div className="flex gap-2">
            <input 
              type="date" 
              className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none disabled:opacity-50"
              value={agendamentoDate}
              onChange={(e) => setAgendamentoDate(e.target.value)}
              disabled={isAgendando} 
            />
            <button 
              className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
              onClick={handleAgendar}
              disabled={isAgendando} 
            >
              {isAgendando ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                'Agendar'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Histórico de Exames */}
      <h2 className="text-xl font-semibold text-slate-700 mb-4">Histórico de Exames</h2>
      {isLoading ? (
        <div className="text-center p-8"><Loader className="animate-spin text-2xl text-sky-500 mx-auto" /></div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 font-semibold text-sm text-gray-600">Data do Exame</th>
                <th className="p-4 font-semibold text-sm text-gray-600">Tipo</th>
                <th className="p-4 font-semibold text-sm text-gray-600">Classificação</th>
                <th className="p-4 font-semibold text-sm text-gray-600 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {exams && exams.length > 0 ? (
                exams.map(exam => (
                  <tr key={exam.id} className="hover:bg-gray-50">
                    <td className="p-4">{new Date(exam.data_exame).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                    <td className="p-4 capitalize">{exam.tipo_audiograma}</td>
                    <td className="p-4 capitalize">{exam.classificacao}</td>
                    <td className="p-4 text-right">
                      <Link 
                        to={`/dashboard/${companyId}/funcionarios/${workerId}/audiometrias/${exam.id}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-800"
                      >
                        Detalhes
                        <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center p-8 text-gray-500">Nenhum exame encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}