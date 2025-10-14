// DENTRO DE: src/pages/Dashboard.jsx

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { FiLoader } from 'react-icons/fi';

// Sub-componente para os cards de estatísticas (KPIs) com o tema claro
const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4 border border-gray-200">
    <div className={`rounded-full p-3 bg-${color}-500/10 text-${color}-600`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-slate-800 text-2xl font-bold">{value}</p>
    </div>
  </div>
);

// Componente principal da página Dashboard
export default function Dashboard() {
  const { companyId } = useParams();
  const { dashboardData, isDashboardLoading, fetchDashboardData } = useData();

  // LOG 1: Mostra o estado atual do componente em cada renderização
  console.log('[Dashboard Page] Renderizou. Está carregando?', isDashboardLoading, 'Dados:', dashboardData);

  useEffect(() => {
    // LOG 2: Confirma que o useEffect foi acionado com o ID da empresa
    console.log(`[Dashboard Page] useEffect executou para empresa ID: ${companyId}`);
    if (companyId) {
      fetchDashboardData(companyId);
    }
  }, [companyId, fetchDashboardData]);

  // Exibe um loader enquanto os dados estão sendo buscados
  if (isDashboardLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-96">
        <FiLoader className="animate-spin text-4xl text-sky-500" />
      </div>
    );
  }

  // Renderiza a página com os dados dinâmicos
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
      <h2 className="text-xl font-semibold text-sky-600 mb-8">{dashboardData.companyName}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Coluna Principal (à esquerda) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-center space-x-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <h2 className="text-xl font-bold text-slate-800">Casos para Análise (Desencadeamento)</h2>
            </div>
            <div className="space-y-3">
              {dashboardData.casosComDesencadeamento.length > 0 ? (
                dashboardData.casosComDesencadeamento.map((caso) => (
                  <div key={caso.id} className="bg-gray-50 border border-gray-200 p-4 rounded-md flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-semibold text-slate-700">{caso.nome}</p>
                      <p className="text-sm text-gray-500">{caso.empresa}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Exame de:</p>
                      <p className="text-sm font-medium text-slate-800">{caso.dataExame}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">Nenhum caso com desencadeamento encontrado.</p>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Lateral (à direita) */}
        <div className="space-y-6">
          <StatCard 
            title="Casos em Análise" 
            value={dashboardData.kpis.casosEmAnalise} 
            color="red"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          />
          <StatCard 
            title="Exames Próximos (30d)" 
            value={dashboardData.kpis.examesProximos}
            color="sky"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
           <StatCard 
            title="Total de Trabalhadores" 
            value={dashboardData.kpis.totalTrabalhadores}
            color="emerald"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.001 3.001 0 015.688 0M12 12a3 3 0 100-6 3 3 0 000 6z" /></svg>}
          />
        </div>
      </div>
    </div>
  );

}
