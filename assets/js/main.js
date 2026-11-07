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
  const CAT_LABEL = { mariage: "Mariage", sport: "Sport", createurs: "Créateurs", marques: "Marques", lieux: "Lieux" };

  /* ---------- Médias : aplat neutre si le fichier n'existe pas encore ---------- */
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
      if (autoplay) v.autoplay = true;
      v.src = video;
      guard(v, wrap);
      if (src) v.addEventListener("error", () => { // vidéo absente mais image présente : on garde l'image
        const img = new Image(); img.alt = alt; img.src = src;
        img.onload = () => { wrap.classList.remove("is-empty"); v.replaceWith(img); };
      }, { once: true });
      wrap.append(v);
    } else {
      const img = new Image();
      img.loading = "lazy"; img.decoding = "async"; img.alt = alt;
      guard(img, wrap); img.src = src;
      wrap.append(img);
    }
    return wrap;
  }
  $$(".media > img").forEach((i) => guard(i, i.parentElement));

  /* ---------- Configuration ---------- */
  $$('[data-config="email"]').forEach((a) => { a.href = `mailto:${CONFIG.email}`; a.textContent = CONFIG.email; });
  $$('[data-config="instagram"]').forEach((a) => { a.href = `https://instagram.com/${CONFIG.instagram}`; a.textContent = `@${CONFIG.instagram}`; });
  $$('[data-config="zone"]').forEach((el) => { if (CONFIG.zone) el.textContent = CONFIG.zone; });
  $$(".js-year").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Hero : vidéo d'ambiance optionnelle ---------- */
  const heroMedia = $(".hero__media");
  if (CONFIG.heroVideo) {
    const v = document.createElement("video");
    Object.assign(v, { muted: true, loop: true, playsInline: true, autoplay: !reduced, poster: "images/hero/hero.jpg" });
    v.setAttribute("muted", "");
    v.src = CONFIG.heroVideo;
    v.addEventListener("loadeddata", () => { heroMedia.classList.remove("is-empty"); $("img", heroMedia)?.remove(); });
    heroMedia.prepend(v);
  }
  /* ---------- Rideau d'ouverture ---------- */
  const curtain = $(".curtain");
  let opened = false;
  const openCurtain = () => {
    if (opened) return; opened = true;
    curtain.classList.add("is-done");
    setTimeout(() => document.body.classList.add("is-ready"), 250);
    setTimeout(() => { curtain.hidden = true; }, 1100);
  };
  let seen = false;
  try { seen = sessionStorage.getItem("trame-seen"); sessionStorage.setItem("trame-seen", "1"); } catch {}
  if (reduced || seen) { curtain.hidden = true; document.body.classList.add("is-ready"); }
  else { addEventListener("load", () => setTimeout(openCurtain, 700), { once: true }); setTimeout(openCurtain, 2600); }

  /* ---------- Navigation mobile ---------- */
  const nav = $(".nav"), burger = $(".nav__burger");
  const setMenu = (open) => { nav.classList.toggle("is-open", open); burger.setAttribute("aria-expanded", open); document.body.style.overflow = open ? "hidden" : ""; };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$(".nav__pills a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---------- Texte qui s'allume au scroll ---------- */
  $$(".js-lit").forEach((el) => {
    const KEYS = ["histoires", "sport,", "partir."];
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w${KEYS.includes(w) ? " is-key" : ""}">${w}</span>`).join(" ");
    const words = $$(".w", el);
    const update = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * .8 - r.top) / (r.height + innerHeight * .2)));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("is-lit", i < n));
    };
    if (reduced) words.forEach((w) => w.classList.add("is-lit"));
    else { addEventListener("scroll", update, { passive: true }); update(); }
  });

  /* ---------- Services : accordéon + image qui change ---------- */
  const sImg = $(".services__img");
  const sImgEl = $("img", sImg);
  $$("[data-acc] details").forEach((d) => {
    d.addEventListener("toggle", () => {
      if (!d.open) return;
      $$("[data-acc] details").forEach((o) => { if (o !== d) o.open = false; });
      if (sImg.dataset.label === d.dataset.img) return;
      sImg.classList.add("is-swapping");
      setTimeout(() => {
        sImg.classList.remove("is-empty");
        sImg.dataset.label = d.dataset.img;
        sImgEl.onerror = () => sImg.classList.add("is-empty");
        sImgEl.onload = () => sImg.classList.remove("is-empty");
        sImgEl.src = d.dataset.img;
        sImg.classList.remove("is-swapping");
      }, 250);
    });
  });
  $$(".faq details").forEach((d) => d.addEventListener("toggle", () => {
    if (d.open) $$(".faq details").forEach((o) => { if (o !== d) o.open = false; });
  }));

  /* ---------- Travaux : grille ---------- */
  const grid = $("#grid");
  PORTFOLIO.forEach((item, i) => {
    const card = document.createElement("button");
    card.className = "card";
    card.dataset.cat = item.cat;
    card.style.setProperty("--ratio", item.ratio || "4/5");
    card.setAttribute("aria-label", `${item.title} — ${CAT_LABEL[item.cat] || ""}`);
    const media = makeMedia({ src: item.src, video: item.video, alt: item.title, cat: item.cat });
    const v = $("video", media);
    if (v) {
      card.addEventListener("mouseenter", () => v.play().catch(() => {}));
      card.addEventListener("mouseleave", () => v.pause());
    }
    card.append(media);
    if (item.video || item.embed) card.insertAdjacentHTML("beforeend", `<span class="card__badge">▶ Vidéo</span>`);
    card.insertAdjacentHTML("beforeend", `<span class="card__meta"><span class="card__title"></span><span class="card__cat"></span></span>`);
    $(".card__title", card).textContent = item.title;
    $(".card__cat", card).textContent = CAT_LABEL[item.cat] || "";
    card.addEventListener("click", () => openLightbox(i));
    grid.append(card);
  });
  $$(".filter").forEach((f) => {
    const n = f.dataset.filter === "all" ? PORTFOLIO.length : PORTFOLIO.filter((p) => p.cat === f.dataset.filter).length;
    $("sup", f).textContent = String(n).padStart(2, "0");
  });
  let activeFilter = "all";
  function applyFilter(cat) {
    activeFilter = cat;
    $$(".filter").forEach((f) => { const on = f.dataset.filter === cat; f.classList.toggle("is-active", on); f.setAttribute("aria-selected", on); });
    $$(".card").forEach((c) => {
      const show = cat === "all" || c.dataset.cat === cat;
      c.classList.toggle("is-hidden", !show);
      if (show) { c.classList.remove("is-in"); requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add("is-in"))); }
    });
  }
  $$(".filter").forEach((f) => f.addEventListener("click", () => applyFilter(f.dataset.filter)));

  /* ---------- Visionneuse ---------- */
  const lb = $("#lightbox"), lbMedia = $(".lightbox__media", lb), lbCap = $(".lightbox__caption", lb);
  let lbIndex = 0, lastFocus;
  const visible = () => PORTFOLIO.map((_, i) => i).filter((i) => activeFilter === "all" || PORTFOLIO[i].cat === activeFilter);
  const embedUrl = (url) => {
    const yt = url.match(/(?:youtu\.be\/|v=|shorts\/)([\w-]{11})/);
    if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`;
    const vm = url.match(/vimeo\.com\/(\d+)/);
    return vm ? `https://player.vimeo.com/video/${vm[1]}?autoplay=1&dnt=1` : url;
  };
  const emptyBox = (item) => { const m = makeMedia({ src: "", cat: item.cat, label: item.video || item.src }); m.classList.add("is-empty"); m.style.aspectRatio = item.ratio || "4/5"; return m; };
  function renderLightbox() {
    const item = PORTFOLIO[lbIndex];
    lbMedia.innerHTML = "";
    if (item.embed) {
      const f = document.createElement("iframe");
      Object.assign(f, { src: embedUrl(item.embed), allow: "autoplay; fullscreen; picture-in-picture", allowFullscreen: true, title: item.title });
      lbMedia.append(f);
    } else if (item.video) {
      const v = document.createElement("video");
      Object.assign(v, { src: item.video, poster: item.src || "", controls: true, autoplay: true, playsInline: true });
      v.onerror = () => v.replaceWith(emptyBox(item));
      lbMedia.append(v);
    } else {
      const img = new Image(); img.alt = item.title; img.src = item.src;
      img.onerror = () => img.replaceWith(emptyBox(item));
      lbMedia.append(img);
    }
    const list = visible();
    lbCap.textContent = `${item.title} — ${CAT_LABEL[item.cat] || ""} · ${list.indexOf(lbIndex) + 1}/${list.length}`;
  }
  function openLightbox(i) { lastFocus = document.activeElement; lbIndex = i; renderLightbox(); lb.hidden = false; document.body.style.overflow = "hidden"; $(".lightbox__close", lb).focus(); }
  function closeLightbox() { lb.hidden = true; lbMedia.innerHTML = ""; document.body.style.overflow = ""; lastFocus && lastFocus.focus(); }
  function step(d) { const list = visible(); lbIndex = list[(list.indexOf(lbIndex) + d + list.length) % list.length]; renderLightbox(); }
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
    el.className = "reel";
    const phone = document.createElement("div"); phone.className = "reel__phone";
    const media = makeMedia({ src: r.poster, video: r.video, cat: r.cat, label: r.video });
    phone.append(media);
    phone.insertAdjacentHTML("beforeend", `<div class="reel__ui"><div class="reel__progress"><i></i></div><div class="reel__top"><span>@${CONFIG.instagram || "tramestudio"}</span><span>9:16</span></div></div>`);
    el.append(phone);
    el.insertAdjacentHTML("beforeend", `<h3 class="reel__title"></h3><p class="reel__client"></p>`);
    $(".reel__title", el).textContent = r.title;
    $(".reel__client", el).textContent = r.client || "";
    const v = $("video", media), bar = $(".reel__progress i", el);
    if (v) {
      const play = () => v.play().catch(() => {});
      el.addEventListener("mouseenter", play);
      el.addEventListener("mouseleave", () => v.pause());
      el.addEventListener("click", () => (v.paused ? play() : v.pause()));
      v.addEventListener("timeupdate", () => { if (v.duration) bar.style.width = (v.currentTime / v.duration) * 100 + "%"; });
    }
    rail.append(el);
  });
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
  if (!finePointer) {
    const rio = new IntersectionObserver((es) => es.forEach((en) => {
      const v = $("video", en.target); if (!v) return;
      en.isIntersecting ? v.play().catch(() => {}) : v.pause();
    }), { threshold: .7 });
    $$(".reel").forEach((r) => rio.observe(r));
  }

  /* ---------- Méthode : anneau en 4 étapes ---------- */
  const STEPS = [
    ["Échange", "On parle de vous, de votre projet et de vos envies. Appel ou rendez-vous, sans engagement."],
    ["Préparation", "Moodboard, repérages, planning et liste des plans : rien n'est laissé au hasard."],
    ["Tournage", "Le jour J, on se fait discrets ou on vous dirige, selon ce que le projet demande."],
    ["Livraison", "Galerie privée, fichiers HD et formats adaptés à chaque réseau, dans les délais annoncés."],
  ];
  const ringBar = $(".ring__bar"), ringContent = $(".ring__content");
  let cur = 0, timer;
  function showStep(i) {
    cur = (i + STEPS.length) % STEPS.length;
    ringBar.style.strokeDashoffset = 100 - ((cur + 1) / STEPS.length) * 100;
    ringContent.classList.add("is-out");
    setTimeout(() => {
      $(".ring__n").textContent = String(cur + 1).padStart(2, "0");
      $(".ring__t").textContent = STEPS[cur][0];
      $(".ring__p").textContent = STEPS[cur][1];
      ringContent.classList.remove("is-out");
    }, 300);
  }
  const auto = () => { clearInterval(timer); if (!reduced) timer = setInterval(() => showStep(cur + 1), 4500); };
  $$("[data-step]").forEach((b) => b.addEventListener("click", () => { showStep(cur + +b.dataset.step); auto(); }));
  new IntersectionObserver(([e]) => { e.isIntersecting ? auto() : clearInterval(timer); }, { threshold: .4 }).observe($(".method"));

  /* ---------- Titres : découpage en lettres ---------- */
  $$("[data-split]").forEach((h) => {
    let i = 0;
    const label = h.textContent.replace(/\s+/g, " ").trim();
    h.innerHTML = h.innerHTML.split(/<br\s*\/?>/i).map((line) =>
      line.trim().split(/\s+/).map((word) => `<span class="wd">${[...word].map((c) => `<span class="ch" style="--i:${i++}">${c}</span>`).join("")}</span>`).join(" ")
    ).join("<br>");
    h.setAttribute("aria-label", label);
  });

  /* ---------- Barre de progression + parallaxe ---------- */
  const bar = $(".progress"), heroTitle = $(".hero__title"), bigImg = $(".bigword__img");
  let ticking = false;
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (!reduced && y < innerHeight * 1.2) {
      heroMedia.style.transform = `translateY(${y * .35}px) scale(${1 + y * .0002})`;
      heroTitle.style.transform = `translateY(${y * -.12}px)`;
    }
    if (!reduced && bigImg) {
      const r = bigImg.getBoundingClientRect();
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      bigImg.style.transform = `rotate(${-4 + p * 14}deg) scale(${1.05 - Math.min(.15, Math.abs(p) * .15)})`;
    }
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- Curseur, boutons magnétiques, cartes inclinables ---------- */
  if (finePointer && !reduced) {
    const cur = $(".cursor"), dot = $("i", cur), ring = $("b", cur);
    document.body.classList.add("has-cursor");
    let mx = -100, my = -100, rx = mx, ry = my;
    addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; cur.classList.add("is-on"); }, { passive: true });
    document.addEventListener("mouseleave", () => cur.classList.remove("is-on"));
    (function loop() {
      rx += (mx - rx) * .18; ry += (my - ry) * .18;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    })();
    const LABELS = [[".card", "Voir"], [".reel", "Lire"], [".bigword", "Voir"]];
    document.addEventListener("mouseover", (e) => {
      const hit = LABELS.find(([sel]) => e.target.closest(sel));
      cur.classList.toggle("is-big", !!hit);
      ring.textContent = hit ? hit[1] : "";
    });
    $$("[data-magnetic], .round, .nav__pills a").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
    $$(".stat").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
        el.style.boxShadow = "0 24px 50px rgba(0,0,0,.12)";
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; el.style.boxShadow = ""; });
    });
  }

  /* ---------- Apparitions au scroll ---------- */
  $$(".head, .about__cards, .acc, .services__img, .bigword, .ring, .faq__list, .faq__img, .form").forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }), { threshold: .1, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal, .card, [data-split]").forEach((el) => io.observe(el));

  /* ---------- Formulaire ---------- */
  const form = $("#contact-form"), status = $(".form__status", form);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let ok = true;
    $$("[required]", form).forEach((f) => {
      const bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
      f.closest(".field").classList.toggle("is-error", bad); if (bad) ok = false;
    });
    if (!ok) { status.textContent = "Merci de compléter votre nom, votre e-mail et votre projet."; return; }
    const d = Object.fromEntries(new FormData(form));
    if (CONFIG.formEndpoint) {
      status.textContent = "Envoi en cours…";
      try {
        const res = await fetch(CONFIG.formEndpoint, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
        if (!res.ok) throw new Error();
        form.reset(); status.textContent = "Merci ! Votre demande est bien partie, nous revenons vers vous très vite.";
      } catch { status.textContent = `L'envoi a échoué. Écrivez-nous directement à ${CONFIG.email}.`; }
    } else {
      const subject = `Demande ${d.type} — ${d.nom}`;
      const body = `Projet : ${d.type}\nNom : ${d.nom}\nE-mail : ${d.email}\nDate : ${d.date || "-"}\nLieu : ${d.lieu || "-"}\n\n${d.message}`;
      location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = "Votre messagerie s'ouvre avec le message pré-rempli.";
    }
  });
  $$(".field input, .field textarea", form).forEach((f) => f.addEventListener("input", () => f.closest(".field").classList.remove("is-error")));
})();
