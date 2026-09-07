/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ReactNode } from 'react';

const BADGE_CLASS =
  'inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase text-blue-700 bg-blue-50 border border-blue-200/80 shadow-xs';
const TITLE_CLASS = 'text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display mt-4 tracking-tight text-slate-900 leading-tight';

const layoutClasses = {
  center: 'text-center max-w-3xl mx-auto mb-16',
  left: 'text-left',
  split: 'flex flex-col md:flex-row md:items-end md:justify-between mb-12',
} as const;

const descriptionClasses = {
  center: 'text-slate-600 mt-4 text-base sm:text-lg leading-relaxed',
  left: 'text-slate-600 mt-4 text-sm sm:text-base leading-relaxed',
  split: 'mt-3 text-sm sm:text-base text-slate-600 leading-relaxed',
} as const;

type SectionHeaderAlign = keyof typeof layoutClasses;

interface SectionHeaderProps {
  badge: string;
  title: string;
  description?: string;
  align?: SectionHeaderAlign;
  actions?: ReactNode;
  className?: string;
}

export default function SectionHeader({
  badge,
  title,
  description,
  align = 'center',
  actions,
  className = '',
}: SectionHeaderProps) {
  const wrapperClass = `${layoutClasses[align]} ${className}`.trim();

  if (align === 'split' && actions) {
    return (
      <div className={wrapperClass}>
        <div className="text-left max-w-2xl">
          <span className={BADGE_CLASS}>{badge}</span>
          <h2 className={TITLE_CLASS}>{title}</h2>
          {description && <p className={descriptionClasses.split}>{description}</p>}
        </div>
        <div className="mt-4 md:mt-0 shrink-0">{actions}</div>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <span className={BADGE_CLASS}>{badge}</span>
      <h2 className={TITLE_CLASS}>{title}</h2>
      {description && <p className={descriptionClasses[align]}>{description}</p>}
    </div>
  );
}