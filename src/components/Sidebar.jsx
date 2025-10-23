// src/components/Sidebar.jsx

import { NavLink, useParams } from 'react-router-dom';

// Ícone agora é puramente decorativo e escondido de leitores de tela
const Icon = ({ name }) => <span className="mr-3 text-xl" aria-hidden="true">{name}</span>;

const NavItem = ({ to, icon, children }) => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center p-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-sky-100 text-sky-600 font-bold'
        : 'hover:bg-gray-100 text-gray-600'
    }`;

  return (
    <li>
      <NavLink to={to} className={navLinkClass} end>
        <Icon name={icon} /> {children}
      </NavLink>
    </li>
  );
};

export default function Sidebar({ isOpen, setIsOpen }) {
  const { companyId } = useParams();

  // Se não houver companyId, não renderiza nada (ou um placeholder)
  if (!companyId) {
    return null;
  }

  return (
    // Adicionado aria-label para navegação principal (Acessibilidade)
    <nav
      aria-label="Navegação principal"
      className={`
        bg-white text-slate-800 w-64 h-screen fixed top-0 left-0 z-20 p-5 border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        flex flex-col
      `}
    >
      {/* 1. Cabeçalho (Mobile) */}
      <div className="flex justify-between items-center md:hidden mb-10">
        <h2 className="text-2xl font-bold">PCA-GES</h2>
        {/* Adicionado aria-label para acessibilidade */}
        <button 
          onClick={() => setIsOpen(false)} 
          className="text-2xl"
          aria-label="Fechar menu"
        >
          ✕
        </button>
      </div>

      {/* 2. Cabeçalho (Desktop) */}
      <div className='hidden md:block mb-10'>
         <h2 className="text-2xl font-bold">PCA-GES</h2>
      </div>

      {/* 3. Área de Links Principal (com rolagem) */}
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-3">
          <NavItem to={`/dashboard/${companyId}`} icon="🏠">
            Dashboard
          </NavItem>
          <NavItem to={`/dashboard/${companyId}/funcionarios`} icon="👥">
            Funcionários
          </NavItem>
          <NavItem to={`/dashboard/${companyId}/audiometrias`} icon="📊">
            Audiometrias
          </NavItem>
          <NavItem to={`/dashboard/${companyId}/casos-para-analise`} icon="⚠️">
            Casos para Análise
          </NavItem>
          <NavItem to={`/dashboard/${companyId}/casos-de-agravamento`} icon="📈">
            Casos de Agravamento
          </NavItem>
          <NavItem to={`/dashboard/${companyId}/relatorios`} icon="📄">
            Relatórios
          </NavItem>
          <NavItem to={`/dashboard/${companyId}/gai-chat`} icon="🤖">
            G.A.I.A Chat
          </NavItem>
        </ul>
      </div>


      {/* 4. Links Inferiores (agora parte do fluxo) */}
      <div className="w-full">
        <hr className="my-4 border-gray-200" />
        <ul className="space-y-3">
          <NavItem to={`/dashboard/${companyId}/meu-perfil`} icon="👤">
            Meu Perfil
          </NavItem>
          <NavItem to={`/dashboard/${companyId}/licenca`} icon="🔑">
            Licença
          </NavItem>
        </ul>
      </div>
    </nav>
  );
}