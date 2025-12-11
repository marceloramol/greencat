import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Package, Calendar, TrendingDown } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { expirationInterpreter } from '../utils/expirationInterpreter';

export default function ProductCard({ product, onClick, showDistance = false, distance }) {
  const countryCode = localStorage.getItem('countryCode') || 'BR';
  const expiration = expirationInterpreter(product, countryCode);
  const daysUntilExpiry = differenceInDays(new Date(product.expiry_date), new Date());
  const discountPercent = Math.round(((product.original_price - product.discounted_price) / product.original_price) * 100);

  const getExpiryText = () => {
    return expiration.label;
  };

  return (
    <Card 
      onClick={onClick}
      className="overflow-hidden cursor-pointer mist-card mist-card-hover"
    >
      <div className="mist-urgency-bar" style={{ background: expiration.color }} />
      
      <div className="relative h-48 rounded-xl overflow-hidden mb-4 mt-2" style={{ background: 'linear-gradient(135deg, #0F1418 0%, #1A1F24 100%)' }}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
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
            -{discountPercent}%
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-bold mb-1 line-clamp-2" style={{ fontSize: '18px', color: 'white' }}>
            {product.name}
          </h3>
          <Badge className="text-xs" style={{
            background: 'rgba(0, 255, 157, 0.12)',
            color: 'var(--mist-primary)',
            border: '1px solid var(--mist-border)'
          }}>
            {product.category}
          </Badge>
        </div>

        <div className="flex items-baseline gap-3">
          <div>
            <p className="text-sm line-through" style={{ color: 'var(--text-tertiary)' }}>
              R$ {product.original_price.toFixed(2)}
            </p>
            <p className="text-2xl font-bold mist-glow-text">
              R$ {product.discounted_price.toFixed(2)}
            </p>
          </div>
          <Badge className="ml-auto" style={{
            background: 'rgba(0, 255, 157, 0.12)',
            color: 'var(--mist-primary)',
            fontSize: '13px',
            padding: '4px 10px'
          }}>
            <TrendingDown className="w-3 h-3 mr-1 inline" />
            Economize R$ {(product.original_price - product.discounted_price).toFixed(2)}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg" style={{
            background: 'rgba(0, 255, 157, 0.05)',
            border: '1px solid var(--mist-border)'
          }}>
            <span className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <Calendar className="w-4 h-4" style={{ color: 'var(--mist-primary)' }} />
              {getExpiryText()}
            </span>
          </div>

          {product.quantity <= 3 && product.quantity > 0 && (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg" style={{
              background: 'rgba(255, 195, 66, 0.1)',
              border: '1px solid var(--mist-warning)'
            }}>
              <span className="text-sm font-medium" style={{ color: 'var(--mist-warning)' }}>
                ⚡ Apenas {product.quantity} {product.quantity === 1 ? 'unidade' : 'unidades'}
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

        <div className="pt-2" style={{ borderTop: '1px solid var(--mist-border)' }}>
          <p className="text-xs flex items-center gap-2" style={{ color: 'var(--text-tertiary)' }}>
            <Package className="w-3 h-3" />
            {product.store_name}
          </p>
        </div>
      </div>
    </Card>
  );
}