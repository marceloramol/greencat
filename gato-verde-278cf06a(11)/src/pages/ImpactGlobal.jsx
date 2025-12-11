import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import OperatorSidebar from '../components/operator/OperatorSidebar';
import { Globe, TrendingUp, Leaf, Store, Users } from 'lucide-react';

export default function ImpactGlobal() {
  const { data: offers = [] } = useQuery({
    queryKey: ['offers-global-impact'],
    queryFn: () => base44.entities.Offer.list(),
    initialData: []
  });

  const { data: markets = [] } = useQuery({
    queryKey: ['markets-global-impact'],
    queryFn: () => base44.entities.Market.list(),
    initialData: []
  });

  const { data: licencas = [] } = useQuery({
    queryKey: ['licencas-global-impact'],
    queryFn: () => base44.entities.Licenca.list(),
    initialData: []
  });

  const comidaSalva = offers.length * 0.8;
  const co2Reduzido = comidaSalva * 2.5;
  const operadoresAtivos = licencas.filter(l => l.status === 'ativo').length;

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--gradient-mist)' }}>
      <OperatorSidebar />
      
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-10 h-10" style={{ color: 'var(--mist-primary)' }} />
            <div>
              <h1 className="text-4xl font-black" style={{ color: 'white' }}>
                Impacto Global — GreenCat ESG
              </h1>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Veja o impacto total gerado pelos operadores e mercados participantes.
              </p>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Comida Salva */}
          <Card className="p-8 text-center mist-card" style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.1) 0%, transparent 100%)',
            border: '2px solid var(--mist-primary)',
            boxShadow: '0 0 20px rgba(0, 255, 157, 0.2)'
          }}>
            <TrendingUp className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--mist-primary)' }} />
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Comida Salva</p>
            <h3 className="text-5xl font-black mb-2 mist-glow-text">
              {comidaSalva.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>kg de alimentos</p>
          </Card>

          {/* CO₂ Reduzido */}
          <Card className="p-8 text-center mist-card" style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.1) 0%, transparent 100%)',
            border: '2px solid var(--mist-primary)',
            boxShadow: '0 0 20px rgba(0, 255, 157, 0.2)'
          }}>
            <Leaf className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--mist-primary)' }} />
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>CO₂ Evitado</p>
            <h3 className="text-5xl font-black mb-2 mist-glow-text">
              {co2Reduzido.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>kg de emissões</p>
          </Card>

          {/* Mercados */}
          <Card className="p-8 text-center mist-card" style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.1) 0%, transparent 100%)',
            border: '2px solid var(--mist-primary)',
            boxShadow: '0 0 20px rgba(0, 255, 157, 0.2)'
          }}>
            <Store className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--mist-primary)' }} />
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Mercados</p>
            <h3 className="text-5xl font-black mb-2 mist-glow-text">{markets.length}</h3>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>parceiros ativos</p>
          </Card>

          {/* Operadores */}
          <Card className="p-8 text-center mist-card" style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.1) 0%, transparent 100%)',
            border: '2px solid var(--mist-primary)',
            boxShadow: '0 0 20px rgba(0, 255, 157, 0.2)'
          }}>
            <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--mist-primary)' }} />
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Operadores</p>
            <h3 className="text-5xl font-black mb-2 mist-glow-text">{operadoresAtivos}</h3>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>licenças ativas</p>
          </Card>

          {/* Ofertas */}
          <Card className="p-8 text-center mist-card" style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.1) 0%, transparent 100%)',
            border: '2px solid var(--mist-primary)',
            boxShadow: '0 0 20px rgba(0, 255, 157, 0.2)'
          }}>
            <TrendingUp className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--mist-primary)' }} />
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Ofertas</p>
            <h3 className="text-5xl font-black mb-2 mist-glow-text">{offers.length}</h3>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>total criadas</p>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="p-6 mist-card" style={{
          background: 'rgba(0, 255, 157, 0.05)',
          border: '1px solid var(--mist-primary)'
        }}>
          <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--mist-primary)' }}>
            💚 Sobre o Impacto ESG
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Estes números representam o impacto estimado da plataforma GreenCat globalmente.
            Cada oferta criada tem potencial de salvar alimentos que iriam para o lixo,
            reduzindo emissões de CO₂ e apoiando o comércio local.
          </p>
        </Card>
      </div>
    </div>
  );
}