import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  pt: {
    common: { save: "Salvar", cancel: "Cancelar", delete: "Excluir", edit: "Editar", create: "Criar", search: "Buscar", back: "Voltar", loading: "Carregando..." },
    home: { title: "Gato Verde", subtitle: "Mapa Verde - Ofertas perto de você", searchPlaceholder: "Buscar produtos ou mercados próximos...", products: "Produtos", services: "Serviços", noOffersProduct: "Nenhuma oferta de produto", noOffersService: "Nenhuma oferta de serviço", comeBackSoon: "Volte em breve para novas ofertas!" },
    region: { select: "Selecione sua Região", selectCountry: "Selecione seu País", selectState: "Selecione seu Estado", available: "Disponível", occupied: "Ocupada", searchRegion: "Buscar por cidade, bairro ou região...", searchCountry: "Buscar país...", searchState: "Buscar estado ou província...", enterRegion: "Entrar nesta região", blocked: "Região Ocupada", blockedMessage: "Esta região já possui um operador ativo", chooseAnother: "Escolher outra região", contactCommercial: "Contato comercial" },
    market: { register: "Cadastrar Negócio", name: "Nome do Estabelecimento", address: "Endereço Completo", type: "Tipo de Negócio", list: "Minhas Ofertas", createOffer: "Criar Nova Oferta" },
    store: { register: "Cadastrar Loja", name: "Nome da Loja", list: "Meus Produtos" },
    product: { name: "Nome do Produto", expiring: "Vencendo", expired: "Vencido", expiresIn: "Vence em", expiresInDays: "Vence em {{days}} dias", expiresToday: "Vence hoje", expiresTomorrow: "Vence amanhã", category: "Categoria", originalPrice: "Preço Original", discountedPrice: "Preço com Desconto", quantity: "Quantidade", addProduct: "Adicionar Novo Produto" },
    offer: { title: "Título da Oferta", description: "Descrição", type: "Tipo", discount: "Desconto", stock: "Estoque", maxClaims: "Máximo de pessoas", validUntil: "Válido até", reserve: "Reservar Agora", claim: "Reserva", showCode: "Mostre este código no caixa" },
    profile: { selectTitle: "Escolha como participar dessa revolução verde", client: "Sou Cliente", clientDesc: "Quero salvar comida, economizar e ajudar o planeta", business: "Tenho um Negócio", businessDesc: "Quero vender mais, reduzir perdas e apoiar o consumo consciente" },
    footer: { tagline: "Gato Verde – Menos lixo, mais amor.", pilot: "Projeto piloto em fase comunitária" }
  },
  en: {
    common: { save: "Save", cancel: "Cancel", delete: "Delete", edit: "Edit", create: "Create", search: "Search", back: "Back", loading: "Loading..." },
    home: { title: "Green Cat", subtitle: "Green Map - Offers near you", searchPlaceholder: "Search products or nearby stores...", products: "Products", services: "Services", noOffersProduct: "No product offers", noOffersService: "No service offers", comeBackSoon: "Come back soon for new offers!" },
    region: { select: "Select your Region", selectCountry: "Select your Country", selectState: "Select your State", available: "Available", occupied: "Occupied", searchRegion: "Search for city, neighborhood or region...", searchCountry: "Search country...", searchState: "Search state or province...", enterRegion: "Enter this region", blocked: "Region Occupied", blockedMessage: "This region already has an active operator", chooseAnother: "Choose another region", contactCommercial: "Commercial contact" },
    market: { register: "Register Business", name: "Business Name", address: "Full Address", type: "Business Type", list: "My Offers", createOffer: "Create New Offer" },
    store: { register: "Register Store", name: "Store Name", list: "My Products" },
    product: { name: "Product Name", expiring: "Expiring", expired: "Expired", expiresIn: "Expires in", expiresInDays: "Expires in {{days}} days", expiresToday: "Expires today", expiresTomorrow: "Expires tomorrow", category: "Category", originalPrice: "Original Price", discountedPrice: "Discounted Price", quantity: "Quantity", addProduct: "Add New Product" },
    offer: { title: "Offer Title", description: "Description", type: "Type", discount: "Discount", stock: "Stock", maxClaims: "Max people", validUntil: "Valid until", reserve: "Reserve Now", claim: "Reservation", showCode: "Show this code at checkout" },
    profile: { selectTitle: "Choose how to participate in this green revolution", client: "I'm a Customer", clientDesc: "I want to save food, save money and help the planet", business: "I have a Business", businessDesc: "I want to sell more, reduce losses and support conscious consumption" },
    footer: { tagline: "Green Cat – Less waste, more love.", pilot: "Pilot project in community phase" }
  },
  es: {
    common: { save: "Guardar", cancel: "Cancelar", delete: "Eliminar", edit: "Editar", create: "Crear", search: "Buscar", back: "Volver", loading: "Cargando..." },
    home: { title: "Gato Verde", subtitle: "Mapa Verde - Ofertas cerca de ti", searchPlaceholder: "Buscar productos o tiendas cercanas...", products: "Productos", services: "Servicios", noOffersProduct: "No hay ofertas de productos", noOffersService: "No hay ofertas de servicios", comeBackSoon: "¡Vuelve pronto para nuevas ofertas!" },
    region: { select: "Selecciona tu Región", selectCountry: "Selecciona tu País", selectState: "Selecciona tu Estado", available: "Disponible", occupied: "Ocupada", searchRegion: "Buscar por ciudad, barrio o región...", searchCountry: "Buscar país...", searchState: "Buscar estado o provincia...", enterRegion: "Entrar en esta región", blocked: "Región Ocupada", blockedMessage: "Esta región ya tiene un operador activo", chooseAnother: "Elegir otra región", contactCommercial: "Contacto comercial" },
    market: { register: "Registrar Negocio", name: "Nombre del Establecimiento", address: "Dirección Completa", type: "Tipo de Negocio", list: "Mis Ofertas", createOffer: "Crear Nueva Oferta" },
    store: { register: "Registrar Tienda", name: "Nombre de la Tienda", list: "Mis Productos" },
    product: { name: "Nombre del Producto", expiring: "Por vencer", expired: "Vencido", expiresIn: "Vence en", expiresInDays: "Vence en {{days}} días", expiresToday: "Vence hoy", expiresTomorrow: "Vence mañana", category: "Categoría", originalPrice: "Precio Original", discountedPrice: "Precio con Descuento", quantity: "Cantidad", addProduct: "Agregar Nuevo Producto" },
    offer: { title: "Título de la Oferta", description: "Descripción", type: "Tipo", discount: "Descuento", stock: "Stock", maxClaims: "Máximo de personas", validUntil: "Válido hasta", reserve: "Reservar Ahora", claim: "Reserva", showCode: "Muestra este código en caja" },
    profile: { selectTitle: "Elige cómo participar en esta revolución verde", client: "Soy Cliente", clientDesc: "Quiero salvar comida, ahorrar y ayudar al planeta", business: "Tengo un Negocio", businessDesc: "Quiero vender más, reducir pérdidas y apoyar el consumo consciente" },
    footer: { tagline: "Gato Verde – Menos basura, más amor.", pilot: "Proyecto piloto en fase comunitaria" }
  }
};

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem('locale') || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[locale];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (!value) return key;
    
    let result = value;
    Object.keys(params).forEach(param => {
      result = result.replace(`{{${param}}}`, params[param]);
    });
    
    return result;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return context;
};