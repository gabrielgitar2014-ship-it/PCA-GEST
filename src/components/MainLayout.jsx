// DENTRO DE: src/components/MainLayout.jsx

import { useState } from 'react';
import { Outlet } from 'react-router-dom'; // <-- Importante!

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <> {/* Usamos um fragmento pois o layout não precisa de um div extra */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="transition-all duration-300 ease-in-out md:ml-64">
        <Header setIsOpen={setIsSidebarOpen} />

        <main className="p-4 sm:p-6 lg:p-8">
          {/* O Outlet renderiza o componente da rota filha (ex: Dashboard) */}
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default MainLayout;