import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LayoutDashboard, Store, Package, TrendingUp, Award, FileText, HelpCircle } from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: 'OperatorDashboard' },
  { icon: Store, label: 'Mercados', path: 'OperatorMarkets' },
  { icon: Package, label: 'Ofertas', path: 'OperatorOffers' },
  { icon: TrendingUp, label: 'Impacto', path: 'ImpactGlobal' },
  { icon: Award, label: 'Ranking', path: 'ImpactRanking' },
  { icon: FileText, label: 'Minha Licença', path: 'OperatorLicense' },
  { icon: HelpCircle, label: 'Suporte', path: 'Suporte' }
];

export default function OperatorSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === createPageUrl(path);
  };

  return (
    <div className="w-64 min-h-screen p-6 mist-card" style={{
      borderRight: '1px solid var(--mist-border)',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto'
    }}>
      {/* Logo e Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 overflow-hidden" style={{
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
        <h2 className="text-xl font-bold mist-glow-text">GreenCat PRO</h2>
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Painel do Operador</p>
      </div>

      {/* Menu Items */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(createPageUrl(item.path))}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left"
              style={{
                background: active ? 'rgba(0, 255, 157, 0.1)' : 'transparent',
                color: active ? 'var(--mist-primary)' : 'var(--text-secondary)',
                borderLeft: active ? '3px solid var(--mist-primary)' : '3px solid transparent',
                fontWeight: active ? 500 : 400
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(0, 255, 157, 0.05)';
                  e.currentTarget.style.color = 'var(--mist-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}