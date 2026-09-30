# Delivery Missions — Web

Front de l'API **Delivery Missions** (gestion des missions de livraison). Une seule
application web, deux espaces selon le rôle renvoyé à la connexion :

| Rôle | Espace | Usage |
| --- | --- | --- |
| `DISPATCHER` | `/dispatch` | Console desktop : missions, chauffeurs |
| `DRIVER` | `/driver` | Écrans mobiles : missions du jour, mise à jour du statut |

## Démarrage rapide

Prérequis : Node 22, pnpm (`corepack enable`), l'API démarrée sur `http://localhost:3000`
(voir le README du dépôt API).

```bash
cp .env.example .env.local
pnpm install
pnpm dev                  # http://localhost:3001
```

Côté API, l'origine du front doit être autorisée : `CORS_ORIGIN=http://localhost:3001`
(en dev sans valeur, toutes les origines sont acceptées).

## Scripts

| Commande | Effet |
| --- | --- |
| `pnpm dev` | Serveur de dev (port 3001) |
| `pnpm build` / `pnpm start` | Build de production puis exécution (port 3001) |
| `pnpm lint` / `pnpm typecheck` | Qualité |

## Variables d'environnement

| Variable | Rôle | Défaut |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Hôte de l'API, sans préfixe de version | `http://localhost:3000` |

## Architecture

```
src/
├── proxy.ts                  # aiguillage par rôle (cookie dm_session) → /login, /dispatch, /driver
├── config/env.ts             # URL de l'API, préfixe /api/v1.0.0
├── lib/
│   ├── http.ts               # client fetch : enveloppe { success, data }, ApiError + code métier
│   └── query.ts              # construction de query string
├── components/
│   ├── ui/                   # shadcn/ui (généré : `pnpm dlx shadcn@latest add <composant>`)
│   └── AppHeader.tsx
├── modules/<domaine>/        # un dossier par domaine, miroir des modules de l'API
│   ├── types.ts              # miroir des DTO de l'API
│   ├── module.ts             # appels API (XxxService)
│   ├── errors.ts             # code métier → message affiché
│   └── components/
└── app/                      # routes (App Router) : pages fines, la logique vit dans modules/
    ├── login/
    ├── dispatch/             # layout + RoleGuard DISPATCHER
    │   ├── missions/new/  missions/[id]/  drivers/
    └── driver/               # layout + RoleGuard DRIVER
        └── missions/[id]/
```

### Authentification

- `POST /auth/login` → le JWT et l'utilisateur sont gardés dans un store zustand persisté
  (`localStorage`), purgé à l'expiration du jeton.
- Le cookie `dm_session` ne contient que le rôle : il sert au proxy à aiguiller la
  navigation, **pas** à sécuriser. L'API vérifie le JWT et le rôle à chaque appel.
- Toute réponse `401` d'une requête authentifiée vide la session → retour à `/login`.

### Contrat avec l'API

- Préfixe `/api/v1.0.0`, `Authorization: Bearer <jeton>`.
- Succès : `{ success, data, timestamp }` — déballé par `lib/http.ts`.
- Erreur : `{ statusCode, message, error }` → `ApiError { status, code, details }` ;
  `code` est le code métier (`INVALID_CREDENTIALS`, `MISSION_NOT_FOUND`…).

## Usage de l'IA

<!-- À compléter : outils utilisés et pour quelles parties (exigence du règlement). -->
