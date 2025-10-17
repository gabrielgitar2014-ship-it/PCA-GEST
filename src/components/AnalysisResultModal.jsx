// DENTRO DE: src/components/AnalysisResultModal.jsx

import { useState } from 'react';
import CustomSelect from '@/components/CustomSelect';
import { FiAlertTriangle, FiSave, FiCalendar } from 'react-icons/fi';

export default function AnalysisResultModal({ result, onSave, onScheduleRetest, onClose }) {
  if (!result || result.analysisData.resultado !== 'agravamento_bilateral') {
    return null; // Este modal só abre para casos bilaterais
  }

  const { justificativa } = result.analysisData;

  const [classificacao, setClassificacao] = useState('agravamento');
  const [tornarReferencia, setTornarReferencia] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave({ classificacao, tornarReferencia });
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
          <FiAlertTriangle className="h-12 w-12 text-yellow-500 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Agravamento Bilateral Detectado</h2>
            <p className="text-lg font-semibold text-slate-600">Ação do Profissional Requerida</p>
          </div>
        </div>
        <p className="text-slate-700 mb-6 text-sm">{justificativa}</p>
        
        <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg border">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Definir Classificação Final</label>
            <CustomSelect 
              value={classificacao}
              onChange={setClassificacao}
              options={classificacaoOptions}
            />
          </div>
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input id="tornar-referencia" type="checkbox" checked={tornarReferencia} onChange={(e) => setTornarReferencia(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600" />
            </div>
            <div className="ml-3 text-sm leading-6">
              <label htmlFor="tornar-referencia" className="font-medium text-gray-900">Tornar este o novo Exame de Referência</label>
              <p className="text-gray-500">Recomendado pela NR-7.</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={handleSave} disabled={isSaving} className="w-full flex justify-center items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">
            <FiSave />
            {isSaving ? 'Salvando...' : 'Confirmar e Salvar'}
          </button>
          <button onClick={onScheduleRetest} className="w-full flex justify-center items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg">
            <FiCalendar />
            Agendar Reteste em 30 dias
          </button>
          <button onClick={onClose} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}