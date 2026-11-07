# Trame Studio — portfolio photo & vidéo

Site vitrine du studio : **mariages**, **créateurs & influenceurs** (reels, photos réseaux sociaux), **marques & professionnels**, **lieux & voyage** (logements, hôtels).

Site statique (HTML / CSS / JS, sans dépendance) hébergé gratuitement avec GitHub Pages.

## Ajouter vos photos

Les emplacements vides affichent un aplat coloré avec le chemin attendu : il suffit de déposer un fichier portant ce nom pour qu'il apparaisse.

| Dossier | Contenu |
|---|---|
| `images/hero/` | `hero.jpg` (grande photo du header, elle donne le mood du site), `mariage.jpg`, `createurs.jpg`, `marques.jpg`, `lieux.jpg` (section Services), `faq.jpg`, `contact.jpg` |
| `videos/hero.mp4` | (optionnel) vidéo d'ambiance du header, à activer dans `assets/js/config.js` |
| `images/mariage/`, `images/createurs/`, `images/marques/`, `images/lieux/` | Photos du portfolio : `01.jpg`, `02.jpg`, `03.jpg`… |
| `images/reels/` | Image d'aperçu de chaque reel : `01.jpg`… |
| `videos/reels/` | Reels verticaux en `.mp4` : `01.mp4`… |

Pour ajouter **plus** de photos, ajoutez une ligne dans `assets/js/portfolio.js`.

**Conseils** : JPG de 2000 px maximum sur le grand côté (~300–500 Ko), vidéos de 15–30 s en 1080×1920 sans son, moins de 8 Mo.

## Vos coordonnées

Tout est dans `assets/js/config.js` : e-mail, Instagram, zone d'intervention et formulaire de contact (Formspree en option).

## Mise en ligne

Settings → Pages → *Deploy from a branch* → `main` / `(root)`. Le site est alors disponible sur `https://<compte>.github.io/tramestudio/`.
