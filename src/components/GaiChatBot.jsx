// src/components/GaiChatbot.jsx

import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom'; // Importa useParams
import { Bot, X, Expand } from 'lucide-react'; // Ícones para o header
import GaiChatCore from './GaiChatCore'; // Importa o núcleo reutilizável

export default function GaiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { companyId } = useParams(); // Pega o companyId da URL atual

  // Define a rota da página dedicada DINAMICAMENTE usando o companyId
  const chatPageRoute = `/dashboard/${companyId}/gai-chat`;

  // Verifica se estamos na página dedicada para ocultar o botão flutuante
  const isChatPageActive = location.pathname.startsWith(chatPageRoute);

  // Função chamada pelo botão Expandir
  const handleExpand = () => {
    setIsOpen(false); // Fecha o modal flutuante
    navigate(chatPageRoute); // Navega para a página dedicada COM o companyId
  };

  // Oculta completamente o componente flutuante se estivermos na página dedicada
  if (isChatPageActive || !companyId) { // Também oculta se não houver companyId (ex: na seleção de empresa)
    return null;
  }

  return (
    <>
      {/* O Botão Flutuante (só aparece se não estiver aberto e não estiver na página dedicada) */}
      {!isOpen && !isChatPageActive && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-slate-800 text-white p-4 rounded-full shadow-lg hover:bg-slate-700 transition-transform hover:scale-110 z-40"
          aria-label="Abrir assistente G.A.I."
        >
          <Bot size={28} />
        </button>
      )}

      {/* A Janela do Chat (Modal Flutuante) */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[440px] h-[600px] bg-gray-100 rounded-lg shadow-2xl border border-gray-300 z-50 flex flex-col">

          {/* Header com botão Expandir e Fechar */}
          <div className="bg-slate-800 text-white p-4 rounded-t-lg flex justify-between items-center">
            {/* Título */}
            <div>
              <h3 className="font-bold text-lg">G.A.I.A</h3>
              <p className="text-xs text-slate-300">Geração Automatica de Informação Audiologica</p>
            </div>
            {/* Container dos botões */}
            <div className='flex items-center gap-2'>
                {/* Botão para expandir para a página */}
                <button
                    onClick={handleExpand}
                    className="p-1 rounded-full hover:bg-slate-700"
                    title="Abrir em página inteira"
                 >
                    <Expand size={18} /> {/* Ícone de Expandir */}
                </button>
                {/* Botão para fechar o modal flutuante */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-full hover:bg-slate-700"
                    title="Fechar chat"
                >
                    <X size={20} />
                </button>
            </div>
          </div>

          {/* Corpo do Chat usa o Componente Core */}
          {/* Passamos isPage={false} para indicar que é o modal flutuante */}
          {/* O GaiChatCore busca o histórico e envia o userId */}
          <GaiChatCore isPage={false} />

        </div>
      )}
    </>
  );
}