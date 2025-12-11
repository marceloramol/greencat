import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Search,
  MapPin,
  Check,
  Lock,
  ArrowLeft,
  Star
} from "lucide-react";

export default function SelectRegion() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");

  const countryId = localStorage.getItem("countrySelected");
  const stateId = localStorage.getItem("stateSelected");
  const countryName = localStorage.getItem("countryName");
  const stateName = localStorage.getItem("stateName");

  /** Redirecionamento de segurança */
  useEffect(() => {
    if (!countryId) navigate(createPageUrl("SelectCountry"));
  }, [countryId, navigate]);

  /** Buscar regiões */
  const { data: regioes = [], isLoading } = useQuery({
    queryKey: ["regioes", countryId, stateId],
    queryFn: async () => {
      const list = await base44.entities.Regiao.list();
      return list.filter(r => {
        if (r.countryId !== countryId) return false;
        if (stateId && r.stateId !== stateId) return false;
        return true;
      });
    },
    enabled: !!countryId,
    initialData: []
  });

  /** Buscar licenças */
  const { data: licencas = [] } = useQuery({
    queryKey: ["licencas"],
    queryFn: () => base44.entities.Licenca.list(),
    initialData: []
  });

  /** Usuário */
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => base44.auth.me(),
    initialData: null
  });

  /** Favoritos */
  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites", "region"],
    queryFn: async () => {
      const all = await base44.entities.Favorite.list();
      return all.filter(f => f.type === "region" && f.countryId === countryId);
    },
    initialData: []
  });

  const addFavorite = useMutation({
    mutationFn: (data) => base44.entities.Favorite.create(data),
    onSuccess: () => queryClient.invalidateQueries(["favorites"])
  });

  const removeFavorite = useMutation({
    mutationFn: (id) => base44.entities.Favorite.delete(id),
    onSuccess: () => queryClient.invalidateQueries(["favorites"])
  });

  const isFavorite = (id) => favorites.some(f => f.itemId === id);

  const toggleFavorite = (e, regiao) => {
    e.stopPropagation();
    const fav = favorites.find(f => f.itemId === regiao.id);
    if (fav) removeFavorite.mutate(fav.id);
    else addFavorite.mutate({
      type: "region",
      itemId: regiao.id,
      itemName: regiao.nome,
      countryId,
      stateId
    });
  };

  /** Filtro */
  const filtered = regioes
    .filter(r => r.ativa)
    .filter(r =>
      searchTerm
        ? r.nome.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );

  /** Lógica de clique */
  const handleSelect = (regiao) => {
    const lic = licencas.find(l => l.regiaoId === regiao.id && l.status === "ativo");

    if (lic && lic.operadorId === user?.email) {
      localStorage.setItem("regiaoSelecionada", regiao.id);
      localStorage.setItem("regiaoNome", regiao.nome);
      navigate(createPageUrl("OperadorDashboard"));
      return;
    }

    if (regiao.operadorId) {
      localStorage.setItem("regiaoBloqueadaNome", regiao.nome);
      navigate(createPageUrl("RegiaoBloqueada"));
      return;
    }

    localStorage.setItem("regiaoSelecionada", regiao.id);
    localStorage.setItem("regiaoNome", regiao.nome);
    navigate(createPageUrl("SelectProfile"));
  };

  /** Badge de status */
  const getStatusBadge = (regiao) => {
    const lic = licencas.find(l => l.regiaoId === regiao.id && l.status === "ativo");

    if (lic) {
      return (
        <Badge className="flex items-center gap-1 bg-green-100 text-green-700 border border-green-400 px-2 py-1 text-xs rounded">
          <Check className="w-3 h-3" /> Licenciada
        </Badge>
      );
    }

    if (regiao.operadorId) {
      return (
        <Badge className="flex items-center gap-1 bg-red-100 text-red-600 border border-red-400 px-2 py-1 text-xs rounded">
          <Lock className="w-3 h-3" /> Ocupada
        </Badge>
      );
    }

    return (
      <Badge className="flex items-center gap-1 bg-gray-100 text-gray-600 border border-gray-300 px-2 py-1 text-xs rounded">
        <MapPin className="w-3 h-3" /> Disponível
      </Badge>
    );
  };

  /** Emoji */
  const getTipoEmoji = (tipo) => {
    const map = {
      bairro: "🏘️",
      cidade: "🏙️",
      estado: "🗺️",
      regiao: "🌍"
    };
    return map[tipo] || "📍";
  };

  /** TELAS */
  return (
    <div className="min-h-screen p-6" style={{ background: "var(--gradient-mist)" }}>
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <div
            className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden"
            style={{
              background: "white",
              boxShadow: "var(--shadow-premium)"
            }}
          >
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e84a50dd41f4fd278cf06a/85d0052d0_image.png"
              className="w-full h-full object-cover scale-150"
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
            Selecione sua Região
          </h1>

          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            📍 {countryName}  
            {stateName && <><br />🗺️ {stateName}</>}
          </p>

          {/* BUSCA */}
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar por cidade ou região..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-white border border-gray-200 rounded-lg shadow-sm"
            />
          </div>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 mx-auto border-4 border-gray-200 border-t-green-500 rounded-full"></div>
            <p className="mt-4 text-gray-500">Carregando regiões...</p>
          </div>
        )}

        {/* NENHUM RESULTADO */}
        {!isLoading && filtered.length === 0 && (
          <Card className="p-12 text-center bg-white shadow">
            <MapPin className="w-16 h-16 mx-auto text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma região encontrada</h3>
            <p className="text-gray-500">
              {searchTerm ? "Tente outro termo de busca" : "Nenhuma região disponível no momento"}
            </p>
          </Card>
        )}

        {/* RESULTADOS */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((regiao) => (
              <Card
                key={regiao.id}
                className="cursor-pointer bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all"
                onClick={() => handleSelect(regiao)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{getTipoEmoji(regiao.tipo)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {regiao.nome}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {regiao.tipo} • {regiao.pais}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => toggleFavorite(e, regiao)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Star
                        className="w-5 h-5"
                        style={{
                          color: isFavorite(regiao.id)
                            ? "var(--mist-yellow)"
                            : "var(--text-tertiary)",
                          fill: isFavorite(regiao.id)
                            ? "var(--mist-yellow)"
                            : "none",
                        }}
                      />
                    </button>

                    {getStatusBadge(regiao)}
                  </div>
                </div>

                {regiao.limites && (
                  <p className="text-sm text-gray-500 mb-4">📍 {regiao.limites}</p>
                )}

                <Button className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800">
                  {regiao.operadorId ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Ver mais informações
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Entrar nesta região
                    </>
                  )}
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div className="text-center mt-16 pt-10 border-t border-gray-200">
          <Button
            onClick={() => navigate(createPageUrl("SelectState"))}
            className="mb-6 bg-white text-gray-600 border border-gray-300 py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <p className="text-sm text-green-700 font-semibold">
            ♻️ Gato Verde — Menos lixo, mais amor.
          </p>
          <p className="text-xs text-gray-500">Sistema de regionalização global</p>
        </div>

      </div>
    </div>
  );
}

