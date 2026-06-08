/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import type { ProductItem } from '../../types.ts';
import {
  adminFetchProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminUploadImage,
} from '../../lib/api.ts';
import { Plus, Pencil, Trash2, RotateCcw, X, Upload } from 'lucide-react';
import { useToast } from '../../lib/toast.tsx';
import DataTable from './DataTable.tsx';
import type { Column } from './DataTable.tsx';

const empty = (): ProductItem => ({
  id: crypto.randomUUID(),
  name: '',
  category: 'smartphones',
  price: 0,
  iconName: 'Smartphone',
  imageUrl: '',
  description: '',
  specs: [''],
  inStock: true,
  condition: 'Recondicionado Grade A+',
});

export default function AdminProducts() {
  const toast = useToast();
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProductItem>(empty());

  useEffect(() => {
    adminFetchProducts().then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setDraft(empty());
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (item: ProductItem) => {
    setDraft({ ...item, specs: item.specs?.length ? [...item.specs] : [''] });
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
        const updated = await adminUpdateProduct(editingId, draft);
        setItems((prev) => prev.map((i) => (i.id === editingId ? updated : i)));
        toast.success('Produto actualizado');
      } else {
        const created = await adminCreateProduct(draft);
        setItems((prev) => [...prev, created]);
        toast.success('Produto criado');
      }
      closeModal();
    } catch { toast.error('Erro ao guardar produto'); }
  };

  const remove = async (id: string) => {
    try {
      await adminDeleteProduct(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success('Produto eliminado');
    } catch { toast.error('Erro ao eliminar produto'); }
  };

  const setDraftField = <K extends keyof ProductItem>(field: K, value: ProductItem[K]) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <div className="text-sm text-slate-400">A carregar...</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold font-display text-slate-900">Produtos</h2>
        <div className="flex gap-2">
          <button onClick={() => { localStorage.removeItem('gta_admin_products'); window.location.reload(); }} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Novo
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'image', label: 'Imagem', sortable: false, render: (i) => <img src={i.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" /> },
          { key: 'name', label: 'Nome', render: (i) => <span className="font-medium">{i.name}</span> },
          { key: 'category', label: 'Categoria', render: (i) => <span className="text-xs capitalize text-slate-400">{i.category}</span> },
          { key: 'price', label: 'Preço', render: (i) => <span className="font-medium">{i.price.toLocaleString('pt')} Kz</span> },
          { key: 'inStock', label: 'Stock', render: (i) => (
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${i.inStock ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-100'}`}>
              {i.inStock ? 'Em stock' : 'Indisponível'}
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
        emptyMessage="Nenhum produto encontrado."
      />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-sm font-bold font-display text-slate-900">
                {editingId ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <button onClick={closeModal} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Nome</label>
                <input value={draft.name} onChange={(e) => setDraftField('name', e.target.value)} placeholder="Nome do produto" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Descrição</label>
                <textarea value={draft.description} onChange={(e) => setDraftField('description', e.target.value)} placeholder="Descrição" rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Preço (Kz)</label>
                  <input value={draft.price} type="number" onChange={(e) => setDraftField('price', Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Categoria</label>
                    <select value={draft.category} onChange={(e) => setDraftField('category', e.target.value as ProductItem['category'])} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                      <option value="smartphones">Smartphones</option>
                      <option value="tablets">Tablets</option>
                      <option value="laptops">Laptops</option>
                      <option value="wearables">Wearables</option>
                      <option value="accessories">Acessórios</option>
                    </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">URL da Imagem</label>
                <div className="flex gap-2">
                  <input value={draft.imageUrl} onChange={(e) => setDraftField('imageUrl', e.target.value)} placeholder="https://..." className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                  <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const url = await adminUploadImage(file);
                        setDraftField('imageUrl', url);
                        toast.success('Imagem enviada');
                      } catch { toast.error('Erro ao fazer upload'); }
                    }} />
                  </label>
                </div>
                {draft.imageUrl && (
                  <img src={draft.imageUrl} alt="" className="mt-2 w-24 h-24 rounded-lg object-cover bg-slate-100 border border-slate-200" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Condição</label>
                <select value={draft.condition} onChange={(e) => setDraftField('condition', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                  <option value="Novo">Novo</option>
                  <option value="Recondicionado Grade A+">Recondicionado Grade A+</option>
                  <option value="Recondicionado Grade A">Recondicionado Grade A</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="inStock" checked={draft.inStock} onChange={(e) => setDraftField('inStock', e.target.checked)} className="cursor-pointer" />
                <label htmlFor="inStock" className="text-xs text-slate-600 cursor-pointer">Em stock</label>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Especificações (uma por linha)</label>
                <textarea value={draft.specs?.join('\n') || ''} onChange={(e) => setDraftField('specs', e.target.value.split('\n').filter(Boolean))} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none" />
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
