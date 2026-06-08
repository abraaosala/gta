/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Smartphone, Laptop, Plug, BatteryCharging, Search, Sparkles, MessageCircle, Info, X } from 'lucide-react';
import { useData } from '../contexts/DataContext.tsx';
import { ProductItem } from '../types.ts';

const CategoryIconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  smartphones: Smartphone,
  laptops: Laptop,
  accessories: Plug,
};

export default function SalesStore() {
  const { products } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Filter products based on category and query searching name/specification lists
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.specs?.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleWhatsappReservation = (product: ProductItem) => {
    const message = encodeURIComponent(
      `Olá GTA-Tech! Tenho interesse em adquirir o produto: ${product.name} (${product.condition}) anunciado a ${product.price.toLocaleString('pt') || product.price} Kz. Está disponível para entrega?`
    );
    window.open(`https://wa.me/244923125487?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const closeModal = useCallback(() => setSelectedProduct(null), []);

  useEffect(() => {
    if (!selectedProduct) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selectedProduct, closeModal]);

  return (
    <section id="vendas" className="py-20 bg-slate-50 transition-all border-t border-slate-200/50 relative">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >

        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="text-left max-w-2xl">
            <span className="text-xs uppercase font-mono font-extrabold tracking-widest text-brand-blue bg-brand-blue/5 px-3.5 py-1.5 rounded-full">
              SISTEMA DE VENDAS & LOJA
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mt-4 tracking-tight text-slate-900 ">
              Equipamentos Recondicionados Premium & Acessórios
            </h2>
            <p className="mt-3 text-sm text-slate-500 ">
              Todos os nossos telemóveis e portáteis são testados em múltiplos pontos, higienizados e entregues com garantia certificada de funcionamento.
            </p>
          </div>
          <div className="mt-6 md:mt-0 relative w-full md:w-80">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar modelo, marca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-2xl py-3 pl-10 pr-4 text-sm font-medium bg-white/70 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all"
            />
          </div>
        </div>

        {/* Filter Badges Categories */}
        <div className="flex flex-wrap gap-2.5 mb-10 max-w-xl">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all uppercase cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-brand-blue text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Todos os Itens
          </button>
          <button
            onClick={() => setSelectedCategory('smartphones')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all uppercase flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'smartphones'
                ? 'bg-brand-blue text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Smartphones
          </button>
          <button
            onClick={() => setSelectedCategory('laptops')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all uppercase flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'laptops'
                ? 'bg-brand-blue text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            Portáteis
          </button>
          <button
            onClick={() => setSelectedCategory('accessories')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all uppercase flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'accessories'
                ? 'bg-brand-blue text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Plug className="w-3.5 h-3.5" />
            Acessórios
          </button>
        </div>

        {/* Products Display Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              const CategoryIcon = CategoryIconMap[product.category] || ShoppingBag;
              return (
                <motion.div
                  key={product.id}
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedProduct(product)}
                  className="group rounded-3xl bg-white border border-slate-200/60 hover:border-brand-blue/30 overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  <div>
                    {/* Media Image Holder with Badge Overlay */}
                    <div className="relative h-56 bg-slate-100 overflow-hidden flex items-center justify-center">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />

                      {/* Condition badge */}
                      <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/75 backdrop-blur-md text-white border border-white/10 ">
                        {product.condition}
                      </span>

                      {/* Stock availability badge */}
                      {product.inStock ? (
                        <span className="absolute top-4 right-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 backdrop-blur-md">
                          Em Stock
                        </span>
                      ) : (
                        <span className="absolute top-4 right-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 border border-red-500/20 backdrop-blur-md">
                          Esgotado
                        </span>
                      )}
                    </div>

                    {/* Inner content */}
                    <div className="p-6 text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <CategoryIcon className="w-4 h-4 text-brand-blue " />
                        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
                          {product.category === 'smartphones' ? 'Telemóveis' : product.category === 'laptops' ? 'Computadores' : 'Acessórios'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold font-display text-slate-900 leading-tight mb-2 group-hover:text-brand-blue transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-slate-500 text-xs leading-relaxed mb-4">
                        {product.description}
                      </p>

                      {/* Diagnostic specs points */}
                      {product.specs && product.specs.length > 0 && (
                        <div className="space-y-1.5 border-t border-slate-100 pt-3.5 pb-2">
                          {product.specs.map((spec, specIdx) => (
                            <div key={specIdx} className="flex items-center text-[11px] text-slate-600 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mr-2 shrink-0" />
                              <span>{spec}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card bottom bar pricing & CTA */}
                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-left mt-auto">
                    <div>
                      {product.originalPrice && (
                        <span className="block text-xs line-through text-slate-400 leading-none mb-1">
                          {product.originalPrice.toLocaleString('pt')} Kz
                        </span>
                      )}
                      <span className="text-base sm:text-lg font-extrabold font-display text-brand-blue leading-none">
                        {product.price.toLocaleString('pt')} <span className="text-[10px] font-sans font-bold">Kz</span>
                      </span>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleWhatsappReservation(product); }}
                      disabled={!product.inStock}
                      className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all uppercase cursor-pointer active:scale-95 ${
                        product.inStock
                          ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/10'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      Reservar
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredProducts.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <span className="inline-flex p-4 rounded-full bg-slate-100 border border-slate-200 text-slate-400 mb-4">
                <Info className="w-8 h-8" />
              </span>
              <p className="text-base font-semibold text-slate-800 ">Nenhum produto encontrado</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-normal">
                Não conseguimos encontrar resultados correspondentes aos seus filtros de pesquisa. Experimente usar termos mais amplos ou mudar a categoria.
              </p>
            </div>
          )}
        </motion.div>

        {/* Small trust factors */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-slate-100 pt-10 text-left">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Qualidade Homologada</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">Componentes minuciosamente inspecionados para funcionamento a 100%.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-xl">
              <BatteryCharging className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Garantia Integrada</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">90 dias de garantia oficial dada pela GTA-Tech em Cabinda em todas as vendas.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Suporte Completo</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">Caso necessite de migrar os dados do seu telemóvel antigo, fazemos gratuitamente!</p>
            </div>
          </div>
        </div>

      </motion.div>

      {/* Product detail modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              key="modal-card"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                aria-label="Fechar detalhes"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image */}
              <div className="relative h-64 bg-slate-100 overflow-hidden">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/75 backdrop-blur-md text-white border border-white/10">
                  {selectedProduct.condition}
                </span>
                {selectedProduct.inStock ? (
                  <span className="absolute top-4 right-16 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 backdrop-blur-md">
                    Em Stock
                  </span>
                ) : (
                  <span className="absolute top-4 right-16 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 border border-red-500/20 backdrop-blur-md">
                    Esgotado
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6 text-left space-y-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
                    {selectedProduct.category === 'smartphones' ? 'Telemóveis' : selectedProduct.category === 'laptops' ? 'Computadores' : 'Acessórios'}
                  </span>
                  <h3 className="text-xl font-bold font-display text-slate-900 mt-1">
                    {selectedProduct.name}
                  </h3>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Especificações</h4>
                    <ul className="space-y-1.5">
                      {selectedProduct.specs.map((spec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 shrink-0" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Price + CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    {selectedProduct.originalPrice && (
                      <span className="block text-xs line-through text-slate-400 leading-none mb-1">
                        {selectedProduct.originalPrice.toLocaleString('pt')} Kz
                      </span>
                    )}
                    <span className="text-2xl font-extrabold font-display text-brand-blue leading-none">
                      {selectedProduct.price.toLocaleString('pt')} <span className="text-xs font-sans font-bold">Kz</span>
                    </span>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleWhatsappReservation(selectedProduct); }}
                    disabled={!selectedProduct.inStock}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all uppercase cursor-pointer active:scale-95 ${
                      selectedProduct.inStock
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/10'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Reservar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
