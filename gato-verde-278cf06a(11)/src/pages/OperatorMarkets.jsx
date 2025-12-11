import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import OperatorSidebar from '../components/operator/OperatorSidebar';

export default function OperatorMarkets() {
  const navigate = useNavigate();
  const regiaoSelecionada = localStorage.getItem('regiaoSelecionada');

  useEffect(() => {
    if (!regiaoSelecionada) {
      navigate(createPageUrl('LicenciarRegiao'));
    }
  }, [regiaoSelecionada, navigate]);

  if (!regiaoSelecionada) {
    return null;
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--gradient-mist)' }}>
      <OperatorSidebar />
      
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-black mb-4" style={{ color: 'white' }}>
          Gerenciar Mercados (placeholder)
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Tela em desenvolvimento (versão PRO).
        </p>
      </div>
    </div>
  );
}