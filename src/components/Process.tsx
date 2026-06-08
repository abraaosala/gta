/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useData } from '../contexts/DataContext.tsx';
import { Check, ClipboardList, Settings, Sparkles, Truck } from 'lucide-react';

const StepIcons = [
  <ClipboardList className="w-6 h-6" key="clip" />,
  <Settings className="w-6 h-6" key="set" />,
  <Sparkles className="w-6 h-6" key="spark" />,
  <Truck className="w-6 h-6" key="truck" />,
];

export default function Process() {
  const { process } = useData();
  return (
    <section id="processo" className="py-20 bg-slate-50 tech-grid-bg transition-all">
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
            workflow transparente
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mt-4 tracking-tight text-slate-900 ">
            Como funciona o processo de reparação?
          </h2>
          <p className="text-slate-500 mt-4 text-md">
            Desenhámos uma metodologia transparente e ágil para que saiba exatamente em que fase de tratamento se encontra o seu telemóvel ou computador.
          </p>
        </div>

        {/* Dynamic Connected Node Stepper */}
        <div className="relative">
          {/* Connector timeline bar (desktop only) */}
          <div className="hidden lg:block absolute top-[68px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-amber opacity-30 z-0" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
          >
            {process.map((item, index) => {
              return (
                <motion.div
                  key={item.step}
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-slate-100 hover:shadow-xl hover:border-brand-blue/20 transition-all group shrink-0"
                >
                  {/* Circle Step Number Indicator */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 text-white flex items-center justify-center font-display font-bold text-lg shadow-md mb-6 relative group-hover:-translate-y-1.5 transition-all duration-300">
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-cyan text-slate-950 text-[10px] flex items-center justify-center font-mono font-bold border-2 border-white ">
                      #{item.step}
                    </span>
                    {StepIcons[index] || <Check />}
                  </div>

                  {/* Title & Badge */}
                  <span className="text-[10px] font-mono font-semibold text-brand-blue uppercase tracking-widest mb-1.5">
                    {item.badge}
                  </span>

                  <h3 className="text-lg font-bold text-slate-950 mb-2 leading-tight">
                    {item.title}
                  </h3>

                  {/* Description copy */}
                  <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom banner with live advice */}
        <div className="mt-16 text-center max-w-xl mx-auto bg-brand-blue/5 rounded-2.5xl p-5 border border-brand-blue/10 ">
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            💡 <strong>Dica Segura:</strong> Antes de entregar qualquer computador ou smartphone para reparação, aconselhamos sempre que possível a efetuar um backup dos seus dados importantes para sua total tranquilidade.
          </p>
        </div>

      </motion.div>
    </section>
  );
}
