/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQS_LIST } from '../data.ts';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white transition-all">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >

        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-mono font-extrabold tracking-widest text-brand-blue bg-brand-blue/5 px-3.5 py-1.5 rounded-full">
            DÚVIDAS FREQUENTES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mt-4 tracking-tight text-slate-900 ">
            Perguntas Frequentes
          </h2>
          <p className="text-slate-500 mt-4 text-sm max-w-xl mx-auto">
            Tem alguma questão sobre o nosso laboratório em Cabinda e os nossos serviços? Encontre as respostas rápidas abaixo.
          </p>
        </div>

        {/* Accordion Stack */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="space-y-4"
        >
          {FAQS_LIST.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.id}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                className="rounded-2xl border border-slate-150 bg-slate-50/50 overflow-hidden transition-all duration-300"
              >
                {/* Trigger Row */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-slate-50 transition-colors focus:outline-none focus:ring-0"
                >
                  <div className="flex items-center space-x-3 pr-4">
                    <HelpCircle className="w-5 h-5 text-brand-blue shrink-0" />
                    <span className="text-sm sm:text-base font-bold text-slate-950 leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <div className="p-1 rounded bg-white border border-slate-100 shrink-0 text-slate-500 ">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {/* Animated content body drawer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-150/40 bg-white/40 ">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

      </motion.div>
    </section>
  );
}
