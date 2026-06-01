/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Timer, HeartHandshake, ShieldCheck, MapPin, Award, CheckCircle } from 'lucide-react';

export default function Features() {
  const listFeatures = [
    {
      icon: <Timer className="w-8 h-8 text-brand-blue" />,
      title: 'Reparações Expresso',
      description: 'Mais de 85% das reparações de ecrã ou substituições de baterias são efetuadas e concluídas em menos de 1 hora.',
      badge: 'Velocidade Máxima',
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-brand-cyan" />,
      title: 'Diagnóstico 100% Gratuito',
      description: 'Na GTA-Tech avaliamos o seu telemóvel ou computador fisicamente sem cobrar nada. Só avança se aprovar o orçamento.',
      badge: 'Sem Compromisso',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-brand-amber" />,
      title: 'Garantia de 90 Dias',
      description: 'Todas as nossas intervenções e substituições de componentes vêm com uma garantia de 3 meses registada por escrito.',
      badge: 'Tranquilidade Total',
    },
    {
      icon: <Award className="w-8 h-8 text-indigo-500" />,
      title: 'Peças de Alta Gama',
      description: 'Damos primazia a componentes de teor original com calibração de TrueTone e taxas de refresco idênticas de fábrica.',
      badge: 'Qualidade Premium',
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-emerald-500" />,
      title: 'Laboratório Antiestático',
      description: 'Dispomos de equipamentos profissionais calibrados contra descargas eletrostáticas, garantindo integridade total da placa.',
      badge: 'Segurança Total',
    },
    {
      icon: <MapPin className="w-8 h-8 text-red-500" />,
      title: 'Centralizados em Cabinda',
      description: 'Estamos localizados numa área nobre com segurança e fácil estacionamento para sua total comodidade.',
      badge: 'Estacionamento Fácil',
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-100/50 relative transition-all">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-mono font-extrabold tracking-widest text-brand-blue bg-brand-blue/5 px-3.5 py-1.5 rounded-full">
            DIFERENCIAL COMPROVADO
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mt-4 tracking-tight text-slate-900 ">
            Porquê escolher a GTA-Tech para o seu dispositivo?
          </h2>
          <p className="text-slate-500 mt-4 text-md">
            Sabemos o quão indispensável o seu telemóvel e computador são no seu dia a dia. Por isso, organizámos uma estrutura focada em dar a melhor resposta com confiança absoluta.
          </p>
        </div>

        {/* Features Content Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {listFeatures.map((item, idx) => (
            <motion.div
              key={idx}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              className="glass-card p-6 sm:p-8 rounded-3xl hover:shadow-xl hover:border-brand-blue/20 cursor-default group shrink-0"
            >
              {/* Top Row with Icon & Badge */}
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 relative group-hover:scale-110 transition-all duration-350">
                  {item.icon}
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                  {item.badge}
                </span>
              </div>

              {/* Title & Description */}
              <div className="text-left">
                <h3 className="text-lg font-bold font-display text-slate-950 mb-2 pb-1 relative inline-block">
                  {item.title}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-blue group-hover:w-full transition-all duration-300" />
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Live Lab Guarantee Badge banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 text-left relative overflow-hidden shadow-xl"
        >
          {/* Neon gradient mesh behind */}
          <div className="absolute top-0 right-0 w-80 h-full bg-brand-cyan/10 blur-2xl -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight">
                Garantia escrita de 90 dias após o reparo
              </h3>
              <p className="text-slate-300 text-sm">
                Se surgir qualquer anomalia com a peça substituída durante 3 meses, efetuamos a troca imediata no laboratório sem burocracias e sem custos adicionais.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <a
                id="features-promo-cta"
                href="#estimador"
                className="w-full sm:w-auto text-center font-bold text-slate-950 bg-white hover:bg-slate-100 px-6 py-3.5 rounded-xl transition-all tracking-tight scale-100 hover:scale-[1.03] active:scale-[0.97]"
              >
                Reservar Intervenção Agora
              </a>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
