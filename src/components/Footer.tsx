/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useData } from '../contexts/DataContext.tsx';
import { Smartphone, Shield, HelpCircle, Phone, Clock, Wrench, Instagram, Facebook, Music2 } from 'lucide-react';

export default function Footer() {
  const { businessInfo, settings } = useData();
  const [logoError, setLogoError] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setLogoError(false);
  }, [businessInfo.logoUrl]);

  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-900 transition-all font-sans">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-900 text-left">
          {/* Col 1: About Tech (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-2">
              {businessInfo.logoUrl && !logoError ? (
                <img key={businessInfo.logoUrl} src={`${businessInfo.logoUrl}?t=${Date.now()}`} alt={businessInfo.name} onError={() => setLogoError(true)} className="w-8 h-8 rounded-lg object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-blue to-cyan-400 flex items-center justify-center text-white">
                  <Wrench className="w-4 h-4" />
                </div>
              )}
              <span className="text-lg font-bold font-display tracking-tight text-white">
                {businessInfo.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Líder local em assistência técnica profissional. Efetuamos diagnósticos gratuitos de smartphones, portáteis e tablets na hora em Cabinda, Angola.
            </p>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Bancadas ESD · Microeletrónica Certificada
            </div>
          </div>

          {/* Col 2: Services Linkings (Col 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold font-mono tracking-widest text-white uppercase">
              Serviços Populares
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#servicos" className="hover:text-brand-cyan transition-colors">Substituição de Ecrãs</a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-brand-cyan transition-colors">Telas e Displays Partidos</a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-brand-cyan transition-colors">Substituição de Baterias</a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-brand-cyan transition-colors">Reparação de Placas lógicas</a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-brand-cyan transition-colors">Upgrades de Computadores e SSD</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Company Sitemap Links (Col 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold font-mono tracking-widest text-white uppercase">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#inicio" className="hover:text-brand-cyan transition-colors">Início</a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-brand-cyan transition-colors">Serviços</a>
              </li>
              <li>
                <a href="#features" className="hover:text-brand-cyan transition-colors">Vantagens</a>
              </li>
              <li>
                <a href="#processo" className="hover:text-brand-cyan transition-colors">Processo</a>
              </li>
              <li>
                <a href="#estimador" className="hover:text-brand-cyan transition-colors">Calculador Online</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Rapid Contact Details (Col 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold font-mono tracking-widest text-white uppercase">
              Laboratório
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-brand-cyan" />
                <span>{businessInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                <span className="leading-tight">{businessInfo.hours}</span>
              </div>
              <div className="text-[10px] text-slate-500 leading-snug">
                {businessInfo.city}
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        {(settings.instagram_url || settings.facebook_url || settings.tiktok_url) && (
          <div className="flex justify-center gap-4 pt-6">
            {settings.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-pink-400 transition-colors" title="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {settings.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400 transition-colors" title="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {settings.tiktok_url && (
              <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors" title="TikTok">
                <Music2 className="w-5 h-5" />
              </a>
            )}
          </div>
        )}

        {/* Bottom Rights Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-left text-[11px] text-slate-500 font-mono gap-4">
          <div className="space-y-1">
            <div>
              &copy; {currentYear} GTA-Tech. Todos os direitos reservados.
            </div>
            <div>
              Rua do Comércio, Cabinda - Angola.
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Shield className="w-3.5 h-3.5 mr-1 text-emerald-500" />
              Privacidade Garantida
            </span>
            <span className="flex items-center">
              <HelpCircle className="w-3.5 h-3.5 mr-1 text-brand-cyan" />
              Termos de Reparação
            </span>
          </div>
        </div>

      </motion.div>
    </footer>
  );
}
