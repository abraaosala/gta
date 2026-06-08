/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import type { TeamMember } from '../../types.ts';
import {
  adminFetchTeam,
  adminCreateTeam,
  adminUpdateTeam,
  adminDeleteTeam,
  adminUploadImage,
} from '../../lib/api.ts';
import { Plus, Pencil, Trash2, RotateCcw, X, Upload } from 'lucide-react';
import { useToast } from '../../lib/toast.tsx';
import DataTable from './DataTable.tsx';

const empty = (): TeamMember => ({
  id: crypto.randomUUID(),
  name: '',
  role: '',
  photoUrl: '',
  bio: '',
  socialLinks: {},
});

export default function AdminTeam() {
  const toast = useToast();
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TeamMember>(empty());
  const [uploading, setUploading] = useState(false);

  useEffect(() => { adminFetchTeam().then(setItems).catch(() => {}).finally(() => setLoading(false)); }, []);

  const openCreate = () => { setDraft(empty()); setEditingId(null); setModalOpen(true); };
  const openEdit = (item: TeamMember) => { setDraft({ ...item, socialLinks: { ...item.socialLinks } }); setEditingId(item.id); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingId(null); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await adminUploadImage(file);
      setDraft((p) => ({ ...p, photoUrl: url }));
      toast.success('Foto enviada');
    } catch { toast.error('Erro ao enviar foto'); }
    setUploading(false);
  };

  const save = async () => {
    try {
      if (editingId) {
        const updated = await adminUpdateTeam(editingId, draft);
        setItems((p) => p.map((i) => (i.id === editingId ? updated : i)));
        toast.success('Membro actualizado');
      } else {
        const created = await adminCreateTeam(draft);
        setItems((p) => [...p, created]);
        toast.success('Membro criado');
      }
      closeModal();
    } catch { toast.error('Erro ao guardar membro'); }
  };

  const remove = async (id: string) => {
    try { await adminDeleteTeam(id); setItems((p) => p.filter((i) => i.id !== id)); toast.success('Membro eliminado'); } catch { toast.error('Erro ao eliminar membro'); }
  };

  const updateSocial = (key: string, value: string) => {
    setDraft((p) => ({ ...p, socialLinks: { ...p.socialLinks, [key]: value } }));
  };

  if (loading) return <div className="text-sm text-slate-400">A carregar...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold font-display text-slate-900">Equipa</h2>
        <div className="flex gap-2">
          <button onClick={() => { window.location.reload(); }} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"><RotateCcw className="w-3.5 h-3.5" /></button>
          <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 cursor-pointer"><Plus className="w-3.5 h-3.5" /> Novo</button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'photo', label: 'Foto', render: (i) => i.photoUrl ? <img src={i.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-slate-100" /> },
          { key: 'name', label: 'Nome', render: (i) => <span className="font-medium">{i.name}</span> },
          { key: 'role', label: 'Cargo', render: (i) => <span className="text-xs text-slate-500">{i.role || '—'}</span> },
          { key: 'bio', label: 'Bio', render: (i) => <span className="text-xs text-slate-500 max-w-[200px] truncate block">{i.bio || '—'}</span> },
          { key: 'actions', label: 'Acções', sortable: false, className: 'w-24', render: (i) => (
            <div className="flex gap-1">
              <button onClick={() => openEdit(i)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => remove(i.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )},
        ]}
        data={items}
        keyExtractor={(i) => i.id}
        emptyMessage="Nenhum membro encontrado."
      />

      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-sm font-bold font-display text-slate-900">
                {editingId ? 'Editar Membro' : 'Novo Membro'}
              </h3>
              <button onClick={closeModal} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Nome</label>
                <input value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} placeholder="Nome do membro" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Cargo</label>
                <input value={draft.role} onChange={(e) => setDraft((p) => ({ ...p, role: e.target.value }))} placeholder="Ex: Técnico Sénior" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Foto</label>
                <div className="flex items-center gap-3">
                  {draft.photoUrl && <img src={draft.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />}
                  <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    {uploading ? 'A enviar...' : 'Upload'}
                    <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">URL da Foto</label>
                <input value={draft.photoUrl} onChange={(e) => setDraft((p) => ({ ...p, photoUrl: e.target.value }))} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Biografia</label>
                <textarea value={draft.bio} onChange={(e) => setDraft((p) => ({ ...p, bio: e.target.value }))} placeholder="Breve descrição do membro" rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none" />
              </div>
              <div className="border-t border-slate-100 pt-4">
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-3">Redes Sociais</label>
                <div className="space-y-3">
                  <input value={draft.socialLinks.facebook || ''} onChange={(e) => updateSocial('facebook', e.target.value)} placeholder="Facebook URL" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                  <input value={draft.socialLinks.instagram || ''} onChange={(e) => updateSocial('instagram', e.target.value)} placeholder="Instagram URL" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                  <input value={draft.socialLinks.linkedin || ''} onChange={(e) => updateSocial('linkedin', e.target.value)} placeholder="LinkedIn URL" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                  <input value={draft.socialLinks.whatsapp || ''} onChange={(e) => updateSocial('whatsapp', e.target.value)} placeholder="WhatsApp (número)" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                </div>
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
