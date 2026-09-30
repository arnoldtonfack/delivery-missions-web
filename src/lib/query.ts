type QueryValue = string | number | boolean | null | undefined;

/** `{ a: 1, b: undefined }` → `?a=1` (valeurs vides ignorées) ; `""` si rien. */
export function toQueryString(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
