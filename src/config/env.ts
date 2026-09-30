/** Accès centralisé aux variables d'environnement. */
export const AppEnv = {
  /** Hôte de l'API (sans slash final, sans préfixe de version). */
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  /** Préfixe de version ajouté par le client HTTP (cf. `api.constants.ts` côté API). */
  apiPrefix: "/api/v1.0.0",
  appName: "Delivery Missions",
} as const;
