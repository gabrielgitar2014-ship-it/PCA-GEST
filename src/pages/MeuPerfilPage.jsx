// DENTRO DE: src/pages/MeuPerfilPage.jsx

import { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { supabase } from '@/lib/supabaseClient';
import { FiLoader, FiSave } from 'react-icons/fi';

export default function MeuPerfilPage() {
  const { fetchUserProfile, updateUserProfile } = useData();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Estados para a troca de senha
  const [currentPassword, setCurrentPassword] = useState(''); // ✅ NOVO ESTADO: Senha Atual
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      const data = await fetchUserProfile();
      setProfile(data);
      setIsLoading(false);
    };
    loadProfile();
  }, [fetchUserProfile]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { nome, cpf, telefone, conselho_classe, numero_conselho } = profile;
      await updateUserProfile({ nome, cpf, telefone, conselho_classe, numero_conselho });
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar o perfil. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // ✅ LÓGICA DE ALTERAÇÃO DE SENHA ATUALIZADA
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentPassword || !password || !confirmPassword) {
      alert('Por favor, preencha todos os campos de senha.');
      return;
    }
    if (password !== confirmPassword) {
      alert('As novas senhas não coincidem!');
      return;
    }
    if (password.length < 6) {
      alert('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    
    setIsSavingPassword(true);

    // 1. Tenta autenticar com a senha atual para validar
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password: currentPassword,
    });

    if (signInError) {
      alert('A sua senha atual está incorreta. Verifique e tente novamente.');
      setIsSavingPassword(false);
      return;
    }
    
    // 2. Se a senha atual estiver correta, atualiza para a nova
    const { error: updateError } = await supabase.auth.updateUser({ password: password });
    
    if (updateError) {
      alert('Erro ao atualizar a senha: ' + updateError.message);
    } else {
      alert('Senha atualizada com sucesso!');
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
    }
    setIsSavingPassword(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-96"><FiLoader className="animate-spin text-4xl text-sky-500" /></div>;
  }
  
  if (!profile) {
    return <div className="text-center p-8">Não foi possível carregar os dados do perfil.</div>;
  }

  const inputClass = "mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none";
  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Meu Perfil</h1>

      {/* --- FORMULÁRIO DE DADOS DO PERFIL --- */}
      <form onSubmit={handleProfileSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-slate-700 border-b pb-4 mb-6">Informações Pessoais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className={labelClass}>Nome Completo</label><input type="text" name="nome" value={profile.nome || ''} onChange={handleProfileChange} className={inputClass} required /></div>
          <div><label className={labelClass}>Email</label><input type="email" name="email" value={profile.email || ''} className={`${inputClass} bg-gray-200`} disabled /></div>
          <div><label className={labelClass}>CPF/CNPJ</label><input type="text" name="cpf" value={profile.cpf || ''} onChange={handleProfileChange} className={inputClass} required /></div>
          <div><label className={labelClass}>Telefone</label><input type="tel" name="telefone" value={profile.telefone || ''} onChange={handleProfileChange} className={inputClass} /></div>
          <div><label className={labelClass}>Conselho de Classe</label><input type="text" name="conselho_classe" value={profile.conselho_classe || ''} onChange={handleProfileChange} className={inputClass} /></div>
          <div><label className={labelClass}>Nº do Conselho</label><input type="text" name="numero_conselho" value={profile.numero_conselho || ''} onChange={handleProfileChange} className={inputClass} /></div>
        </div>
        <div className="flex justify-end mt-6">
          <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">
            <FiSave />
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>

      {/* --- FORMULÁRIO DE ALTERAÇÃO DE SENHA --- */}
      <form onSubmit={handlePasswordSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-slate-700 border-b pb-4 mb-6">Alterar Senha</h2>
        
        {/* ✅ LAYOUT ATUALIZADO PARA 3 COLUNAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Senha Atual</label>
            <input 
              type="password" 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
              className={inputClass} 
              required
            />
          </div>
          <div>
            <label className={labelClass}>Nova Senha</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className={inputClass} 
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Confirmar Nova Senha</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className={inputClass}
              required
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button type="submit" disabled={isSavingPassword} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">
            <FiSave />
            {isSavingPassword ? 'Salvando...' : 'Alterar Senha'}
          </button>
        </div>
      </form>
    </div>
  );
}