"use client";

import { useEffect, useState } from "react";

/**
 * Valeur qui ne se met à jour que `ms` après la dernière modification : le champ
 * de recherche reste instantané, c'est la valeur transmise à l'API qui attend.
 */
export function useDebouncedValue<T>(value: T, ms = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), ms);
    return () => window.clearTimeout(id);
  }, [value, ms]);

  return debounced;
}
