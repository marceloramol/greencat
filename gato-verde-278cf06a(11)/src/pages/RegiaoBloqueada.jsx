import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft, Mail } from 'lucide-react';

export default function RegiaoBloqueada() {
  const navigate = useNavigate();
  const regiaoNome = localStorage.getItem('regiaoBloqueadaNome') || 'esta região';

  const handleVoltar = () => {
    localStorage.removeItem('regiaoBloqueadaNome');
    navigate(createPageUrl('SelecionarRegiao'));
  };

  const handleContato = () => {
    window.location.href = 'mailto:comercial@greencat.com?subject=Solicitar Licença de Região&body=Olá, gostaria de informações sobre como operar na região: ' + regiaoNome;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--gradient-mist)' }}>
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 overflow-hidden" style={{
            background: 'var(--mist-card)',
            border: '2px solid var(--mist-primary)',
            boxShadow: 'var(--shadow-mist)'
          }}>
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e84a50dd41f4fd278cf06a/85d0052d0_image.png" 
              alt="Gato Verde"
              className="w-full h-full object-cover scale-150"
            />
          </div>
        </div>

        {/* Card Principal */}
        <Card className="p-10 mist-card" style={{ boxShadow: 'var(--shadow-mist)' }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{
              background: 'rgba(255, 79, 79, 0.1)',
              border: '2px solid var(--mist-error)'
            }}>
              <Lock className="w-10 h-10 mist-glow-text" style={{ color: 'var(--mist-error)' }} />
            </div>
            
            <h1 className="text-3xl font-black mb-3" style={{ color: 'white' }}>
              Região Ocupada
            </h1>
            
            <div className="rounded-xl p-4 mb-6" style={{
              background: 'rgba(255, 79, 79, 0.1)',
              border: '1px solid var(--mist-error)'
            }}>
              <p className="text-lg font-bold mb-2" style={{ color: 'var(--mist-error)' }}>
                📍 {regiaoNome}
              </p>
              <p style={{ color: '#aaa' }}>
                Esta região já possui um operador ativo
              </p>
            </div>

            <div className="rounded-xl p-6 mb-8" style={{
              background: 'rgba(0, 255, 157, 0.05)',
              border: '1px solid var(--mist-border)'
            }}>
              <p className="text-base leading-relaxed" style={{ color: '#ccc' }}>
                Você pode escolher outra área disponível para começar a operar, ou entrar em contato com nossa equipe comercial para solicitar a licença desta região específica.
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="space-y-4">
            <Button
              onClick={handleVoltar}
              className="w-full h-14 mist-button-primary text-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Escolher outra região
            </Button>

            <Button
              onClick={handleContato}
              className="w-full h-14 mist-button-secondary text-lg"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contato comercial
            </Button>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--mist-primary)' }}>
            ♻️ Gato Verde – Menos lixo, mais amor.
          </p>
          <p className="text-xs" style={{ color: '#666' }}>
            Sistema de regionalização LITE
          </p>
        </div>
      </div>
    </div>
  );
}