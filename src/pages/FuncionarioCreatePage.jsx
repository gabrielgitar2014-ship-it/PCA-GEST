// DENTRO DE: src/pages/FuncionarioCreatePage.jsx

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { FiSave, FiLoader } from 'react-icons/fi';

export default function FuncionarioCreatePage() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { createWorker } = useData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    nome: '', cpf: '', data_nascimento: '', sexo: 'M',
    telefone: '', email: '', matricula: '', data_admissao: '',
    cep: '', logradouro: '', numero: '', complemento: '',
    bairro: '', cidade: '', estado: '',
  });
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const fetchAddressFromCep = async (cep) => {
    setIsCepLoading(true);
    setCepError('');
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
      const data = await response.json();
      if (data.name === 'CepPromiseError') throw new Error('CEP não encontrado.');
      setFormState(prevState => ({
        ...prevState,
        logradouro: data.street, bairro: data.neighborhood,
        cidade: data.city, estado: data.state,
      }));
    } catch (error) {
      setCepError(error.message);
    } finally {
      setIsCepLoading(false);
    }
  };

  const handleCepChange = (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    setFormState(prevState => ({ ...prevState, cep }));
    if (cep.length === 8) {
      fetchAddressFromCep(cep);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const workerData = {
      ...formState,
      empresa_id: companyId,
      cpf: formState.cpf.replace(/\D/g, ''),
      cep: formState.cep.replace(/\D/g, ''),
    };
    
    const { error } = await createWorker(workerData);
    if (error) {
      alert('Erro ao cadastrar funcionário. Verifique os dados, especialmente se o CPF já existe.');
      setIsSubmitting(false);
    } else {
      navigate(`/dashboard/${companyId}/funcionarios`);
    }
  };

  // Definição de classe padrão para os inputs para evitar repetição
  const inputClass = "mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Novo Funcionário</h1>
        <p className="text-gray-500 mt-1">Preencha os dados do trabalhador.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <h2 className="md:col-span-4 text-lg font-semibold text-slate-700 border-b pb-2">Dados Pessoais</h2>
          <div className="md:col-span-3">
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input type="text" name="nome" value={formState.nome} onChange={handleInputChange} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF</label>
            <input type="text" name="cpf" value={formState.cpf} onChange={handleInputChange} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="data_nascimento" className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
            <input type="date" name="data_nascimento" value={formState.data_nascimento} onChange={handleInputChange} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="sexo" className="block text-sm font-medium text-gray-700">Sexo</label>
            <select name="sexo" value={formState.sexo} onChange={handleInputChange} className={inputClass}>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
            <input type="tel" name="telefone" value={formState.telefone} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={formState.email} onChange={handleInputChange} className={inputClass} />
          </div>

          <h2 className="md:col-span-4 text-lg font-semibold text-slate-700 border-b pb-2 mt-4">Dados Profissionais</h2>
          <div>
            <label htmlFor="matricula" className="block text-sm font-medium text-gray-700">Matrícula</label>
            <input type="text" name="matricula" value={formState.matricula} onChange={handleInputChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="data_admissao" className="block text-sm font-medium text-gray-700">Data de Admissão</label>
            <input type="date" name="data_admissao" value={formState.data_admissao} onChange={handleInputChange} className={inputClass} />
          </div>
          
          <h2 className="md:col-span-4 text-lg font-semibold text-slate-700 border-b pb-2 mt-4">Endereço</h2>
          <div className="md:col-span-1">
            <label htmlFor="cep" className="block text-sm font-medium text-gray-700">CEP</label>
            <div className="relative">
              <input type="text" name="cep" maxLength="9" value={formState.cep} onChange={handleCepChange} className={inputClass} />
              {isCepLoading && <FiLoader className="animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-sky-500" />}
            </div>
            {cepError && <p className="text-sm text-red-600 mt-1">{cepError}</p>}
          </div>
          <div className="md:col-span-3">
            <label htmlFor="logradouro" className="block text-sm font-medium text-gray-700">Logradouro</label>
            <input type="text" name="logradouro" value={formState.logradouro} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="numero" className="block text-sm font-medium text-gray-700">Número</label>
            <input type="text" name="numero" value={formState.numero} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">Complemento</label>
            <input type="text" name="complemento" value={formState.complemento} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">Bairro</label>
            <input type="text" name="bairro" value={formState.bairro} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">Cidade</label>
            <input type="text" name="cidade" value={formState.cidade} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado (UF)</label>
            <input type="text" name="estado" maxLength="2" value={formState.estado} onChange={handleInputChange} className={inputClass} />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
          <Link to={`/dashboard/${companyId}/funcionarios`} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors">
            Cancelar
          </Link>
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400">
            <FiSave />
            {isSubmitting ? 'Salvando...' : 'Salvar Funcionário'}
          </button>
        </div>
      </form>
    </div>
  );
}