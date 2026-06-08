/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from '@tanstack/react-router';
import { Menu, X, Wrench } from 'lucide-react';
import { useData } from '../contexts/DataContext.tsx';

export default function Header() {
  const navigate = useNavigate();
  const { businessInfo } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#inicio' },
    { name: 'Serviços', href: '#servicos' },
    { name: 'Vendas', href: '#vendas' },
    { name: 'Porquê Nós', href: '#features' },
    { name: 'Processo', href: '#processo' },
    { name: 'Orçamento Rápido', href: '#estimador' },
    { name: 'Contacto', href: '#contacto' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-header py-3.5 shadow-lg shadow-black/80'
          : 'bg-transparent py-6 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            id="logo-link"
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            onDoubleClick={() => navigate({to: '/login'})}
            className="flex items-center space-x-3 group focus:outline-none cursor-pointer"
          >
            {businessInfo.logoUrl ? (
              <img
                key={businessInfo.logoUrl}
                src={`${businessInfo.logoUrl}?t=${Date.now()}`}
                alt={businessInfo.name}
                className="w-10 h-10 rounded-lg object-cover shadow-md transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-md shadow-blue-500/15 transition-transform group-hover:scale-105">
                <Wrench className="w-5 h-5" id="logo-icon" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight uppercase text-slate-900 font-display">
                {businessInfo.name}
              </span>
              <span className="text-[9px] font-mono tracking-[0.15em] text-slate-500 uppercase font-bold">
                Cabinda · Angola
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-3">

            <a
              id="desktop-cta"
              href="#contacto"
              className="hidden lg:inline-flex items-center justify-center px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-md active:scale-95"
            >
              Falar Connosco
            </a>

            {/* Mobile Menu Icon */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 rounded-xl border border-slate-200 bg-white/50 text-slate-600 cursor-pointer focus:outline-none"
              aria-label="Open context menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation with Motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-card-darker border-t border-slate-200 py-4 px-4 bg-white mt-3 shadow-lg absolute left-0 right-0 mx-4 rounded-2xl"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={handleLinkClick}
                  className="px-4 py-3 rounded-xl text-md font-medium text-slate-600 hover:text-brand-blue hover:bg-slate-100/50 transition-all flex items-center"
                >
                  <span className="w-2 h-2 rounded-full bg-brand-cyan/60 mr-3"></span>
                  {link.name}
                </a>
              ))}
              <div className="pt-2 border-t border-slate-100 ">
                <a
                  id="mobile-cta"
                  href="#estimador"
                  onClick={handleLinkClick}
                  className="w-full flex items-center justify-center py-3.5 text-center font-bold text-white bg-brand-blue rounded-xl tracking-tight shadow-md"
                >
                  Diagnóstico Grátis em Cabinda
                </a>
                <div className="mt-3 text-center text-xs text-slate-400 font-mono">
                  Tel: {businessInfo.phone}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
