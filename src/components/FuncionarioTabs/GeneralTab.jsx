// DENTRO DE: src/components/FuncionarioTabs/Generaltab.jsx

import React from 'react';

// Componente auxiliar para exibir um campo de detalhe
const DetailField = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-1 text-lg text-slate-800">{value || 'Não informado'}</p>
  </div>
);

// O componente da aba General agora vive em seu próprio arquivo.
// Ele recebe o 'worker' (funcionário) como uma propriedade (prop).
export default function GeneralTab({ worker }) {
  return (
    <div className="bg-white p-8 rounded-b-lg shadow-sm border border-t-0 border-gray-200">
      <section>
        <h2 className="text-xl font-semibold text-slate-700 border-b pb-3 mb-6">Dados Pessoais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DetailField label="Data de Nascimento" value={new Date(worker.data_nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} />
          <DetailField label="Sexo" value={worker.sexo === 'M' ? 'Masculino' : 'Feminino'} />
          <DetailField label="Telefone" value={worker.telefone} />
          <DetailField label="Email" value={worker.email} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-700 border-b pb-3 mb-6">Dados Profissionais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DetailField label="Matrícula" value={worker.matricula} />
            <DetailField label="Data de Admissão" value={worker.data_admissao ? new Date(worker.data_admissao).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Não informado'} />
            <DetailField label="Status" value={
              <span className={`px-2 py-1 text-sm font-semibold rounded-full capitalize ${
                worker.status === 'ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {worker.status}
              </span>
            } />
          </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-700 border-b pb-3 mb-6">Endereço</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3"><DetailField label="Logradouro" value={`${worker.logradouro || ''}, ${worker.numero || 'S/N'}`} /></div>
            <div className="md:col-span-1"><DetailField label="CEP" value={worker.cep} /></div>
            <div className="md:col-span-2"><DetailField label="Bairro" value={worker.bairro} /></div>
            <div className="md:col-span-2"><DetailField label="Cidade / Estado" value={`${worker.cidade || ''} - ${worker.estado || ''}`} /></div>
            <div className="md:col-span-4"><DetailField label="Complemento" value={worker.complemento} /></div>
          </div>
      </section>
    </div>
  );
}