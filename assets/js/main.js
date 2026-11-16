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
        <div class="footer__bg" aria-hidden="true"></div>
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
  // footer : vidéo Alone en fond (côté photo & vidéo uniquement), chargée quand le footer arrive à l'écran
  const footBg = $(".footer__bg");
  if (footBg && !document.body.classList.contains("theme-light")) {
    const foot = footBg.parentElement;
    foot.classList.add("footer--video");
    footBg.innerHTML = '<img src="images/films/footer-alone-film.jpg" alt="" loading="lazy" decoding="async"><span class="footer__grain"></span>';
    if (!reduced && !(navigator.connection && navigator.connection.saveData)) {
      let v = null, inView = false;
      new IntersectionObserver(([en]) => {
        inView = en.isIntersecting;
        if (en.isIntersecting) {
          if (!v) {
            v = document.createElement("video");
            // attributs posés avant la source : indispensable pour la lecture automatique sur iPhone / Safari
            ["muted", "loop", "playsinline", "webkit-playsinline", "autoplay"].forEach((a) => v.setAttribute(a, ""));
            v.muted = true; v.defaultMuted = true; v.playsInline = true;
            v.preload = "auto";
            v.poster = "images/films/footer-alone-film.jpg";
            v.addEventListener("playing", () => foot.classList.add("is-playing"), { once: true });
            v.addEventListener("canplay", () => { if (v.paused && inView) v.play().catch(() => {}); });
            v.src = "videos/footer-alone-film.mp4";
            footBg.prepend(v);
          }
          v.play().catch(() => {});
        } else if (v) v.pause();
      }, { rootMargin: "200px 0px" }).observe(foot);
    }
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

  /* ---------- Sound design (sons synthétisés en direct, aucun fichier) ---------- */
  const Sound = (() => {
    let ctx = null, master = null, noise = null;
    let on = true;
    try { on = localStorage.getItem("trame-sound") !== "off"; } catch {}
    const AC = window.AudioContext || window.webkitAudioContext;
    const init = () => {
      if (!AC) return false;
      if (!ctx) {
        ctx = new AC();
        master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
        noise = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
        const d = noise.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      return true;
    };
    const ready = () => on && ctx && ctx.state === "running";
    const env = (g, t, peak, attack, decay) => {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    };
    const burst = (t, { freq = 2000, q = 1, peak = 0.08, decay = 0.05, type = "bandpass" } = {}) => {
      const s = ctx.createBufferSource(); s.buffer = noise;
      const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
      const g = ctx.createGain(); env(g, t, peak, 0.002, decay);
      s.connect(f).connect(g).connect(master); s.start(t); s.stop(t + decay + 0.05);
    };
    const tone = (t, { freq = 1000, to, type = "sine", peak = 0.05, attack = 0.004, decay = 0.08 } = {}) => {
      const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t);
      if (to) o.frequency.exponentialRampToValueAtTime(to, t + attack + decay);
      const g = ctx.createGain(); env(g, t, peak, attack, decay);
      o.connect(g).connect(master); o.start(t); o.stop(t + attack + decay + 0.05);
    };
    let lastTick = 0;
    return {
      get on() { return on; },
      unlock: () => { if (on) init(); },
      set(v) { on = v; try { localStorage.setItem("trame-sound", v ? "on" : "off"); } catch {} if (v) init(); },
      // survol du menu et des boutons : déclencheur enfoncé à mi-course (petit « tick » mécanique)
      tick() {
        if (!ready()) return; const t = ctx.currentTime; if (t - lastTick < 0.06) return; lastTick = t;
        burst(t, { freq: 5200, q: 2.5, peak: 0.05, decay: 0.012 });
        burst(t + 0.018, { freq: 3400, q: 2, peak: 0.022, decay: 0.015 });
      },
      // mise au point du titre : moteur d'autofocus qui cherche, bips de confirmation, déclic
      focus(delay = 0) {
        if (!ready()) return; const t0 = ctx.currentTime + delay;
        const motor = (start, dur, f1, f2, peak) => {
          const o = ctx.createOscillator(); o.type = "sawtooth";
          o.frequency.setValueAtTime(f1, start); o.frequency.linearRampToValueAtTime(f2, start + dur);
          const lfo = ctx.createOscillator(); lfo.frequency.value = 38;
          const lg = ctx.createGain(); lg.gain.value = 18; lfo.connect(lg).connect(o.frequency);
          const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1100; bp.Q.value = 3;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.0001, start);
          g.gain.exponentialRampToValueAtTime(peak, start + 0.04);
          g.gain.setValueAtTime(peak, start + dur - 0.05);
          g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
          o.connect(bp).connect(g).connect(master);
          o.start(start); lfo.start(start); o.stop(start + dur + 0.05); lfo.stop(start + dur + 0.05);
        };
        motor(t0 + 0.15, 0.62, 140, 210, 0.035);   // recherche : flou → net
        motor(t0 + 0.92, 0.22, 190, 160, 0.025);   // léger retour, puis calage
        tone(t0 + 1.54, { freq: 2900, peak: 0.05, attack: 0.003, decay: 0.06 });  // bip 1 (viseur)
        tone(t0 + 1.73, { freq: 2900, peak: 0.05, attack: 0.003, decay: 0.06 });  // bip 2 (verrouillé)
        const s = t0 + 1.98;                                                    // déclic de l'obturateur
        burst(s, { freq: 2600, q: 0.9, peak: 0.16, decay: 0.035 });
        tone(s, { freq: 120, to: 60, peak: 0.08, decay: 0.07 });
        burst(s + 0.075, { freq: 1800, q: 1, peak: 0.1, decay: 0.05 });
      },
    };
  })();
  // déverrouillage au premier geste (règle des navigateurs : pas de son avant une interaction)
  ["pointerdown", "keydown", "touchstart"].forEach((ev) => addEventListener(ev, Sound.unlock, { once: true, passive: true }));
  Sound.unlock(); // fonctionne si le visiteur a déjà interagi avec le site (navigation interne)

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
      // aperçu muet au survol (vidéos hébergées sur le site)
      const prev = safeVideo(f.preview || "");
      if (prev && matchMedia("(hover: hover)").matches) {
        const v = document.createElement("video");
        Object.assign(v, { muted: true, loop: true, playsInline: true, preload: "none", className: "film__preview" });
        v.setAttribute("aria-hidden", "true");
        v.src = prev;
        card.prepend(v);
        card.addEventListener("mouseenter", () => { v.play().then(() => card.classList.add("is-previewing")).catch(() => {}); });
        card.addEventListener("mouseleave", () => { v.pause(); card.classList.remove("is-previewing"); });
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
  if (homeFilms && D.films) videoCards(homeFilms, D.films.slice(0, 4)); // l'accueil montre les 4 premiers

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
  const aloneFilms = $("#alone-films"), aloneGal = $("[data-gallery='alone']");
  if (D.influence && D.influence.alone) {
    if (aloneFilms) videoCards(aloneFilms, D.influence.alone.films);
    if (aloneGal) gallery(aloneGal, D.influence.alone.photos, "Alone");
  }

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
    if (!reduced && page === "home") playShot();
  };
  // mise au point du titre (rejouable quand on active le son)
  function playShot() {
    const h1 = $("h1");
    if (!h1) return;
    $$(".vf", h1).forEach((v) => v.remove());
    h1.classList.remove("shot-title");
    void h1.offsetWidth; // relance l'animation CSS
    const vf = document.createElement("span");
    vf.className = "vf";
    vf.setAttribute("aria-hidden", "true");
    vf.innerHTML = "<i></i><i></i><i></i><i></i>";
    h1.append(vf);
    h1.classList.add("shot-title");
    Sound.focus();
    setTimeout(() => vf.remove(), 2600);
  }

  /* ---------- Bouton son + déclencheurs sonores ---------- */
  {
    const btn = document.createElement("button");
    btn.className = "sound-toggle";
    btn.type = "button";
    btn.innerHTML = '<span class="sound-toggle__bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="sound-toggle__label"></span>';
    const sync = () => {
      btn.classList.toggle("is-on", Sound.on);
      btn.setAttribute("aria-pressed", Sound.on);
      btn.setAttribute("aria-label", Sound.on ? "Couper le son" : "Activer le son");
      $(".sound-toggle__label", btn).textContent = Sound.on ? "Son" : "Son off";
    };
    btn.addEventListener("click", () => {
      Sound.set(!Sound.on); sync();
      if (Sound.on) { Sound.tick(); if (page === "home" && !reduced && scrollY < innerHeight * 0.6) setTimeout(playShot, 120); }
    });
    sync();
    document.body.append(btn);
    // au-dessus du bandeau d'infos tant que le hero de l'accueil est visible
    if (page === "home") {
      const raise = () => btn.classList.toggle("is-raised", scrollY < innerHeight * 0.75);
      addEventListener("scroll", raise, { passive: true }); raise();
    }

    // survol : liens du menu et boutons principaux uniquement (comme le site de référence)
    document.addEventListener("pointerover", (e) => {
      if (e.pointerType !== "mouse") return;
      const t = e.target.closest(".nav__links > a, .nav__trigger, .nav__panel a, .btn");
      if (t && !t.contains(e.relatedTarget)) Sound.tick();
    });

  }
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

  /* ---------- Cinéma : carrousel 16:9 (accueil) ---------- */
  const cine = $("#cine-carousel");
  if (cine && D.cinema && D.cinema.slides && D.cinema.slides.length) {
    const slides = D.cinema.slides;
    const safeHref = (h = "") => (/^[\w\-./#]+$/.test(h) ? h : "cinema.html");
    cine.innerHTML = `
      <div class="cine__track">
        ${slides.map((s, i) => `
          <a class="cine__slide${i === 0 ? " is-active" : ""}" href="${esc(safeHref(s.href))}" aria-label="${esc(s.title)} — ${esc(s.tag)}" ${i ? 'tabindex="-1" aria-hidden="true"' : ""}>
            <img src="${img(s.img)}" alt="" ${i ? 'loading="lazy"' : ""} decoding="async">
            ${safeVideo(s.video || "") ? `<video class="cine__video" muted loop playsinline preload="${i ? "none" : "metadata"}" src="${esc(safeVideo(s.video))}" aria-hidden="true"></video>` : ""}
            <span class="cine__grain" aria-hidden="true"></span>
            <span class="cine__hud" aria-hidden="true">
              <span class="cine__rec"><i></i>SC ${String(i + 1).padStart(2, "0")} · TK 01</span>
              <span class="cine__tc">00:00:00:00</span>
            </span>
            <span class="cine__caption">
              <span class="cine__tag">${esc(s.tag)} — ${esc(s.year)}</span>
              <span class="cine__title">${esc(s.title)}</span>
              <span class="cine__cta">Voir le film <i aria-hidden="true">→</i></span>
            </span>
          </a>`).join("")}
      </div>
      <div class="cine__bars" aria-hidden="true">${slides.map(() => "<span><i></i></span>").join("")}</div>
      <button class="cine__nav cine__prev" type="button" aria-label="Film précédent">←</button>
      <button class="cine__nav cine__next" type="button" aria-label="Film suivant">→</button>
      <p class="cine__count" aria-live="polite"><span>01</span> / ${String(slides.length).padStart(2, "0")}</p>`;
    const items = $$(".cine__slide", cine), bars = $$(".cine__bars i", cine), tcs = $$(".cine__tc", cine);
    // le carrousel est « épinglé » : il reste fixé à l'écran et le défilement fait avancer les plans
    const pin = document.createElement("div");
    pin.className = "cine__pin";
    pin.style.setProperty("--slides", items.length);
    const sticky = document.createElement("div");
    sticky.className = "cine__sticky";
    cine.before(pin); pin.append(sticky); sticky.append(cine);
    let cur = -1, clock = performance.now();
    let onScreen = false;
    const playActive = () => {
      items.forEach((el, i) => {
        const v = $(".cine__video", el);
        if (!v) return;
        if (i === cur && onScreen && !reduced) {
          v.preload = "auto";
          v.play().then(() => el.classList.add("is-playing")).catch(() => {});
        } else { v.pause(); }
      });
    };
    new IntersectionObserver(([en]) => { onScreen = en.isIntersecting; playActive(); }, { threshold: 0.25 }).observe(cine);
    const show = (n) => {
      if (n === cur) return;
      cur = n; clock = performance.now();
      setTimeout(playActive, 0);
      items.forEach((el, i) => {
        const on = i === cur;
        el.classList.toggle("is-active", on);
        el.toggleAttribute("aria-hidden", !on);
        el.tabIndex = on ? 0 : -1;
      });
      $(".cine__count span", cine).textContent = String(cur + 1).padStart(2, "0");
    };
    const clamp01 = (v) => Math.min(1, Math.max(0, v));
    const geometry = () => {
      const r = pin.getBoundingClientRect();
      const run = pin.offsetHeight - innerHeight;
      return { r, run, top: r.top + scrollY };
    };
    const update = () => {
      const { r, run } = geometry();
      const prog = clamp01(-r.top / run);
      const pos = prog * items.length;
      const idx = Math.min(items.length - 1, Math.floor(pos));
      show(idx);
      bars.forEach((b, i) => { b.style.transform = `scaleX(${i < idx ? 1 : i === idx ? clamp01(pos - idx).toFixed(3) : 0})`; });
    };
    // timecode qui défile en continu (24 images / seconde)
    const tick = (now) => {
      const t = (now - clock) / 1000, f = Math.floor((t % 1) * 24), sec = Math.floor(t);
      if (tcs[cur]) tcs[cur].textContent = `00:00:${String(sec).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    let queued = false;
    addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; update(); }); } }, { passive: true });
    addEventListener("resize", update);
    update();
    // flèches, clavier, glissé : on fait défiler la page jusqu'au plan voulu
    const goTo = (n) => {
      const { run, top } = geometry();
      const i = Math.max(0, Math.min(items.length - 1, n));
      window.scrollTo({ top: top + run * ((i + 0.5) / items.length), behavior: reduced ? "auto" : "smooth" });
    };
    $(".cine__prev", cine).addEventListener("click", () => goTo(cur - 1));
    $(".cine__next", cine).addEventListener("click", () => goTo(cur + 1));
    cine.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") goTo(cur + 1); if (e.key === "ArrowLeft") goTo(cur - 1); });
    let sx = 0, sy = 0, swiped = false;
    cine.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; swiped = false; }, { passive: true });
    cine.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { swiped = true; goTo(cur + (dx < 0 ? 1 : -1)); }
    });
    cine.addEventListener("click", (e) => { if (swiped) { e.preventDefault(); swiped = false; } }, true);
  }

  // page Cinéma : films, voyage, acting
  [["#cine-films", () => D.films], ["#cine-voyage", () => D.cinema && D.cinema.voyage], ["#cine-acting", () => D.cinema && D.cinema.acting]].forEach(([sel, get]) => {
    const el = $(sel), list = get();
    if (el && list) videoCards(el, list);
  });

  /* ---------- Formulaire de contact (envoi via FormSubmit, sans serveur) ---------- */
  const form = $("#contact-form");
  if (form) {
    const status = $(".cform__status", form), btn = $(".cform__submit", form);
    const opened = Date.now();
    // étape 1 (univers) → affiche la bonne liste de l'étape 2 ; la liste cachée est désactivée
    const groups = $$("fieldset[data-universe]", form);
    const msg = form.elements.message;
    const setUniverse = (u) => {
      groups.forEach((g) => { const on = g.dataset.universe === u; g.hidden = !on; g.disabled = !on; g.classList.toggle("is-in", on); });
      msg.placeholder = u === "Digital" ? "Votre activité, les pages souhaitées, des sites que vous aimez…" : "Le lieu, l'ambiance, ce que vous imaginez…";
    };
    $$('input[name="univers"]', form).forEach((r) => r.addEventListener("change", () => setUniverse(r.value)));
    // pré-sélection depuis l'URL (?projet=…) envoyée par les boutons du site
    const wanted = new URLSearchParams(location.search).get("projet");
    const digitalMap = { "Site web / app": "Site vitrine" };
    if (wanted) {
      const isDigital = wanted in digitalMap || ["Site vitrine", "Application", "Branding", "Refonte de site"].includes(wanted);
      const u = isDigital ? "Digital" : "Photo & vidéo";
      $$('input[name="univers"]', form).forEach((r) => { r.checked = r.value === u; });
      setUniverse(u);
      const target = digitalMap[wanted] || wanted;
      $$('input[name="projet"]', form).forEach((r) => { if (r.value === target) r.checked = true; });
    } else setUniverse("Photo & vidéo");
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
        univers: clean(f.get("univers"), 30), projet: clean(f.get("projet"), 40), date: clean(f.get("date"), 60), budget: clean(f.get("budget"), 40), message: clean(f.get("message"), 3000),
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
            _subject: `Nouvelle demande — ${data.univers} · ${data.projet} — ${data.nom}`,
            _template: "table", _captcha: "false", _replyto: data.email,
            "Univers": data.univers, "Projet": data.projet, "Nom": data.nom, "E-mail": data.email, "Téléphone": data.telephone || "—",
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
    const MAX = 5, STEP = 160; // nombre max d'images à l'écran, distance (px) entre deux images
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
        const rot = (Math.random() * 12 - 6).toFixed(1);
        layer.append(pic);
        while (layer.children.length > MAX) layer.firstElementChild.remove();
        pic.animate([
          { opacity: 0, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(.6)` },
          { opacity: 1, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(1)`, offset: .12 },
          { opacity: 1, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(1)`, offset: .72 },
          { opacity: 0, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(.94)` },
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

  /* ---------- Vidéo d'ambiance du hero (accueil) ---------- */
  const heroBox = page === "home" && $(".hero__img");
  if (heroBox && D.heroVideo && !reduced) {
    const mobile = matchMedia("(max-width: 767px)").matches;
    const src = safeVideo(mobile ? D.heroVideo.mobile : D.heroVideo.desktop);
    // pas de vidéo si l'appareil demande d'économiser les données
    const saveData = navigator.connection && navigator.connection.saveData;
    if (src && !saveData) {
      const v = document.createElement("video");
      Object.assign(v, { muted: true, loop: true, playsInline: true, autoplay: true, preload: "auto", className: "hero__video" });
      v.setAttribute("aria-hidden", "true");
      v.setAttribute("muted", "");
      v.src = src;
      v.addEventListener("playing", () => heroBox.classList.add("has-video"), { once: true });
      heroBox.append(v);
      v.play().catch(() => {});
      // pause quand le hero n'est plus visible (économie de batterie)
      new IntersectionObserver(([en]) => { en.isIntersecting ? v.play().catch(() => {}) : v.pause(); }).observe(heroBox);
    }
  }

  /* ---------- Parallaxe légère du header ---------- */
  const heroImg = $(".hero__img img");
  if (heroImg && !reduced) {
    let raf = 0;
    addEventListener("scroll", () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const t = `0 ${Math.min(scrollY, innerHeight) * .3}px`;
        heroImg.style.translate = t;
        const hv = $(".hero__video"); if (hv) hv.style.translate = t;
      });
    }, { passive: true });
  }
})();
