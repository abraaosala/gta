import { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Check, Loader, ExternalLink, Settings } from 'lucide-react';
import { adminFetchSettings, adminUpdateSettings } from '../../lib/api.ts';
import { useToast } from '../../lib/toast.tsx';

const SETTING_META: Record<string, { label: string; placeholder: string; icon?: string }> = {
  instagram_url: { label: 'Instagram', placeholder: 'https://instagram.com/...', icon: 'Instagram' },
  facebook_url: { label: 'Facebook', placeholder: 'https://facebook.com/...', icon: 'Facebook' },
  tiktok_url: { label: 'TikTok', placeholder: 'https://tiktok.com/@...', icon: 'Music2' },
};

export default function AdminSettings() {
  const toast = useToast();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    adminFetchSettings()
      .then(setSettings)
      .catch(() => toast.error('Erro ao carregar configurações'))
      .finally(() => setLoading(false));
  }, []);

  const updateKey = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const doSave = useCallback(async () => {
    setSaving(true);
    try {
      const updated = await adminUpdateSettings(settings);
      setSettings(updated);
      setLastSaved(new Date());
      setHasChanges(false);
      toast.success('Configurações guardadas');
    } catch {
      toast.error('Erro ao guardar');
    } finally {
      setSaving(false);
    }
  }, [settings, toast]);

  if (loading) return <div className="text-sm text-slate-400">A carregar...</div>;

  const keys = Object.keys(settings);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold font-display text-slate-900">Configurações</h2>
        <div className="flex items-center gap-3">
          {saving ? (
            <span className="flex items-center gap-1.5 text-xs text-amber-600 font-mono">
              <Loader className="w-3 h-3 animate-spin" /> A guardar...
            </span>
          ) : lastSaved ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono">
              <Check className="w-3 h-3" /> Guardado
            </span>
          ) : null}
          <button
            onClick={() => { window.location.reload(); }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Recarregar
          </button>
        </div>
      </div>

      {keys.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <Settings className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Nenhuma configuração disponível.</p>
          <p className="text-xs text-slate-400 mt-1">As configurações são criadas automaticamente no servidor.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="space-y-4">
            {keys.map((key) => {
              const meta = SETTING_META[key];
              return (
                <div key={key}>
                  <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">
                    {meta?.label || key.replace(/_/g, ' ')}
                    {settings[key] && (
                      <a
                        href={settings[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </label>
                  <input
                    type="text"
                    value={settings[key] || ''}
                    onChange={(e) => updateKey(key, e.target.value)}
                    placeholder={meta?.placeholder || key}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={doSave}
              disabled={!hasChanges || saving}
              className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold rounded-xl transition-colors cursor-pointer ${
                hasChanges
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
