import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import OperatorSidebar from '../components/operator/OperatorSidebar';
import { Trophy, Award, TrendingUp } from 'lucide-react';

function calcularImpacto(ofertas) {
  return ofertas.length * 0.8;
}

function getMedalIcon(posicao) {
  if (posicao === 1) return '🥇';
  if (posicao === 2) return '🥈';
  if (posicao === 3) return '🥉';
  return '🏅';
}

export default function ImpactRanking() {
  const { data: licencas = [] } = useQuery({
    queryKey: ['licencas-ranking'],
    queryFn: () => base44.entities.Licenca.list(),
    initialData: []
  });

  const { data: offers = [] } = useQuery({
    queryKey: ['offers-ranking'],
    queryFn: () => base44.entities.Offer.list(),
    initialData: []
  });

  const { data: regioes = [] } = useQuery({
    queryKey: ['regioes-ranking'],
    queryFn: () => base44.entities.Regiao.list(),
    initialData: []
  });

  // Calcular ranking por operador
  const licencasAtivas = licencas.filter(l => l.status === 'ativo');
  
  const ranking = licencasAtivas.map(licenca => {
    const ofertasOperador = offers.filter(o => o.regiaoId === licenca.regiaoId);
    const impacto = calcularImpacto(ofertasOperador);
    const regiao = regioes.find(r => r.id === licenca.regiaoId);
    
    return {
      operadorId: licenca.operadorId,
      regiaoNome: regiao?.nome || 'Região',
      impacto: impacto,
      ofertas: ofertasOperador.length
    };
  }).sort((a, b) => b.impacto - a.impacto);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--gradient-mist)' }}>
      <OperatorSidebar />
      
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-10 h-10" style={{ color: 'var(--mist-primary)' }} />
            <div>
              <h1 className="text-4xl font-black" style={{ color: 'white' }}>
                Ranking de Impacto — Operadores GreenCat
              </h1>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Os operadores que mais salvam alimentos e geram impacto positivo.
              </p>
            </div>
          </div>
        </div>

        {/* Top 3 - Destaque */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {ranking.slice(0, 3).map((item, index) => (
            <Card 
              key={index}
              className="p-6 text-center mist-card"
              style={{
                background: index === 0 
                  ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, transparent 100%)'
                  : index === 1
                  ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.15) 0%, transparent 100%)'
                  : 'linear-gradient(135deg, rgba(205, 127, 50, 0.15) 0%, transparent 100%)',
                border: index === 0 
                  ? '2px solid #FFD700'
                  : index === 1
                  ? '2px solid #C0C0C0'
                  : '2px solid #CD7F32',
                boxShadow: '0 0 20px rgba(0, 255, 157, 0.2)'
              }}
            >
              <div className="text-6xl mb-4">{getMedalIcon(index + 1)}</div>
              <h3 className="text-2xl font-black mb-2 mist-glow-text">#{index + 1}</h3>
              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                {item.regiaoNome}
              </p>
              <p className="text-4xl font-black mb-2" style={{ 
                color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'
              }}>
                {item.impacto.toFixed(1)} kg
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {item.ofertas} ofertas criadas
              </p>
            </Card>
          ))}
        </div>

        {/* Demais Operadores */}
        {ranking.length > 3 && (
          <Card className="p-6 mist-card">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'white' }}>
              <TrendingUp className="w-6 h-6" style={{ color: 'var(--mist-primary)' }} />
              Outros Operadores
            </h2>
            <div className="space-y-4">
              {ranking.slice(3).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg mist-card-hover"
                  style={{
                    background: 'rgba(0, 255, 157, 0.05)',
                    border: '1px solid var(--mist-border)'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold" style={{ color: 'var(--text-tertiary)' }}>
                      #{index + 4}
                    </span>
                    <div>
                      <p className="font-semibold" style={{ color: 'white' }}>{item.regiaoNome}</p>
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {item.ofertas} ofertas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black mist-glow-text">{item.impacto.toFixed(1)} kg</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>impacto gerado</p>
                  </div>
                  {/* Barra de progresso */}
                  <div className="w-32 h-2 rounded-full ml-4" style={{ background: 'var(--mist-border)' }}>
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        background: 'var(--mist-primary)',
                        width: `${Math.min((item.impacto / (ranking[0]?.impacto || 1)) * 100, 100)}%`,
                        boxShadow: '0 0 8px rgba(0, 255, 157, 0.5)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {ranking.length === 0 && (
          <Card className="p-12 text-center mist-card">
            <Award className="w-20 h-20 mx-auto mb-4" style={{ color: 'var(--mist-primary)', opacity: 0.3 }} />
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'white' }}>
              Nenhum operador no ranking ainda
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Seja o primeiro a gerar impacto!
            </p>
          </Card>
        )}

        {/* Info Card */}
        <Card className="p-6 mist-card mt-8" style={{
          background: 'rgba(0, 255, 157, 0.05)',
          border: '1px solid var(--mist-primary)'
        }}>
          <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--mist-primary)' }}>
            🏆 Como funciona o ranking
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            O ranking é calculado com base no impacto estimado de cada operador,
            medido pela quantidade de ofertas criadas e o potencial de comida salva.
            Quanto mais você atua, maior seu impacto ESG e melhor sua posição!
          </p>
        </Card>
      </div>
    </div>
  );
}