/* ==========================================================================
   TRAME STUDIO — interactions
   ========================================================================== */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const D = window.TRAME || {};
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const img = (path) => `images/${path}${/\.\w+$/.test(path) ? "" : ".jpg"}`;
  const esc = (t = "") => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const cat = (key) => (D.categories || []).find((c) => c.key === key) || { label: key, href: "#" };
  const page = document.body.dataset.page || "home";
  const roll = (t) => `<span class="roll"><span>${t}</span><span>${t}</span></span>`;

  /* ---------- Menu et pied de page (communs à toutes les pages) ---------- */
  const navSlot = $("[data-nav]");
  if (navSlot) {
    const links = [
      { label: "Accueil", href: "index.html", key: "home" },
      ...D.categories.map((c) => ({ label: c.label, href: c.href, key: c.key })),
      { label: "Contact", href: "#contact", key: "contact" },
    ];
    navSlot.outerHTML = `
      <header class="nav">
        <a class="nav__logo" href="index.html" aria-label="Trame Studio, accueil">T.</a>
        <nav class="nav__links" aria-label="Navigation principale">
          ${links.map((l, i) => `<a href="${l.href}"${l.key === page ? ' aria-current="page"' : ""}>${roll(l.label + (i < links.length - 1 ? "," : ""))}</a>`).join("")}
        </nav>
        <button class="nav__menu" aria-expanded="false" aria-controls="menu">Menu</button>
      </header>
      <div class="menu" id="menu" hidden>${links.map((l) => `<a href="${l.href}">${l.label}</a>`).join("")}</div>`;
  }
  const footSlot = $("[data-footer]");
  if (footSlot) {
    footSlot.outerHTML = `
      <footer class="footer" id="contact">
        <div class="container footer__top">
          <div class="footer__cta">
            <p class="footer__brand blur-in">Trame Studio®</p>
            <h2 class="footer__title blur-in">Vous avez une histoire à raconter ? Mariage, course, contenu ou marque : parlons de votre projet.</h2>
            <a class="btn blur-in" data-mail href="#">${roll("Nous contacter")}</a>
          </div>
          <div class="footer__cols">
            <div><p>Travaux</p>${D.categories.map((c) => `<a href="${c.href}">${c.label}</a>`).join("")}</div>
            <div><p>Studio</p><a href="index.html#services">Services</a><a href="index.html#films">Films & reels</a><a href="index.html#faq">FAQ</a></div>
            <div><p>Réseaux</p><a data-insta href="#" target="_blank" rel="noopener">Instagram</a><a data-mail href="#">E-mail</a></div>
          </div>
        </div>
        <div class="container footer__bar">
          <span>Trame ${new Date().getFullYear()}. Tous droits réservés.</span>
          <span data-zone></span>
          <span data-clock>--:--:--</span>
          <span>Photo · Vidéo · Reels</span>
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
  $$("[data-mail]").forEach((a) => (a.href = `mailto:${D.email}?subject=${encodeURIComponent(a.dataset.mail || "Projet avec Trame Studio")}`));
  $$("[data-insta]").forEach((a) => (a.href = `https://instagram.com/${D.instagram}`));
  $$("[data-zone]").forEach((el) => (el.textContent = D.zone));

  /* ---------- Horloge en direct ---------- */
  const clocks = $$("[data-clock]");
  const fmt = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: D.timezone || "Europe/Paris" });
  const tick = () => clocks.forEach((c) => (c.textContent = fmt.format(new Date())));
  if (clocks.length) { tick(); setInterval(tick, 1000); }

  /* ---------- Visionneuse ---------- */
  const lb = $("#lightbox");
  let list = [], idx = 0, lastFocus;
  const embedUrl = (url) => {
    const yt = url.match(/(?:youtu\.be\/|v=|shorts\/)([\w-]{11})/);
    if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`;
    const vm = url.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1&dnt=1`;
    const ig = url.match(/instagram\.com\/(?:reel|p)\/([\w-]+)/);
    if (ig) return `https://www.instagram.com/reel/${ig[1]}/embed`;
    const tt = url.match(/tiktok\.com\/.*video\/(\d+)/);
    if (tt) return `https://www.tiktok.com/embed/v2/${tt[1]}`;
    return url;
  };
  const render = () => {
    const it = list[idx], box = $(".lightbox__media", lb);
    box.innerHTML = "";
    if (it.embed) {
      const f = document.createElement("iframe");
      Object.assign(f, { src: embedUrl(it.embed), allow: "autoplay; fullscreen; picture-in-picture", allowFullscreen: true, title: it.title });
      if (it.vertical) f.className = "is-vertical";
      box.append(f);
    } else if (it.video) {
      const v = document.createElement("video");
      Object.assign(v, { src: it.video, poster: it.poster || "", controls: true, autoplay: true, playsInline: true });
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
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    });
    let sx = 0;
    lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    lb.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); });
  }

  /* ---------- Composants générés ---------- */
  const playable = (f) => !!(f.embed || f.video);

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
    const playList = films.filter(playable).map((f) => ({ ...f, vertical: f.format === "reel", poster: f.poster && img(f.poster) }));
    films.forEach((f) => {
      const card = document.createElement(playable(f) ? "button" : "div");
      card.className = `film film--${f.format || "reel"} rise${f.poster ? "" : " film--typo"}`;
      card.innerHTML = `${f.poster ? `<img src="${img(f.poster)}" alt="" loading="lazy">` : `<span class="film__word">${esc(f.client || f.title)}</span>`}
        ${playable(f) ? `<span class="film__play" aria-hidden="true">▶</span>` : `<span class="film__state">Bientôt</span>`}
        <span class="film__meta"><span class="film__tag">${esc(f.tag || f.client || "")}</span><span class="film__title">${esc(f.title)}</span></span>`;
      if (playable(f)) {
        card.setAttribute("aria-label", `Lire ${f.title}`);
        card.addEventListener("click", () => open(playList, playList.findIndex((p) => p.title === f.title)));
      }
      el.append(card);
    });
  };

  // Accueil : bandeau des travaux (année + catégorie, lien vers la page)
  const track = $("#works-track");
  if (track && D.works) {
    const card = (w, hidden) => {
      const c = cat(w.cat);
      return `<a class="work" href="${c.href}"${hidden ? ' tabindex="-1" aria-hidden="true"' : ` aria-label="${esc(c.label)}, ${w.year}"`}>
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

  /* ---------- Menu mobile ---------- */
  const menuBtn = $(".nav__menu"), menu = $("#menu");
  if (menuBtn && menu) {
    const set = (o) => { menu.hidden = !o; menuBtn.setAttribute("aria-expanded", o); menuBtn.textContent = o ? "Fermer" : "Menu"; document.body.style.overflow = o ? "hidden" : ""; };
    menuBtn.addEventListener("click", () => set(menu.hidden));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => set(false)));
  }

  /* ---------- Découpage en lettres ---------- */
  $$("[data-chars]").forEach((el) => {
    const text = el.textContent;
    el.setAttribute("aria-label", text);
    el.innerHTML = [...text].map((ch, i) => `<span class="c" aria-hidden="true" style="--i:${i}">${ch === " " ? "&nbsp;" : ch}</span>`).join("");
  });

  /* ---------- Écran d'ouverture (accueil) et entrée des titres ---------- */
  const loader = $(".loader");
  const heroChars = $$(".hero [data-chars], .page-title[data-chars]");
  heroChars.forEach((el, n) => el.style.setProperty("--d", `${n * 260}ms`));
  const start = () => {
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
    heroChars.forEach((el) => el.classList.add("is-in"));
    setTimeout(() => $$(".hero .blur-in, .hero .rise").forEach((el) => el.classList.add("is-in")), 500);
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
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
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

  /* ---------- Apparitions au scroll (flou → net, montée) ---------- */
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in");
    io.unobserve(e.target);
  }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  $$(".stats, .steps, .faq__list, .service, .films, .gallery, .offer, .points").forEach((group) => {
    $$(".rise", group).forEach((el, i) => (el.style.transitionDelay = `${Math.min(i, 8) * 80}ms`));
  });
  $$(".blur-in, .rise").forEach((el) => { if (!el.closest(".hero")) io.observe(el); });

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
