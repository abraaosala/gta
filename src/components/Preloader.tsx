/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, animate } from 'motion/react';

const MIN_VISIBLE_MS = 600;
const BAR_DURATION = 1.8;
const COMPLETE_DURATION = 0.35;

interface PreloaderProps {
  visible: boolean;
  businessName: string;
  onFinished: () => void;
}

export default function Preloader({ visible, businessName, onFinished }: PreloaderProps) {
  const reducedMotion = useReducedMotion();
  const mountRef = useRef(Date.now());
  const [progress, setProgress] = useState(0);

  // Animate bar 0% -> 90% while loading
  useEffect(() => {
    if (!visible) return;
    const controls = animate(0, 90, {
      duration: reducedMotion ? 0.3 : BAR_DURATION,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setProgress(v),
    });
    return () => controls.stop();
  }, [visible, reducedMotion]);

  // Completion sequence when loading finishes: wait minimum display time,
  // complete the bar to 100% and only then signal the overlay to unmount.
  useEffect(() => {
    if (visible) return;
    let cancelled = false;
    let t2: number | undefined;
    const elapsed = Date.now() - mountRef.current;
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
    const t1 = window.setTimeout(() => {
      if (cancelled) return;
      setProgress(100);
      t2 = window.setTimeout(() => {
        if (!cancelled) onFinished();
      }, reducedMotion ? 0 : COMPLETE_DURATION * 1000);
    }, wait);
    return () => {
      cancelled = true;
      clearTimeout(t1);
      if (t2) clearTimeout(t2);
    };
  }, [visible, onFinished, reducedMotion]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.3 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
    >
      <motion.img
        src="/preload.jpg"
        alt={businessName}
        initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.5, delay: 0.1, ease: 'easeOut' }}
        className="w-64 sm:w-80 object-contain"
      />

      <div
        className="mt-8 w-48 h-1 bg-slate-100 rounded-full overflow-hidden"
        role="progressbar"
        aria-label="Carregando"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
      </div>
    </motion.div>
  );
}