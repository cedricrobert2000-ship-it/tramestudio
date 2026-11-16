/* ==========================================================================
   TRAME STUDIO — contenu du site
   Modifiez ce fichier pour changer les textes, les photos ou les vidéos.
   ========================================================================== */

window.TRAME = {
  email: "contact@tramestudio.fr",   // ← votre e-mail
  instagram: "tramestudio",          // ← votre pseudo Instagram (sans @)
  zone: "France & destination",      // ← votre zone d'intervention
  timezone: "Europe/Paris",          // ← fuseau de l'horloge du bandeau

  /* Séries photo : utilisées par la page Travaux et la visionneuse */
  series: {
    sport: {
      title: "Diagonale des Fous",
      tag: "Sport · Trail",
      text: "Le Grand Raid de La Réunion, au plus près d'un coureur : l'attente, l'effort, la nuit, l'arrivée.",
      photos: ["sport/01", "sport/02", "sport/03", "sport/04", "sport/05", "sport/06", "sport/07", "sport/08", "sport/09", "sport/10"],
    },
    mariage: {
      title: "Un mariage",
      tag: "Mariage",
      text: "Une journée racontée sans mise en scène, des préparatifs à la haie d'honneur.",
      photos: ["mariage/01", "mariage/02", "mariage/03", "mariage/04", "mariage/05", "mariage/06", "mariage/07", "mariage/08", "mariage/09", "mariage/10"],
    },
  },

  /* Cartes du bandeau « Travaux » sur l'accueil.
     Un clic ouvre la série, sur la photo n° « at » (0 = première). */
  works: [
    { img: "works/diag-sac.jpg",       tag: "Sport",   title: "Préparer le sac",    series: "sport", at: 1 },
    { img: "works/mariage-porte.jpg",  tag: "Mariage", title: "Le porté",           series: "mariage", at: 0 },
    { img: "works/diag-capuche.jpg",   tag: "Sport",   title: "Sous la capuche",    series: "sport", at: 2 },
    { img: "works/mariage-balcon.jpg", tag: "Mariage", title: "Au balcon",          series: "mariage", at: 1 },
    { img: "works/diag-orange.jpg",    tag: "Sport",   title: "Ravitaillement",     series: "sport", at: 0 },
    { img: "works/mariage-haie.jpg",   tag: "Mariage", title: "Haie d'honneur",     series: "mariage", at: 2 },
    { img: "works/diag-arrivee.jpg",   tag: "Sport",   title: "La ligne d'arrivée", series: "sport", at: 8 },
    { img: "works/mariage-main.jpg",   tag: "Mariage", title: "Main dans la main",  series: "mariage", at: 5 },
    { img: "works/diag-reglages.jpg",  tag: "Sport",   title: "Derniers réglages",  series: "sport", at: 5 },
    { img: "works/mariage-retour.jpg", tag: "Mariage", title: "Elle se retourne",   series: "mariage", at: 3 },
  ],

  /* Films & reels.
     embed : lien YouTube / Vimeo   ·   video : fichier .mp4 léger dans videos/
     Sans embed ni video, la carte affiche « Bientôt ». */
  films: [
    { format: "film", title: "Diagonale des Fous", tag: "Film sport",  poster: "films/diagonale.jpg", embed: "", video: "" },
    { format: "reel", title: "Dossard 1635",       tag: "Reel sport",  poster: "reels/01.jpg",        embed: "", video: "" },
    { format: "reel", title: "La nuit",            tag: "Reel sport",  poster: "reels/02.jpg",        embed: "", video: "" },
    { format: "reel", title: "Ravitaillement",     tag: "Reel sport",  poster: "reels/03.jpg",        embed: "", video: "" },
  ],
};
