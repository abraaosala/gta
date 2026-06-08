/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {createContext, useContext, useState, useCallback, type ReactNode} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {CheckCircle, AlertCircle, X} from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({children}: {children: ReactNode}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((type: 'success' | 'error', message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, {id, type, message}]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const remove = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{success: (msg) => add('success', msg), error: (msg) => add('error', msg)}}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{opacity: 0, x: 80, scale: 0.95}}
              animate={{opacity: 1, x: 0, scale: 1}}
              exit={{opacity: 0, x: 80, scale: 0.95}}
              transition={{type: 'spring', stiffness: 400, damping: 30}}
              className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm max-w-sm ${
                t.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {t.type === 'success' ? (
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
              )}
              <span className="flex-1 text-xs leading-relaxed">{t.message}</span>
              <button
                onClick={() => remove(t.id)}
                className="shrink-0 p-0.5 rounded hover:bg-black/5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5 opacity-60" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
