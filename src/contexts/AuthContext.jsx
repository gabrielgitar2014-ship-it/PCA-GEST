// DENTRO DE: src/contexts/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

// 1. Cria o Contexto
const AuthContext = createContext();

// 2. Cria o Provedor do Contexto, que vai gerenciar o estado
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar a sessão do usuário que já pode existir no navegador
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Erro ao buscar sessão:', error);
      }
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };
    
    getSession();

    // Listener do Supabase: Ele detecta automaticamente quando o usuário
    // faz login, logout ou quando o token é atualizado.
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Função de limpeza: Remove o listener quando o componente não for mais necessário,
    // para evitar vazamentos de memória.
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // O objeto 'value' contém tudo que será compartilhado com os componentes
  // que estiverem dentro deste provedor.
  const value = {
    session,
    user,
    loading,
    
    // Função para fazer login com email e senha
    signInWithEmail: (email, password) => 
      supabase.auth.signInWithPassword({ email, password }),
    
    // Função para fazer logout
    signOut: () => supabase.auth.signOut(),

    // Função para cadastrar um novo usuário, aceitando dados adicionais
    signUp: (email, password, additionalData) => 
      supabase.auth.signUp({ 
        email, 
        password,
        // Os dados adicionais (nome, cpf) são passados para o Supabase aqui
        options: {
          data: additionalData
        }
      }),

    // Função para enviar e-mail de recuperação de senha
    resetPasswordForEmail: (email) => {
      // Usa a origem da URL atual para construir a URL de redirecionamento.
      // Isso funciona tanto para localhost quanto para o site em produção.
      const redirectUrl = window.location.origin + '/update-password';
      return supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
    },

    // Função para atualizar a senha do usuário (quando ele está na página de redefinição)
    // O Supabase lê o token de acesso da URL automaticamente.
    updatePassword: (password) => 
      supabase.auth.updateUser({ password }),
  };

  // Retorna o Provedor com o 'value' definido, envolvendo os componentes filhos (children)
  // para que eles possam acessar o contexto.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Cria um Hook customizado para facilitar o uso do contexto nos componentes
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
