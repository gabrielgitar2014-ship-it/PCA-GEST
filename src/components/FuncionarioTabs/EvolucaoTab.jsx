// DENTRO DE: src/components/FuncionarioTabs/EvolucaoTab.jsx

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { FiLoader } from 'react-icons/fi';

export default function EvolucaoTab() {
  const { workerId } = useParams();
  const { workerEvolutions, areEvolutionsLoading, createEvolution } = useData();
  
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newNote.trim() === '') return;
    
    setIsSubmitting(true);
    const { error } = await createEvolution({
      conteudo: newNote,
      trabalhador_id: workerId,
    });

    if (error) {
      alert("Não foi possível salvar a anotação.");
    } else {
      setNewNote(''); // Limpa o campo após o sucesso
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white p-8 rounded-b-lg shadow-sm border border-t-0 border-gray-200">
      {/* Formulário para Nova Anotação */}
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Nova Anotação de Evolução</h2>
        <textarea 
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
            placeholder="Digite aqui as anotações sobre a evolução do funcionário..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
        />
        <div className="flex justify-end mt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Anotação'}
            </button>
        </div>
      </form>

      {/* Histórico de Anotações */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-slate-700 border-b pb-3 mb-4">Histórico</h2>
        {areEvolutionsLoading ? (
          <div className="text-center p-8"><FiLoader className="animate-spin text-2xl text-sky-500 mx-auto" /></div>
        ) : (
          <div className="space-y-6">
            {workerEvolutions.length > 0 ? (
              workerEvolutions.map(note => (
                <div key={note.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-wrap">{note.conteudo}</p>
                  <p className="text-xs text-gray-400 mt-3 text-right">
                    Criado por {note.author?.nome || 'Usuário desconhecido'} em {new Date(note.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Nenhuma anotação de evolução encontrada.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}