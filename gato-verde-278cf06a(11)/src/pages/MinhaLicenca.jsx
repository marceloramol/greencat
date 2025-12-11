import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';
import OperadorSidebar from '../components/operador/OperadorSidebar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function MinhaLicenca() {
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: licencas = [] } = useQuery({
    queryKey: ['minhas-licencas', user?.email],
    queryFn: async () => {
      const allLicencas = await base44.entities.Licenca.list();
      return allLicencas.filter(l => l.operadorId === user?.email);
    },
    enabled: !!user,
    initialData: []
  });

  const { data: regioes = [] } = useQuery({
    queryKey: ['regioes-licencas'],
    queryFn: () => base44.entities.Regiao.list(),
    initialData: []
  });

  const getRegiaoName = (regiaoId) => {
    const regiao = regioes.find(r => r.id === regiaoId);
    return regiao ? regiao.nome : 'Região';
  };

  const getStatusBadge = (status) => {
    if (status === 'ativo') {
      return (
        <Badge className="bg-[var(--mist-primary)] text-[var(--mist-dark)]">
          <CheckCircle className="w-3 h-3 mr-1" />
          Ativo
        </Badge>
      );
    } else if (status === 'pendente') {
      return (
        <Badge className="bg-[var(--mist-warning)] text-white">
          <Clock className="w-3 h-3 mr-1" />
          Pendente
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-[var(--mist-error)] text-white">
          <XCircle className="w-3 h-3 mr-1" />
          Expirado
        </Badge>
      );
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--gradient-mist)' }}>
      <OperadorSidebar />
      
      <div className="flex-1 p-8" style={{ animation: 'fadeIn 0.32s ease forwards' }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-black mb-2" style={{ color: 'white' }}>
              💳 Minha Licença
            </h1>
            <p className="text-xl mist-glow-text">
              Gerencie suas licenças ativas
            </p>
          </div>

          {licencas.length === 0 ? (
            <Card className="p-12 text-center mist-card">
              <CreditCard className="w-20 h-20 mx-auto mb-4" style={{ color: 'var(--mist-primary)', opacity: 0.3 }} />
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'white' }}>
                Nenhuma licença encontrada
              </h3>
              <p className="mb-6" style={{ color: 'var(--text-tertiary)' }}>
                Você ainda não possui nenhuma licença ativa
              </p>
              <Button onClick={() => navigate(createPageUrl('LicenciarRegiao'))} className="mist-button-primary">
                Licenciar Região
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {licencas.map((licenca) => (
                <Card key={licenca.id} className="p-6 mist-card">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{
                        background: 'rgba(0, 255, 157, 0.15)',
                        border: '2px solid var(--mist-primary)'
                      }}>
                        <MapPin className="w-8 h-8" style={{ color: 'var(--mist-primary)' }} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold mb-1" style={{ color: 'white' }}>
                          {getRegiaoName(licenca.regiaoId)}
                        </h2>
                        <p style={{ color: 'var(--text-tertiary)' }}>
                          Plano {licenca.plano}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(licenca.status)}
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="p-4 rounded-xl" style={{
                      background: 'rgba(0, 255, 157, 0.05)',
                      border: '1px solid var(--mist-border)'
                    }}>
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-4 h-4" style={{ color: 'var(--mist-primary)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
                          Valor
                        </span>
                      </div>
                      <p className="text-2xl font-black mist-glow-text">
                        R$ {licenca.valor.toFixed(2)}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl" style={{
                      background: 'rgba(0, 255, 157, 0.05)',
                      border: '1px solid var(--mist-border)'
                    }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4" style={{ color: 'var(--mist-primary)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
                          Início
                        </span>
                      </div>
                      <p className="text-lg font-bold" style={{ color: 'white' }}>
                        {format(new Date(licenca.inicio), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl" style={{
                      background: 'rgba(0, 255, 157, 0.05)',
                      border: '1px solid var(--mist-border)'
                    }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4" style={{ color: 'var(--mist-primary)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
                          Término
                        </span>
                      </div>
                      <p className="text-lg font-bold" style={{ color: 'white' }}>
                        {format(new Date(licenca.fim), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {licenca.status === 'pendente' && (
                      <Button className="mist-button-primary">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pagar Agora
                      </Button>
                    )}
                    {licenca.status === 'expirado' && (
                      <Button className="mist-button-primary">
                        Renovar Licença
                      </Button>
                    )}
                    {licenca.status === 'ativo' && (
                      <Button className="mist-button-secondary">
                        Gerenciar Plano
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Info adicional */}
          <Card className="p-6 mt-6 mist-card" style={{
            background: 'rgba(0, 255, 157, 0.05)',
            border: '1px solid var(--mist-primary)'
          }}>
            <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--mist-primary)' }}>
              💡 Informações Importantes
            </h3>
            <ul className="space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <li>• Licenças pendentes aguardam confirmação de pagamento</li>
              <li>• Ao ativar, você terá acesso exclusivo à região escolhida</li>
              <li>• Renove antes do vencimento para manter sua operação ativa</li>
              <li>• Em caso de dúvidas, entre em contato com o suporte</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}