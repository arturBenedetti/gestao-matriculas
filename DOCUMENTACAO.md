# Documentação — Matrículas na Região Sul

## Visão geral

Aplicação **desktop** (Electron) com interface gráfica para consultar dados agregados de matrículas em cursos de graduação na **Região Sul**, com persistência em **PostgreSQL** via **Prisma ORM**.

## Padrão arquitetural: MVVM

A organização modular deixa explícita a separação **Model / View / ViewModel**:

| Camada | Pasta / artefatos | Papel |
|--------|-------------------|--------|
| **Model** | `src/data/repositories/`, `src/core/types/`, `prisma/` | Regras de acesso a dados e contratos (`IMatriculaRepository`). O “modelo de domínio” dos agregados é expresso nos tipos (`DashboardSnapshot`, filtros) e nas consultas do repositório. |
| **ViewModel** | `src/presentation/viewmodels/DashboardViewModel.ts` | Estado de apresentação (filtros), orquestração das consultas ao repositório e notificação de mudanças via **Observer**. |
| **View** | `src/view/` (HTML + Tailwind compilado + `renderer.ts`) | Apenas exibição e entrada do usuário; consome a API exposta pelo **preload** (`window.dashboardApi`) e reage a eventos IPC. **Estilização exclusiva com Tailwind CSS** (sem outros frameworks de UI). |

> **Nota:** Não foi adotado MVC “puro” com Controller de domínio; o fluxo de UI segue MVVM, com IPC do Electron fazendo a ponte entre processo principal (onde rodam ViewModel e repositório) e o processo de renderização (View).

## Persistência: padrão Repository + SGBD relacional

- **Repository:** interface `IMatriculaRepository` e implementação `PrismaMatriculaRepository`, isolando o uso do Prisma/PostgreSQL do restante da aplicação.
- **ORM:** **Prisma** como camada de mapeamento objeto–relacional sobre **PostgreSQL** (variável `DATABASE_URL` no `.env`).
- Consultas agregadas usam **SQL parametrizado** (`$queryRaw`) onde faz sentido para somas e agrupamentos.

Nenhum outro padrão de persistência (por exemplo Active Record em paralelo) é utilizado; se no futuro for introduzido, deve ser documentado aqui.

## Padrão Observer

- `Subject` / `Observer` em `src/core/interfaces/Observer.ts`.
- `DashboardViewModel` estende `Subject` e chama `notify()` sempre que um novo **snapshot** do painel é calculado (incluindo estado “carregando”).
- **Observadores concretos:**
  - `IpcDashboardObserver`: encaminha o snapshot ao **BrowserWindow** via `webContents.send` (atualiza a View).
  - `LoggingDashboardObserver`: exemplo de segundo observador (log no processo principal), demonstrando múltiplos assinantes.

## Dados de origem e carga

O arquivo `Matriculados Região Sul.csv` (separador `;`) é importado pelo script `prisma/seed.ts`, que preenche a tabela `matricula_linha`. O campo `publica` é derivado da coluna “Categoria Administrativa” (presença do termo “pública”, em qualquer capitalização).

## Como executar

1. Copie `.env.example` para `.env` e configure `DATABASE_URL` para o seu PostgreSQL.
2. `npm install`
3. `npx prisma migrate deploy` (ou `npm run prisma:migrate` em desenvolvimento).
4. `npm run db:seed` (importa o CSV; pode levar vários minutos).
5. `npm run dev` (compila TypeScript + Tailwind e abre o Electron).

## Requisitos de agregados implementados

- **Totais por ano** (2014–2022) na Região Sul, com filtro **Todos / EaD / Presencial** (aplicado à série de totais).
- **Ranking dos 10 cursos** com mais matrículas em **2022**, separado para **Presencial** e **EaD**.
- **Ranking das 10 IES** em **2022** por alunos **Presencial** e por **EaD**, cada um com filtro **públicas** ou **privadas**.
