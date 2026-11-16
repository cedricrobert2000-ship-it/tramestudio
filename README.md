# Trame Studio

Site du studio photo & vidéo Trame : mariage, sport, créateurs, marques.
Site statique (HTML, CSS, JS), sans dépendance, prêt pour GitHub Pages.

## Pages

- `index.html` : accueil (header plein écran, présentation, travaux, films & reels, services, méthode, FAQ, contact)
- `mariage.html` : page dédiée au mariage (offre, galerie, déroulé, FAQ)
- `sport.html` : les sessions sport (Session 01 : Diagonale des Fous), une section par session
- `influence.html` : reels et contenus pour influenceurs
- `mentions-legales.html` : mentions légales et confidentialité (**à compléter**)
- `404.html` : page « introuvable », servie automatiquement par GitHub Pages

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

## Sécurité

- Politique de sécurité du contenu (CSP) sur chaque page : seuls les scripts, styles, polices et images du site lui-même sont autorisés ; les vidéos intégrées ne peuvent venir que de YouTube, Vimeo, Instagram ou TikTok.
- Aucun script, aucune police ni aucun traceur externe : pas de cookies, pas de bandeau RGPD nécessaire.
- Les contenus de `data.js` sont échappés avant affichage ; les liens vidéo et chemins d'images sont filtrés.
- Photos publiées sans métadonnées (ni GPS, ni appareil).
- Sans JavaScript, le site reste lisible (menu de secours, contenu visible).

## Avant la mise en ligne

1. Compléter `mentions-legales.html` (nom, statut, SIRET, adresse, directeur de la publication).
2. Mettre votre e-mail et votre Instagram dans `assets/js/data.js`.
3. Vérifier que vous avez l'accord des personnes photographiées pour publier leurs images.
4. Activer GitHub Pages : Settings → Pages → Deploy from a branch → `main` / `(root)`.
5. Avec un nom de domaine : ajouter un fichier `CNAME`, configurer les DNS, puis cocher **Enforce HTTPS**.
