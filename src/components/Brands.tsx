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
    <section className="py-12 bg-white border-y border-slate-200/70 transition-all">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >

        {/* Title */}
        <div className="text-center mb-7">
          <p className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">
            Reparação especializada nas principais marcas do mercado
          </p>
        </div>

        {/* Scrolling Grid or flex row */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          {brands.map((brand) => {
            return (
              <motion.div
                key={brand.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="px-4.5 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center space-x-2.5 hover:border-blue-500/40 hover:shadow-md hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all duration-300 cursor-default"
              >
                {/* Visual Icon matching */}
                {brand.logoType === 'apple' ? (
                  <Apple className="w-4 h-4 text-slate-900" />
                ) : brand.logoType === 'hp' || brand.logoType === 'dell' || brand.logoType === 'lenovo' || brand.logoType === 'asus' ? (
                  <Laptop className="w-4 h-4 text-blue-600" />
                ) : (
                  <Smartphone className="w-4 h-4 text-sky-500" />
                )}

                <span className="text-sm font-bold font-display text-slate-850 text-slate-900">
                  {brand.name}
                </span>

                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/40" />
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
