/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {useState} from 'react';
import {Link, useNavigate} from '@tanstack/react-router';
import {Wrench, LogIn, ShieldAlert, Smartphone, Laptop, CircuitBoard} from 'lucide-react';
import {login} from '../lib/auth.ts';
import {useData} from '../contexts/DataContext.tsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const {businessInfo} = useData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await login(email, password);
    setSubmitting(false);

    if (result.ok) {
      navigate({to: '/admin'});
    } else {
      setError(result.error || 'Credenciais inválidas');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left sidebar — brand panel */}
      <div className="hidden lg:flex lg:w-[400px] xl:w-[440px] bg-slate-950 flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            {businessInfo.logoUrl ? (
              <img src={businessInfo.logoUrl} alt={businessInfo.name} className="w-10 h-10 rounded-xl object-cover shadow-lg" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/15">
                <Wrench className="w-5 h-5" />
              </div>
            )}
            <div>
              <span className="text-lg font-bold font-display text-white tracking-tight">{businessInfo.name}</span>
              <span className="block text-[9px] font-mono tracking-[0.15em] text-slate-500 uppercase">{businessInfo.city || 'Cabinda · Angola'}</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-display text-white tracking-tight">Área Administrativa</h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Aceda ao painel de gestão da GTA-Tech para acompanhar contactos, estatísticas e muito mais.
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <Smartphone className="w-5 h-5" />
            <Laptop className="w-5 h-5" />
            <CircuitBoard className="w-5 h-5" />
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-slate-600 font-mono">
          &copy; {new Date().getFullYear()} GTA-Tech
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            {businessInfo.logoUrl ? (
              <img src={businessInfo.logoUrl} alt={businessInfo.name} className="w-10 h-10 rounded-xl object-cover shadow-lg" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/15">
                <Wrench className="w-5 h-5" />
              </div>
            )}
            <span className="text-lg font-bold font-display text-slate-900">{businessInfo.name}</span>
          </div>

          <div className="mb-8">
            <h1 className="text-xl font-bold font-display text-slate-900">Entrar</h1>
            <p className="text-sm text-slate-400 mt-1">Insira as suas credenciais</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gtatech.ao"
                className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:outline-none transition-all"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {submitting ? 'A entrar...' : 'Entrar'}
            </button>

            <div className="text-center pt-1">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                Voltar ao site
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
