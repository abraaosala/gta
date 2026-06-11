/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Wrench } from 'lucide-react';
import { useData } from './contexts/DataContext.tsx';
import Topbar from './components/Topbar.tsx';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import Brands from './components/Brands.tsx';
import Services from './components/Services.tsx';
import Features from './components/Features.tsx';
import Process from './components/Process.tsx';
import InteractiveEstimator from './components/InteractiveEstimator.tsx';
import FAQ from './components/FAQ.tsx';
import Team from './components/Team.tsx';
import Gallery from './components/Gallery.tsx';
import Testimonials from './components/Testimonials.tsx';
import AboutContact from './components/AboutContact.tsx';
import SalesStore from './components/SalesStore.tsx';
import Footer from './components/Footer.tsx';

export default function App() {
  const { businessInfo, loading, sectionVisibility } = useData();
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);

  const handleSelectService = (serviceId: string) => {
    setPreselectedServiceId(serviceId);
  };

  const handleClearPreselection = () => {
    setPreselectedServiceId(null);
  };

  const faviconUrl = businessInfo.faviconUrl || businessInfo.logoUrl || '';

  useEffect(() => {
    if (!faviconUrl) return;
    const href = `${faviconUrl}?t=${Date.now()}`;
    document.querySelectorAll("link[rel*='icon'], link[rel='apple-touch-icon']")
      .forEach((el) => el.setAttribute('href', href));
  }, [faviconUrl]);

  const pageTitle = businessInfo.name
    ? `${businessInfo.name} · Reparação & Vendas em Cabinda`
    : 'GTA-Tech · Reparação & Vendas em Cabinda';

  const ogTitle = businessInfo.name
    ? `${businessInfo.name} · Reparação & Vendas em Cabinda`
    : 'GTA-Tech · Reparação & Vendas em Cabinda';

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
        >
          <Wrench className="w-12 h-12 text-slate-900 animate-pulse" />
          <span className="mt-4 text-lg font-bold font-display tracking-tight text-slate-900">
            {businessInfo.name || 'GTA-Tech'}
          </span>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen relative flex flex-col font-sans overflow-x-hidden antialiased text-slate-800 bg-white transition-colors duration-300"
        >

      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Assistência técnica de smartphones e computadores em Cabinda. Reparação de ecrãs, baterias, placas-mãe e venda de equipamentos recondicionados com garantia." />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content="Reparação de ecrãs, baterias, placas-mãe e venda de equipamentos recondicionados em Cabinda." />
        <meta property="og:type" content="website" />
      </Helmet>

      <Topbar />
      <Header />

      {/* Main Assembly Blocks with fluid transitions */}
      <main className="flex-grow">
        
        {/* Hero Section with Startup Graphics */}
        {sectionVisibility.hero && <Hero />}

        {/* Corporate Supported Brands Slider */}
        {sectionVisibility.brands && <Brands />}

        {/* Action-linked Services Grid */}
        {sectionVisibility.services && <Services onSelectService={handleSelectService} />}

        {/* Catalog of Refurbished Premium Devices and Accessories */}
        {sectionVisibility.salesStore && <SalesStore />}

        {/* Porquê nós / Core differential features */}
        {sectionVisibility.features && <Features />}

        {/* 4-step workflow process layout */}
        {sectionVisibility.process && <Process />}

        {/* Highly Interactive Online repair price estimator calculator */}
        {sectionVisibility.estimator && (
        <InteractiveEstimator
          preselectedServiceId={preselectedServiceId}
          clearPreselection={handleClearPreselection}
        />
        )}

        {/* Double Quote Testimonials list */}
        {sectionVisibility.testimonials && <Testimonials />}

        {/* Interactive Accordion FAQs */}
        {sectionVisibility.faq && <FAQ />}

        {/* Team members grid */}
        {sectionVisibility.team && <Team />}

        {/* Photo Gallery with category filter */}
        {sectionVisibility.gallery && <Gallery />}

        {/* Dual Column Quem Somos story and Outreach form */}
        {sectionVisibility.aboutContact && <AboutContact />}

      </main>

      {/* Clean informative copyright footer */}
      <Footer />

        </motion.div>
      )}
    </AnimatePresence>
  );
}
