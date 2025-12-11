import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Search,
  MapPin,
  ChevronRight,
  ArrowLeft,
  Star
} from "lucide-react";

export default function SelectState() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [loadingRegion, setLoadingRegion] = useState(false);

  const countryId = localStorage.getItem("countrySelected");
  const countryName = localStorage.getItem("countryName");

  /** Segurança: se não tem país → volta */
  useEffect(() => {
    if (!countryId) navigate(createPageUrl("SelectCountry"));
  }, [countryId, navigate]);

  /** Buscar estados */
  const { data: states = [], isLoading } = useQuery({
    queryKey: ["states", countryId],
    queryFn: async () => {
      const list = await base44.entities.State.list();
      return list.filter(s => s.countryId === countryId);
    },
    enabled: !!countryId,
    initialData: []
  });

  /** Favoritos */
  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites", "state"],
    queryFn: async () => {
      const all = await base44.entities.Favorite.list();
      return all.filter(f => f.type === "state" && f.countryId === countryId);
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

  const toggleFavorite = (e, state) => {
    e.stopPropagation();
    const fav = favorites.find(f => f.itemId === state.id);

    if (fav) removeFavorite.mutate(fav.id);
    else addFavorite.mutate({
      type: "state",
      itemId: state.id,
      itemName: state.name,
      itemCode: state.code,
      countryId
    });
  };

  /** Filtrar */
  const filteredStates = states.filter(s =>
    searchTerm
      ? s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  const favoritesList = states.filter(s => isFavorite(s.id));

  /** Se o país não tem estados → vai direto pra regiões */
  useEffect(() => {
    if (!isLoading && states.length === 0) {
      localStorage.setItem("stateSelected", "");
      localStorage.setItem("stateName", "");
      localStorage.setItem("stateCode", "");

      const t = setTimeout(() => navigate(createPageUrl("SelectRegion")), 800);
      return () => clearTimeout(t);
    }
  }, [states, isLoading, navigate]);

  /** Selecionar estado */
  const handleSelect = (state) => {
    localStorage.setItem("stateSelected", state.id);
    localStorage.setItem("stateCode", state.code);
    localStorage.setItem("stateName", state.name);

    setLoadingRegion(true);
    setTimeout(() => navigate(createPageUrl("SelectRegion")), 300);
  };

  /** Reset país e voltar */
  const handleBack = () => {
    localStorage.removeItem("countrySelected");
    localStorage.removeItem("countryName");
    localStorage.removeItem("countryCode");

    navigate(createPageUrl("SelectCountry"));
  };

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
            Selecione seu Estado
          </h1>

          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            📍 {countryName}
          </p>

          {/* BUSCA */}
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar estado ou província..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-white border border-gray-200 rounded-lg shadow-sm"
            />
          </div>
        </div>

        {/* LOADING ao selecionar estado */}
        {loadingRegion && (
          <div className="text-center py-14">
            <div className="w-12 h-12 mx-auto rounded-full border-4 border-gray-200 border-t-green-600 animate-spin"></div>
            <p className="mt-4 text-gray-500">Carregando regiões...</p>
          </div>
        )}

        {/* LISTA / CARREGANDO GERAL */}
        {!loadingRegion && isLoading && (
          <div className="text-center py-20">
            <div className="w-12 h-12 mx-auto rounded-full border-4 border-gray-200 border-t-green-600 animate-spin"></div>
            <p className="mt-4 text-gray-500">Carregando estados...</p>
          </div>
        )}

        {/* NENHUM ESTADO */}
        {!loadingRegion && !isLoading && states.length === 0 && (
          <Card className="p-12 text-center bg-white shadow">
            <MapPin className="w-16 h-16 mx-auto text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum estado encontrado</h3>
            <p className="text-gray-500">Indo direto para regiões...</p>
            <div className="w-10 h-10 mx-auto mt-4 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin"></div>
          </Card>
        )}

        {/* RESULTADOS */}
        {!loadingRegion && !isLoading && states.length > 0 && (
          <>
            {/* FAVORITOS */}
            {favoritesList.length > 0 && !searchTerm && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Favoritos
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {favoritesList.map(state => (
                    <Card
                      key={state.id}
                      className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
                      onClick={() => handleSelect(state)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                            <MapPin className="w-6 h-6 text-green-700" />
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{state.name}</h3>
                            <p className="text-sm text-gray-500">{state.code}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => toggleFavorite(e, state)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                          >
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          </button>
                          <ChevronRight className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* TODOS OS ESTADOS */}
            <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              {searchTerm ? "Resultados da Busca" : "Todos os Estados"}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredStates.map(state => (
                <Card
                  key={state.id}
                  className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => handleSelect(state)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                        <MapPin className="w-6 h-6 text-green-700" />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{state.name}</h3>
                        <p className="text-sm text-gray-500">{state.code}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleFavorite(e, state)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                      >
                        <Star
                          className="w-5 h-5"
                          style={{
                            color: isFavorite(state.id)
                              ? "var(--mist-yellow)"
                              : "var(--text-tertiary)",
                            fill: isFavorite(state.id)
                              ? "var(--mist-yellow)"
                              : "none"
                          }}
                        />
                      </button>

                      <ChevronRight className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* FOOTER */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <Button
            onClick={handleBack}
            className="bg-white text-gray-600 border border-gray-300 py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <p className="text-sm font-medium text-green-700 mt-4">
            ♻️ Gato Verde – Menos lixo, mais amor.
          </p>
          <p className="text-xs text-gray-500">Sistema de regionalização global</p>
        </div>

      </div>
    </div>
  );
}

