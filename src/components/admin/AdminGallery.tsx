/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import type { GalleryItem } from '../../types.ts';
import {
  adminFetchGallery,
  adminCreateGallery,
  adminUpdateGallery,
  adminDeleteGallery,
} from '../../lib/api.ts';
import { Plus, Pencil, Trash2, RotateCcw, X } from 'lucide-react';
import FileUpload from './FileUpload.tsx';
import { useToast } from '../../lib/toast.tsx';
import Pagination from './Pagination.tsx';


const empty = (): GalleryItem => ({
  id: crypto.randomUUID(),
  title: '',
  category: 'oficina',
  imageUrl: '',
  description: '',
});

const categoryOptions = [
  { value: 'antes-depois', label: 'Antes & Depois' },
  { value: 'laboratorio', label: 'Laboratório' },
  { value: 'equipa', label: 'Equipa' },
  { value: 'oficina', label: 'Oficina' },
] as const;

export default function AdminGallery() {
  const toast = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<GalleryItem>(empty());
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, from: null as number | null, to: null as number | null });

  const load = useCallback((p: number) => {
    setLoading(true);
    adminFetchGallery(p).then((res) => { setItems(res.data); setPagination(res); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  const openCreate = () => { setDraft(empty()); setEditingId(null); setModalOpen(true); };
  const openEdit = (item: GalleryItem) => { setDraft({ ...item }); setEditingId(item.id); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingId(null); };

  const save = async () => {
    try {
      if (editingId) {
        const updated = await adminUpdateGallery(editingId, draft);
        setItems((p) => p.map((i) => (i.id === editingId ? updated : i)));
        toast.success('Imagem actualizada');
      } else {
        const created = await adminCreateGallery(draft);
        setItems((p) => [...p, created]);
        toast.success('Imagem criada');
      }
      closeModal();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Erro ao guardar imagem'); }
  };

  const remove = async (id: string) => {
    try { await adminDeleteGallery(id); setItems((p) => p.filter((i) => i.id !== id)); toast.success('Imagem eliminada'); } catch (e) { toast.error(e instanceof Error ? e.message : 'Erro ao eliminar imagem'); }
  };

  if (loading) return <div className="text-sm text-slate-400">A carregar...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold font-display text-slate-900">Galeria</h2>
        <div className="flex gap-2">
          <button onClick={() => { window.location.reload(); }} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"><RotateCcw className="w-3.5 h-3.5" /></button>
          <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 cursor-pointer"><Plus className="w-3.5 h-3.5" /> Nova</button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-sm text-slate-400">Nenhuma imagem encontrada.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="w-full h-36 rounded-xl object-cover mb-3" />
              ) : (
                <div className="w-full h-36 rounded-xl bg-slate-100 mb-3 flex items-center justify-center text-slate-300 text-sm">{item.title[0]}</div>
              )}
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  {categoryOptions.find((c) => c.value === item.category)?.label || item.category}
                </p>
                {item.description && (
                  <p className="text-xs text-slate-500 mt-1.5 truncate">{item.description}</p>
                )}
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                <button onClick={() => openEdit(item)} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-blue-100 hover:text-blue-600 transition-colors cursor-pointer">
                  <Pencil className="w-3 h-3" /> Editar
                </button>
                <button onClick={() => remove(item.id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer">
                  <Trash2 className="w-3 h-3" /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} from={pagination.from} to={pagination.to} onPageChange={setPage} />

      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-sm font-bold font-display text-slate-900">
                {editingId ? 'Editar Imagem' : 'Nova Imagem'}
              </h3>
              <button onClick={closeModal} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Título</label>
                <input value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} placeholder="Título da imagem" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Categoria</label>
                <select value={draft.category} onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value as GalleryItem['category'] }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Imagem</label>
                <FileUpload value={draft.imageUrl} onUpload={(url) => setDraft((p) => ({ ...p, imageUrl: url }))} showInput />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Descrição</label>
                <textarea value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} placeholder="Breve descrição" rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none" />
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
