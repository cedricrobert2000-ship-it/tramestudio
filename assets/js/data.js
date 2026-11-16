/* ==========================================================================
   TRAME STUDIO — contenu du site
   Modifiez ce fichier pour changer les textes, les photos ou les vidéos.
   ========================================================================== */

window.TRAME = {
  email: "contact@tramestudio.fr",   // ← votre e-mail
  instagram: "tramestudio",          // ← votre pseudo Instagram (sans @)
  zone: "France & destination",      // ← votre zone d'intervention
  timezone: "Europe/Paris",          // ← fuseau de l'horloge du bandeau

  /* Les catégories de travail : menu, pied de page, cartes de l'accueil */
  categories: [
    { key: "mariage",   label: "Mariage",   href: "mariage.html" },
    { key: "sport",     label: "Sport",     href: "sport.html" },
    { key: "influence", label: "Influence", href: "influence.html" },
  ],

  /* Cartes du bandeau « Travaux » sur l'accueil.
     year : année du projet · cat : clé de la catégorie (lien vers sa page) */
  works: [
    { img: "works/diag-sac.jpg",       year: "2026", cat: "sport" },
    { img: "works/mariage-porte.jpg",  year: "2026", cat: "mariage" },
    { img: "works/diag-capuche.jpg",   year: "2026", cat: "sport" },
    { img: "works/mariage-balcon.jpg", year: "2026", cat: "mariage" },
    { img: "works/diag-orange.jpg",    year: "2026", cat: "sport" },
    { img: "works/mariage-haie.jpg",   year: "2026", cat: "mariage" },
    { img: "works/diag-arrivee.jpg",   year: "2026", cat: "sport" },
    { img: "works/mariage-main.jpg",   year: "2026", cat: "mariage" },
    { img: "works/diag-reglages.jpg",  year: "2026", cat: "sport" },
    { img: "works/mariage-retour.jpg", year: "2026", cat: "mariage" },
    // Influence : ajoutez ici une image de couverture des reels de Yayyha, par ex.
    // { img: "works/influence-yayyha.jpg", year: "2026", cat: "influence" },
  ],

  /* MARIAGE — la galerie de la page mariage.html */
  mariage: {
    photos: ["mariage/01", "mariage/03", "mariage/04", "mariage/02", "mariage/06", "mariage/07", "mariage/05", "mariage/08", "mariage/09", "mariage/10"],
  },

  /* SPORT — une « session » par événement.
     Pour ajouter une nouvelle session : copiez le bloc et changez les valeurs. */
  sport: {
    sessions: [
      {
        n: "01",
        title: "Diagonale des Fous",
        place: "Grand Raid · La Réunion",
        date: "Octobre 2026",
        text: "Plus de 160 km à travers l'île, de jour comme de nuit. Nous avons suivi un coureur au plus près : la préparation du sac, les ravitaillements, la fatigue, et cette ligne d'arrivée qu'on attend pendant des heures.",
        photos: ["sport/02", "sport/01", "sport/03", "sport/04", "sport/05", "sport/06", "sport/07", "sport/08", "sport/09", "sport/10"],
        films: [
          { format: "film", title: "Diagonale des Fous", tag: "Film", poster: "films/diagonale.jpg", embed: "", video: "" },
          { format: "reel", title: "Dossard 1635",       tag: "Reel", poster: "reels/01.jpg",        embed: "", video: "" },
          { format: "reel", title: "La nuit",            tag: "Reel", poster: "reels/02.jpg",        embed: "", video: "" },
          { format: "reel", title: "Ravitaillement",     tag: "Reel", poster: "reels/03.jpg",        embed: "", video: "" },
        ],
      },
    ],
  },

  /* INFLUENCE — reels et contenus pour créateurs.
     embed : lien Instagram, TikTok, YouTube Shorts ou Vimeo · video : fichier .mp4 léger
     poster : image de couverture (facultatif) */
  influence: {
    reels: [
      { title: "Reel 01", client: "Yayyha", poster: "", embed: "", video: "" },
      { title: "Reel 02", client: "Yayyha", poster: "", embed: "", video: "" },
      { title: "Reel 03", client: "Yayyha", poster: "", embed: "", video: "" },
      { title: "Reel 04", client: "Yayyha", poster: "", embed: "", video: "" },
    ],
  },

  /* Films & reels mis en avant sur l'accueil */
  films: [
    { format: "film", title: "Diagonale des Fous", tag: "Sport · Film",       poster: "films/diagonale.jpg", embed: "", video: "" },
    { format: "reel", title: "Dossard 1635",       tag: "Sport · Reel",       poster: "reels/01.jpg",        embed: "", video: "" },
    { format: "reel", title: "Yayyha",             tag: "Influence · Reel",   poster: "",                    embed: "", video: "" },
    { format: "reel", title: "La nuit",            tag: "Sport · Reel",       poster: "reels/02.jpg",        embed: "", video: "" },
  ],
};
