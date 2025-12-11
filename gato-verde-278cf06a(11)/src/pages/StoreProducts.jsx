import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Store, Package, ShoppingCart, Check } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ProductForm from '../components/products/ProductForm';

export default function StoreProducts() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const storeId = localStorage.getItem('storeId');

  useEffect(() => {
    if (!storeId) {
      navigate(createPageUrl('StoreRegister'));
      return;
    }

    const fetchStore = async () => {
      try {
        const stores = await base44.entities.Store.list();
        const store = stores.find(s => s.id === storeId);
        if (store) {
          setStoreData(store);
        } else {
          localStorage.removeItem('storeId');
          navigate(createPageUrl('StoreRegister'));
        }
      } catch (error) {
        console.error('Erro ao buscar loja:', error);
      }
    };

    fetchStore();
  }, [storeId, navigate]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['store-products', storeId],
    queryFn: async () => {
      const allProducts = await base44.entities.Product.list('-created_date');
      return allProducts.filter(p => p.store_id === storeId);
    },
    enabled: !!storeId,
    initialData: []
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId) => base44.entities.Product.delete(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-products', storeId] });
    }
  });

  const finishProductMutation = useMutation({
    mutationFn: (productId) => base44.entities.Product.update(productId, { quantity: 0 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-products', storeId] });
    }
  });

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleFinish = async (productId, productName) => {
    if (confirm(`Finalizar promoção de "${productName}"? O produto será marcado como esgotado.`)) {
      finishProductMutation.mutate(productId);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    queryClient.invalidateQueries({ queryKey: ['store-products', storeId] });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangeProfile = () => {
    localStorage.removeItem('userType');
    navigate(createPageUrl('SelectProfile'));
  };

  if (!storeData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-mist)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-4" style={{
          borderColor: 'var(--mist-light-gray)',
          borderTopColor: 'var(--mist-primary)'
        }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-mist)' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        boxShadow: 'var(--shadow-premium)',
        borderBottom: '1px solid var(--mist-border)'
      }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden" style={{
                background: 'white',
                boxShadow: 'var(--shadow-premium)'
              }}>
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e84a50dd41f4fd278cf06a/85d0052d0_image.png" 
                  alt="Gato Verde"
                  className="w-full h-full object-cover scale-150"
                />
              </div>
              <div>
                <h1 className="text-2xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <Store className="w-6 h-6" />
                  {storeData.name}
                </h1>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {storeData.street}, {storeData.number} - {storeData.neighborhood}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {storeData.city}/{storeData.state}
                </p>
              </div>
            </div>
            <Button
              onClick={handleChangeProfile}
              style={{
                background: 'white',
                color: 'var(--text-secondary)',
                border: '1px solid var(--mist-border)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Área do Cliente
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Add Button */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <Button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(!showForm);
              if (!showForm) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="h-12 px-6 font-semibold"
            style={{
              background: 'var(--mist-charcoal)',
              color: 'white',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-premium)'
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            {showForm ? 'Cancelar' : 'Adicionar Novo Produto'}
          </Button>

          {products.length > 0 && (
            <div className="px-6 py-3 mist-card">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Total de produtos: <span className="font-bold text-lg" style={{ color: 'var(--mist-primary)' }}>{products.length}</span>
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8">
            <ProductForm
              storeData={storeData}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
              editProduct={editingProduct}
            />
          </div>
        )}

        {/* Products List */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6" style={{ color: 'var(--mist-primary)' }} />
            <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Meus Produtos ({products.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 mx-auto mb-4" style={{
                borderColor: 'var(--mist-light-gray)',
                borderTopColor: 'var(--mist-primary)'
              }} />
              <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>Carregando produtos...</p>
            </div>
          ) : products.length === 0 ? (
            <Card className="p-12 text-center mist-card" style={{
              border: '2px dashed var(--mist-border)',
              background: 'var(--mist-primary-light)'
            }}>
              <Package className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--mist-primary)', opacity: 0.3 }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Nenhum produto cadastrado
              </h3>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                Comece adicionando seu primeiro produto
              </p>
              <Button
                onClick={() => setShowForm(true)}
                style={{
                  background: 'var(--mist-charcoal)',
                  color: 'white',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Produto
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className={`mist-card-hover overflow-hidden ${
                  product.quantity === 0 ? 'opacity-60' : ''
                }`} style={{
                  background: 'white',
                  borderRadius: 'var(--radius-premium)',
                  boxShadow: 'var(--shadow-premium)',
                  border: '1px solid var(--mist-border)'
                }}>
                  <div className="relative h-48" style={{
                    background: 'var(--mist-primary-light)'
                  }}>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12" style={{ color: 'var(--mist-primary)', opacity: 0.3 }} />
                      </div>
                    )}
                    {product.quantity === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{
                        background: 'rgba(0, 0, 0, 0.7)'
                      }}>
                        <Badge className="text-lg px-4 py-2" style={{
                          background: 'var(--mist-error)',
                          color: 'white'
                        }}>
                          ESGOTADO
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{product.name}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Preço Original:</span>
                        <span className="font-semibold line-through">R$ {product.original_price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Preço Promocional:</span>
                        <span className="text-xl font-bold" style={{ color: 'var(--mist-primary)' }}>R$ {product.discounted_price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Quantidade:</span>
                        <Badge variant="outline" style={{
                          borderColor: product.quantity === 0 ? 'var(--mist-error)' : 'var(--mist-border)',
                          color: product.quantity === 0 ? 'var(--mist-error)' : 'var(--text-secondary)'
                        }}>
                          {product.quantity} un.
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Validade:</span>
                        <span className="text-sm font-medium">{format(new Date(product.expiry_date), "dd/MM/yyyy", { locale: ptBR })}</span>
                      </div>
                    </div>

                    <Badge className="w-full justify-center mb-4" style={{
                      background: 'var(--mist-primary-light)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--mist-border)'
                    }}>
                      {product.category}
                    </Badge>

                    <div className="space-y-2">
                      {product.quantity > 0 && (
                        <Button
                          onClick={() => handleFinish(product.id, product.name)}
                          className="w-full font-semibold"
                          style={{
                            background: 'var(--mist-charcoal)',
                            color: 'white',
                            borderRadius: 'var(--radius-md)'
                          }}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Finalizar Promoção
                        </Button>
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(product)}
                          variant="outline"
                          className="flex-1"
                          style={{
                            borderColor: 'var(--mist-border)',
                            color: 'var(--text-secondary)',
                            borderRadius: 'var(--radius-md)'
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleDelete(product.id)}
                          variant="outline"
                          className="flex-1"
                          style={{
                            borderColor: 'var(--mist-error)',
                            color: 'var(--mist-error)',
                            borderRadius: 'var(--radius-md)'
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8" style={{ borderTop: '1px solid var(--mist-border)' }}>
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--mist-primary)' }}>
            ♻️ Gato Verde — Menos lixo, mais amor.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Projeto piloto em fase comunitária
          </p>
        </div>
      </div>
    </div>
  );
}