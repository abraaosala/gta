/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Award, MessageCircle, ArrowRight } from 'lucide-react';
import { BUSINESS_INFO } from '../data.ts';

interface HeroSlide {
  image: string;
  tagline: string;
  headline: JSX.Element;
  description: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=1200&auto=format&fit=crop&q=80',
    tagline: 'Laboratório Aberto · Atendimento Imediato',
    headline: (
      <>
        O seu telemóvel <span className="text-slate-500 italic">partiu</span> ou o PC <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">não liga?</span>
      </>
    ),
    description: 'Na GTA-Tech em Cabinda, reparamos os seus smartphones, tablets e portáteis na hora. Peças originais, técnicos certificados de bancada e garantia por escrito de 90 dias em todas as intervenções.',
  },
  {
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1200&auto=format&fit=crop&q=80',
    tagline: 'Upgrade · Reparação · Otimização',
    headline: (
      <>
        PC lento, barulhento ou <span className="text-slate-500 italic">sobreaquecido?</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Nós resolvemos!</span>
      </>
    ),
    description: 'Desde formatação e instalação de SSD ultrarrápido até reparação de teclados, dobradiças e ventoinhas. Computadores HP, Dell, Lenovo e MacBooks com assistência especializada em Cabinda.',
  },
  {
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    tagline: 'Diagnóstico Gratuito · 15 Minutos',
    headline: (
      <>
        Danos por água, queda ou <span className="text-slate-500 italic">curto-circuito?</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Tecnologia de ponta</span>
      </>
    ),
    description: 'Microsoldadura avançada, recuperação de dados e reparação de placas-mãe com equipamento de laboratório de precisão. 90 dias de garantia em todas as intervenções.',
  },
];

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const [prevImage, setPrevImage] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => {
        setPrevImage(prev);
        return (prev + 1) % HERO_SLIDES.length;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToImage = useCallback((index: number) => {
    setPrevImage((prev) => (prev === null ? currentImage : prev));
    setCurrentImage(index);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setPrevImage(null), 1500);
  }, [currentImage]);

  // Clean up prevImage after crossfade completes
  useEffect(() => {
    if (prevImage !== null) {
      timeoutRef.current = setTimeout(() => setPrevImage(null), 1500);
      return () => clearTimeout(timeoutRef.current);
    }
  }, [prevImage]);

  const handleScrollToEstimator = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById('estimador');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="inicio"
      className="relative pt-16 pb-12 lg:pt-20 lg:pb-14 overflow-hidden isolate"
    >
      {/* Crossfade background images — previous fades out, current fades in */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Previous image fading out */}
        {prevImage !== null && (
          <motion.div
            key={`prev-${prevImage}`}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_SLIDES[prevImage].image})` }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        )}

        {/* Current image fading in */}
        <motion.div
          key={`cur-${currentImage}`}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_SLIDES[currentImage].image})` }}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Overlay branco suave para manter tom claro minimalista */}
      <div className="absolute inset-0 bg-white/50 z-[1]" />

      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl animate-pulse-slow z-[2]" />
      <div className="absolute top-1/3 right-1/10 w-128 h-128 bg-brand-cyan/15 rounded-full blur-3xl animate-pulse-slow z-[2]" />

      {/* Carousel navigation dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              index === currentImage
                ? 'w-8 h-2 bg-blue-600'
                : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Imagem ${index + 1}`}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content Grid (Cols 12 centered) */}
          <div className="lg:col-span-8 lg:col-start-3 flex flex-col space-y-6 text-center lg:text-left">

            {/* Tagline Status Badge */}
            <motion.div
              key={`tag-${currentImage}`}
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex self-center lg:self-start items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              {HERO_SLIDES[currentImage].tagline}
            </motion.div>

            {/* Main Catchy Heading */}
            <motion.h1
              key={`h1-${currentImage}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tighter text-slate-900 font-display"
            >
              {HERO_SLIDES[currentImage].headline}
            </motion.h1>

            {/* Supporting Pitch */}
            <motion.p
              key={`desc-${currentImage}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-600 max-w-xl leading-relaxed font-sans self-center lg:self-start"
            >
              {HERO_SLIDES[currentImage].description}
            </motion.p>

            {/* Quick Metrics Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-3 gap-4 border-y border-slate-200 py-6 my-2 self-center lg:self-start max-w-md"
            >
              <div className="flex flex-col">
                <span className="text-3xl font-bold font-display text-slate-900 flex items-center gap-0.5">
                  15<span className="text-xs font-normal text-slate-500 ">min</span>
                </span>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
                  Diagnóstico
                </span>
              </div>
              <div className="flex flex-col border-x border-slate-200 px-3 sm:px-6">
                <span className="text-3xl font-bold font-display text-slate-900 ">
                  100%
                </span>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
                  Aprovado
                </span>
              </div>
              <div className="flex flex-col pl-2">
                <span className="text-3xl font-bold font-display text-slate-900 ">
                  90<span className="text-xs font-normal text-slate-500 ">dias</span>
                </span>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
                  Garantia
                </span>
              </div>
            </motion.div>

            {/* Primary & Secondary Action Portals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 sm:items-center pt-2 self-center lg:self-start"
            >
              {/* Estimator Button */}
              <a
                id="hero-estimator-btn"
                href="#estimador"
                onClick={handleScrollToEstimator}
                className="h-14 px-8 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all group font-bold text-sm text-white scale-100 hover:scale-[1.02] active:scale-[0.98]"
              >
                Orçamento de Reparo Online
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Whatsapp Direct Callout */}
              <a
                id="hero-whatsapp-btn"
                href={`https://wa.me/${BUSINESS_INFO.whatsapp}?text=Olá,%20gostaria%20de%20solicitar%20uma%20assistência%20técnica%20para%20o%20meu%20dispositivo.`}
                target="_blank"
                referrerPolicy="no-referrer"
                rel="noopener noreferrer"
                className="h-14 px-8 border border-slate-200 hover:border-slate-300 rounded-xl flex items-center justify-center font-semibold transition-all bg-white text-slate-800 scale-100 hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5 mr-2 text-blue-500 " />
                Falar com Técnico (WhatsApp)
              </a>
            </motion.div>

            {/* Little trust factors */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400 font-mono pt-2 self-center lg:self-start"
            >
              <span className="flex items-center">
                <ShieldCheck className="w-4 h-4 text-emerald-500 mr-1.5" />
                Laboratório Certificado ESD
              </span>
              <span className="flex items-center">
                <Award className="w-4 h-4 text-brand-cyan mr-1.5" />
                Reparações de Microeletrónica
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
