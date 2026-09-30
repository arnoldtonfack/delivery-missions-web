/**
 * Formatage d'affichage (fr-FR). Les horodatages sont affichés dans le fuseau
 * MÉTIER (celui de l'API), pas celui du navigateur : un dispatcher en déplacement
 * doit voir les mêmes heures que ses chauffeurs.
 */
export const BUSINESS_TIME_ZONE = "Africa/Douala";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: BUSINESS_TIME_ZONE,
});

const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: BUSINESS_TIME_ZONE,
});

/**
 * Jour sans heure `YYYY-MM-DD` → « mer. 1 oct. 2026 ». Lu en UTC : c'est un jour
 * calendaire, un décalage de fuseau le ferait glisser à la veille.
 */
export function formatDay(day: string): string {
  return dateFormatter.format(new Date(`${day}T00:00:00Z`));
}

/** Horodatage ISO → « 1 oct., 14:05 » (fuseau métier). */
export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}

/** Horodatage ISO → « 14:05 » (fuseau métier). */
export function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso));
}

/**
 * Aujourd'hui au format `YYYY-MM-DD` dans le fuseau métier — valeur par défaut
 * des sélecteurs de date. L'API reste la référence (sans `date`, elle prend son
 * propre « aujourd'hui »).
 */
export function businessToday(): string {
  // `en-CA` formate en YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIME_ZONE,
  }).format(new Date());
}
