/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import type { BrandItem } from '../../types.ts';
import {
  adminFetchBrands,
  adminCreateBrand,
  adminUpdateBrand,
  adminDeleteBrand,
} from '../../lib/api.ts';
import { Plus, Pencil, Trash2, RotateCcw, X } from 'lucide-react';
import { useToast } from '../../lib/toast.tsx';
import Pagination from './Pagination.tsx';


const empty = (): BrandItem => ({ id: crypto.randomUUID(), name: '', logoType: 'smartphone' });

export default function AdminBrands() {
  const toast = useToast();
  const [items, setItems] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<BrandItem>(empty());
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, from: null as number | null, to: null as number | null });

  const load = useCallback((p: number) => {
    setLoading(true);
    adminFetchBrands(p).then((res) => { setItems(res.data); setPagination(res); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  const openCreate = () => { setDraft(empty()); setEditingId(null); setModalOpen(true); };
  const openEdit = (item: BrandItem) => { setDraft({ ...item }); setEditingId(item.id); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingId(null); };

  const save = async () => {
    try {
      if (editingId) {
        const updated = await adminUpdateBrand(editingId, draft);
        setItems((p) => p.map((i) => (i.id === editingId ? updated : i)));
        toast.success('Marca actualizada');
      } else {
        const created = await adminCreateBrand(draft);
        setItems((p) => [...p, created]);
        toast.success('Marca criada');
      }
      closeModal();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Erro ao guardar marca'); }
  };

  const remove = async (id: string) => {
    try { await adminDeleteBrand(id); setItems((p) => p.filter((i) => i.id !== id)); toast.success('Marca eliminada'); } catch (e) { toast.error(e instanceof Error ? e.message : 'Erro ao eliminar marca'); }
  };

  if (loading) return <div className="text-sm text-slate-400">A carregar...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold font-display text-slate-900">Marcas</h2>
        <div className="flex gap-2">
          <button onClick={() => { localStorage.removeItem('gta_admin_brands'); window.location.reload(); }} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"><RotateCcw className="w-3.5 h-3.5" /></button>
          <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 cursor-pointer"><Plus className="w-3.5 h-3.5" /> Novo</button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-sm text-slate-400">Nenhuma marca encontrada.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-base font-bold text-slate-600 shrink-0">{item.name[0]}</span>
                <span className="text-sm font-bold text-slate-900 truncate">{item.name}</span>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => remove(item.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} from={pagination.from} to={pagination.to} onPageChange={setPage} />

      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-sm font-bold font-display text-slate-900">
                {editingId ? 'Editar Marca' : 'Nova Marca'}
              </h3>
              <button onClick={closeModal} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Nome</label>
                <input value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} placeholder="Nome da marca" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
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
