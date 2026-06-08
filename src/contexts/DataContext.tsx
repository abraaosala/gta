/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {createContext, useContext, useState, useEffect, useCallback, useRef} from 'react';
import type {
  ServiceItem,
  BrandItem,
  SupportStep,
  TestimonialItem,
  FAQItem,
  EstimatorDevice,
  ProductItem,
  FeatureItem,
  TeamMember,
  GalleryItem,
} from '../types.ts';
import type {BusinessInfo} from '../lib/data-store.ts';
import {DEFAULTS} from '../lib/data-store.ts';
import {fetchLanding} from '../lib/api.ts';

interface DataContextValue {
  businessInfo: BusinessInfo;
  services: ServiceItem[];
  brands: BrandItem[];
  process: SupportStep[];
  testimonials: TestimonialItem[];
  faqs: FAQItem[];
  estimator: EstimatorDevice[];
  products: ProductItem[];
  features: FeatureItem[];
  team: TeamMember[];
  gallery: GalleryItem[];
  settings: Record<string, string>;
  loading: boolean;
  refresh: () => Promise<void>;
  updateBusinessInfo: (partial: Partial<BusinessInfo>) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({children}: {children: React.ReactNode}) {
  const [data, setData] = useState({
    businessInfo: DEFAULTS.businessInfo,
    services: DEFAULTS.services,
    brands: DEFAULTS.brands,
    process: DEFAULTS.process,
    testimonials: DEFAULTS.testimonials,
    faqs: DEFAULTS.faqs,
    estimator: DEFAULTS.estimator,
    products: DEFAULTS.products,
    features: DEFAULTS.features,
    team: DEFAULTS.team,
    gallery: DEFAULTS.gallery,
    settings: DEFAULTS.settings,
  });
  const [loading, setLoading] = useState(true);

  async function load(): Promise<void> {
    try {
      const landing = await fetchLanding();
      setData((prev) => ({
        services: landing.services.length > 0 ? landing.services : prev.services,
        products: landing.products.length > 0 ? landing.products : prev.products,
        testimonials: landing.testimonials.length > 0 ? landing.testimonials : prev.testimonials,
        faqs: landing.faqs.length > 0 ? landing.faqs : prev.faqs,
        brands: landing.brands.length > 0 ? landing.brands : prev.brands,
        process: landing.process.length > 0 ? landing.process : prev.process,
        estimator: landing.estimator.length > 0 ? landing.estimator : prev.estimator,
        features: landing.features.length > 0 ? landing.features : prev.features,
        team: landing.team.length > 0 ? landing.team : prev.team,
        gallery: landing.gallery.length > 0 ? landing.gallery : prev.gallery,
        businessInfo: landing.businessInfo ? landing.businessInfo : prev.businessInfo,
        settings: Object.keys(landing.settings).length > 0 ? landing.settings : prev.settings,
      }));
    } catch {
      // API offline — keep defaults
    }
  }

  const refresh = useCallback(async () => {
    setLoading(true);
    await load();
    setLoading(false);
  }, []);

  const updateBusinessInfo = useCallback((partial: Partial<BusinessInfo>) => {
    setData((prev) => ({
      ...prev,
      businessInfo: { ...prev.businessInfo, ...partial },
    }));
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      await load();
      if (!cancelled) setLoading(false);
    }
    init();
    return () => { cancelled = true; };
  }, []);

  return (
    <DataContext.Provider value={{...data, loading, refresh, updateBusinessInfo}}>
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
