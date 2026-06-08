/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import type { FAQItem } from '../../types.ts';
import {
  adminFetchFAQs,
  adminCreateFAQ,
  adminUpdateFAQ,
  adminDeleteFAQ,
} from '../../lib/api.ts';
import { Plus, Pencil, Trash2, RotateCcw, X } from 'lucide-react';
import { useToast } from '../../lib/toast.tsx';
import DataTable from './DataTable.tsx';
import type { Column } from './DataTable.tsx';

const empty = (): FAQItem => ({ id: crypto.randomUUID(), question: '', answer: '' });

export default function AdminFAQs() {
  const toast = useToast();
  const [items, setItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<FAQItem>(empty());

  useEffect(() => { adminFetchFAQs().then(setItems).catch(() => {}).finally(() => setLoading(false)); }, []);

  const openCreate = () => { setDraft(empty()); setEditingId(null); setModalOpen(true); };
  const openEdit = (item: FAQItem) => { setDraft({ ...item }); setEditingId(item.id); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingId(null); };

  const save = async () => {
    try {
      if (editingId) {
        const updated = await adminUpdateFAQ(editingId, draft);
        setItems((p) => p.map((i) => (i.id === editingId ? updated : i)));
        toast.success('FAQ actualizada');
      } else {
        const created = await adminCreateFAQ(draft);
        setItems((p) => [...p, created]);
        toast.success('FAQ criada');
      }
      closeModal();
    } catch { toast.error('Erro ao guardar FAQ'); }
  };

  const remove = async (id: string) => {
    try { await adminDeleteFAQ(id); setItems((p) => p.filter((i) => i.id !== id)); toast.success('FAQ eliminada'); } catch { toast.error('Erro ao eliminar FAQ'); }
  };

  if (loading) return <div className="text-sm text-slate-400">A carregar...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold font-display text-slate-900">FAQs</h2>
        <div className="flex gap-2">
          <button onClick={() => { localStorage.removeItem('gta_admin_faqs'); window.location.reload(); }} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"><RotateCcw className="w-3.5 h-3.5" /></button>
          <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 cursor-pointer"><Plus className="w-3.5 h-3.5" /> Novo</button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'question', label: 'Pergunta', render: (i) => <span className="font-medium max-w-[250px] truncate block">{i.question}</span> },
          { key: 'answer', label: 'Resposta', render: (i) => <span className="text-xs text-slate-500 max-w-[300px] truncate block">{i.answer}</span> },
          { key: 'actions', label: 'Acções', sortable: false, className: 'w-24', render: (i) => (
            <div className="flex gap-1">
              <button onClick={() => openEdit(i)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => remove(i.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )},
        ]}
        data={items}
        keyExtractor={(i) => i.id}
        emptyMessage="Nenhuma FAQ encontrada."
      />

      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-sm font-bold font-display text-slate-900">
                {editingId ? 'Editar FAQ' : 'Nova FAQ'}
              </h3>
              <button onClick={closeModal} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Pergunta</label>
                <input value={draft.question} onChange={(e) => setDraft((p) => ({ ...p, question: e.target.value }))} placeholder="Pergunta frequente" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Resposta</label>
                <textarea value={draft.answer} onChange={(e) => setDraft((p) => ({ ...p, answer: e.target.value }))} placeholder="Resposta" rows={4} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none" />
              </div>
            </div>

            <div className="flex justify-end gap-2 p-5 border-t border-slate-200">
              <button onClick={closeModal} className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer">Cancelar</button>
              <button onClick={save} disabled={!draft.question} className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 disabled:opacity-40 cursor-pointer">
                {editingId ? 'Guardar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
