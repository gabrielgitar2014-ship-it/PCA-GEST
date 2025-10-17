// DENTRO DE: src/pages/Dashboard.jsx

import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { FiLoader, FiAlertTriangle, FiCalendar, FiUsers, FiThumbsDown } from 'react-icons/fi';

// Componente para os cards de estatísticas (KPIs)
const StatCard = ({ icon, title, value, to }) => {
  const content = (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4 border border-gray-200">
      <div className="rounded-full p-3 bg-gray-100 text-gray-600">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-slate-800 text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  // Se 'to' for fornecido, envolve o card em um link clicável
  if (to) {
    return <Link to={to} className="hover:opacity-80 transition-opacity">{content}</Link>;
  }
  return content;
};

// Componente principal da página Dashboard
export default function Dashboard() {
  const { companyId } = useParams();
  const { dashboardData, isDashboardLoading, fetchDashboardData } = useData();

  useEffect(() => {
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
          
          <Link 
            to={`/dashboard/${companyId}/casos-para-analise`} 
            className="block bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3 mb-2">
              <FiAlertTriangle className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-slate-800">Alertas para Revisão</h2>
            </div>
            {dashboardData.kpis.casosEmAnalise > 0 ? (
              <p className="text-gray-600">
                Você tem <span className="font-bold text-slate-800">{dashboardData.kpis.casosEmAnalise}</span> caso(s) com mudança unilateral ou desencadeamento que requerem sua atenção. Clique para ver a lista.
              </p>
            ) : (
              <p className="text-gray-500">
                Nenhum novo alerta para revisão encontrado.
              </p>
            )}
          </Link>
          
          {/* Outros componentes do dashboard podem ser adicionados aqui no futuro */}

        </div>

        {/* Coluna Lateral (à direita) */}
        <div className="space-y-6">
          <StatCard 
            title="Casos de Agravamento" 
            value={dashboardData.kpis.casosDeAgravamento} 
            icon={<FiThumbsDown className="text-red-600"/>}
            to={`/dashboard/${companyId}/casos-de-agravamento`}
          />
          <StatCard 
            title="Exames Próximos (30d)" 
            value={dashboardData.kpis.examesProximos}
            icon={<FiCalendar className="text-sky-600"/>}
          />
           <StatCard 
            title="Total de Trabalhadores" 
            value={dashboardData.kpis.totalTrabalhadores}
            icon={<FiUsers className="text-emerald-600"/>}
          />
        </div>
      </div>
    </div>
  );
}