/* ==========================================================================
   TRAME STUDIO — contenu du site
   Modifiez ce fichier pour changer les textes, les photos ou les vidéos.
   ========================================================================== */

window.TRAME = {
  email: "trame.studio.contact@gmail.com",   // ← votre e-mail
  // Formulaire de contact (FormSubmit) : après activation, collez ici l'identifiant
  // aléatoire fourni par FormSubmit, pour que l'adresse e-mail n'apparaisse plus dans le code.
  formAlias: "",
  instagram: "trame_studioraw",      // ← votre pseudo Instagram (sans @)
  zone: "France & destination",      // ← votre zone d'intervention
  timezone: "Europe/Paris",          // ← fuseau de l'horloge du bandeau

  /* Les catégories de travail : menu, pied de page, cartes de l'accueil */
  categories: [
    { key: "mariage",   label: "Mariage",   href: "mariage.html" },
    { key: "sport",     label: "Sport",     href: "sport.html" },
    { key: "influence", label: "Influence", href: "influence.html" },
    { key: "hotels",    label: "Hôtels & lieux", href: "hotels.html" },
    { key: "cinema",    label: "Cinéma", href: "cinema.html" },
  ],

  /* Cartes du bandeau « Travaux » sur l'accueil.
     year : année du projet · cat : clé de la catégorie (lien vers sa page) */
  works: [
    { img: "works/diag-sac.jpg",       year: "2026", cat: "sport" },
    { img: "works/mariage-porte.jpg",  year: "2026", cat: "mariage" },
    { img: "works/influence-myslf.jpg", year: "2026", cat: "influence" },
    { img: "works/diag-capuche.jpg",   year: "2026", cat: "sport" },
    { img: "works/mariage-balcon.jpg", year: "2026", cat: "mariage" },
    { img: "works/diag-orange.jpg",    year: "2026", cat: "sport" },
    { img: "works/mariage-haie.jpg",   year: "2026", cat: "mariage" },
    { img: "works/diag-arrivee.jpg",   year: "2026", cat: "sport" },
    { img: "works/influence-parfum.jpg", year: "2026", cat: "influence" },
    { img: "works/mariage-main.jpg",   year: "2026", cat: "mariage" },
    { img: "works/diag-reglages.jpg",  year: "2026", cat: "sport" },
    { img: "works/mariage-retour.jpg", year: "2026", cat: "mariage" },
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
      { title: "Bord de mer", client: "Yayha · Reel", poster: "influence/yayyha-01.jpg", embed: "https://www.instagram.com/reel/Ddbuve0TWFp/", video: "" },
      { title: "Interview", client: "Yayha · Reel", poster: "influence/yayyha-02.jpg", embed: "https://www.instagram.com/reel/DejQUanNJV3/", video: "" },
      { title: "MYSLF", client: "Yayha · Reel", poster: "influence/yayyha-03.jpg", embed: "https://www.instagram.com/reel/DaniTH7t39u/", video: "" },
      { title: "Portrait", client: "Yayha · Post", poster: "influence/yayyha-04.jpg", embed: "https://www.instagram.com/p/Dd6x03JABXC/",    video: "" },
      { title: "Parfum", client: "Yayha · Post", poster: "influence/yayyha-05.jpg", embed: "https://www.instagram.com/p/DctUemqjZR_/",    video: "" },
    ],
  },

  /* DIGITAL — réalisations web présentées en plein écran sur digital.html.
     desktop / mobile : captures pleine page (le site défile dans l'écran au scroll)
     color : couleur d'ambiance de la section quand on arrive sur le projet */
  digital: {
    projects: [
      {
        name: "EuropaNova",
        type: "Think tank européen",
        url: "https://europanova.eu/",
        domain: "europanova.eu",
        desc: "Un site institutionnel clair et engagé pour un think tank européen indépendant : projets, publications, événements et appel au soutien, au service d'un message fort.",
        tags: ["Site institutionnel", "Webdesign", "Framer"],
        color: "#0a1f4d",
        grain: true,          // grain + dégradé vers le noir sur le fond
        desktop: "projects/europanova-desktop.jpg",
        mobile: "projects/europanova-mobile.jpg",
      },
      {
        name: "AlbA Convoyages",
        type: "Convoyage de véhicules",
        url: "https://cedricrobert2000-ship-it.github.io/Albaconvoyage/index.html",
        domain: "cedricrobert2000-ship-it.github.io/Albaconvoyage",
        desc: "Un site pensé pour convertir : devis en 30 minutes mis en avant dès l'arrivée, services lisibles, prix affichés et un ton humain qui rassure les professionnels.",
        tags: ["Site vitrine", "Devis en ligne", "Responsive"],
        color: "#0e285d",
        grain: true,
        desktop: "projects/alba-desktop.jpg",
        mobile: "projects/alba-mobile.jpg",
      },
      {
        name: "Trame Studio",
        type: "Portfolio photo & vidéo",
        url: "https://trameraw.com/",
        domain: "trameraw.com",
        desc: "Notre propre portfolio : direction artistique sombre, animations au scroll, galeries, reels Instagram intégrés et pages dédiées à chaque univers.",
        tags: ["Portfolio", "Design sur mesure", "Animations"],
        color: "#0b0b0b",
        desktop: "projects/trame-desktop.jpg",
        mobile: "projects/trame-mobile.jpg",
      },
    ],
  },

  /* CINÉMA — carrousel 16:9 de l'accueil et page cinema.html
     slides : images 1920×1080 dans images/cinema/ ; href : lien au clic
     voyage / acting : films (embed = lien YouTube ou Vimeo). Sans lien → « Prochainement ». */
  cinema: {
    slides: [
      { img: "cinema/diagonale.jpg",   title: "Diagonale des Fous", tag: "Film · Sport",     year: "2026", href: "cinema.html#films" },
      { img: "cinema/myslf.jpg",       title: "MYSLF",              tag: "Film · Parfum",    year: "2026", href: "cinema.html#films" },
      { img: "cinema/mariage.jpg",     title: "Un mariage",         tag: "Film · Mariage",   year: "2026", href: "cinema.html#films" },
      { img: "cinema/nuit.jpg",        title: "La nuit",            tag: "Film · Trail",     year: "2026", href: "cinema.html#films" },
      { img: "cinema/parfum.jpg",      title: "Voyage",             tag: "Carnets de route", year: "Bientôt", href: "cinema.html#voyage" },
      { img: "cinema/preparation.jpg", title: "Acting",             tag: "Courts-métrages",  year: "Bientôt", href: "cinema.html#acting" },
    ],
    voyage: [
      { format: "film", title: "Carnet de voyage 01", tag: "Voyage", poster: "", embed: "" },
      { format: "film", title: "Carnet de voyage 02", tag: "Voyage", poster: "", embed: "" },
    ],
    acting: [
      { format: "film", title: "Showreel acting", tag: "Acting", poster: "", embed: "" },
      { format: "film", title: "Court-métrage 01", tag: "Acting", poster: "", embed: "" },
    ],
  },

  /* Films & reels mis en avant sur l'accueil */
  films: [
    { format: "film", title: "Diagonale des Fous", tag: "Sport · Film",       poster: "films/diagonale.jpg", embed: "", video: "" },
    { format: "reel", title: "Dossard 1635",       tag: "Sport · Reel",       poster: "reels/01.jpg",        embed: "", video: "" },
    { format: "reel", title: "MYSLF",              tag: "Influence · Yayha", poster: "influence/yayyha-03.jpg", embed: "https://www.instagram.com/reel/DaniTH7t39u/", video: "" },
    { format: "reel", title: "La nuit",            tag: "Sport · Reel",       poster: "reels/02.jpg",        embed: "", video: "" },
  ],
};
