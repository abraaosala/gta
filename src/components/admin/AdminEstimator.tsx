/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import type { EstimatorDevice } from '../../types.ts';
import { fetchEstimator } from '../../lib/api.ts';
import { RotateCcw } from 'lucide-react';
import { useToast } from '../../lib/toast.tsx';
import DataTable from './DataTable.tsx';
import type { Column } from './DataTable.tsx';

interface FlatRow {
  id: string;
  deviceLabel: string;
  issueLabel: string;
  basePrice: number;
  estimatedTime: string;
}

export default function AdminEstimator() {
  const toast = useToast();
  const [items, setItems] = useState<EstimatorDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEstimator().then(setItems).catch(() => toast.error('Erro ao carregar estimador')).finally(() => setLoading(false));
  }, []);

  const flatRows: FlatRow[] = [];
  for (const device of items) {
    if (device.issues.length === 0) {
      flatRows.push({ id: `${device.id}-none`, deviceLabel: device.label, issueLabel: '— sem problemas configurados', basePrice: 0, estimatedTime: '' });
    } else {
      for (const issue of device.issues) {
        flatRows.push({ id: `${device.id}-${issue.id}`, deviceLabel: device.label, issueLabel: issue.label, basePrice: issue.basePrice, estimatedTime: issue.estimatedTime });
      }
    }
  }

  if (loading) return <div className="text-sm text-slate-400">A carregar...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold font-display text-slate-900">Estimador</h2>
        <button onClick={() => { localStorage.removeItem('gta_admin_estimator'); window.location.reload(); }} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"><RotateCcw className="w-3.5 h-3.5" /> Restaurar Padrões</button>
      </div>

      <DataTable
        columns={[
          { key: 'deviceLabel', label: 'Dispositivo', render: (i) => <span className="font-medium">{i.deviceLabel}</span> },
          { key: 'issueLabel', label: 'Problema', render: (i) => <span className="text-xs text-slate-500">{i.issueLabel}</span> },
          { key: 'basePrice', label: 'Preço Base', render: (i) => <span className="font-mono text-xs">{i.basePrice.toLocaleString('pt')} Kz</span> },
          { key: 'estimatedTime', label: 'Tempo Est.', render: (i) => <span className="text-xs text-slate-400">{i.estimatedTime}</span> },
        ]}
        data={flatRows}
        keyExtractor={(i) => i.id}
        emptyMessage="Nenhum dado no estimador."
      />

      <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <p className="text-xs text-slate-500">A gestão detalhada do estimador (marcas, problemas, preços) está disponível diretamente na base de dados.</p>
      </div>
    </div>
  );
}
