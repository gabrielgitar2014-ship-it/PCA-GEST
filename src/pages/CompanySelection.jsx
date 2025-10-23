import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, Loader, Key, X, LogOut, Search, Edit } from 'lucide-react'; // Adicionado Search e Edit
import { useData } from '../contexts/DataContext';

export default function CompanySelection() {
  const { companies, isLoading, createCompanyAndConsumeToken, fetchMyLicense } = useData();
  const navigate = useNavigate();

  // Estados dos Modais
  const [isCnpjModalOpen, setIsCnpjModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  
  // Estados para Busca CNPJ
  const [cnpj, setCnpj] = useState('');
  const [companyDataFromApi, setCompanyDataFromApi] = useState(null);
  const [isCnpjLoading, setIsCnpjLoading] = useState(false);
  const [cnpjLookupError, setCnpjLookupError] = useState(''); // Erro específico da busca
  
  // ✅ Estados para Cadastro Manual
  const [entryMode, setEntryMode] = useState('lookup'); // 'lookup' ou 'manual'
  const [manualFormData, setManualFormData] = useState({
    razao_social: '', nome_fantasia: '', cnpj: '', inscricao_estadual: '',
    logradouro: '', numero: '', complemento: '', bairro: '', cidade: '',
    estado: '', cep: '', telefone: '', email: ''
  });
  const [manualFormError, setManualFormError] = useState(''); // Erro específico do manual
  const [isSubmittingManual, setIsSubmittingManual] = useState(false); // Loading para manual

  const [license, setLicense] = useState(null);
  const [loadingLicense, setLoadingLicense] = useState(true);

  const handleLogout = () => {
    // TODO: Implementar logout real (limpar token/sessão)
    console.log("Usuário deslogado.");
    navigate('/login');
  };

  useEffect(() => {
    const loadLicense = async () => {
      if (typeof fetchMyLicense === 'function') {
        setLoadingLicense(true);
        try {
          const licenseData = await fetchMyLicense();
          setLicense(licenseData);
        } catch (error) {
          console.error("Erro ao carregar licença no CompanySelection:", error);
          setLicense(null);
        } finally {
          setLoadingLicense(false);
        }
      } else {
        console.warn("fetchMyLicense não está disponível no DataContext.");
        setLoadingLicense(false);
        setLicense(null);
      }
    };
    loadLicense();
  }, [fetchMyLicense]);

  // Função para buscar dados do CNPJ na BrasilAPI
  const handleCnpjLookup = async () => {
    setIsCnpjLoading(true);
    setCnpjLookupError('');
    setCompanyDataFromApi(null);
    const cleanCnpj = cnpj.replace(/\D/g, '');

    if (cleanCnpj.length !== 14) {
      setCnpjLookupError('CNPJ inválido. Deve conter 14 dígitos.');
      setIsCnpjLoading(false);
      return;
    }
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
      if (!response.ok) throw new Error('CNPJ não encontrado ou API BrasilAPI indisponível.');
      const data = await response.json();
      setCompanyDataFromApi(data);
      // ✅ Pré-preenche o formulário manual com dados da API (opcional, mas útil)
      setManualFormData({
          razao_social: data.razao_social || '',
          nome_fantasia: data.nome_fantasia || '',
          cnpj: data.cnpj?.replace(/\D/g, '') || '', // Garante limpeza
          inscricao_estadual: data.inscricao_estadual || '', // Verificar se API retorna isso
          logradouro: data.logradouro || '',
          numero: data.numero || '',
          complemento: data.complemento || '',
          bairro: data.bairro || '',
          cidade: data.municipio || '', // API usa 'municipio'
          estado: data.uf || '', // API usa 'uf'
          cep: data.cep?.replace(/\D/g, '') || '', // Garante limpeza
          telefone: (data.ddd_telefone_1 || data.ddd_telefone_2)?.replace(/\D/g,'') || '', // Pega um dos tels
          email: data.email || ''
      });

    } catch (err) {
      setCnpjLookupError(`Erro ao buscar CNPJ: ${err.message}`);
    } finally {
      setIsCnpjLoading(false);
    }
  };

  // ✅ Função para lidar com a submissão (tanto da busca quanto manual)
  const handleCreateCompanySubmit = async () => {
    let companyDataToSend = null;
    let submissionErrorSetter = setManualFormError; // Por padrão, usa o erro do manual
    setIsSubmittingManual(true); // Usa o loading do manual para ambos

    if (entryMode === 'lookup') {
      if (!companyDataFromApi) {
        alert("Busque um CNPJ válido primeiro no modo de busca!");
        setIsSubmittingManual(false);
        return;
      }
      // Mapeia os dados da BrasilAPI para o formato esperado (já feito no DataContext, mas podemos garantir aqui)
      companyDataToSend = {
          razao_social: companyDataFromApi.razao_social, nome_fantasia: companyDataFromApi.nome_fantasia,
          cnpj: companyDataFromApi.cnpj?.replace(/\D/g, ''), logradouro: companyDataFromApi.logradouro,
          numero: companyDataFromApi.numero, bairro: companyDataFromApi.bairro, cidade: companyDataFromApi.municipio,
          estado: companyDataFromApi.uf, cep: companyDataFromApi.cep?.replace(/\D/g, ''),
          telefone: (companyDataFromApi.ddd_telefone_1 || companyDataFromApi.ddd_telefone_2)?.replace(/\D/g,''), 
          email: companyDataFromApi.email,
          inscricao_estadual: companyDataFromApi.inscricao_estadual // Adicionar se API retornar
      };
      submissionErrorSetter = setCnpjLookupError; // Erro vai aparecer na seção de busca
    } else { // entryMode === 'manual'
      // Validações básicas do formulário manual
      if (!manualFormData.razao_social || !manualFormData.cnpj) {
        setManualFormError('Razão Social e CNPJ são obrigatórios.');
        setIsSubmittingManual(false);
        return;
      }
       if (manualFormData.cnpj.replace(/\D/g, '').length !== 14) {
         setManualFormError('CNPJ inválido. Deve conter 14 dígitos.');
         setIsSubmittingManual(false);
         return;
       }
       // Limpa CNPJ e CEP para enviar
       companyDataToSend = {
         ...manualFormData,
         cnpj: manualFormData.cnpj.replace(/\D/g, ''),
         cep: manualFormData.cep.replace(/\D/g, ''),
         telefone: manualFormData.telefone.replace(/\D/g, '')
       };
    }

    submissionErrorSetter(''); // Limpa erro anterior

    if (typeof createCompanyAndConsumeToken !== 'function') {
        alert("Erro interno: Função de criação de empresa não encontrada.");
        setIsSubmittingManual(false);
        return;
    }

    // Chama a função do context com os dados preparados
    const { error } = await createCompanyAndConsumeToken(companyDataToSend);

    if (error) {
      submissionErrorSetter(`Não foi possível criar a empresa: ${error.message}`);
    } else {
      setIsCnpjModalOpen(false); // Fecha o modal em sucesso
      // Força recarga da licença para atualizar contagem de tokens
      if (typeof fetchMyLicense === 'function') {
           const updatedLicense = await fetchMyLicense();
           setLicense(updatedLicense);
      }
      // Idealmente, fetchCompanies seria chamado aqui também ou o DataContext faria isso
    }
    setIsSubmittingManual(false);
  };
  
  // Reseta estados do modal CNPJ ao fechar/abrir
  useEffect(() => {
    if (!isCnpjModalOpen) {
      setCnpj('');
      setCompanyDataFromApi(null);
      setCnpjLookupError('');
      setManualFormError('');
      setManualFormData({ // Reseta form manual também
          razao_social: '', nome_fantasia: '', cnpj: '', inscricao_estadual: '',
          logradouro: '', numero: '', complemento: '', bairro: '', cidade: '',
          estado: '', cep: '', telefone: '', email: ''
      });
      setEntryMode('lookup'); // Volta para o modo padrão
    }
  }, [isCnpjModalOpen]);

  // Funções auxiliares para mudar o modo e lidar com input manual
  const switchToManual = () => setEntryMode('manual');
  const switchToLookup = () => setEntryMode('lookup');
  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualFormData(prev => ({ ...prev, [name]: value }));
  };


  // --- Renderização (com lógica condicional no modal CNPJ) ---

  const canCreateCompany = license && typeof license.tokens_usados === 'number' && typeof license.max_tokens === 'number' && license.tokens_usados < license.max_tokens;
  const availableTokensCount = canCreateCompany ? license.max_tokens - license.tokens_usados : 0;
  const availableTokens = canCreateCompany ? Array.from({ length: availableTokensCount }) : [];

  const handleTokenClick = () => {
    setIsTokenModalOpen(false);
    setIsCnpjModalOpen(true);
    setEntryMode('lookup'); // Garante que abra no modo lookup
  };

  if (isLoading || loadingLicense) {
    return ( <div className="flex items-center justify-center h-screen"><Loader className="animate-spin text-4xl text-sky-500" /></div> );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-10">
      
      {/* Botão de Logout */}
      <div className="absolute top-6 right-6">
        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-semibold py-2 px-3 rounded-lg transition-colors group">
          Sair <LogOut size={16} className="text-gray-500 group-hover:text-red-500 transition-colors" />
        </button>
      </div>

      <div className="w-full max-w-2xl mx-auto">
        {/* Cabeçalho da Página */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Seleção de Empresas</h1>
            <p className="text-gray-600">Escolha uma empresa para continuar ou crie uma nova.</p>
          </div>
          <button onClick={() => canCreateCompany && setIsTokenModalOpen(true)} disabled={!canCreateCompany} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
            <Plus size={16} /> Adicionar Empresa
          </button>
        </div>
        
        {/* Info da Licença */}
        {license && typeof license.max_tokens === 'number' ? (
          <div className="mb-10 inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
            <Key className="mr-2 h-4 w-4" />
            <span className="font-semibold">Licenças disponíveis: {availableTokensCount} / {license.max_tokens}</span>
          </div>
        ) : (
          <div className="mb-10 inline-flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-lg">
              <Key className="mr-2 h-4 w-4" /><span className="font-semibold">Nenhuma licença ativa encontrada para esta conta.</span>
          </div>
        )}

        {/* Lista de Empresas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {companies.map((company) => (
            <div key={company.id} onClick={() => navigate(`/dashboard/${company.id}`)} className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-sky-500 hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-sm">
              <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{company.nome_fantasia || company.razao_social}</h3>
                    <p className="text-sm text-gray-500 mt-1">CNPJ: {company.cnpj}</p> {/* Idealmente formatar CNPJ */}
                  </div>
                  <ArrowRight className="text-gray-400 group-hover:text-sky-500 transition-colors text-2xl" />
              </div>
            </div>
          ))}
        </div>
        {companies.length === 0 && (
             <div className="text-center col-span-1 md:col-span-2 py-16 px-4 border-2 border-dashed border-gray-300 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700">Nenhuma empresa cadastrada</h3>
                <p className="text-gray-500 mt-1">Utilize o botão "Adicionar Empresa" para começar.</p>
            </div>
        )}
      </div>

      {/* Modal de Seleção de Licença (Token Modal) */}
      {isTokenModalOpen && (
        <div className="fixed inset-0 bg- bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Selecione uma Licença Disponível</h2>
                <button onClick={() => setIsTokenModalOpen(false)} className="p-1 rounded-full hover:bg-gray-200"><X size={20} /></button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-200 border-t border-gray-200"> 
              {availableTokens.map((_, index) => (
                <div key={index} onClick={handleTokenClick} className="flex justify-between items-center py-4 px-2 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Key className="h-5 w-5 text-gray-400" />
                    <span className="font-semibold text-gray-700">Licença #{ (license?.tokens_usados ?? 0) + index + 1 }</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Disponível para uso</span>
                </div>
              ))}
              {availableTokens.length === 0 && (<div className="py-4 px-2 text-center text-gray-500">Nenhuma licença disponível no momento.</div>)}
            </div>
          </div>
        </div>
      )}

      {/* ✅ MODAL DE CNPJ MODIFICADO (com modo manual) */}
      {isCnpjModalOpen && (
        <div className="fixed inset-0 bg- bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 animate-fade-in">
          {/* Aumenta max-w para acomodar mais campos */}
          <div className="bg-white p-8 rounded-2xl w-full max-w-2xl shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto"> 
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Adicionar Nova Empresa</h2>
              <button onClick={() => setIsCnpjModalOpen(false)} className="p-1 rounded-full hover:bg-gray-200"><X size={20} /></button>
            </div>

            {/* Botões para alternar modo */}
            <div className="flex border-b mb-6">
              <button
                onClick={switchToLookup}
                className={`py-2 px-4 flex items-center gap-2 border-b-2 ${entryMode === 'lookup' ? 'border-sky-600 text-sky-600 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <Search size={16} /> Buscar por CNPJ
              </button>
              <button
                onClick={switchToManual}
                className={`py-2 px-4 flex items-center gap-2 border-b-2 ${entryMode === 'manual' ? 'border-sky-600 text-sky-600 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <Edit size={16} /> Cadastro Manual
              </button>
            </div>

            {/* Conteúdo Condicional: Modo Busca */}
            {entryMode === 'lookup' && (
              <div className="animate-fade-in">
                <div className="mb-4">
                  <label htmlFor="cnpj-lookup" className="block text-sm font-medium text-gray-700 mb-2">Digite o CNPJ</label>
                  <div className="flex gap-3">
                    <input
                      type="text" id="cnpj-lookup" value={cnpj} onChange={(e) => setCnpj(e.target.value)}
                      placeholder="00.000.000/0001-00"
                      className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
                    />
                    <button onClick={handleCnpjLookup} disabled={isCnpjLoading} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-5 rounded-lg flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                      {isCnpjLoading ? <Loader className="animate-spin text-xl" /> : 'Buscar'}
                    </button>
                  </div>
                  {cnpjLookupError && <p className="text-red-600 text-sm mt-2">{cnpjLookupError}</p>}
                </div>
                {companyDataFromApi && (
                  <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg mt-5 border border-gray-200 animate-fade-in">
                    <div><strong className="text-gray-500">Razão Social:</strong> {companyDataFromApi.razao_social}</div>
                    <div><strong className="text-gray-500">Nome Fantasia:</strong> {companyDataFromApi.nome_fantasia}</div>
                    <div><strong className="text-gray-500">Situação:</strong> {companyDataFromApi.descricao_situacao_cadastral}</div>
                    {/* Poderia mostrar mais dados aqui se quisesse */}
                  </div>
                )}
                 {/* Botão de confirmação SÓ aparece se buscou com sucesso */}
                 <div className="flex justify-end gap-4 mt-8">
                    <button onClick={() => setIsCnpjModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors">Cancelar</button>
                    <button onClick={handleCreateCompanySubmit} disabled={!companyDataFromApi || isSubmittingManual} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
                      {isSubmittingManual ? <Loader className="animate-spin" /> : null} Confirmar Criação
                    </button>
                 </div>
              </div>
            )}

            {/* Conteúdo Condicional: Modo Manual */}
            {entryMode === 'manual' && (
              <div className="animate-fade-in space-y-4">
                 {/* Adiciona grid para melhor layout */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                    <div>
                        <label htmlFor="razao_social" className="block text-sm font-medium text-gray-700">Razão Social *</label>
                        <input type="text" name="razao_social" id="razao_social" value={manualFormData.razao_social} onChange={handleManualChange} className="mt-1 w-full input-style" required />
                    </div>
                    <div>
                        <label htmlFor="nome_fantasia" className="block text-sm font-medium text-gray-700">Nome Fantasia</label>
                        <input type="text" name="nome_fantasia" id="nome_fantasia" value={manualFormData.nome_fantasia} onChange={handleManualChange} className="mt-1 w-full input-style" />
                    </div>
                     <div>
                        <label htmlFor="cnpj-manual" className="block text-sm font-medium text-gray-700">CNPJ *</label>
                        <input type="text" name="cnpj" id="cnpj-manual" value={manualFormData.cnpj} onChange={handleManualChange} placeholder="Apenas números" className="mt-1 w-full input-style" required />
                    </div>
                     <div>
                        <label htmlFor="inscricao_estadual" className="block text-sm font-medium text-gray-700">Inscrição Estadual</label>
                        <input type="text" name="inscricao_estadual" id="inscricao_estadual" value={manualFormData.inscricao_estadual} onChange={handleManualChange} className="mt-1 w-full input-style" />
                    </div>
                    {/* Campos de Endereço */}
                    <div className="md:col-span-2"> {/* Ocupa linha inteira */}
                        <label htmlFor="logradouro" className="block text-sm font-medium text-gray-700">Logradouro</label>
                        <input type="text" name="logradouro" id="logradouro" value={manualFormData.logradouro} onChange={handleManualChange} className="mt-1 w-full input-style" />
                    </div>
                    <div>
                        <label htmlFor="numero" className="block text-sm font-medium text-gray-700">Número</label>
                        <input type="text" name="numero" id="numero" value={manualFormData.numero} onChange={handleManualChange} className="mt-1 w-full input-style" />
                    </div>
                     <div>
                        <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">Complemento</label>
                        <input type="text" name="complemento" id="complemento" value={manualFormData.complemento} onChange={handleManualChange} className="mt-1 w-full input-style" />
                    </div>
                    <div>
                        <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">Bairro</label>
                        <input type="text" name="bairro" id="bairro" value={manualFormData.bairro} onChange={handleManualChange} className="mt-1 w-full input-style" />
                    </div>
                    <div>
                        <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">Cidade</label>
                        <input type="text" name="cidade" id="cidade" value={manualFormData.cidade} onChange={handleManualChange} className="mt-1 w-full input-style" />
                    </div>
                     <div>
                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado (UF)</label>
                        <input type="text" name="estado" id="estado" value={manualFormData.estado} onChange={handleManualChange} maxLength="2" placeholder="Ex: PE" className="mt-1 w-full input-style" />
                    </div>
                    <div>
                        <label htmlFor="cep" className="block text-sm font-medium text-gray-700">CEP</label>
                        <input type="text" name="cep" id="cep" value={manualFormData.cep} onChange={handleManualChange} placeholder="Apenas números" className="mt-1 w-full input-style" />
                    </div>
                    {/* Campos de Contato */}
                     <div>
                        <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
                        <input type="tel" name="telefone" id="telefone" value={manualFormData.telefone} onChange={handleManualChange} placeholder="Com DDD, apenas números" className="mt-1 w-full input-style" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" id="email" value={manualFormData.email} onChange={handleManualChange} className="mt-1 w-full input-style" />
                    </div>
                 </div> {/* Fim do grid */}

                 {manualFormError && <p className="text-red-600 text-sm mt-4">{manualFormError}</p>}

                 {/* Botões para o modo manual */}
                 <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
                    <button onClick={() => setIsCnpjModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors">Cancelar</button>
                    <button onClick={handleCreateCompanySubmit} disabled={isSubmittingManual} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
                       {isSubmittingManual ? <Loader className="animate-spin" /> : null} Salvar Empresa
                    </button>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSS Helper (adicione ao seu CSS global se preferir) */}
      <style jsx global>{`
        .input-style {
          background-color: #F9FAFB; border: 1px solid #D1D5DB; border-radius: 0.5rem;
          padding: 0.5rem 0.75rem; /* Ajuste padding */ transition: all 0.2s;
          font-size: 0.875rem; /* Ajuste tamanho fonte */
        }
        .input-style:focus { outline: none; box-shadow: 0 0 0 2px #38bdf8; /* Ring com box-shadow */ border-color: #0ea5e9; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}