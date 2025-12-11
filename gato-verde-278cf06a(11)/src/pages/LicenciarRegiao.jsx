import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Calendar, Check, Lock } from 'lucide-react';

export default function LicenciarRegiao() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedRegiao, setSelectedRegiao] = useState(null);
  const [selectedPlano, setSelectedPlano] = useState('mensal');

  const countrySelected = localStorage.getItem('countrySelected');
  const stateSelected = localStorage.getItem('stateSelected');

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
    initialData: null
  });

  const { data: regioes = [] } = useQuery({
    queryKey: ['regioes-licenciamento', countrySelected, stateSelected],
    queryFn: async () => {
      const allRegioes = await base44.entities.Regiao.list();
      return allRegioes.filter(r => {
        if (r.countryId !== countrySelected) return false;
        if (stateSelected && r.stateId !== stateSelected) return false;
        return r.ativa;
      });
    },
    enabled: !!countrySelected,
    initialData: []
  });

  const { data: licencas = [] } = useQuery({
    queryKey: ['licencas'],
    queryFn: () => base44.entities.Licenca.list(),
    initialData: []
  });

  const criarLicencaMutation = useMutation({
    mutationFn: (data) => base44.entities.Licenca.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licencas'] });
      navigate(createPageUrl('MinhaLicenca'));
    }
  });

  const planos = {
    mensal: { label: 'Mensal', valor: 297, duracao: 1 },
    anual: { label: 'Anual', valor: 2970, duracao: 12 },
    cidade: { label: 'Cidade', valor: 597, duracao: 1 },
    estado: { label: 'Estado', valor: 1497, duracao: 1 },
    pais: { label: 'País', valor: 4997, duracao: 1 }
  };

  const handleAssinarLicenca = () => {
    if (!selectedRegiao || !user) return;

    const inicio = new Date();
    const fim = new Date();
    fim.setMonth(fim.getMonth() + planos[selectedPlano].duracao);

    const licencaData = {
      countryId: selectedRegiao.countryId,
      stateId: selectedRegiao.stateId || null,
      regiaoId: selectedRegiao.id,
      operadorId: user.email,
      plano: selectedPlano,
      valor: planos[selectedPlano].valor,
      status: 'pendente',
      inicio: inicio.toISOString(),
      fim: fim.toISOString()
    };

    criarLicencaMutation.mutate(licencaData);
  };

  const getRegiaoStatus = (regiao) => {
    const licencaAtiva = licencas.find(l => l.regiaoId === regiao.id && l.status === 'ativo');
    if (licencaAtiva) return 'licenciada';
    if (regiao.operadorId) return 'ocupada';
    return 'disponivel';
  };

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--gradient-mist)', animation: 'fadeIn 0.32s ease forwards' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-2" style={{ color: 'white' }}>
            📋 Licenciar Região
          </h1>
          <p className="text-xl mist-glow-text">
            Escolha sua região e comece a operar
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Lista de Regiões */}
          <div className="lg:col-span-2">
            <Card className="p-6 mist-card" style={{ animation: 'fadeIn 0.32s ease forwards' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'white' }}>
                Regiões Disponíveis
              </h2>
              
              <div className="space-y-4">
                {regioes.map((regiao) => {
                  const status = getRegiaoStatus(regiao);
                  return (
                    <div
                      key={regiao.id}
                      onClick={() => status === 'disponivel' && setSelectedRegiao(regiao)}
                      className={`p-5 rounded-xl cursor-pointer ${
                        selectedRegiao?.id === regiao.id ? 'ring-2 ring-[var(--mist-primary)]' : ''
                      }`}
                      style={{
                        background: status === 'disponivel' ? 'rgba(0, 255, 157, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${selectedRegiao?.id === regiao.id ? 'var(--mist-primary)' : 'var(--mist-border)'}`,
                        opacity: status === 'disponivel' ? 1 : 0.6,
                        transition: 'all 0.18s ease-out'
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-1" style={{ color: 'white' }}>
                            {regiao.nome}
                          </h3>
                          <p className="text-sm mb-2" style={{ color: 'var(--text-tertiary)' }}>
                            {regiao.tipo} • {regiao.pais}
                          </p>
                          {regiao.limites && (
                            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                              📍 {regiao.limites}
                            </p>
                          )}
                        </div>
                        <Badge
                          className={
                            status === 'disponivel'
                              ? 'bg-[rgba(255,255,255,0.12)] text-white'
                              : 'bg-[rgba(0,255,157,0.14)] text-[var(--mist-primary)]'
                          }
                        >
                          {status === 'disponivel' ? (
                            <>
                              <MapPin className="w-3 h-3 mr-1" />
                              Disponível
                            </>
                          ) : status === 'licenciada' ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Licenciada
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 mr-1" />
                              Ocupada
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Painel de Licenciamento */}
          <div>
            <Card className="p-6 mist-card sticky top-6" style={{ animation: 'fadeIn 0.34s ease forwards' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: 'white' }}>
                Escolha seu Plano
              </h2>

              {selectedRegiao ? (
                <>
                  <div className="mb-6 p-4 rounded-xl" style={{
                    background: 'rgba(0, 255, 157, 0.05)',
                    border: '1px solid var(--mist-border)'
                  }}>
                    <p className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>Região Selecionada</p>
                    <h3 className="text-lg font-bold" style={{ color: 'white' }}>{selectedRegiao.nome}</h3>
                  </div>

                  <div className="space-y-3 mb-6">
                    {Object.entries(planos).map(([key, plano]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedPlano(key)}
                        className="w-full p-4 rounded-xl text-left"
                        style={{
                          background: selectedPlano === key ? 'rgba(0, 255, 157, 0.12)' : 'rgba(0, 255, 157, 0.03)',
                          border: `2px solid ${selectedPlano === key ? 'var(--mist-primary)' : 'var(--mist-border)'}`,
                          transition: 'all 0.18s ease-out'
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold mb-1" style={{ color: 'white' }}>{plano.label}</h4>
                            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                              {plano.duracao === 1 ? '1 mês' : `${plano.duracao} meses`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-black mist-glow-text">
                              R$ {plano.valor}
                            </p>
                            {key === 'anual' && (
                              <p className="text-xs" style={{ color: 'var(--mist-primary)' }}>
                                Economize 17%
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mb-6 p-4 rounded-xl" style={{
                    background: 'rgba(0, 255, 157, 0.05)',
                    border: '1px solid var(--mist-border)'
                  }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4" style={{ color: 'var(--mist-primary)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Duração: {planos[selectedPlano].duracao} {planos[selectedPlano].duracao === 1 ? 'mês' : 'meses'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" style={{ color: 'var(--mist-primary)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Total: R$ {planos[selectedPlano].valor}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleAssinarLicenca}
                    className="w-full mist-button-primary"
                    disabled={criarLicencaMutation.isLoading}
                  >
                    {criarLicencaMutation.isLoading ? 'Processando...' : 'Assinar Licença'}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--mist-primary)', opacity: 0.3 }} />
                  <p style={{ color: 'var(--text-tertiary)' }}>
                    Selecione uma região disponível para continuar
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8" style={{ borderTop: '1px solid var(--mist-border)' }}>
          <p className="text-sm font-medium mb-2 mist-glow-text">
            ♻️ Gato Verde – Menos lixo, mais amor.
          </p>
        </div>
      </div>
    </div>
  );
}