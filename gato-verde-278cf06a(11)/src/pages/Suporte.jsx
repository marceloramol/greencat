import React from 'react';
import OperatorSidebar from '../components/operator/OperatorSidebar';

export default function Suporte() {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--gradient-mist)' }}>
      <OperatorSidebar />
      
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-black mb-4" style={{ color: 'white' }}>
          Suporte (placeholder)
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Tela em desenvolvimento. Entre em contato através dos canais oficiais.
        </p>
      </div>
    </div>
  );
}