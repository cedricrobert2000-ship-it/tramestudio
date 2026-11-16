# Trame Studio

Site du studio photo & vidéo Trame : mariage, sport, créateurs, marques.
Site statique (HTML, CSS, JS), sans dépendance, prêt pour GitHub Pages.

## Pages

- `index.html` : accueil (header plein écran, présentation, travaux, films & reels, services, méthode, FAQ, contact)
- `travaux.html` : les séries photo complètes

## Modifier le contenu

Tout se passe dans `assets/js/data.js` :

- **Coordonnées** : `email`, `instagram`, `zone`.
- **Séries photo** (`series`) : photos dans `images/sport/` et `images/mariage/`.
- **Bandeau Travaux** (`works`) : images recadrées en 3:2 dans `images/works/`.
- **Films & reels** (`films`) : collez un lien YouTube ou Vimeo dans `embed`, ou un `.mp4` léger dans `video`. Sans lien, la carte affiche « Bientôt ».

Photos conseillées : JPG de 1800 à 2400 px sur le grand côté, environ 200 Ko.

## Style

- Police **Switzer** (Fontshare, licence gratuite), hébergée dans `assets/fonts/`.
- Couleurs, tailles et animations : variables en tête de `assets/css/style.css`.

## Mise en ligne

Dans le repo GitHub : Settings → Pages → Deploy from a branch → `main` / `(root)`.
