/* ==========================================================================
   TRAME STUDIO — interactions
   ========================================================================== */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const D = window.TRAME || {};
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (t = "") => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // chemin d'image local uniquement (lettres, chiffres, / . - _), sinon image vide
  const img = (path = "") => {
    const p = String(path);
    if (!/^[\w\-/]+(\.(jpe?g|png|webp|avif))?$/i.test(p) || p.includes("..")) return "";
    return esc(`images/${p}${/\.\w+$/.test(p) ? "" : ".jpg"}`);
  };
  // vidéo hébergée sur le site : fichier local .mp4/.webm du dossier videos/ uniquement
  const safeVideo = (v = "") => (/^videos\/[\w\-/]+\.(mp4|webm)$/i.test(v) && !v.includes("..") ? v : "");
  const cat = (key) => (D.categories || []).find((c) => c.key === key) || { label: key, href: "#" };
  const page = document.body.dataset.page || "home";
  const roll = (t) => `<span class="roll"><span>${esc(t)}</span><span aria-hidden="true">${esc(t)}</span></span>`;

  /* ---------- Menu et pied de page (communs à toutes les pages) ---------- */
  const LOGO = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 775 680" fill="currentColor"><g transform="translate(0 680) scale(1 -1)"><path transform="translate(-24 0)" d="M235 0V549H24V680H607V549H396V0Z"/><path transform="translate(567 0)" d="M48 0V161H208V0Z"/></g></svg>`;
  const navSlot = $("[data-nav]");
  if (navSlot) {
    const cats = D.categories || [];
    const onCat = cats.some((c) => c.key === page);
    navSlot.outerHTML = `
      <header class="nav">
        <a class="nav__logo" href="index.html" aria-label="Trame Studio, accueil">${LOGO}</a>
        <nav class="nav__links" aria-label="Navigation principale">
          <a class="nav__home" href="index.html"${page === "home" ? ' aria-current="page"' : ""}>${roll("Accueil,")}</a>
          <div class="nav__drop">
            <button class="nav__trigger" aria-expanded="false" aria-controls="nav-panel"${onCat ? ' data-current="true"' : ""}>${roll("Photo & vidéo,")}</button>
            <div class="nav__panel" id="nav-panel">
              ${cats.map((c, i) => `<a href="${esc(c.href)}"${c.key === page ? ' aria-current="page"' : ""}><span class="nav__n">0${i + 1}</span><span class="nav__label">${esc(c.label)}</span><span class="nav__arrow" aria-hidden="true">↗</span></a>`).join("")}
            </div>
          </div>
          <a href="digital.html"${page === "digital" ? ' aria-current="page"' : ""}>${roll("Digital,")}</a>
          <a href="contact.html"${page === "contact" ? ' aria-current="page"' : ""}>${roll("Contact")}</a>
        </nav>
      </header>`;
  }
  const footSlot = $("[data-footer]");
  if (footSlot) {
    footSlot.outerHTML = `
      <footer class="footer" id="contact">
        <div class="container footer__top">
          <div class="footer__cta">
            <p class="footer__brand blur-in">Trame Studio®</p>
            <h2 class="footer__title blur-in">Vous avez une histoire à raconter ? Mariage, course, marque ou site web : parlons de votre projet.</h2>
            <a class="btn blur-in" data-mail href="#">${roll("Nous contacter")}</a>
          </div>
          <div class="footer__cols">
            <div><p>Photo & vidéo</p>${D.categories.map((c) => `<a href="${esc(c.href)}">${esc(c.label)}</a>`).join("")}</div>
            <div><p>Digital</p><a href="digital.html">Sites web</a><a href="digital.html#expertises">Applications</a><a href="digital.html#expertises">Branding</a></div>
            <div><p>Réseaux</p><a data-insta href="#" target="_blank" rel="noopener noreferrer">Instagram</a><a data-mail href="#">E-mail</a></div>
          </div>
        </div>
        <div class="container footer__bar">
          <span>Trame ${new Date().getFullYear()}. Tous droits réservés.</span>
          <span data-zone></span>
          <span data-clock>--:--:--</span>
          <a href="mentions-legales.html">Mentions légales</a>
        </div>
        <div class="footer__marquee" aria-hidden="true"><div><span>Trame Creative Studio</span><span>Trame Creative Studio</span><span>Trame Creative Studio</span><span>Trame Creative Studio</span></div></div>
      </footer>`;
  }
  const lbSlot = $("[data-lightbox]");
  if (lbSlot) {
    lbSlot.outerHTML = `
      <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Visionneuse" hidden>
        <button class="lightbox__close">Fermer</button>
        <button class="lightbox__nav lightbox__prev" aria-label="Précédent">←</button>
        <figure class="lightbox__stage"><div class="lightbox__media"></div><figcaption class="lightbox__cap"></figcaption></figure>
        <button class="lightbox__nav lightbox__next" aria-label="Suivant">→</button>
      </div>`;
  }

  /* ---------- Coordonnées ---------- */
  // tous les boutons « contact » mènent au formulaire, avec le type de projet pré-sélectionné
  const projectFrom = (t = "") => {
    t = t.toLowerCase();
    if (t.includes("mariage")) return "Mariage";
    if (t.includes("sport")) return "Sport";
    if (t.includes("influence")) return "Influence";
    if (t.includes("hôtel") || t.includes("logement")) return "Hôtel / logement";
    if (t.includes("digital") || t.includes("site")) return "Site web / app";
    return "";
  };
  $$("[data-mail]").forEach((a) => {
    const p = projectFrom(a.dataset.mail);
    a.href = "contact.html" + (p ? `?projet=${encodeURIComponent(p)}` : "");
  });
  $$("[data-insta]").forEach((a) => (a.href = `https://instagram.com/${encodeURIComponent(D.instagram || "")}`));
  $$("[data-mail-text]").forEach((a) => (a.textContent = D.email || ""));
  $$("[data-zone]").forEach((el) => (el.textContent = D.zone));

  /* ---------- Horloge en direct ---------- */
  const clocks = $$("[data-clock]");
  const fmt = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: D.timezone || "Europe/Paris" });
  const tick = () => clocks.forEach((c) => (c.textContent = fmt.format(new Date())));
  if (clocks.length) { tick(); setInterval(tick, 1000); }

  /* ---------- Visionneuse ---------- */
  const lb = $("#lightbox");
  let list = [], idx = 0, lastFocus;
  const embedUrl = (url = "") => {
    if (!/^https:\/\/(www\.|m\.)?(youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com|instagram\.com|tiktok\.com)\//i.test(url)) return "";
    const yt = url.match(/(?:youtu\.be\/|v=|shorts\/)([\w-]{11})/);
    if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`;
    const vm = url.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1&dnt=1`;
    const ig = url.match(/instagram\.com\/(?:reel|p)\/([\w-]+)/);
    if (ig) return `https://www.instagram.com/p/${ig[1]}/embed/`;
    const tt = url.match(/tiktok\.com\/.*video\/(\d+)/);
    if (tt) return `https://www.tiktok.com/embed/v2/${tt[1]}`;
    return "";
  };
  const render = () => {
    const it = list[idx], box = $(".lightbox__media", lb);
    box.innerHTML = "";
    if (it.embed && embedUrl(it.embed)) {
      const f = document.createElement("iframe");
      Object.assign(f, { src: embedUrl(it.embed), allow: "autoplay; fullscreen; picture-in-picture; encrypted-media", allowFullscreen: true, title: it.title || "Vidéo", referrerPolicy: "strict-origin-when-cross-origin" });
      if (/instagram\.com|tiktok\.com/.test(it.embed)) f.className = "is-social";
      else if (it.vertical) f.className = "is-vertical";
      box.append(f);
    } else if (safeVideo(it.video)) {
      const v = document.createElement("video");
      Object.assign(v, { src: safeVideo(it.video), poster: it.poster || "", controls: true, autoplay: true, playsInline: true });
      box.append(v);
    } else {
      const i = new Image(); i.src = it.src; i.alt = it.title || ""; box.append(i);
    }
    $(".lightbox__cap", lb).textContent = `${it.title || ""}${list.length > 1 ? `  ·  ${idx + 1} / ${list.length}` : ""}`;
    $$(".lightbox__nav", lb).forEach((b) => (b.style.visibility = list.length > 1 ? "" : "hidden"));
  };
  const open = (items, i = 0) => { if (!lb || !items.length) return; lastFocus = document.activeElement; list = items; idx = Math.max(0, i); render(); lb.hidden = false; document.body.style.overflow = "hidden"; $(".lightbox__close", lb).focus(); };
  const close = () => { lb.hidden = true; $(".lightbox__media", lb).innerHTML = ""; document.body.style.overflow = ""; lastFocus && lastFocus.focus(); };
  const step = (d) => { idx = (idx + d + list.length) % list.length; render(); };
  if (lb) {
    $(".lightbox__close", lb).addEventListener("click", close);
    $(".lightbox__prev", lb).addEventListener("click", () => step(-1));
    $(".lightbox__next", lb).addEventListener("click", () => step(1));
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lightbox__media")) close(); });
    addEventListener("keydown", (e) => {
      if (lb.hidden) return;
      if (e.key === "Tab") {
        const f = $$("button, iframe, video", lb).filter((el) => el.offsetParent !== null);
        if (f.length) {
          const first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    });
    let sx = 0;
    lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    lb.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); });
  }

  /* ---------- Composants générés ---------- */
  const playable = (f) => !!(embedUrl(f.embed) || safeVideo(f.video));

  // Galerie photo (mosaïque) → visionneuse
  const gallery = (el, photos, title) => {
    const items = photos.map((p, i) => ({ src: img(p), title: `${title} — ${String(i + 1).padStart(2, "0")}` }));
    photos.forEach((p, i) => {
      const b = document.createElement("button");
      b.className = "shot rise";
      b.setAttribute("aria-label", `Agrandir ${items[i].title}`);
      b.innerHTML = `<img src="${img(p)}" alt="" loading="lazy">`;
      b.addEventListener("click", () => open(items, i));
      el.append(b);
    });
  };

  // Cartes vidéo (film 16:9 ou reel 9:16)
  const videoCards = (el, films) => {
    const playList = films.filter(playable).map((f) => ({ ...f, vertical: f.format === "reel", poster: f.poster ? img(f.poster) : "" }));
    let n = 0;
    films.forEach((f) => {
      const card = document.createElement(playable(f) ? "button" : "div");
      card.className = `film film--${f.format === "film" ? "film" : "reel"} rise${f.poster ? "" : " film--typo"}`;
      card.innerHTML = `${f.poster ? `<img src="${img(f.poster)}" alt="" loading="lazy">` : `<span class="film__word">${esc(f.client || f.title)}</span>`}
        ${playable(f) ? `<span class="film__play" aria-hidden="true">▶</span>` : `<span class="film__state">Bientôt</span>`}
        <span class="film__meta"><span class="film__tag">${esc(f.tag || f.client || "")}</span><span class="film__title">${esc(f.title)}</span></span>`;
      if (playable(f)) {
        card.setAttribute("aria-label", `Lire ${f.title}`);
        const at = n++;
        card.addEventListener("click", () => open(playList, at));
      }
      el.append(card);
    });
  };

  // Accueil : bandeau des travaux (année + catégorie, lien vers la page)
  const track = $("#works-track");
  if (track && D.works) {
    const card = (w, hidden) => {
      const c = cat(w.cat);
      return `<a class="work" href="${esc(c.href)}"${hidden ? ' tabindex="-1" aria-hidden="true"' : ` aria-label="${esc(c.label)}, ${w.year}"`}>
        <img src="${img(w.img)}" alt="" loading="lazy">
        <span class="work__meta"><span class="work__tag">${esc(w.year)}</span><span class="work__title">${esc(c.label)}</span></span>
      </a>`;
    };
    track.innerHTML = D.works.map((w) => card(w)).join("") + D.works.map((w) => card(w, true)).join("");
  }

  // Accueil : films & reels
  const homeFilms = $("#films-grid");
  if (homeFilms && D.films) videoCards(homeFilms, D.films);

  // Page mariage
  const mGal = $("[data-gallery='mariage']");
  if (mGal && D.mariage) gallery(mGal, D.mariage.photos, "Mariage");

  // Page sport : une section par session
  const sessions = $("#sessions");
  if (sessions && D.sport) {
    D.sport.sessions.forEach((s) => {
      const sec = document.createElement("section");
      sec.className = "session";
      sec.innerHTML = `
        <div class="container session__head">
          <span class="session__n blur-in">Session ${esc(s.n)}</span>
          <h2 class="blur-in">${esc(s.title)}</h2>
          <div class="session__info blur-in"><span>${esc(s.place)}</span><span>${esc(s.date)}</span></div>
          <p class="session__text blur-in">${esc(s.text)}</p>
        </div>
        ${s.films && s.films.length ? `<div class="container films session__films"></div>` : ""}
        <div class="container gallery"></div>`;
      sessions.append(sec);
      if (s.films && s.films.length) videoCards($(".session__films", sec), s.films);
      gallery($(".gallery", sec), s.photos, s.title);
    });
  }

  // Page influence : reels
  const reels = $("#reels-grid");
  if (reels && D.influence) videoCards(reels, D.influence.reels.map((r) => ({ ...r, format: "reel", tag: r.client })));

  /* ---------- Menu : liste déroulante « Travaux » ---------- */
  const drop = $(".nav__drop"), trigger = $(".nav__trigger");
  if (drop && trigger) {
    const isOpen = () => drop.classList.contains("is-open");
    const set = (o) => {
      drop.classList.toggle("is-open", o);
      trigger.setAttribute("aria-expanded", o);
      // fermeture explicite : on neutralise le survol jusqu'à ce que la souris quitte le menu
      if (!o) drop.classList.add("is-closing");
    };
    drop.addEventListener("mouseleave", () => drop.classList.remove("is-closing"));
    trigger.addEventListener("click", (e) => { e.stopPropagation(); drop.classList.remove("is-closing"); set(!isOpen()); });
    document.addEventListener("click", (e) => { if (!drop.contains(e.target)) set(false); });
    // clavier : ouverture quand un lien de la liste reçoit le focus, fermeture quand il le perd
    drop.addEventListener("focusin", (e) => { if (e.target !== trigger) { drop.classList.remove("is-closing"); set(true); } });
    drop.addEventListener("focusout", (e) => { if (!drop.contains(e.relatedTarget)) set(false); });
    addEventListener("keydown", (e) => { if (e.key === "Escape" && (isOpen() || drop.matches(":hover"))) { set(false); trigger.focus(); } });
    addEventListener("scroll", () => { if (drop.classList.contains("is-open") && !drop.matches(":hover")) set(false); }, { passive: true });
  }

  /* ---------- Découpage en lettres ---------- */
  $$("[data-chars]").forEach((el) => {
    const text = el.textContent;
    el.setAttribute("aria-label", text);
    el.textContent = "";
    // lettres regroupées par mot : un mot ne se coupe jamais en fin de ligne
    let i = 0;
    text.split(" ").forEach((word, w) => {
      if (w) { el.append(" "); i++; }
      const box = document.createElement("span");
      box.className = "cw";
      [...word].forEach((ch) => {
        const c = document.createElement("span");
        c.className = "c"; c.setAttribute("aria-hidden", "true");
        c.style.setProperty("--i", i++);
        c.textContent = ch;
        box.append(c);
      });
      el.append(box);
    });
  });

  /* ---------- Écran d'ouverture (accueil) et entrée des titres ---------- */
  const loader = $(".loader");
  const heroChars = $$(".hero [data-chars], .page-title[data-chars], .page-title [data-chars]");
  heroChars.forEach((el, n) => el.style.setProperty("--d", `${n * 260}ms`));
  const start = () => {
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
    heroChars.forEach((el) => el.classList.add("is-in"));
    setTimeout(() => $$(".hero .blur-in, .hero .rise").forEach((el) => el.classList.add("is-in")), 500);
    // titre principal « pris en photo » : viseur qui cadre, mise au point, déclenchement
    if (!reduced) {
      const h1 = $("h1");
      if (h1) {
        const vf = document.createElement("span");
        vf.className = "vf";
        vf.setAttribute("aria-hidden", "true");
        vf.innerHTML = "<i></i><i></i><i></i><i></i>";
        h1.append(vf);
        h1.classList.add("shot-title");
        setTimeout(() => vf.remove(), 2600);
      }
    }
  };
  let seen = false;
  try { seen = sessionStorage.getItem("trame-intro"); sessionStorage.setItem("trame-intro", "1"); } catch {}
  if (!loader || reduced || seen) {
    loader && loader.classList.add("is-done");
    requestAnimationFrame(start);
  } else {
    requestAnimationFrame(() => $(".loader__word").classList.add("is-in"));
    let fired = false;
    const go = () => {
      if (fired) return; fired = true;
      setTimeout(() => { loader.classList.add("is-out"); setTimeout(start, 350); setTimeout(() => loader.classList.add("is-done"), 1600); }, 900);
    };
    if (document.readyState === "complete") go(); else addEventListener("load", go, { once: true });
    setTimeout(go, 2600);
  }

  /* ---------- Texte qui s'allume mot à mot au scroll ---------- */
  $$("[data-words]").forEach((el) => {
    const words0 = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words0.forEach((w, i) => {
      const sp = document.createElement("span"); sp.className = "w"; sp.textContent = w;
      el.append(sp, i < words0.length - 1 ? " " : "");
    });
    const words = $$(".w", el);
    if (reduced) { words.forEach((w) => w.classList.add("is-on")); return; }
    const update = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height + innerHeight * .3)));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("is-on", i < n));
    };
    addEventListener("scroll", update, { passive: true }); update();
  });

  /* ---------- Formulaire de contact (envoi via FormSubmit, sans serveur) ---------- */
  const form = $("#contact-form");
  if (form) {
    const status = $(".cform__status", form), btn = $(".cform__submit", form);
    const opened = Date.now();
    // type de projet pré-sélectionné depuis l'URL (?projet=…)
    const wanted = new URLSearchParams(location.search).get("projet");
    if (wanted) $$('input[name="projet"]', form).forEach((r) => { if (r.value === wanted) r.checked = true; });
    // nettoyage : caractères de contrôle retirés, longueur limitée
    const clean = (v, max) => String(v || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
    const say = (msg, bad) => { status.textContent = msg; status.classList.toggle("is-error", !!bad); };
    const done = () => { form.hidden = true; const d = $(".cform__done"); d.hidden = false; d.scrollIntoView({ block: "center" }); };
    form.addEventListener("input", (e) => { const c = e.target.closest(".cfield"); if (c) c.classList.remove("is-error"); });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = new FormData(form);
      // robots : champ piège rempli ou envoi en moins de 3 s → on simule un succès sans rien envoyer
      if (f.get("_honey") || Date.now() - opened < 3000) { done(); return; }
      // anti-spam : un envoi par minute et par onglet
      try {
        const last = +sessionStorage.getItem("trame-sent") || 0;
        if (Date.now() - last < 60000) { say("Votre message vient d'être envoyé. Patientez une minute avant d'en envoyer un autre.", true); return; }
      } catch {}
      const data = {
        nom: clean(f.get("nom"), 80), email: clean(f.get("email"), 120), telephone: clean(f.get("telephone"), 30),
        projet: clean(f.get("projet"), 40), date: clean(f.get("date"), 60), budget: clean(f.get("budget"), 40), message: clean(f.get("message"), 3000),
      };
      let ok = true;
      const mark = (name, bad) => { const c = form.elements[name].closest(".cfield"); if (c) c.classList.toggle("is-error", bad); if (bad) ok = false; };
      mark("nom", data.nom.length < 2);
      mark("email", !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email));
      mark("message", data.message.length < 10);
      if (!ok) { say("Merci de vérifier les champs en rouge.", true); return; }
      if (!form.elements.consentement.checked) { say("Merci de cocher la case de consentement.", true); return; }
      const target = D.formAlias ? encodeURIComponent(D.formAlias) : D.email;
      btn.disabled = true; say("Envoi en cours…");
      try {
        const res = await fetch(`https://formsubmit.co/ajax/${target}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            _subject: `Nouvelle demande — ${data.projet} — ${data.nom}`,
            _template: "table", _captcha: "false", _replyto: data.email,
            "Projet": data.projet, "Nom": data.nom, "E-mail": data.email, "Téléphone": data.telephone || "—",
            "Date / période": data.date || "—", "Budget": data.budget, "Message": data.message,
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || String(json.success) !== "true") throw new Error(json.message || "Envoi refusé");
        try { sessionStorage.setItem("trame-sent", String(Date.now())); } catch {}
        done();
      } catch (err) {
        btn.disabled = false;
        say("L'envoi n'a pas abouti. Réessayez dans un instant, ou écrivez-nous sur Instagram.", true);
      }
    });
  }

  /* ---------- Digital : réalisations immersives (le site défile dans l'écran) ---------- */
  const casesWrap = $("#cases");
  if (casesWrap && D.digital && D.digital.projects) {
    const projects = D.digital.projects;
    const total = String(projects.length).padStart(2, "0");
    casesWrap.innerHTML = projects.map((p, i) => {
      const url = /^https:\/\//.test(p.url || "") ? p.url : "";
      const color = /^#[0-9a-f]{3,8}$/i.test(p.color || "") ? p.color : "#0b0b0b";
      return `
      <article class="case-x${p.grain ? " case-x--grain" : ""}" data-color="${color}" aria-label="${esc(p.name)}">
        <div class="case-x__sticky">
          <div class="container case-x__grid">
            <div class="case-x__info">
              <span class="case-x__n">${String(i + 1).padStart(2, "0")} / ${total}</span>
              <p class="case-x__type">${esc(p.type)}</p>
              <h3 class="case-x__name">${esc(p.name)}</h3>
              <p class="case-x__desc">${esc(p.desc)}</p>
              <ul class="case-x__tags">${(p.tags || []).map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
              ${url ? `<a class="btn btn--light" href="${esc(url)}" target="_blank" rel="noopener noreferrer"><span class="roll"><span>Voir le site ↗</span><span aria-hidden="true">Voir le site ↗</span></span></a>` : ""}
            </div>
            <div class="case-x__stage">
              <div class="case-x__browser">
                <div class="browser__bar" aria-hidden="true"><i></i><i></i><i></i><span>${esc(p.domain || "")}</span></div>
                <div class="case-x__screen"><img class="case-x__shot" src="${img(p.desktop)}" alt="Capture du site ${esc(p.name)} sur ordinateur" loading="lazy" decoding="async"></div>
              </div>
              <div class="case-x__phone">
                <div class="case-x__screen"><img class="case-x__shot" src="${img(p.mobile)}" alt="Capture du site ${esc(p.name)} sur mobile" loading="lazy" decoding="async"></div>
              </div>
            </div>
          </div>
          <div class="case-x__progress" aria-hidden="true"><i></i></div>
        </div>
      </article>`;
    }).join("");

    const cases = $$(".case-x", casesWrap);
    const section = $(".cases");
    const clamp = (v) => Math.min(1, Math.max(0, v));
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = innerHeight;
      let active = null;
      cases.forEach((c) => {
        const r = c.getBoundingClientRect();
        const run = r.height - vh;                       // distance de défilement « collée »
        const p = clamp(-r.top / run);                   // 0 → 1 pendant que la section est collée
        const enter = clamp((vh - r.top) / vh);          // 0 → 1 à l'arrivée de la section
        if (r.top < vh * .5 && r.bottom > vh * .5) active = c;
        c.style.setProperty("--enter", enter.toFixed(3));
        $(".case-x__progress i", c).style.transform = `scaleX(${p.toFixed(3)})`;
        $$(".case-x__screen", c).forEach((screen) => {
          const shot = $(".case-x__shot", screen);
          const max = shot.offsetHeight - screen.clientHeight;
          if (max > 0) shot.style.transform = `translate3d(0, ${(-p * max).toFixed(1)}px, 0)`;
        });
        c.classList.toggle("is-active", c === active);
      });
      // menu en blanc tant que le haut de l'écran est sur un projet (fond sombre)
      const atTop = cases.some((c) => { const r = c.getBoundingClientRect(); return r.top <= 60 && r.bottom > 60; });
      document.body.classList.toggle("nav-on-dark", atTop);
      if (section) {
        section.classList.toggle("is-on", !!active);
        if (active) section.style.setProperty("--case-bg", active.dataset.color);
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    $$(".case-x__shot", casesWrap).forEach((im) => im.addEventListener("load", onScroll));
    update();
  }

  /* ---------- Services : traînée de photos qui suit la souris ---------- */
  const trailRows = $$("[data-trail]");
  if (trailRows.length && matchMedia("(hover: hover) and (pointer: fine)").matches && !reduced) {
    const layer = document.createElement("div");
    layer.className = "trail";
    layer.setAttribute("aria-hidden", "true");
    document.body.append(layer);
    const MAX = 12, STEP = 90; // nombre max d'images à l'écran, distance (px) entre deux images
    trailRows.forEach((row) => {
      const srcs = row.dataset.trail.split(",").map((n) => img(`trail/${n.trim()}`)).filter(Boolean);
      let i = 0, last = null, loaded = false;
      const preload = () => { if (loaded) return; loaded = true; srcs.forEach((u) => { const im = new Image(); im.src = u; }); };
      row.addEventListener("mouseenter", preload);
      row.addEventListener("mouseleave", () => (last = null));
      row.addEventListener("mousemove", (e) => {
        const x = e.clientX, y = e.clientY;
        if (last && Math.hypot(x - last.x, y - last.y) < STEP) return;
        last = { x, y };
        const pic = document.createElement("img");
        pic.className = "trail__img";
        pic.alt = "";
        pic.src = srcs[i++ % srcs.length];
        pic.style.left = `${x}px`;
        pic.style.top = `${y}px`;
        const rot = (Math.random() * 14 - 7).toFixed(1);
        layer.append(pic);
        while (layer.children.length > MAX) layer.firstElementChild.remove();
        pic.animate([
          { opacity: 0, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(.6)` },
          { opacity: 1, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(1)`, offset: .12 },
          { opacity: 1, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(1)`, offset: .72 },
          { opacity: 0, transform: `translate(-50%, -38%) rotate(${rot}deg) scale(.9)` },
        ], { duration: 2400, easing: "cubic-bezier(.22, 1, .36, 1)" }).onfinish = () => pic.remove();
      });
    });
  }

  /* ---------- Apparitions au scroll (flou → net, montée) ---------- */
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in");
    io.unobserve(e.target);
  }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  $$(".stats, .steps, .faq__list, .service, .films, .gallery, .offer, .points").forEach((group) => {
    $$(".rise", group).forEach((el, i) => (el.style.transitionDelay = `${Math.min(i, 8) * 80}ms`));
  });
  // les rangées qui défilent horizontalement (films sur mobile) apparaissent d'un bloc
  const rowIo = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    $$(".rise", e.target).forEach((el) => el.classList.add("is-in"));
    rowIo.unobserve(e.target);
  }), { threshold: .1 });
  $$(".films").forEach((row) => rowIo.observe(row));
  $$(".blur-in, .rise").forEach((el) => { if (!el.closest(".hero") && !el.closest(".films")) io.observe(el); });

  /* ---------- Défilement doux (molette et pavé tactile, ordinateur uniquement) ---------- */
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer && !reduced) {
    document.documentElement.classList.add("smooth");
    let target = scrollY, current = scrollY, running = false;
    const maxY = () => document.documentElement.scrollHeight - innerHeight;
    const step = () => {
      current += (target - current) * 0.1;
      if (Math.abs(target - current) < 0.5) { current = target; running = false; }
      scrollTo(0, current);
      if (running) requestAnimationFrame(step);
    };
    const go = (y) => {
      target = Math.max(0, Math.min(maxY(), y));
      if (!running) { running = true; current = scrollY; requestAnimationFrame(step); }
    };
    // ne pas détourner : zoom, défilement horizontal, éléments défilants, visionneuse ouverte
    const scrollableParent = (el) => {
      for (; el && el !== document.body; el = el.parentElement) {
        const s = getComputedStyle(el);
        if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight) return true;
      }
      return false;
    };
    addEventListener("wheel", (e) => {
      if (e.ctrlKey || e.defaultPrevented || document.body.style.overflow === "hidden") return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || scrollableParent(e.target)) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? innerHeight : 1;
      go((running ? target : scrollY) + e.deltaY * unit);
    }, { passive: false });
    // clavier, barre de défilement, liens : on se recale sur la position réelle
    addEventListener("scroll", () => { if (!running) target = current = scrollY; }, { passive: true });
    // ancres internes (#contact, #services…) : glissé doux
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href*="#"]');
      if (!a || e.defaultPrevented) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      const dest = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!dest) return;
      e.preventDefault();
      history.pushState(null, "", url.hash);
      go(dest.getBoundingClientRect().top + scrollY);
    });
  }

  /* ---------- Curseur « objectif photo » (pages photo & vidéo) ---------- */
  if (finePointer && !reduced && !document.body.classList.contains("theme-light")) {
    const lens = document.createElement("div");
    lens.className = "lens";
    lens.setAttribute("aria-hidden", "true");
    lens.innerHTML = '<span class="lens__ring"></span><span class="lens__iris"></span><span class="lens__dot"></span>';
    document.body.append(lens);
    document.body.classList.add("has-lens");
    let mx = -100, my = -100, lx = mx, ly = my;
    addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; lens.classList.add("is-on"); }, { passive: true });
    document.addEventListener("mouseleave", () => lens.classList.remove("is-on"));
    addEventListener("mousedown", () => lens.classList.add("is-shot"));
    addEventListener("mouseup", () => lens.classList.remove("is-shot"));
    const HOVER = "a, button, summary, label, input, textarea, .work, .film, .shot, .reel";
    document.addEventListener("mouseover", (e) => lens.classList.toggle("is-focus", !!e.target.closest(HOVER)));
    (function loop() {
      lx += (mx - lx) * 0.22; ly += (my - ly) * 0.22;
      lens.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
      lens.style.setProperty("--dx", `${(mx - lx).toFixed(1)}px`);
      lens.style.setProperty("--dy", `${(my - ly).toFixed(1)}px`);
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Parallaxe légère du header ---------- */
  const heroImg = $(".hero__img img");
  if (heroImg && !reduced) {
    let raf = 0;
    addEventListener("scroll", () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; heroImg.style.translate = `0 ${Math.min(scrollY, innerHeight) * .3}px`; });
    }, { passive: true });
  }
})();
