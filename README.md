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
│   ├── errors.ts             # apiErrorMessage() : code métier → message (base des errors.ts)
│   ├── format.ts             # dates fr-FR dans le fuseau métier Africa/Douala
│   └── query.ts              # construction de query string
├── hooks/
│   ├── useApiQuery.ts        # lecture API : data / loading / error / reload, requêtes annulées
│   └── useDebouncedValue.ts
├── components/
│   ├── ui/                   # shadcn/ui (généré : `pnpm dlx shadcn@latest add <composant>`)
│   ├── AppHeader.tsx  PageHeader.tsx  EmptyState.tsx
│   └── QueryStatus.tsx       # chargement / erreur + « Réessayer » / contenu
├── modules/<domaine>/        # un dossier par domaine, miroir des modules de l'API
│   ├── types.ts              # miroir des DTO de l'API
│   ├── module.ts             # appels API (XxxService)
│   ├── hooks.ts              # lectures (useMissions, useMission, useDrivers)
│   ├── errors.ts             # code métier → message affiché
│   └── components/           # ex. MissionStatusBadge
│   (missions/status.ts : libellés des statuts et actions chauffeur par statut)
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

Codex a été utilisé pour la relecture du frontend, la construction des interfaces
dispatcher/chauffeur, le thème et les vérifications de compilation et de rendu.
Les anomalies de logique relevées ont été documentées sans correction automatique.


## Interface et points à finaliser

- [Rapport de relecture](docs/relecture-frontend.md) : scénarios, gravités et corrections proposées.
- [Choix de design et branchements](docs/interface.md).
- **Blocage connu** : le store d’authentification ne termine pas son hydratation ; la connexion peut aboutir à un écran vide. Le rapport décrit le correctif à appliquer dans `src/modules/auth/store.ts`.
- Les confirmations « Livrée » et « Échec » sont préparées mais désactivées en attendant l’ajout des méthodes correspondantes dans le service frontend.
