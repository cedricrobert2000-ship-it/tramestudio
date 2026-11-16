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
  zone: "France et étranger",      // ← votre zone d'intervention
  timezone: "Europe/Paris",

  /* Vidéo d'ambiance du hero de l'accueil (muette, en boucle).
     Pour passer à Alone : desktop "videos/loop-alone.mp4", poster "cinema/alone.jpg". */
  heroVideo: {
    desktop: "videos/hero-myslf.mp4",        poster: "hero/hero-myslf.jpg",
    mobile:  "videos/hero-myslf-mobile.mp4", posterMobile: "hero/hero-myslf-mobile.jpg",
  },          // ← fuseau de l'horloge du bandeau

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
    { img: "works/alone.jpg",           year: "2026", cat: "influence" },
    { img: "works/diag-capuche.jpg",   year: "2026", cat: "sport" },
    { img: "works/mariage-balcon.jpg", year: "2026", cat: "mariage" },
    { img: "works/diag-orange.jpg",    year: "2026", cat: "sport" },
    { img: "works/mariage-haie.jpg",   year: "2026", cat: "mariage" },
    { img: "works/diag-arrivee.jpg",   year: "2026", cat: "sport" },
    { img: "works/influence-parfum.jpg", year: "2026", cat: "influence" },
    { img: "works/mariage-main.jpg",   year: "2026", cat: "mariage" },
    { img: "works/alone-2.jpg",         year: "2026", cat: "influence" },
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
        text: "Plus de 160 km à travers La Réunion, de jour comme de nuit. Nous avons suivi un coureur du début à la fin : la préparation, les ravitaillements, la nuit et l'arrivée.",
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
    // Vidéos hébergées sur le site (dossier videos/) : lues directement, sans Instagram ni TikTok
    reels: [
      { title: "Sauvage",   client: "Yayha · Dior", poster: "influence/sauvage-parfum.jpg",   video: "videos/sauvage.mp4",   preview: "videos/sauvage-preview.mp4" },
      { title: "MYSLF",     client: "Yayha · YSL",  poster: "influence/myslf.jpg",     video: "videos/myslf.mp4",     preview: "videos/myslf-preview.mp4" },
      { title: "Paradigme", client: "Yayha · Prada", poster: "influence/paradigme.jpg", video: "videos/paradigme.mp4", preview: "videos/paradigme-preview.mp4" },
    ],
    // ALONE — photo & vidéo de marque
    alone: {
      films: [
        { format: "film", title: "Alone", tag: "Film de marque", poster: "films/alone.jpg", video: "videos/alone-film.mp4", preview: "videos/alone-film-preview.mp4" },
        { format: "reel", title: "Alone", tag: "Reel de marque", poster: "influence/alone-reel.jpg", video: "videos/alone-reel.mp4", preview: "videos/alone-reel-preview.mp4" },
      ],
      photos: ["alone/01", "alone/02", "alone/03", "alone/04", "alone/05"],
    },
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
        desc: "Le site d'un think tank européen indépendant : ses projets, ses publications, ses événements et une page pour le soutenir.",
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
        domain: "albaconvoyage (site de démonstration)",
        desc: "Un site vitrine pour une entreprise de convoyage de véhicules : devis en 30 minutes, services et prix affichés clairement.",
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
        desc: "Notre propre site : une page par activité, des galeries photo et des films lus directement sur le site.",
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
      { img: "cinema/alone.jpg",       video: "videos/loop-alone.mp4",   title: "Alone",              tag: "Film · Marque",    year: "2026", href: "influence.html#alone" },
      { img: "hero/hero-myslf.jpg",    video: "videos/hero-myslf.mp4",   title: "MYSLF",              tag: "Film · Parfum",    year: "2026", href: "influence.html#reels" },
      { img: "cinema/sauvage.jpg",     video: "videos/loop-sauvage.mp4", title: "Sauvage",            tag: "Film · Parfum",    year: "2026", href: "influence.html#reels" },
      { img: "cinema/diagonale.jpg",   title: "Diagonale des Fous", tag: "Film · Sport",     year: "2026", href: "cinema.html#films" },
      { img: "cinema/mariage.jpg",     title: "Un mariage",         tag: "Film · Mariage",   year: "2026", href: "cinema.html#films" },
      { img: "cinema/parfum.jpg",      title: "Voyage",             tag: "Films de voyage", year: "Bientôt", href: "cinema.html#voyage" },
      { img: "cinema/preparation.jpg", title: "Acting",             tag: "Courts-métrages",  year: "Bientôt", href: "cinema.html#acting" },
    ],
    voyage: [
      { format: "film", title: "Voyage 01", tag: "Voyage", poster: "", embed: "" },
      { format: "film", title: "Voyage 02", tag: "Voyage", poster: "", embed: "" },
    ],
    acting: [
      { format: "film", title: "Showreel acting", tag: "Acting", poster: "", embed: "" },
      { format: "film", title: "Court-métrage 01", tag: "Acting", poster: "", embed: "" },
    ],
  },

  /* Films & reels mis en avant sur l'accueil */
  films: [
    { format: "film", title: "Alone",     tag: "Marque · Film",       poster: "films/alone.jpg",         video: "videos/alone-film.mp4", preview: "videos/alone-film-preview.mp4" },
    { format: "reel", title: "Sauvage",   tag: "Influence · Yayha",   poster: "influence/sauvage-parfum.jpg",   video: "videos/sauvage.mp4",    preview: "videos/sauvage-preview.mp4" },
    { format: "reel", title: "MYSLF",     tag: "Influence · Yayha",   poster: "influence/myslf.jpg",     video: "videos/myslf.mp4",      preview: "videos/myslf-preview.mp4" },
    { format: "reel", title: "Paradigme", tag: "Influence · Yayha",   poster: "influence/paradigme.jpg", video: "videos/paradigme.mp4",  preview: "videos/paradigme-preview.mp4" },
    { format: "film", title: "Diagonale des Fous", tag: "Sport · Film", poster: "films/diagonale.jpg", embed: "", video: "" },
    { format: "reel", title: "Dossard 1635",       tag: "Sport · Reel", poster: "reels/01.jpg",        embed: "", video: "" },
  ],
};
