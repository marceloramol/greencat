import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Store, MapPin, Phone, Save, Home, ArrowLeft } from 'lucide-react';

export default function MarketRegister() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('pending');

  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    business_type: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zip_code: '',
    latitude: null,
    longitude: null
  });

  useEffect(() => {
    const marketId = localStorage.getItem('marketId');
    if (marketId) {
      navigate(createPageUrl('MarketOffers'));
    }
  }, [navigate]);

  const handleGetLocation = () => {
    setLocationStatus('loading');

    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData({
          ...formData,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
        setLocationStatus('success');
      },
      () => setLocationStatus('error')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.business_type) return;

    setIsLoading(true);

    try {
      const countrySelected = localStorage.getItem('countrySelected');
      const stateSelected = localStorage.getItem('stateSelected');
      const regiaoSelecionada = localStorage.getItem('regiaoSelecionada');

      const payload = {
        ...formData,
        countryId: countrySelected,
        stateId: stateSelected || null,
        regiaoId: regiaoSelecionada
      };

      const created = await base44.entities.Market.create(payload);

      localStorage.setItem('marketId', created.id);

      navigate(createPageUrl('MarketOffers'));
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  const businessTypes = [
    { value: 'mercado', label: 'Mercado / Minimercado 🛒' },
    { value: 'padaria', label: 'Padaria 🥖' },
    { value: 'acougue', label: 'Açougue 🥩' },
    { value: 'hortifruti', label: 'Hortifruti 🥗' },
    { value: 'mercearia', label: 'Mercearia 🍎' },
    { value: 'conveniencia', label: 'Loja de Conveniência 🛍️' },
    { value: 'lanchonete', label: 'Lanchonete (produtos do dia) 🍞' },
    { value: 'doceria', label: 'Doceria 🍬' },
    { value: 'supermercado', label: 'Supermercado 🧀' },
    { value: 'restaurante_balcao', label: 'Restaurante com balcão 🍛' },
    { value: 'outro_perecivel', label: 'Outro — desde que venda alimentos perecíveis 📦' }
  ];

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--gradient-mist)' }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <Button
          onClick={() => navigate(createPageUrl('SelectProfile'))}
          variant="ghost"
          className="mb-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
            style={{ background: 'white', boxShadow: 'var(--shadow-premium)' }}
          >
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e84a50dd41f4fd278cf06a/85d0052d0_image.png"
              alt="Gato Verde"
              className="w-full h-full object-cover scale-150"
            />
          </div>
          <div>
            <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Cadastrar Mercado
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Para estabelecimentos que vendem <strong>alimentos perecíveis</strong>.
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="mist-card" style={{ padding: 0 }}>
          <CardHeader
            style={{
              background: 'var(--mist-primary-light)',
              borderBottom: '1px solid var(--mist-border)',
              borderRadius: 'var(--radius-premium) var(--radius-premium) 0 0',
              padding: 24
            }}
          >
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Store className="w-6 h-6" style={{ color: 'var(--mist-primary)' }} />
              Informações do Mercado
            </CardTitle>
          </CardHeader>

          <CardContent style={{ padding: 32 }}>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Nome */}
              <div>
                <Label>Nome do Mercado</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Supermercado Bons Amigos"
                  required
                />
              </div>

              {/* Tipo */}
              <div>
                <Label>Tipo de estabelecimento</Label>

                <select
                  value={formData.business_type}
                  onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                  required
                  className="mt-2 h-12 w-full px-3"
                  style={{
                    background: 'white',
                    border: '1px solid var(--mist-border)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <option value="">Selecione...</option>
                  {businessTypes.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>

                <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                  Se você presta serviços (barbearia, oficina, estética etc.), use um app dedicado.
                  O Gato Verde é focado em <strong>produtos perecíveis</strong>.
                </p>
              </div>

              {/* WhatsApp */}
              <div>
                <Label className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  WhatsApp (com DDD)
                </Label>
                <Input
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="11999887766"
                  required
                />
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  Este número só aparecerá nas ofertas **se você escolher**.
                </p>
              </div>

              {/* Endereço */}
              <div style={{ borderTop: '1px solid var(--mist-border)', paddingTop: 24 }}>
                <h3 className="text-lg font-semibold mb-4">Endereço Completo</h3>

                <Label>CEP</Label>
                <Input
                  value={formData.zip_code}
                  onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                  required
                />

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="col-span-2">
                    <Label>Rua / Avenida</Label>
                    <Input
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label>Número</Label>
                    <Input
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label>Bairro</Label>
                  <Input
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="col-span-2">
                    <Label>Cidade</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label>Estado</Label>
                    <Input
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      maxLength={2}
                      className="uppercase"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* GPS */}
              <div
                className="p-6 mt-4"
                style={{
                  background: 'var(--mist-primary-light)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--mist-border)'
                }}
              >
                <Label className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5" />
                  Localização GPS (Obrigatória)
                </Label>

                <Button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locationStatus === 'loading' || locationStatus === 'success'}
                  className="w-full h-12"
                >
                  {locationStatus === 'loading' && 'Obtendo localização...'}
                  {locationStatus === 'success' && '✓ Localização capturada'}
                  {locationStatus === 'pending' && 'Capturar localização'}
                  {locationStatus === 'error' && 'Tentar novamente'}
                </Button>

                {locationStatus === 'error' && (
                  <p className="text-sm mt-2" style={{ color: 'var(--mist-error)' }}>
                    Erro ao obter localização. Verifique permissões do navegador.
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading || locationStatus !== 'success' || !formData.business_type}
                className="w-full h-14 text-lg font-semibold"
                style={{
                  background: 'var(--mist-charcoal)',
                  color: 'white',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <Save className="w-5 h-5 mr-2" />
                {isLoading ? 'Cadastrando...' : 'Cadastrar Mercado'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p style={{ color: 'var(--mist-primary)' }}>♻️ Gato Verde — Menos lixo, mais amor.</p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Projeto piloto em fase comunitária
          </p>
        </div>
      </div>
    </div>
  );
}

