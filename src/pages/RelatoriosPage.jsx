import React from 'react';
import { FiDownload, FiFileText, FiBarChart2, FiAlertTriangle } from 'react-icons/fi';

// Este é um componente reutilizável para cada "card" de relatório
function ReportCard({ title, description, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
      <div className="flex-1">
        <span className="text-3xl text-sky-600">{icon}</span>
        <h3 className="text-lg font-bold text-slate-800 mt-4">{title}</h3>
        <p className="text-sm text-gray-600 mt-2 mb-4">{description}</p>
      </div>
      
      {/* Aqui é onde, no futuro, adicionaremos os filtros (ex: data de início, data fim)
        antes de permitir o download.
      */}
      
      <button className="flex items-center justify-center gap-2 mt-4 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full">
        <FiDownload size={18} />
        Gerar Relatório
      </button>
    </div>
  );
}

export default function RelatoriosPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800">Central de Relatórios</h1>
      <p className="text-gray-500 mt-1 mb-8">
        Gere e exporte os relatórios legais e gerenciais da sua empresa.
      </p>

      {/* Grade de Relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: O relatório mais importante do seu app (NR 7) */}
        <ReportCard
          title="Relatório Analítico (NR 7)"
          description="Análise anual do PCMSO com estatísticas de exames audiométricos, casos de desencadeamento e agravamento."
          icon={<FiBarChart2 />}
        />

        {/* Card 2: Relatório de Laudos (NR 9) */}
        <ReportCard
          title="Inventário de Riscos (NR 1 / NR 9)"
          description="Documento base do PGR com riscos identificados, incluindo avaliações de ruído (Laudo de Ruído)."
          icon={<FiAlertTriangle />}
        />

        {/* Card 3: Um relatório de gestão comum */}
        <ReportCard
          title="ASOs por Período"
          description="Relação de Atestados de Saúde Ocupacional (ASO) emitidos em um período selecionado."
          icon={<FiFileText />}
        />

        {/* Você pode adicionar outros cards aqui, como o da NR 17 (AET) */}

      </div>
    </div>
  );
}