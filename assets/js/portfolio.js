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
  { cat: "mariage",   src: "images/mariage/01.jpg",   title: "Les préparatifs",       ratio: "4/5" },
  { cat: "lieux",     src: "images/lieux/01.jpg",     title: "Villa en bord de mer",  ratio: "3/2" },
  { cat: "createurs", src: "images/createurs/01.jpg", title: "Shooting lifestyle",    ratio: "4/5" },
  { cat: "marques",   src: "images/marques/01.jpg",   title: "Portrait de dirigeante", ratio: "1/1" },
  { cat: "sport",     src: "images/sport/01.jpg",     title: "Dans l'action",         ratio: "3/2" },
  { cat: "mariage",   src: "images/mariage/02.jpg",   title: "La cérémonie",          ratio: "3/2" },
  { cat: "createurs", src: "images/createurs/02.jpg", title: "Collab mode",           ratio: "9/16" },
  { cat: "lieux",     src: "images/lieux/02.jpg",     title: "Chambre d'hôtel",       ratio: "4/5" },
  { cat: "marques",   src: "images/marques/02.jpg",   title: "Packshot produit",      ratio: "4/5" },
  { cat: "sport",     src: "images/sport/02.jpg",     title: "Portrait d'athlète",    ratio: "4/5" },
  { cat: "mariage",   src: "images/mariage/03.jpg",   title: "Première danse",        ratio: "4/5" },
  { cat: "lieux",     src: "images/lieux/03.jpg",     title: "Gîte en pleine nature", ratio: "3/2" },
  { cat: "createurs", src: "images/createurs/03.jpg", title: "Voyage & contenu",      ratio: "1/1" },
  { cat: "marques",   src: "images/marques/03.jpg",   title: "Équipe en action",      ratio: "3/2" },
  { cat: "sport",     src: "images/sport/03.jpg",     title: "Jour de match",         ratio: "1/1" },
  // Exemple vidéo :
  // { cat: "mariage", src: "images/mariage/film-cover.jpg", video: "videos/mariage-teaser.mp4", title: "Teaser du mariage", ratio: "3/2" },
  // Exemple YouTube / Vimeo :
  // { cat: "mariage", src: "images/mariage/film-cover.jpg", embed: "https://vimeo.com/123456789", title: "Film de mariage", ratio: "3/2" },
];

/* ==========================================================================
   REELS — vos vidéos verticales (9:16), en .mp4 courts et légers.
     video  : chemin de la vidéo (ex. videos/reels/01.mp4)
     poster : image affichée avant lecture
   ========================================================================== */

window.TRAME_REELS = [
  { cat: "createurs", video: "videos/reels/01.mp4", poster: "images/reels/01.jpg", title: "Get ready with me",      client: "Créatrice lifestyle" },
  { cat: "lieux",     video: "videos/reels/02.mp4", poster: "images/reels/02.jpg", title: "Visite en 30 secondes",  client: "Location saisonnière" },
  { cat: "mariage",   video: "videos/reels/03.mp4", poster: "images/reels/03.jpg", title: "Teaser du jour J",       client: "Mariage" },
  { cat: "sport",     video: "videos/reels/04.mp4", poster: "images/reels/04.jpg", title: "Highlights du match",    client: "Club sportif" },
  { cat: "marques",   video: "videos/reels/05.mp4", poster: "images/reels/05.jpg", title: "Coulisses de marque",    client: "Marque locale" },
  { cat: "createurs", video: "videos/reels/06.mp4", poster: "images/reels/06.jpg", title: "Transition outfit",      client: "Influenceuse mode" },
  { cat: "lieux",     video: "videos/reels/07.mp4", poster: "images/reels/07.jpg", title: "Golden hour à l'hôtel",  client: "Hôtellerie" },
];
