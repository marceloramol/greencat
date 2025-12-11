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
  ArrowRight
} from "lucide-react";

export default function LandingGlobal() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--gradient-mist)",
        animation: "fadeIn 0.3s ease-out"
      }}
    >
      {/* HERO */}
      <section className="w-full bg-white py-16 md:py-20 px-6 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div className="space-y-6 opacity-0 translate-y-3 animate-fadeUp">
            <span
              className="inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold"
              style={{
                background: "var(--mist-primary-light)",
                color: "var(--mist-primary)",
                border: "1px solid var(--mist-primary-medium)"
              }}
            >
              🌍 Economia sustentável • Produto pronto para escalar
            </span>

            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Gato Verde — o app que transforma desperdício em lucro real.
            </h1>

            <p className="text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
              Conectamos mercados e consumidores para reduzir perdas e movimentar a economia sustentável — 
              com tecnologia simples, automática e pronta para qualquer cidade do mundo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                onClick={() => navigate(createPageUrl("SelectProfile"))}
                className="px-8 py-4 text-base md:text-lg font-semibold"
                style={{
                  background: "var(--mist-charcoal)",
                  color: "white",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-premium)"
                }}
              >
                Começar Agora — É Grátis
              </Button>

              <Button
                onClick={() => scrollToSection("como-funciona")}
                variant="outline"
                className="px-8 py-4 text-base md:text-lg font-semibold"
                style={{
                  borderColor: "var(--mist-primary)",
                  color: "var(--mist-primary)",
                  borderRadius: "var(--radius-md)"
                }}
              >
                Ver Demo
              </Button>
            </div>

            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              Sem cartão. Sem burocracia. Você testa, gosta… e só então decide.
            </p>

            {/* BALÃO DA EVE */}
            <div
              className="mt-6 p-5 rounded-2xl max-w-md"
              style={{
                background: "white",
                boxShadow: "var(--shadow-premium)",
                border: "1px solid var(--mist-border)"
              }}
            >
              <p className="text-sm md:text-base leading-relaxed" style={{ color: "var(--text-primary)" }}>
                👋 <strong>Olá! Eu sou a Eve.</strong><br />
                Quer saber como o Gato Verde funciona?<br />
                Pergunte qualquer coisa — eu explico!
              </p>
            </div>
          </div>

          {/* RIGHT — IMAGEM E CARDS */}
          <div className="relative flex justify-center md:justify-end">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e84a50dd41f4fd278cf06a/18c602194_Gemini_Generated_Image_xiwrgpxiwrgpxiwr.png"
              alt="Eve CEO — GreenCat"
              className="w-full max-w-md lg:max-w-lg rounded-xl opacity-0 translate-y-3 animate-fadeUp"
              style={{
                animationDelay: "0.15s",
                boxShadow: "var(--shadow-hover)"
              }}
            />

            {/* FLOAT CARDS */}
            <div
              className="hidden sm:flex absolute -top-4 -left-2 items-center gap-2 px-4 py-3 rounded-xl text-xs opacity-0 translate-y-3 animate-fadeUp animate-float"
              style={{
                animationDelay: "0.28s",
                background: "rgba(255,255,255,0.95)",
                border: "1px solid var(--mist-primary-medium)",
                boxShadow: "var(--shadow-hover)"
              }}
            >
              <div className="h-2 w-2 rounded-full" style={{ background: "var(--mist-primary)" }} />
              <span><strong>+42%</strong> de vendas recuperadas</span>
            </div>

            <div
              className="hidden sm:flex absolute top-16 -right-4 items-center gap-2 px-4 py-3 rounded-xl text-xs opacity-0 translate-y-3 animate-fadeUp animate-float"
              style={{
                animationDelay: "0.38s",
                background: "rgba(255,255,255,0.95)",
                border: "1px solid var(--mist-primary-medium)",
                boxShadow: "var(--shadow-hover)"
              }}
            >
              <div className="h-2 w-2 rounded-full" style={{ background: "var(--mist-primary)" }} />
              <span>Clientes notificados automaticamente</span>
            </div>

            <div
              className="hidden sm:flex absolute -bottom-3 left-4 items-center gap-2 px-4 py-3 rounded-xl text-xs opacity-0 translate-y-3 animate-fadeUp animate-float"
              style={{
                animationDelay: "0.48s",
                background: "rgba(255,255,255,0.95)",
                border: "1px solid var(--mist-primary-medium)",
                boxShadow: "var(--shadow-hover)"
              }}
            >
              <div className="h-2 w-2 rounded-full" style={{ background: "var(--mist-primary)" }} />
              <span>Redução real do desperdício</span>
            </div>
          </div>

        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">

          <h2
            className="text-4xl md:text-5xl font-black text-center mb-16"
            style={{ color: "var(--text-primary)" }}
          >
            Como Funciona
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: "Escolha sua região", desc: "Selecione país, estado e região para operar." },
              { icon: Key, title: "Assine sua licença", desc: "Regiões são exclusivas. Sua assinatura garante operação." },
              { icon: Leaf, title: "Gere impacto", desc: "Conecte mercados, salve alimentos e reduza CO₂." }
            ].map(({ icon: Icon, title, desc }, i) => (
              <Card
                key={i}
                className="p-8 text-center mist-card mist-card-hover"
                style={{ background: "white" }}
              >
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{
                    background: "var(--mist-primary-light)",
                    border: "2px solid var(--mist-primary)"
                  }}
                >
                  <Icon className="w-10 h-10" style={{ color: "var(--mist-primary)" }} />
                </div>

                <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                  {i + 1}️⃣ {title}
                </h3>

                <p style={{ color: "var(--text-secondary)" }}>{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACTO GLOBAL */}
      <section
        className="py-20 px-6"
        style={{ background: "var(--mist-primary-light)" }}
      >
        <div className="max-w-7xl mx-auto">

          <h2
            className="text-4xl md:text-5xl font-black text-center mb-16"
            style={{ color: "var(--text-primary)" }}
          >
            🌍 Impacto Global
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, n: "100,000", t: "kg de comida salva" },
              { icon: Leaf, n: "42,000", t: "kg CO₂ reduzido" },
              { icon: Store, n: "1,200", t: "mercados participantes" },
              { icon: Users, n: "320", t: "operadores ativos" }
            ].map((item, i) => (
              <Card
                key={i}
                className="p-8 text-center mist-card"
                style={{
                  background: "white",
                  border: "2px solid var(--mist-primary)"
                }}
              >
                <item.icon className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--mist-primary)" }} />
                <h3
                  className="text-5xl font-black mb-2"
                  style={{ color: "var(--mist-primary)" }}
                >
                  {item.n}
                </h3>
                <p style={{ color: "var(--text-secondary)" }}>{item.t}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">

          <h2
            className="text-4xl md:text-6xl font-black mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Transforme impacto em oportunidade.
          </h2>

          <p
            className="text-xl md:text-2xl mb-12"
            style={{ color: "var(--text-secondary)" }}
          >
            Junte-se ao movimento global de redução de desperdício
          </p>

          <Button
            onClick={() => navigate(createPageUrl("LicenciarRegiao"))}
            className="text-xl px-12 py-8"
            style={{
              background: "var(--mist-charcoal)",
              color: "white",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-hover)"
            }}
          >
            Torne-se Operador Agora
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="py-12 px-6"
        style={{ borderTop: "1px solid var(--mist-border)" }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <p
            className="text-lg font-medium mb-2"
            style={{ color: "var(--mist-primary)" }}
          >
            ♻️ Gato Verde – Menos lixo, mais amor.
          </p>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Projeto global em expansão • Studio Gato de Lata
          </p>
        </div>
      </footer>
    </div>
  );
}

