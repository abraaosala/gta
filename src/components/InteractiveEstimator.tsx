/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ESTIMATOR_DEVICES, BUSINESS_INFO } from '../data.ts';
import { Calculator, MessageCircle, CalendarCheck, HelpCircle, Check, Sparkles, Smartphone, Laptop, Tablet, AlertCircle } from 'lucide-react';

interface InteractiveEstimatorProps {
  preselectedServiceId: string | null;
  clearPreselection: () => void;
}

export default function InteractiveEstimator({ preselectedServiceId, clearPreselection }: InteractiveEstimatorProps) {
  // Config state
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedIssueIndex, setSelectedIssueIndex] = useState(0);
  const [modelInput, setModelInput] = useState('');
  const [detailsInput, setDetailsInput] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Booking states
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Map service ID to pre-selections if clicked from the services grid
  useEffect(() => {
    if (!preselectedServiceId) return;

    // Scroll to section smoothly
    const element = document.getElementById('estimador');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (preselectedServiceId === 'ecras') {
      setSelectedDeviceIndex(0); // Smartphone
      setSelectedBrand('Apple (iPhone)');
      setSelectedIssueIndex(0); // Screen
    } else if (preselectedServiceId === 'baterias') {
      setSelectedDeviceIndex(0); // Smartphone
      setSelectedBrand('Apple (iPhone)');
      setSelectedIssueIndex(1); // Battery
    } else if (preselectedServiceId === 'placas') {
      setSelectedDeviceIndex(0); // Smartphone
      setSelectedBrand('Apple (iPhone)');
      setSelectedIssueIndex(4); // Motherboard
    } else if (preselectedServiceId === 'conetores') {
      setSelectedDeviceIndex(0); // Smartphone
      setSelectedBrand('Apple (iPhone)');
      setSelectedIssueIndex(2); // Charging port
    } else if (preselectedServiceId === 'computadores') {
      setSelectedDeviceIndex(1); // Laptop
      setSelectedBrand('HP');
      setSelectedIssueIndex(0); // Formatting / clean
    } else if (preselectedServiceId === 'software') {
      setSelectedDeviceIndex(0); // Smartphone
      setSelectedBrand('Apple (iPhone)');
      setSelectedIssueIndex(3); // Software / boot loops
    }

    // Clean up
    clearPreselection();
  }, [preselectedServiceId]);

  const currentDevice = ESTIMATOR_DEVICES[selectedDeviceIndex] || ESTIMATOR_DEVICES[0];

  // Set default brand if selected device changed
  useEffect(() => {
    if (currentDevice && currentDevice.brands && currentDevice.brands.length > 0) {
      setSelectedBrand(currentDevice.brands[0]);
    }
    setSelectedIssueIndex(0);
  }, [selectedDeviceIndex]);

  const currentIssue = currentDevice.issues[selectedIssueIndex] || currentDevice.issues[0];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 0 }).format(val).replace('AOA', 'Kz');
  };

  // Pre-formatted messages for WhatsApp connection
  const handleWhatsAppSend = () => {
    const brandName = selectedBrand || 'Geral';
    const modelText = modelInput.trim() ? `(Modelo: ${modelInput})` : '';
    const detailsText = detailsInput.trim() ? `\n- Detalhes adicionais: ${detailsInput}` : '';

    const message = `Olá GTA-Tech! Gostaria de solicitar um orçamento para o meu dispositivo:
- Aparelho: ${currentDevice.label}
- Marca: ${brandName} ${modelText}
- Sintoma/Avaria: ${currentIssue.label}
- Estimativa Inicial: ${formatCurrency(currentIssue.basePrice)}
- Tempo Estimado: ${currentIssue.estimatedTime}${detailsText}

Podem confirmar a disponibilidade de atendimento hoje no laboratório de Cabinda?`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodedMessage}`;
    window.open(whatsappLink, '_blank', 'noreferrer policy=no-referrer');
  };

  // Simulate local booking submission
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowBookingForm(false);
      setClientName('');
      setClientPhone('');
      setBookingDate('');
    }, 4000);
  };

  return (
    <section id="estimador" className="py-20 bg-slate-50 transition-all overflow-hidden relative">
      {/* Visual glowing points */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-cyan/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
      >
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-mono font-extrabold tracking-widest text-brand-blue bg-brand-blue/5 px-3.5 py-1.5 rounded-full">
            ESTIMATIVAS COERENTES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mt-4 tracking-tight text-slate-900 ">
            Calculador de Orçamentos de Reparação
          </h2>
          <p className="text-slate-500 mt-4 text-md">
            Escolha as especificidades do seu aparelho abaixo e obtenha um diagnóstico inicial imediato de tempo e valores médios.
          </p>
        </div>

        {/* Dynamic content grid setup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Side - 7 Columns */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl text-left border border-slate-200/50 bg-white ">

              <h3 className="text-xl font-bold font-display text-slate-900 mb-6 flex items-center">
                <Calculator className="w-5 h-5 text-brand-cyan mr-2" />
                1. Selecione o Dispositivo
              </h3>

              {/* Step 1: Device Tabs */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {ESTIMATOR_DEVICES.map((device, idx) => {
                  const isActive = selectedDeviceIndex === idx;
                  const icons = [
                    <Smartphone className="w-4 h-4 mr-2" key="ph" />,
                    <Laptop className="w-4 h-4 mr-2" key="lp" />,
                    <Tablet className="w-4 h-4 mr-2" key="tb" />,
                  ];
                  return (
                    <button
                      key={device.id}
                      onClick={() => setSelectedDeviceIndex(idx)}
                      className={`flex items-center justify-center p-3.5 rounded-2xl text-xs font-bold leading-none cursor-pointer border transition-all ${
                        isActive
                          ? 'bg-slate-900 text-white border-slate-900 '
                          : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100 '
                      }`}
                    >
                      {icons[idx] || <Smartphone className="w-4 h-4 mr-2" />}
                      {device.label.split(' / ')[0]}
                    </button>
                  );
                })}
              </div>

              {/* Step 2: Brand and Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold font-mono text-slate-400 uppercase mb-2">
                    Marca do Aparelho
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/60 pointer-events-auto px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-800 "
                  >
                    {currentDevice.brands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold font-mono text-slate-400 uppercase mb-2">
                    Modelo Específico (Opcional)
                  </label>
                  <input
                    type="text"
                    value={modelInput}
                    onChange={(e) => setModelInput(e.target.value)}
                    placeholder="Ex: iPhone 13, HP Pavilion 15"
                    className="w-full bg-slate-50 border border-slate-200/60 px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-800 "
                  />
                </div>
              </div>

              {/* Step 3: Issue Selection */}
              <div className="mb-6">
                <label className="block text-xs font-bold font-mono text-slate-400 uppercase mb-3">
                  Sintoma ou Avaria Identificada
                </label>
                <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
                  {currentDevice.issues.map((issue, idx) => {
                    const isSelected = selectedIssueIndex === idx;
                    return (
                      <div
                        key={issue.id}
                        onClick={() => setSelectedIssueIndex(idx)}
                        className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-brand-blue/5 border-brand-blue text-slate-950 font-semibold'
                            : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50 '
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                              isSelected
                                ? 'border-brand-blue bg-brand-blue '
                                : 'border-slate-300 '
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span className="text-xs sm:text-sm text-slate-700 ">
                            {issue.label}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-400 font-mono">
                          A partir de
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Text details */}
              <div>
                <label className="block text-xs font-bold font-mono text-slate-400 uppercase mb-2">
                  Descreva brevemente o problema (Opcional)
                </label>
                <textarea
                  value={detailsInput}
                  onChange={(e) => setDetailsInput(e.target.value)}
                  placeholder="Ex: Deixei cair no chão e o ecrã ficou às riscas. O telemóvel vibra mas não mostra imagem..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200/60 px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-800 resize-none"
                />
              </div>

            </div>
          </div>

          {/* Pricing Summary Side - 5 Columns */}
          <div className="lg:col-span-5 relative">
            <div className="glass-card-darker p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl text-left bg-white relative">

              <div className="absolute top-4 right-4 animate-float-medium">
                <Sparkles className="w-5 h-5 text-brand-cyan/60" id="sparkle-calc" />
              </div>

              <span className="text-[10px] font-mono bg-brand-blue/5 text-brand-blue px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                Orçamento de Reparação Inicial
              </span>

              {/* Computed Values layout */}
              <div className="my-6 pb-6 border-b border-slate-100 ">
                <label className="block text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider mb-1">
                  Valor Estimado do Serviço
                </label>
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-slate-950 leading-none">
                  {formatCurrency(currentIssue.basePrice)}
                </div>
                <p className="text-[10px] text-slate-400 font-sans mt-2">
                  * Inclui peças originais ou alta gama + mão de obra especializada.
                </p>
              </div>

              {/* Technical Specifications metadata card */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 ">Tempo de Execução:</span>
                  <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                    ~ {currentIssue.estimatedTime}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 ">Diagnóstico Laboratorial:</span>
                  <span className="font-bold text-emerald-500 font-mono">Gratuito (0 Kz)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 ">Uso de Peças Homologadas:</span>
                  <span className="font-bold text-slate-800 ">Sim, com Garantia</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1.5 border-t border-slate-100 ">
                  <span className="text-slate-400 ">Cobertura de Garantia:</span>
                  <span className="font-bold text-brand-blue ">90 Dias Certificados</span>
                </div>
              </div>

              {/* Direct Link triggers */}
              {!showBookingForm ? (
                <div className="flex flex-col gap-3">
                  {/* Primary Call: Send to WhatsApp */}
                  <button
                    onClick={handleWhatsAppSend}
                    className="w-full flex items-center justify-center py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-700/10 cursor-pointer text-sm leading-none"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Enviar Orçamento para o WhatsApp
                  </button>

                  {/* Secondary Call: Book inside App (Local simulation) */}
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="w-full flex items-center justify-center py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer text-xs"
                  >
                    <CalendarCheck className="w-4 h-4 mr-2" />
                    Agendar Visita ao Laboratório
                  </button>
                </div>
              ) : (
                /* Simulated booking drawer inline */
                <AnimatePresence>
                  <motion.form
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleBookingSubmit}
                    className="space-y-4 border-t border-slate-100 pt-5 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 ">
                        Agendar Horário em Cabinda
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowBookingForm(false)}
                        className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">
                        O seu nome completo
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ex: João Baptista"
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-lg text-xs text-slate-800 "
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">
                          Telefone / Telemóvel
                        </label>
                        <input
                          type="tel"
                          required
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="9XXXXXXXX"
                          className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-lg text-xs text-slate-800 "
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">
                          Data Pretendida
                        </label>
                        <input
                          type="date"
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-lg text-xs text-slate-800 text-slate-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
                    >
                      Confirmar Agendamento Local
                    </button>

                    {bookingSuccess && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 rounded-lg text-xs flex items-center mt-2"
                      >
                        <Check className="w-4 h-4 mr-1.5 shrink-0" />
                        <div>
                          <strong>Agendamento pré-instalado!</strong> Em breve os técnicos da GTA-Tech entrarão em contacto consigo no telemóvel indicado.
                        </div>
                      </motion.div>
                    )}
                  </motion.form>
                </AnimatePresence>
              )}

              {/* Disclaimer */}
              <div className="mt-5 flex items-start text-[10px] text-slate-400 leading-snug">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0 mt-0.5" />
                <span>
                  As estimativas de preços são exemplificativas e baseadas em avarias padrão. No laboratório em Cabinda confirmaremos o preço após diagnóstico minucioso gratuito.
                </span>
              </div>

            </div>
          </div>
        </div>

      </motion.div>
    </section>
  );
}
