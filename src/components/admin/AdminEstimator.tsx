import { useState, useEffect, useCallback } from 'react';
import type { AdminEstimatorDevice, AdminEstimatorIssue } from '../../types.ts';
import {
  adminFetchEstimatorDevices,
  adminCreateEstimatorDevice,
  adminUpdateEstimatorDevice,
  adminDeleteEstimatorDevice,
  adminFetchEstimatorIssues,
  adminCreateEstimatorIssue,
  adminUpdateEstimatorIssue,
  adminDeleteEstimatorIssue,
} from '../../lib/api.ts';
import { Plus, Pencil, Trash2, RotateCcw, X, Smartphone } from 'lucide-react';
import { useToast } from '../../lib/toast.tsx';
import DataTable from './DataTable.tsx';
import Pagination from './Pagination.tsx';

const emptyDevice = (): AdminEstimatorDevice => ({ id: '', name: '', icon: 'Smartphone', base_price: 0 });
const emptyIssue = (): AdminEstimatorIssue => ({ id: '', device_id: '', name: '', base_price: null, estimated_time: null, price_multiplier: 1, local_price: 0 });

type Tab = 'devices' | 'issues';

export default function AdminEstimator() {
  const toast = useToast();
  const [tab, setTab] = useState<Tab>('devices');

  // ── Devices state ──
  const [devices, setDevices] = useState<AdminEstimatorDevice[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(true);
  const [devicePage, setDevicePage] = useState(1);
  const [devicePagination, setDevicePagination] = useState({ current_page: 1, last_page: 1, total: 0, from: null as number | null, to: null as number | null });
  const [deviceModal, setDeviceModal] = useState(false);
  const [deviceEditing, setDeviceEditing] = useState<string | null>(null);
  const [deviceDraft, setDeviceDraft] = useState<AdminEstimatorDevice>(emptyDevice());
  const [issueMultiplier, setIssueMultiplier] = useState(1);

  // ── Issues state ──
  const [issues, setIssues] = useState<AdminEstimatorIssue[]>([]);
  const [issuesLoading, setIssuesLoading] = useState(true);
  const [issuePage, setIssuePage] = useState(1);
  const [issuePagination, setIssuePagination] = useState({ current_page: 1, last_page: 1, total: 0, from: null as number | null, to: null as number | null });
  const [issueModal, setIssueModal] = useState(false);
  const [issueEditing, setIssueEditing] = useState<string | null>(null);
  const [issueDraft, setIssueDraft] = useState<AdminEstimatorIssue>(emptyIssue());
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  // ── Load devices ──
  const loadDevices = useCallback((p: number) => {
    setDevicesLoading(true);
    adminFetchEstimatorDevices(p).then((res) => { setDevices(res.data); setDevicePagination(res); }).catch(() => {}).finally(() => setDevicesLoading(false));
  }, []);

  useEffect(() => { loadDevices(devicePage); }, [devicePage, loadDevices]);

  // ── Load issues ──
  const loadIssues = useCallback((p: number, deviceId: string) => {
    setIssuesLoading(true);
    adminFetchEstimatorIssues(p, deviceId || undefined).then((res) => { setIssues(res.data); setIssuePagination(res); }).catch(() => {}).finally(() => setIssuesLoading(false));
  }, []);

  useEffect(() => { loadIssues(issuePage, selectedDeviceId); }, [issuePage, selectedDeviceId, loadIssues]);

  // ── Device CRUD ──
  const openDeviceCreate = () => { setDeviceDraft(emptyDevice()); setDeviceEditing(null); setDeviceModal(true); };
  const openDeviceEdit = (item: AdminEstimatorDevice) => { setDeviceDraft({ ...item }); setDeviceEditing(item.id); setDeviceModal(true); };
  const closeDeviceModal = () => { setDeviceModal(false); setDeviceEditing(null); };

  const saveDevice = async () => {
    try {
      if (deviceEditing) {
        const updated = await adminUpdateEstimatorDevice(deviceEditing, deviceDraft);
        setDevices((p) => p.map((i) => (i.id === deviceEditing ? updated : i)));
        toast.success('Dispositivo actualizado');
      } else {
        const created = await adminCreateEstimatorDevice(deviceDraft);
        setDevices((p) => [...p, created]);
        toast.success('Dispositivo criado');
      }
      closeDeviceModal();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Erro ao guardar dispositivo'); }
  };

  const removeDevice = async (id: string) => {
    try { await adminDeleteEstimatorDevice(id); setDevices((p) => p.filter((i) => i.id !== id)); toast.success('Dispositivo eliminado'); } catch (e) { toast.error(e instanceof Error ? e.message : 'Erro ao eliminar dispositivo'); }
  };

  // ── Issue CRUD ──
  const openIssueCreate = () => { setIssueDraft({ ...emptyIssue(), device_id: selectedDeviceId }); setIssueEditing(null); setIssueModal(true); };
  const openIssueEdit = (item: AdminEstimatorIssue) => { setIssueDraft({ ...item }); setIssueEditing(item.id); setIssueModal(true); };
  const closeIssueModal = () => { setIssueModal(false); setIssueEditing(null); };

  const saveIssue = async () => {
    try {
      const payload = { ...issueDraft, device_id: selectedDeviceId || issueDraft.device_id };
      if (issueEditing) {
        const updated = await adminUpdateEstimatorIssue(issueEditing, payload);
        setIssues((p) => p.map((i) => (i.id === issueEditing ? updated : i)));
        toast.success('Problema actualizado');
      } else {
        const created = await adminCreateEstimatorIssue(payload);
        setIssues((p) => [...p, created]);
        toast.success('Problema criado');
      }
      closeIssueModal();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Erro ao guardar problema'); }
  };

  const removeIssue = async (id: string) => {
    try { await adminDeleteEstimatorIssue(id); setIssues((p) => p.filter((i) => i.id !== id)); toast.success('Problema eliminado'); } catch (e) { toast.error(e instanceof Error ? e.message : 'Erro ao eliminar problema'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold font-display text-slate-900">Estimador</h2>
        <div className="flex gap-2">
          <button onClick={() => { window.location.reload(); }} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"><RotateCcw className="w-3.5 h-3.5" /></button>
          {tab === 'devices' && (
            <button onClick={openDeviceCreate} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 cursor-pointer"><Plus className="w-3.5 h-3.5" /> Novo Dispositivo</button>
          )}
          {tab === 'issues' && selectedDeviceId && (
            <button onClick={openIssueCreate} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 cursor-pointer"><Plus className="w-3.5 h-3.5" /> Novo Problema</button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        <button onClick={() => setTab('devices')} className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-colors ${tab === 'devices' ? 'bg-blue-600 text-white' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'}`}>Dispositivos</button>
        <button onClick={() => setTab('issues')} className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-colors ${tab === 'issues' ? 'bg-blue-600 text-white' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'}`}>Problemas</button>
      </div>

      {/* ── Devices Tab ── */}
      {tab === 'devices' && (
        <>
          {devicesLoading ? (
            <div className="text-sm text-slate-400">A carregar...</div>
          ) : devices.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-400">Nenhum dispositivo encontrado.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{item.name}</h3>
                      <p className="text-[11px] text-slate-400 font-mono uppercase mt-0.5">{item.icon}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                    <span className="text-base font-bold text-slate-900">{Number(item.base_price).toLocaleString('pt')} Kz</span>
                    <div className="flex gap-1">
                      <button onClick={() => openDeviceEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => removeDevice(item.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Pagination page={devicePagination.current_page} lastPage={devicePagination.last_page} total={devicePagination.total} from={devicePagination.from} to={devicePagination.to} onPageChange={setDevicePage} />

          {/* Device Modal */}
          {deviceModal && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={closeDeviceModal}>
              <div className="bg-white rounded-2xl max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-slate-200">
                  <h3 className="text-sm font-bold font-display text-slate-900">{deviceEditing ? 'Editar Dispositivo' : 'Novo Dispositivo'}</h3>
                  <button onClick={closeDeviceModal} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Nome</label>
                    <input value={deviceDraft.name} onChange={(e) => setDeviceDraft((p) => ({ ...p, name: e.target.value }))} placeholder="Ex: iPhone" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Ícone</label>
                    <input value={deviceDraft.icon} onChange={(e) => setDeviceDraft((p) => ({ ...p, icon: e.target.value }))} placeholder="Smartphone" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Preço Base (Kz)</label>
                    <input type="number" value={deviceDraft.base_price} onChange={(e) => { const v = Number(e.target.value); setDeviceDraft((p) => ({ ...p, base_price: v })); }} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 p-5 border-t border-slate-200">
                  <button onClick={closeDeviceModal} className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer">Cancelar</button>
                  <button onClick={saveDevice} disabled={!deviceDraft.name} className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 disabled:opacity-40 cursor-pointer">
                    {deviceEditing ? 'Guardar' : 'Criar'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Issues Tab ── */}
      {tab === 'issues' && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <label className="text-[10px] font-bold text-slate-400 font-mono uppercase shrink-0">Dispositivo</label>
            <select
              value={selectedDeviceId}
              onChange={(e) => { setSelectedDeviceId(e.target.value); setIssuePage(1); }}
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm flex-1 max-w-xs"
            >
              <option value="">Todos os dispositivos</option>
              {devices.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {issuesLoading ? (
            <div className="text-sm text-slate-400">A carregar...</div>
          ) : issues.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-400">Nenhum problema encontrado.</div>
          ) : (
            <DataTable
              columns={[
                { key: 'name', label: 'Problema', render: (i) => <span className="font-medium">{i.name}</span> },
                { key: 'local_price', label: 'Preço Local', render: (i) => <span className="font-mono text-xs">{Number(i.local_price ?? i.base_price).toLocaleString('pt')} Kz</span> },
                { key: 'estimated_time', label: 'Tempo Est.', render: (i) => <span className="text-xs text-slate-500">{i.estimated_time || '—'}</span> },
                { key: 'actions', label: 'Acções', sortable: false, render: (i) => (
                  <div className="flex gap-1">
                    <button onClick={() => openIssueEdit(i)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => removeIssue(i.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                )},
              ]}
              data={issues}
              keyExtractor={(i) => i.id}
              emptyMessage="Nenhum problema encontrado."
            />
          )}

          <Pagination page={issuePagination.current_page} lastPage={issuePagination.last_page} total={issuePagination.total} from={issuePagination.from} to={issuePagination.to} onPageChange={setIssuePage} />

          {/* Issue Modal */}
          {issueModal && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={closeIssueModal}>
              <div className="bg-white rounded-2xl max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-slate-200">
                  <h3 className="text-sm font-bold font-display text-slate-900">{issueEditing ? 'Editar Problema' : 'Novo Problema'}</h3>
                  <button onClick={closeIssueModal} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Dispositivo</label>
                    <select value={issueDraft.device_id} onChange={(e) => setIssueDraft((p) => ({ ...p, device_id: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                      <option value="">Seleccionar dispositivo</option>
                      {devices.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Nome do Problema</label>
                    <input value={issueDraft.name} onChange={(e) => setIssueDraft((p) => ({ ...p, name: e.target.value }))} placeholder="Ex: Troca de Ecrã" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Preço (Kz)</label>
                      <input type="number" value={issueDraft.base_price ?? ''} onChange={(e) => setIssueDraft((p) => ({ ...p, base_price: e.target.value ? Number(e.target.value) : null }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Multiplicador</label>
                      <input type="number" step="0.1" min="0" value={issueDraft.price_multiplier} onChange={(e) => setIssueDraft((p) => ({ ...p, price_multiplier: Number(e.target.value) || 1 }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                    </div>
                  </div>
                  {issueDraft.device_id && (() => {
                    const selectedDevice = devices.find((d) => d.id === issueDraft.device_id);
                    const deviceBasePrice = selectedDevice ? Number(selectedDevice.base_price) : 0;
                    const marketPrice = issueDraft.base_price || (deviceBasePrice * issueDraft.price_multiplier);
                    return (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 font-mono uppercase mb-1">Preço de Mercado</p>
                        <p className="text-lg font-bold text-slate-900">{marketPrice.toLocaleString('pt')} Kz</p>
                        {!issueDraft.base_price && (
                          <p className="text-[10px] text-slate-400 mt-1">{deviceBasePrice.toLocaleString('pt')} Kz (base) × {issueDraft.price_multiplier}</p>
                        )}
                      </div>
                    );
                  })()}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase mb-1.5">Tempo Estimado</label>
                    <input value={issueDraft.estimated_time ?? ''} onChange={(e) => setIssueDraft((p) => ({ ...p, estimated_time: e.target.value || null }))} placeholder="Ex: 45 minutos" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 p-5 border-t border-slate-200">
                  <button onClick={closeIssueModal} className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer">Cancelar</button>
                  <button onClick={saveIssue} disabled={!issueDraft.name || !issueDraft.device_id} className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 disabled:opacity-40 cursor-pointer">
                    {issueEditing ? 'Guardar' : 'Criar'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
