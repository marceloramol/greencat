import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Package, Users } from 'lucide-react';
import { format, differenceInHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { expirationInterpreter } from '../utils/expirationInterpreter';

export default function OfferCard({ offer, onClick, showDistance = false, distance }) {
  const countryCode = localStorage.getItem('countryCode') || 'BR';
  const expiration = expirationInterpreter(offer, countryCode);
  const discountedPrice = offer.price_original * (1 - offer.discount_pct / 100);
  const hoursUntilExpiry = offer.expires_at ? differenceInHours(new Date(offer.expires_at), new Date()) : null;

  const getBusinessTypeEmoji = (type) => {
    const emojis = {
      mercado: '🛒',
      padaria: '🥖',
      barbearia: '✂️',
      lanchonete: '🍔',
      oficina: '🔧',
      outro: '📦'
    };
    return emojis[type] || '📦';
  };

  return (
    <Card
      onClick={onClick}
      className="overflow-hidden cursor-pointer mist-card mist-card-hover"
    >
      <div className="mist-urgency-bar" style={{ background: expiration.color }} />
      <div className="relative h-48 rounded-xl overflow-hidden mb-4 mt-2" style={{ background: 'linear-gradient(135deg, #0F1418 0%, #1A1F24 100%)' }}>
        {offer.image_url ? (
          <img
            src={offer.image_url}
            alt={offer.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16" style={{ color: 'var(--mist-primary)', opacity: 0.3 }} />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className="font-bold text-base px-3 py-1.5" style={{
            background: 'var(--mist-error)',
            color: 'white',
            boxShadow: 'var(--shadow-soft)'
          }}>
            -{offer.discount_pct}%
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-bold mb-1 line-clamp-2" style={{ fontSize: '18px', color: 'white' }}>
            {offer.title}
          </h3>
          <p className="text-sm flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
            {getBusinessTypeEmoji(offer.market_business_type)} {offer.market_name}
          </p>
        </div>

        <div className="flex items-baseline gap-3">
          <div>
            <p className="text-sm line-through" style={{ color: 'var(--text-tertiary)' }}>
              R$ {offer.price_original.toFixed(2)}
            </p>
            <p className="text-2xl font-bold mist-glow-text">
              R$ {discountedPrice.toFixed(2)}
            </p>
          </div>
          <Badge className="ml-auto" style={{
            background: 'rgba(0, 255, 157, 0.12)',
            color: 'var(--mist-primary)',
            fontSize: '13px',
            padding: '4px 10px'
          }}>
            Economize R$ {(offer.price_original - discountedPrice).toFixed(2)}
          </Badge>
        </div>

        <div className="space-y-2">
          {offer.stock_qty > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{
              background: 'rgba(255, 195, 66, 0.1)',
              border: '1px solid var(--mist-warning)'
            }}>
              <Package className="w-4 h-4" style={{ color: 'var(--mist-warning)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--mist-warning)' }}>
                📦 Estoque: {offer.stock_qty} unidades
              </span>
            </div>
          )}
          
          {offer.max_claims > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{
              background: 'rgba(0, 255, 157, 0.1)',
              border: '1px solid var(--mist-primary)'
            }}>
              <Users className="w-4 h-4" style={{ color: 'var(--mist-primary)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--mist-primary)' }}>
                ⚡ Primeiras {offer.max_claims} pessoas
              </span>
            </div>
          )}

          {hoursUntilExpiry !== null && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{
              background: 'rgba(0, 255, 157, 0.05)',
              border: '1px solid var(--mist-border)'
            }}>
              <Clock className="w-4 h-4" style={{ color: 'var(--mist-primary)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {hoursUntilExpiry > 24 
                  ? `Até ${format(new Date(offer.expires_at), "dd/MM 'às' HH:mm", { locale: ptBR })}`
                  : `Válido por ${hoursUntilExpiry}h`
                }
              </span>
            </div>
          )}
          
          {showDistance && distance !== undefined && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{
              background: 'rgba(0, 255, 157, 0.05)',
              border: '1px solid var(--mist-border)'
            }}>
              <MapPin className="w-4 h-4" style={{ color: 'var(--mist-primary)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`} de você
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}