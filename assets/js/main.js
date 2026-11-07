/* ==========================================================================
   TRAME STUDIO — interactions
   ========================================================================== */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const CONFIG = window.TRAME_CONFIG || {};
  const PORTFOLIO = window.TRAME_PORTFOLIO || [];
  const REELS = window.TRAME_REELS || [];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const CAT_LABEL = { mariage: "Mariage", createurs: "Créateurs", marques: "Marques", lieux: "Lieux" };

  /* ---------- Médias avec repli élégant si le fichier n'existe pas encore ---------- */
  function guard(el, wrap) {
    const fail = () => wrap.classList.add("is-empty");
    el.addEventListener("error", fail, { once: true });
    if (el.tagName === "IMG" && el.complete && el.naturalWidth === 0 && el.getAttribute("src")) fail();
  }
  function makeMedia({ src, video, alt = "", cat, label, autoplay = false }) {
    const wrap = document.createElement("div");
    wrap.className = "media";
    wrap.dataset.cat = cat || "";
    wrap.dataset.label = label || video || src || "";
    if (video) {
      const v = document.createElement("video");
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = "metadata";
      if (src) v.poster = src;
      v.src = video;
      if (autoplay) v.autoplay = true;
      guard(v, wrap);
      if (src) { // si la vidéo manque mais pas l'image, on garde l'image
        v.addEventListener("error", () => {
          const img = new Image(); img.src = src; img.alt = alt;
          img.onload = () => { wrap.classList.remove("is-empty"); v.replaceWith(img); };
        }, { once: true });
      }
      wrap.append(v);
    } else {
      const img = new Image();
      img.loading = "lazy"; img.decoding = "async"; img.alt = alt;
      guard(img, wrap);
      img.src = src;
      wrap.append(img);
    }
    return wrap;
  }
  $$(".loom .media, .thread-preview .media").forEach((m) => { const i = $("img", m); if (i) guard(i, m); });
  $$(".loom__thread").forEach((t) => $(".media", t).dataset.cat = t.dataset.filter);

  /* ---------- Configuration (e-mail, Instagram, zone) ---------- */
  $$('[data-config="email"]').forEach((a) => { a.href = `mailto:${CONFIG.email}`; a.textContent = CONFIG.email; });
  $$('[data-config="instagram"]').forEach((a) => { a.href = `https://instagram.com/${CONFIG.instagram}`; a.textContent = `@${CONFIG.instagram}`; });
  $$('[data-config="zone"]').forEach((el) => { if (CONFIG.zone) el.textContent = CONFIG.zone; });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Intro ---------- */
  document.body.classList.add("is-loading");
  const intro = $(".intro");
  const start = () => {
    intro.classList.add("is-done");
    document.body.classList.remove("is-loading");
    setTimeout(() => document.body.classList.add("is-ready"), 250);
    setTimeout(() => intro.remove(), 1200);
  };
  if (reduced || sessionStorageGet("trame-intro")) { start(); }
  else { setTimeout(start, 1700); sessionStorageSet("trame-intro", "1"); }
  function sessionStorageGet(k) { try { return sessionStorage.getItem(k); } catch { return null; } }
  function sessionStorageSet(k, v) { try { sessionStorage.setItem(k, v); } catch {} }

  /* ---------- Navigation ---------- */
  const nav = $(".nav");
  const burger = $(".nav__burger");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  $$(".nav__links a").forEach((a) => a.addEventListener("click", () => {
    nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", false); document.body.style.overflow = "";
  }));
  let lastY = 0;
  addEventListener("scroll", () => {
    const y = scrollY;
    nav.classList.toggle("is-hidden", y > lastY && y > 400 && !nav.classList.contains("is-open"));
    nav.classList.toggle("is-scrolled", y > 40);
    lastY = y;
  }, { passive: true });

  /* ---------- Curseur viseur ---------- */
  const vf = $(".viewfinder");
  if (finePointer && !reduced) {
    let x = -100, y = -100, cx = x, cy = y;
    addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; vf.classList.add("is-on"); }, { passive: true });
    document.addEventListener("mouseleave", () => vf.classList.remove("is-on"));
    (function loop() {
      cx += (x - cx) * .2; cy += (y - cy) * .2;
      vf.style.transform = `translate(${cx - vf.offsetWidth / 2}px, ${cy - vf.offsetHeight / 2}px)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest("[data-cursor]");
      vf.classList.toggle("is-active", !!t);
      $(".viewfinder__label", vf).textContent = t ? t.dataset.cursor : "";
    });
  }

  /* ---------- Univers : aperçu flottant qui suit la souris ---------- */
  const preview = $(".thread-preview");
  const pImg = $("img", preview);
  if (finePointer) {
    let px = 0, py = 0, tx = 0, ty = 0, raf;
    const follow = () => { px += (tx - px) * .12; py += (ty - py) * .12; preview.style.left = px + "px"; preview.style.top = py + "px"; raf = requestAnimationFrame(follow); };
    $$(".thread").forEach((t) => {
      t.addEventListener("mouseenter", (e) => {
        const m = $(".media", preview);
        m.classList.remove("is-empty");
        m.dataset.cat = ["mariage", "createurs", "marques", "lieux"][$$(".thread").indexOf(t)];
        m.dataset.label = t.dataset.preview;
        pImg.onerror = () => m.classList.add("is-empty");
        pImg.src = t.dataset.preview;
        tx = px = e.clientX; ty = py = e.clientY;
        preview.classList.add("is-on");
        cancelAnimationFrame(raf); follow();
      });
      t.addEventListener("mousemove", (e) => { tx = e.clientX + 120; ty = e.clientY; });
      t.addEventListener("mouseleave", () => { preview.classList.remove("is-on"); setTimeout(() => cancelAnimationFrame(raf), 500); });
    });
  }

  /* ---------- Portfolio ---------- */
  const grid = $("#grid");
  PORTFOLIO.forEach((item, i) => {
    const card = document.createElement("button");
    card.className = "card";
    card.dataset.cat = item.cat;
    card.dataset.index = i;
    card.dataset.cursor = item.video || item.embed ? "Lire" : "Voir";
    card.style.setProperty("--ratio", item.ratio || "4/5");
    card.setAttribute("aria-label", `${item.title} — ${CAT_LABEL[item.cat] || ""}`);
    const media = makeMedia({ src: item.src, video: item.video, alt: item.title, cat: item.cat });
    if (item.video) {
      const v = $("video", media);
      card.addEventListener("mouseenter", () => v && v.play().catch(() => {}));
      card.addEventListener("mouseleave", () => v && v.pause());
    }
    card.append(media);
    if (item.video || item.embed) {
      const b = document.createElement("span"); b.className = "card__badge"; b.textContent = "Vidéo"; card.append(b);
    }
    const meta = document.createElement("span");
    meta.className = "card__meta";
    meta.innerHTML = `<span class="card__title"></span><span class="card__cat"></span>`;
    $(".card__title", meta).textContent = item.title;
    $(".card__cat", meta).textContent = CAT_LABEL[item.cat] || "";
    card.append(meta);
    card.addEventListener("click", () => openLightbox(i));
    grid.append(card);
  });

  // compteurs des filtres
  $$(".filter").forEach((f) => {
    const n = f.dataset.filter === "all" ? PORTFOLIO.length : PORTFOLIO.filter((p) => p.cat === f.dataset.filter).length;
    $("sup", f).textContent = String(n).padStart(2, "0");
  });

  let activeFilter = "all";
  function applyFilter(cat) {
    activeFilter = cat;
    $$(".filter").forEach((f) => {
      const on = f.dataset.filter === cat;
      f.classList.toggle("is-active", on); f.setAttribute("aria-selected", on);
    });
    $$(".card").forEach((c) => {
      const show = cat === "all" || c.dataset.cat === cat;
      c.classList.toggle("is-hidden", !show);
      if (show) { c.classList.remove("is-in"); requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add("is-in"))); }
    });
  }
  $$(".filter").forEach((f) => f.addEventListener("click", () => applyFilter(f.dataset.filter)));
  $$(".loom__thread").forEach((t) => t.addEventListener("click", () => applyFilter(t.dataset.filter)));

  /* ---------- Visionneuse ---------- */
  const lb = $("#lightbox");
  const lbMedia = $(".lightbox__media", lb);
  const lbCap = $(".lightbox__caption", lb);
  let lbIndex = 0, lastFocus;
  const visible = () => PORTFOLIO.map((p, i) => i).filter((i) => activeFilter === "all" || PORTFOLIO[i].cat === activeFilter);

  function embedUrl(url) {
    const yt = url.match(/(?:youtu\.be\/|v=|shorts\/)([\w-]{11})/);
    if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`;
    const vm = url.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1&dnt=1`;
    return url;
  }
  function renderLightbox() {
    const item = PORTFOLIO[lbIndex];
    lbMedia.innerHTML = "";
    if (item.embed) {
      const f = document.createElement("iframe");
      f.src = embedUrl(item.embed); f.allow = "autoplay; fullscreen; picture-in-picture"; f.allowFullscreen = true; f.title = item.title;
      lbMedia.append(f);
    } else if (item.video) {
      const m = makeMedia({ src: item.src, video: item.video, cat: item.cat, autoplay: true });
      const v = $("video", m);
      if (v) { v.controls = true; v.muted = false; lbMedia.append(v); guard(v, m); v.addEventListener("error", () => { lbMedia.innerHTML = ""; lbMedia.append(m); m.append(v); }); }
      else lbMedia.append(m);
    } else {
      const img = new Image(); img.alt = item.title; img.src = item.src;
      img.onerror = () => { const m = makeMedia({ src: "", cat: item.cat, label: item.src }); m.classList.add("is-empty"); m.style.aspectRatio = item.ratio || "4/5"; img.replaceWith(m); };
      lbMedia.append(img);
    }
    const list = visible();
    lbCap.textContent = `${item.title} — ${CAT_LABEL[item.cat] || ""} · ${list.indexOf(lbIndex) + 1}/${list.length}`;
  }
  function openLightbox(i) {
    lastFocus = document.activeElement;
    lbIndex = i; renderLightbox();
    lb.hidden = false; document.body.style.overflow = "hidden";
    $(".lightbox__close", lb).focus();
  }
  function closeLightbox() {
    lb.hidden = true; lbMedia.innerHTML = ""; document.body.style.overflow = "";
    lastFocus && lastFocus.focus();
  }
  function step(d) {
    const list = visible(); const pos = list.indexOf(lbIndex);
    lbIndex = list[(pos + d + list.length) % list.length]; renderLightbox();
  }
  $(".lightbox__close", lb).addEventListener("click", closeLightbox);
  $(".lightbox__prev", lb).addEventListener("click", () => step(-1));
  $(".lightbox__next", lb).addEventListener("click", () => step(1));
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target === lbMedia) closeLightbox(); });
  addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
  let sx = 0;
  lb.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); });

  /* ---------- Reels ---------- */
  const rail = $("#reels-rail");
  REELS.forEach((r) => {
    const el = document.createElement("article");
    el.className = "reel"; el.dataset.cat = r.cat; el.dataset.cursor = "Lecture";
    const phone = document.createElement("div"); phone.className = "reel__phone";
    const media = makeMedia({ src: r.poster, video: r.video, cat: r.cat, label: r.video });
    phone.append(media);
    phone.insertAdjacentHTML("beforeend", `<div class="reel__ui"><div><div class="reel__progress"><i></i></div><div class="reel__top" style="margin-top:10px"><span>@${CONFIG.instagram || "tramestudio"}</span><span>9:16</span></div></div><div></div></div>`);
    el.append(phone);
    el.insertAdjacentHTML("beforeend", `<h3 class="reel__title"></h3><p class="reel__client"></p>`);
    $(".reel__title", el).textContent = r.title;
    $(".reel__client", el).textContent = r.client || "";
    const v = $("video", media); const bar = $(".reel__progress i", el);
    if (v) {
      const play = () => v.play().catch(() => {});
      el.addEventListener("mouseenter", play);
      el.addEventListener("mouseleave", () => v.pause());
      el.addEventListener("click", () => (v.paused ? play() : v.pause()));
      v.addEventListener("timeupdate", () => { if (v.duration) bar.style.width = (v.currentTime / v.duration) * 100 + "%"; });
    }
    rail.append(el);
  });
  // glisser pour faire défiler (souris)
  let down = false, startX = 0, startScroll = 0, moved = false;
  rail.addEventListener("mousedown", (e) => { down = true; moved = false; startX = e.pageX; startScroll = rail.scrollLeft; });
  addEventListener("mouseup", () => { down = false; rail.classList.remove("is-dragging"); });
  rail.addEventListener("mousemove", (e) => {
    if (!down) return;
    const dx = e.pageX - startX;
    if (Math.abs(dx) > 4) { moved = true; rail.classList.add("is-dragging"); }
    rail.scrollLeft = startScroll - dx;
  });
  rail.addEventListener("click", (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); } }, true);
  // sur mobile : lecture auto des reels visibles
  if (!finePointer && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((en) => {
      const v = $("video", en.target); if (!v) return;
      en.isIntersecting ? v.play().catch(() => {}) : v.pause();
    }), { threshold: .7 });
    $$(".reel").forEach((r) => io.observe(r));
  }

  /* ---------- Manifeste : les mots s'allument au scroll ---------- */
  const mf = $("#manifesto");
  const KEYS = ["fils", "fil", "récit.", "histoires", "sincères,", "durer"];
  mf.innerHTML = mf.textContent.trim().split(/\s+/).map((w) => `<span class="w${KEYS.includes(w) ? " is-key" : ""}">${w}</span>`).join(" ");
  const words = $$(".w", mf);
  const lightWords = () => {
    const r = mf.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height + innerHeight * .35)));
    const n = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle("is-lit", i < n));
  };
  if (reduced) words.forEach((w) => w.classList.add("is-lit"));
  else { addEventListener("scroll", lightWords, { passive: true }); lightWords(); }

  /* ---------- Apparitions au scroll ---------- */
  $$(".section-head, .thread, .contact__intro, .form").forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal, .card, .steps").forEach((el) => io.observe(el));

  /* ---------- Formulaire de contact ---------- */
  const form = $("#contact-form");
  const status = $(".form__status", form);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let ok = true;
    $$("[required]", form).forEach((f) => {
      const bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
      f.closest(".field").classList.toggle("is-error", bad); if (bad) ok = false;
    });
    if (!ok) { status.textContent = "Merci de compléter votre nom, votre e-mail et votre message."; return; }
    const d = Object.fromEntries(new FormData(form));
    if (CONFIG.formEndpoint) {
      status.textContent = "Envoi en cours…";
      try {
        const res = await fetch(CONFIG.formEndpoint, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
        if (!res.ok) throw new Error();
        form.reset(); status.textContent = "Merci ! Votre demande est bien partie, nous revenons vers vous sous 48 h.";
      } catch { status.textContent = `Oups, l'envoi a échoué. Écrivez-nous directement à ${CONFIG.email}.`; }
    } else {
      const subject = `Demande ${d.type} — ${d.nom}`;
      const body = `Projet : ${d.type}\nNom : ${d.nom}\nE-mail : ${d.email}\nDate : ${d.date || "-"}\nLieu : ${d.lieu || "-"}\n\n${d.message}`;
      location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = "Votre messagerie s'ouvre avec le message pré-rempli.";
    }
  });
  $$(".field input, .field textarea", form).forEach((f) => f.addEventListener("input", () => f.closest(".field").classList.remove("is-error")));
})();
