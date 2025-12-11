import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Store, MapPin, Phone, Package, Clock, Users, Ticket, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function OfferDetailsDialog({ offer, open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportType, setReportType] = useState('soldout');
  const [reportNote, setReportNote] = useState('');
  const [claimCode, setClaimCode] = useState(null);
  const [claimExpiry, setClaimExpiry] = useState(null);

  const createClaimMutation = useMutation({
    mutationFn: async () => {
      const code = `GV-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      
      const user = await base44.auth.me();
      
      const claim = await base44.entities.Claim.create({
        offer_id: offer.id,
        user_email: user.email,
        code: code,
        expires_at: expiresAt,
        status: 'active',
        offer_title: offer.title,
        market_name: offer.market_name
      });

      if (offer.stock_qty > 0) {
        await base44.entities.Offer.update(offer.id, {
          ...offer,
          stock_qty: offer.stock_qty - 1
        });
      }

      return { code, expiresAt };
    },
    onSuccess: ({ code, expiresAt }) => {
      setClaimCode(code);
      setClaimExpiry(expiresAt);
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    }
  });

  const createReportMutation = useMutation({
    mutationFn: async () => {
      const user = await base44.auth.me();
      
      return base44.entities.Report.create({
        offer_id: offer.id,
        user_email: user.email,
        type: reportType,
        note: reportNote
      });
    },
    onSuccess: () => {
      setShowReportForm(false);
      setReportNote('');
      alert('Obrigado por fortalecer a rede! 🌱\nSeu aviso ajuda a manter ofertas reais e seguras.');
    }
  });

  if (!offer) return null;

  const discountedPrice = offer.price_original * (1 - offer.discount_pct / 100);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {claimCode ? 'Reserva Confirmada! 🎉' : 'Detalhes da Oferta'}
          </DialogTitle>
        </DialogHeader>

        {claimCode ? (
          <div className="space-y-4">
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Código da Reserva</h3>
              <div className="bg-white border-2 border-green-400 rounded-lg p-4 mb-4">
                <p className="text-4xl font-black text-green-600 tracking-wider">{claimCode}</p>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Válido até {format(new Date(claimExpiry), "HH:mm", { locale: ptBR })}
              </p>
              <p className="text-sm font-medium text-gray-900">
                Mostre este código no caixa!
              </p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Store className="w-5 h-5 text-blue-600" />
                Onde retirar
              </h4>
              <p className="font-semibold text-lg text-gray-900">{offer.market_name}</p>
              <p className="text-sm text-gray-700">{offer.market_address}</p>
              {offer.market_whatsapp && (
                <p className="text-sm text-gray-700 mt-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  {offer.market_whatsapp}
                </p>
              )}
            </div>

            <Button
              onClick={() => onOpenChange(false)}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              Entendi!
            </Button>
          </div>
        ) : showReportForm ? (
          <div className="space-y-4">
            <div>
              <Label className="text-gray-700 font-medium">Tipo de aviso</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soldout">🚫 Produto esgotado</SelectItem>
                  <SelectItem value="quality_issue">⚠️ Problema de qualidade</SelectItem>
                  <SelectItem value="wrong_info">📝 Informação incorreta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-700 font-medium">Observação (opcional)</Label>
              <Textarea
                value={reportNote}
                onChange={(e) => setReportNote(e.target.value)}
                placeholder="Descreva o problema..."
                className="mt-2"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowReportForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => createReportMutation.mutate()}
                disabled={createReportMutation.isLoading}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                Enviar Aviso
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Oferta */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              {offer.image_url && (
                <img 
                  src={offer.image_url} 
                  alt={offer.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}
              <h4 className="font-bold text-xl text-gray-900 mb-2">{offer.title}</h4>
              {offer.description && (
                <p className="text-sm text-gray-700 mb-3">{offer.description}</p>
              )}
              <div className="flex items-baseline gap-3 mb-2">
                <p className="text-3xl font-bold text-green-600">
                  R$ {discountedPrice.toFixed(2)}
                </p>
                <p className="text-lg text-gray-500 line-through">
                  R$ {offer.price_original.toFixed(2)}
                </p>
                <Badge className="bg-red-500 text-white">
                  -{offer.discount_pct}%
                </Badge>
              </div>
            </div>

            {/* Limites */}
            {(offer.stock_qty > 0 || offer.max_claims > 0 || offer.expires_at) && (
              <div className="space-y-2">
                {offer.stock_qty > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">
                      📦 Estoque: {offer.stock_qty} unidades
                    </span>
                  </div>
                )}
                {offer.max_claims > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      ⚡ Primeiras {offer.max_claims} pessoas
                    </span>
                  </div>
                )}
                {offer.expires_at && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">
                      ⏰ Até {format(new Date(offer.expires_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Informações da Loja */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <h5 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                <Store className="w-5 h-5 text-blue-600" />
                {getBusinessTypeEmoji(offer.market_business_type)} {offer.market_name}
              </h5>
              <div className="space-y-1 text-sm text-gray-700">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span>{offer.market_address}</span>
                </p>
                {offer.market_whatsapp && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>{offer.market_whatsapp}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="space-y-3">
              {offer.claim_required ? (
                <Button
                  onClick={() => createClaimMutation.mutate()}
                  disabled={createClaimMutation.isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold h-14 text-lg"
                >
                  <Ticket className="w-5 h-5 mr-2" />
                  {createClaimMutation.isLoading ? 'Reservando...' : 'Reservar Agora'}
                </Button>
              ) : (
                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <p className="font-bold text-gray-900 mb-1">Sem necessidade de reserva!</p>
                  <p className="text-sm text-gray-700">Vá direto ao estabelecimento e garanta sua oferta!</p>
                </div>
              )}

              <Button
                onClick={() => setShowReportForm(true)}
                variant="outline"
                className="w-full border-orange-300 hover:bg-orange-50 text-orange-700"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Informar problema
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}