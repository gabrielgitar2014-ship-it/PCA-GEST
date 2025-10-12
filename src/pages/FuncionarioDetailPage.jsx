// DENTRO DE: src/pages/FuncionarioDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { FiLoader, FiArrowLeft } from 'react-icons/fi';

// Importando TODAS as abas de seus arquivos externos
import GeneralTab from '../components/FuncionarioTabs/GeneralTab';
import EvolucaoTab from '../components/FuncionarioTabs/EvolucaoTab';
import ExamesTab from '../components/FuncionarioTabs/ExamesTab';

// ===================================================================
//  COMPONENTE PRINCIPAL DA PÁGINA (O CÉREBRO ORQUESTRADOR)
// ===================================================================
export default function FuncionarioDetailPage() {
  const { workerId, companyId } = useParams();
  const { 
    selectedWorker, isWorkerDetailLoading, fetchWorkerById,
    workerExams, areExamsLoading, fetchExamsForWorker,
    fetchEvolutionsForWorker
  } = useData();

  const [activeTab, setActiveTab] = useState('general');

  // O useEffect agora busca TUDO que a página e suas abas precisam ao carregar
  useEffect(() => {
    if (workerId) {
      fetchWorkerById(workerId);
      fetchExamsForWorker(workerId);
      fetchEvolutionsForWorker(workerId);
    }
  }, [workerId, fetchWorkerById, fetchExamsForWorker, fetchEvolutionsForWorker]);

  // Componente auxiliar para renderizar os botões das abas
  const TabButton = ({ tabName, label }) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
          isActive ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
      >
        {label}
      </button>
    );
  };

  // Estado de carregamento principal (enquanto busca os dados do funcionário)
  if (isWorkerDetailLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <FiLoader className="animate-spin text-4xl text-sky-500" />
      </div>
    );
  }

  // Estado caso o funcionário não seja encontrado
  if (!selectedWorker) {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-700">Funcionário Não Encontrado</h2>
            <p className="mt-2 text-gray-500">O funcionário que você está procurando não foi encontrado.</p>
            <Link to={`/dashboard/${companyId}/funcionarios`} className="mt-6 inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg">
                <FiArrowLeft /> Voltar para a Lista
            </Link>
        </div>
    );
  }

  return (
    <div>
      {/* Cabeçalho da página */}
      <div className="mb-8">
        <Link to={`/dashboard/${companyId}/funcionarios`} className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-800 font-semibold mb-4">
          <FiArrowLeft /> Voltar para a lista de funcionários
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">{selectedWorker.nome}</h1>
        <p className="text-gray-500 mt-1">CPF: {selectedWorker.cpf}</p>
      </div>

      {/* Navegação das Abas */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <TabButton tabName="general" label="General" />
          <TabButton tabName="evolucao" label="Evolução" />
          <TabButton tabName="exames" label="Exames" />
        </nav>
      </div>

      {/* Conteúdo Condicional das Abas */}
      <div>
        {activeTab === 'general' && <GeneralTab worker={selectedWorker} />}
        {activeTab === 'evolucao' && <EvolucaoTab />}
        {activeTab === 'exames' && <ExamesTab exams={workerExams} isLoading={areExamsLoading} />}
      </div>
    </div>
  );
}
