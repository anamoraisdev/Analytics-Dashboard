# Pulse

Dashboard de analytics para uma empresa fictícia — projeto de portfólio construído para demonstrar habilidades de frontend (Next.js/TypeScript/React) para vagas de estágio/júnior.

O objetivo não é apenas "fazer funcionar", mas se aproximar da arquitetura e do acabamento de um produto SaaS real (referência: Vercel Analytics, Linear, Stripe Dashboard) — Server Components de verdade, dados assíncronos com loading/erro genuínos, design system consistente e testes automatizados.

## Stack

- **Next.js 16** (App Router, React Server Components, Turbopack)
- **TypeScript** (strict)
- **Tailwind CSS v4** (tokens via `@theme`, sem `tailwind.config.js`)
- **Recharts** para os gráficos
- **Vitest + Testing Library** para testes
- **ESLint** (config oficial do Next.js)
- Componentes de UI gerados via **shadcn/ui**, sobre primitivas **Base UI** (headless, acessíveis), totalmente re-tematizados com os tokens do produto — ver [Design system](#design-system-e-decisões) abaixo.

## Rodando o projeto

```bash
npm install
npm run dev        # http://localhost:3000
```

Outros scripts:

```bash
npm run build       # build de produção
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run test          # Vitest (uma vez)
npm run test:watch    # Vitest em watch mode
npm run test:coverage # Vitest com relatório de cobertura
npm run generate:fixtures # regenera o JSON de transações fake
```

## Não há backend — e isso é proposital

Não existe API real por trás do Pulse. Toda a camada de dados (`src/lib/api`) é uma **fake API**:

- **Transações vêm de um JSON de verdade** (`src/lib/api/mock-db/data/transactions.json`, ~750 registros): não é gerado do zero a cada request nem existe só em memória — é um arquivo estático, versionado no repo, que dá pra abrir e editar diretamente. Cada registro guarda `daysAgo` (dias atrás), não uma data absoluta, então o conjunto de dados sempre parece atual, não importa quando alguém abrir o projeto. Ele é produzido por `scripts/generate-fixtures.mjs` — rode `npm run generate:fixtures` para regenerar com outra "forma" de dados.
- **Receita é derivada das próprias transações** (`generate-revenue-series.ts` soma os valores com status `completed` por dia): o gráfico de receita e a tabela nunca contam uma história diferente uma da outra.
- **Usuários (novos/ativos)** continuam gerados de forma procedural e determinística por seed (`src/lib/api/prng.ts`) — não há uma noção de "usuário" ligada a cada transação no fixture, então essa série simula crescimento de forma independente, mas sempre igual para o mesmo período.
- **Filtro de período de verdade**: trocar 7d/30d/90d/personalizado recorta esse mesmo conjunto de dados por data — mudar o filtro muda os números porque é uma janela diferente dos mesmos dados, não uma nova rodada de aleatoriedade.
- **Latência artificial** (`src/lib/api/fake-api.ts`, 350–1200ms dependendo da seção): existe para que os *skeletons* sejam demonstrados de verdade, e não markup morto que ninguém nunca vê.
- **Simulação de erro sob demanda**: o botão de alerta (⚠️) no header escreve `?__fail=<secao>` na URL, forçando a próxima busca daquela seção a rejeitar — dá para ver o estado de erro e o fluxo de retry sem precisar de devtools.

Trocar por uma API real no futuro significa reescrever apenas `src/lib/api/get-*.ts` — o resto da aplicação (componentes, tipos, testes) não muda.

## Arquitetura

- **Server Components por padrão.** `app/page.tsx` e `app/transactions/page.tsx` leem `searchParams` e cada seção (cards de métricas, gráfico de receita, gráfico de usuários, tabela de transações) é **um Server Component assíncrono independente**, dentro do seu próprio `<Suspense>` + `<DashboardErrorBoundary>`. Isso dá streaming real por seção — cada uma resolve e falha isoladamente, em vez de um loading/erro único para a página inteira.
- **Filtros no URL, não em estado local.** O período (`?period=`, `&from=`, `&to=`) é gerenciado com [`nuqs`](https://nuqs.dev), não Context/Zustand — é shareável, funciona com o botão voltar do navegador, e o Server Component já nasce filtrado (sem *waterfall* client→server).
- **Busca e paginação da tabela ficam no client.** O servidor já filtrou por período; ordenar/paginar/buscar em algumas centenas de linhas é instantâneo no navegador e não justifica um round-trip por tecla digitada.
- **Client Components só onde precisa:** gráficos (Recharts exige `'use client'`), sidebar/header/menus (estado local, Base UI), formulários. Tudo o resto — cards, badges, skeletons, empty states — é Server.

Mais detalhes de cada decisão estão comentados no topo dos arquivos relevantes (`app/page.tsx`, `lib/utils/date-range.ts`, `lib/api/fake-api.ts`).

## Design system e decisões

- **Paleta e dark mode**: tokens definidos como CSS variables em `src/app/globals.css` (`--brand`, `--series-1/2`, `--status-good/warning/serious/critical`, etc.), com os dois blocos de dark mode (`prefers-color-scheme` + `[data-theme]`) para o toggle manual (`next-themes`) coexistir com a preferência do sistema.
- **Tipografia**: Inter via `next/font/google` (self-hosted, sem layout shift).
- **Gráficos**: Recharts, escolhido em vez de bibliotecas "prontas" de dashboard (como Tremor) justamente para que o design system continue sendo autoral — Recharts é baixo nível o suficiente para ser 100% temável com os tokens acima.
- **Sobre os componentes em `src/components/ui`**: são gerados pelo CLI do **shadcn/ui**, que copia primitivas headless e acessíveis do **Base UI** (foco, teclado, ARIA já resolvidos) diretamente para o repositório — não é uma dependência de runtime de design system de terceiros. O código vive aqui e foi inteiramente re-tematizado com a paleta do Pulse; é sobre essa base que os componentes de produto (`components/dashboard`, `components/transactions`, `components/layout`) foram construídos.

## Estrutura de pastas

```
src/
├── app/                    # Rotas (dashboard, transações), layout, error/loading/not-found
├── components/
│   ├── ui/                  # Design system genérico (Button, Card, Badge, Dialog...)
│   ├── layout/               # Sidebar, Header, drawer mobile, theme toggle
│   ├── dashboard/             # Cards de métrica, gráficos, filtro de período
│   ├── transactions/           # Tabela de transações (busca/ordenação/paginação/CSV)
│   └── states/                 # Skeletons, EmptyState, ErrorState, error boundary
├── hooks/                  # use-table-sort, use-table-pagination, use-debounced-value...
├── lib/
│   ├── api/                  # Fake API: latência, erro simulado, geradores seedados
│   └── utils/                 # Formatação (moeda/data/número), lógica de período
└── types/                  # Modelo de dados (Metric, Transaction, TimeSeries...)
```

## Testes

Vitest + Testing Library, priorizando o que o dashboard realmente arrisca quebrar (não cobertura de 100%):

1. **Lógica pura**: `date-range.ts` (cálculo do período anterior para o delta% — maior risco de bug do projeto), formatadores de moeda/número/porcentagem, geradores mock (determinismo).
2. **Hooks**: ordenação, paginação (auto-correção ao filtrar), debounce.
3. **Componentes**: os 4 estados pedidos no briefing — `EmptyState`, `ErrorState`, `MetricCard` (delta positivo/negativo/"Novo"), `TransactionStatusBadge` (mapeamento exaustivo), `TransactionsTable` (busca → vazio, ordenação, paginação), `PeriodFilter` (escreve na URL via `nuqs`), `Sidebar` (item ativo).

Fora de escopo deliberadamente: internals do Recharts, regressão visual (próximo passo natural seria Playwright/Chromatic), 100% de cobertura.

CI (`.github/workflows/ci.yml`) roda lint + typecheck + test + build em cada push/PR para `main`.
