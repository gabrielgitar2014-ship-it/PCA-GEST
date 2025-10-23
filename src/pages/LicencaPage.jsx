// DENTRO DE: src/pages/LicencaPage.jsx

import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import LicencaModal from '../components/LicencaModal';
import { Loader } from 'lucide-react';

export default function LicencaPage() {
  const { fetchMyLicense } = useData();
  const [licenca, setLicenca] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLicense = async () => {
      setIsLoading(true);
      const data = await fetchMyLicense();
      setLicenca(data);
      setIsLoading(false);
    };
    loadLicense();
  }, [fetchMyLicense]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader className="animate-spin text-4xl text-sky-500" />
      </div>
    );
  }

  return (
    // O modal é renderizado aqui. O fundo escuro é controlado dentro do modal.
    <LicencaModal licenca={licenca} />
  );
}