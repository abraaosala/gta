/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface SectionDividerProps {
  /** Cor de fundo da secção acima — o preenchimento da onda. */
  from: string;
  /** Intensidade da ondulação. */
  variant?: 'soft' | 'strong';
  /** Espelha a onda horizontalmente. */
  flip?: boolean;
}

const paths = {
  soft: 'M0,32 C240,66 480,-6 720,26 C960,58 1200,10 1440,32 L1440,64 L0,64 Z',
  strong: 'M0,60 C200,118 400,22 600,70 C820,112 980,30 1160,58 C1300,76 1380,48 1440,66 L1440,120 L0,120 Z',
} as const;

const heights = {
  soft: 'h-8 sm:h-12 lg:h-14',
  strong: 'h-14 sm:h-20 lg:h-24',
} as const;

/** Margem negativa para a onda assentar sobre o padding inferior da secção
 *  de cima, preservando o ritmo vertical (ex.: `py-20`) sem inflar o espaço. */
const overhang = {
  soft: '-mb-8 sm:-mb-12 lg:-mb-14',
  strong: '-mb-14 sm:-mb-20 lg:-mb-24',
} as const;

export default function SectionDivider({ from, variant = 'soft', flip = false }: SectionDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden leading-none ${overhang[variant]} ${flip ? '-scale-x-100' : ''}`}
    >
      <svg
        viewBox={variant === 'strong' ? '0 0 1440 120' : '0 0 1440 64'}
        preserveAspectRatio="none"
        className={`block w-full ${heights[variant]}`}
      >
        <path d={paths[variant]} fill={from} />
      </svg>
    </div>
  );
}