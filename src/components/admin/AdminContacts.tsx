/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { adminFetchContacts, adminDeleteContact } from '../../lib/api.ts';
import type { AdminContact } from '../../lib/api.ts';
import { Trash2, RotateCcw, Mail, Phone, Calendar } from 'lucide-react';
import { useToast } from '../../lib/toast.tsx';
import DataTable from './DataTable.tsx';
import type { Column } from './DataTable.tsx';

export default function AdminContacts() {
  const toast = useToast();
  const [items, setItems] = useState<AdminContact[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    adminFetchContacts().then(setItems).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    try { await adminDeleteContact(id); setItems((p) => p.filter((i) => i.id !== id)); toast.success('Contacto eliminado'); } catch { toast.error('Erro ao eliminar contacto'); }
  };

  if (loading) return <div className="text-sm text-slate-400">A carregar...</div>;

  if (items.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold font-display text-slate-900">Contactos</h2>
          <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"><RotateCcw className="w-3.5 h-3.5" /> Actualizar</button>
        </div>
        <p className="text-sm text-slate-400">Nenhum contacto recebido.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold font-display text-slate-900">Contactos ({items.length})</h2>
        <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"><RotateCcw className="w-3.5 h-3.5" /> Actualizar</button>
      </div>

      <DataTable
        columns={[
          { key: 'name', label: 'Nome', render: (c) => <span className="font-medium">{c.name}</span> },
          { key: 'email', label: 'Email', render: (c) => <span className="flex items-center gap-1 text-slate-400"><Mail className="w-3 h-3" />{c.email || '—'}</span> },
          { key: 'phone', label: 'Telemóvel', render: (c) => <span className="flex items-center gap-1 text-slate-400"><Phone className="w-3 h-3" />{c.phone || '—'}</span> },
          { key: 'message', label: 'Mensagem', render: (c) => <span className="text-slate-500 max-w-[200px] truncate block">{c.message}</span> },
          { key: 'createdAt', label: 'Data', render: (c) => <span className="flex items-center gap-1 text-xs text-slate-400"><Calendar className="w-3 h-3" />{new Date(c.createdAt).toLocaleDateString('pt-PT')}</span> },
          { key: 'actions', label: 'Acções', sortable: false, className: 'w-16', render: (c) => (
            <button onClick={() => remove(c.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
          )},
        ]}
        data={items}
        keyExtractor={(c) => c.id}
        emptyMessage="Nenhum contacto encontrado."
      />
    </div>
  );
}
