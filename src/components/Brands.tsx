/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useData } from '../contexts/DataContext.tsx';
import { Apple, Smartphone, Laptop, Check } from 'lucide-react';

export default function Brands() {
  const { brands } = useData();
  return (
    <section className="py-12 bg-white border-y border-slate-150/40 transition-all">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >

        {/* Title */}
        <div className="text-center mb-8">
          <p className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
            REPARAMOS TODAS AS MARCAS PRINCIPAIS DO MERCADO
          </p>
        </div>

        {/* Scrolling Grid or flex row */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          {brands.map((brand) => {
            return (
              <motion.div
                key={brand.id}
                variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-2.5 hover:bg-slate-100 hover:border-slate-200 transition-all duration-300"
              >
                {/* Visual Icon matching */}
                {brand.logoType === 'apple' ? (
                  <Apple className="w-4 h-4 text-slate-700 " />
                ) : brand.logoType === 'hp' || brand.logoType === 'dell' || brand.logoType === 'lenovo' || brand.logoType === 'asus' ? (
                  <Laptop className="w-4 h-4 text-brand-blue" />
                ) : (
                  <Smartphone className="w-4 h-4 text-brand-cyan" />
                )}

                <span className="text-sm font-bold font-display text-slate-800 ">
                  {brand.name}
                </span>

                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
