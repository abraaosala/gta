/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import type { SupportStep } from '../../types.ts';
import {
  adminFetchProcess,
  adminCreateProcess,
  adminUpdateProcess,
  adminDeleteProcess,
} from '../../lib/api.ts';
import { Plus, Pencil, Trash2, RotateCcw, X } from 'lucide-react';
import { useToast } from '../../lib/toast.tsx';
import DataTable from './DataTable.tsx';
import type { Column } from './DataTable.tsx';

type ProcessItem = SupportStep & { _apiId?: string };

const empty = (): ProcessItem => ({ step: 1, title: '', description: '', badge: '' });

export default function AdminProcess() {
  const toast = useToast();
  const [items, setItems] = useState<ProcessItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApiId, setEditingApiId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProcessItem>(empty());

  useEffect(() => { adminFetchProcess().then(setItems).catch(() => {}).finally(() => setLoading(false)); }, []);

  const openCreate = () => { setDraft(empty()); setEditingApiId(null); setModalOpen(true); };
  const openEdit = (item: ProcessItem) => { setDraft({ ...item }); setEditingApiId(item._apiId || null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingApiId(null); };

  const save = async () => {
    try {
      if (editingApiId) {
        const updated = await adminUpdateProcess(editingApiId, draft as any);
        setItems((p) => p.map((i) => (i._apiId === editingApiId ? updated : i)));
        toast.success('Etapa actualizada');
      } else {
        const created = await adminCreateProcess(draft as any);
        setItems((p) => [...p, created]);
        toast.success('Etapa criada');
      }
      closeModal();
    } catch { toast.error('Erro ao guardar etapa'); }
  };

  const remove = async (apiId: string) => {
    try { await adminDeleteProcess(apiId); setItems((p) => p.filter((i) => i._apiId !== apiId)); toast.success('Etapa eliminada'); } catch { toast.error('Erro ao eliminar etapa'); }
  };

  if (loading) return <div className="text-sm text-slate-400">A carregar...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold font-display text-slate-900">Processo</h2>
        <div className="flex gap-2">
          <button onClick={() => { localStorage.removeItem('gta_admin_process'); window.location.reload(); }} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"><RotateCcw className="w-3.5 h-3.5" /></button>
          <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 cursor-pointer"><Plus className="w-3.5 h-3.5" /> Novo</button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'step', label: 'Passo', className: 'w-12', render: (i) => <span className="font-mono text-slate-400 text-xs">{i.step}</span> },
          { key: 'title', label: 'Título', render: (i) => <span className="font-medium">{i.title}</span> },
          { key: 'description', label: 'Descrição', render: (i) => <span className="text-xs text-slate-500 max-w-[250px] truncate block">{i.description}</span> },
          { key: 'badge', label: 'Badge', render: (i) => <span className="text-[10px] text-blue-600 font-mono">{i.badge}</span> },
          { key: 'actions', label: 'Acções', sortable: false, className: 'w-24', render: (i) => (
            <div className="flex gap-1">
              <button onClick={() => openEdit(i)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => remove((i as any)._apiId)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )},
        ]}
        data={items}
        keyExtractor={(i) => (i as any)._apiId}
        emptyMessage="Nenhuma etapa encontrada."
      />

      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-sm font-bold font-display text-slate-900">
                {editingApiId ? 'Editar Etapa' : 'Nova Etapa'}
              </h3>
              <button onClick={closeModal} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Número do passo</label>
                <input type="number" value={draft.step} onChange={(e) => setDraft((p) => ({ ...p, step: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Título</label>
                <input value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} placeholder="Título da etapa" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Descrição</label>
                <textarea value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} placeholder="Descrição" rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Badge</label>
                <input value={draft.badge} onChange={(e) => setDraft((p) => ({ ...p, badge: e.target.value }))} placeholder="Ex: Grátis & Rápido" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
              </div>
            </div>

            <div className="flex justify-end gap-2 p-5 border-t border-slate-200">
              <button onClick={closeModal} className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer">Cancelar</button>
              <button onClick={save} disabled={!draft.title} className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 disabled:opacity-40 cursor-pointer">
                {editingApiId ? 'Guardar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
