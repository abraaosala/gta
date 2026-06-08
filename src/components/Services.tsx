/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Smartphone, BatteryCharging, Cpu, Plug, Laptop, CloudLightning, ArrowRight, Check } from 'lucide-react';
import { useData } from '../contexts/DataContext.tsx';

// Dynamic Lucide selection mapping
const IconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Smartphone,
  BatteryCharging,
  Cpu,
  Plug,
  Laptop,
  CloudLightning,
};

interface ServicesProps {
  onSelectService: (serviceId: string) => void;
}

export default function Services({ onSelectService }: ServicesProps) {
  const { services } = useData();
  return (
    <section id="servicos" className="py-20 bg-white transition-all">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >

        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div className="text-left max-w-2xl">
            <span className="text-xs uppercase font-mono font-extrabold tracking-widest text-brand-blue bg-brand-blue/5 px-3.5 py-1.5 rounded-full">
              SERVIÇOS DE EXCELÊNCIA
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mt-4 tracking-tight text-slate-900 ">
              Especialistas qualificados em reparações de hardware e software
            </h2>
          </div>
          <div className="mt-4 md:mt-0 text-left">
            <p className="text-slate-500 text-sm max-w-sm md:text-right">
              Utilizamos técnicas avançadas e ferramentas de precisão cirúrgica para assegurar que o seu aparelho volta a funcionar a 100%.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const IconComponent = IconMap[service.iconName] || Smartphone;
            return (
              <motion.div
                key={service.id}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-brand-blue/20 transition-all duration-300 text-left"
              >
                <div>
                  {/* Icon & Specs Header inside each card */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 text-brand-blue bg-brand-blue/5 rounded-2.5xl group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
                        Tempo Médio
                      </span>
                      <span className="block text-xs font-bold text-slate-800 ">
                        {service.avgTime}
                      </span>
                    </div>
                  </div>

                  {/* Text details */}
                  <h3 className="text-xl font-bold font-display text-slate-950 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Unordered detailed list vectors */}
                  <ul className="space-y-2.5 mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-xs text-slate-600 ">
                        <Check className="w-4 h-4 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer with Price starting rate and CTA linkage */}
                <div className="pt-5 border-t border-slate-200/60 flex items-center justify-between mt-auto">
                  <div>
                    <span className="block text-[10px] font-mono text-slate-400 uppercase leading-none mb-1">
                      Orçamento Estimado
                    </span>
                    <span className="text-sm font-bold text-brand-blue ">
                      {service.priceRange}
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectService(service.id)}
                    className="flex items-center justify-center p-2.5 rounded-xl bg-slate-100 hover:bg-brand-blue text-slate-700 hover:text-white transition-all cursor-pointer group-hover:scale-110"
                    title="Pre-selecionar no Calculador de Orçamentos"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Dynamic prompt to support customizable repairs */}
        <div className="mt-12 text-center text-sm font-mono text-slate-400">
          * Não encontra a avaria do seu aparelho? Contacte-nos directamente no Telegram ou WhatsApp para análise de placa ao microscópio.
        </div>

      </motion.div>
    </section>
  );
}
