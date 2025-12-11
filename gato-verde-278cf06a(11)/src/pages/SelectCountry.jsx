import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronRight, Star } from "lucide-react";

export default function SelectCountry() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // LISTA DE PAÍSES
  const { data: countries = [], isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const all = await base44.entities.Country.list();
      return all.sort((a, b) => a.name.localeCompare(b.name));
    },
    initialData: []
  });

  // FAVORITOS
  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites", "country"],
    queryFn: async () => {
      const allFav = await base44.entities.Favorite.list();
      return allFav.filter((f) => f.type === "country");
    },
    initialData: []
  });

  const addFavoriteMutation = useMutation({
    mutationFn: (data) => base44.entities.Favorite.create(data),
    onSuccess: () => queryClient.invalidateQueries(["favorites"])
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (id) => base44.entities.Favorite.delete(id),
    onSuccess: () => queryClient.invalidateQueries(["favorites"])
  });

  const isFavorite = (id) => favorites.some((f) => f.itemId === id);

  const toggleFavorite = (e, country) => {
    e.stopPropagation();
    const fav = favorites.find((f) => f.itemId === country.id);

    if (fav) removeFavoriteMutation.mutate(fav.id);
    else
      addFavoriteMutation.mutate({
        type: "country",
        itemId: country.id,
        itemName: country.name,
        itemCode: country.code,
        countryId: country.id
      });
  };

  const favoriteCountries = countries.filter((c) => isFavorite(c.id));

  const filteredCountries = countries.filter((c) =>
    searchTerm
      ? c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  const handleSelectCountry = (country) => {
    localStorage.setItem("countrySelected", country.id);
    localStorage.setItem("countryCode", country.code);
    localStorage.setItem("countryName", country.name);

    setLoading(true);
    setTimeout(() => navigate(createPageUrl("SelectState")), 400);
  };

  const getFlag = (code) => {
    const flags = {
      BR: "🇧🇷",
      US: "🇺🇸",
      MX: "🇲🇽",
      PT: "🇵🇹",
      ES: "🇪🇸",
      AR: "🇦🇷",
      CL: "🇨🇱",
      CO: "🇨🇴",
      PE: "🇵🇪",
      UY: "🇺🇾",
      CA: "🇨🇦",
      AU: "🇦🇺",
      JP: "🇯🇵"
    };
    return flags[code] || "🌍";
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: "var(--gradient-mist)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 overflow-hidden"
            style={{
              background: "white",
              boxShadow: "var(--shadow-premium)"
            }}
          >
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e84a50dd41f4fd278cf06a/85d0052d0_image.png"
              alt="Gato Verde"
              className="w-full h-full object-cover scale-150"
            />
          </div>

          <h1
            className="text-3xl md:text-4xl font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Bem-vindo ao Gato Verde
          </h1>

          <p
            className="text-lg font-medium mb-8"
            style={{ color: "var(--mist-primary)" }}
          >
            Selecione seu país 🌍
          </p>

          {/* BUSCA */}
          <div className="relative max-w-xl mx-auto mb-8">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: "var(--text-tertiary)" }}
            />

            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar país..."
              className="pl-12 h-12 text-base"
              style={{
                background: "white",
                border: "1px solid var(--mist-border)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-premium)",
                color: "var(--text-primary)"
              }}
            />
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-12">
            <div
              className="animate-spin rounded-full h-12 w-12 border-4 mx-auto mb-4"
              style={{
                borderColor: "var(--mist-light-gray)",
                borderTopColor: "var(--mist-primary)"
              }}
            />
            <p style={{ color: "var(--text-secondary)" }}>
              Carregando estados...
            </p>
          </div>
        )}

        {/* LISTA DE PAÍSES */}
        {!loading && isLoading ? (
          <div className="text-center py-20">
            <div
              className="animate-spin rounded-full h-12 w-12 border-4 mx-auto mb-4"
              style={{
                borderColor: "var(--mist-light-gray)",
                borderTopColor: "var(--mist-primary)"
              }}
            />
            <p style={{ color: "var(--text-secondary)" }}>
              Carregando países...
            </p>
          </div>
        ) : filteredCountries.length === 0 ? (
          <Card
            className="p-12 text-center"
            style={{
              background: "white",
              borderRadius: "var(--radius-premium)",
              boxShadow: "var(--shadow-premium)"
            }}
          >
            <h3 className="text-xl font-semibold mb-2">
              Nenhum país encontrado
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              {searchTerm
                ? "Tente outro termo de busca"
                : "Nenhum país disponível no momento"}
            </p>
          </Card>
        ) : (
          <>
            {/* FAVORITOS */}
            {favoriteCountries.length > 0 && !searchTerm && (
              <div className="mb-10">
                <h2
                  className="text-xl font-semibold mb-4 flex items-center gap-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  <Star
                    className="w-5 h-5"
                    style={{
                      color: "var(--mist-yellow)",
                      fill: "var(--mist-yellow)"
                    }}
                  />
                  Seus Favoritos
                </h2>

                <div className="space-y-3">
                  {favoriteCountries.map((c) => (
                    <Card
                      key={c.id}
                      className="mist-card mist-card-hover cursor-pointer"
                      onClick={() => handleSelectCountry(c)}
                      style={{ background: "white", padding: "16px 20px" }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{getFlag(c.code)}</div>
                          <div>
                            <h3
                              className="text-lg font-semibold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {c.name}
                            </h3>
                            <p
                              className="text-sm"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {c.code}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => toggleFavorite(e, c)}
                            className="p-2 rounded-lg"
                            style={{ background: "rgba(244,218,116,0.1)" }}
                          >
                            <Star
                              className="w-5 h-5"
                              style={{
                                color: "var(--mist-yellow)",
                                fill: "var(--mist-yellow)"
                              }}
                            />
                          </button>
                          <ChevronRight
                            className="w-5 h-5"
                            style={{ color: "var(--mist-primary)" }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* TODOS OS PAÍSES */}
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              {searchTerm ? "Resultados da Busca" : "Todos os Países"}
            </h2>

            <div className="space-y-3">
              {filteredCountries.map((c) => (
                <Card
                  key={c.id}
                  className="mist-card mist-card-hover cursor-pointer"
                  onClick={() => handleSelectCountry(c)}
                  style={{ background: "white", padding: "16px 20px" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{getFlag(c.code)}</div>
                      <div>
                        <h3
                          className="text-lg font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {c.name}
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {c.code}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleFavorite(e, c)}
                        className="p-2 rounded-lg hover:bg-gray-50"
                      >
                        <Star
                          className="w-5 h-5"
                          style={{
                            color: isFavorite(c.id)
                              ? "var(--mist-yellow)"
                              : "var(--text-tertiary)",
                            fill: isFavorite(c.id)
                              ? "var(--mist-yellow)"
                              : "none"
                          }}
                        />
                      </button>
                      <ChevronRight
                        className="w-5 h-5"
                        style={{ color: "var(--mist-primary)" }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* FOOTER */}
        <div
          className="text-center mt-16 pt-8"
          style={{ borderTop: "1px solid var(--mist-border)" }}
        >
          <p
            className="text-sm font-medium mb-2"
            style={{ color: "var(--mist-primary)" }}
          >
            ♻️ Gato Verde – Menos lixo, mais amor.
          </p>
          <p
            className="text-xs"
            style={{ color: "var(--text-tertiary)" }}
          >
            Sistema de regionalização global
          </p>
        </div>
      </div>
    </div>
  );
}

