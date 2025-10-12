// DENTRO DE: src/pages/AudiometriaCreatePage.jsx

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import AudiogramChart from '@/components/AudiogramChart';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

// Mapeamento centralizado das frequências para consistência
const HZ_FREQUENCIES_MAP = {
  '250': '250', '500': '500', '750': '750',
  '1k': '1000', '1.5k': '1500', '2k': '2000',
  '3k': '3000', '4k': '4000', '6k': '6000', '8k': '8000'
};
// Lista de rótulos para usar na UI
const HZ_LABELS = Object.keys(HZ_FREQUENCIES_MAP);

// Função para criar o estado inicial dos pontos do audiograma
const createInitialPointsState = () => {
  const state = {};
  Object.values(HZ_FREQUENCIES_MAP).forEach(hz => {
    state[hz] = { od_aerea: null, oe_aerea: null, od_ossea: null, oe_ossea: null };
  });
  return state;
};

export default function AudiometriaCreatePage() {
  const { companyId, workerId } = useParams();
  const navigate = useNavigate();
  const { createAudiometry } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputMode, setInputMode] = useState('aerea'); // 'aerea' ou 'ossea'

  // Estado para os dados principais do exame
  const [mainData, setMainData] = useState({
    data_exame: new Date().toISOString().split('T')[0],
    tipo_exame: 'sequencial',
    classificacao: 'normal',
    observacoes: '',
  });
  
  // Estado reestruturado para os pontos do audiograma
  const [points, setPoints] = useState(createInitialPointsState());

  // Handler para os inputs principais (data, tipo, etc.)
  const handleMainDataChange = (e) => {
    const { name, value } = e.target;
    setMainData(p => ({ ...p, [name]: value }));
  };
  
  // Handler para os inputs de frequência (dB)
  const handlePointChange = (frequencia, orelha) => (e) => {
    const { value } = e.target;
    const valor_db = value === '' ? null : parseInt(value, 10);
    const via = inputMode; // 'aerea' ou 'ossea'
    const key = `${orelha}_${via}`; // ex: 'od_aerea'

    setPoints(prevPoints => ({
      ...prevPoints,
      [frequencia]: {
        ...prevPoints[frequencia],
        [key]: valor_db
      }
    }));
  };

  // Handler para o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Transforma o estado dos pontos no formato de lista que o DataContext espera
    const pointsData = [];
    for (const hzValue of Object.values(HZ_FREQUENCIES_MAP)) {
      const pointGroup = points[hzValue];
      // Adiciona um ponto à lista apenas se ele tiver um valor preenchido
      if (pointGroup.od_aerea !== null) pointsData.push({ orelha: 'direita', via: 'aerea', frequencia: hzValue, valor_db: pointGroup.od_aerea });
      if (pointGroup.oe_aerea !== null) pointsData.push({ orelha: 'esquerda', via: 'aerea', frequencia: hzValue, valor_db: pointGroup.oe_aerea });
      if (pointGroup.od_ossea !== null) pointsData.push({ orelha: 'direita', via: 'ossea', frequencia: hzValue, valor_db: pointGroup.od_ossea });
      if (pointGroup.oe_ossea !== null) pointsData.push({ orelha: 'esquerda', via: 'ossea', frequencia: hzValue, valor_db: pointGroup.oe_ossea });
    }

    try {
      // Envia os dados principais e a lista de pontos para o DataContext
      await createAudiometry({ ...mainData, trabalhador_id: workerId }, pointsData);
      navigate(`/dashboard/${companyId}/funcionarios/${workerId}`);
    } catch (error) {
      alert("Erro ao salvar audiometria. Verifique os dados.");
      setIsSubmitting(false);
    }
  };
  
  // Prepara os dados para passar ao componente do gráfico
  const odAirData = HZ_LABELS.map(label => points[HZ_FREQUENCIES_MAP[label]].od_aerea);
  const oeAirData = HZ_LABELS.map(label => points[HZ_FREQUENCIES_MAP[label]].oe_aerea);
  const odBoneData = HZ_LABELS.map(label => points[HZ_FREQUENCIES_MAP[label]].od_ossea);
  const oeBoneData = HZ_LABELS.map(label => points[HZ_FREQUENCIES_MAP[label]].oe_ossea);

  const inputClass = "mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none";
  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <div>
      <Link to={`/dashboard/${companyId}/funcionarios/${workerId}`} className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-800 font-semibold mb-4">
        <FiArrowLeft /> Voltar para os detalhes
      </Link>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Nova Audiometria</h1>
        
        <div className="mb-8">
          <AudiogramChart odAirData={odAirData} oeAirData={oeAirData} odBoneData={odBoneData} oeBoneData={oeBoneData} />
        </div>
        
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border flex flex-col items-center">
          <p className="font-semibold text-slate-700 mb-4">Selecione a Via de Inserção</p>
          <div className="flex space-x-4">
            <button type="button" onClick={() => setInputMode('aerea')} className={`px-6 py-2 rounded-lg font-semibold transition-colors ${inputMode === 'aerea' ? 'bg-sky-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              Via Aérea (O / X)
            </button>
            <button type="button" onClick={() => setInputMode('ossea')} className={`px-6 py-2 rounded-lg font-semibold transition-colors ${inputMode === 'ossea' ? 'bg-red-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              Via Óssea (&lt; / &gt;)
            </button>
          </div>
        </div>

        <div className="space-y-8 mt-8">
          <section>
            <h2 className="text-lg font-semibold text-slate-700">Dados do Exame</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div>
                <label className={labelClass}>Data do Exame</label>
                <input type="date" name="data_exame" value={mainData.data_exame} onChange={handleMainDataChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Tipo do Exame</label>
                <select name="tipo_exame" value={mainData.tipo_exame} onChange={handleMainDataChange} className={inputClass}>
                  <option value="sequencial">Sequencial</option>
                  <option value="referencia">Referência</option>
                  <option value="demissional">Demissional</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Classificação</label>
                <select name="classificacao" value={mainData.classificacao} onChange={handleMainDataChange} className={inputClass}>
                  <option value="normal">Normal</option>
                  <option value="desencadeamento">Desencadeamento</option>
                  <option value="agravamento">Agravamento</option>
                </select>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-700">Orelha Direita (OD) - dB</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4 mt-4">
              {HZ_LABELS.map((label) => {
                const hz = HZ_FREQUENCIES_MAP[label];
                const key = `od_${inputMode}`;
                return (
                  <div key={`od_${hz}`}>
                    <label className={labelClass}>{label}</label>
                    <input type="number" value={points[hz][key] ?? ''} onChange={handlePointChange(hz, 'od')} className={inputClass} />
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-700">Orelha Esquerda (OE) - dB</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4 mt-4">
              {HZ_LABELS.map((label) => {
                const hz = HZ_FREQUENCIES_MAP[label];
                const key = `oe_${inputMode}`;
                return (
                  <div key={`oe_${hz}`}>
                    <label className={labelClass}>{label}</label>
                    <input type="number" value={points[hz][key] ?? ''} onChange={handlePointChange(hz, 'oe')} className={inputClass} />
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
          <Link to={`/dashboard/${companyId}/funcionarios/${workerId}`} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg">Cancelar</Link>
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">
            <FiSave />
            {isSubmitting ? 'Salvando...' : 'Salvar Audiometria'}
          </button>
        </div>
      </form>
    </div>
  );
}