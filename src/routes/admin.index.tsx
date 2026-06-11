/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Cpu, Package, Star, Users, Image, Smartphone, Mail, Phone, Calendar } from 'lucide-react';
import { useData } from '../contexts/DataContext.tsx';
import {
  adminFetchServices,
  adminFetchProducts,
  adminFetchTestimonials,
  adminFetchTeam,
  adminFetchGallery,
  adminFetchBrands,
  adminFetchContacts,
} from '../lib/api.ts';
import type { AdminContact } from '../lib/api.ts';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
});

interface DashboardStats {
  services: number;
  products: number;
  testimonials: number;
  team: number;
  gallery: number;
  brands: number;
  contacts: number;
}

const statCards = [
  { key: 'services' as const, label: 'Serviços', icon: Cpu, color: 'text-blue-600' },
  { key: 'products' as const, label: 'Produtos', icon: Package, color: 'text-emerald-600' },
  { key: 'testimonials' as const, label: 'Depoimentos', icon: Star, color: 'text-amber-500' },
  { key: 'team' as const, label: 'Equipa', icon: Users, color: 'text-indigo-500' },
  { key: 'gallery' as const, label: 'Galeria', icon: Image, color: 'text-purple-500' },
  { key: 'brands' as const, label: 'Marcas', icon: Smartphone, color: 'text-cyan-600' },
  { key: 'contacts' as const, label: 'Contactos', icon: Mail, color: 'text-rose-500' },
];

function AdminDashboard() {
  const { businessInfo } = useData();
  const [stats, setStats] = useState<DashboardStats>({
    services: 0, products: 0, testimonials: 0, team: 0, gallery: 0, brands: 0, contacts: 0,
  });
  const [recentContacts, setRecentContacts] = useState<AdminContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminFetchServices(1),
      adminFetchProducts(1),
      adminFetchTestimonials(1),
      adminFetchTeam(1),
      adminFetchGallery(1),
      adminFetchBrands(1),
      adminFetchContacts(1),
    ])
      .then(([services, products, testimonials, team, gallery, brands, contacts]) => {
        setStats({
          services: services.total,
          products: products.total,
          testimonials: testimonials.total,
          team: team.total,
          gallery: gallery.total,
          brands: brands.total,
          contacts: contacts.total,
        });
        setRecentContacts(contacts.data.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-slate-900">Painel de Administração</h1>
        <p className="text-sm text-slate-400 mt-1">
          Bem-vindo, Admin{businessInfo.city ? ` · ${businessInfo.city}` : ''}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {loading
          ? Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-slate-100 mb-3" />
                <div className="h-7 w-16 bg-slate-100 rounded mb-1" />
                <div className="h-4 w-20 bg-slate-50 rounded" />
              </div>
            ))
          : statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.key} className="bg-white rounded-2xl border border-slate-200 p-5 text-left">
                  <div className={`p-2.5 rounded-xl bg-slate-50 inline-flex mb-3 ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold font-display text-slate-900">{stats[stat.key]}</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">{stat.label}</div>
                </div>
              );
            })}
      </div>

      {!loading && recentContacts.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-sm font-bold font-display text-slate-900 mb-4">Contactos Recentes</h3>
          <div className="space-y-3">
            {recentContacts.map((c) => (
              <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{c.name}</p>
                  <p className="text-xs text-slate-500 truncate">{c.message}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                    {c.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{c.email}</span>}
                    {c.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{c.phone}</span>}
                    {c.createdAt && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(c.createdAt).toLocaleDateString('pt-AO')}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
