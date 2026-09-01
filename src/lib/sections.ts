/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const SECTION_IDS = [
  'hero',
  'brands',
  'services',
  'salesStore',
  'features',
  'process',
  'estimator',
  'testimonials',
  'faq',
  'team',
  'gallery',
  'aboutContact',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type SectionVisibility = Record<SectionId, boolean>;

export const SECTION_LABELS: Record<SectionId, { label: string; desc: string }> = {
  hero: { label: 'Hero', desc: 'Banner principal com destaque' },
  brands: { label: 'Marcas', desc: 'Slider de marcas suportadas' },
  services: { label: 'Serviços', desc: 'Grid de serviços com orçamento' },
  salesStore: { label: 'Vendas', desc: 'Catálogo de produtos recondicionados' },
  features: { label: 'Porquê Nós', desc: 'Diferenciais competitivos' },
  process: { label: 'Processo', desc: 'Fluxo de 4 etapas do serviço' },
  estimator: { label: 'Orçamento Rápido', desc: 'Calculadora interactiva de preços' },
  testimonials: { label: 'Depoimentos', desc: 'Avaliações de clientes' },
  faq: { label: 'FAQ', desc: 'Perguntas frequentes em accordion' },
  team: { label: 'Equipa', desc: 'Grid de membros da equipa' },
  gallery: { label: 'Galeria', desc: 'Fotos do laboratório e antes/depois' },
  aboutContact: { label: 'Contacto', desc: 'Sobre nós + formulário de contacto' },
};

export function parseVisibility(val: string | undefined): SectionVisibility {
  const vis: SectionVisibility = {} as SectionVisibility;
  for (const id of SECTION_IDS) vis[id] = true;
  if (!val) return vis;
  try {
    const parsed = JSON.parse(val) as Partial<SectionVisibility>;
    for (const id of SECTION_IDS) {
      if (typeof parsed[id] === 'boolean') vis[id] = parsed[id];
    }
  } catch { /* ignore */ }
  return vis;
}

export function serializeVisibility(v: SectionVisibility): string {
  return JSON.stringify(v);
}

export const DEFAULT_VISIBILITY_JSON = serializeVisibility(
  Object.fromEntries(SECTION_IDS.map((id) => [id, true])) as SectionVisibility,
);

/**
 * Cor de fundo de cada secção. Centralizada aqui para que os divisores entre
 * secções sejam derivados destes valores (evita hex hardcoded e ondas órfãs).
 * `null` significa "sem fundo próprio" (ex.: Hero usa imagem/overlay branco).
 */
export const SECTION_BG: Record<SectionId, string | null> = {
  hero: null,
  brands: '#ffffff',
  services: '#ffffff',
  salesStore: '#f8fafc',
  features: '#ffffff',
  process: '#f8fafc',
  estimator: '#f8fafc',
  testimonials: '#f8fafc',
  faq: '#ffffff',
  team: '#f8fafc',
  gallery: '#ffffff',
  aboutContact: '#f8fafc',
};

/**
 * Cor de origem do divisor entre duas secções consecutivas: é a cor da secção
 * de cima. Devolve `null` quando não deve haver divisor — quando as secções
 * partilham a mesma cor de fundo (não há transição para marcar) ou quando
 * qualquer uma das secções de fronteira não tem cor própria.
 */
export function dividerFrom(
  above: SectionId,
  below: SectionId,
  visibility: SectionVisibility,
): string | null {
  if (!visibility[above] || !visibility[below]) return null;
  const from = SECTION_BG[above];
  const to = SECTION_BG[below];
  if (from == null || to == null || from === to) return null;
  return from;
}
