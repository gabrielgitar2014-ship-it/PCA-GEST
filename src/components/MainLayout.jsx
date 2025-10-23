// DENTRO DE: src/components/MainLayout.jsx

import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// Componentes do Layout
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import GaiChatbot from '@/components/GaiChatbot'; 

// Dependências para Realtime e Notificações
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast, Toaster } from 'sonner'; // ✅ 1. IMPORTADO O <Toaster />

// Componente Backdrop (Sem alterações)
const Backdrop = ({ onClick }) => (
  <div
    onClick={onClick}
    className="
      fixed inset-0 bg-black/30 z-10 
      md:hidden 
      transition-opacity duration-300 ease-in-out
    "
    aria-hidden="true"
  />
);

// Lógica de persistência do Sidebar (Sem alterações)
const isDesktop = () => window.innerWidth >= 768;
const getInitialSidebarState = () => {
  const storedState = localStorage.getItem('sidebarOpen');
  if (storedState !== null) {
    return JSON.parse(storedState);
  }
  return isDesktop(); 
};

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(getInitialSidebarState);
  const { user, logout } = useAuth();

  // --- LÓGICA DO SUPABASE REALTIME (Sem alterações) ---
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`licenca_usuario_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'manager',
          table: 'licencas',
          filter: `usuario_ativador_id=eq.${user.id}`
        },
        (payload) => {
          const newStatus = payload.new?.status;
          const oldStatus = payload.old?.status;
          if (newStatus === 'suspensa' && oldStatus !== 'suspensa') {
            toast.error('Sua licença foi suspensa. Você será desconectado em breve.', {
              duration: 8000,
              important: true,
            });
            setTimeout(() => {
              if (logout && typeof logout === 'function') {
                logout();
              } else {
                 supabase.auth.signOut().then(() => window.location.reload());
              }
            }, 8500);
          } 
          else if (newStatus === 'ativada' && oldStatus === 'suspensa') {
             toast.success('Sua licença foi reativada pelo administrador.');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, logout, supabase]);
  // --- FIM: LÓGICA DO SUPABASE REALTIME ---

  // Efeito para salvar preferência do Sidebar (Sem alterações)
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);
  
  return (
    <>
      {/* ✅ 2. ADICIONADO O RENDERIZADOR DE NOTIFICAÇÕES */}
      {/* Ele flutua sobre todo o app e renderiza as chamadas 'toast.success', 'toast.error' etc. */}
      <Toaster richColors position="top-right" /> 

      {/* Filho 1: O Sidebar (z-20) */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Backdrop (z-10) */}
      {isSidebarOpen && <Backdrop onClick={() => setIsSidebarOpen(false)} />}

      {/* Filho 2: A Área de Conteúdo */}
      <div 
        className={`
          transition-all duration-300 ease-in-out
          min-h-screen bg-gray-50
          ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}
        `}
      >
        <Header setIsOpen={setIsSidebarOpen} />

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* O Chatbot G.A.I. */}
      <GaiChatbot />
    </>
  );
}

export default MainLayout;