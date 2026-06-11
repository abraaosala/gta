/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import {
  adminFetchUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  adminChangePassword,
} from '../../lib/api.ts';
import type { AdminUser } from '../../lib/api.ts';
import { Plus, Pencil, Trash2, RotateCcw, KeyRound } from 'lucide-react';
import { useToast } from '../../lib/toast.tsx';
import Pagination from './Pagination.tsx';

type PasswordForm = { userId: string; current: string; newPwd: string };

export default function AdminUsers() {
  const toast = useToast();
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, from: null as number | null, to: null as number | null });

  const [draft, setDraft] = useState({ username: '', password: '', role: 'admin', display_name: '' });

  const load = useCallback((p: number) => {
    setLoading(true);
    adminFetchUsers(p).then((res) => { setItems(res.data); setPagination(res); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  const setField = (id: string, field: keyof AdminUser, value: unknown) =>
    setItems((p) => p.map((u) => (u.id === id ? { ...u, [field]: value } : u)));

  const add = async () => {
    try {
      const created = await adminCreateUser(draft);
      setItems((p) => [...p, created]);
      setCreating(false);
      setDraft({ username: '', password: '', role: 'admin', display_name: '' });
      toast.success('Utilizador criado');
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Erro ao criar utilizador'); }
  };

  const update = async (id: string) => {
    const u = items.find((i) => i.id === id);
    if (!u) return;
    try {
      const updated = await adminUpdateUser(id, { username: u.username, role: u.role, display_name: u.display_name ?? undefined, active: u.active });
      setItems((p) => p.map((i) => (i.id === id ? updated : i)));
      setEditing(null);
      toast.success('Utilizador actualizado');
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Erro ao actualizar utilizador'); }
  };

  const remove = async (id: string) => {
    try { await adminDeleteUser(id); setItems((p) => p.filter((i) => i.id !== id)); toast.success('Utilizador eliminado'); } catch (e) { toast.error(e instanceof Error ? e.message : 'Erro ao eliminar utilizador'); }
  };

  const changePassword = async () => {
    if (!passwordForm) return;
    try {
      await adminChangePassword(passwordForm.current, passwordForm.newPwd);
      setPasswordForm(null);
      toast.success('Password alterada com sucesso');
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Erro ao alterar password'); }
  };

  if (loading) return <div className="text-sm text-slate-400">A carregar...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold font-display text-slate-900">Utilizadores</h2>
        <div className="flex gap-2">
          <button onClick={() => load(page)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"><RotateCcw className="w-3.5 h-3.5" /></button>
          <button onClick={() => setCreating(true)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 cursor-pointer"><Plus className="w-3.5 h-3.5" /> Novo</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <th className="px-4 py-3 font-semibold">Utilizador</th>
              <th className="px-4 py-3 font-semibold">Função</th>
              <th className="px-4 py-3 font-semibold">Nome</th>
              <th className="px-4 py-3 font-semibold">Activo</th>
              <th className="px-4 py-3 font-semibold">Último Login</th>
              <th className="px-4 py-3 font-semibold">Acções</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {items.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                {editing === u.id ? (
                  <>
                    <td className="px-4 py-3.5">
                      <input value={u.username} onChange={(e) => setField(u.id, 'username', e.target.value)} className="w-full px-2 py-1 rounded border border-slate-200 text-sm" />
                    </td>
                    <td className="px-4 py-3.5">
                      <select value={u.role} onChange={(e) => setField(u.id, 'role', e.target.value)} className="px-2 py-1 rounded border border-slate-200 text-sm">
                        <option value="admin">admin</option>
                        <option value="superadmin">superadmin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3.5">
                      <input value={u.display_name ?? ''} onChange={(e) => setField(u.id, 'display_name', e.target.value)} className="w-full px-2 py-1 rounded border border-slate-200 text-sm" />
                    </td>
                    <td className="px-4 py-3.5">
                      <input type="checkbox" checked={u.active} onChange={(e) => setField(u.id, 'active', e.target.checked)} className="cursor-pointer" />
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('pt-PT') : '—'}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1">
                        <button onClick={() => update(u.id)} className="px-2 py-1 text-xs font-bold text-white bg-green-600 rounded-lg hover:bg-green-500 cursor-pointer">Guardar</button>
                        <button onClick={() => setEditing(null)} className="px-2 py-1 text-xs font-bold text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer">Cancelar</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3.5 font-medium">{u.username}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{u.display_name || '—'}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-block w-2 h-2 rounded-full ${u.active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('pt-PT') : '—'}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1">
                        <button onClick={() => setEditing(u.id)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setPasswordForm({ userId: u.id, current: '', newPwd: '' })} className="p-2 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 cursor-pointer"><KeyRound className="w-3.5 h-3.5" /></button>
                        <button onClick={() => remove(u.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} from={pagination.from} to={pagination.to} onPageChange={setPage} />

      {/* Create user form */}
      {creating && (
        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Novo Utilizador</h3>
          <div className="grid grid-cols-2 gap-3">
            <input value={draft.username} onChange={(e) => setDraft((p) => ({ ...p, username: e.target.value }))} placeholder="Username" className="px-3 py-2 rounded-lg border border-slate-200 text-sm" />
            <input value={draft.display_name} onChange={(e) => setDraft((p) => ({ ...p, display_name: e.target.value }))} placeholder="Nome de exibição" className="px-3 py-2 rounded-lg border border-slate-200 text-sm" />
            <input type="password" value={draft.password} onChange={(e) => setDraft((p) => ({ ...p, password: e.target.value }))} placeholder="Password (min 6)" className="px-3 py-2 rounded-lg border border-slate-200 text-sm" />
            <select value={draft.role} onChange={(e) => setDraft((p) => ({ ...p, role: e.target.value }))} className="px-3 py-2 rounded-lg border border-slate-200 text-sm">
              <option value="admin">admin</option>
              <option value="superadmin">superadmin</option>
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={add} disabled={!draft.username || draft.password.length < 6} className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 disabled:opacity-40 cursor-pointer">Criar</button>
            <button onClick={() => setCreating(false)} className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer">Cancelar</button>
          </div>
        </div>
      )}

      {/* Change password modal */}
      {passwordForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setPasswordForm(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold font-display text-slate-900 mb-4">Alterar Password</h3>
            <div className="space-y-3">
              <input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm((p) => p ? { ...p, current: e.target.value } : null)} placeholder="Password actual" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
              <input type="password" value={passwordForm.newPwd} onChange={(e) => setPasswordForm((p) => p ? { ...p, newPwd: e.target.value } : null)} placeholder="Nova password (min 6)" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={changePassword} disabled={!passwordForm.current || passwordForm.newPwd.length < 6} className="px-4 py-2 text-xs font-bold text-white bg-amber-600 rounded-xl hover:bg-amber-500 disabled:opacity-40 cursor-pointer"><KeyRound className="w-3.5 h-3.5 inline mr-1" />Alterar</button>
              <button onClick={() => setPasswordForm(null)} className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
