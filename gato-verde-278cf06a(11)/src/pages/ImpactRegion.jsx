import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import OperatorSidebar from '../components/operator/OperatorSidebar';
import { MapPin, TrendingUp, Leaf, Store, Package, Award } from 'lucide-react';

function calcularImpacto(ofertas) {
  return ofertas.length * 0.8;
}

function medalha(impacto) {
  if (impacto >= 500) return "GreenMaster";
  if (impacto >= 100) return "Ouro";
  if (impacto >= 50) return "Prata";
  if (impacto >= 10) return "Bronze";
  return "Iniciante";
}

export default function ImpactRegion() {
  const navigate = useNavigate();
  const regiaoSelecionada = localStorage.getItem('regiaoSelecionada');
  const regiaoNome = localStorage.getItem('regiaoNome');
  const countryName = localStorage.getItem('countryName');
  const stateName = localStorage.getItem('stateName');

  const { data: offers = [] } = useQuery({
    queryKey: ['offers-region-impact', regiaoSelecionada],
    queryFn: async () => {
      const allOffers = await base44.entities.Offer.list();
      return allOffers.filter(o => o.regiaoId === regiaoSelecionada);
    },
    enabled: !!regiaoSelecionada,
    initialData: []
  });

  const { data: markets = [] } = useQuery({
    queryKey: ['markets-region-impact', regiaoSelecionada],
    queryFn: async () => {
      const allMarkets = await base44.entities.Market.list();
      return allMarkets.filter(m => m.regiaoId === regiaoSelecionada);
    },
    enabled: !!regiaoSelecionada,
    initialData: []
  });

  useEffect(() => {
    if (!regiaoSelecionada) {
      navigate(createPageUrl('LicenciarRegiao'));
    }
  }, [regiaoSelecionada, navigate]);

  if (!regiaoSelecionada) {
    return null;
  }

  const impacto = calcularImpacto(offers);
  const co2Evitado = impacto * 2.5;
  const ofertasAtivas = offers.filter(o => o.status === 'active').length;
  const medalhaAtual = medalha(impacto);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--gradient-mist)' }}>
      <OperatorSidebar />
      
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-10 h-10" style={{ color: 'var(--mist-primary)' }} />
            <div>
              <h1 className="text-4xl font-black" style={{ color: 'white' }}>
                Impacto da Região
              </h1>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Indicadores da região operada atualmente.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            <span>🌍 {countryName}</span>
            {stateName && <span>• 🗺️ {stateName}</span>}
            <span>• 📍 {regiaoNome}</span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Comida Salva Local */}
          <Card className="p-8 text-center mist-card" style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.1) 0%, transparent 100%)',
            border: '2px solid var(--mist-primary)',
            boxShadow: '0 0 20px rgba(0, 255, 157, 0.2)'
          }}>
            <TrendingUp className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--mist-primary)' }} />
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Comida Salva</p>
            <h3 className="text-5xl font-black mb-2 mist-glow-text">
              {impacto.toFixed(1)}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>kg estimados</p>
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
              {co2Evitado.toFixed(1)}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>kg de emissões</p>
          </Card>

          {/* Mercados Ativos */}
          <Card className="p-8 text-center mist-card" style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.1) 0%, transparent 100%)',
            border: '2px solid var(--mist-primary)',
            boxShadow: '0 0 20px rgba(0, 255, 157, 0.2)'
          }}>
            <Store className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--mist-primary)' }} />
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Mercados</p>
            <h3 className="text-5xl font-black mb-2 mist-glow-text">{markets.length}</h3>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>na região</p>
          </Card>

          {/* Ofertas Ativas */}
          <Card className="p-8 text-center mist-card" style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.1) 0%, transparent 100%)',
            border: '2px solid var(--mist-primary)',
            boxShadow: '0 0 20px rgba(0, 255, 157, 0.2)'
          }}>
            <Package className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--mist-primary)' }} />
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Ofertas Ativas</p>
            <h3 className="text-5xl font-black mb-2 mist-glow-text">{ofertasAtivas}</h3>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>de {offers.length} total</p>
          </Card>

          {/* Medalha Atual */}
          <Card className="p-8 text-center mist-card" style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.1) 0%, transparent 100%)',
            border: '2px solid var(--mist-primary)',
            boxShadow: '0 0 10px rgba(0,255,157,0.3)'
          }}>
            <Award className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--mist-primary)' }} />
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Sua Conquista</p>
            <h3 className="text-4xl font-black mb-2 mist-glow-text">{medalhaAtual}</h3>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {medalhaAtual === 'GreenMaster' && '🏆 Mestre Verde'}
              {medalhaAtual === 'Ouro' && '🥇 Ouro'}
              {medalhaAtual === 'Prata' && '🥈 Prata'}
              {medalhaAtual === 'Bronze' && '🥉 Bronze'}
              {medalhaAtual === 'Iniciante' && '🌱 Iniciante'}
            </p>
          </Card>
        </div>

        {/* Progress Card */}
        <Card className="p-6 mist-card" style={{
          background: 'rgba(0, 255, 157, 0.05)',
          border: '1px solid var(--mist-primary)'
        }}>
          <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--mist-primary)' }}>
            📊 Progresso
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                <span>Para próxima medalha</span>
                <span className="mist-glow-text font-bold">{impacto.toFixed(0)} kg</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: 'var(--mist-border)' }}>
                <div 
                  className="h-2 rounded-full transition-all"
                  style={{ 
                    background: 'var(--mist-primary)',
                    width: `${Math.min((impacto / 10) * 100, 100)}%`,
                    boxShadow: '0 0 8px rgba(0, 255, 157, 0.5)'
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}