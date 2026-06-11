/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { adminFetchInfo, adminUpdateInfo } from '../../lib/api.ts';
import type { BusinessInfo } from '../../lib/data-store.ts';
import { useData } from '../../contexts/DataContext.tsx';
import { RotateCcw, Check, Loader } from 'lucide-react';
import { useToast } from '../../lib/toast.tsx';
import FileUpload from './FileUpload.tsx';

const SAVE_DEBOUNCE_MS = 1500;

export default function AdminInfo() {
  const toast = useToast();
  const { refresh, updateBusinessInfo } = useData();
  const [form, setForm] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    adminFetchInfo()
      .then((info) => { if (mounted.current) setForm(info); })
      .catch(() => {})
      .finally(() => { if (mounted.current) setLoading(false); });
    return () => { mounted.current = false; };
  }, []);

  const doSave = useCallback(async (data: BusinessInfo) => {
    setSaving(true);
    try {
      await adminUpdateInfo(data);
      if (mounted.current) {
        setLastSaved(new Date());
        refresh();
      }
    } catch (e) {
      if (mounted.current) toast.error(e instanceof Error ? e.message : 'Erro ao guardar');
    } finally {
      if (mounted.current) setSaving(false);
    }
  }, [toast, refresh]);

  const scheduleSave = useCallback((data: BusinessInfo) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => doSave(data), SAVE_DEBOUNCE_MS);
  }, [doSave]);

  const updateField = (key: keyof BusinessInfo, value: string) => {
    if (!form) return;
    const next = { ...form, [key]: value };
    setForm(next);
    updateBusinessInfo({ [key]: value });
    scheduleSave(next);
  };

  const fields: { label: string; key: keyof BusinessInfo }[] = [
    { label: 'Nome da Empresa', key: 'name' },
    { label: 'Telefone', key: 'phone' },
    { label: 'WhatsApp (só números)', key: 'whatsapp' },
    { label: 'Email', key: 'email' },
    { label: 'Endereço', key: 'address' },
    { label: 'Horário', key: 'hours' },
    { label: 'Descrição', key: 'description' },
    { label: 'Slogan', key: 'slogan' },
    { label: 'Cidade', key: 'city' },
  ];

  if (loading) return <div className="text-sm text-slate-400">A carregar...</div>;
  if (!form) return <div className="text-sm text-red-400">Erro ao carregar informações.</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold font-display text-slate-900">Informações da Empresa</h2>
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          {saving ? (
            <span className="flex items-center gap-1.5 text-xs text-amber-600 font-mono">
              <Loader className="w-3 h-3 animate-spin" /> A guardar...
            </span>
          ) : lastSaved ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono">
              <Check className="w-3 h-3" /> Guardado
            </span>
          ) : null}
          <button onClick={() => { window.location.reload(); }} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" /> Recarregar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Logo upload */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-3">Logo da Empresa</label>
            <FileUpload value={form.logoUrl} onUpload={(url: string) => updateField('logoUrl', url)} />
          </div>

          {/* Favicon upload */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-3">Favicon</label>
            <FileUpload value={form.faviconUrl} onUpload={(url: string) => updateField('faviconUrl', url)} />
          </div>
        </div>

        {/* Form fields */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="space-y-4">
              {fields.map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">{label}</label>
                  <input
                    type="text"
                    value={form[key] || ''}
                    onChange={(e) => updateField(key, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
