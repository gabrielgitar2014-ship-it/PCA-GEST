// src/contexts/DataContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export function DataProvider({ children }) {
  // --- ESTADOS ---
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Estado de erro geral
  
  // Estados do Dashboard (Modificados e Novos)
  const [dashboardData, setDashboardData] = useState(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);

  const [alertas, setAlertas] = useState([]);
  const [totalAlertas, setTotalAlertas] = useState(0);
  const [isLoadingAlertas, setIsLoadingAlertas] = useState(true);

  const [proximosExames, setProximosExames] = useState([]);
  const [isLoadingProximosExames, setIsLoadingProximosExames] = useState(true);

  const [ultimasAtualizacoes, setUltimasAtualizacoes] = useState([]);
  const [isLoadingUltimasAtualizacoes, setIsLoadingUltimasAtualizacoes] = useState(true);
  
  // Estados existentes (mantidos)
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
  
  // Estados para o detalhe do exame (mantidos)
  const [selectedExam, setSelectedExam] = useState(null);
  const [isExamDetailLoading, setIsExamDetailLoading] = useState(true);

  // Estados para a AudiometriasPage (mantidos)
  const [audiometrias, setAudiometrias] = useState([]);
  const [totalAudiometrias, setTotalAudiometrias] = useState(0);
  const [areAudiometriasLoading, setAreAudiometriasLoading] = useState(true);


  const { user } = useAuth();

  // --- FUNÇÕES EXISTENTES (MANTIDAS) ---

  const fetchCompanies = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    // Assumindo que a migração de 'client' para 'public' foi feita
    const { data, error } = await supabase.from('empresas').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Erro ao buscar empresas:', error);
      setError(error);
      setCompanies([]);
    } else {
      setCompanies(data || []);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const createCompanyAndConsumeToken = useCallback(async (brasilApiData) => {
    if (!brasilApiData) return { error: { message: 'Dados da API não fornecidos.' } };
    
    const companyData = {
      razao_social: brasilApiData.razao_social, nome_fantasia: brasilApiData.nome_fantasia,
      cnpj: brasilApiData.cnpj.replace(/\D/g, ''), logradouro: brasilApiData.logradouro,
      numero: brasilApiData.numero, bairro: brasilApiData.bairro, cidade: brasilApiData.municipio,
      estado: brasilApiData.uf, cep: brasilApiData.cep.replace(/\D/g, ''),
      telefone: brasilApiData.ddd_telefone_1 || brasilApiData.ddd_telefone_2, email: brasilApiData.email,
    };

    // Assumindo que esta RPC 'criar_empresa_e_consumir_token' existe no 'public'
    const { data, error } = await supabase.rpc('criar_empresa_e_consumir_token', { dados_empresa: companyData });
    if (error) { console.error('Erro ao criar empresa e consumir token:', error); return { error }; }
    fetchCompanies();
    return { data };
  }, [fetchCompanies]);


  const fetchDashboardData = useCallback(async (companyId) => {
    if (!companyId) return;
    setIsDashboardLoading(true);
    setError(null); // Limpa erros anteriores
    
    try {
        const [companyInfoRes, totalWorkersRes, ghesRes] = await Promise.all([
            supabase.from('empresas').select('nome_fantasia, razao_social').eq('id', companyId).single(),
            supabase.from('trabalhadores').select('*', { count: 'exact', head: true }).eq('empresa_id', companyId).eq('status', 'ativo'),
            supabase.from('ghes').select('nivel_ruido').eq('empresa_id', companyId) // Assumindo tabela 'ghes'
        ]);

        if (companyInfoRes.error) throw companyInfoRes.error;
        if (totalWorkersRes.error) throw totalWorkersRes.error;
        if (ghesRes.error) {
            console.warn('Não foi possível buscar GHEs:', ghesRes.error.message);
            // Não lançar erro, apenas logar. A média será null.
        }

        // Calcular média de ruído
        let mediaNiveisRuido = null;
        if (ghesRes.data && ghesRes.data.length > 0) {
            const ruidosValidos = ghesRes.data
                .map(g => g.nivel_ruido)
                .filter(n => typeof n === 'number' && n > 0);
            
            if (ruidosValidos.length > 0) {
                const soma = ruidosValidos.reduce((acc, curr) => acc + curr, 0);
                mediaNiveisRuido = (soma / ruidosValidos.length).toFixed(2); // Arredonda para 2 casas
            }
        }

        const newData = {
            empresaNome: companyInfoRes.data.nome_fantasia || companyInfoRes.data.razo_social,
            totalFuncionarios: totalWorkersRes.count || 0,
            mediaNiveisRuido: mediaNiveisRuido ? parseFloat(mediaNiveisRuido) : null,
        };

        setDashboardData(newData);
    
    } catch (error) {
        console.error("Ocorreu um erro ao buscar dados do dashboard:", error);
        setError(error); // Define o estado de erro
        setDashboardData(null); // Limpa dados antigos em caso de falha
    } finally {
        setIsDashboardLoading(false);
    }
  }, []); 

  const fetchAlertas = useCallback(async (companyId, limit) => {
    if (!companyId) return;
    setIsLoadingAlertas(true);
    setError(null);

    try {
        let query = supabase
            .from('alertas_pca') // Assumindo tabela 'alertas_pca'
            .select(`
                id, tipo_alerta, mensagem, nivel_severidade, trabalhador_id,
                trabalhadores!inner (id, nome, empresa_id)
            `, { count: 'exact' })
            .eq('trabalhadores.empresa_id', companyId) // Filtra pela empresa do trabalhador
            .eq('status', 'novo')
            .order('created_at', { ascending: false });

        if (limit) {
            query = query.limit(limit);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        setAlertas(data || []);
        setTotalAlertas(count || 0);

    } catch (error) {
        console.error("Erro ao buscar alertas:", error);
        setError(error);
        setAlertas([]);
        setTotalAlertas(0);
    } finally {
        setIsLoadingAlertas(false);
    }
  }, []);

  const fetchProximosExames = useCallback(async (companyId, limit) => {
      if (!companyId) return;
      setIsLoadingProximosExames(true);
      setError(null);

      try {
          const today = new Date().toISOString().split('T')[0];

          let query = supabase
              .from('agendamentos')
              .select(`
                  id, trabalhador_id, tipo_exame, data_agendamento,
                  trabalhadores!inner (id, nome, empresa_id)
              `)
              .eq('trabalhadores.empresa_id', companyId)
              .eq('status', 'agendado') // Conforme especificado
              .gte('data_agendamento', today) // Conforme especificado
              .order('data_agendamento', { ascending: true });

          if (limit) {
              query = query.limit(limit);
          }

          const { data, error } = await query;

          if (error) throw error;

          // Mapear para o formato solicitado
          const proximos = data.map(item => ({
              id: item.id,
              trabalhadorId: item.trabalhador_id,
              trabalhadorNome: item.trabalhadores.nome,
              dataExame: item.data_agendamento,
              tipoExame: item.tipo_exame,
          }));

          setProximosExames(proximos || []);

      } catch (error) {
          console.error("Erro ao buscar próximos exames:", error);
          setError(error);
          setProximosExames([]);
      } finally {
          setIsLoadingProximosExames(false);
      }
  }, []);

  const fetchUltimasAtualizacoes = useCallback(async (companyId, limit = 5) => {
      if (!companyId) return;
      setIsLoadingUltimasAtualizacoes(true);
      setError(null);

      try {
          // Fonte: Últimas audiometrias criadas (conforme definido)
          const { data, error } = await supabase
              .from('audiometrias')
              .select(`
                  id, created_at, data_exame, motivo_exame,
                  trabalhadores!inner (id, nome, empresa_id)
              `)
              .eq('trabalhadores.empresa_id', companyId)
              .order('created_at', { ascending: false }) // Ordenar por 'created_at' para "Atividade Recente"
              .limit(limit);

          if (error) throw error;

          // Mapear para o formato solicitado
          const atualizacoes = data.map(item => ({
              id: item.id,
              descricao: `Audiometria (${item.motivo_exame || 'N/A'}) registrada para ${item.trabalhadores.nome}`,
              tipo: 'Exame', // Categoria
              data: item.created_at, // Data do evento (criação)
              linkPara: `/workers/${item.trabalhadores.id}/exams/${item.id}` // Link (suposição)
          }));
          
          setUltimasAtualizacoes(atualizacoes || []);

      } catch (error) {
          console.error("Erro ao buscar últimas atualizações:", error);
          setError(error);
          setUltimasAtualizacoes([]);
      } finally {
          setIsLoadingUltimasAtualizacoes(false);
      }
  }, []);

  // --- RESTANTE DAS FUNÇÕES (MANTIDAS) ---

  const fetchWorkers = useCallback(async (companyId, page = 0, pageSize = 20) => {
    if (!companyId) return;
    setIsWorkersLoading(true);
    try {
      const from = page * pageSize;
      const to = from + pageSize - 1;
      const { data, error, count } = await supabase.from('trabalhadores').select('*', { count: 'exact' }).eq('empresa_id', companyId).order('nome', { ascending: true }).range(from, to);
      if (error) throw error;
      setWorkers(data || []);
      setTotalWorkers(count || 0);
    } catch (error) {
      console.error('Erro ao buscar trabalhadores:', error);
    } finally {
      setIsWorkersLoading(false);
    }
  }, []);

  const createWorker = useCallback(async (workerData) => {
    const dataParaSalvar = { ...workerData };
    const camposDeData = ['data_nascimento', 'data_admissao']; 
    camposDeData.forEach(campo => {
      if (dataParaSalvar[campo] === "") {
        dataParaSalvar[campo] = null;
      }
    });
    const { data, error } = await supabase
      .from('trabalhadores')
      .insert([dataParaSalvar]) 
      .select()
      .single();
    if (error) { 
      console.error('Erro ao criar trabalhador:', error);
      return { error }; 
    }
    fetchWorkers(workerData.empresa_id, 0);
    return { data };
  }, [fetchWorkers]);

  // ===================================================================
  // ✅ FUNÇÃO MODIFICADA (searchWorkersByCpf -> searchWorkers)
  // ===================================================================
  const searchWorkers = useCallback(async (query, companyId) => {
    if (!query || !companyId) return [];
    
    // Remove pontuações comuns de CPF ou matrícula para busca
    const searchTerm = query.replace(/[.\-\/]/g, '');

    const { data, error } = await supabase
      .from('trabalhadores')
      .select('id, nome, cpf') // Retorna apenas o necessário para a lista
      .eq('empresa_id', companyId)
      .or(
        `nome.ilike.%${searchTerm}%,` +      // Busca por nome (qualquer parte, case-insensitive)
        `cpf.like.${searchTerm}%,` +        // Busca por CPF (início)
        `matricula.like.${searchTerm}%`    // Busca por matrícula (início) - Assumindo coluna 'matricula'
      )
      .limit(5); // Limita a 5 resultados

    if (error) { 
      console.error("Erro ao buscar trabalhadores:", error); 
      return []; 
    }
    return data;
  }, []); // Dependência de companyId removida pois é passada como argumento

  const fetchWorkerById = useCallback(async (workerId) => {
    if (!workerId) return;
    setIsWorkerDetailLoading(true);
    try {
      const { data, error } = await supabase.from('trabalhadores').select(`*, audiometrias ( id, data_exame, motivo_exame, tipo_audiograma, resultado_analise, classificacao )`).eq('id', workerId).order('data_exame', { foreignTable: 'audiometrias', ascending: false }).single();
      if (error) throw error;
      setSelectedWorker(data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do trabalhador:', error);
      setSelectedWorker(null);
    } finally {
      setIsWorkerDetailLoading(false);
    }
  }, []);

  const fetchAudiometrias = useCallback(async (companyId, page = 0, pageSize = 20) => {
    if (!companyId) return;
    setAreAudiometriasLoading(true);
    try {
      const from = page * pageSize;
      const to = from + pageSize - 1;
      const { data, error, count } = await supabase
        .from('audiometrias')
        .select(`
          id, data_exame, motivo_exame, tipo_audiograma, resultado_analise, classificacao, trabalhador_id,
          trabalhadores!inner (
            id, nome, empresa_id
          )
        `, { count: 'exact' })
        .eq('trabalhadores.empresa_id', companyId)
        .order('data_exame', { ascending: false })
        .range(from, to);
      if (error) throw error;
      setAudiometrias(data || []);
      setTotalAudiometrias(count || 0);
    } catch (error) { 
      console.error("Erro ao buscar audiometrias:", error); 
      setAudiometrias([]);
      setTotalAudiometrias(0);
    } 
    finally { setAreAudiometriasLoading(false); }
  }, []);

  const fetchExamsForWorker = useCallback(async (workerId) => {
    if (!workerId) return;
    setAreExamsLoading(true);
    try {
      const { data, error } = await supabase.from('audiometrias').select('*').eq('trabalhador_id', workerId).order('data_exame', { ascending: false });
      if (error) throw error;
      setWorkerExams(data || []);
    } catch (error) {
      console.error('Erro ao buscar exames do trabalhador:', error);
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
    fetchAudiometrias(audiometryDataObject.empresa_id); 
    return { data };
  }, [fetchWorkerById, fetchAudiometrias]);

  const fetchLatestReferenceAudiogram = useCallback(async (workerId) => {
    if (!workerId) return null;
    const { data, error } = await supabase.from('audiometrias').select('*').eq('trabalhador_id', workerId).eq('tipo_audiograma', 'referencia').order('data_exame', { ascending: false }).limit(1).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }, []);

  const fetchLatestAudiogram = useCallback(async (workerId) => {
    if (!workerId) return null;
    const { data, error } = await supabase.from('audiometrias').select('*').eq('trabalhador_id', workerId).order('data_exame', { ascending: false }).limit(1).single();
    if (error && error.code !== 'PGRST116') throw error;
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
    } catch (error) { console.error("Erro ao buscar casos para análise:", error); } 
    finally { setAreCasosLoading(false); }
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
      setWorkerEvolutions(data || []);
    } catch (error) {
      console.error('Erro ao buscar evoluções:', error);
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
      setWorkerSchedules(data || []);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
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

  const fetchMyLicense = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .rpc('get_license_by_activator_id', {
        p_user_id: user.id
      })
      .single(); 
    if (error && error.code !== 'PGRST116') { 
      console.error("Erro ao buscar licença com nome do cliente:", error);
      return null;
    }
    return data;
  }, []);

  const fetchAudiometryById = useCallback(async (examId) => {
    if (!examId) return;
    setIsExamDetailLoading(true);
    try {
      const { data, error } = await supabase
        .from('audiometrias')
        .select(`*, trabalhador:trabalhadores(nome), profissional:usuarios(nome)`)
        .eq('id', examId)
        .single();
      
      if (error) throw error;
      setSelectedExam(data);
    } catch (error) {
      console.error("Erro ao buscar detalhes da audiometria:", error);
      setSelectedExam(null);
    } finally {
      setIsExamDetailLoading(false);
    }
  }, []);


  // --- VALOR DO CONTEXTO (ATUALIZADO) ---

  const value = {
    // Geral e Empresa
    companies, isLoading, error, setError,
    createCompanyAndConsumeToken,
    
    // Dashboard (Modificado e Novo)
    dashboardData, isDashboardLoading, fetchDashboardData,
    alertas, totalAlertas, isLoadingAlertas, fetchAlertas,
    proximosExames, isLoadingProximosExames, fetchProximosExames,
    ultimasAtualizacoes, isLoadingUltimasAtualizacoes, fetchUltimasAtualizacoes,

    // Trabalhadores (Mantido)
    workers, totalWorkers, isWorkersLoading, fetchWorkers, createWorker,
    
    // ✅ MODIFICAÇÃO: Exportando a nova função de busca
    searchWorkers, 
    
    selectedWorker, isWorkerDetailLoading, fetchWorkerById,
    
    // Exames / Audiometrias (Mantido)
    workerExams, areExamsLoading, fetchExamsForWorker, createAudiometry,
    fetchLatestReferenceAudiogram, fetchLatestAudiogram,
    selectedExam, isExamDetailLoading, fetchAudiometryById,
    audiometrias, totalAudiometrias, areAudiometriasLoading, fetchAudiometrias,

    // Casos (Mantido)
    casosParaAnalise, totalCasosParaAnalise, areCasosLoading, fetchCasosParaAnalise,
    casosDeAgravamento, totalCasosDeAgravamento, areAgravamentosLoading, fetchCasosDeAgravamento,
    
    // Evoluções (Mantido)
    workerEvolutions, areEvolutionsLoading, fetchEvolutionsForWorker, createEvolution,
    
    // Agendamentos (Mantido)
    workerSchedules, areSchedulesLoading, fetchSchedulesForWorker, createAgendamento,
    
    // Perfil e Licença (Mantido)
    fetchUserProfile, updateUserProfile,
    fetchMyLicense,
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