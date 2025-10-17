// DENTRO DE: src/components/Header.jsx

import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { FiLoader } from 'react-icons/fi';

export default function Header({ setIsOpen }) {
  const { user, signOut } = useAuth();
  const { dashboardData, isDashboardLoading, searchWorkersByCpf } = useData();
  const { companyId } = useParams();

  // Estados para a funcionalidade de busca
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const profileMenuRef = useRef(null); // Ref para o menu de perfil

  // Efeito "debounce" para a busca: espera o usuário parar de digitar
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const searchTimeout = setTimeout(() => {
      searchWorkersByCpf(searchQuery, companyId).then(results => {
        setSearchResults(results);
        setIsSearching(false);
      });
    }, 300);
    return () => clearTimeout(searchTimeout);
  }, [searchQuery, companyId, searchWorkersByCpf]);
  
  // Efeito para fechar os menus ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchQuery('');
        setSearchResults([]);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef, profileMenuRef]);

  const getCompanyTitle = () => {
    if (isDashboardLoading) return 'Carregando...';
    if (dashboardData?.companyName) return dashboardData.companyName;
    return 'Empresa não encontrada';
  };
  const companyTitle = getCompanyTitle();

  return (
    <header className="bg-white text-slate-600 shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between p-4">
        {/* Lado Esquerdo: Hamburger e Nome da Empresa */}
        <div className="flex items-center space-x-4">
          <button onClick={() => setIsOpen(prev => !prev)} className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m4 6h-16" /></svg>
          </button>
          <div className="hidden md:flex items-center space-x-2">
            <div className="w-8 h-8 bg-sky-500 rounded-md flex items-center justify-center text-white font-bold">
              {!isDashboardLoading && companyTitle !== 'Empresa não encontrada' ? companyTitle.charAt(0) : '?'}
            </div>
            <span className="text-slate-800 font-bold text-xl">{companyTitle}</span>
          </div>
        </div>

        {/* Lado Direito: Busca, Notificações e Perfil */}
        <div className="flex items-center space-x-4">
          {/* Container da busca */}
          <div ref={searchContainerRef} className="relative hidden lg:block">
            <input
              type="search"
              placeholder="Buscar CPF do funcionário..."
              className="bg-gray-100 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.replace(/\D/g, ''))}
            />
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            
            {searchQuery.length >= 3 && (
              <div className="absolute mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5">
                {isSearching && <div className="px-4 py-2 text-sm text-gray-500 flex items-center"><FiLoader className="animate-spin mr-2" /> Buscando...</div>}
                {!isSearching && searchResults.length === 0 && <div className="px-4 py-2 text-sm text-gray-500">Nenhum resultado encontrado.</div>}
                {!isSearching && searchResults.map(worker => (
                  <Link
                    key={worker.id}
                    to={`/dashboard/${companyId}/funcionarios/${worker.id}`}
                    onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-sky-100 hover:text-sky-600"
                  >
                    <p className="font-semibold">{worker.nome}</p>
                    <p className="text-xs text-gray-500">{worker.cpf}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500"></span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </button>
          
          <div ref={profileMenuRef} className="relative">
            <button onClick={() => setIsProfileMenuOpen(prev => !prev)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span className="hidden md:block">{user?.email}</span>
              <svg className="h-4 w-4 hidden md:block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-sky-100 hover:text-sky-600">Trocar / Adicionar Empresa</Link>
                
                {/* ✅ CORREÇÃO AQUI: Troca de <a> por <Link> */}
                <Link to="/meu-perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-sky-100 hover:text-sky-600">Meu Perfil</Link>
                
                <div className="border-t border-gray-100 my-1"></div>
                <button onClick={signOut} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-sky-100 hover:text-sky-600">Sair</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}