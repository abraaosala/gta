/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../contexts/DataContext.tsx';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Send, Navigation, ExternalLink } from 'lucide-react';
import { submitContact } from '../lib/api.ts';
import { useToast } from '../lib/toast.tsx';
import SectionHeader from './SectionHeader.tsx';

const DEFAULT_MAPS_URL =
  'https://www.google.com/maps/place/EBJ+Auto+Escola/@-5.5562647,12.2358382,17.75z/data=!4m10!1m2!2m1!1sebj+cabinda!3m6!1s0x1a5dd26112001e1f:0x239dfac39b29f53c!8m2!3d-5.5562647!4d12.2358382!15sCgtlYmogY2FiaW5kYZIBH2RyaXZlcnNfbGljZW5zZV90cmFpbmluZ19zY2hvb2zgAQA!16s%2Fg%2F11h9qdzpd4?entry=ttu';

export default function AboutContact() {
  const toast = useToast();
  const { businessInfo, settings } = useData();
  const googleMapsUrl = settings.google_maps_url || DEFAULT_MAPS_URL;
  // Contact Form states
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [deviceInput, setDeviceInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput || !phoneInput) return;
    setSubmitting(true);

    try {
      await submitContact({
        name: nameInput,
        email: '',
        phone: phoneInput,
        message: `${deviceInput ? 'Dispositivo: ' + deviceInput + '\n' : ''}${messageInput}`,
      });
      toast.success('Mensagem enviada com sucesso! Entraremos em contacto consigo em breve.');
      setNameInput('');
      setPhoneInput('');
      setDeviceInput('');
      setMessageInput('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar mensagem');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-20 bg-slate-50 transition-all relative">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column: About Us & Contacts Details (Col 5) */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-5 flex flex-col space-y-8 text-left"
          >
            <SectionHeader
              align="left"
              badge="QUEM SOMOS & CONTACTO"
              title="Os seus aparelhos em mãos de confiança"
              description="A GTA-Tech nasceu em Cabinda com a missão de elevar a fasquia da assistência técnica em Angola. Focamo-nos na excelência técnica, na transparência de orçamentos e em assegurar que cada cliente sai com o telemóvel ou portátil perfeitamente operacional."
            />

            {/* Bullet achievements lists */}
            <div className="space-y-3.5">
              <div className="flex items-start text-sm">
                <div className="p-1 rounded bg-brand-blue/5 text-brand-blue mr-3 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-950 leading-tight">Garantia Certificada</h4>
                  <p className="text-xs text-slate-400 mt-1">Todos os componentes novos aplicados gozam de 90 dias de cobertura integral por escrito.</p>
                </div>
              </div>
              <div className="flex items-start text-sm">
                <div className="p-1 rounded bg-brand-blue/5 text-brand-blue mr-3 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-950 leading-tight">Transparência de Processo</h4>
                  <p className="text-xs text-slate-400 mt-1">O seu dispositivo é avaliado à sua frente sempre que possível, sem taxas de abertura ocultas.</p>
                </div>
              </div>
            </div>

            {/* Core Contact info cards details */}
            <div className="glass-card-darker p-6 rounded-3xl border border-slate-200/80 bg-white shadow-xs space-y-4">
              <div className="flex items-center space-x-3.5 text-sm">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-500 font-mono uppercase">Localização</span>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-slate-800 hover:text-blue-600 hover:underline leading-tight inline-flex items-center gap-1.5 transition-colors"
                  >
                    {businessInfo.address || 'Por baixo do Prédio EBJ, Cabinda - Angola'}
                    <ExternalLink className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 text-sm">
                <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-500 font-mono uppercase">Ligar Direto</span>
                  <a href={`tel:${businessInfo.phone}`} className="font-bold hover:underline text-slate-900 hover:text-blue-600 transition-colors">
                    {businessInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 text-sm">
                <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-500 font-mono uppercase">Correio Eletrónico</span>
                  <span className="font-semibold text-slate-800">{businessInfo.email}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 text-sm">
                <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-500 font-mono uppercase">Horário de Funcionamento</span>
                  <span className="font-semibold text-slate-800">{businessInfo.hours || 'Seg - Sáb: 08h00 - 16h30'}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact/Inquiry Interactive Form (Col 7) */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-7"
          >
            <div className="glass-card p-6 sm:p-10 rounded-3xl border border-slate-200/80 text-left bg-white shadow-sm relative">
              <h3 className="text-xl font-bold font-display text-slate-900 mb-2">
                Envie-nos uma mensagem direta
              </h3>
              <p className="text-sm text-slate-500 mb-8 font-sans">
                Se tem uma dúvida específica ou pretende agendar uma intervenção urgente, introduza os dados abaixo. Nós responderemos no próprio dia.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 font-mono uppercase mb-1.5">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Ex: Manuel Baptista"
                      className="w-full bg-slate-50/70 border border-slate-200/80 px-4 py-3 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white focus:outline-none text-slate-800 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 font-mono uppercase mb-1.5">
                      Número de Telemóvel
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="Ex: 923 XXXXXX"
                      className="w-full bg-slate-50/70 border border-slate-200/80 px-4 py-3 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white focus:outline-none text-slate-800 transition-all"
                    />
                </div>
              </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 font-mono uppercase mb-1.5">
                    Seu Aparelho & Modelo
                  </label>
                  <input
                    type="text"
                    value={deviceInput}
                    onChange={(e) => setDeviceInput(e.target.value)}
                    placeholder="Ex: MacBook Air M1, iPhone 12 Pro"
                    className="w-full bg-slate-50/70 border border-slate-200/80 px-4 py-3 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white focus:outline-none text-slate-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 font-mono uppercase mb-1.5">
                    O que acontece com o seu aparelho? (Mensagem)
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Indique os sintomas, ecrã partido, bateria sem durabilidade, se molhou, etc..."
                    className="w-full bg-slate-50/70 border border-slate-200/80 px-4 py-3 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white focus:outline-none text-slate-800 resize-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center py-4 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submitting ? 'A enviar...' : 'Enviar Mensagem Urgente'}
                </button>
              </form>

              {/* Google Maps Real Location & Interactive Embed */}
              <div className="mt-8 pt-6 border-t border-slate-200/80 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="block text-[10px] text-slate-500 font-mono uppercase font-bold">Localização no Mapa (Cabinda)</span>
                    <span className="text-xs text-slate-800 font-semibold">Por baixo do Prédio EBJ · Cabinda</span>
                  </div>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors self-start sm:self-auto shadow-2xs"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Como Chegar (Google Maps)
                  </a>
                </div>

                {/* Real Google Maps embed */}
                <div className="h-56 sm:h-64 rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs relative bg-slate-100">
                  <iframe
                    title="Localização GTA-Tech em Cabinda (Prédio EBJ)"
                    src="https://maps.google.com/maps?q=-5.5562647,12.2358382&hl=pt&z=17&output=embed"
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

            </div>
          </motion.div>

        </div>

      </motion.div>
    </section>
  );
}
