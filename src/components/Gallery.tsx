/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../contexts/DataContext.tsx';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const categoryLabels: Record<string, string> = {
  'antes-depois': 'Antes & Depois',
  laboratorio: 'Laboratório',
  equipa: 'Equipa',
  oficina: 'Oficina',
};

const allCategories = 'todas';

export default function Gallery() {
  const { gallery } = useData();
  const [activeCategory, setActiveCategory] = useState(allCategories);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [allCategories, ...new Set(gallery.map((g) => g.category))];

  const filtered = activeCategory === allCategories
    ? gallery
    : gallery.filter((g) => g.category === activeCategory);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filtered.length);
    }
  };

  const goPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
    }
  };

  return (
    <section id="galeria" className="py-20 bg-slate-100/30 tech-grid-bg transition-all">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-mono font-extrabold tracking-widest text-brand-blue bg-brand-blue/5 px-3.5 py-1.5 rounded-full">
            GALERIA
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mt-4 tracking-tight text-slate-900">
            O nosso laboratório e resultados
          </h2>
          <p className="text-slate-500 mt-4 text-md">
            Veja o antes e depois das reparações, o nosso espaço de trabalho e a equipa em acção.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat === allCategories ? 'Todas' : categoryLabels[cat] || cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => openLightbox(idx)}
                className="glass-card rounded-2xl overflow-hidden cursor-pointer group hover:shadow-xl transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-mono font-bold text-brand-blue uppercase tracking-wider">
                    {categoryLabels[item.category] || item.category}
                  </span>
                  <h3 className="text-sm font-bold font-display text-slate-900 mt-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={closeLightbox}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-all cursor-pointer z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {filtered.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    className="absolute left-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-all cursor-pointer z-10"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    className="absolute right-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-all cursor-pointer z-10"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}

              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-4xl w-full max-h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={filtered[lightboxIndex].imageUrl}
                  alt={filtered[lightboxIndex].title}
                  className="w-full max-h-[70vh] object-contain rounded-2xl"
                />
                <div className="text-white text-center mt-4">
                  <h3 className="text-lg font-bold font-display">
                    {filtered[lightboxIndex].title}
                  </h3>
                  {filtered[lightboxIndex].description && (
                    <p className="text-sm text-white/70 mt-1">
                      {filtered[lightboxIndex].description}
                    </p>
                  )}
                  <span className="inline-block text-xs font-mono text-brand-blue mt-2">
                    {categoryLabels[filtered[lightboxIndex].category] || filtered[lightboxIndex].category}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
