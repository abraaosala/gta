# GTA-Tech Landing Page

Landing page da **GTA-Tech** — assistência técnica de smartphones e computadores em Cabinda, Angola.

## Stack

- React 19 + TypeScript 5.8
- Vite 6 + Tailwind CSS 4
- `motion` (framer-motion) — animações
- `lucide-react` — ícones
- `react-helmet-async` — gestão de meta tags
- `@google/genai` — integração Gemini AI

## Funcionalidades

- Hero carrossel com imagens e texto por slide
- Grid de serviços com âncora para o orçamentador
- Loja de equipamentos recondicionados com modal de detalhes
- Orçamentador interactivo online
- Testemunhos, FAQ, formulário de contacto
- Scroll-reveal animations em todas as secções

## Como correr

```bash
npm install
cp .env.example .env   # definir GEMINI_API_KEY
npm run dev             # http://localhost:3000
```

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server em http://localhost:3000 |
| `npm run build` | Build para produção |
| `npm run lint` | Type-check (`tsc --noEmit`) |

## Deploy

SPA React estática — compatível com Vercel, Netlify, Cloudflare Pages.
