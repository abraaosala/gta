/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import type { TestimonialItem } from '../../types.ts';
import {
  adminFetchTestimonials,
  adminCreateTestimonial,
  adminUpdateTestimonial,
  adminDeleteTestimonial,
} from '../../lib/api.ts';
import { Plus, Pencil, Trash2, RotateCcw, X, Star } from 'lucide-react';
import { useToast } from '../../lib/toast.tsx';
import DataTable from './DataTable.tsx';
import type { Column } from './DataTable.tsx';

const empty = (): TestimonialItem => ({
  id: crypto.randomUUID(), name: '', deviceRepaired: '', comment: '', rating: 5, date: '',
});

export default function AdminTestimonials() {
  const toast = useToast();
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TestimonialItem>(empty());

  useEffect(() => { adminFetchTestimonials().then(setItems).catch(() => {}).finally(() => setLoading(false)); }, []);

  const openCreate = () => { setDraft(empty()); setEditingId(null); setModalOpen(true); };
  const openEdit = (item: TestimonialItem) => { setDraft({ ...item }); setEditingId(item.id); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingId(null); };

  const save = async () => {
    try {
      if (editingId) {
        const updated = await adminUpdateTestimonial(editingId, draft);
        setItems((p) => p.map((i) => (i.id === editingId ? updated : i)));
        toast.success('Depoimento actualizado');
      } else {
        const created = await adminCreateTestimonial(draft);
        setItems((p) => [...p, created]);
        toast.success('Depoimento criado');
      }
      closeModal();
    } catch { toast.error('Erro ao guardar depoimento'); }
  };

  const remove = async (id: string) => {
    try { await adminDeleteTestimonial(id); setItems((p) => p.filter((i) => i.id !== id)); toast.success('Depoimento eliminado'); } catch { toast.error('Erro ao eliminar depoimento'); }
  };

  if (loading) return <div className="text-sm text-slate-400">A carregar...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold font-display text-slate-900">Depoimentos</h2>
        <div className="flex gap-2">
          <button onClick={() => { localStorage.removeItem('gta_admin_testimonials'); window.location.reload(); }} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"><RotateCcw className="w-3.5 h-3.5" /></button>
          <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 cursor-pointer"><Plus className="w-3.5 h-3.5" /> Novo</button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'name', label: 'Nome', render: (i) => <span className="font-medium">{i.name}</span> },
          { key: 'deviceRepaired', label: 'Aparelho', render: (i) => <span className="text-xs text-slate-500">{i.deviceRepaired || '—'}</span> },
          { key: 'comment', label: 'Depoimento', render: (i) => <span className="text-xs text-slate-500 max-w-[250px] truncate block">"{i.comment}"</span> },
          { key: 'rating', label: 'Rating', render: (i) => (
            <span className="flex items-center gap-0.5 text-amber-500">
              {Array.from({ length: 5 }, (_, idx) => <Star key={idx} className={`w-3 h-3 ${idx < i.rating ? 'fill-current' : 'opacity-20'}`} />)}
            </span>
          )},
          { key: 'actions', label: 'Acções', sortable: false, className: 'w-24', render: (i) => (
            <div className="flex gap-1">
              <button onClick={() => openEdit(i)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => remove(i.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )},
        ]}
        data={items}
        keyExtractor={(i) => i.id}
        emptyMessage="Nenhum depoimento encontrado."
      />

      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-sm font-bold font-display text-slate-900">
                {editingId ? 'Editar Depoimento' : 'Novo Depoimento'}
              </h3>
              <button onClick={closeModal} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Nome</label>
                <input value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} placeholder="Nome do cliente" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Aparelho reparado</label>
                <input value={draft.deviceRepaired} onChange={(e) => setDraft((p) => ({ ...p, deviceRepaired: e.target.value }))} placeholder="Ex: iPhone 13 Pro Max" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Depoimento</label>
                <textarea value={draft.comment} onChange={(e) => setDraft((p) => ({ ...p, comment: e.target.value }))} placeholder="Depoimento do cliente" rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Classificação</label>
                <select value={draft.rating} onChange={(e) => setDraft((p) => ({ ...p, rating: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} estrela{r > 1 ? 's' : ''}</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-5 border-t border-slate-200">
              <button onClick={closeModal} className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer">Cancelar</button>
              <button onClick={save} disabled={!draft.name} className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 disabled:opacity-40 cursor-pointer">
                {editingId ? 'Guardar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
