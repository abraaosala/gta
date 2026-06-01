/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import Brands from './components/Brands.tsx';
import Services from './components/Services.tsx';
import Features from './components/Features.tsx';
import Process from './components/Process.tsx';
import InteractiveEstimator from './components/InteractiveEstimator.tsx';
import FAQ from './components/FAQ.tsx';
import Testimonials from './components/Testimonials.tsx';
import AboutContact from './components/AboutContact.tsx';
import SalesStore from './components/SalesStore.tsx';
import Footer from './components/Footer.tsx';

export default function App() {
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);

  const handleSelectService = (serviceId: string) => {
    setPreselectedServiceId(serviceId);
  };

  const handleClearPreselection = () => {
    setPreselectedServiceId(null);
  };

  return (
    <div className="min-h-screen relative flex flex-col font-sans overflow-x-hidden antialiased text-slate-800 bg-white transition-colors duration-300">

      <Helmet>
        <title>GTA-Tech · Reparação & Vendas em Cabinda</title>
        <meta name="description" content="Assistência técnica de smartphones e computadores em Cabinda. Reparação de ecrãs, baterias, placas-mãe e venda de equipamentos recondicionados com garantia." />
        <meta property="og:title" content="GTA-Tech · Reparação & Vendas em Cabinda" />
        <meta property="og:description" content="Reparação de ecrãs, baterias, placas-mãe e venda de equipamentos recondicionados em Cabinda." />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      {/* Main Assembly Blocks with fluid transitions */}
      <main className="flex-grow">
        
        {/* Hero Section with Startup Graphics */}
        <Hero />

        {/* Corporate Supported Brands Slider */}
        <Brands />

        {/* Action-linked Services Grid */}
        <Services onSelectService={handleSelectService} />

        {/* Catalog of Refurbished Premium Devices and Accessories */}
        <SalesStore />

        {/* Porquê nós / Core differential features */}
        <Features />

        {/* 4-step workflow process layout */}
        <Process />

        {/* Highly Interactive Online repair price estimator calculator */}
        <InteractiveEstimator
          preselectedServiceId={preselectedServiceId}
          clearPreselection={handleClearPreselection}
        />

        {/* Double Quote Testimonials list */}
        <Testimonials />

        {/* Interactive Accordion FAQs */}
        <FAQ />

        {/* Dual Column Quem Somos story and Outreach form */}
        <AboutContact />

      </main>

      {/* Clean informative copyright footer */}
      <Footer />

    </div>
  );
}
