# Interface CAMTRACK

Geist est conservée avec next/font : lisibilité des adresses, références et tableaux sans nouvelle dépendance. Palette bleu pétrole, surfaces sobres, titres nets et espace généreux. Les trois liens Figma fournis sont inaccessibles ici : direction de repli « logistique moderne », sans prétendre reproduire les maquettes.

Toutes les couleurs sont dans les tokens de globals.css en clair/sombre. Statuts avec fonds/texte distincts, libellés et icônes : calendrier, camion, validation et croix. Les tableaux dispatcher deviennent des cartes sous md. Chauffeur en une colonne, contrôles de 48 px minimum, démarrage placé en bas pendant le défilement.

Branchés : filtres date/statut/chauffeur (inactifs inclus pour l’historique), création et modification PLANNED, détail/historique, liste/création/activation des chauffeurs, tournée et démarrage chauffeur. Chargement, vide, erreur/réessayer, envoi désactivé et toasts sont intégrés.

À brancher : confirmations Livrée et Échec, après ajout des méthodes et payloads au service existant. Raison non vide après trim, commentaire facultatif, 500 caractères maximum. À corriger par l’auteur : le blocage d’hydratation et les autres anomalies du rapport relecture-frontend.md.

## Contrôles visuels

Chrome à 360 px : listes dispatcher/chauffeur, formulaire de création et détails PLANNED, STARTED, DELIVERED sans débordement horizontal. Inspection des captures desktop et mobile. Contrastes calculés des textes principaux, secondaires, actions, erreurs et quatre statuts : tous supérieurs à 4,5:1 dans les deux thèmes (minimum mesuré 5,89:1). Cela ne constitue pas un audit WCAG exhaustif.

Les tests de lecture ont utilisé les données API existantes ; aucune mission de démonstration n’a été démarrée ou modifiée pendant ces contrôles. Les mutations sont branchées aux services existants mais n’ont pas été validées de bout en bout sur des écritures réelles.
