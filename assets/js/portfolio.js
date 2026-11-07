/* ==========================================================================
   PORTFOLIO — la liste de vos images et vidéos.

   Pour ajouter une photo :
     1. déposez le fichier dans le bon dossier (ex. images/mariage/04.jpg)
     2. ajoutez une ligne ci-dessous, sur le même modèle.

   Champs :
     cat    : "mariage" | "sport" | "createurs" | "marques" | "lieux"
     src    : chemin de la photo (ou de l'image d'aperçu pour une vidéo)
     video  : (optionnel) chemin d'une vidéo .mp4 courte, jouée en boucle sans son
     embed  : (optionnel) lien YouTube ou Vimeo, ouvert dans la visionneuse
     title  : titre affiché au survol
     ratio  : format de la vignette : "4/5" (portrait), "3/2" (paysage), "1/1", "9/16"

   Tant qu'un fichier n'existe pas, un aplat coloré s'affiche à sa place
   avec le chemin attendu : il suffit d'ajouter le fichier pour qu'il apparaisse.
   ========================================================================== */

window.TRAME_PORTFOLIO = [
  // Sport : Diagonale des Fous (Grand Raid, La Réunion) · Mariage
  { cat: "sport",   src: "images/sport/01.jpg",   title: "Quartier d'orange",      ratio: "2/3" },
  { cat: "mariage", src: "images/mariage/01.jpg", title: "Le porté",               ratio: "2/3" },
  { cat: "sport",   src: "images/sport/02.jpg",   title: "Préparer le sac",        ratio: "3/2" },
  { cat: "mariage", src: "images/mariage/03.jpg", title: "La haie d'honneur",      ratio: "2/3" },
  { cat: "sport",   src: "images/sport/03.jpg",   title: "Sous la capuche",        ratio: "2/3" },
  { cat: "mariage", src: "images/mariage/02.jpg", title: "Au balcon",              ratio: "3/2" },
  { cat: "sport",   src: "images/sport/04.jpg",   title: "Dossard 1635",           ratio: "9/16" },
  { cat: "mariage", src: "images/mariage/04.jpg", title: "Elle se retourne",       ratio: "2/3" },
  { cat: "sport",   src: "images/sport/06.jpg",   title: "Derniers réglages",      ratio: "3/2" },
  { cat: "mariage", src: "images/mariage/05.jpg", title: "L'attente",              ratio: "2/3" },
  { cat: "sport",   src: "images/sport/05.jpg",   title: "Nuit de course",         ratio: "2/3" },
  { cat: "mariage", src: "images/mariage/06.jpg", title: "Main dans la main",      ratio: "2/3" },
  { cat: "sport",   src: "images/sport/08.jpg",   title: "Pieds nus",              ratio: "3/2" },
  { cat: "mariage", src: "images/mariage/07.jpg", title: "Dentelle",               ratio: "2/3" },
  { cat: "sport",   src: "images/sport/07.jpg",   title: "Avant le départ",        ratio: "2/3" },
  { cat: "mariage", src: "images/mariage/08.jpg", title: "Dans les hautes herbes", ratio: "2/3" },
  { cat: "sport",   src: "images/sport/09.jpg",   title: "La ligne d'arrivée",     ratio: "2/3" },
  { cat: "mariage", src: "images/mariage/09.jpg", title: "À la fenêtre",           ratio: "2/3" },
  { cat: "sport",   src: "images/sport/10.jpg",   title: "Le camp de base",        ratio: "2/3" },
  { cat: "mariage", src: "images/mariage/10.jpg", title: "Portrait d'invité",      ratio: "2/3" },
  // À venir : créateurs, marques, lieux. Exemple :
  // { cat: "createurs", src: "images/createurs/01.jpg", title: "Shooting lifestyle", ratio: "4/5" },
  // Exemple vidéo :
  // { cat: "sport", src: "images/sport/film-cover.jpg", video: "videos/sport-teaser.mp4", title: "Teaser", ratio: "3/2" },
  // Exemple YouTube / Vimeo :
  // { cat: "mariage", src: "images/mariage/01.jpg", embed: "https://vimeo.com/123456789", title: "Film de mariage", ratio: "3/2" },
];

/* ==========================================================================
   REELS — vos vidéos verticales (9:16), en .mp4 courts et légers.
     video  : chemin de la vidéo (ex. videos/reels/01.mp4)
     poster : image affichée avant lecture
   ========================================================================== */

// La section Reels s'affiche automatiquement dès qu'il y a au moins un reel ici.
window.TRAME_REELS = [
  // { cat: "sport", video: "videos/reels/01.mp4", poster: "images/reels/01.jpg", title: "Diagonale des Fous", client: "Trail" },
  // { cat: "createurs", video: "videos/reels/02.mp4", poster: "images/reels/02.jpg", title: "Anne", client: "Créatrice" },
];
