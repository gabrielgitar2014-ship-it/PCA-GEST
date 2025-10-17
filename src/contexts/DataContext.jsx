// DENTRO DE: src/contexts/DataContext.jsx

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export function DataProvider({ children }) {
  // --- ESTADOS ---
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [workers, setWorkers] = useState([]);
  const [totalWorkers, setTotalWorkers] = useState(0);
  const [isWorkersLoading, setIsWorkersLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isWorkerDetailLoading, setIsWorkerDetailLoading] = useState(true);
  const [workerExams, setWorkerExams] = useState([]);
  const [areExamsLoading, setAreExamsLoading] = useState(true);
  const [workerEvolutions, setWorkerEvolutions] = useState([]);
  const [areEvolutionsLoading, setAreEvolutionsLoading] = useState(true);
  const [workerSchedules, setWorkerSchedules] = useState([]);
  const [areSchedulesLoading, setAreSchedulesLoading] = useState(true);
  const [casosParaAnalise, setCasosParaAnalise] = useState([]);
  const [totalCasosParaAnalise, setTotalCasosParaAnalise] = useState(0);
  const [areCasosLoading, setAreCasosLoading] = useState(true);
  const [casosDeAgravamento, setCasosDeAgravamento] = useState([]);
  const [totalCasosDeAgravamento, setTotalCasosDeAgravamento] = useState(0);
  const [areAgravamentosLoading, setAreAgravamentosLoading] = useState(true);

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

  useEffect(() => {
    if (user) {
      fetchCompanies();
    } else {
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
      const today = new Date().toISOString().split('T')[0];
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      const thirtyDaysISO = thirtyDaysFromNow.toISOString().split('T')[0];
      const [
        companyInfoRes, totalWorkersRes, revisaoRes,
        agravamentoRes, agendamentosRes
      ] = await Promise.all([
        supabase.from('empresas').select('nome_fantasia, razao_social').eq('id', companyId).single(),
        supabase.from('trabalhadores').select('*', { count: 'exact', head: true }).eq('empresa_id', companyId).eq('status', 'ativo'),
        supabase.from('audiometrias').select('id, trabalhadores!inner(empresa_id)', { count: 'exact', head: true }).eq('trabalhadores.empresa_id', companyId).or('resultado_analise.eq.mudanca_unilateral,classificacao.eq.desencadeamento'),
        supabase.from('audiometrias').select('id, trabalhadores!inner(empresa_id)', { count: 'exact', head: true }).eq('trabalhadores.empresa_id', companyId).or('resultado_analise.eq.agravamento_bilateral,classificacao.eq.agravamento'),
        supabase.from('agendamentos').select('id, trabalhadores!inner(empresa_id)', { count: 'exact', head: true }).eq('trabalhadores.empresa_id', companyId).gte('data_agendamento', today).lte('data_agendamento', thirtyDaysISO)
      ]);
      if (companyInfoRes.error) throw companyInfoRes.error;
      if (totalWorkersRes.error) throw totalWorkersRes.error;
      if (revisaoRes.error) throw revisaoRes.error;
      if (agravamentoRes.error) throw agravamentoRes.error;
      if (agendamentosRes.error) throw agendamentosRes.error;
      const newData = {
        companyName: companyInfoRes.data.nome_fantasia || companyInfoRes.data.razao_social,
        kpis: {
          casosEmAnalise: revisaoRes.count || 0,
          casosDeAgravamento: agravamentoRes.count || 0,
          examesProximos: agendamentosRes.count || 0,
          totalTrabalhadores: totalWorkersRes.count || 0,
        },
      };
      setDashboardData(newData);
    } catch (error) {
      console.error("Ocorreu um erro ao buscar dados do dashboard:", error);
    } finally {
      setIsDashboardLoading(false);
    }
  }, []);

  const fetchWorkers = useCallback(async (companyId, page = 0, pageSize = 20) => {
    if (!companyId) return;
    setIsWorkersLoading(true);
    try {
      const from = page * pageSize;
      const to = from + pageSize - 1;
      const { data, error, count } = await supabase.from('trabalhadores').select('*', { count: 'exact' }).eq('empresa_id', companyId).order('nome', { ascending: true }).range(from, to);
      if (error) throw error;
      setWorkers(data);
      setTotalWorkers(count);
    } catch (error) {
      console.error('Erro ao buscar trabalhadores:', error);
      setWorkers([]);
      setTotalWorkers(0);
    } finally {
      setIsWorkersLoading(false);
    }
  }, []);

  const createWorker = useCallback(async (workerData) => {
    const { data, error } = await supabase.from('trabalhadores').insert([workerData]).select().single();
    if (error) { console.error('Erro ao criar trabalhador:', error); return { error }; }
    fetchWorkers(workerData.empresa_id);
    return { data };
  }, [fetchWorkers]);

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
      const { data, error } = await supabase.from('trabalhadores').select(`*, audiometrias ( id, data_exame, motivo_exame, tipo_audiograma, resultado_analise, classificacao, justificativa_analise )`).eq('id', workerId).order('data_exame', { foreignTable: 'audiometrias', ascending: false }).single();
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
  
  const createAudiometry = useCallback(async (audiometryDataObject) => {
    const { data: { user } } = await supabase.auth.getUser();
    const dataToInsert = { ...audiometryDataObject, profissional_id: user.id };
    const { data, error } = await supabase.from('audiometrias').insert(dataToInsert).select().single();
    if (error) {
      console.error("Erro ao inserir audiometria:", error);
      throw error;
    }
    fetchWorkerById(audiometryDataObject.trabalhador_id);
    return data;
  }, [fetchWorkerById]);

  const fetchLatestReferenceAudiogram = useCallback(async (workerId) => {
    if (!workerId) return null;
    const { data, error } = await supabase.from('audiometrias').select('*').eq('trabalhador_id', workerId).eq('tipo_audiograma', 'referencia').order('data_exame', { ascending: false }).limit(1).single();
    if (error && error.code !== 'PGRST116') {
      console.error("Erro ao buscar audiograma de referência:", error);
      throw error;
    }
    return data;
  }, []);

  const fetchLatestAudiogram = useCallback(async (workerId) => {
    if (!workerId) return null;
    const { data, error } = await supabase.from('audiometrias').select('*').eq('trabalhador_id', workerId).order('data_exame', { ascending: false }).limit(1).single();
    if (error && error.code !== 'PGRST116') {
      console.error("Erro ao buscar último audiograma:", error);
      throw error;
    }
    return data;
  }, []);
  
  const fetchCasosParaAnalise = useCallback(async (companyId, page = 0, pageSize = 20) => {
    if (!companyId) return;
    setAreCasosLoading(true);
    try {
      const from = page * pageSize;
      const to = from + pageSize - 1;
      const { data, error, count } = await supabase.from('audiometrias').select('id, data_exame, resultado_analise, classificacao, trabalhadores!inner(id, nome)', { count: 'exact' }).eq('trabalhadores.empresa_id', companyId).or('resultado_analise.eq.mudanca_unilateral,classificacao.eq.desencadeamento').order('data_exame', { ascending: false }).range(from, to);
      if (error) throw error;
      setCasosParaAnalise(data || []);
      setTotalCasosParaAnalise(count || 0);
    } catch (error) {
      console.error("Erro ao buscar casos para análise:", error);
    } finally {
      setAreCasosLoading(false);
    }
  }, []);

  const fetchCasosDeAgravamento = useCallback(async (companyId, page = 0, pageSize = 20) => {
    if (!companyId) return;
    setAreAgravamentosLoading(true);
    try {
      const from = page * pageSize;
      const to = from + pageSize - 1;
      const { data, error, count } = await supabase.from('audiometrias').select('id, data_exame, resultado_analise, classificacao, trabalhadores!inner(id, nome)', { count: 'exact' }).eq('trabalhadores.empresa_id', companyId).or('resultado_analise.eq.agravamento_bilateral,classificacao.eq.agravamento').order('data_exame', { ascending: false }).range(from, to);
      if (error) throw error;
      setCasosDeAgravamento(data || []);
      setTotalCasosDeAgravamento(count || 0);
    } catch (error) {
      console.error("Erro ao buscar casos de agravamento:", error);
    } finally {
      setAreAgravamentosLoading(false);
    }
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

  const fetchUserProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase.from('usuarios').select('*').eq('id', user.id).single();
    if (error) {
      console.error("Erro ao buscar perfil do usuário:", error);
      return null;
    }
    return data;
  }, []);

  const updateUserProfile = useCallback(async (updateData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado.");
    const { data, error } = await supabase.from('usuarios').update(updateData).eq('id', user.id).select().single();
    if (error) {
      console.error("Erro ao atualizar perfil do usuário:", error);
      throw error;
    }
    return data;
  }, []);

  const value = {
    companies, isLoading, error, createCompany,
    dashboardData, isDashboardLoading, fetchDashboardData,
    workers, totalWorkers, isWorkersLoading, fetchWorkers, createWorker,
    searchWorkersByCpf,
    selectedWorker, isWorkerDetailLoading, fetchWorkerById,
    workerExams, areExamsLoading, fetchExamsForWorker, createAudiometry,
    fetchLatestReferenceAudiogram,
    fetchLatestAudiogram,
    casosParaAnalise, totalCasosParaAnalise, areCasosLoading, fetchCasosParaAnalise,
    casosDeAgravamento, totalCasosDeAgravamento, areAgravamentosLoading, fetchCasosDeAgravamento,
    workerEvolutions, areEvolutionsLoading, fetchEvolutionsForWorker, createEvolution,
    workerSchedules, areSchedulesLoading, fetchSchedulesForWorker, createAgendamento,
    fetchUserProfile,
    updateUserProfile,
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