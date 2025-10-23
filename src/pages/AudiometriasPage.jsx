import { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { FiFileText, FiLoader } from 'react-icons/fi';
import { useParams, Link } from 'react-router-dom';

// Componente para o Card de Resumo
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center">
    <div className="bg-sky-100 text-sky-600 p-3 rounded-full mr-4">
      {icon}
    </div>
    <div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

// Componente para um Item da Lista de Audiometrias
const AudiometriaListItem = ({ exame }) => {
  const { companyId } = useParams();
  
  // Formata a data para o padrão brasileiro
  const formattedDate = new Date(exame.data_exame).toLocaleDateString('pt-BR', {
    timeZone: 'UTC' // Importante para evitar problemas de fuso horário
  });

  return (
    <Link 
      to={`/dashboard/${companyId}/funcionarios/${exame.trabalhador_id}/audiometrias/${exame.id}`}
      className="block bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-sky-500 transition-all duration-200"
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-slate-800">{exame.trabalhadores?.nome || 'Trabalhador não encontrado'}</p>
          <p className="text-sm text-gray-500">
            Exame {exame.motivo_exame} realizado em {formattedDate}
          </p>
        </div>
        <div className="text-right">
           <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
             exame.classificacao === 'normal' ? 'bg-green-100 text-green-800' :
             exame.classificacao === 'agravamento' ? 'bg-red-100 text-red-800' :
             'bg-yellow-100 text-yellow-800'
           }`}>
             {exame.classificacao || 'N/A'}
           </span>
          <p className="text-xs text-gray-400 mt-1">{exame.tipo_audiograma}</p>
        </div>
      </div>
    </Link>
  );
};

export default function AudiometriasPage() {
  // Busca os dados e funções do DataContext
  const { audiometrias, totalAudiometrias, areAudiometriasLoading, fetchAudiometrias } = useData();
  const { companyId } = useParams();

  // Efeito para buscar os dados quando a página é carregada
  useEffect(() => {
    if (companyId) {
      fetchAudiometrias(companyId);
    }
  }, [companyId, fetchAudiometrias]);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">Central de Audiometrias</h1>
      
      {/* Seção de Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total de Audiometrias"
          value={areAudiometriasLoading ? <FiLoader className="animate-spin" /> : totalAudiometrias}
          icon={<FiFileText size={24} />}
        />
        {/* Outros cards podem ser adicionados aqui */}
      </div>

      {/* Seção da Lista de Audiometrias */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Todos os Exames</h2>
        
        {areAudiometriasLoading ? (
          <div className="flex justify-center items-center p-8">
            <FiLoader className="animate-spin text-sky-600 h-8 w-8" />
            <p className="ml-4 text-gray-500">Carregando audiometrias...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* CORREÇÃO APLICADA AQUI: 
              'audiometrias.length' foi trocado por 'audiometrias?.length'
              O '?' (optional chaining) previne o erro caso 'audiometrias' seja undefined.
            */}
            {audiometrias?.length > 0 ? (
              audiometrias.map(exame => (
                <AudiometriaListItem key={exame.id} exame={exame} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">Nenhuma audiometria encontrada.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}