/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useData } from '../contexts/DataContext.tsx';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export default function Testimonials() {
  const { testimonials } = useData();
  return (
    <section id="depoimentos" className="py-20 bg-slate-100/30 tech-grid-bg transition-all">
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
            EXPERIÊNCIAS COMPARTILHADAS
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mt-4 tracking-tight text-slate-900 ">
            O que dizem os nossos clientes em Cabinda?
          </h2>
          <p className="text-slate-500 mt-4 text-md">
            A nossa prioridade número um é a satisfação absoluta de quem nos confia os seus valiosos equipamentos de trabalho e comunicação.
          </p>
        </div>

        {/* Grid stack */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((t, idx) => {
            return (
              <motion.div
                key={t.id}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                className="glass-card hover:bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 text-left flex flex-col justify-between relative group"
              >
                {/* Decorative floating double quote in card top */}
                <div className="absolute top-6 right-6 text-slate-200/50 group-hover:text-brand-cyan/20 transition-all">
                  <Quote className="w-8 h-8" />
                </div>

                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star className="w-4 h-4 fill-brand-amber text-brand-amber" key={i} />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-sm font-sans italic text-slate-600 mb-6 leading-relaxed">
                    "{t.comment}"
                  </p>
                </div>

                {/* Sender card detail */}
                <div className="flex items-center space-x-3 pt-5 border-t border-slate-100 mt-auto">
                  {/* Avatar circle (Initials name design) */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-blue to-cyan-500 text-white flex items-center justify-center font-bold text-sm tracking-tight">
                    {t.name.split(' ').map(part => part[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-950 leading-none">
                      {t.name}
                    </h4>

                    {/* Device Repaired meta tags */}
                    <div className="flex items-center text-[10px] text-slate-400 mt-1.5 font-mono">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 mr-1 shrink-0" />
                      <span className="line-clamp-1">{t.deviceRepaired}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Satisfied Clients banner */}
        <div className="mt-16 text-center text-xs text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>✔️ Avaliação Média Corporativa: <strong>4.9 / 5.0 estrelas</strong></span>
          <span className="hidden sm:inline">·</span>
          <span>Baseado em mais de 450 avaliações presenciais e Google Maps</span>
        </div>

      </motion.div>
    </section>
  );
}
