// src/components/GaiChatCore.jsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Loader2, User, Bot, ArrowDownLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/contexts/AuthContext';

// --- Componentes Avatar e MessageBubble (definições completas) ---
const Avatar = ({ role }) => {
  const Icon = role === 'user' ? User : Bot;
  const bg = role === 'user' ? 'bg-sky-600' : 'bg-slate-700';
  return (
    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${bg} text-white flex items-center justify-center`}>
      <Icon size={18} />
    </div>
  );
};

const MessageBubble = ({ message }) => {
  const { role, content } = message;
  const isGai = role === 'gai';
  // Estilos Markdown (definição completa)
  const markdownStyles = {
    h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4" {...props} />,
    p: ({ node, ...props }) => <p className="mb-2" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2" {...props} />,
    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
    strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
  };
  return (
    <div className={`flex gap-3 my-4 ${isGai ? '' : 'justify-end'}`}>
      {isGai && <Avatar role="gai" />}
      <div className={`p-4 rounded-lg ${isGai ? 'bg-white text-gray-800 shadow-sm border max-w-full' : 'bg-sky-600 text-white max-w-lg'}`}>
        {isGai ? ( <ReactMarkdown components={markdownStyles}>{content}</ReactMarkdown> ) : ( content )}
      </div>
      {!isGai && <Avatar role="user" />}
    </div>
  );
};
// --- Fim dos componentes copiados ---


// O núcleo reutilizável do chat
export default function GaiChatCore({ isPage = false }) {
  const [isLoading, setIsLoading] = useState(false); // Loading ao enviar msg
  const [isHistoryLoading, setIsHistoryLoading] = useState(true); // Loading inicial do histórico
  const [currentQuery, setCurrentQuery] = useState('');
  const [messages, setMessages] = useState([]); // Começa vazio

  const { companyId, workerId } = useParams();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null); // Ref para o container das mensagens
  const navigate = useNavigate();

  // Rola para a última mensagem de forma mais robusta
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // Função para buscar histórico recente (definição completa)
  const fetchHistory = useCallback(async () => {
    if (!user || !companyId) {
      setMessages([{ role: 'gai', content: 'Olá! Faça login e selecione uma empresa para começar.' }]);
      setIsHistoryLoading(false);
      return;
    }
    setIsHistoryLoading(true);
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    try {
      const { data, error } = await supabase
        .from('gai_conversations')
        .select('role, content')
        .eq('user_id', user.id)
        .eq('company_id', companyId)
        .gte('created_at', thirtyMinutesAgo)
        .order('created_at', { ascending: true });
      if (error) throw error;

      const initialMessages = data.length > 0
        ? data.map(msg => ({ role: msg.role === 'model' ? 'gaia' : 'user', content: msg.content }))
        : [{ role: 'gai', content: 'Olá! Sou a G.A.I.A, sou sua assistente de gerenciamento. Como posso ajudar?' }]; // Mensagem padrão
      setMessages(initialMessages);

    } catch (error) {
      console.error("Erro ao buscar histórico do chat:", error.message);
      setMessages([{ role: 'gai', content: 'Erro ao carregar o histórico recente.' }]);
    } finally {
      setIsHistoryLoading(false);
    }
  }, [user, companyId]);

  // useEffect para buscar o histórico (sem alterações)
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Função handleSendQuery (definição completa)
  const handleSendQuery = async (e) => {
    e.preventDefault();
    if (isLoading || isHistoryLoading || !currentQuery.trim() || !user) return;
    const userQuery = currentQuery;
    setMessages((prev) => [...prev, { role: 'user', content: userQuery }]);
    setCurrentQuery('');
    setIsLoading(true); // Ativa loading da resposta
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Sessão não encontrada.');
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ask-gai`;
      const payload = { query: userQuery, companyId, workerId: workerId || null, userId: user.id };
      console.log('Enviando para G.A.I. (ask-gai) com fetch:', JSON.stringify(payload, null, 2));
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}`, 'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.error || `Erro HTTP: ${response.status}`);
      setMessages((prev) => [...prev, { role: 'gai', content: responseData.reply }]);
    } catch (error) {
       setMessages((prev) => [...prev, {
        role: 'gai',
        content: `Desculpe, ocorreu um erro: ${error.message}`
      }]);
     }
    finally { setIsLoading(false); } // Desativa loading da resposta
  };

  // Botão Minimizar (sem alterações)
  const handleMinimize = () => navigate(-1);

  return (
    // Container Principal com overflow-hidden
    <div className={`flex flex-col ${isPage ? 'h-full' : 'h-[600px]'} overflow-hidden`}>
       {/* Header da Página (se aplicável) */}
       {isPage && (
         <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
             <h1 className="text-xl font-bold text-slate-800">G.A.I.A - Chat Expandido</h1>
             <button
                onClick={handleMinimize}
                className="flex items-center gap-1 text-sm text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                title="Voltar ao chat flutuante"
             >
                <ArrowDownLeft size={16} /> Minimizar
             </button>
         </div>
       )}

      {/* Área de Mensagens com flex-1 e overflow-auto */}
      <div
        ref={chatContainerRef} // Adiciona ref ao container scrollável
        className={`flex-1 p-4 overflow-y-auto ${isPage ? 'bg-gray-50' : 'bg-gray-100'}`}
      >
        {/* Renderização Condicional Corrigida */}
        {isHistoryLoading ? (
             <div className="flex justify-center items-center h-full">
                 <Loader2 className="animate-spin text-sky-500" size={24}/>
             </div>
        ) : (
            messages.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))
        )}
        {/* Ref para scroll fica no final */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input com flex-shrink-0 */}
      <form onSubmit={handleSendQuery} className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={currentQuery}
            onChange={(e) => setCurrentQuery(e.target.value)}
            placeholder="Pergunte sobre um trabalhador..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            disabled={isLoading || isHistoryLoading} // Desabilita input durante qualquer loading
          />
          <button
            type="submit"
            className="bg-sky-600 text-white p-2 rounded-lg disabled:opacity-50"
            disabled={isLoading || isHistoryLoading} // Desabilita botão durante qualquer loading
          >
            {/* Mostra loader se estiver carregando histórico OU esperando resposta */}
            {(isLoading || isHistoryLoading) ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </form>
    </div>
  );
}