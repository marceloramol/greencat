import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import OperatorSidebar from '../components/operator/OperatorSidebar';
import { TrendingUp, Store, Package, Target, Award, User } from 'lucide-react';

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

export default function OperatorDashboard() {
  const navigate = useNavigate();
  const regiaoSelecionada = localStorage.getItem('regiaoSelecionada');
  const regiaoNome = localStorage.getItem('regiaoNome');
  const countryName = localStorage.getItem('countryName');
  const stateName = localStorage.getItem('stateName');

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
    initialData: null
  });

  const { data: markets = [] } = useQuery({
    queryKey: ['markets-operator', regiaoSelecionada],
    queryFn: async () => {
      const allMarkets = await base44.entities.Market.list();
      return allMarkets.filter(m => m.regiaoId === regiaoSelecionada);
    },
    enabled: !!regiaoSelecionada,
    initialData: []
  });

  const { data: offers = [] } = useQuery({
    queryKey: ['offers-operator', regiaoSelecionada],
    queryFn: async () => {
      const allOffers = await base44.entities.Offer.list();
      return allOffers.filter(o => o.regiaoId === regiaoSelecionada);
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
  const meta = impacto > 0 ? impacto * 1.10 : 20;
  const percentualMeta = impacto > 0 ? Math.min((impacto / meta) * 100, 100) : 0;

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--gradient-mist)' }}>
      <OperatorSidebar />
      
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2" style={{ color: 'white' }}>
            Painel do Operador — GreenCat PRO
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Bem-vindo! Aqui você acompanha impacto, mercados, ofertas e desempenho da sua região licenciada.
          </p>
          {regiaoNome && (
            <p className="text-sm mt-2 mist-glow-text">
              📍 Região: {regiaoNome}
            </p>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Impacto da Região */}
          <Card className="p-6 mist-card mist-card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                background: 'rgba(0, 255, 157, 0.15)',
                border: '2px solid var(--mist-primary)'
              }}>
                <TrendingUp className="w-6 h-6" style={{ color: 'var(--mist-primary)' }} />
              </div>
              <h3 className="text-xl font-bold" style={{ color: 'white' }}>
                Impacto da Região
              </h3>
            </div>
            <div className="space-y-2">
              <p style={{ color: 'var(--text-secondary)' }}>🌱 Comida salva: <span className="mist-glow-text font-bold">{impacto.toFixed(1)} kg</span></p>
              <p style={{ color: 'var(--text-secondary)' }}>♻️ CO₂ evitado: <span className="mist-glow-text font-bold">{co2Evitado.toFixed(1)} kg</span></p>
              <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>Estimativa potencial</p>
            </div>
          </Card>

          {/* Mercados Ativos */}
          <Card className="p-6 mist-card mist-card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                background: 'rgba(0, 255, 157, 0.15)',
                border: '2px solid var(--mist-primary)'
              }}>
                <Store className="w-6 h-6" style={{ color: 'var(--mist-primary)' }} />
              </div>
              <h3 className="text-xl font-bold" style={{ color: 'white' }}>
                Mercados Ativos
              </h3>
            </div>
            <div className="space-y-2">
              <p style={{ color: 'var(--text-secondary)' }}>Total: <span className="mist-glow-text font-bold">{markets.length}</span></p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                {markets.length === 0 ? 'Cadastre mercados parceiros' : 'Mercados cadastrados'}
              </p>
            </div>
          </Card>

          {/* Ofertas Ativas */}
          <Card className="p-6 mist-card mist-card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                background: 'rgba(0, 255, 157, 0.15)',
                border: '2px solid var(--mist-primary)'
              }}>
                <Package className="w-6 h-6" style={{ color: 'var(--mist-primary)' }} />
              </div>
              <h3 className="text-xl font-bold" style={{ color: 'white' }}>
                Ofertas Ativas
              </h3>
            </div>
            <div className="space-y-2">
              <p style={{ color: 'var(--text-secondary)' }}>Ativas: <span className="mist-glow-text font-bold">{ofertasAtivas}</span></p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Total de ofertas: {offers.length}</p>
            </div>
          </Card>

          {/* Metas do Mês */}
          <Card className="p-6 mist-card mist-card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                background: 'rgba(0, 255, 157, 0.15)',
                border: '2px solid var(--mist-primary)'
              }}>
                <Target className="w-6 h-6" style={{ color: 'var(--mist-primary)' }} />
              </div>
              <h3 className="text-xl font-bold" style={{ color: 'white' }}>
                Metas do Mês
              </h3>
            </div>
            <div className="space-y-2">
              <p style={{ color: 'var(--text-secondary)' }}>Meta estimada: <span className="mist-glow-text font-bold">{meta.toFixed(0)} kg</span></p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{percentualMeta.toFixed(0)}% concluído</p>
            </div>
          </Card>

          {/* Conquistas (Gamificação) */}
          <Card className="p-6 mist-card mist-card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                background: 'rgba(0, 255, 157, 0.15)',
                border: '2px solid var(--mist-primary)',
                boxShadow: '0 0 10px rgba(0,255,157,0.3)'
              }}>
                <Award className="w-6 h-6" style={{ color: 'var(--mist-primary)' }} />
              </div>
              <h3 className="text-xl font-bold" style={{ color: 'white' }}>
                Conquistas
              </h3>
            </div>
            <div className="space-y-2">
              <p style={{ color: 'var(--text-secondary)' }}>Sua conquista atual:</p>
              <p className="text-2xl font-black mist-glow-text">{medalhaAtual}</p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                {medalhaAtual === 'GreenMaster' && '🏆 Você é um mestre!'}
                {medalhaAtual === 'Ouro' && '🥇 Continue assim!'}
                {medalhaAtual === 'Prata' && '🥈 Quase lá!'}
                {medalhaAtual === 'Bronze' && '🥉 Bom começo!'}
                {medalhaAtual === 'Iniciante' && '🌱 Continue salvando comida!'}
              </p>
            </div>
          </Card>

          {/* Resumo do Operador */}
          <Card className="p-6 mist-card mist-card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                background: 'rgba(0, 255, 157, 0.15)',
                border: '2px solid var(--mist-primary)'
              }}>
                <User className="w-6 h-6" style={{ color: 'var(--mist-primary)' }} />
              </div>
              <h3 className="text-xl font-bold" style={{ color: 'white' }}>
                Resumo do Operador
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <p style={{ color: 'var(--text-secondary)' }}>
                👤 <span className="font-medium">{user?.email || 'Carregando...'}</span>
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                🌍 {countryName} {stateName && `• ${stateName}`}
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                📍 {regiaoNome}
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                🏪 {markets.length} mercados • 📦 {offers.length} ofertas
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                🏅 {medalhaAtual}
              </p>
              <p className="text-xs pt-2 mist-glow-text font-semibold">
                Status: Licença Ativa
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}