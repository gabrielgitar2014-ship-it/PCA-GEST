// DENTRO DE: src/components/ClassificationActionModal.jsx

import { useState } from 'react';
import CustomSelect from '@/components/CustomSelect';
import { FiInfo, FiSave } from 'react-icons/fi';

const runOMSFallbackClassification = (currentPoints) => {
  const classifyEar = (earPrefix) => {
    const freqs = [
      currentPoints[`${earPrefix}_aerea_500`], currentPoints[`${earPrefix}_aerea_1000`],
      currentPoints[`${earPrefix}_aerea_2000`], currentPoints[`${earPrefix}_aerea_4000`],
    ];
    if (freqs.some(f => f === null || f === undefined)) return "Dados incompletos";
    const average = freqs.reduce((a, b) => a + b, 0) / freqs.length;
    if (average <= 25) return 'Audição Normal';
    if (average <= 40) return 'Grau Leve';
    if (average <= 60) return 'Grau Moderado';
    if (average <= 80) return 'Grau Severo';
    return 'Grau Profundo';
  };
  return { od: classifyEar('od'), oe: classifyEar('oe') };
};

export default function ClassificationActionModal({ result, onSave, onClose }) {
  if (!result || result.analysisData.resultado !== 'mudanca_unilateral') {
    return null; // Este modal só abre para casos unilaterais
  }

  const { justificativa } = result.analysisData;
  const { previousExam, submissionData } = result;

  const [classificacao, setClassificacao] = useState(result.submissionData.classificacao);
  const [isSaving, setIsSaving] = useState(false);
  
  const omsClassification = runOMSFallbackClassification(submissionData);

  const getDisplayClassification = (currentClassification) => {
    if (currentClassification !== 'Audição Normal') return { text: currentClassification, isHistoric: false };
    const previousStatus = previousExam?.classificacao || previousExam?.resultado_analise;
    if (previousStatus && previousStatus !== 'normal') return { text: `Mantém (${previousStatus.replace(/_/g, ' ')})`, isHistoric: true };
    return { text: currentClassification, isHistoric: false };
  };

  omsClassification.od = getDisplayClassification(omsClassification.od);
  omsClassification.oe = getDisplayClassification(omsClassification.oe);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave({ classificacao, tornarReferencia: false }); // Unilateral não vira referência por padrão
    setIsSaving(false);
  };

  const classificacaoOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'desencadeamento', label: 'Desencadeamento' },
    { value: 'agravamento', label: 'Agravamento' },
  ];

  return (
    <div className="fixed inset-0 bg- bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="flex items-center gap-4 mb-4">
          <FiInfo className="h-12 w-12 text-blue-500 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Alerta de Mudança Unilateral</h2>
            <p className="text-lg font-semibold text-slate-600">Requer Classificação do Profissional</p>
          </div>
        </div>
        <p className="text-slate-700 mb-4 text-sm">{justificativa}</p>
        
        <div className="mb-4 p-4 bg-gray-50 border rounded-lg">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Classificação Clínica (OMS) do Exame Atual:</h4>
          <div className="flex justify-around text-center">
            <div>
              <p className="text-xs text-gray-500">Orelha Direita</p>
              <p className={`font-bold capitalize ${omsClassification.od.isHistoric ? 'text-gray-500' : 'text-gray-800'}`}>{omsClassification.od.text}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Orelha Esquerda</p>
              <p className={`font-bold capitalize ${omsClassification.oe.isHistoric ? 'text-gray-500' : 'text-gray-800'}`}>{omsClassification.oe.text}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Definir Classificação Final</label>
            <CustomSelect value={classificacao} onChange={setClassificacao} options={classificacaoOptions} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row-reverse gap-3">
          <button onClick={handleSave} disabled={isSaving} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">
            <FiSave />
            {isSaving ? 'Salvando...' : 'Confirmar e Salvar'}
          </button>
          <button onClick={onClose} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg">Cancelar</button>
        </div>
      </div>
    </div>
  );
}