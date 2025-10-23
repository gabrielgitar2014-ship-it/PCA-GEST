import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Loader, Search, Bell, User, ChevronDown, Menu } from 'lucide-react';

export default function Header({ setIsOpen }) {
  const { user, signOut } = useAuth();
  // ===================================================================
  // ✅ MODIFICAÇÃO 1: Trocamos 'searchWorkersByCpf' por 'searchWorkers'
  // ===================================================================
  const { dashboardData, isDashboardLoading, searchWorkers } = useData();
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Efeito "debounce" para a busca
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const searchTimeout = setTimeout(() => {
      // ===================================================================
      // ✅ MODIFICAÇÃO 2: Usamos a nova função 'searchWorkers'
      // (Você precisará atualizar o DataContext para fornecer esta função)
      // ===================================================================
      searchWorkers(searchQuery, companyId).then(results => {
        setSearchResults(results);
        setIsSearching(false);
      });
    }, 300);
    return () => clearTimeout(searchTimeout);
  // Atualizamos a dependência
  }, [searchQuery, companyId, searchWorkers]); 
  
  // Efeito para fechar os menus ao clicar fora (Sem alteração)
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

  // Sem alteração
  const getCompanyTitle = () => {
    if (isDashboardLoading) return 'Carregando...';
    if (dashboardData?.companyName) return dashboardData.companyName;
    return 'Empresa não encontrada';
  };
  const companyTitle = getCompanyTitle();

  // Sem alteração
  const handleResultClick = (workerId) => {
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/dashboard/${companyId}/funcionarios/${workerId}`);
  };

  return (
    <header className="bg-white text-slate-600 shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between p-4">
        {/* Lado Esquerdo: Hamburger e Nome da Empresa (Sem alteração) */}
        <div className="flex items-center space-x-4">
        
          <button 
            onClick={() => setIsOpen(prev => !prev)} 
            className="text-gray-600 p-2 rounded-full hover:bg-gray-100"
            aria-label="Toggle Menu"
          >
            <Menu size={24} />
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
              // ===================================================================
              // ✅ MODIFKAÇÃO 3: Atualização do placeholder
              // ===================================================================
              placeholder="Buscar por nome, CPF ou matrícula..."
              className="bg-gray-100 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={searchQuery}
              // ===================================================================
              // ✅ MODIFICAÇÃO 4: Remoção do '.replace(/\D/g, '')' para permitir texto
              // ===================================================================
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            
            {/* Lógica de exibição de resultados (Sem alteração) */}
            {searchQuery.length >= 3 && (
              <div className="absolute mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5">
                {isSearching && <div className="px-4 py-2 text-sm text-gray-500 flex items-center"><Loader className="animate-spin mr-2" /> Buscando...</div>}
                {!isSearching && searchResults.length === 0 && <div className="px-4 py-2 text-sm text-gray-500">Nenhum resultado encontrado.</div>}
                {!isSearching && searchResults.map(worker => (
                  <button
                    key={worker.id}
                    onClick={() => handleResultClick(worker.id)}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-sky-100 hover:text-sky-600"
                  >
                    <p className="font-semibold">{worker.nome}</p>
                    <p className="text-xs text-gray-500">{worker.cpf}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notificações (Sem alteração) */}
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500"></span>
            <Bell size={24} />
          </button>
          
          {/* Menu de Perfil (Sem alteração) */}
          <div ref={profileMenuRef} className="relative">
            <button onClick={() => setIsProfileMenuOpen(prev => !prev)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
              <User size={24} />
              <span className="hidden md:block text-sm font-medium">{user?.email}</span>
              <ChevronDown size={16} className="hidden md:block" />
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                <Link to="/meu-perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-sky-100 hover:text-sky-600">
                  Meu Perfil
                </Link>
                <Link to="/licenca" className="block px-4 py-2 text-sm text-gray-700 hover:bg-sky-100 hover:text-sky-600">
                  Minha Licença
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-sky-100 hover:text-sky-600">
                  Trocar Empresa
                </Link>
                <button onClick={signOut} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-sky-100 hover:text-sky-600">
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}