/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ServiceItem {
  id: string;
  title: string;
  iconName: string;
  description: string;
  features: string[];
  priceRange: string;
  avgTime: string;
}

export interface BrandItem {
  id: string;
  name: string;
  logoType: string;
}

export interface SupportStep {
  step: number;
  title: string;
  description: string;
  badge: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  deviceRepaired: string;
  comment: string;
  rating: number;
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface EstimatorIssue {
  id: string;
  label: string;
  basePrice: number;
  estimatedTime: string;
}

export interface EstimatorDevice {
  id: string;
  label: string;
  brands: string[];
  issues: EstimatorIssue[];
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  icon: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'smartphones' | 'laptops' | 'tablets' | 'wearables' | 'accessories';
  price: number;
  originalPrice?: number;
  iconName: string;
  imageUrl: string;
  description: string;
  specs?: string[];
  inStock: boolean;
  condition: 'Novo' | 'Recondicionado Grade A+' | 'Recondicionado Grade A' | string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  bio: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    whatsapp?: string;
  };
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'antes-depois' | 'laboratorio' | 'equipa' | 'oficina';
  imageUrl: string;
  description: string;
}
