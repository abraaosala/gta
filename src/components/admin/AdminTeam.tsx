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
import { Plus, Pencil, Trash2, RotateCcw, X, Upload, Globe, Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { useToast } from '../../lib/toast.tsx';

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
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Erro ao enviar foto'); }
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
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Erro ao guardar membro'); }
  };

  const remove = async (id: string) => {
    try { await adminDeleteTeam(id); setItems((p) => p.filter((i) => i.id !== id)); toast.success('Membro eliminado'); } catch (e) { toast.error(e instanceof Error ? e.message : 'Erro ao eliminar membro'); }
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

      {items.length === 0 ? (
        <div className="text-center py-12 text-sm text-slate-400">Nenhum membro encontrado.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col items-center text-center">
              {item.photoUrl ? (
                <img src={item.photoUrl} alt={item.name} className="w-20 h-20 rounded-full object-cover mb-3" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-slate-100 mb-3 flex items-center justify-center text-slate-300">
                  <span className="text-2xl font-bold">{item.name.charAt(0)}</span>
                </div>
              )}
              <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
              <p className="text-[11px] text-slate-400 font-mono uppercase mt-0.5">{item.role || '—'}</p>
              {item.bio && <p className="text-xs text-slate-500 mt-2 line-clamp-2">{item.bio}</p>}
              {Object.values(item.socialLinks).some(Boolean) && (
                <div className="flex gap-2 mt-3">
                  {item.socialLinks.facebook && <a href={item.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-blue-600"><Facebook className="w-3.5 h-3.5" /></a>}
                  {item.socialLinks.instagram && <a href={item.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-pink-600"><Instagram className="w-3.5 h-3.5" /></a>}
                  {item.socialLinks.linkedin && <a href={item.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-blue-700"><Linkedin className="w-3.5 h-3.5" /></a>}
                  {item.socialLinks.whatsapp && <a href={`https://wa.me/${item.socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-emerald-600"><MessageCircle className="w-3.5 h-3.5" /></a>}
                </div>
              )}
              <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100 w-full justify-center">
                <button onClick={() => openEdit(item)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-blue-100 hover:text-blue-600 transition-colors cursor-pointer">
                  <Pencil className="w-3 h-3" /> Editar
                </button>
                <button onClick={() => remove(item.id)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer">
                  <Trash2 className="w-3 h-3" /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
