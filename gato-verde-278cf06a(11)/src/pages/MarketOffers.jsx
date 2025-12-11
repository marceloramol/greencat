import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Plus,
  Pencil,
  Trash2,
  Package,
  ShoppingCart,
  Check,
  Pause,
  Play
} from "lucide-react";

import OfferForm from "../components/offers/OfferForm";

// ------------------------------------------------------
// MARKET OFFERS — versão limpa e ajustada para perecíveis
// ------------------------------------------------------

export default function MarketOffers() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [marketData, setMarketData] = useState(null);

  const marketId = localStorage.getItem("marketId");

  // ------------------------------------------------------
  // 1. CARREGAR MERCADO
  // ------------------------------------------------------
  useEffect(() => {
    if (!marketId) {
      navigate(createPageUrl("MarketRegister"));
      return;
    }

    const loadMarket = async () => {
      const list = await base44.entities.Market.list();
      const mk = list.find((m) => m.id === marketId);

      if (mk) {
        setMarketData(mk);
      } else {
        localStorage.removeItem("marketId");
        navigate(createPageUrl("MarketRegister"));
      }
    };

    loadMarket();
  }, [marketId, navigate]);

  // ------------------------------------------------------
  // 2. CARREGAR OFERTAS DO MERCADO
  // ------------------------------------------------------
  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["market-offers", marketId],
    queryFn: async () => {
      const all = await base44.entities.Offer.list("-created_date");
      return all.filter((o) => o.market_id === marketId);
    },
    enabled: !!marketId,
    initialData: []
  });

  // ------------------------------------------------------
  // 3. MUTATIONS
  // ------------------------------------------------------
  const deleteOfferMutation = useMutation({
    mutationFn: (id) => base44.entities.Offer.delete(id),
    onSuccess: () => queryClient.invalidateQueries(["market-offers", marketId])
  });

  const updateOfferMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Offer.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(["market-offers", marketId])
  });

  // ------------------------------------------------------
  // 4. AÇÕES
  // ------------------------------------------------------
  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (confirm("Tem certeza que deseja excluir esta oferta?")) {
      deleteOfferMutation.mutate(id);
    }
  };

  const handleToggleStatus = (offer) => {
    const newStatus = offer.status === "paused" ? "active" : "paused";
    updateOfferMutation.mutate({
      id: offer.id,
      data: { ...offer, status: newStatus }
    });
  };

  const handleFinish = (id) => {
    if (confirm("Encerrar esta oferta?")) {
      updateOfferMutation.mutate({
        id,
        data: { status: "ended" }
      });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingOffer(null);
    queryClient.invalidateQueries(["market-offers", marketId]);
  };

  const handleChangeProfile = () => {
    localStorage.removeItem("userType");
    navigate(createPageUrl("SelectProfile"));
  };

  // ------------------------------------------------------
  // 5. ESTILOS & FUNÇÕES AUXILIARES
  // ------------------------------------------------------
  const getStatusColor = (s) =>
    ({
      active: "bg-green-100 text-green-700 border-green-300",
      paused: "bg-yellow-100 text-yellow-700 border-yellow-300",
      soldout: "bg-red-100 text-red-700 border-red-300",
      ended: "bg-gray-100 text-gray-700 border-gray-300"
    }[s] || "bg-gray-100 text-gray-700 border-gray-300");

  const getStatusLabel = (s) =>
    ({
      active: "Ativa",
      paused: "Pausada",
      soldout: "Esgotada",
      ended: "Encerrada"
    }[s] || s);

  // NOVA LISTA — PERECÍVEIS APENAS
  const getBusinessTypeEmoji = (type) =>
    ({
      mercado: "🛒",
      padaria: "🥖",
      acougue: "🥩",
      hortifruti: "🥗",
      mercearia: "🍎",
      conveniencia: "🛍️",
      lanchonete: "🍞",
      doceria: "🍬",
      supermercado: "🧀",
      restaurante_balcao: "🍛",
      outro_perecivel: "📦"
    }[type] || "🛒");

  // ------------------------------------------------------
  // 6. UI
  // ------------------------------------------------------

  if (!marketData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--gradient-mist)" }}
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-4"
          style={{
            borderColor: "var(--mist-light-gray)",
            borderTopColor: "var(--mist-primary)"
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-mist)" }}>
      {/* HEADER */}
      <div
        style={{
          background: "white",
          boxShadow: "var(--shadow-premium)",
          borderBottom: "1px solid var(--mist-border)"
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
                style={{ background: "white", boxShadow: "var(--shadow-premium)" }}
              >
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e84a50dd41f4fd278cf06a/85d0052d0_image.png"
                  alt="Gato Verde"
                  className="w-full h-full object-cover scale-150"
                />
              </div>

              <div>
                <h1
                  className="text-2xl font-semibold flex items-center gap-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {getBusinessTypeEmoji(marketData.business_type)} {marketData.name}
                </h1>

                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {marketData.street}, {marketData.number} — {marketData.neighborhood}
                </p>
              </div>
            </div>

            <Button
              onClick={handleChangeProfile}
              style={{
                background: "white",
                color: "var(--text-secondary)",
                border: "1px solid var(--mist-border)"
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Área do Cliente
            </Button>
          </div>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Botão criar oferta */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <Button
            onClick={() => {
              setEditingOffer(null);
              setShowForm(!showForm);
              if (!showForm) window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="h-12 px-6 font-semibold"
            style={{
              background: "var(--mist-charcoal)",
              color: "white"
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            {showForm ? "Cancelar" : "Criar Nova Oferta"}
          </Button>

          {offers.length > 0 && (
            <div className="px-6 py-3 mist-card">
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Total de ofertas:{" "}
                <span className="font-bold text-lg" style={{ color: "var(--mist-primary)" }}>
                  {offers.length}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* FORM */}
        {showForm && (
          <Card className="p-6 mb-8 mist-card">
            <OfferForm
              marketData={marketData}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setShowForm(false);
                setEditingOffer(null);
              }}
              editOffer={editingOffer}
            />
          </Card>
        )}

        {/* LISTAGEM */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6" style={{ color: "var(--mist-primary)" }} />
            <h2
              className="text-2xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Minhas Ofertas ({offers.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div
                className="animate-spin rounded-full h-12 w-12 border-4 mx-auto mb-4"
                style={{
                  borderColor: "var(--mist-light-gray)",
                  borderTopColor: "var(--mist-primary)"
                }}
              />
              <p className="font-medium" style={{ color: "var(--text-secondary)" }}>
                Carregando ofertas...
              </p>
            </div>
          ) : offers.length === 0 ? (
            <Card
              className="p-12 text-center mist-card"
              style={{
                border: "2px dashed var(--mist-border)",
                background: "var(--mist-primary-light)"
              }}
            >
              <Package
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: "var(--mist-primary)", opacity: 0.3 }}
              />

              <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                Nenhuma oferta cadastrada
              </h3>

              <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
                Comece criando sua primeira oferta
              </p>

              <Button
                onClick={() => setShowForm(true)}
                style={{ background: "var(--mist-charcoal)", color: "white" }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Oferta
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => {
                const discounted = offer.price_original * (1 - offer.discount_pct / 100);

                return (
                  <Card
                    key={offer.id}
                    className="mist-card-hover overflow-hidden"
                    style={{
                      background: "white",
                      borderRadius: "var(--radius-premium)",
                      boxShadow: "var(--shadow-premium)"
                    }}
                  >
                    <div className="relative h-48" style={{ background: "var(--mist-primary-light)" }}>
                      {offer.image_url ? (
                        <img
                          src={offer.image_url}
                          alt={offer.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12" style={{ color: "var(--mist-primary)", opacity: 0.3 }} />
                        </div>
                      )}

                      <div className="absolute top-3 right-3">
                        <Badge
                          className={`${getStatusColor(offer.status)} border font-bold text-sm px-3 py-1.5`}
                        >
                          {getStatusLabel(offer.status)}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                        {offer.title}
                      </h3>

                      {/* Badge única: produto perecível */}
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: "var(--mist-border)",
                          color: "var(--text-secondary)"
                        }}
                      >
                        🛒 Produto Perecível
                      </Badge>

                      {offer.description && (
                        <p
                          className="text-sm mt-2 mb-4 line-clamp-2"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {offer.description}
                        </p>
                      )}

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Preço Original:</span>
                          <span className="line-through font-semibold">
                            R$ {offer.price_original.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Com {offer.discount_pct}% OFF:</span>
                          <span
                            className="text-xl font-bold"
                            style={{ color: "var(--mist-primary)" }}
                          >
                            R$ {discounted.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="space-y-2">
                        {(offer.status === "active" || offer.status === "paused") && (
                          <>
                            <Button
                              onClick={() => handleToggleStatus(offer)}
                              className="w-full font-semibold"
                              style={{
                                background:
                                  offer.status === "paused"
                                    ? "var(--mist-primary)"
                                    : "var(--mist-yellow)",
                                color:
                                  offer.status === "paused"
                                    ? "white"
                                    : "var(--text-primary)"
                              }}
                            >
                              {offer.status === "paused" ? (
                                <>
                                  <Play className="w-4 h-4 mr-2" /> Reativar
                                </>
                              ) : (
                                <>
                                  <Pause className="w-4 h-4 mr-2" /> Pausar
                                </>
                              )}
                            </Button>

                            <Button
                              onClick={() => handleFinish(offer.id)}
                              className="w-full font-semibold"
                              style={{
                                background: "var(--mist-charcoal)",
                                color: "white"
                              }}
                            >
                              <Check className="w-4 h-4 mr-2" /> Encerrar
                            </Button>
                          </>
                        )}

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEdit(offer)}
                            variant="outline"
                            className="flex-1"
                            style={{
                              borderColor: "var(--mist-border)",
                              color: "var(--text-secondary)"
                            }}
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar
                          </Button>

                          <Button
                            onClick={() => handleDelete(offer.id)}
                            variant="outline"
                            className="flex-1"
                            style={{
                              borderColor: "var(--mist-error)",
                              color: "var(--mist-error)"
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div
          className="text-center mt-16 pt-8"
          style={{ borderTop: "1px solid var(--mist-border)" }}
        >
          <p
            className="text-sm font-medium mb-2"
            style={{ color: "var(--mist-primary)" }}
          >
            ♻️ Gato Verde — Menos lixo, mais amor.
          </p>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Projeto piloto em fase comunitária
          </p>
        </div>
      </div>
    </div>
  );
}

