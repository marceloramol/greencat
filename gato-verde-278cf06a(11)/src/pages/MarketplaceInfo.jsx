import React from 'react';
import { Card } from '@/components/ui/card';
import { Globe, Store, TrendingUp, Award, CheckCircle, ExternalLink } from 'lucide-react';

export default function MarketplaceInfo() {
  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--gradient-mist)', animation: 'fadeIn 0.32s ease forwards' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 overflow-hidden" style={{
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
          
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ color: 'white' }}>
            GreenCat — Informações para Marketplace
          </h1>
        </div>

        {/* Parágrafo Principal */}
        <Card className="p-8 mb-8 mist-card">
          <p className="mb-4 text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            GreenCat é uma plataforma global para combate ao desperdício de alimentos,
            baseada em licenças regionais exclusivas, painel PRO para operadores,
            impacto ESG mensurável e estrutura escalável para mercados de qualquer tamanho.
          </p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            Esta página existe como referência técnica e institucional para submissão
            do GreenCat ao Marketplace do Base44 e outros diretórios internacionais.
          </p>
        </Card>

        {/* Recursos Principais */}
        <Card className="p-8 mb-8 mist-card">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: 'white' }}>
            <Award className="w-6 h-6" style={{ color: 'var(--mist-primary)' }} />
            Recursos Principais
          </h2>
          <ul className="space-y-3">
            {[
              'Licenciamento por país, estado e região',
              'Painel PRO do operador',
              'Telas de impacto ESG (global, regional, ranking)',
              'Lógica internacional de vencimento',
              'Onboarding global Mist UI',
              'Tema visual premium (Mist Glow UI)',
              'CRUD completo de mercados, produtos e ofertas',
              'Estrutura SaaS multi-tenant via RLS'
            ].map((recurso, index) => (
              <li key={index} className="flex items-start gap-3" style={{ color: 'var(--text-secondary)' }}>
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--mist-primary)' }} />
                <span>{recurso}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Rotas Importantes */}
        <Card className="p-8 mb-8 mist-card">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: 'white' }}>
            <Globe className="w-6 h-6" style={{ color: 'var(--mist-primary)' }} />
            Rotas Importantes do App
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              '/landing',
              '/licenciar-regiao',
              '/operador/dashboard',
              '/impact/global',
              '/impact/ranking',
              '/marketplace-info'
            ].map((rota, index) => (
              <div
                key={index}
                className="p-4 rounded-lg flex items-center gap-3 mist-card-hover"
                style={{
                  background: 'rgba(0, 255, 157, 0.05)',
                  border: '1px solid var(--mist-border)'
                }}
              >
                <ExternalLink className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--mist-primary)' }} />
                <code className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                  {rota}
                </code>
              </div>
            ))}
          </div>
        </Card>

        {/* Rodapé */}
        <div className="text-center pt-8" style={{ borderTop: '1px solid var(--mist-border)' }}>
          <p className="text-lg font-bold mb-2 mist-glow-text">
            Studio Gato de Lata
          </p>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Força, impacto e tecnologia.
          </p>
        </div>
      </div>
    </div>
  );
}