# Relecture frontend — 30 septembre 2026

Périmètre : lib, hooks, modules auth/drivers/missions, proxy et DTO API locaux. Aucun fichier de logique protégé modifié.

| Gravité | Fichier et ligne | Scénario concret et résultat faux | Correction suggérée à l’auteur |
| --- | --- | --- | --- |
| **Bloquant** | `src/modules/auth/store.ts:57` ; `src/modules/auth/components/RoleGuard.tsx:32` | Le stockage local synchrone de Zustand exécute onRehydrateStorage pendant la création du store. Le callback accède à la constante useAuthStore avant son initialisation ; persist intercepte l’erreur et hydrated reste faux. Reproduit en production : connexion réussie puis /dispatch entièrement vide. | Utiliser une action définie avec le set du créateur pour terminer l’hydratation, sans accéder à la constante en cours d’initialisation ; ou déclencher explicitement rehydrate après création. Tester stockage vide et session persistée. |
| **Important** | `src/modules/auth/store.ts:49–50` | Un JSON localStorage corrompu fait échouer la réhydratation ; state est absent, le callback retourne sans terminer l’hydratation ni purger le cookie. Écran vide sans reconnexion possible depuis le garde. | Traiter l’erreur du callback, purger session/cookie et terminer l’hydratation en état déconnecté ; prévoir aussi un stockage indisponible. |
| **Important** | `src/modules/auth/store.ts:27–29,51` ; `src/modules/auth/components/RoleGuard.tsx:22–32` | Après expiresAt, une session ouverte reste affichée : aucun timer ni contrôle au retour dans l’onglet. Le store n’est purgé qu’au prochain 401 ou rechargement, contrairement au README. | Programmer la purge à expiration et vérifier à la reprise de visibilité. L’API reste la barrière de sécurité. |
| **Important** | `src/lib/http.ts:120–124` | Une requête avec le jeton A reçoit tardivement un 401 après une reconnexion réussie avec B. Le logout inconditionnel supprime la nouvelle session B. | Ne déconnecter que si le jeton courant correspond encore au jeton capturé par cette requête. |
| **Important** | `src/hooks/useApiQuery.ts:51,64–66` | Charger A puis passer à une clé nulle conserve données/erreur de A. Charger B après A puis recevoir une erreur B conserve les données A sous le résultat B. Un consommateur de data peut présenter le mauvais détail. | Conserver les données uniquement pour un rechargement de la même clé ; état vide si clé nulle. Les nouveaux écrans masquent les données pendant chargement/erreur avec QueryStatus. |
| **Mineur** | `src/lib/http.ts:120` | Le serveur envoie les en-têtes puis bloque le corps au-delà du délai : response.text rejette hors du try. Le consommateur reçoit une DOMException brute, pas ApiError TIMEOUT, et affiche une erreur générique. | Inclure la lecture du corps dans la normalisation réseau/délai et préserver l’annulation volontaire. |

## Contrats et points vérifiés

- Champs, rôles, statuts et nullabilité correspondent aux DTO API lus. Les Date backend sont des chaînes ISO dans le JSON.
- useApiQuery annule les anciennes requêtes et ignore leur résolution après annulation. Le nonce relance la lecture. Le problème porte sur les données conservées entre clés.
- Le proxy délimite correctement les préfixes et rejette les rôles inconnus. Le cookie n’authentifie pas. La synchronisation vise à éviter les boucles ; le problème reproduit est une hydratation inachevée, pas une boucle démontrée.
- Les détails de validation serveur sont disponibles dans ApiError mais non exploités par apiErrorMessage ; ils donnent un message générique.

## API et limites

Le contrôleur API local expose désormais POST /missions/:id/deliver et /fail, contrairement au contexte initial. Les méthodes et payloads frontend manquent encore. Conformément à la demande, ces fichiers restent inchangés : confirmations désactivées avec TODO, commentaire facultatif et raison obligatoire préparés, aucun appel inventé.

## Tests

Première vérification : lint, typecheck et build réussis. API /health opérationnelle, comptes dispatcher et chauffeur de démonstration disponibles. Aucun seed lancé.

La connexion réelle révèle le blocage ci-dessus. Pour inspecter les écrans, une session Chrome isolée a reçu hydrated:true dans son stockage de test uniquement. Ce contournement n’est pas livré et ne prouve pas une connexion fonctionnelle. Listes dispatcher, formulaire de création et chauffeurs affichés avec les données API ; aucun débordement de page constaté à 360 px.

Contrôles complémentaires : tournée chauffeur et détails PLANNED, STARTED et DELIVERED lus avec la session de test, sans débordement à 360 px. Aucun fichier de logique interdit n’apparaît dans le diff. Les écritures métier n’ont pas été exercées sur les données existantes.


## Correctif autorisé après relecture

Le blocage d’hydratation et le cas JSON corrompu sont désormais corrigés dans le store : `finishHydration` utilise le setter interne, et le callback conserve l’état initial pour récupérer une erreur de lecture. Une session sans jeton est également purgée. Les constats ci-dessus décrivent le code avant correction ; les autres anomalies restent ouvertes.

Validation du correctif : lint, typecheck et build réussis. Chrome, sans simulation : connexion réelle dispatcher et chauffeur, rechargement avec session persistée, déconnexion, puis stockage JSON corrompu avec cookie résiduel → retour à la connexion. Tous ces parcours passent.


## Branchement des transitions autorisé ensuite

Les méthodes et payloads deliver/fail ont été ajoutés et les confirmations activées. Un compteur de révision Zustand invalide toutes les lectures de missions après succès ou conflit 409, sans nouvelle bibliothèque de cache. Le constat précédent de boutons désactivés est désormais résolu.
