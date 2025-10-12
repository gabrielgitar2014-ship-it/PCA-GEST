// DENTRO DE: src/components/Sidebar.jsx

import { NavLink, useParams } from 'react-router-dom';

const Icon = ({ name }) => <span className="mr-3 text-xl">{name}</span>;

const NavItem = ({ to, icon, children }) => {
  // ALTERADO: Estilos para o tema claro
  const navLinkClass = ({ isActive }) =>
    `flex items-center p-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-sky-100 text-sky-600 font-bold' // Estilo ativo mais claro
        : 'hover:bg-gray-100 text-gray-600' // Estilo padrão
    }`;

  return (
    <li>
      <NavLink to={to} className={navLinkClass}>
        <Icon name={icon} /> {children}
      </NavLink>
    </li>
  );
};

export default function Sidebar({ isOpen, setIsOpen }) {
  const { companyId } = useParams();

  return (
    // ALTERADO: Fundo branco, texto escuro e borda à direita
    <nav
      className={`
        bg-white text-slate-800 w-64 h-full fixed top-0 left-0 z-20 p-5 border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}
    >
      <div className="flex justify-between items-center md:hidden mb-10">
        <h2 className="text-2xl font-bold">PCA-GES</h2>
        <button onClick={() => setIsOpen(false)} className="text-2xl">✕</button>
      </div>

      <div className='hidden md:block mb-10'>
         <h2 className="text-2xl font-bold">PCA-GES</h2>
      </div>

      <ul className="space-y-3">
        <NavItem to={`/dashboard/${companyId}`} icon="🏠">
          Dashboard
        </NavItem>
        <NavItem to={`/dashboard/${companyId}/funcionarios`} icon="👥">
          Funcionários
        </NavItem>
        <NavItem to={`/dashboard/${companyId}/audiometrias`} icon="🎧">
          Audiometrias
        </NavItem>
        <NavItem to={`/dashboard/${companyId}/relatorios`} icon="📄">
          Relatórios
        </NavItem>
      </ul>
    </nav>
  );
}