/* ==========================================================================
   TRAME STUDIO — interactions
   ========================================================================== */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const D = window.TRAME || {};
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const img = (path) => `images/${path}${/\.\w+$/.test(path) ? "" : ".jpg"}`;

  /* ---------- Coordonnées ---------- */
  $$("[data-mail]").forEach((a) => (a.href = `mailto:${D.email}?subject=${encodeURIComponent("Projet avec Trame Studio")}`));
  $$("[data-insta]").forEach((a) => (a.href = `https://instagram.com/${D.instagram}`));
  $$("[data-zone]").forEach((el) => (el.textContent = D.zone || el.textContent));
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Horloge en direct ---------- */
  const clocks = $$("[data-clock]");
  const fmt = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: D.timezone || "Europe/Paris" });
  const tick = () => clocks.forEach((c) => (c.textContent = fmt.format(new Date())));
  if (clocks.length) { tick(); setInterval(tick, 1000); }

  /* ---------- Découpage en lettres ---------- */
  $$("[data-chars]").forEach((el) => {
    const text = el.textContent;
    el.setAttribute("aria-label", text);
    el.innerHTML = [...text].map((ch, i) => `<span class="c" aria-hidden="true" style="--i:${i}">${ch === " " ? "&nbsp;" : ch}</span>`).join("");
  });

  /* ---------- Écran d'ouverture ---------- */
  const loader = $(".loader");
  const heroChars = $$(".hero [data-chars], .page-title[data-chars]");
  heroChars.forEach((el, n) => el.style.setProperty("--d", `${n * 260}ms`));
  const start = () => {
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
    heroChars.forEach((el) => el.classList.add("is-in"));
    setTimeout(() => $$(".hero .blur-in").forEach((el) => el.classList.add("is-in")), 500);
  };
  let seen = false;
  try { seen = sessionStorage.getItem("trame-intro"); sessionStorage.setItem("trame-intro", "1"); } catch {}
  if (!loader || reduced || seen) {
    loader && loader.classList.add("is-done");
    start();
  } else {
    requestAnimationFrame(() => $(".loader__word").classList.add("is-in"));
    const out = () => {
      loader.classList.add("is-out");
      setTimeout(start, 350);
      setTimeout(() => loader.classList.add("is-done"), 1600);
    };
    let fired = false;
    const go = () => { if (!fired) { fired = true; setTimeout(out, 900); } };
    if (document.readyState === "complete") go(); else addEventListener("load", go, { once: true });
    setTimeout(go, 2600); // sécurité si une image tarde
  }

  /* ---------- Menu mobile ---------- */
  const menuBtn = $(".nav__menu"), menu = $("#menu");
  if (menuBtn && menu) {
    const set = (open) => { menu.hidden = !open; menuBtn.setAttribute("aria-expanded", open); menuBtn.textContent = open ? "Fermer" : "Menu"; document.body.style.overflow = open ? "hidden" : ""; };
    menuBtn.addEventListener("click", () => set(menu.hidden));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => set(false)));
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

  /* ---------- Visionneuse ---------- */
  const lb = $("#lightbox");
  let list = [], idx = 0, lastFocus;
  const embedUrl = (url) => {
    const yt = url.match(/(?:youtu\.be\/|v=|shorts\/)([\w-]{11})/);
    if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`;
    const vm = url.match(/vimeo\.com\/(\d+)/);
    return vm ? `https://player.vimeo.com/video/${vm[1]}?autoplay=1&dnt=1` : url;
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
  const open = (items, i = 0) => { if (!lb) return; lastFocus = document.activeElement; list = items; idx = i; render(); lb.hidden = false; document.body.style.overflow = "hidden"; $(".lightbox__close", lb).focus(); };
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
  const seriesItems = (key) => {
    const s = D.series[key];
    return s.photos.map((p, i) => ({ src: img(p), title: `${s.title} — ${String(i + 1).padStart(2, "0")}` }));
  };

  /* ---------- Bandeau des travaux ---------- */
  const track = $("#works-track");
  if (track && D.works) {
    const card = (w) => {
      const b = document.createElement("button");
      b.className = "work";
      b.setAttribute("aria-label", `${w.title}, ${w.tag} : voir la série`);
      b.innerHTML = `<img src="${img(w.img)}" alt="" loading="lazy"><span class="work__meta"><span class="work__tag"></span><span class="work__title"></span></span>`;
      $(".work__tag", b).textContent = w.tag;
      $(".work__title", b).textContent = w.title;
      b.addEventListener("click", () => {
        open(seriesItems(w.series), w.at || 0);
      });
      return b;
    };
    // la liste est doublée pour une boucle sans couture
    [...D.works, ...D.works].forEach((w, i) => { const c = card(w); if (i >= D.works.length) { c.tabIndex = -1; c.setAttribute("aria-hidden", "true"); } track.append(c); });
  }

  /* ---------- Films & reels ---------- */
  const films = $("#films-grid");
  if (films && D.films) {
    const playable = (f) => !!(f.embed || f.video);
    const playList = D.films.filter(playable).map((f) => ({ ...f, vertical: f.format === "reel", poster: f.poster && img(f.poster) }));
    D.films.forEach((f) => {
      const el = document.createElement(playable(f) ? "button" : "div");
      el.className = `film film--${f.format} rise`;
      el.innerHTML = `${f.poster ? `<img src="${img(f.poster)}" alt="" loading="lazy">` : ""}
        ${playable(f) ? `<span class="film__play" aria-hidden="true">▶</span>` : `<span class="film__state">Bientôt</span>`}
        <span class="film__meta"><span class="film__tag"></span><span class="film__title"></span></span>`;
      $(".film__tag", el).textContent = f.tag;
      $(".film__title", el).textContent = f.title;
      if (playable(f)) {
        el.setAttribute("aria-label", `Lire ${f.title}`);
        el.addEventListener("click", () => open(playList, playList.findIndex((p) => p.title === f.title)));
      }
      films.append(el);
    });
  }

  /* ---------- Page Travaux : séries complètes ---------- */
  $$("[data-series]").forEach((sec) => {
    const key = sec.dataset.series, s = D.series[key];
    if (!s) return;
    $("[data-s-tag]", sec).textContent = s.tag;
    $("[data-s-title]", sec).textContent = s.title;
    $("[data-s-text]", sec).textContent = s.text;
    const grid = $(".gallery", sec), items = seriesItems(key);
    s.photos.forEach((p, i) => {
      const b = document.createElement("button");
      b.className = "shot rise";
      b.setAttribute("aria-label", `Agrandir ${items[i].title}`);
      b.innerHTML = `<img src="${img(p)}" alt="" loading="lazy">`;
      b.addEventListener("click", () => open(items, i));
      grid.append(b);
    });
  });

  /* ---------- Apparitions au scroll (flou → net, montée) ---------- */
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in");
    io.unobserve(e.target);
  }), { threshold: .15, rootMargin: "0px 0px -8% 0px" });
  // décalage en cascade pour les éléments voisins
  $$(".stats, .steps, .faq__list, .service, .films, .gallery").forEach((group) => {
    $$(".rise", group).forEach((el, i) => (el.style.transitionDelay = `${Math.min(i, 8) * 90}ms`));
  });
  $$(".blur-in, .rise").forEach((el) => { if (!el.closest(".hero")) io.observe(el); });
  // les éléments générés après coup
  setTimeout(() => $$(".rise:not(.is-in)").forEach((el) => io.observe(el)), 0);

  /* ---------- Parallaxe légère du hero ---------- */
  const heroImg = $(".hero__img img");
  if (heroImg && !reduced) {
    let raf = 0;
    addEventListener("scroll", () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = Math.min(scrollY, innerHeight);
        heroImg.style.translate = `0 ${y * .3}px`;
      });
    }, { passive: true });
  }
})();
