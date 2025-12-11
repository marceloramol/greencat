// ================================
// SelectProfile — GreenCat v2.0
// Estabilizado por Lobão 🐺
// ================================

import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ShoppingCart, Store } from "lucide-react";

export default function SelectProfile() {
  const navigate = useNavigate();

  // ----- Regras de verificação ao entrar -----
  React.useEffect(() => {
    const countrySelected = localStorage.getItem("countrySelected");
    const regiaoSelecionada = localStorage.getItem("regiaoSelecionada");

    if (!countrySelected) {
      navigate(createPageUrl("SelectCountry"));
    } else if (!regiaoSelecionada) {
      navigate(createPageUrl("SelecionarRegiao"));
    }
  }, [navigate]);

  // ----- Seletor -----
  const handleSelectProfile = (type) => {
    localStorage.setItem("userType", type);
    if (type === "client") {
      navigate(createPageUrl("Home"));
    } else {
      navigate(createPageUrl("MarketRegister"));
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F9FB] flex items-center justify-center px-6 py-10 animate-fadeUp">
      <div className="max-w-5xl w-full">

        {/* LOGO E INTRO */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 mx-auto rounded-full bg-white shadow-xl shadow-green-100 overflow-hidden flex items-center justify-center mb-8">
            <img
              src="/logo-greencat.png"
              alt="Gato Verde"
              className="w-full h-full object-cover scale-150"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x300?text=GreenCat+Logo";
              }}
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Gato Verde
          </h1>

          <p className="text-2xl md:text-3xl font-semibold text-green-700">
            Salvar comida é um ato de amor. 💚
          </p>
        </div>

        {/* BLOCO EXPLICATIVO */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl shadow-gray-100 p-10 mb-16 border border-gray-200">
          <h2 className="text-3xl font-bold text-green-700 text-center mb-8">
            🌱 Por que o Gato Verde existe?
          </h2>

          <div className="space-y-5 text-gray-700 text-lg leading-relaxed md:px-6">
            <p>
              O Brasil desperdiça mais de{" "}
              <strong className="text-gray-900">
                12 milhões de toneladas
              </strong>{" "}
              de alimentos todos os anos — um prejuízo estimado em{" "}
              <strong className="text-gray-900">R$ 27 bilhões</strong>.
            </p>

            <p>
              Pequenos mercados perdem produtos ainda bons, enquanto famílias
              passam necessidade.
            </p>

            <p className="font-semibold text-gray-900">
              O Gato Verde nasceu para conectar essas duas pontas: salvar comida,
              fortalecer o comércio local e proteger o planeta.
            </p>

            <p>
              Cada compra feita no app reduz desperdício e incentiva consumo
              consciente.
            </p>

            <p className="text-xl font-bold text-green-700 text-center mt-6">
              💚 Salvar comida é um ato de amor — e o amor alimenta o planeta.
            </p>
          </div>
        </div>

        {/* COMO FUNCIONA */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-green-700 mb-8">
            🧭 Como funciona?
          </h2>

          <div className="space-y-8 max-w-2xl mx-auto text-left">
            {/* ITEM 1 */}
            <div className="flex gap-5 items-start">
              <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  O lojista cadastra produtos próximos ao vencimento
                </h3>
                <p className="text-gray-600">
                  Tudo com preço reduzido e validade informada.
                </p>
              </div>
            </div>

            {/* ITEM 2 */}
            <div className="flex gap-5 items-start">
              <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  O cliente encontra ofertas na vizinhança
                </h3>
                <p className="text-gray-600">
                  Filtre por bairro, tipo de produto ou desconto.
                </p>
              </div>
            </div>

            {/* ITEM 3 */}
            <div className="flex gap-5 items-start">
              <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Compra segura e entrega local
                </h3>
                <p className="text-gray-600">
                  Você apoia o comércio local e economiza ao mesmo tempo.
                </p>
              </div>
            </div>
          </div>

          <p className="text-xl font-bold text-green-700 mt-10">
            💚 Um clique seu faz diferença.
          </p>
        </div>

        {/* CHAMADA — ESCOLHA O PERFIL */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Escolha como participar da revolução verde 🌿
          </h2>
          <p className="text-lg text-gray-600">
            Selecione seu perfil para começar:
          </p>
        </div>

        {/* CARDS DE PERFIL */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">

          {/* CLIENTE */}
          <button
            onClick={() => handleSelectProfile("client")}
            className="group bg-white border-2 border-green-600 rounded-2xl p-10 shadow-xl shadow-green-100 transition hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-green-700 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-semibold text-center text-gray-900 mb-4">
              Sou Cliente
            </h3>

            <p className="text-center text-gray-600 leading-relaxed mb-6">
              Quero economizar, salvar comida e ajudar o planeta.
            </p>

            <div className="text-center font-semibold text-green-700">
              Acessar como cliente →
            </div>
          </button>

          {/* NEGÓCIO */}
          <button
            onClick={() => handleSelectProfile("store")}
            className="group bg-white border-2 border-green-600 rounded-2xl p-10 shadow-xl shadow-green-100 transition hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-green-700 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Store className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-semibold text-center text-gray-900 mb-4">
              Tenho um Negócio
            </h3>

            <p className="text-center text-gray-600 leading-relaxed mb-6">
              Quero vender mais, reduzir perdas e alcançar novos clientes.
            </p>

            <div className="text-center font-semibold text-green-700">
              Acessar como parceiro →
            </div>
          </button>
        </div>

        {/* FOOTER */}
        <div className="text-center text-gray-600 space-y-1 pb-10">
          <p className="text-lg font-medium text-green-700">
            ♻️ Gato Verde – Menos lixo, mais amor.
          </p>
          <p className="text-sm">Projeto comunitário em expansão.</p>
          <p className="text-xs opacity-60">Studio Gato de Lata</p>
        </div>
      </div>
    </div>
  );
}

