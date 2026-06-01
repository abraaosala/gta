/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BUSINESS_INFO } from '../data.ts';
import { MapPin, Phone, Mail, Clock, ShieldCheck, MailCheck, Send, Check, AlertCircle } from 'lucide-react';

export default function AboutContact() {
  // Contact Form states
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [deviceInput, setDeviceInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput || !phoneInput) return;

    // Simulate sending, show success banner
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setNameInput('');
      setPhoneInput('');
      setDeviceInput('');
      setMessageInput('');
    }, 5000);
  };

  return (
    <section id="contacto" className="py-20 bg-white transition-all border-t border-slate-150/40 relative">
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
            <div>
              <span className="text-xs uppercase font-mono font-extrabold tracking-widest text-brand-blue bg-brand-blue/5 px-3.5 py-1.5 rounded-full">
                QUEM SOMOS & CONTACTO
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mt-4 tracking-tight text-slate-900 ">
                Os seus aparelhos em mãos de confiança
              </h2>
              <p className="mt-4 text-slate-500 text-sm leading-relaxed">
                A GTA-Tech nasceu em Cabinda com a missão de elevar a fasquia da assistência técnica em Angola. Focamo-nos na excelência técnica, na transparência de orçamentos e em assegurar que cada cliente sai com o telemóvel ou portátil perfeitamente operacional.
              </p>
            </div>

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
            <div className="glass-card-darker p-6 rounded-2.5xl border border-slate-200/50 bg-slate-50 space-y-4">
              <div className="flex items-center space-x-3.5 text-sm">
                <MapPin className="w-5 h-5 text-brand-blue shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-mono uppercase">Localização</span>
                  <span className="font-semibold text-slate-800 leading-tight">
                    {BUSINESS_INFO.address}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 text-sm">
                <Phone className="w-5 h-5 text-brand-blue shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-mono uppercase">Ligar Direto</span>
                  <a href={`tel:${BUSINESS_INFO.phone}`} className="font-bold hover:underline text-slate-850 ">
                    {BUSINESS_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 text-sm">
                <Mail className="w-5 h-5 text-brand-blue shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-mono uppercase">Correio Eletrónico</span>
                  <span className="font-semibold text-slate-800 ">{BUSINESS_INFO.email}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 text-sm">
                <Clock className="w-5 h-5 text-brand-blue shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-mono uppercase">Horário de Funcionamento</span>
                  <span className="font-semibold text-slate-800 ">{BUSINESS_INFO.hours}</span>
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
            <div className="glass-card p-6 sm:p-10 rounded-3xl border border-slate-200/50 text-left bg-slate-50 relative">
              <h3 className="text-xl font-bold font-display text-slate-950 mb-2">
                Envie-nos uma mensagem direta
              </h3>
              <p className="text-sm text-slate-400 mb-8 font-sans">
                Se tem uma dúvida específica ou pretende agendar uma intervenção urgente, introduza os dados abaixo. Nós responderemos no próprio dia.
              </p>

              {/* Success Alert */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-start"
                >
                  <Check className="w-5 h-5 mr-2.5 shrink-0 mt-0.5" />
                  <div>
                    <strong>Mensagem enviada com sucesso!</strong> Obrigado pelo seu contacto. Um dos nossos engenheiros térmicos e de microeletrónica irá contatar o seu telemóvel nas próximas horas.
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Ex: Manuel Baptista"
                      className="w-full bg-white border border-slate-200/60 px-4 py-3 rounded-xl text-xs focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-800 "
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">
                      Número de Telemóvel
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="Ex: 923 XXXXXX"
                      className="w-full bg-white border border-slate-200/60 px-4 py-3 rounded-xl text-xs focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-800 "
                    />
                </div>
              </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">
                    Seu Aparelho & Modelo
                  </label>
                  <input
                    type="text"
                    value={deviceInput}
                    onChange={(e) => setDeviceInput(e.target.value)}
                    placeholder="Ex: MacBook Air M1, iPhone 12 Pro"
                    className="w-full bg-white border border-slate-200/60 px-4 py-3 rounded-xl text-xs focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-800 "
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">
                    O que acontece com o seu aparelho? (Mensagem)
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Indique os sintomas, ecrã partido, bateria sem durabilidade, se molhou, etc..."
                    className="w-full bg-white border border-slate-200/60 px-4 py-3 rounded-xl text-xs focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-800 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center py-4 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Mensagem Urgente
                </button>
              </form>

              {/* Custom Map schematic design - High Fidelity */}
              <div className="mt-8 pt-6 border-t border-slate-200/60 text-left">
                <span className="block text-[10px] text-slate-400 font-mono uppercase mb-2">Visualização do Mapa Local (Cabinda)</span>

                {/* Visual Blueprint card */}
                <div className="h-32 rounded-xl bg-slate-950 border border-slate-850 relative overflow-hidden flex items-center justify-center text-center">
                  {/* Glowing schematics grid lines */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-30" />

                  {/* Styled central beacon */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-brand-blue/20 flex items-center justify-center border border-brand-cyan/60 animate-bounce">
                      <MapPin className="w-4 h-4 text-brand-cyan" />
                    </div>
                    <span className="text-[11px] font-bold font-display text-white mt-1">GTA-TECH LABORATÓRIO</span>
                    <span className="text-[9px] font-mono text-cyan-400">RUA DO COMÉRCIO · CABINDA Centro</span>
                  </div>

                  {/* Fake map streets lines */}
                  <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-slate-800/40" />
                  <div className="absolute top-0 bottom-0 left-1/3 w-[1.5px] bg-slate-800/40" />
                  <div className="absolute top-0 bottom-0 left-2/3 w-[1.5px] bg-slate-800/40 shrink-0" />
                </div>
              </div>

            </div>
          </motion.div>

        </div>

      </motion.div>
    </section>
  );
}
