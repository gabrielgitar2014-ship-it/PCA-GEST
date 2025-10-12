// DENTRO DE: src/contexts/DataContext.jsx

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthContext'; // Importa o useAuth para saber o status do usuário

const DataContext = createContext();

export function DataProvider({ children }) {
  // --- ESTADOS ---
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [workers, setWorkers] = useState([]);
  const [isWorkersLoading, setIsWorkersLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isWorkerDetailLoading, setIsWorkerDetailLoading] = useState(true);
  const [workerExams, setWorkerExams] = useState([]);
  const [areExamsLoading, setAreExamsLoading] = useState(true);
  const [workerEvolutions, setWorkerEvolutions] = useState([]);
  const [areEvolutionsLoading, setAreEvolutionsLoading] = useState(true);
  const [workerSchedules, setWorkerSchedules] = useState([]);
  const [areSchedulesLoading, setAreSchedulesLoading] = useState(true);

  // Pega o usuário do contexto de autenticação para resolver a condição de corrida
  const { user } = useAuth();

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('empresas').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Erro ao buscar empresas:', error);
      setError(error);
      setCompanies([]);
    } else {
      setCompanies(data);
    }
    setIsLoading(false);
  }, []);

  // useEffect que agora depende do usuário para iniciar a busca de empresas
  useEffect(() => {
    if (user) {
      fetchCompanies();
    } else {
      // Se o usuário faz logout, limpa os dados e para o carregamento.
      setCompanies([]);
      setIsLoading(false);
    }
  }, [user, fetchCompanies]);

  const createCompany = useCallback(async (brasilApiData) => {
    if (!brasilApiData) return { error: { message: 'Dados da API não fornecidos.' } };
    const { data: { user } } = await supabase.auth.getUser();
    const newCompanyData = {
      razao_social: brasilApiData.razao_social, nome_fantasia: brasilApiData.nome_fantasia,
      cnpj: brasilApiData.cnpj.replace(/\D/g, ''), logradouro: brasilApiData.logradouro,
      numero: brasilApiData.numero, complemento: brasilApiData.complemento,
      bairro: brasilApiData.bairro, cidade: brasilApiData.municipio, estado: brasilApiData.uf,
      cep: brasilApiData.cep.replace(/\D/g, ''), telefone: brasilApiData.ddd_telefone_1 || brasilApiData.ddd_telefone_2,
      email: brasilApiData.email, ativo: true, user_id: user.id,
    };
    const { data, error } = await supabase.from('empresas').insert([newCompanyData]).select().single();
    if (error) { console.error('Erro ao criar empresa:', error); return { error }; }
    setCompanies(prev => [data, ...prev]);
    return { data };
  }, []);

  const fetchDashboardData = useCallback(async (companyId) => {
    if (!companyId) return;
    setIsDashboardLoading(true);
    setDashboardData(null);
    try {
      const [companyInfoRes, totalWorkersRes, desencadeamentoRes] = await Promise.all([
        supabase.from('empresas').select('nome_fantasia, razao_social').eq('id', companyId).single(),
        supabase.from('trabalhadores').select('*', { count: 'exact', head: true }).eq('empresa_id', companyId).eq('status', 'ativo'),
        supabase.from('audiometrias').select('id, data_exame, trabalhadores!inner(id, nome, empresa_id)').eq('classificacao', 'desencadeamento').eq('trabalhadores.empresa_id', companyId)
      ]);
      if (companyInfoRes.error) throw companyInfoRes.error;
      if (totalWorkersRes.error) throw totalWorkersRes.error;
      if (desencadeamentoRes.error) throw desencadeamentoRes.error;
      const newData = {
        companyName: companyInfoRes.data.nome_fantasia || companyInfoRes.data.razao_social,
        kpis: {
          casosEmAnalise: desencadeamentoRes.data.length, examesProximos: 0,
          totalTrabalhadores: totalWorkersRes.count,
        },
        casosComDesencadeamento: desencadeamentoRes.data.map(item => ({
          id: item.id, nome: item.trabalhadores.nome, empresa: companyInfoRes.data.razao_social,
          dataExame: new Date(item.data_exame).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
        })),
      };
      setDashboardData(newData);
    } catch (error) {
      console.error("Ocorreu um erro ao buscar dados do dashboard:", error);
    } finally {
      setIsDashboardLoading(false);
    }
  }, []);

  const fetchWorkers = useCallback(async (companyId) => {
    if (!companyId) return;
    setIsWorkersLoading(true);
    try {
      const { data, error } = await supabase.from('trabalhadores').select('*').eq('empresa_id', companyId).order('nome', { ascending: true });
      if (error) throw error;
      setWorkers(data);
    } catch (error) {
      console.error('Erro ao buscar trabalhadores:', error);
      setWorkers([]);
    } finally {
      setIsWorkersLoading(false);
    }
  }, []);

  const createWorker = useCallback(async (workerData) => {
    const { data, error } = await supabase.from('trabalhadores').insert([workerData]).select().single();
    if (error) { console.error('Erro ao criar trabalhador:', error); return { error }; }
    setWorkers(prev => [data, ...prev].sort((a, b) => a.nome.localeCompare(b.nome)));
    return { data };
  }, []);

  const searchWorkersByCpf = useCallback(async (cpfQuery, companyId) => {
    if (!cpfQuery || !companyId) return [];
    const { data, error } = await supabase.from('trabalhadores').select('id, nome, cpf').eq('empresa_id', companyId).like('cpf', `${cpfQuery}%`).limit(5);
    if (error) { console.error("Erro ao buscar trabalhador por CPF:", error); return []; }
    return data;
  }, []);

  const fetchWorkerById = useCallback(async (workerId) => {
    if (!workerId) return;
    setIsWorkerDetailLoading(true);
    try {
      const { data, error } = await supabase.from('trabalhadores').select(`*, audiometrias ( id, data_exame, tipo_exame, classificacao )`).eq('id', workerId).order('data_exame', { foreignTable: 'audiometrias', ascending: false }).single();
      if (error) throw error;
      setSelectedWorker(data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do trabalhador:', error);
      setSelectedWorker(null);
    } finally {
      setIsWorkerDetailLoading(false);
    }
  }, []);

  const fetchExamsForWorker = useCallback(async (workerId) => {
    if (!workerId) return;
    setAreExamsLoading(true);
    try {
      const { data, error } = await supabase.from('audiometrias').select('*').eq('trabalhador_id', workerId).order('data_exame', { ascending: false });
      if (error) throw error;
      setWorkerExams(data);
    } catch (error) {
      console.error('Erro ao buscar exames do trabalhador:', error);
      setWorkerExams([]);
    } finally {
      setAreExamsLoading(false);
    }
  }, []);

  const createAudiometry = useCallback(async (mainData, pointsData) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: audiometry, error: mainError } = await supabase.from('audiometrias').insert([{ ...mainData, trabalhador_id: mainData.trabalhador_id, profissional_id: user.id }]).select().single();
    if (mainError) { console.error("Erro ao salvar registro principal da audiometria:", mainError); throw mainError; }
    const pointsToInsert = pointsData.map(point => ({ ...point, audiometria_id: audiometry.id }));
    const { error: pointsError } = await supabase.from('audiometria_pontos').insert(pointsToInsert);
    if (pointsError) { console.error("Erro ao salvar pontos do audiograma:", pointsError); throw pointsError; }
    setSelectedWorker(prev => ({ ...prev, audiometrias: [audiometry, ...prev.audiometrias] }));
    return { data: audiometry };
  }, []);
  
  const fetchEvolutionsForWorker = useCallback(async (workerId) => {
    if (!workerId) return;
    setAreEvolutionsLoading(true);
    try {
      const { data, error } = await supabase.from('evolucoes').select(`*, author:usuarios(nome)`).eq('trabalhador_id', workerId).order('created_at', { ascending: false });
      if (error) throw error;
      setWorkerEvolutions(data);
    } catch (error) {
      console.error('Erro ao buscar evoluções:', error);
      setWorkerEvolutions([]);
    } finally {
      setAreEvolutionsLoading(false);
    }
  }, []);
  
  const createEvolution = useCallback(async (evolutionData) => {
    const { data: { user } } = await supabase.auth.getUser();
    const dataToInsert = { ...evolutionData, usuario_id: user.id };
    const { data, error } = await supabase.from('evolucoes').insert([dataToInsert]).select(`*, author:usuarios(nome)`).single();
    if (error) { console.error('Erro ao criar evolução:', error); return { error }; }
    setWorkerEvolutions(prev => [data, ...prev]);
    return { data };
  }, []);

  const fetchSchedulesForWorker = useCallback(async (workerId) => {
    if (!workerId) return;
    setAreSchedulesLoading(true);
    try {
      const { data, error } = await supabase.from('agendamentos').select('*').eq('trabalhador_id', workerId).order('data_agendamento', { ascending: true });
      if (error) throw error;
      setWorkerSchedules(data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      setWorkerSchedules([]);
    } finally {
      setAreSchedulesLoading(false);
    }
  }, []);

  const createAgendamento = useCallback(async (scheduleData) => {
    const { data: { user } } = await supabase.auth.getUser();
    const dataToInsert = { ...scheduleData, usuario_id: user.id };
    const { data, error } = await supabase.from('agendamentos').insert([dataToInsert]).select().single();
    if (error) { console.error('Erro ao criar agendamento:', error); return { error }; }
    setWorkerSchedules(prev => [...prev, data].sort((a,b) => new Date(a.data_agendamento) - new Date(b.data_agendamento)));
    return { data };
  }, []);

  const value = {
    companies, isLoading, error, createCompany,
    dashboardData, isDashboardLoading, fetchDashboardData,
    workers, isWorkersLoading, fetchWorkers, createWorker,
    searchWorkersByCpf,
    selectedWorker, isWorkerDetailLoading, fetchWorkerById,
    workerExams, areExamsLoading, fetchExamsForWorker, createAudiometry,
    workerEvolutions, areEvolutionsLoading, fetchEvolutionsForWorker, createEvolution,
    workerSchedules, areSchedulesLoading, fetchSchedulesForWorker, createAgendamento,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
}