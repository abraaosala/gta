/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import type { ServiceItem } from '../../types.ts';
import {
  adminFetchServices,
  adminCreateService,
  adminUpdateService,
  adminDeleteService,
} from '../../lib/api.ts';
import { Plus, Pencil, Trash2, RotateCcw, X } from 'lucide-react';
import { useToast } from '../../lib/toast.tsx';
import DataTable from './DataTable.tsx';
import type { Column } from './DataTable.tsx';

const actionBtn = (onEdit: () => void, onDelete: () => void) => (
  <div className="flex gap-1">
    <button onClick={onEdit} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
    <button onClick={onDelete} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
  </div>
);

const iconRender = (iconName: string) =>
  iconName === 'BatteryCharging' ? '🔋' : iconName === 'Cpu' ? '🔲' : iconName === 'Plug' ? '🔌' : iconName === 'Laptop' ? '💻' : iconName === 'CloudLightning' ? '☁️' : '📱';

function serviceColumns(openEdit: (item: any) => void, remove: (id: string) => void): Column<any>[] {
  return [
    { key: 'iconName', label: 'Ícone', render: (i) => <span className="text-lg">{iconRender(i.iconName)}</span> },
    { key: 'title', label: 'Título', render: (i) => <span className="font-medium">{i.title}</span> },
    { key: 'priceRange', label: 'Preço', render: (i) => i.priceRange },
    { key: 'avgTime', label: 'Tempo', render: (i) => i.avgTime },
    { key: 'actions', label: 'Acções', sortable: false, className: 'w-24', render: (i) => actionBtn(() => openEdit(i), () => remove(i.id)) },
  ];
}

const ICONS = ['Smartphone', 'BatteryCharging', 'Cpu', 'Plug', 'Laptop', 'CloudLightning'];

const empty = (): ServiceItem => ({
  id: crypto.randomUUID(),
  title: '',
  iconName: 'Smartphone',
  description: '',
  features: [''],
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

  useEffect(() => {
    adminFetchServices().then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

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
    } catch { toast.error('Erro ao guardar serviço'); }
  };

  const remove = async (id: string) => {
    try {
      await adminDeleteService(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success('Serviço eliminado');
    } catch { toast.error('Erro ao eliminar serviço'); }
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
                <select value={draft.iconName} onChange={(e) => setDraft((p) => ({ ...p, iconName: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                  {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Características (uma por linha)</label>
                <textarea value={draft.features.join('\n')} onChange={(e) => setDraft((p) => ({ ...p, features: e.target.value.split('\n').filter(Boolean) }))} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none" />
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
