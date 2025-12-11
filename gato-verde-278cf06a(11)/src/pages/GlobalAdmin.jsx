import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin, Map, Users, Plus, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function GlobalAdmin() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('countries');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const { data: countries = [] } = useQuery({
    queryKey: ['countries'],
    queryFn: () => base44.entities.Country.list(),
    initialData: []
  });

  const { data: states = [] } = useQuery({
    queryKey: ['states'],
    queryFn: () => base44.entities.State.list(),
    initialData: []
  });

  const { data: regions = [] } = useQuery({
    queryKey: ['regions'],
    queryFn: () => base44.entities.Regiao.list(),
    initialData: []
  });

  const createCountryMutation = useMutation({
    mutationFn: (data) => base44.entities.Country.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      setShowForm(false);
      setFormData({});
    }
  });

  const createStateMutation = useMutation({
    mutationFn: (data) => base44.entities.State.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['states'] });
      setShowForm(false);
      setFormData({});
    }
  });

  const createRegionMutation = useMutation({
    mutationFn: (data) => base44.entities.Regiao.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regions'] });
      setShowForm(false);
      setFormData({});
    }
  });

  const updateRegionMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Regiao.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regions'] });
    }
  });

  const deleteCountryMutation = useMutation({
    mutationFn: (id) => base44.entities.Country.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['countries'] })
  });

  const deleteStateMutation = useMutation({
    mutationFn: (id) => base44.entities.State.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['states'] })
  });

  const deleteRegionMutation = useMutation({
    mutationFn: (id) => base44.entities.Regiao.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['regions'] })
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'countries') {
      createCountryMutation.mutate(formData);
    } else if (activeTab === 'states') {
      createStateMutation.mutate(formData);
    } else if (activeTab === 'regions') {
      createRegionMutation.mutate({
        ...formData,
        ativa: true
      });
    }
  };

  const handleToggleRegionStatus = (region) => {
    updateRegionMutation.mutate({
      id: region.id,
      data: { ...region, ativa: !region.ativa }
    });
  };

  const handleDelete = (id) => {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    
    if (activeTab === 'countries') {
      deleteCountryMutation.mutate(id);
    } else if (activeTab === 'states') {
      deleteStateMutation.mutate(id);
    } else if (activeTab === 'regions') {
      deleteRegionMutation.mutate(id);
    }
  };

  const getCountryName = (countryId) => {
    const country = countries.find(c => c.id === countryId);
    return country ? country.name : countryId;
  };

  const getStateName = (stateId) => {
    const state = states.find(s => s.id === stateId);
    return state ? state.name : stateId;
  };

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--gradient-mist)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2" style={{ color: 'white' }}>
            🌍 Global Admin
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Gerenciar países, estados e regiões
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 mist-card" style={{ padding: '4px' }}>
            <TabsTrigger value="countries" className="data-[state=active]:bg-[var(--mist-primary)] data-[state=active]:text-[var(--mist-dark)]">
              <Globe className="w-4 h-4 mr-2" />
              Países
            </TabsTrigger>
            <TabsTrigger value="states" className="data-[state=active]:bg-[var(--mist-primary)] data-[state=active]:text-[var(--mist-dark)]">
              <Map className="w-4 h-4 mr-2" />
              Estados
            </TabsTrigger>
            <TabsTrigger value="regions" className="data-[state=active]:bg-[var(--mist-primary)] data-[state=active]:text-[var(--mist-dark)]">
              <MapPin className="w-4 h-4 mr-2" />
              Regiões
            </TabsTrigger>
          </TabsList>

          {/* Countries Tab */}
          <TabsContent value="countries">
            <div className="mb-6">
              <Button onClick={() => setShowForm(!showForm)} className="mist-button-primary">
                <Plus className="w-4 h-4 mr-2" />
                Novo País
              </Button>
            </div>

            {showForm && activeTab === 'countries' && (
              <Card className="p-6 mb-6 mist-card">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label className="mist-label">Nome do País</Label>
                    <Input
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Brasil"
                      required
                      className="mist-input"
                    />
                  </div>
                  <div>
                    <Label className="mist-label">Código (ISO)</Label>
                    <Input
                      value={formData.code || ''}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="BR"
                      required
                      maxLength={2}
                      className="mist-input"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" onClick={() => setShowForm(false)} className="mist-button-secondary">
                      Cancelar
                    </Button>
                    <Button type="submit" className="mist-button-primary">
                      Criar País
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {countries.map((country) => (
                <Card key={country.id} className="p-4 mist-card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: 'white' }}>{country.name}</h3>
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{country.code}</p>
                    </div>
                    <Button
                      onClick={() => handleDelete(country.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* States Tab */}
          <TabsContent value="states">
            <div className="mb-6">
              <Button onClick={() => setShowForm(!showForm)} className="mist-button-primary">
                <Plus className="w-4 h-4 mr-2" />
                Novo Estado
              </Button>
            </div>

            {showForm && activeTab === 'states' && (
              <Card className="p-6 mb-6 mist-card">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label className="mist-label">País</Label>
                    <select
                      value={formData.countryId || ''}
                      onChange={(e) => setFormData({ ...formData, countryId: e.target.value })}
                      required
                      className="mist-input w-full"
                    >
                      <option value="">Selecione um país</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="mist-label">Nome do Estado</Label>
                    <Input
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="São Paulo"
                      required
                      className="mist-input"
                    />
                  </div>
                  <div>
                    <Label className="mist-label">Código</Label>
                    <Input
                      value={formData.code || ''}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="SP"
                      required
                      className="mist-input"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" onClick={() => setShowForm(false)} className="mist-button-secondary">
                      Cancelar
                    </Button>
                    <Button type="submit" className="mist-button-primary">
                      Criar Estado
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {states.map((state) => (
                <Card key={state.id} className="p-4 mist-card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: 'white' }}>{state.name}</h3>
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {state.code} • {getCountryName(state.countryId)}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDelete(state.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Regions Tab */}
          <TabsContent value="regions">
            <div className="mb-6">
              <Button onClick={() => setShowForm(!showForm)} className="mist-button-primary">
                <Plus className="w-4 h-4 mr-2" />
                Nova Região
              </Button>
            </div>

            {showForm && activeTab === 'regions' && (
              <Card className="p-6 mb-6 mist-card">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label className="mist-label">País</Label>
                    <select
                      value={formData.countryId || ''}
                      onChange={(e) => setFormData({ ...formData, countryId: e.target.value })}
                      required
                      className="mist-input w-full"
                    >
                      <option value="">Selecione um país</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="mist-label">Estado (opcional)</Label>
                    <select
                      value={formData.stateId || ''}
                      onChange={(e) => setFormData({ ...formData, stateId: e.target.value })}
                      className="mist-input w-full"
                    >
                      <option value="">Sem estado específico</option>
                      {states.filter(s => s.countryId === formData.countryId).map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="mist-label">Nome da Região</Label>
                    <Input
                      value={formData.nome || ''}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Florianópolis Centro"
                      required
                      className="mist-input"
                    />
                  </div>
                  <div>
                    <Label className="mist-label">Tipo</Label>
                    <select
                      value={formData.tipo || 'cidade'}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                      className="mist-input w-full"
                    >
                      <option value="bairro">Bairro</option>
                      <option value="cidade">Cidade</option>
                      <option value="estado">Estado</option>
                      <option value="regiao">Região</option>
                    </select>
                  </div>
                  <div>
                    <Label className="mist-label">Descrição dos limites</Label>
                    <Input
                      value={formData.limites || ''}
                      onChange={(e) => setFormData({ ...formData, limites: e.target.value })}
                      placeholder="Centro e adjacências"
                      className="mist-input"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" onClick={() => setShowForm(false)} className="mist-button-secondary">
                      Cancelar
                    </Button>
                    <Button type="submit" className="mist-button-primary">
                      Criar Região
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regions.map((region) => (
                <Card key={region.id} className="p-4 mist-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1" style={{ color: 'white' }}>{region.nome}</h3>
                      <p className="text-sm mb-2" style={{ color: 'var(--text-tertiary)' }}>
                        {region.tipo} • {getCountryName(region.countryId)}
                        {region.stateId && ` • ${getStateName(region.stateId)}`}
                      </p>
                      {region.limites && (
                        <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>
                          📍 {region.limites}
                        </p>
                      )}
                      <div className="flex gap-2 mb-2">
                        <Badge className={region.ativa ? 'mist-badge-available' : 'mist-badge-occupied'}>
                          {region.ativa ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Ativa
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              Inativa
                            </>
                          )}
                        </Badge>
                        {region.operadorId && (
                          <Badge className="mist-badge-occupied">
                            <Users className="w-3 h-3 mr-1" />
                            Ocupada
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleToggleRegionStatus(region)}
                      className="flex-1 mist-button-secondary text-sm"
                      size="sm"
                    >
                      {region.ativa ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button
                      onClick={() => handleDelete(region.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}