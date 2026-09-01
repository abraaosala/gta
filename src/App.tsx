/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { useData } from './contexts/DataContext.tsx';
import { dividerFrom, SECTION_BG } from './lib/sections.ts';
import type { SectionId, SectionVisibility } from './lib/sections.ts';
import Topbar from './components/Topbar.tsx';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import Preloader from './components/Preloader.tsx';
import SectionDivider from './components/SectionDivider.tsx';
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

interface BetweenSectionsProps {
  above: SectionId;
  below: SectionId;
  visibility: SectionVisibility;
  variant?: 'soft' | 'strong';
  flip?: boolean;
}

/** Divisor derivado: só renderiza quando há transição de cor real entre as
 *  duas secções (ambas visíveis e com fundos diferentes). A cor vem de
 *  SECTION_BG, sem hex hardcoded. */
function BetweenSections({ above, below, visibility, variant = 'soft', flip }: BetweenSectionsProps) {
  const from = dividerFrom(above, below, visibility);
  if (!from) return null;
  return <SectionDivider from={from} variant={variant} flip={flip} />;
}

export default function App() {
  const { businessInfo, loading, sectionVisibility } = useData();
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);
  const [preloaderDone, setPreloaderDone] = useState(false);

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
    <>
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
        <BetweenSections above="services" below="salesStore" visibility={sectionVisibility} />

        {/* Catalog of Refurbished Premium Devices and Accessories */}
        {sectionVisibility.salesStore && <SalesStore />}
        <BetweenSections above="salesStore" below="features" visibility={sectionVisibility} />

        {/* Porquê nós / Core differential features */}
        {sectionVisibility.features && <Features />}
        <BetweenSections above="features" below="process" visibility={sectionVisibility} />

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
        <BetweenSections above="testimonials" below="faq" visibility={sectionVisibility} />

        {/* Interactive Accordion FAQs */}
        {sectionVisibility.faq && <FAQ />}
        <BetweenSections above="faq" below="team" visibility={sectionVisibility} />

        {/* Team members grid */}
        {sectionVisibility.team && <Team />}
        <BetweenSections above="team" below="gallery" visibility={sectionVisibility} />

        {/* Photo Gallery with category filter */}
        {sectionVisibility.gallery && <Gallery />}
        <BetweenSections above="gallery" below="aboutContact" visibility={sectionVisibility} />

        {/* Dual Column Quem Somos story and Outreach form */}
        {sectionVisibility.aboutContact && <AboutContact />}

        {/* slate-50 → dark footer (footer não é SectionId; derivamos a cor de above) */}
        {sectionVisibility.aboutContact && SECTION_BG.aboutContact && (
          <SectionDivider from={SECTION_BG.aboutContact!} variant="strong" />
        )}

      </main>

      {/* Clean informative copyright footer */}
      <Footer />

      </motion.div>

      <AnimatePresence>
        {!preloaderDone && (
          <Preloader
            visible={loading}
            businessName={businessInfo.name || 'GTA-Tech'}
            onFinished={() => setPreloaderDone(true)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
