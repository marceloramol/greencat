import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Save, X, Trash2 } from 'lucide-react'; // Added Trash2 import
import { base44 } from '@/api/base44Client';

const CATEGORIES = [
  'Alimentos',
  'Bebidas',
  'Laticínios',
  'Padaria',
  'Carnes e Peixes',
  'Frutas e Verduras',
  'Congelados',
  'Higiene e Limpeza',
  'Outros'
];

export default function ProductForm({ storeData, onSuccess, onCancel, editProduct = null }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(editProduct || {
    name: '',
    image_url: '',
    expiry_date: '',
    original_price: '',
    discounted_price: '',
    quantity: '',
    category: 'Alimentos'
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, image_url: file_url });
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      // Optionally, show an error message to the user
    } finally {
      setUploadingImage(false);
      // Clear the file input to allow re-uploading the same file if needed
      e.target.value = ''; 
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image_url: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const countrySelected = localStorage.getItem('countrySelected');
      const stateSelected = localStorage.getItem('stateSelected');
      const regiaoSelecionada = localStorage.getItem('regiaoSelecionada');
      
      const productData = {
        ...formData,
        store_id: storeData.id,
        store_name: storeData.name,
        store_whatsapp: storeData.whatsapp,
        store_street: storeData.street,
        store_number: storeData.number,
        store_neighborhood: storeData.neighborhood,
        store_city: storeData.city,
        store_state: storeData.state,
        store_zip_code: storeData.zip_code,
        store_latitude: storeData.latitude,
        store_longitude: storeData.longitude,
        original_price: parseFloat(formData.original_price),
        discounted_price: parseFloat(formData.discounted_price),
        quantity: parseInt(formData.quantity),
        countryId: countrySelected,
        stateId: stateSelected || null,
        regiaoId: regiaoSelecionada
      };

      if (editProduct) {
        await base44.entities.Product.update(editProduct.id, productData);
      } else {
        await base44.entities.Product.create(productData);
      }

      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      // Optionally, show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2 border-green-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b-2 border-green-200">
        <CardTitle className="text-xl font-bold text-gray-900">
          {editProduct ? 'Editar Produto' : 'Novo Produto'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name" className="text-gray-700 font-medium">Nome do Produto</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Pão Francês"
              required
              className="mt-1.5 border-green-300 focus:border-green-500"
            />
          </div>

          <div>
            <Label className="text-gray-700 font-medium">Foto do Produto (Opcional)</Label>
            {!formData.image_url ? (
              <div className="mt-1.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload').click()}
                  disabled={uploadingImage}
                  className="border-green-300 hover:bg-green-50 w-full h-24 border-2 border-dashed flex flex-col justify-center items-center text-gray-500"
                >
                  {uploadingImage ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-500 border-t-transparent mb-2" />
                      Enviando foto...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mb-2" />
                      Clique para adicionar foto
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
                  Remover Foto
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry_date" className="text-gray-700 font-medium">Data de Validade</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                required
                className="mt-1.5 border-green-300 focus:border-green-500"
              />
            </div>

            <div>
              <Label htmlFor="quantity" className="text-gray-700 font-medium">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Ex: 10"
                required
                className="mt-1.5 border-green-300 focus:border-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="original_price" className="text-gray-700 font-medium">Preço Original (R$)</Label>
              <Input
                id="original_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                placeholder="Ex: 10.00"
                required
                className="mt-1.5 border-green-300 focus:border-green-500"
              />
            </div>

            <div>
              <Label htmlFor="discounted_price" className="text-gray-700 font-medium">Preço com Desconto (R$)</Label>
              <Input
                id="discounted_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.discounted_price}
                onChange={(e) => setFormData({ ...formData, discounted_price: e.target.value })}
                placeholder="Ex: 5.00"
                required
                className="mt-1.5 border-green-300 focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="category" className="text-gray-700 font-medium">Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="mt-1.5 border-green-300 focus:border-green-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
                ? (editProduct ? 'Atualizando...' : 'Salvando...')
                : (editProduct ? 'Atualizar Produto' : 'Salvar Produto')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}