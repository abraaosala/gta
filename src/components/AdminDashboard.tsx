/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useState} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {Link, useNavigate} from '@tanstack/react-router';
import {
  Wrench,
  Smartphone,
  Star,
  ShieldCheck,
  LogOut,
  MessageCircle,
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
} from 'lucide-react';
import {logout} from '../lib/auth.ts';
import {useData} from '../contexts/DataContext.tsx';
import {useToast} from '../lib/toast.tsx';
import AdminServices from './admin/AdminServices.tsx';
import AdminProducts from './admin/AdminProducts.tsx';
import AdminTestimonials from './admin/AdminTestimonials.tsx';
import AdminFAQs from './admin/AdminFAQs.tsx';
import AdminBrands from './admin/AdminBrands.tsx';
import AdminProcess from './admin/AdminProcess.tsx';
import AdminEstimator from './admin/AdminEstimator.tsx';
import AdminInfo from './admin/AdminInfo.tsx';
import AdminContacts from './admin/AdminContacts.tsx';
import AdminUsers from './admin/AdminUsers.tsx';
import AdminTeam from './admin/AdminTeam.tsx';
import AdminGallery from './admin/AdminGallery.tsx';
import AdminSettings from './admin/AdminSettings.tsx';

type Section =
  | 'dashboard'
  | 'services'
  | 'products'
  | 'testimonials'
  | 'faqs'
  | 'brands'
  | 'process'
  | 'estimator'
  | 'info'
  | 'contacts'
  | 'users'
  | 'team'
  | 'gallery'
  | 'settings';

interface SidebarItem {
  label: string;
  section: Section;
  icon: React.ComponentType<{className?: string}>;
}

interface SidebarGroup {
  label: string;
  icon: React.ComponentType<{className?: string}>;
  items: SidebarItem[];
}

const dashboardItem: SidebarItem = {label: 'Dashboard', section: 'dashboard', icon: LayoutDashboard};

const sidebarGroups: SidebarGroup[] = [
  {
    label: 'Conteúdo',
    icon: LayoutDashboard,
    items: [
      {label: 'Serviços', section: 'services', icon: Cpu},
      {label: 'Produtos', section: 'products', icon: Package},
      {label: 'Equipa', section: 'team', icon: Users},
      {label: 'Galeria', section: 'gallery', icon: Image},
      {label: 'Depoimentos', section: 'testimonials', icon: Star},
      {label: 'FAQs', section: 'faqs', icon: HelpCircle},
      {label: 'Marcas', section: 'brands', icon: Smartphone},
      {label: 'Processo', section: 'process', icon: ClipboardList},
    ],
  },
  {
    label: 'Configurações',
    icon: ShieldCheck,
    items: [
      {label: 'Estimador', section: 'estimator', icon: Calculator},
      {label: 'Contactos', section: 'contacts', icon: Mail},
      {label: 'Utilizadores', section: 'users', icon: ShieldCheck},
      {label: 'Informações', section: 'info', icon: Building2},
      {label: 'Definições', section: 'settings', icon: Settings},
    ],
  },
];

function findSectionLabel(section: Section): string {
  if (section === 'dashboard') return 'Dashboard';
  for (const group of sidebarGroups) {
    const found = group.items.find((i) => i.section === section);
    if (found) return found.label;
  }
  return 'Dashboard';
}

const stats = [
  {label: 'Reparações Realizadas', value: '1.247', icon: Smartphone, color: 'text-blue-600'},
  {label: 'Satisfação', value: '98%', icon: Star, color: 'text-amber-500'},
  {label: 'Avaliações', value: '450+', icon: MessageCircle, color: 'text-emerald-500'},
  {label: 'Dias Garantia', value: '90', icon: ShieldCheck, color: 'text-indigo-500'},
];

function SidebarNavItem({
  item,
  active,
  onClick,
}: {
  item: SidebarItem;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer text-left ${
        active
          ? 'bg-blue-600/10 text-blue-400 font-medium'
          : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {item.label}
    </button>
  );
}

function SidebarGroupBlock({
  group,
  activeSection,
  collapsed,
  onToggle,
  onSelect,
}: {
  group: SidebarGroup;
  activeSection: Section;
  collapsed: boolean;
  onToggle: () => void;
  onSelect: (section: Section) => void;
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
            initial={{height: 0, opacity: 0}}
            animate={{height: 'auto', opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.2, ease: 'easeInOut'}}
            className="overflow-hidden"
          >
            <div className="pl-3 mt-0.5 space-y-0.5 border-l border-slate-800 ml-4">
              {group.items.map((item) => (
                <SidebarNavItem
                  key={item.section}
                  item={item}
                  active={activeSection === item.section}
                  onClick={() => onSelect(item.section)}
                />
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
  activeSection,
  collapsed,
  onToggle,
  onSelect,
}: {
  group: SidebarGroup;
  activeSection: Section;
  collapsed: boolean;
  onToggle: () => void;
  onSelect: (section: Section) => void;
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
            initial={{height: 0, opacity: 0}}
            animate={{height: 'auto', opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.2, ease: 'easeInOut'}}
            className="overflow-hidden"
          >
            <div className="pl-3 ml-4 mt-0.5 space-y-0.5 border-l border-slate-100">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.section}
                    onClick={() => onSelect(item.section)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer text-left ${
                      activeSection === item.section
                        ? 'bg-blue-600/10 text-blue-600 font-medium'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const {businessInfo} = useData();
  const [section, setSection] = useState<Section>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    'Configurações': true,
  });

  const handleLogout = async () => {
    await logout();
    toast.success('Sessão terminada');
    navigate({to: '/'});
  };

  const toggleGroup = (label: string) => {
    setCollapsedGroups((prev) => ({...prev, [label]: !prev[label]}));
  };

  const selectSection = (s: Section) => {
    setSection(s);
    setMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (section) {
      case 'services': return <AdminServices />;
      case 'products': return <AdminProducts />;
      case 'testimonials': return <AdminTestimonials />;
      case 'faqs': return <AdminFAQs />;
      case 'brands': return <AdminBrands />;
      case 'process': return <AdminProcess />;
      case 'estimator': return <AdminEstimator />;
      case 'info': return <AdminInfo />;
      case 'contacts': return <AdminContacts />;
      case 'users': return <AdminUsers />;
      case 'team': return <AdminTeam />;
      case 'gallery': return <AdminGallery />;
      case 'settings': return <AdminSettings />;
      default: return (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold font-display text-slate-900">Painel de Administração</h1>
            <p className="text-sm text-slate-400 mt-1">
              Bem-vindo, Admin · {businessInfo.city}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl border border-slate-200 p-5 text-left"
                >
                  <div className={`p-2.5 rounded-xl bg-slate-50 inline-flex mb-3 ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold font-display text-slate-900">{stat.value}</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
            <MessageCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Consulte os contactos recebidos na secção <strong>Contactos</strong>.</p>
          </div>
        </>
      );
    }
  };

  const sectionLabel = findSectionLabel(section);

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
            <SidebarNavItem
              item={dashboardItem}
              active={section === 'dashboard'}
              onClick={() => setSection('dashboard')}
            />
            <div className="pt-3 space-y-0.5">
              {sidebarGroups.map((group) => (
                <SidebarGroupBlock
                  key={group.label}
                  group={group}
                  activeSection={section}
                  collapsed={collapsedGroups[group.label] ?? false}
                  onToggle={() => toggleGroup(group.label)}
                  onSelect={setSection}
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
              <span className="text-sm font-medium text-slate-500">{sectionLabel}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
                {sectionLabel}
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
              <button
                onClick={() => selectSection('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer text-left ${
                  section === 'dashboard'
                    ? 'bg-blue-600/10 text-blue-600 font-medium'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                Dashboard
              </button>
              <div className="pt-1 space-y-0.5">
                {sidebarGroups.map((group) => (
                  <MobileGroupBlock
                    key={group.label}
                    group={group}
                    activeSection={section}
                    collapsed={collapsedGroups[group.label] ?? false}
                    onToggle={() => toggleGroup(group.label)}
                    onSelect={selectSection}
                  />
                ))}
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
