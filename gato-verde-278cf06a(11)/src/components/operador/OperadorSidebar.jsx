import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LayoutDashboard, Store, Package, TrendingUp, Trophy, CreditCard, HelpCircle } from 'lucide-react';

export default function OperadorSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: 'OperadorDashboard' },
    { icon: Store, label: 'Mercados', path: 'MarketOffers' },
    { icon: Package, label: 'Ofertas', path: 'MarketOffers' },
    { icon: TrendingUp, label: 'Impacto', path: 'ImpactRegion' },
    { icon: Trophy, label: 'Ranking', path: 'ImpactRanking' },
    { icon: CreditCard, label: 'Minha Licença', path: 'MinhaLicenca' },
    { icon: HelpCircle, label: 'Suporte', path: 'OperadorDashboard' }
  ];

  const isActive = (path) => {
    return location.pathname.includes(path.toLowerCase());
  };

  return (
    <div className="w-64 min-h-screen p-6 mist-card" style={{
      borderRight: '1px solid var(--mist-border)',
      background: 'var(--mist-dark)'
    }}>
      <div className="mb-8">
        <div className="w-16 h-16 rounded-full mb-4 overflow-hidden" style={{
          background: 'var(--mist-card)',
          border: '2px solid var(--mist-primary)'
        }}>
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e84a50dd41f4fd278cf06a/85d0052d0_image.png" 
            alt="Gato Verde"
            className="w-full h-full object-cover scale-150"
          />
        </div>
        <h2 className="text-xl font-bold" style={{ color: 'white' }}>Painel PRO</h2>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Operador</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(createPageUrl(item.path))}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left"
            style={{
              background: isActive(item.path) ? 'rgba(0, 255, 157, 0.1)' : 'transparent',
              color: isActive(item.path) ? 'var(--mist-primary)' : 'var(--text-secondary)',
              borderLeft: isActive(item.path) ? '3px solid var(--mist-primary)' : '3px solid transparent',
              transition: 'all 0.18s ease-out'
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.color = 'var(--mist-primary)';
                e.currentTarget.style.borderLeft = '3px solid var(--mist-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderLeft = '3px solid transparent';
              }
            }}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}