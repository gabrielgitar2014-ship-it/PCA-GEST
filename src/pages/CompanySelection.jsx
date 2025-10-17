// DENTRO DE: src/pages/CompanySelection.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiArrowRight, FiLoader } from 'react-icons/fi';
import { useData } from '@/contexts/DataContext'; 

export default function CompanySelection() {
  const { companies, isLoading, createCompany } = useData();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cnpj, setCnpj] = useState('');
  const [companyDataFromApi, setCompanyDataFromApi] = useState(null);
  const [isCnpjLoading, setIsCnpjLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleCnpjLookup = async () => {
    setIsCnpjLoading(true);
    setFormError('');
    setCompanyDataFromApi(null);
    const cleanCnpj = cnpj.replace(/\D/g, '');

    if (cleanCnpj.length !== 14) {
      setFormError('CNPJ inválido. Deve conter 14 dígitos.');
      setIsCnpjLoading(false);
      return;
    }
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
      if (!response.ok) throw new Error('CNPJ não encontrado ou API fora do ar.');
      const data = await response.json();
      setCompanyDataFromApi(data);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsCnpjLoading(false);
    }
  };

  const handleCreateAndSaveCompany = async () => {
    if (!companyDataFromApi) {
      alert("Busque um CNPJ válido primeiro!");
      return;
    }

    const { error } = await createCompany(companyDataFromApi);

    if (error) {
      if (error.code === '23505') { 
        alert('Erro: Este CNPJ já está cadastrado.');
      } else {
        alert('Não foi possível criar a empresa.');
      }
    } else {
      setIsModalOpen(false);
    }
  };
  
  useEffect(() => {
    if (!isModalOpen) {
      setCnpj('');
      setCompanyDataFromApi(null);
      setFormError('');
    }
  }, [isModalOpen]);

  // Lógica do carregamento: exibe o spinner enquanto busca a lista de empresas.
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FiLoader className="animate-spin text-4xl text-sky-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Seleção de Empresas</h1>
          <p className="text-gray-600">Escolha uma empresa para continuar ou crie uma nova.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {companies.map((company) => (
            <div
              key={company.id}
              onClick={() => navigate(`/dashboard/${company.id}`)}
              className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-sky-500 hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-sm"
            >
              <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{company.nome_fantasia || company.razao_social}</h3>
                    <p className="text-sm text-gray-500 mt-1">CNPJ: {company.cnpj}</p>
                  </div>
                  <FiArrowRight className="text-gray-400 group-hover:text-sky-500 transition-colors text-2xl" />
              </div>
            </div>
          ))}

          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex flex-col items-center justify-center bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-sky-500 hover:bg-gray-50 transition-all duration-300 cursor-pointer"
          >
            <FiPlus className="text-gray-400 group-hover:text-sky-600 transition-colors text-4xl mb-2" />
            <span className="font-semibold text-gray-500 group-hover:text-sky-600 transition-colors">
              Criar Nova Empresa
            </span>
          </button>
        </div>
      </div>

      {/* Modal para Criar Nova Empresa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg- bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 animate-fade-in">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-slide-up">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Adicionar Nova Empresa</h2>
            
            <div className="mb-4">
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-2">
                Digite o CNPJ
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  id="cnpj"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="00.000.000/0001-00"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
                />
                <button
                  onClick={handleCnpjLookup}
                  disabled={isCnpjLoading}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-5 rounded-lg flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isCnpjLoading ? <FiLoader className="animate-spin text-xl" /> : 'Buscar'}
                </button>
              </div>
               {formError && <p className="text-red-600 text-sm mt-2">{formError}</p>}
            </div>

            {companyDataFromApi && (
              <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg mt-5 border border-gray-200 animate-fade-in">
                <div><strong className="text-gray-500">Razão Social:</strong> {companyDataFromApi.razao_social}</div>
                <div><strong className="text-gray-500">Nome Fantasia:</strong> {companyDataFromApi.nome_fantasia}</div>
                <div><strong className="text-gray-500">Situação:</strong> {companyDataFromApi.descricao_situacao_cadastral}</div>
              </div>
            )}

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateAndSaveCompany}
                disabled={!companyDataFromApi}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Confirmar Criação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}