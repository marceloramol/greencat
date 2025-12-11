import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Store, MapPin, Phone, Save, Home, ArrowLeft } from 'lucide-react';

export default function StoreRegister() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'pending' | 'loading' | 'success' | 'error'>('pending');

  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    business_type: '', // tipo de estabelecimento (somente perecíveis)
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zip_code: '',
    latitude: null as number | null,
    longitude: null as number | null
  });

  // Se já tiver loja cadastrada, vai direto para os produtos
  useEffect(() => {
    const storeId = localStorage.getItem('storeId');
    if (storeId) {
      navigate(createPageUrl('StoreProducts'));
    }
  }, [navigate]);

  const handleGetLocation = () => {
    setLocationStatus('loading');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          setLocationStatus('success');
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          setLocationStatus('error');
        }
      );
    } else {
      setLocationStatus('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.business_type) return; // segurança extra

    setIsLoading(true);

    try {
      const countrySelected = localStorage.getItem('countrySelected');
      const stateSelected = localStorage.getItem('stateSelected');
      const regiaoSelecionada = localStorage.getItem('regiaoSelecionada');

      const storeData = {
        ...formData,
        countryId: countrySelected,
        stateId: stateSelected || null,
        regiaoId: regiaoSelecionada
      };

      const store = await base44.entities.Store.create(storeData);
      localStorage.setItem('storeId', store.id);
      navigate(createPageUrl('StoreProducts'));
    } catch (error) {
      console.error('Erro ao cadastrar loja:', error);
    }

    setIsLoading(false);
  };

  const handleChangeProfile = () => {
    localStorage.removeItem('userType');
    navigate(createPageUrl('SelectProfile'));
  };

  // Lista oficial de tipos de loja (somente perecíveis)
  const businessTypes = [
    { value: 'mercado', label: 'Mercado / Minimercado 🛒' },
    { value: 'padaria', label: 'Padaria 🥖' },
    { value: 'acougue', label: 'Açougue 🥩' },
    { value: 'hortifruti', label: 'Hortifruti 🥗' },
    { value: 'mercearia', label: 'Mercearia 🍎' },
    { value: 'conveniencia', label: 'Loja de Conveniência 🛍️' },
    { value: 'lanchonete', label: 'Lanchonete (produtos de balcão) 🍞' },
    { value: 'doceria', label: 'Doceria 🍬' },
    { value: 'supermercado', label: 'Supermercado 🧀' },
    { value: 'restaurante_balcao', label: 'Restaurante com balcão (marmita do dia, etc.) 🍛' },
    { value: 'outro_perecivel', label: 'Outro estabelecimento com venda de alimentos perecíveis 📦' }
  ];

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--gradient-mist)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
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
              style={{
                background: 'white',
                boxShadow: 'var(--shadow-premium)'
              }}
            >
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e84a50dd41f4fd278cf06a/85d0052d0_image.png"
                alt="Gato Verde"
                className="w-full h-full object-cover scale-150"
              />
            </div>
            <div>
              <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                Cadastrar Loja
              </h1>
              <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
                Somente estabelecimentos que vendem <strong>alimentos perecíveis</strong>.
              </p>
            </div>
          </div>

          <Button
            onClick={handleChangeProfile}
            variant="outline"
            style={{
              borderColor: 'var(--mist-border)',
              color: 'var(--text-secondary)'
            }}
          >
            Voltar para área do cliente
          </Button>
        </div>

        {/* Form Card */}
        <Card className="mist-card" style={{ padding: 0 }}>
          <CardHeader
            style={{
              background: 'var(--mist-primary-light)',
              borderBottom: '1px solid var(--mist-border)',
              borderRadius: 'var(--radius-premium) var(--radius-premium) 0 0',
              padding: '24px'
            }}
          >
            <CardTitle
              className="flex items-center gap-2 text-2xl"
              style={{ color: 'var(--text-primary)' }}
            >
              <Store className="w-6 h-6" style={{ color: 'var(--mist-primary)' }} />
              Informações da Loja
            </CardTitle>
          </CardHeader>

          <CardContent style={{ padding: '32px' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome da Loja */}
              <div>
                <Label
                  htmlFor="name"
                  style={{ color: 'var(--text-primary)', fontWeight: 500 }}
                >
                  Nome da Loja
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Mercado do João"
                  required
                  className="mt-2 h-12"
                  style={{
                    border: '1px solid var(--mist-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              {/* Tipo de Estabelecimento */}
              <div>
                <Label
                  htmlFor="business_type"
                  style={{ color: 'var(--text-primary)', fontWeight: 500 }}
                >
                  Tipo de estabelecimento (somente quem vende alimentos/perecíveis)
                </Label>
                <select
                  id="business_type"
                  value={formData.business_type}
                  onChange={(e) =>
                    setFormData({ ...formData, business_type: e.target.value })
                  }
                  required
                  className="mt-2 h-12 w-full px-3 text-sm md:text-base"
                  style={{
                    background: 'white',
                    border: '1px solid var(--mist-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="">Selecione uma opção...</option>
                  {businessTypes.map((bt) => (
                    <option key={bt.value} value={bt.value}>
                      {bt.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                  Se você presta serviços (barbearia, oficina, etc.), use o aplicativo Eu Resolvo
                  ou outro sistema dedicado. O Gato Verde é focado em <strong>produtos perecíveis</strong>.
                </p>
              </div>

              {/* WhatsApp */}
              <div>
                <Label
                  htmlFor="whatsapp"
                  className="flex items-center gap-2"
                  style={{ color: 'var(--text-primary)', fontWeight: 500 }}
                >
                  <Phone className="w-4 h-4" style={{ color: 'var(--mist-primary)' }} />
                  WhatsApp (com DDD)
                </Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp: e.target.value })
                  }
                  placeholder="Ex: 11999887766"
                  required
                  className="mt-2 h-12"
                  style={{
                    border: '1px solid var(--mist-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)'
                  }}
                />
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  Este WhatsApp é usado para contato operacional. Você decide se ele será
                  exibido ou não para os clientes nas ofertas.
                </p>
              </div>

              {/* Endereço */}
              <div
                style={{
                  borderTop: '1px solid var(--mist-border)',
                  paddingTop: '24px'
                }}
              >
                <h3
                  className="text-lg font-semibold mb-4 flex items-center gap-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <Home className="w-5 h-5" style={{ color: 'var(--mist-primary)' }} />
                  Endereço Completo
                </h3>

                {/* CEP */}
                <div className="mb-4">
                  <Label
                    htmlFor="zip_code"
                    style={{ color: 'var(--text-primary)', fontWeight: 500 }}
                  >
                    CEP
                  </Label>
                  <Input
                    id="zip_code"
                    value={formData.zip_code}
                    onChange={(e) =>
                      setFormData({ ...formData, zip_code: e.target.value })
                    }
                    placeholder="Ex: 01234-567"
                    required
                    className="mt-2 h-12"
                    style={{
                      border: '1px solid var(--mist-border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                {/* Rua + Número */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="col-span-2">
                    <Label
                      htmlFor="street"
                      style={{ color: 'var(--text-primary)', fontWeight: 500 }}
                    >
                      Rua/Avenida
                    </Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) =>
                        setFormData({ ...formData, street: e.target.value })
                      }
                      placeholder="Ex: Av. Paulista"
                      required
                      className="mt-2 h-12"
                      style={{
                        border: '1px solid var(--mist-border)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="number"
                      style={{ color: 'var(--text-primary)', fontWeight: 500 }}
                    >
                      Número
                    </Label>
                    <Input
                      id="number"
                      value={formData.number}
                      onChange={(e) =>
                        setFormData({ ...formData, number: e.target.value })
                      }
                      placeholder="Ex: 123"
                      required
                      className="mt-2 h-12"
                      style={{
                        border: '1px solid var(--mist-border)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                </div>

                {/* Bairro */}
                <div className="mb-4">
                  <Label
                    htmlFor="neighborhood"
                    style={{ color: 'var(--text-primary)', fontWeight: 500 }}
                  >
                    Bairro
                  </Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) =>
                      setFormData({ ...formData, neighborhood: e.target.value })
                    }
                    placeholder="Ex: Centro"
                    required
                    className="mt-2 h-12"
                    style={{
                      border: '1px solid var(--mist-border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                {/* Cidade + Estado */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Label
                      htmlFor="city"
                      style={{ color: 'var(--text-primary)', fontWeight: 500 }}
                    >
                      Cidade
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="Ex: São Paulo"
                      required
                      className="mt-2 h-12"
                      style={{
                        border: '1px solid var(--mist-border)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="state"
                      style={{ color: 'var(--text-primary)', fontWeight: 500 }}
                    >
                      Estado
                    </Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      placeholder="Ex: SP"
                      required
                      maxLength={2}
                      className="mt-2 h-12 uppercase"
                      style={{
                        border: '1px solid var(--mist-border)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* GPS */}
              <div
                className="p-6"
                style={{
                  background: 'var(--mist-primary-light)',
                  border: '1px solid var(--mist-border)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <Label
                  className="flex items-center gap-2 mb-3"
                  style={{ color: 'var(--text-primary)', fontWeight: 500 }}
                >
                  <MapPin className="w-5 h-5" style={{ color: 'var(--mist-primary)' }} />
                  Localização GPS (Obrigatório)
                </Label>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Necessário para que clientes vejam a distância até sua loja.
                </p>

                <Button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locationStatus === 'loading' || locationStatus === 'success'}
                  className="w-full h-12"
                  style={{
                    background:
                      locationStatus === 'success' ? 'var(--mist-primary)' : 'white',
                    color:
                      locationStatus === 'success'
                        ? 'white'
                        : 'var(--text-primary)',
                    border: '1px solid var(--mist-border)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  {locationStatus === 'loading' && 'Obtendo localização...'}
                  {locationStatus === 'success' && '✓ Localização capturada'}
                  {locationStatus === 'pending' && 'Capturar localização GPS'}
                  {locationStatus === 'error' && 'Tentar novamente'}
                </Button>

                {locationStatus === 'error' && (
                  <p
                    className="text-sm mt-2"
                    style={{ color: 'var(--mist-error)' }}
                  >
                    Erro ao obter localização. Verifique as permissões do navegador.
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={
                  isLoading || locationStatus !== 'success' || !formData.business_type
                }
                className="w-full h-14 text-lg font-semibold disabled:opacity-50"
                style={{
                  background: 'var(--mist-charcoal)',
                  color: 'white',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-premium)'
                }}
              >
                <Save className="w-5 h-5 mr-2" />
                {isLoading ? 'Cadastrando...' : 'Cadastrar Loja'}
              </Button>

              {locationStatus !== 'success' && (
                <p
                  className="text-center text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  É necessário capturar a localização GPS antes de cadastrar
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p
            className="text-sm font-medium mb-1"
            style={{ color: 'var(--mist-primary)' }}
          >
            ♻️ Gato Verde — Menos lixo, mais amor.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Projeto piloto em fase comunitária
          </p>
        </div>
      </div>
    </div>
  );
}

