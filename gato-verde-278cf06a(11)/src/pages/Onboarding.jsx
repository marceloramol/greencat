import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ChevronRight, Globe, MapPin, TrendingUp } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <Globe className="w-20 h-20" style={{ color: 'var(--mist-primary)' }} />,
      title: 'Um terço dos alimentos do mundo é desperdiçado.',
      subtitle: 'Mas você pode mudar isso hoje.',
      animation: 'fadeIn 0.4s ease forwards'
    },
    {
      icon: <img 
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e84a50dd41f4fd278cf06a/85d0052d0_image.png" 
        alt="Gato Verde"
        className="w-32 h-32 object-cover scale-150"
      />,
      title: 'GreenCat conecta mercados e pessoas.',
      subtitle: 'Ofertas reais, impacto real, perto de você.',
      animation: 'fadeIn 0.4s ease forwards'
    },
    {
      icon: <MapPin className="w-20 h-20" style={{ color: 'var(--mist-primary)' }} />,
      title: 'Escolha seu país, estado e região.',
      subtitle: 'E desbloqueie ofertas perto de você.',
      animation: 'fadeIn 0.4s ease forwards'
    },
    {
      icon: <TrendingUp className="w-20 h-20" style={{ color: 'var(--mist-primary)' }} />,
      title: 'Faça parte do impacto.',
      subtitle: 'Cada compra salva o planeta e o bolso.',
      animation: 'fadeIn 0.4s ease forwards',
      cta: true
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate(createPageUrl('SelectCountry'));
    }
  };

  const handleSkip = () => {
    navigate(createPageUrl('SelectCountry'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ 
      background: 'var(--gradient-mist)',
      animation: 'fadeIn 0.32s ease forwards'
    }}>
      <div className="max-w-2xl w-full text-center">
        {/* Slide atual */}
        <div
          key={currentSlide}
          className="mb-12"
          style={{
            animation: slides[currentSlide].animation,
            opacity: 0
          }}
        >
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden" style={{
              background: 'var(--mist-card)',
              border: '2px solid var(--mist-primary)',
              boxShadow: 'var(--shadow-mist)'
            }}>
              {slides[currentSlide].icon}
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight" style={{
            color: 'white',
            textShadow: '0 0 20px rgba(0, 255, 157, 0.15)'
          }}>
            {slides[currentSlide].title}
          </h1>

          <p className="text-xl md:text-2xl mb-12 mist-glow-text">
            {slides[currentSlide].subtitle}
          </p>

          {slides[currentSlide].cta && (
            <Button
              onClick={handleNext}
              className="mist-button-primary text-lg px-8 py-6 mb-6"
              style={{ animation: 'fadeIn 0.6s ease forwards', opacity: 0 }}
            >
              Começar Agora
              <ChevronRight className="w-6 h-6 ml-2" />
            </Button>
          )}
        </div>

        {/* Indicadores de progresso */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="h-2 rounded-full transition-all"
              style={{
                width: currentSlide === index ? '32px' : '8px',
                background: currentSlide === index ? 'var(--mist-primary)' : 'rgba(0, 255, 157, 0.2)',
                boxShadow: currentSlide === index ? 'var(--shadow-mist)' : 'none'
              }}
            />
          ))}
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handleSkip}
            className="mist-button-tertiary"
          >
            Pular
          </Button>

          {!slides[currentSlide].cta && (
            <Button
              onClick={handleNext}
              className="mist-button-primary"
            >
              Próximo
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8" style={{ borderTop: '1px solid var(--mist-border)' }}>
          <p className="text-sm font-medium mist-glow-text">
            ♻️ Gato Verde – Menos lixo, mais amor.
          </p>
        </div>
      </div>
    </div>
  );
}