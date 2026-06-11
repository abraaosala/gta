/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createFileRoute, Outlet, Link, useLocation, useNavigate, redirect } from '@tanstack/react-router';
import {
  Wrench,
  Smartphone,
  LogOut,
  LayoutDashboard,
  Mail,
  Package,
  HelpCircle,
  Cpu,
  ClipboardList,
  Calculator,
  Building2,
  ChevronDown,
  Users,
  Image,
  Settings,
  ChevronRight,
  Eye,
  Star,
  ShieldCheck,
} from 'lucide-react';
import { isAuthenticated, logout } from '../lib/auth.ts';
import { useData } from '../contexts/DataContext.tsx';
import { useToast } from '../lib/toast.tsx';

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' });
    }
  },
  component: AdminLayout,
});

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

const dashboardItem: NavItem = { label: 'Dashboard', to: '/admin', icon: LayoutDashboard };

const navGroups: NavGroup[] = [
  {
    label: 'Conteúdo',
    icon: LayoutDashboard,
    items: [
      { label: 'Serviços', to: '/admin/services', icon: Cpu },
      { label: 'Produtos', to: '/admin/products', icon: Package },
      { label: 'Equipa', to: '/admin/team', icon: Users },
      { label: 'Galeria', to: '/admin/gallery', icon: Image },
      { label: 'Depoimentos', to: '/admin/testimonials', icon: Star },
      { label: 'FAQs', to: '/admin/faqs', icon: HelpCircle },
      { label: 'Marcas', to: '/admin/brands', icon: Smartphone },
      { label: 'Processo', to: '/admin/process', icon: ClipboardList },
    ],
  },
  {
    label: 'Configurações',
    icon: ShieldCheck,
    items: [
      { label: 'Estimador', to: '/admin/estimator', icon: Calculator },
      { label: 'Contactos', to: '/admin/contacts', icon: Mail },
      { label: 'Utilizadores', to: '/admin/users', icon: ShieldCheck },
      { label: 'Informações', to: '/admin/info', icon: Building2 },
      { label: 'Definições', to: '/admin/settings', icon: Settings },
      { label: 'Secções', to: '/admin/sections', icon: Eye },
    ],
  },
];

function sectionLabel(path: string): string {
  if (path === '/admin') return 'Dashboard';
  for (const group of navGroups) {
    const found = group.items.find((i) => i.to === path);
    if (found) return found.label;
  }
  return 'Dashboard';
}

function SidebarNavItem({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
        active
          ? 'bg-blue-600/10 text-blue-400 font-medium'
          : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {item.label}
    </Link>
  );
}

function SidebarGroupBlock({
  group,
  activeTo,
  collapsed,
  onToggle,
}: {
  group: NavGroup;
  activeTo: string;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const GroupIcon = group.icon;
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <GroupIcon className="w-4 h-4 shrink-0" />
          <span className="font-medium">{group.label}</span>
        </div>
        <ChevronRight
          className={`w-3.5 h-3.5 transition-transform duration-200 ${collapsed ? '' : 'rotate-90'}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key={group.label}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pl-3 mt-0.5 space-y-0.5 border-l border-slate-800 ml-4">
              {group.items.map((item) => (
                <SidebarNavItem key={item.to} item={item} active={activeTo === item.to} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileGroupBlock({
  group,
  activeTo,
  collapsed,
  onToggle,
}: {
  group: NavGroup;
  activeTo: string;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const GroupIcon = group.icon;
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <GroupIcon className="w-4 h-4 shrink-0" />
          <span className="font-medium">{group.label}</span>
        </div>
        <ChevronRight
          className={`w-3.5 h-3.5 transition-transform duration-200 ${collapsed ? '' : 'rotate-90'}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pl-3 ml-4 mt-0.5 space-y-0.5 border-l border-slate-100">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => onToggle()}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      activeTo === item.to
                        ? 'bg-blue-600/10 text-blue-600 font-medium'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AdminLayout() {
  const navigate = useNavigate();
  const toast = useToast();
  const { businessInfo } = useData();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    Configurações: true,
  });

  const activeTo = location.pathname;

  const handleLogout = async () => {
    await logout();
    toast.success('Sessão terminada');
    navigate({ to: '/login' });
  };

  const toggleGroup = (label: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const label = sectionLabel(activeTo);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-60 xl:w-64 bg-slate-950 flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="p-5 border-b border-slate-800">
            <Link to="/" className="flex items-center gap-3">
              {businessInfo.logoUrl ? (
                <img src={businessInfo.logoUrl} alt={businessInfo.name} className="w-9 h-9 rounded-xl object-cover shadow-lg shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/15 shrink-0">
                  <Wrench className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="text-sm font-bold font-display text-white tracking-tight">{businessInfo.name}</span>
                <span className="block text-[8px] font-mono tracking-[0.15em] text-slate-500 uppercase">Admin</span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <SidebarNavItem item={dashboardItem} active={activeTo === '/admin'} />
            <div className="pt-3 space-y-0.5">
              {navGroups.map((group) => (
                <SidebarGroupBlock
                  key={group.label}
                  group={group}
                  activeTo={activeTo}
                  collapsed={collapsedGroups[group.label] ?? false}
                  onToggle={() => toggleGroup(group.label)}
                />
              ))}
            </div>
          </nav>

          <div className="p-3 border-t border-slate-800 space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 transition-colors"
            >
              <Smartphone className="w-4 h-4 shrink-0" />
              Ver Site
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sair
            </button>
            <div className="px-3 pt-2 text-[10px] text-slate-700 font-mono">
              &copy; {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header + top bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="flex items-center justify-between h-14 px-4 sm:px-6">
            <div className="flex items-center gap-3 lg:hidden">
              {businessInfo.logoUrl ? (
                <img src={businessInfo.logoUrl} alt={businessInfo.name} className="w-8 h-8 rounded-lg object-cover shadow-sm" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-sm">
                  <Wrench className="w-4 h-4" />
                </div>
              )}
              <span className="text-sm font-bold font-display text-slate-900">{businessInfo.name}</span>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-500">{label}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
                {label}
              </button>
              <Link
                to="/"
                className="lg:hidden flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5" />
                Site
              </Link>
              <button
                onClick={handleLogout}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair
              </button>
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  activeTo === '/admin'
                    ? 'bg-blue-600/10 text-blue-600 font-medium'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                Dashboard
              </Link>
              <div className="pt-1 space-y-0.5">
                {navGroups.map((group) => (
                  <MobileGroupBlock
                    key={group.label}
                    group={group}
                    activeTo={activeTo}
                    collapsed={collapsedGroups[group.label] ?? false}
                    onToggle={() => toggleGroup(group.label)}
                  />
                ))}
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
