import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import AudiogramChart from '@/components/AudiogramChart';
import CustomSelect from '@/components/CustomSelect';
// import AnalysisResultModal from '@/components/AnalysisResultModal'; // <-- REMOVIDO
// import ClassificationActionModal from '@/components/ClassificationActionModal'; // <-- REMOVIDO
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { toast } from 'sonner'; // ✅ IMPORTADO O SONNER

// Mapeamento centralizado das frequências
const HZ_FREQUENCIES_MAP = {
  '250': '250', '500': '500', '750': '750', '1k': '1000', '1.5k': '1500', '2k': '2000',
  '3k': '3000', '4k': '4000', '6k': '6000', '8k': '8000'
};
const HZ_LABELS = Object.keys(HZ_FREQUENCIES_MAP);

const createInitialPointsState = () => {
  const state = {};
  Object.values(HZ_FREQUENCIES_MAP).forEach(hz => {
    state[hz] = { od_aerea: null, oe_aerea: null, od_ossea: null, oe_ossea: null };
  });
  return state;
};

// ===================================================================
// ✅ FUNÇÃO MANTIDA: Calcula a média quadritonal (Perda Geral)
// ===================================================================
const calculateQuadritonalAverage = (pointsData, orelhaKey) => {
  const f1 = pointsData['500'][orelhaKey];
  const f2 = pointsData['1000'][orelhaKey];
  const f3 = pointsData['2000'][orelhaKey];
  const f4 = pointsData['4000'][orelhaKey];
  
  if (typeof f1 === 'number' && typeof f2 === 'number' && typeof f3 === 'number' && typeof f4 === 'number') {
    const average = (f1 + f2 + f3 + f4) / 4.0;
    return parseFloat(average.toFixed(2));
  }
  return null;
};

// ===================================================================
// ✅ FUNÇÃO MANTIDA: runAnalysis (Agravamento PAINSE/NR-7)
// ===================================================================
const runAnalysis = (audiogramaSequencial, audiogramaReferencia) => {
  if (!audiogramaReferencia) {
    return { resultado: 'normal', justificativa: 'Primeiro exame sequencial. Nenhuma referência anterior para comparação.' };
  }
  
  const AS = audiogramaSequencial, AR = audiogramaReferencia;
  let piora_od = false, piora_oe = false;
  let justificativas_od = [], justificativas_oe = [];

  try {
    const media1_AS_od = (AS.od_aerea_500 + AS.od_aerea_1000 + AS.od_aerea_2000) / 3.0;
    const media1_AR_od = (AR.od_aerea_500 + AR.od_aerea_1000 + AR.od_aerea_2000) / 3.0;
    if (media1_AS_od - media1_AR_od >= 10) {
      piora_od = true; 
      justificativas_od.push('piora na média de 500/1k/2k'); 
    }
    const media2_AS_od = (AS.od_aerea_3000 + AS.od_aerea_4000 + AS.od_aerea_6000) / 3.0;
    const media2_AR_od = (AR.od_aerea_3000 + AR.od_aerea_4000 + AR.od_aerea_6000) / 3.0;
    if (media2_AS_od - media2_AR_od >= 10) {
      piora_od = true; 
      justificativas_od.push('piora na média de 3k/4k/6k'); 
    }
    if (AS.od_aerea_3000 - AR.od_aerea_3000 >= 15) { piora_od = true; justificativas_od.push('piora em 3000Hz'); }
    if (AS.od_aerea_4000 - AR.od_aerea_4000 >= 15) { piora_od = true; justificativas_od.push('piora em 4000Hz'); }
    if (AS.od_aerea_6000 - AR.od_aerea_6000 >= 15) { piora_od = true; justificativas_od.push('piora em 6000Hz'); }
  } catch (e) { console.warn("Dados incompletos para análise da Orelha Direita."); }

  try {
    const media1_AS_oe = (AS.oe_aerea_500 + AS.oe_aerea_1000 + AS.oe_aerea_2000) / 3.0;
    const media1_AR_oe = (AR.oe_aerea_500 + AR.oe_aerea_1000 + AR.oe_aerea_2000) / 3.0;
    if (media1_AS_oe - media1_AR_oe >= 10) {
      piora_oe = true; 
      justificativas_oe.push('piora na média de 500/1k/2k'); 
    }
    const media2_AS_oe = (AS.oe_aerea_3000 + AS.oe_aerea_4000 + AS.oe_aerea_6000) / 3.0;
    const media2_AR_oe = (AR.oe_aerea_3000 + AR.oe_aerea_4000 + AR.oe_aerea_6000) / 3.0;
    if (media2_AS_oe - media2_AR_oe >= 10) {
      piora_oe = true; 
      justificativas_oe.push('piora na média de 3k/4k/6k'); 
    }
    if (AS.oe_aerea_3000 - AR.oe_aerea_3000 >= 15) { piora_oe = true; justificativas_oe.push('piora em 3000Hz'); }
    if (AS.oe_aerea_4000 - AR.oe_aerea_4000 >= 15) { piora_oe = true; justificativas_oe.push('piora em 4000Hz'); }
    if (AS.oe_aerea_6000 - AR.oe_aerea_6000 >= 15) { piora_oe = true; justificativas_oe.push('piora em 6000Hz'); }
  } catch (e) { console.warn("Dados incompletos para análise da Orelha Esquerda."); }

  if (piora_od && piora_oe) {
    const justOD = [...new Set(justificativas_od)].join(', ');
    const justOE = [...new Set(justificativas_oe)].join(', ');
    return { resultado: 'agravamento_bilateral', justificativa: `OD: ${justOD}. OE: ${justOE}.` };
  }
  if (piora_od || piora_oe) {
    let finalJustification = '';
    if (piora_od) finalJustification += `OD: ${[...new Set(justificativas_od)].join(', ')}.`;
    if (piora_oe) finalJustification += ` OE: ${[...new Set(justificativas_oe)].join(', ')}.`;
    return { resultado: 'mudanca_unilateral', justificativa: finalJustification.trim() };
  }
  return { resultado: 'normal', justificativa: 'Não foram encontradas alterações significativas em comparação com o exame de referência.' };
};


export default function AudiometriaCreatePage() {
  const { companyId, workerId } = useParams();
  const navigate = useNavigate();
  // createAgendamento foi removido do destructuring pois handleScheduleRetest foi removida
  const { createAudiometry, fetchLatestReferenceAudiogram, fetchLatestAudiogram } = useData(); 

  // --- ESTADOS REMOVIDOS ---
  // const [analysisResult, setAnalysisResult] = useState(null);
  // const [isBilateralModalOpen, setIsBilateralModalOpen] = useState(false);
  // const [isUnilateralModalOpen, setIsUnilateralModalOpen] = useState(false);
  const [previousExam, setPreviousExam] = useState(null); // Mantido (pode ser útil no futuro)

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputMode, setInputMode] = useState('aerea');
  const [mainData, setMainData] = useState({
    motivo_exame: 'periodico',
    tipo_audiograma: 'sequencial',
    data_exame: new Date().toISOString().split('T')[0],
    observacoes: '',
    classificacao: 'normal',
  });
  const [points, setPoints] = useState(createInitialPointsState());

  useEffect(() => {
    const loadPreviousExam = async () => {
      if (workerId) {
        const exam = await fetchLatestAudiogram(workerId);
        setPreviousExam(exam);
      }
    };
    loadPreviousExam();
  }, [workerId, fetchLatestAudiogram]);

  const motivoExameOptions = [
    { value: 'admissional', label: 'Admissional' }, { value: 'periodico', label: 'Periódico' },
    { value: 'retorno_trabalho', label: 'Retorno ao Trabalho' }, { value: 'mudanca_risco', label: 'Mudança de Risco' },
    { value: 'demissional', label: 'Demissional' },
  ];
  const tipoAudiogramaOptions = [
    { value: 'referencia', label: 'Referência' }, { value: 'sequencial', label: 'Sequencial' },
    { value: 'reteste', label: 'Reteste' },
  ];
  const classificacaoOptions = [
    { value: 'normal', label: 'Normal' }, { value: 'desencadeamento', label: 'Desencadeamento' }, { value: 'agravamento', label: 'Agravamento' },
  ];

  const handleSelectChange = (fieldName) => (value) => setMainData(p => ({ ...p, [fieldName]: value }));
  const handleMainDataChange = (e) => setMainData(p => ({ ...p, [e.target.name]: e.target.value }));
  const handlePointChange = (frequencia, orelha) => (e) => {
    const valor_db = e.target.value === '' ? null : parseInt(e.target.value, 10);
    const via = inputMode;
    const key = `${orelha}_${via}`;
    setPoints(p => ({ ...p, [frequencia]: { ...p[frequencia], [key]: valor_db }}));
  };

  // ===================================================================
  // ✅ FUNÇÃO handleSubmit (Totalmente Refatorada)
  // ===================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Calcula a Média Quadritonal (para "Perda Geral")
      const limiar_od = calculateQuadritonalAverage(points, 'od_aerea');
      const limiar_oe = calculateQuadritonalAverage(points, 'oe_aerea');

      // 2. Monta o objeto base de submissão
      const submissionData = { 
        ...mainData, 
        trabalhador_id: workerId,
        limiar_auditivo_od: limiar_od, // Salva a média quadritonal
        limiar_auditivo_oe: limiar_oe  // Salva a média quadritonal
      };
      
      Object.entries(points).forEach(([hz, values]) => {
        Object.entries(values).forEach(([key, dbValue]) => { if (dbValue !== null) { submissionData[`${key}_${hz}`] = dbValue; }});
      });

      // 3. Lógica de "Perda Geral" (Verificação 1)
      if (submissionData.classificacao === 'normal' && (limiar_od > 25 || limiar_oe > 25)) {
        submissionData.classificacao = 'desencadeamento';
      }

      // 4. Prepara dados finais e tipo de notificação
      let finalData = { ...submissionData };
      let toastMessage = 'Exame salvo com sucesso!';
      let toastType = 'success';
      let toastDescription = null;

      // 5. Lógica de "Agravamento PAINSE" (Verificação 2)
      // Só roda se for 'sequencial'
      if (mainData.tipo_audiograma === 'sequencial') {
        const audiogramaReferencia = await fetchLatestReferenceAudiogram(workerId);
        const analysisData = runAnalysis(submissionData, audiogramaReferencia);

        finalData.resultado_analise = analysisData.resultado;
        finalData.justificativa_analise = analysisData.justificativa;

        // ✅ LÓGICA AUTOMÁTICA (CONFORME SOLICITADO)
        if (analysisData.resultado !== 'normal') {
          // Se houve qualquer mudança, é "Desencadeamento"
          finalData.classificacao = 'desencadeamento';
          toastType = 'warning';
          toastMessage = 'Alerta: Desencadeamento Detectado';
          toastDescription = analysisData.justificativa;
        } else {
          toastMessage = 'Exame salvo. Nenhuma alteração significativa detectada.';
        }
      } else {
        // Se for 'referencia' ou 'reteste', não roda análise
        finalData.resultado_analise = null;
        finalData.justificativa_analise = null;
        toastMessage = `Exame (${mainData.tipo_audiograma}) salvo com sucesso!`;
      }
      
      // 6. Salva no banco de dados
      await createAudiometry(finalData);
      
      // 7. Navega e mostra notificação
      navigate(`/dashboard/${companyId}/funcionarios/${workerId}`);
      
      if (toastType === 'warning') {
        toast.warning(toastMessage, {
          description: toastDescription,
          duration: 8000,
        });
      } else {
        toast.success(toastMessage);
      }

    } catch (error) {
      toast.error('Erro ao salvar o exame.', { description: error.message });
      setIsSubmitting(false); // Libera o botão em caso de erro
    }
    // Em caso de sucesso, a página navega, então não é preciso setar isSubmitting(false)
  };

  // --- FUNÇÕES REMOVIDAS ---
  // handleSaveWithClassification
  // handleFinalSave
  // handleScheduleRetest
  // handleCloseModals

  // Restante do JSX (sem alterações)
  const odAirData = HZ_LABELS.map(label => points[HZ_FREQUENCIES_MAP[label]].od_aerea);
  const oeAirData = HZ_LABELS.map(label => points[HZ_FREQUENCIES_MAP[label]].oe_aerea);
  const odBoneData = HZ_LABELS.map(label => points[HZ_FREQUENCIES_MAP[label]].od_ossea);
  const oeBoneData = HZ_LABELS.map(label => points[HZ_FREQUENCIES_MAP[label]].oe_ossea);
  const inputClass = "mt-1 w-full bg-white border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none";
  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <div>
      {/* --- MODAIS REMOVIDOS --- */}
      
      <Link to={`/dashboard/${companyId}/funcionarios/${workerId}`} className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-800 font-semibold mb-4">
        <FiArrowLeft /> Voltar para os detalhes
      </Link>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Nova Audiometria</h1>
        
        <div className="mb-8"><AudiogramChart {...{odAirData, oeAirData, odBoneData, oeBoneData}} /></div>

        <div className="mb-8 p-4 bg-gray-50 rounded-lg border flex flex-col items-center">
          <p className="font-semibold text-slate-700 mb-4">Selecione a Via de Inserção</p>
          <div className="flex space-x-4">
            <button type="button" onClick={() => setInputMode('aerea')} className={`px-6 py-2 rounded-lg font-semibold transition-colors ${inputMode === 'aerea' ? 'bg-sky-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Via Aérea (O / X)</button>
            <button type="button" onClick={() => setInputMode('ossea')} className={`px-6 py-2 rounded-lg font-semibold transition-colors ${inputMode === 'ossea' ? 'bg-red-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Via Óssea (&lt; / &gt;)</button>
          </div>
        </div>

        <div className="space-y-8 mt-8">
          <section>
            <h2 className="text-lg font-semibold text-slate-700">Dados do Exame</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
              <div>
                <label htmlFor="data_exame" className={labelClass}>Data do Exame</label>
                <input id="data_exame" type="date" name="data_exame" value={mainData.data_exame} onChange={handleMainDataChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Motivo do Exame (PCMSO)</label>
                <CustomSelect value={mainData.motivo_exame} onChange={handleSelectChange('motivo_exame')} options={motivoExameOptions} />
              </div>
              <div>
                <label className={labelClass}>Tipo de Audiograma (PCA)</label>
                <CustomSelect value={mainData.tipo_audiograma} onChange={handleSelectChange('tipo_audiograma')} options={tipoAudiogramaOptions} />
              </div>
              <div>
                <label className={labelClass}>Classificação do Profissional</label>
                <CustomSelect value={mainData.classificacao} onChange={handleSelectChange('classificacao')} options={classificacaoOptions} />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="observacoes" className={labelClass}>Observações</label>
              <textarea id="observacoes" name="observacoes" value={mainData.observacoes} onChange={handleMainDataChange} className={`${inputClass} h-24`} placeholder="Adicione observações sobre o exame, se necessário..."/>
            </div>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-700">Orelha Direita (OD) - dB</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4 mt-4">
              {HZ_LABELS.map((label) => {
                const hz = HZ_FREQUENCIES_MAP[label];
                return (<div key={`od_${hz}`}><label className={labelClass}>{label}</label><input type="number" value={points[hz][`od_${inputMode}`] ?? ''} onChange={handlePointChange(hz, 'od')} className={inputClass} /></div>);
              })}
            </div>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-700">Orelha Esquerda (OE) - dB</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4 mt-4">
              {HZ_LABELS.map((label) => {
                const hz = HZ_FREQUENCIES_MAP[label];
                return (<div key={`oe_${hz}`}><label className={labelClass}>{label}</label><input type="number" value={points[hz][`oe_${inputMode}`] ?? ''} onChange={handlePointChange(hz, 'oe')} className={inputClass} /></div>);
              })}
            </div>
          </section>
        </div>
        <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
          <Link to={`/dashboard/${companyId}/funcionarios/${workerId}`} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg">Cancelar</Link>
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">
            <FiSave />
            {isSubmitting ? 'Analisando...' : 'Analisar e Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}