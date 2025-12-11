import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Store, Package, Leaf, Award, Plus } from 'lucide-react';
import OperadorSidebar from '../components/operador/OperadorSidebar';

export default function OperadorDashboard() {
  const navigate = useNavigate();
  const regiaoId = localStorage.getItem('regiaoSelecionada');
  const regiaoNome = localStorage.getItem('regiaoNome');

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: offers = [] } = useQuery({
    queryKey: ['offers-dashboard', regiaoId],
    queryFn: async () => {
      const allOffers = await base44.entities.Offer.list();
      return allOffers.filter(o => o.regiaoId === regiaoId);
    },
    enabled: !!regiaoId,
    initialData: []
  });

  const { data: markets = [] } = useQuery({
    queryKey: ['markets-dashboard', regiaoId],
    queryFn: async () => {
      const allMarkets = await base44.entities.Market.list();
      return allMarkets.filter(m => m.regiaoId === regiaoId);
    },
    enabled: !!regiaoId,
    initialData: []
  });

  const offersSaved = offers.filter(o => o.status === 'soldout' || o.status === 'ended').length;
  const kgSaved = offersSaved * 2.5;
  const co2Avoided = kgSaved * 2.5;
  const activeOffers = offers.filter(o => o.status === 'active').length;

  // Gamificação
  const getMedal = () => {
    if (kgSaved >= 500) return { name: 'GreenMaster', color: '#00FF9D', icon: '🏆' };
    if (kgSaved >= 100) return { name: 'Ouro', color: '#00FF9D', icon: '🥇' };
    if (kgSaved >= 50) return { name: 'Prata', color: '#8AF5D1', icon: '🥈' };
    if (kgSaved >= 10) return { name: 'Bronze', color: '#4C7F6E', icon: '🥉' };
    return { name: 'Iniciante', color: '#888', icon: '🌱' };
  };

  const medal = getMedal();

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--gradient-mist)' }}>
      <OperadorSidebar />
      
      <div className="flex-1 p-8" style={{ animation: 'fadeIn 0.32s ease forwards' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black mb-2" style={{ color: 'white' }}>
              Dashboard PRO
            </h1>
            <p className="text-xl mist-glow-text">
              {regiaoNome || 'Sua Região'}
            </p>
          </div>

          {/* Métricas Principais */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 mist-card mist-card-hover">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                  background: 'rgba(0, 255, 157, 0.15)',
                  border: '1px solid var(--mist-primary)'
                }}>
                  <TrendingUp className="w-6 h-6" style={{ color: 'var(--mist-primary)' }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Kg Salvos</p>
                  <h3 className="text-2xl font-black mist-glow-text">{kgSaved.toFixed(1)}</h3>
                </div>
              </div>
            </Card>

            <Card className="p-6 mist-card mist-card-hover">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                  background: 'rgba(0, 255, 157, 0.15)',
                  border: '1px solid var(--mist-primary)'
                }}>
                  <Leaf className="w-6 h-6" style={{ color: 'var(--mist-primary)' }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>CO₂ Evitado</p>
                  <h3 className="text-2xl font-black mist-glow-text">{co2Avoided.toFixed(1)}</h3>
                </div>
              </div>
            </Card>

            <Card className="p-6 mist-card mist-card-hover">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                  background: 'rgba(0, 255, 157, 0.15)',
                  border: '1px solid var(--mist-primary)'
                }}>
                  <Store className="w-6 h-6" style={{ color: 'var(--mist-primary)' }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Negócios</p>
                  <h3 className="text-2xl font-black" style={{ color: 'white' }}>{markets.length}</h3>
                </div>
              </div>
            </Card>

            <Card className="p-6 mist-card mist-card-hover">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                  background: 'rgba(0, 255, 157, 0.15)',
                  border: '1px solid var(--mist-primary)'
                }}>
                  <Package className="w-6 h-6" style={{ color: 'var(--mist-primary)' }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Ofertas Ativas</p>
                  <h3 className="text-2xl font-black" style={{ color: 'white' }}>{activeOffers}</h3>
                </div>
              </div>
            </Card>
          </div>

          {/* Gamificação */}
          <Card className="p-6 mb-8 mist-card" style={{
            background: `linear-gradient(135deg, rgba(0, 255, 157, 0.05) 0%, transparent 100%)`,
            border: `2px solid ${medal.color}`,
            boxShadow: `0 0 12px ${medal.color}40`
          }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{medal.icon}</div>
                <div>
                  <h3 className="text-2xl font-black mb-1" style={{ color: medal.color }}>
                    {medal.name}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Você salvou {kgSaved.toFixed(1)}kg de comida!
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>Próxima medalha</p>
                <p className="font-bold" style={{ color: 'var(--mist-primary)' }}>
                  {kgSaved < 10 ? 'Bronze: 10kg' : 
                   kgSaved < 50 ? 'Prata: 50kg' : 
                   kgSaved < 100 ? 'Ouro: 100kg' : 
                   kgSaved < 500 ? 'GreenMaster: 500kg' : 'Máximo alcançado! 🎉'}
                </p>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Mercados */}
            <Card className="p-6 mist-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: 'white' }}>
                  <Store className="inline w-6 h-6 mr-2 mb-1" style={{ color: 'var(--mist-primary)' }} />
                  Mercados
                </h2>
                <Button onClick={() => navigate(createPageUrl('MarketRegister'))} className="mist-button-primary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo
                </Button>
              </div>

              {markets.length === 0 ? (
                <div className="text-center py-8">
                  <Store className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--mist-primary)', opacity: 0.3 }} />
                  <p style={{ color: 'var(--text-tertiary)' }}>Nenhum negócio cadastrado ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {markets.slice(0, 5).map((market) => {
                    const marketOffers = offers.filter(o => o.market_id === market.id);
                    return (
                      <div
                        key={market.id}
                        className="p-4 rounded-xl"
                        style={{
                          background: 'rgba(0, 255, 157, 0.05)',
                          border: '1px solid var(--mist-border)'
                        }}
                      >
                        <h4 className="font-bold mb-1" style={{ color: 'white' }}>{market.name}</h4>
                        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          {marketOffers.length} ofertas • {market.business_type}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Ofertas Ativas */}
            <Card className="p-6 mist-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: 'white' }}>
                  <Package className="inline w-6 h-6 mr-2 mb-1" style={{ color: 'var(--mist-primary)' }} />
                  Ofertas Ativas
                </h2>
                <Button onClick={() => navigate(createPageUrl('MarketOffers'))} className="mist-button-primary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova
                </Button>
              </div>

              {activeOffers === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--mist-primary)', opacity: 0.3 }} />
                  <p style={{ color: 'var(--text-tertiary)' }}>Nenhuma oferta ativa no momento</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {offers.filter(o => o.status === 'active').slice(0, 5).map((offer) => (
                    <div
                      key={offer.id}
                      className="p-4 rounded-xl"
                      style={{
                        background: 'rgba(0, 255, 157, 0.05)',
                        border: '1px solid var(--mist-border)'
                      }}
                    >
                      <h4 className="font-bold mb-1" style={{ color: 'white' }}>{offer.title}</h4>
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {offer.market_name} • -{offer.discount_pct}%
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}