import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, MapPin, Tag, TrendingDown } from 'lucide-react';

const CATEGORIES = [
  'Todas',
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

export default function ProductFilters({ filters, onFilterChange }) {
  return (
    <Card className="p-4 bg-gradient-to-br from-white to-green-50 border-2 border-green-200 shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
          <Filter className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-bold text-gray-900">Filtros</h3>
      </div>

      <div className="grid gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Tag className="w-4 h-4 text-green-600" />
            Categoria
          </label>
          <Select value={filters.category} onValueChange={(value) => onFilterChange({ ...filters, category: value })}>
            <SelectTrigger className="border-green-300 focus:border-green-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-600" />
            Raio de distância
          </label>
          <Select value={filters.radius} onValueChange={(value) => onFilterChange({ ...filters, radius: value })}>
            <SelectTrigger className="border-green-300 focus:border-green-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="1">Até 1 km</SelectItem>
              <SelectItem value="3">Até 3 km</SelectItem>
              <SelectItem value="5">Até 5 km</SelectItem>
              <SelectItem value="10">Até 10 km</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-green-600" />
            Ordenar por
          </label>
          <Select value={filters.sortBy} onValueChange={(value) => onFilterChange({ ...filters, sortBy: value })}>
            <SelectTrigger className="border-green-300 focus:border-green-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">Mais próximos</SelectItem>
              <SelectItem value="discount">Maior desconto</SelectItem>
              <SelectItem value="expiry">Vencimento mais próximo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}