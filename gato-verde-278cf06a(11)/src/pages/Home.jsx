// ==========================
// HOME — GreenCat v2.0
// Estabilizada por Lobão 🐺
// ==========================

import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  Key,
  Leaf,
  TrendingUp,
  Store,
  Users,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F6F9FB] animate-fadeUp">
      {/* ========================== */}
      {/*           HERO             */}
      {/* ========================== */}
      <section className="w-full bg-white py-16 md:py-20 px-6 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

          {/* LEFT */}
          <div className="space-y-6 opacity-0 translate-y-4 animate-fadeUp">
            <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-1 text-xs font-semibold text-green-700 border border-green-200">
              🌍 Economia sustentável • Produto pronto para escalar
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900">
              Gato Verde — o app que transforma desperdício em lucro real.
            </h1>

            <p className="text-base md:text-lg text-gray-600">
              Conectamos mercados e consumidores para reduzir perdas, criar oportunidades
              e movimentar a economia sustentável — de forma simples, automática e
              pronta para uso em qualquer cidade.
            </p>

            {/* BOTÕES */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                onClick={() => navigate(createPageUrl("SelectProfile"))}
                className="px-8 py-4 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-300/40 transition"
              >
                Começar Agora — É Grátis
              </Button>

              <Button
                onClick={() => scrollToSection("como-funciona")}
                variant="outline"
                className="px-8 py-4 text-lg font-semibold border-green-600 text-green-700 hover:bg-green-50 rounded-xl transition"
              >
                Ver Demo
              </Button>
            </div>

            <p className="text-sm text-gray-400">
              Sem cartão. Sem burocracia. Você testa, gosta… e só então decide.
            </p>

            {/* BALÃO IA */}
            <div className="mt-8 p-5 bg-white shadow-lg shadow-gray-100 rounded-2xl border border-gray-200 max-w-md">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                👋 <strong>Olá! Eu sou a Eve.</strong><br />
                Quer saber como o Gato Verde funciona?<br />
                Pergunte qualquer coisa — eu explico!
              </p>
            </div>
          </div>

          {/* RIGHT — EVE */}
          <div className="relative flex justify-center md:justify-end">

            {/* 🟩 IMAGEM DA EVE */}
            <img
              src="/eve-ceo-greencat.png"
              alt="Eve CEO — GreenCat"
              className="w-full max-w-md lg:max-w-lg rounded-2xl shadow-xl shadow-gray-200 opacity-0 translate-y-4 animate-fadeUp"
              style={{ animationDelay: "0.12s" }}
              onError={(e) => { e.target.src = "https://via.placeholder.com/600x800?text=Eve+Image+Missing"; }}
            />

            {/* CARD 1 */}
            <div
              className="hidden sm:flex items-center gap-2 absolute -top-4 -left-2 bg-white/95 backdrop-blur-md shadow-lg shadow-green-100 rounded-xl px-4 py-3 border border-green-200 text-xs md:text-sm opacity-0 translate-y-4 animate-fadeUp motion-safe:animate-float"
              style={{ animationDelay: "0.25s" }}
            >
              <span className="h-2 w-2 rounded-full bg-green-600" />
              <span><strong>+42%</strong> de vendas recuperadas</span>
            </div>

            {/* CARD 2 */}
            <div
              className="hidden sm:flex items-center gap-2 absolute top-16 -right-4 bg-white/95 backdrop-blur-md shadow-lg shadow-green-100 rounded-xl px-4 py-3 border border-green-200 text-xs md:text-sm opacity-0 translate-y-4 animate-fadeUp motion-safe:animate-float"
              style={{ animationDelay: "0.40s" }}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Clientes notificados automaticamente</span>
            </div>

            {/* CARD 3 */}
            <div
              className="hidden sm:flex items-center gap-2 absolute -bottom-3 left-4 bg-white/95 backdrop-blur-md shadow-lg shadow-green-100 rounded-xl px-4 py-3 border border-green-200 text-xs md:text-sm opacity-0 translate-y-4 animate-fadeUp motion-safe:animate-float"
              style={{ animationDelay: "0.55s" }}
            >
              <span className="h-2 w-2 rounded-full bg-lime-500" />
              <span>Redução real do desperdício</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================== */}
      {/*     COMO FUNCIONA         */}
      {/* ========================== */}
      <section id="como-funciona" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-gray-900">
            Como Funciona
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center shadow-md hover:shadow-xl transition rounded-2xl">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-green-100 border-2 border-green-600">
                <MapPin className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">1️⃣ Escolha sua região</h3>
              <p className="text-gray-600">
                Selecione país, estado e região para operar.
              </p>
            </Card>

            <Card className="p-8 text-center shadow-md hover:shadow-xl transition rounded-2xl">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-green-100 border-2 border-green-600">
                <Key className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">2️⃣ Assine sua licença</h3>
              <p className="text-gray-600">
                Regiões são exclusivas. Sua assinatura garante operação.
              </p>
            </Card>

            <Card className="p-8 text-center shadow-md hover:shadow-xl transition rounded-2xl">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-green-100 border-2 border-green-600">
                <Leaf className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">3️⃣ Gere impacto</h3>
              <p className="text-gray-600">
                Conecte mercados, salve alimentos e reduza CO₂.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================== */}
      {/*     IMPACTO GLOBAL        */}
      {/* ========================== */}
      <section className="py-20 px-6 bg-green-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-gray-900">
            🌍 Impacto Global
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-8 text-center border-2 border-green-600 bg-white shadow-sm rounded-2xl">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-5xl font-black mb-2 text-green-600">100.000</h3>
              <p className="text-gray-600">kg de comida salva</p>
            </Card>

            <Card className="p-8 text-center border-2 border-green-600 bg-white shadow-sm rounded-2xl">
              <Leaf className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-5xl font-black mb-2 text-green-600">42.000</h3>
              <p className="text-gray-600">kg CO₂ reduzido</p>
            </Card>

            <Card className="p-8 text-center border-2 border-green-600 bg-white shadow-sm rounded-2xl">
              <Store className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-5xl font-black mb-2 text-green-600">1.200</h3>
              <p className="text-gray-600">mercados participantes</p>
            </Card>

            <Card className="p-8 text-center border-2 border-green-600 bg-white shadow-sm rounded-2xl">
              <Users className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-5xl font-black mb-2 text-green-600">320</h3>
              <p className="text-gray-600">operadores ativos</p>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================== */}
      {/*        CTA FINAL          */}
      {/* ========================== */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-900">
            Transforme impacto em oportunidade.
          </h2>

          <p className="text-xl md:text-2xl mb-12 text-gray-600">
            Junte-se ao movimento global de redução de desperdício
          </p>

          <Button
            onClick={() => navigate(createPageUrl("LicenciarRegiao"))}
            className="text-xl px-12 py-8 font-semibold bg-green-700 hover:bg-green-800 text-white rounded-xl shadow-xl shadow-green-300/40 transition"
          >
            Torne-se Operador Agora
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </div>
      </section>

      {/* ========================== */}
      {/*          FOOTER           */}
      {/* ========================== */}
      <footer className="py-12 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg font-medium mb-2 text-green-700">
            ♻️ Gato Verde – Menos lixo, mais amor.
          </p>
          <p className="text-sm text-gray-500">
            Projeto global em expansão • Studio Gato de Lata
          </p>
        </div>
      </footer>
    </div>
  );
}

