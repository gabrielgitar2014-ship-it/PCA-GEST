// DENTRO DE: src/contexts/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Ajuste o caminho se necessário
import { useNavigate, useLocation } from 'react-router-dom'; // Importa useNavigate e useLocation

// 1. Cria o Contexto
const AuthContext = createContext();

// 2. Cria o Provedor do Contexto
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // Carregamento inicial (sessão + licença)
  const [isLicenseValid, setIsLicenseValid] = useState(null); // null: Verificando, true: Válida, false: Inválida/Não encontrada
  const navigate = useNavigate();
  const location = useLocation(); // Para saber de onde o usuário veio

  useEffect(() => {
    // Função unificada para verificar sessão E licença
    const checkSessionAndLicense = async (currentSession) => {
      console.log("[AuthContext] Verificando sessão e licença...");
      setLoading(true); // ✅ CORRIGIDO: Usa setLoading
      setIsLicenseValid(null); // Reseta o estado da licença

      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      setSession(currentSession);

      if (currentUser) {
        console.log(`[AuthContext] Usuário ${currentUser.id} autenticado. Verificando licença...`);
        try {
          const { data: isActive, error: rpcError } = await supabase.rpc('is_license_active');

          if (rpcError) {
            console.error("[AuthContext] Erro RPC is_license_active:", rpcError);
            setIsLicenseValid(false);
             await supabase.auth.signOut(); 
             setUser(null);
             setSession(null);
          } else {
            console.log("[AuthContext] Licença ativa:", isActive);
            setIsLicenseValid(isActive);
          }
        } catch (err) {
          console.error("[AuthContext] Erro inesperado ao verificar licença:", err);
          setIsLicenseValid(false);
           await supabase.auth.signOut(); 
           setUser(null);
           setSession(null);
        }
      } else {
        console.log("[AuthContext] Nenhum usuário logado.");
        setIsLicenseValid(false); 
      }
      setLoading(false); // Finaliza o loading APÓS todas as verificações
    };

    // Verifica a sessão inicial
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      checkSessionAndLicense(initialSession);

      // Listener para mudanças de autenticação
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, changedSession) => {
          console.log("[AuthContext] Evento onAuthStateChange:", _event);
          checkSessionAndLicense(changedSession);
        }
      );

      // Limpeza do listener
      return () => {
        subscription?.unsubscribe();
      };
    });

  }, [navigate]); // Adiciona navigate como dependência

  const value = {
    session,
    user,
    loading,
    isLicenseValid, 

    signInWithEmail: (email, password) =>
      supabase.auth.signInWithPassword({ email, password }),

    signOut: async () => {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsLicenseValid(false); 
    },

    signUp: (email, password, additionalData) =>
      supabase.auth.signUp({
        email,
        password,
        options: {
          data: additionalData
        }
      }),

    resetPasswordForEmail: (email) => {
      const redirectUrl = window.location.origin + '/update-password';
      return supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
    },

    updatePassword: (password) =>
      supabase.auth.updateUser({ password }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Hook customizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}