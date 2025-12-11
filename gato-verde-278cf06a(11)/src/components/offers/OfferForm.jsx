import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Save, X, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function OfferForm({ marketData, onSuccess, onCancel, editOffer = null }) {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState(
    editOffer || {
      title: '',
      description: '',
      type: 'product',              // 🔒 Travado como produto perecível
      image_url: '',
      price_original: '',
      discount_pct: '',
      stock_qty: 0,
      max_claims: 0,
      expires_at: '',
      visibility: 'public',

      // CANAIS
      channel_app: true,
      channel_whatsapp: false,
      channel_qr: false,

      // REGRAS
      claim_required: true,

      // NOVO — decisão do dono do mercado
      show_market_whatsapp: false,
    }
  );

  const [uploadingImage, setUploadingImage] = useState(false);

  // ---------------------------------------------------------
  // UPLOAD DE IMAGEM
  // ---------------------------------------------------------
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, image_url: file_url });
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
    }

    setUploadingImage(false);
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image_url: '' });
  };

  // ---------------------------------------------------------
  // SALVAR OFERTA
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const countrySelected = localStorage.getItem('countrySelected');
      const stateSelected = localStorage.getItem('stateSelected');
      const regiaoSelecionada = localStorage.getItem('regiaoSelecionada');

      const offerData = {
        ...formData,
        type: 'product', // 🔒 Travado
        market_id: marketData.id,
        market_name: marketData.name,
        market_address: marketData.address,

        // WhatsApp só vai se o dono quiser
        market_whatsapp: formData.show_market_whatsapp ? marketData.whatsapp : null,

        market_business_type: marketData.business_type,
        market_latitude: marketData.latitude,
        market_longitude: marketData.longitude,

        price_original: parseFloat(formData.price_original),
        discount_pct: parseInt(formData.discount_pct),
        stock_qty: parseInt(formData.stock_qty) || 0,
        max_claims: parseInt(formData.max_claims) || 0,

        countryId: countrySelected,
        stateId: stateSelected || null,
        regiaoId: regiaoSelecionada,
      };

      if (editOffer) {
        await base44.entities.Offer.update(editOffer.id, offerData);
      } else {
        await base44.entities.Offer.create(offerData);
      }

      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar oferta:', error);
    }

    setIsLoading(false);
  };

  // ---------------------------------------------------------
  // INTERFACE
  // ---------------------------------------------------------
  return (
    <Card className="border-2 border-green-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b-2 border-green-200">
        <CardTitle className="text-xl font-bold text-gray-900">
          {editOffer ? 'Editar Oferta' : 'Nova Oferta'}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* TÍTULO */}
          <div>
            <Label className="text-gray-700 font-medium">Título da Oferta</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Ex: Iogurte Nestlé vence amanhã – 40% OFF"
              required
              className="mt-1.5 border-green-300 focus:border-green-500"
            />
          </div>

          {/* DESCRIÇÃO */}
          <div>
            <Label className="text-gray-700 font-medium">Descrição (Opcional)</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Detalhes importantes: validade, peso, lote..."
              className="mt-1.5 border-green-300 focus:border-green-500 h-24"
            />
          </div>

          {/* TIPO TRAVADO */}
          <div>
            <Label className="text-gray-700 font-medium">Tipo</Label>
            <Input
              value="🛒 Produto Perecível"
              disabled
              className="mt-1.5 bg-gray-50 text-gray-600 border-green-200"
            />
          </div>

          {/* FOTO */}
          <div>
            <Label className="text-gray-700 font-medium">Foto (Opcional)</Label>

            {!formData.image_url ? (
              <div className="mt-1.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload').click()}
                  disabled={uploadingImage}
                  className="border-green-300 hover:bg-green-50 w-full h-24 border-2 border-dashed"
                >
                  {uploadingImage ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-500 border-t-transparent mr-2" />
                      Enviando foto...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Adicionar foto
                    </>
                  )}
                </Button>

                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="mt-1.5 relative">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border-2 border-green-300"
                />
                <Button
                  type="button"
                  onClick={handleRemoveImage}
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 shadow-lg"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remover
                </Button>
              </div>
            )}
          </div>

          {/* PREÇO + DESCONTO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700 font-medium">Preço Original (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price_original}
                onChange={(e) => {
                  const v = Math.max(0.01, parseFloat(e.target.value));
                  setFormData({ ...formData, price_original: v });
                }}
                placeholder="Ex: 10.00"
                required
                className="mt-1.5 border-green-300 focus:border-green-500"
              />
            </div>

            <div>
              <Label className="text-gray-700 font-medium">Desconto (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.discount_pct}
                onChange={(e) => {
                  let v = parseInt(e.target.value) || 0;
                  if (v > 100) v = 100;
                  if (v < 0) v = 0;
                  setFormData({ ...formData, discount_pct: v });
                }}
                placeholder="Ex: 35"
                required
                className="mt-1.5 border-green-300 focus:border-green-500"
              />
            </div>
          </div>

          {/* LIMITES */}
          <div className="border-t-2 border-green-200 pt-5">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Limites (Opcional)</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ESTOQUE */}
              <div>
                <Label className="text-gray-700 font-medium text-sm">Estoque (0 = ilimitado)</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.stock_qty}
                  onChange={(e) => setFormData({ ...formData, stock_qty: e.target.value })}
                  placeholder="Ex: 10"
                  className="mt-1.5 border-green-300 focus:border-green-500"
                />
              </div>

              {/* MÁXIMO DE PESSOAS */}
              <div>
                <Label className="text-gray-700 font-medium text-sm">Máx. pessoas (0 = ilimitado)</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.max_claims}
                  onChange={(e) => setFormData({ ...formData, max_claims: e.target.value })}
                  placeholder="Ex: 20"
                  className="mt-1.5 border-green-300 focus:border-green-500"
                />
              </div>

              {/* VALIDADE */}
              <div>
                <Label className="text-gray-700 font-medium text-sm">Válido até</Label>
                <Input
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  className="mt-1.5 border-green-300 focus:border-green-500"
                />
              </div>
            </div>
          </div>

          {/* CONFIGURAÇÕES */}
          <div className="border-t-2 border-green-200 pt-5">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Configurações</h3>

            <div className="space-y-3">

              {/* EXIGIR RESERVA */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.claim_required}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, claim_required: checked })
                  }
                />
                <Label className="text-sm font-medium cursor-pointer">
                  Exigir reserva com código
                </Label>
              </div>

              {/* WHATSAPP OPCIONAL */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.channel_whatsapp}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, channel_whatsapp: checked })
                  }
                />
                <Label className="text-sm font-medium cursor-pointer">
                  Disponível via WhatsApp
                </Label>
              </div>

              {/* QR CODE */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.channel_qr}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, channel_qr: checked })
                  }
                />
                <Label className="text-sm font-medium cursor-pointer">Disponível via QR Code</Label>
              </div>

              {/* MOSTRAR WHATSAPP DO MERCADO */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.show_market_whatsapp}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, show_market_whatsapp: checked })
                  }
                />
                <Label className="text-sm font-medium cursor-pointer">
                  Mostrar WhatsApp da loja nesta oferta
                </Label>
              </div>

            </div>
          </div>

          {/* BOTÕES */}
          <div className="flex gap-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 border-gray-300 hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading
                ? editOffer
                  ? 'Atualizando...'
                  : 'Salvando...'
                : editOffer
                ? 'Atualizar'
                : 'Salvar Oferta'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

