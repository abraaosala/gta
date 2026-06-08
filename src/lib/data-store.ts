/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Data store — fallback layer.
 * DataContext loads from the API (see api.ts). This module provides
 * the fallback defaults from src/data.ts for when the API is unavailable.
 * It is no longer the primary data source.
 */

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
import {
  BUSINESS_INFO as DEFAULT_BUSINESS_INFO,
  SERVICES_LIST as DEFAULT_SERVICES,
  BRANDS_LIST as DEFAULT_BRANDS,
  PROCESS_STEPS as DEFAULT_PROCESS,
  TESTIMONIALS_LIST as DEFAULT_TESTIMONIALS,
  FAQS_LIST as DEFAULT_FAQS,
  ESTIMATOR_DEVICES as DEFAULT_ESTIMATOR,
  PRODUCTS_LIST as DEFAULT_PRODUCTS,
  FEATURES_LIST as DEFAULT_FEATURES,
  TEAM_MEMBERS as DEFAULT_TEAM,
  GALLERY_ITEMS as DEFAULT_GALLERY,
} from '../data.ts';

export interface BusinessInfo {
  name: string;
  slogan: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  city: string;
  logoUrl: string;
  faviconUrl: string;
}

export const DEFAULTS = {
  businessInfo: DEFAULT_BUSINESS_INFO as BusinessInfo,
  services: DEFAULT_SERVICES,
  brands: DEFAULT_BRANDS,
  process: DEFAULT_PROCESS,
  testimonials: DEFAULT_TESTIMONIALS,
  faqs: DEFAULT_FAQS,
  estimator: DEFAULT_ESTIMATOR,
  products: DEFAULT_PRODUCTS,
  features: DEFAULT_FEATURES,
  team: DEFAULT_TEAM,
  gallery: DEFAULT_GALLERY,
  settings: {} as Record<string, string>,
};
