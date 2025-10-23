// DENTRO DE: src/components/ImmediateClassificationDisplay.jsx

import { FiInfo } from 'react-icons/fi';

const ClassificationInfo = ({ ear, classification }) => {
  if (!classification) {
    return (
      <div>
        <h4 className="font-semibold text-gray-700">{ear}</h4>
        <p className="text-sm text-gray-400">Aguardando dados...</p>
      </div>
    );
  }

  let color = 'text-green-600'; // Normal
  if (classification.includes('Leve')) color = 'text-yellow-600';
  if (classification.includes('Moderado')) color = 'text-orange-600';
  if (classification.includes('Severo')) color = 'text-red-600';
  if (classification.includes('Profundo')) color = 'text-red-800';

  return (
    <div>
      <h4 className="font-semibold text-gray-700">{ear}</h4>
      <p className={`text-lg font-bold ${color}`}>{classification}</p>
    </div>
  );
};

export default function ImmediateClassificationDisplay({ classificationResult }) {
  if (!classificationResult) return null;

  return (
    <div className="my-8 p-4 bg-sky-50 border-l-4 border-sky-400 rounded-r-lg">
      <div className="flex items-start gap-3">
        <FiInfo className="h-5 w-5 text-sky-500 mt-0.5" aria-hidden="true" />
        <div>
          <h3 className="text-lg font-semibold text-sky-800">Classificação Clínica (OMS)</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ClassificationInfo ear="Orelha Direita" classification={classificationResult.od} />
            <ClassificationInfo ear="Orelha Esquerda" classification={classificationResult.oe} />
          </div>
        </div>
      </div>
    </div>
  );
}