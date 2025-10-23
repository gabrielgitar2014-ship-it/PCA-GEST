// DENTRO DE: src/pages/Dashboard.jsx
// ARQUIVO EM JAVASCRIPT (.jsx) - SEM OMISSÕES e SEM 'casosEmAnalise'

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Usa Link para navegação declarativa
import { useData } from '@/contexts/DataContext'; // Seu hook de contexto de dados
import {
  FiUsers,
  FiVolume2,
  FiCalendar,
  FiActivity,
  FiAlertTriangle,
  FiLoader,
  FiExternalLink
} from 'react-icons/fi';

// --- Componentes Reutilizáveis (Definições Completas) ---

// Componente para Card de Estatística
const StatCard = ({ title, value, icon: Icon, isLoading, linkTo }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-start justify-between min-h-[120px]">
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      {/* Placeholder de Carregamento */}
      {isLoading ? (
        <div className="space-y-2 mt-1 animate-pulse">
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
            {linkTo && <div className="h-3 w-10 bg-gray-200 rounded mt-1 ml-auto"></div>}
        </div>
      ) : (
         // Conteúdo Real
        <>
            <p className="mt-1 text-3xl font-semibold text-slate-800">{value ?? '-'}</p>
            {linkTo && (
                <Link
                    to={linkTo}
                    className="text-xs font-medium text-sky-600 hover:text-sky-800 hover:underline mt-2 inline-block"
                >
                    Ver mais &rarr;
                </Link>
            )}
        </>
      )}
    </div>
    {/* Ícone */}
    <div className="flex-shrink-0">
      {Icon && (
        <div className={`p-3 rounded-full ${isLoading ? 'bg-gray-200' : 'bg-sky-100 text-sky-600'}`}>
          <Icon className={`h-6 w-6 ${isLoading ? 'text-gray-400' : ''}`} aria-hidden="true" />
        </div>
      )}
    </div>
  </div>
);

// Componente para Item de Lista com Link
const ListItemLink = ({ to, primaryText, secondaryText }) => (
  <li className="py-2 border-b border-gray-100 last:border-b-0">
    <Link to={to} className="block hover:bg-gray-50 p-2 rounded -m-2 group transition-colors duration-150">
      <p className="text-sm font-medium text-slate-800 group-hover:text-sky-700 truncate">{primaryText}</p>
      <p className="text-xs text-gray-500 truncate">{secondaryText}</p>
    </Link>
  </li>
);

// Componente Card de Alertas GAIA Plus
const GaiaPlusAlertCard = ({ companyId, alertas, isLoading }) => {
    // Calcula contagem de alertas novos por severidade
    // Garante que 'alertas' é um array antes de filtrar
    const safeAlertas = Array.isArray(alertas) ? alertas : [];
    const criticalAlerts = safeAlertas.filter(a => a.nivel_severidade === 'critical' && a.status === 'novo').length;
    const warningAlerts = safeAlertas.filter(a => a.nivel_severidade === 'warning' && a.status === 'novo').length;
    const infoAlerts = safeAlertas.filter(a => a.nivel_severidade === 'info' && a.status === 'novo').length;
    const totalNewAlerts = criticalAlerts + warningAlerts + infoAlerts;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 min-h-[120px]">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Alertas GAIA Plus</h3>
                <FiAlertTriangle className={`h-6 w-6 ${
                    criticalAlerts > 0 ? 'text-red-500' :
                    warningAlerts > 0 ? 'text-yellow-500' : 'text-gray-400'
                }`} />
            </div>
             {isLoading ? (
                // Placeholder
                <div className="space-y-3 animate-pulse">
                    <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
                    <div className="h-4 w-1/4 bg-gray-200 rounded mt-2"></div>
                </div>
            ) : (
                // Conteúdo
                <div>
                    {totalNewAlerts === 0 ? (
                        <p className="text-sm text-gray-500">Nenhum novo alerta encontrado.</p>
                    ) : (
                        <div className="space-y-1 mb-3">
                             {criticalAlerts > 0 && (
                                <p className="text-sm flex items-center gap-2">
                                    <span className="font-semibold text-red-600">{criticalAlerts}</span>
                                    <span className="text-red-700">Alerta(s) Crítico(s)</span>
                                </p>
                             )}
                              {warningAlerts > 0 && (
                                <p className="text-sm flex items-center gap-2">
                                    <span className="font-semibold text-orange-600">{warningAlerts}</span>
                                     <span className="text-orange-700">Alerta(s) de Atenção</span>
                                </p>
                             )}
                             {infoAlerts > 0 && (
                                <p className="text-sm flex items-center gap-2">
                                    <span className="font-semibold text-blue-600">{infoAlerts}</span>
                                     <span className="text-blue-700">Alerta(s) Informativo(s)</span>
                                </p>
                             )}
                         </div>
                    )}
                     <Link
                        to={`/dashboard/${companyId}/alertas`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-800 hover:underline mt-4" // Ajuste margem se necessário
                    >
                        Ver todos os alertas <FiExternalLink className="h-3 w-3" />
                    </Link>
                </div>
             )}
        </div>
    );
};


// --- Componente Principal Dashboard ---
export default function Dashboard() {
  const { companyId } = useParams(); // Pega o ID da empresa da URL

  // --- Busca de Dados do Contexto ---
  const {
    // Dados gerais do dashboard
    dashboardData, isLoadingDashboard, fetchDashboardData,
    // Próximos exames
    proximosExames, isLoadingProximosExames, fetchProximosExames,
    // Atividades recentes
    ultimasAtualizacoes, isLoadingUltimasAtualizacoes, fetchUltimasAtualizacoes,
    // Alertas GAIA Plus
    alertas, isLoadingAlertas, fetchAlertas,
    // Erro geral
    error, setError // Inclui setError para poder limpar o erro se necessário
  } = useData();

  // Estado para controlar o carregamento inicial de todos os dados
  const [initialLoading, setInitialLoading] = useState(true);

  // Efeito para buscar todos os dados necessários
  useEffect(() => {
    if (companyId) {
      console.log("[Dashboard] Buscando dados para empresa:", companyId);
      setInitialLoading(true);
      if(setError) setError(null); // Limpa erros anteriores ao buscar

      Promise.all([
        fetchDashboardData(companyId),
        fetchProximosExames(companyId),
        fetchUltimasAtualizacoes(companyId),
        fetchAlertas(companyId)
      ])
      .catch((err) => {
          console.error("[Dashboard] Erro ao buscar dados iniciais:", err);
          // O erro já deve ser setado no DataContext, mas podemos garantir
          if(setError) setError(err);
      })
      .finally(() => {
        setInitialLoading(false);
        console.log("[Dashboard] Busca inicial concluída.");
      });
    } else {
        console.error("Dashboard: companyId não encontrado. Verifique a rota.");
        if(setError) setError(new Error("ID da empresa não encontrado na URL."));
        setInitialLoading(false);
    }
  }, [companyId, fetchDashboardData, fetchProximosExames, fetchUltimasAtualizacoes, fetchAlertas, setError]); // Inclui setError na dependência

  // Combina flags de loading
  const isLoading = initialLoading || isLoadingDashboard || isLoadingProximosExames || isLoadingUltimasAtualizacoes || isLoadingAlertas;

  // Renderização principal do Dashboard
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

      {/* Cabeçalho */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Dashboard</h1>
        {/* Placeholder ou nome da empresa */}
        {isLoadingDashboard || initialLoading ? (
             <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse mt-1"></div>
        ) : (
            <p className="text-md text-gray-500 mt-1">
                Empresa: <span className="font-semibold">{dashboardData?.empresaNome || 'Não Carregada'}</span>
            </p>
        )}
      </div>

       {/* Exibe erro geral, se houver */}
       {error && (
            <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-sm font-medium text-red-800">
                   <FiAlertTriangle className="inline h-4 w-4 mr-2 align-text-bottom"/>
                   Erro ao carregar dados do dashboard: {error.message || 'Erro desconhecido.'}
                </p>
            </div>
       )}

      {/* Grid Principal para Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* --- Linha 1: Estatísticas Chave e Alertas --- */}
        <StatCard
          title="Funcionários Ativos"
          // Usa optional chaining e nullish coalescing
          value={dashboardData?.totalFuncionarios ?? (isLoadingDashboard || initialLoading ? '' : '-')}
          icon={FiUsers}
          isLoading={isLoadingDashboard || initialLoading}
          linkTo={companyId ? `/dashboard/${companyId}/funcionarios` : '#'}
        />

        <StatCard
          title="Média Ruído GHEs (NEN)"
          value={dashboardData?.mediaNiveisRuido ? `${dashboardData.mediaNiveisRuido} dB(A)` : (isLoadingDashboard || initialLoading ? '' : '-')}
          icon={FiVolume2}
          isLoading={isLoadingDashboard || initialLoading}
          linkTo={companyId ? `/dashboard/${companyId}/ghes` : '#'}
        />

        {/* Card de Alertas GAIA Plus */}
        <GaiaPlusAlertCard
           companyId={companyId}
           alertas={alertas} // Passa o array (ou [])
           isLoading={isLoadingAlertas || initialLoading}
        />

        {/* --- Linha 2: Listas --- */}
        {/* Card: Próximos Exames */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-1 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Próximos Agendamentos</h3>
            <FiCalendar className="h-5 w-5 text-gray-400" />
          </div>
          {/* Placeholder ou Lista */}
          {isLoadingProximosExames || initialLoading ? (
            <div className="space-y-3 animate-pulse">
                {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded"></div>)}
            </div>
          ) : (
            // Garante que 'proximosExames' é um array antes de mapear
            <ul className="max-h-60 overflow-y-auto divide-y divide-gray-100">
              {Array.isArray(proximosExames) && proximosExames.length > 0 ? (
                proximosExames.map(exame => (
                  <ListItemLink
                    key={exame.id}
                    to={companyId && exame.trabalhadorId ? `/dashboard/${companyId}/funcionarios/${exame.trabalhadorId}` : '#'}
                    primaryText={exame.trabalhadorNome || 'Funcionário Inválido'}
                    secondaryText={`${exame.tipoExame || 'Agendamento'} em ${exame.dataExame ? new Date(exame.dataExame).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'Data inválida'}`}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Nenhum agendamento futuro encontrado.</p>
              )}
            </ul>
          )}
        </div>

        {/* Card: Últimas Atualizações */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Atividade Recente</h3>
            <FiActivity className="h-5 w-5 text-gray-400" />
          </div>
          {/* Placeholder ou Lista */}
          {isLoadingUltimasAtualizacoes || initialLoading ? (
             <div className="space-y-3 animate-pulse">
                {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded"></div>)}
            </div>
          ) : (
             // Garante que 'ultimasAtualizacoes' é um array antes de mapear
            <ul className="max-h-60 overflow-y-auto divide-y divide-gray-100">
              {Array.isArray(ultimasAtualizacoes) && ultimasAtualizacoes.length > 0 ? (
                ultimasAtualizacoes.map(update => (
                  <ListItemLink
                    key={update.id}
                    to={update.linkPara || '#'}
                    primaryText={update.descricao || 'Atualização sem descrição'}
                    secondaryText={`${update.tipo || 'Evento'} em ${update.data ? new Date(update.data).toLocaleString('pt-BR', {timeZone: 'UTC', dateStyle: 'short', timeStyle: 'short'}) : 'Data inválida'}`}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Nenhuma atividade recente encontrada.</p>
              )}
            </ul>
          )}
        </div>

      </div> {/* Fim do Grid Principal */}

    </div> // Fim do container principal
  );
} // Fim do componente Dashboard