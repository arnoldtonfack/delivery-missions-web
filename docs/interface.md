# Interface CAMTRACK

Geist est conservée avec next/font : lisibilité des adresses, références et tableaux sans nouvelle dépendance. Palette bleu pétrole, surfaces sobres, titres nets et espace généreux. Les trois liens Figma fournis sont inaccessibles ici : direction de repli « logistique moderne », sans prétendre reproduire les maquettes.

Toutes les couleurs sont dans les tokens de globals.css en clair/sombre. Statuts avec fonds/texte distincts, libellés et icônes : calendrier, camion, validation et croix. Les tableaux dispatcher deviennent des cartes sous md. Chauffeur en une colonne, contrôles de 48 px minimum, démarrage placé en bas pendant le défilement.

Branchés : filtres date/statut/chauffeur (inactifs inclus pour l’historique), création et modification PLANNED, détail/historique, liste/création/activation des chauffeurs, tournée et démarrage chauffeur. Chargement, vide, erreur/réessayer, envoi désactivé et toasts sont intégrés.

Les confirmations Livrée et Échec sont branchées sur les routes API existantes. Raison obligatoire après trim, commentaire facultatif, 500 caractères maximum et protection contre les doubles soumissions. L’invalidation commune couvre détails/historiques et toutes les listes filtrées montées après création, modification, démarrage, livraison ou échec ; un 409 invalide également les lectures. Les vues remontées au retour relisent l’API. Cela ne synchronise pas en temps réel les autres navigateurs ou onglets.

Le blocage d’hydratation a été corrigé après autorisation. Les autres anomalies ouvertes figurent dans relecture-frontend.md.

## Contrôles visuels

Chrome à 360 px : listes dispatcher/chauffeur, formulaire de création et détails PLANNED, STARTED, DELIVERED sans débordement horizontal. Inspection des captures desktop et mobile. Contrastes calculés des textes principaux, secondaires, actions, erreurs et quatre statuts : tous supérieurs à 4,5:1 dans les deux thèmes (minimum mesuré 5,89:1). Cela ne constitue pas un audit WCAG exhaustif.

Les tests de lecture ont utilisé les données API existantes ; aucune mission de démonstration n’a été démarrée ou modifiée pendant ces contrôles. Les mutations sont branchées aux services existants mais n’ont pas été validées de bout en bout sur des écritures réelles.

Validation du branchement : lint, typecheck et build réussis. Chrome avec réponses API simulées (aucune mutation des données de démonstration) : livraison sans commentaire, échec avec raison obligatoire et normalisée, double clic limité à un POST, relecture du détail/historique et liste à jour au retour. Contrôle des services : notification des abonnés après les cinq mutations, invalidation sur 409, absence d’invalidation de succès sur 400. Les écritures de ces tests n’ont pas été exécutées contre la vraie API.

## Finition visuelle

Navigation latérale sur ordinateur et onglets sur mobile, page active signalée par aria-current, identité visuelle avec pictogramme colis, hiérarchie typographique et surfaces unifiées. Connexion en deux volets sur grand écran, formulaire seul sur mobile. Les synthèses dispatcher portent explicitement sur la sélection filtrée ; la progression chauffeur compte les missions terminées (livrées ou échouées), à partir des mêmes données que la liste. Aucun indicateur fictif.

Chrome : connexion, missions, chauffeurs et formulaire vérifiés sans débordement à 360 px ; console contrôlée également à 768 et 1440 px. Captures desktop/mobile inspectées, détail chauffeur vérifié en sombre. Les actions restent accessibles au clavier et les animations respectent prefers-reduced-motion. Lint, typecheck et build réussis.
