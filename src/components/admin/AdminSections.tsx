/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { RotateCcw, Eye, EyeOff } from 'lucide-react';
import { adminFetchSettings, adminUpdateSettings } from '../../lib/api.ts';
import { useToast } from '../../lib/toast.tsx';
import {
  SECTION_IDS,
  SECTION_LABELS,
  parseVisibility,
  serializeVisibility,
  type SectionVisibility,
} from '../../lib/sections.ts';

export default function AdminSections() {
  const toast = useToast();
  const [vis, setVis] = useState<SectionVisibility | null>(null);
  const [allSettings, setAllSettings] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetchSettings()
      .then((s) => {
        setAllSettings(s);
        setVis(parseVisibility(s.sections_visible));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string) => {
    if (!vis) return;
    setVis((prev) => prev ? { ...prev, [id]: !prev[id as keyof SectionVisibility] } : prev);
  };

  const save = async () => {
    if (!vis || !allSettings) return;
    setSaving(true);
    try {
      await adminUpdateSettings({ ...allSettings, sections_visible: serializeVisibility(vis) });
      toast.success('Visibilidade guardada');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-sm text-slate-400">A carregar...</div>;
  if (!vis) return <div className="text-sm text-red-400">Erro ao carregar configurações.</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold font-display text-slate-900">Visibilidade das Secções</h2>
        <div className="flex items-center gap-3">
          {saving && <span className="text-xs text-amber-600 font-mono">A guardar...</span>}
          <button
            onClick={() => { window.location.reload(); }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Recarregar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {SECTION_IDS.map((id) => {
          const meta = SECTION_LABELS[id];
          const visible = vis[id];
          return (
            <div key={id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-slate-900">{meta.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{meta.desc}</p>
              </div>
              <button
                onClick={() => toggle(id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 cursor-pointer ${
                  visible ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    visible ? 'translate-x-[22px]' : 'translate-x-[2px]'
                  }`}
                >
                  {visible ? <Eye className="w-3 h-3 text-blue-600" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 disabled:opacity-40 transition-colors cursor-pointer"
        >
          {saving ? 'A guardar...' : 'Guardar Alterações'}
        </button>
      </div>
    </div>
  );
}
