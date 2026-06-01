/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServiceItem, BrandItem, SupportStep, TestimonialItem, FAQItem, EstimatorDevice, ProductItem } from './types.ts';

export const BUSINESS_INFO = {
  name: 'GTA-Tech',
  slogan: 'Assistência Técnica de Smartphones & Computadores',
  description: 'Somos especialistas na reparação premium de dispositivos móveis e computadores em Cabinda. Garantimos reparos rápidos com peças originais e garantia certificada.',
  phone: '+244 923 125 487',
  whatsapp: '244923125487',
  email: 'geral@gtatech.ao',
  address: 'Rua do Comércio, Edifício Mandarim, R/C - Cabinda, Angola',
  hours: 'Segunda a Sábado: 08:00 - 18:00',
  city: 'Cabinda, Angola',
};

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'ecras',
    title: 'Reparação de Ecrãs',
    iconName: 'Smartphone',
    description: 'Substituição de ecrãs partidos, falhas no touch screen ou manchas no display com calibração integral de cores.',
    features: ['Peças originais ou alta gama equiparável', 'Calibração de brilho e TrueTone original', 'Garantia de 90 dias contra defeito de fabrico'],
    priceRange: 'A partir de 18.000 Kz',
    avgTime: '45 minutos',
  },
  {
    id: 'baterias',
    title: 'Substituição de Baterias',
    iconName: 'BatteryCharging',
    description: 'Bateria descarrega rápido ou telemóvel desliga sozinho? Trocamos por baterias com ciclos zerados e chip de segurança.',
    features: ['Baterias com homologação CE e alta densidade', 'Exibição da saúde de bateria no sistema', 'Elimina aquecimentos indesejados'],
    priceRange: 'A partir de 12.000 Kz',
    avgTime: '30 minutos',
  },
  {
    id: 'placas',
    title: 'Reparação de Placa Mãe',
    iconName: 'Cpu',
    description: 'Microsoldadura avançada, diagnóstico de curto-circuito, recuperação de danos por água e reparos integrados.',
    features: ['Especialistas certificados em microeletrónica', 'Equipamento de laboratório de alta precisão', 'Recuperação de dados críticos inclusa'],
    priceRange: 'Sob orçamento',
    avgTime: '24 - 48 horas',
  },
  {
    id: 'conetores',
    title: 'Manutenção de Conetores & Portas',
    iconName: 'Plug',
    description: 'Substituição de portas de carregamento USB-C, Lightning, tomadas de auscultadores e grelhas de áudio.',
    features: ['Substituição do flex de carga completo', 'Limpeza interna de poeiras grátis', 'Testes de corrente elétrica e voltagem'],
    priceRange: 'A partir de 8.000 Kz',
    avgTime: '40 minutos',
  },
  {
    id: 'computadores',
    title: 'Assistência de Computadores & Mac',
    iconName: 'Laptop',
    description: 'Formatação, substituição de teclado, reparos na carcaça e dobradiças, re-aplicação de massa térmica e upgrades.',
    features: ['Troca de disco HDD para SSD Ultra Rápido', 'Limpeza física profunda e substituição de ventoinhas', 'Otimização de sistema Windows / macOS'],
    priceRange: 'A partir de 15.000 Kz',
    avgTime: '1 - 3 horas',
  },
  {
    id: 'software',
    title: 'Recuperação & Backup de Dados',
    iconName: 'CloudLightning',
    description: 'Dispositivo bloqueado no loop do logótipo? Recuperamos os seus dados, fazemos backups e reinstalações completas.',
    features: ['Recuperação segura sem perda de fotos', 'Resolução de erros de boot e atualizações mal-sucedidas', 'Aconselhamento sobre backups automáticos'],
    priceRange: 'A partir de 10.000 Kz',
    avgTime: '1 a 2 horas',
  },
];

export const BRANDS_LIST: BrandItem[] = [
  { id: 'apple', name: 'Apple', logoType: 'apple' },
  { id: 'samsung', name: 'Samsung', logoType: 'samsung' },
  { id: 'xiaomi', name: 'Xiaomi', logoType: 'xiaomi' },
  { id: 'huawei', name: 'Huawei', logoType: 'huawei' },
  { id: 'infinix', name: 'Infinix', logoType: 'infinix' },
  { id: 'hp', name: 'HP', logoType: 'hp' },
  { id: 'dell', name: 'Dell', logoType: 'dell' },
  { id: 'lenovo', name: 'Lenovo', logoType: 'lenovo' },
  { id: 'asus', name: 'Asus', logoType: 'asus' },
];

export const PROCESS_STEPS: SupportStep[] = [
  {
    step: 1,
    title: 'Entrada & Diagnóstico',
    description: 'Análise minuciosa gratuita do seu dispositivo em laboratório para detetar a origem exata do problema.',
    badge: 'Grátis & Rápido',
  },
  {
    step: 2,
    title: 'Orçamento Transparente',
    description: 'Apresentamos-lhe o custo final e os prazos antes de avançarmos. Só reparamos com a sua aprovação total.',
    badge: 'Preço Fechado',
  },
  {
    step: 3,
    title: 'Reparação Especializada',
    description: 'Técnicos certificados operam o seu dispositivo em bancadas ESD e substituem peças com ferramentas calibradas.',
    badge: 'Técnicas Premium',
  },
  {
    step: 4,
    title: 'Garantia & Entrega',
    description: 'Efetuamos mais de 15 testes de qualidade pós-reparo e entregamos o equipamento com garantia escrita de 90 dias.',
    badge: 'Garantia Total',
  },
];

export const TESTIMONIALS_LIST: TestimonialItem[] = [
  {
    id: 't1',
    name: 'Abraão Kiala',
    deviceRepaired: 'iPhone 13 Pro Max (Substituição de Vidro e Bateria)',
    comment: 'Serviço cinco estrelas! O meu iPhone ficou como novo em menos de uma hora. Atendimento super cordial e o diagnóstico foi feito à minha frente. Recomendo imenso a GTA-Tech em Cabinda.',
    rating: 5,
    date: 'Há 2 semanas',
  },
  {
    id: 't2',
    name: 'Elizabete Neves',
    deviceRepaired: 'HP Pavilion 15 (Upgrade SSD e Limpeza de Cooler)',
    comment: 'O meu computador estava lentíssimo e a aquecer muito. Depois de irem à GTA-Tech, agora inicia em 5 segundos e está super silencioso. Preço excelente e técnicos muito transparentes.',
    rating: 5,
    date: 'Há 1 mês',
  },
  {
    id: 't3',
    name: 'Domingos Chimpene',
    deviceRepaired: 'Samsung Galaxy S22 Ultra (Reparação de Placa / Conetor)',
    comment: 'Eles resolveram uma falha na placa principal que em outras casas disseram que não tinha reparo. O processo de estimativa de preço foi super exato e cumpriram o prazo à risca.',
    rating: 5,
    date: 'Há 3 dias',
  },
];

export const FAQS_LIST: FAQItem[] = [
  {
    id: 'f1',
    question: 'Quanto tempo demora em média uma reparação?',
    answer: 'Reparos comuns como ecrãs e baterias levam de 30 a 60 minutos. Já as intervenções mais complexas na placa ou reparação de portáteis levam entre 2 e 24 horas, consoante o trabalho.',
  },
  {
    id: 'f2',
    question: 'Vocês dão garantia dos serviços efetuados?',
    answer: 'Sim, absolutamente! Todas as nossas reparações têm uma garantia certificada de 90 dias (3 meses), cobrindo qualquer defeito de fabrico das peças substituídas.',
  },
  {
    id: 'f3',
    question: 'O diagnóstico do meu dispositivo tem algum custo?',
    answer: 'Na GTA-Tech o diagnóstico é totalmente gratuito. Abrimos e diagnosticamos o telemóvel ou computador gratuitamente e só paga se der autorização para avançar com a reparação.',
  },
  {
    id: 'f4',
    question: 'As peças utilizadas são originais?',
    answer: 'Utilizamos peças originais para a maioria das marcas. Nos casos em que o fabricante não fornece peças diretamente, recorremos a fornecedores com certificação de Alta Gama (Grade A+), garantindo o mesmo brilho, cores e longevidade.',
  },
];

// Rich datasets for interactive calculator which provides actual estimative and removes fake text
export const ESTIMATOR_DEVICES: EstimatorDevice[] = [
  {
    id: 'smartphone',
    label: 'Smartphones / Telemóveis',
    brands: ['Apple (iPhone)', 'Samsung', 'Xiaomi', 'Huawei', 'Infinix', 'Outra'],
    issues: [
      { id: 'screen_broken', label: 'Ecrã Partida / Sem Imagem', basePrice: 22000, estimatedTime: '45 min' },
      { id: 'battery_dead', label: 'Bateria Viciada / Descarrega Rápido', basePrice: 12500, estimatedTime: '30 min' },
      { id: 'charging_port', label: 'Não Carrega / Porta Solta', basePrice: 8500, estimatedTime: '40 min' },
      { id: 'water_damage', label: 'Molhado / Danos por Líquidos', basePrice: 19000, estimatedTime: '24 horas' },
      { id: 'motherboard_dead', label: 'Não Liga / Curto-circuito na Placa', basePrice: 32000, estimatedTime: '48 horas' },
      { id: 'cameras', label: 'Câmara Traz / Frente sem Foco', basePrice: 15000, estimatedTime: '1 hora' },
    ],
  },
  {
    id: 'laptop',
    label: 'Computadores Portáteis',
    brands: ['HP', 'Dell', 'Lenovo', 'Apple (MacBook)', 'Asus', 'Outra'],
    issues: [
      { id: 'formatting_os', label: 'Limpeza, Formatação e Instalação de OS', basePrice: 15000, estimatedTime: '2 horas' },
      { id: 'ssd_upgrade', label: 'Instaurar SSD Rápido de 256GB/512GB', basePrice: 28000, estimatedTime: '1 a 2 horas' },
      { id: 'screen_comp', label: 'Ecrã do Portátil Partida / Listas', basePrice: 48000, estimatedTime: '1 dia' },
      { id: 'keyboard_broken', label: 'Teclado Não Escreve ou Letras Soltas', basePrice: 18500, estimatedTime: '2 horas' },
      { id: 'overheating_noise', label: 'Acolhimento de Ventoinha / Pasta Térmica Nova', basePrice: 12000, estimatedTime: '1 hora' },
    ],
  },
  {
    id: 'tablet',
    label: 'Tablets / iPads',
    brands: ['Apple (iPad)', 'Samsung Galaxy Tab', 'Xiaomi Pad', 'Outra'],
    issues: [
      { id: 'screen_tablet', label: 'Ecrã de Vidro Partida / Display', basePrice: 26000, estimatedTime: '1 hora' },
      { id: 'battery_tablet', label: 'Bateria Inchada / Pouco Tempo Carga', basePrice: 16000, estimatedTime: '1 hora' },
      { id: 'repair_usb_tab', label: 'Porta USB / Conector Carga', basePrice: 9000, estimatedTime: '45 min' },
    ],
  },
];

export const PRODUCTS_LIST: ProductItem[] = [
  {
    id: 'p1',
    name: 'iPhone 12 Pro Max 256GB',
    category: 'smartphones',
    price: 320000,
    originalPrice: 350000,
    iconName: 'Smartphone',
    imageUrl: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600&auto=format&fit=crop&q=80',
    description: 'Bateria a 100%, sem marcas de uso. Inclui todos os acessórios de carga rápida e garantia de 90 dias.',
    condition: 'Recondicionado Grade A+',
    inStock: true,
    specs: ['Super Retina XDR de 6.7"', 'Processador A14 Bionic', 'Tripla Câmara Pro 12MP', 'Face ID & Proteção IP68'],
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S22 Ultra 5G',
    category: 'smartphones',
    price: 380000,
    originalPrice: 410000,
    iconName: 'Smartphone',
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    description: 'Ecrã 120Hz dinâmico, excelente vida útil da bateria de alto rendimento. Inclui S-Pen original integrada.',
    condition: 'Recondicionado Grade A+',
    inStock: true,
    specs: ['Ecrã Dynamic AMOLED 2X', 'Processador Exynos 2200', 'Super Câmara Zoom 108MP', 'Carregamento Ultra Rápido'],
  },
  {
    id: 'p3',
    name: 'HP EliteBook 840 G6 Slim i5',
    category: 'laptops',
    price: 295000,
    originalPrice: 330000,
    iconName: 'Laptop',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
    description: 'Ideal para escritório, negócios e universidade. Corpo de alumínio, extremamente veloz.',
    condition: 'Recondicionado Grade A',
    inStock: true,
    specs: ['Core i5 de 8ª Geração', '16GB RAM Integrada', '512GB NVMe SSD Ultra Rápido', 'Ecrã 14" Full HD Antirreflexo'],
  },
  {
    id: 'p4',
    name: 'Carregador Ultra Rápido 20W USB-C',
    category: 'accessories',
    price: 8500,
    iconName: 'Plug',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    description: 'Carregador de parede certificado Power Delivery 20W. Carregamento ultra seguro e inteligente para qualquer modelo.',
    condition: 'Novo',
    inStock: true,
    specs: ['Certificado Power Delivery 3.0', 'Tensão Inteligente Auto-ajustável', 'Alta Proteção Contra Picos'],
  },
  {
    id: 'p5',
    name: 'Power Bank Premium 15000mAh PD',
    category: 'accessories',
    price: 18000,
    originalPrice: 22000,
    iconName: 'BatteryCharging',
    imageUrl: 'https://images.unsplash.com/photo-1609592424365-385db49cf6fc?w=600&auto=format&fit=crop&q=80',
    description: 'Altamente portátil. Carrega até dois telemóveis em simultâneo com estabilização de voltagem automática.',
    condition: 'Novo',
    inStock: true,
    specs: ['Capacidade Real 15.000mAh', 'Indicador LED de Percentual', 'Duplo Slot USB & USB-C'],
  },
  {
    id: 'p6',
    name: 'Auscultadores Bluetooth TWS Premium',
    category: 'accessories',
    price: 14500,
    iconName: 'Smartphone',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    description: 'Som estéreo acústico excelente, com isolamento passivo profundo e microfone HD.',
    condition: 'Novo',
    inStock: true,
    specs: ['Conectividade Bluetooth 5.3', 'Autonomia de Bateria até 24h', 'Controlo por Toques Inteligente'],
  }
];
