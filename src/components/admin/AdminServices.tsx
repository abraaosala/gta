/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, type ComponentType } from 'react';
import type { ServiceItem } from '../../types.ts';
import {
  adminFetchServices,
  adminCreateService,
  adminUpdateService,
  adminDeleteService,
} from '../../lib/api.ts';
import {
  Plus, Pencil, Trash2, RotateCcw, X,
  Smartphone, BatteryCharging, Cpu, Plug, Laptop, CloudLightning,
  Tablet, Monitor, Watch, Gamepad, Camera, Headphones, Speaker, Printer,
  HardDrive, Server, BatteryWarning, Zap, Wifi, Bluetooth, Signal, Cloud,
  Shield, Lock, Search, Eye, Hammer, Wrench, Settings, Sliders,
  RefreshCw, Download, Upload, Phone, MessageCircle, Mail,
  Microchip, CircuitBoard, Fan, Thermometer, Keyboard, Mouse, Disc, Usb,
  Radio, Tv,
} from 'lucide-react';
import { useToast } from '../../lib/toast.tsx';
import DataTable from './DataTable.tsx';
import type { Column } from './DataTable.tsx';
import Pagination from './Pagination.tsx';

const actionBtn = (onEdit: () => void, onDelete: () => void) => (
  <div className="flex gap-1">
    <button onClick={onEdit} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
    <button onClick={onDelete} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
  </div>
);

const ADMIN_ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  Smartphone, BatteryCharging, Cpu, Plug, Laptop, CloudLightning,
  Tablet, Monitor, Watch, Gamepad, Camera, Headphones, Speaker, Printer,
  HardDrive, Server, BatteryWarning, Zap, Wifi, Bluetooth, Signal, Cloud,
  Shield, Lock, Search, Eye, Hammer, Wrench, Settings, Sliders,
  RefreshCw, Download, Upload, Phone, MessageCircle, Mail,
  Microchip, CircuitBoard, Fan, Thermometer, Keyboard, Mouse, Disc, Usb,
  Radio, Tv,
};

const ICONS = Object.keys(ADMIN_ICON_MAP);

function serviceColumns(openEdit: (item: any) => void, remove: (id: string) => void): Column<any>[] {
  return [
    { key: 'iconName', label: 'Ícone', render: (i) => {
      const IconComp = ADMIN_ICON_MAP[i.iconName];
      return IconComp ? <IconComp className="w-5 h-5 text-slate-600" /> : <span className="text-lg">📱</span>;
    } },
    { key: 'title', label: 'Título', render: (i) => <span className="font-medium">{i.title}</span> },
    { key: 'priceRange', label: 'Preço', render: (i) => i.priceRange },
    { key: 'avgTime', label: 'Tempo', render: (i) => i.avgTime },
    { key: 'actions', label: 'Acções', sortable: false, className: 'w-24', render: (i) => actionBtn(() => openEdit(i), () => remove(i.id)) },
  ];
}

const empty = (): ServiceItem => ({
  id: crypto.randomUUID(),
  title: '',
  iconName: 'Smartphone',
  description: '',
  features: [],
  priceRange: '',
  avgTime: '',
});

export default function AdminServices() {
  const toast = useToast();
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ServiceItem>(empty());
  const [newFeature, setNewFeature] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, from: null as number | null, to: null as number | null });

  const load = useCallback((p: number) => {
    setLoading(true);
    adminFetchServices(p).then((res) => { setItems(res.data); setPagination(res); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  const openCreate = () => {
    setDraft(empty());
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (item: ServiceItem) => {
    setDraft({ ...item, features: [...item.features] });
    setEditingId(item.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setNewFeature('');
  };

  const addFeature = () => {
    const trimmed = newFeature.trim();
    if (trimmed) {
      setDraft((p) => ({ ...p, features: [...p.features, trimmed] }));
      setNewFeature('');
    }
  };

  const save = async () => {
    try {
      if (editingId) {
        const updated = await adminUpdateService(editingId, draft);
        setItems((prev) => prev.map((i) => (i.id === editingId ? updated : i)));
        toast.success('Serviço actualizado');
      } else {
        const created = await adminCreateService(draft);
        setItems((prev) => [...prev, created]);
        toast.success('Serviço criado');
      }
      closeModal();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Erro ao guardar serviço'); }
  };

  const remove = async (id: string) => {
    try {
      await adminDeleteService(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success('Serviço eliminado');
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Erro ao eliminar serviço'); }
  };

  if (loading) return <div className="text-sm text-slate-400">A carregar...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold font-display text-slate-900">Serviços</h2>
        <div className="flex gap-2">
          <button onClick={() => { localStorage.removeItem('gta_admin_services'); window.location.reload(); }} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Novo
          </button>
        </div>
      </div>

      <DataTable
        columns={serviceColumns(openEdit, remove)}
        data={items}
        keyExtractor={(i) => i.id}
        emptyMessage="Nenhum serviço encontrado."
      />

      <Pagination page={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} from={pagination.from} to={pagination.to} onPageChange={setPage} />

      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-sm font-bold font-display text-slate-900">
                {editingId ? 'Editar Serviço' : 'Novo Serviço'}
              </h3>
              <button onClick={closeModal} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Título</label>
                <input value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} placeholder="Nome do serviço" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Descrição</label>
                <textarea value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} placeholder="Descrição" rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Preço</label>
                  <input value={draft.priceRange} onChange={(e) => setDraft((p) => ({ ...p, priceRange: e.target.value }))} placeholder="A partir de 18.000 Kz" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Tempo médio</label>
                  <input value={draft.avgTime} onChange={(e) => setDraft((p) => ({ ...p, avgTime: e.target.value }))} placeholder="45 minutos" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Ícone</label>
                <div className="grid grid-cols-8 gap-1.5 max-h-48 overflow-y-auto p-2 rounded-lg border border-slate-200">
                  {ICONS.map((ic) => {
                    const Icn = ADMIN_ICON_MAP[ic];
                    const selected = draft.iconName === ic;
                    return (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => setDraft((p) => ({ ...p, iconName: ic }))}
                        title={ic}
                        className={`flex items-center justify-center p-2 rounded-lg cursor-pointer transition-all ${
                          selected ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-slate-100'
                        }`}
                      >
                        {Icn ? <Icn className="w-5 h-5" /> : <span className="text-lg">📱</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Características</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {draft.features.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                      {f}
                      <button type="button" onClick={() => setDraft((p) => ({ ...p, features: p.features.filter((_, j) => j !== i) }))} className="cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                    placeholder="Adicionar característica"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    disabled={!newFeature.trim()}
                    className="px-3 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-40 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-5 border-t border-slate-200">
              <button onClick={closeModal} className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer">Cancelar</button>
              <button onClick={save} disabled={!draft.title} className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 disabled:opacity-40 cursor-pointer">
                {editingId ? 'Guardar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
