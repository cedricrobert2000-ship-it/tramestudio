# Trame Studio

Site du studio photo & vidéo Trame : mariage, sport, créateurs, marques.
Site statique (HTML, CSS, JS), sans dépendance, prêt pour GitHub Pages.

## Pages

- `index.html` : accueil (header plein écran, présentation, travaux, films & reels, services, méthode, FAQ, contact)
- `mariage.html` : page dédiée au mariage (offre, galerie, déroulé, FAQ)
- `sport.html` : les sessions sport (Session 01 : Diagonale des Fous), une section par session
- `influence.html` : reels et contenus pour influenceurs

Le menu et le pied de page sont communs à toutes les pages (générés par `assets/js/main.js`).

## Modifier le contenu

Tout se passe dans `assets/js/data.js` :

- **Coordonnées** : `email`, `instagram`, `zone`.
- **Bandeau Travaux** (`works`) : année + catégorie, images 3:2 dans `images/works/`.
- **Mariage** (`mariage.photos`) : photos dans `images/mariage/`.
- **Sport** (`sport.sessions`) : une entrée par session ; pour en ajouter une, copiez le bloc de la Diagonale.
- **Influence** (`influence.reels`) : collez un lien Instagram, TikTok, YouTube ou Vimeo dans `embed`.
- **Films & reels** de l'accueil (`films`) : même principe. Sans lien, la carte affiche « Bientôt ».

Photos conseillées : JPG de 1800 à 2400 px sur le grand côté, environ 200 Ko.

## Style

- Police **Switzer** (Fontshare, licence gratuite), hébergée dans `assets/fonts/`.
- Couleurs, tailles et animations : variables en tête de `assets/css/style.css`.

## Mise en ligne

Dans le repo GitHub : Settings → Pages → Deploy from a branch → `main` / `(root)`.
