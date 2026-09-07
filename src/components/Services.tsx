/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  Smartphone, BatteryCharging, Cpu, Plug, Laptop, CloudLightning,
  Tablet, Monitor, Watch, Gamepad, Camera, Headphones, Speaker, Printer,
  HardDrive, Server, BatteryWarning, Zap, Wifi, Bluetooth, Signal, Cloud,
  Shield, Lock, Search, Eye, Hammer, Wrench, Settings, Sliders,
  RefreshCw, Download, Upload, Phone, MessageCircle, Mail,
  Microchip, CircuitBoard, Fan, Thermometer, Keyboard, Mouse, Disc, Usb,
  Radio, Tv, ArrowRight, Check,
} from 'lucide-react';
import { useData } from '../contexts/DataContext.tsx';
import SectionHeader from './SectionHeader.tsx';

// Dynamic Lucide selection mapping
const IconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Smartphone, BatteryCharging, Cpu, Plug, Laptop, CloudLightning,
  Tablet, Monitor, Watch, Gamepad, Camera, Headphones, Speaker, Printer,
  HardDrive, Server, BatteryWarning, Zap, Wifi, Bluetooth, Signal, Cloud,
  Shield, Lock, Search, Eye, Hammer, Wrench, Settings, Sliders,
  RefreshCw, Download, Upload, Phone, MessageCircle, Mail,
  Microchip, CircuitBoard, Fan, Thermometer, Keyboard, Mouse, Disc, Usb,
  Radio, Tv,
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
        <SectionHeader
          align="split"
          className="mb-16"
          badge="SERVIÇOS DE EXCELÊNCIA"
          title="Especialistas qualificados em reparações de hardware e software"
          actions={
            <p className="text-slate-500 text-sm max-w-sm md:text-right">
              Utilizamos técnicas avançadas e ferramentas de precisão cirúrgica para assegurar que o seu aparelho volta a funcionar a 100%.
            </p>
          }
        />

        {/* Services Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {services.map((service, index) => {
            const IconComponent = IconMap[service.iconName] || Smartphone;
            return (
              <motion.div
                key={service.id}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/30 transition-all duration-300 text-left"
              >
                <div>
                  {/* Icon & Specs Header inside each card */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3.5 text-blue-600 bg-blue-50 border border-blue-100 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-2xs">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
                        Tempo Médio
                      </span>
                      <span className="inline-block text-xs font-bold text-slate-800 bg-white border border-slate-200/70 px-2.5 py-0.5 rounded-full mt-1 shadow-2xs">
                        {service.avgTime}
                      </span>
                    </div>
                  </div>

                  {/* Text details */}
                  <h3 className="text-xl font-bold font-display text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Unordered detailed list vectors */}
                  <ul className="space-y-2.5 mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-xs text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer with Price starting rate and CTA linkage */}
                <div className="pt-5 border-t border-slate-200/80 flex items-center justify-between mt-auto">
                  <div>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase leading-none mb-1">
                      Orçamento Estimado
                    </span>
                    <span className="text-base font-extrabold text-blue-600 font-display">
                      {service.priceRange}
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectService(service.id)}
                    className="flex items-center justify-center p-2.5 rounded-xl bg-white border border-slate-200/80 hover:bg-blue-600 hover:border-blue-600 text-slate-700 hover:text-white transition-all cursor-pointer shadow-2xs group-hover:scale-105"
                    title="Pré-selecionar no Calculador de Orçamentos"
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
