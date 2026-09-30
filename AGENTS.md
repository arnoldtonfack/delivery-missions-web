# AGENTS.md

Règles communes à tous les agents (Claude Code, Codex) qui travaillent sur ce repo.

## Contexte

Front de l'épreuve CAMTRACK — **Thème 3 : gestion des missions de livraison**. L'API est
dans un dépôt séparé (NestJS, `http://localhost:3000`). Priorité : ce qui **marche** (le
jury installe via le README).

- `DISPATCHER` : console desktop (`/dispatch`) — missions et chauffeurs.
- `DRIVER` : écrans mobiles (`/driver`) — ses missions du jour, un gros bouton par action,
  seule l'action suivante autorisée est proposée (`PLANNED → STARTED → DELIVERED | FAILED`,
  raison obligatoire si `FAILED`).
- La sécurité est côté API ; le front n'affiche que ce que le rôle peut faire.

## Stack

Next.js 16 (App Router), React 19, TypeScript strict, Tailwind 4, shadcn/ui (base Radix,
icônes lucide), zustand, sonner. **pnpm** uniquement.

## Organisation du code

- `src/modules/<domaine>/` : `types.ts` (miroir des DTO de l'API), `module.ts` (appels
  via `lib/http.ts`, jamais de `fetch` direct), `errors.ts` (code métier → message),
  `components/`.
- `src/app/` : pages fines qui assemblent les composants des modules.
- `src/components/ui/` : composants shadcn générés — ajouter via
  `pnpm dlx shadcn@latest add <composant>`.
- Les types suivent les DTO de l'API : si l'API change, mettre à jour `types.ts`.

## Style

- Zéro `any`, types de retour explicites, pas de `console.log`.
- Textes de l'interface en français.
- `pnpm lint` et `pnpm typecheck` doivent passer avant chaque commit.

## Git

- Commits réguliers et atomiques, en français, Conventional Commits avec scope :
  `feat(missions): …`, `fix(auth): …`, `style(driver): …`.
- **Aucune mention d'assistance IA** dans les commits (pas de `Co-Authored-By`, pas de
  « Generated with … ») : l'usage de l'IA est déclaré uniquement dans le README.
- Ne jamais committer de secrets (`.env*` sauf `.env.example`).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
