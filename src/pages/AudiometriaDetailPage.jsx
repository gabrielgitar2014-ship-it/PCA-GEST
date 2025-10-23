// DENTRO DE: src/pages/AudiometriaDetailPage.jsx

import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import AudiogramChart from '@/components/AudiogramChart';
import { Loader, ArrowLeft } from 'lucide-react';

// Componente auxiliar para exibir um item de detalhe
const DetailItem = ({ label, value, className = '' }) => (
  <div className={`p-4 bg-gray-50 rounded-lg border ${className}`}>
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
    <p className="text-base font-medium text-slate-800 capitalize mt-1">{value || '---'}</p>
  </div>
);

export default function AudiometriaDetailPage() {
  const { companyId, workerId, examId } = useParams();
  const { selectedExam, isExamDetailLoading, fetchAudiometryById } = useData();

  useEffect(() => {
    if (examId) {
      fetchAudiometryById(examId);
    }
  }, [examId, fetchAudiometryById]);

  if (isExamDetailLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="animate-spin text-4xl text-sky-500" />
      </div>
    );
  }

  if (!selectedExam) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold">Exame não encontrado</h2>
        <p className="text-gray-600">Não foi possível carregar os detalhes desta audiometria.</p>
        <Link to={`/dashboard/${companyId}/funcionarios/${workerId}`} className="mt-4 inline-block text-sky-600 font-semibold">
          Voltar para o funcionário
        </Link>
      </div>
    );
  }
  
  // Prepara os dados para o gráfico
  const freqs = [250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
  const odAirData = freqs.map(hz => selectedExam[`od_aerea_${hz}`]);
  const oeAirData = freqs.map(hz => selectedExam[`oe_aerea_${hz}`]);
  const odBoneData = freqs.map(hz => selectedExam[`od_ossea_${hz}`]);
  const oeBoneData = freqs.map(hz => selectedExam[`oe_ossea_${hz}`]);

  return (
    <div>
      <Link to={`/dashboard/${companyId}/funcionarios/${workerId}`} className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-800 font-semibold mb-4">
        <ArrowLeft size={16} /> Voltar para o perfil do funcionário
      </Link>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="border-b pb-4 mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Detalhes da Audiometria</h1>
            <p className="text-gray-600">
                Funcionário: <span className="font-semibold">{selectedExam.trabalhador.nome}</span>
            </p>
        </div>
        
        {/* ✅ NOVO LAYOUT: Gráfico em cima, detalhes em baixo */}

        {/* 1. Secção do Gráfico */}
        <div className="mb-8">
          <AudiogramChart {...{odAirData, oeAirData, odBoneData, oeBoneData}} />
        </div>

        {/* 2. Secção de Detalhes */}
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DetailItem label="Data do Exame" value={new Date(selectedExam.data_exame).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} />
                <DetailItem label="Motivo (PCMSO)" value={selectedExam.motivo_exame.replace('_', ' ')} />
                <DetailItem label="Tipo (PCA)" value={selectedExam.tipo_audiograma} />
                <DetailItem label="Profissional" value={selectedExam.profissional?.nome} />
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <DetailItem label="Classificação" value={selectedExam.classificacao} />
                <DetailItem label="Análise Automática" value={selectedExam.resultado_analise} />
                <DetailItem label="Justificativa da Análise" value={selectedExam.justificativa_analise} />
            </div>
            
            <DetailItem 
                label="Observações" 
                value={selectedExam.observacoes || 'Nenhuma observação registrada.'} 
                className="col-span-full" // Garante que o campo de observações ocupe a largura total
            />
        </div>
      </div>
    </div>
  );
}