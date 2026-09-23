(() => {
  "use strict";

  /* ---- Paintings: 24 plates, with the two known titles ---- */
  const TITLES = { 11: "Io", 19: "Actéon dévoré par ses chiens" };
  const gallery = document.getElementById("gallery");
  const total = 24;
  const plates = [];

  for (let i = 1; i <= total; i++) {
    const n = String(i).padStart(2, "0");
    const src = `assets/img/paintings/p${n}.jpg`;
    const title = TITLES[i] || null;
    const fig = document.createElement("figure");
    fig.className = "gallery__item" + (title ? " gallery__item--tag" : "");
    if (title) fig.dataset.title = title;
    fig.dataset.index = i - 1;
    const img = document.createElement("img");
    img.src = src;
    img.loading = "lazy";
    img.alt = title ? `Peinture · ${title}, Alphée Carrau` : `Peinture ${n}, Alphée Carrau`;
    fig.appendChild(img);
    gallery.appendChild(fig);
    plates.push({ src, title, alt: img.alt });
  }

  /* ---- Reveal on scroll (gallery + films) ---- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );
  // stagger gallery items by column position-ish (use DOM order)
  document.querySelectorAll(".gallery__item").forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 60 + "ms";
    io.observe(el);
  });

  /* ---- Lightbox ---- */
  const lb = document.getElementById("lightbox");
  const lbImg = lb.querySelector(".lightbox__img");
  const lbCount = lb.querySelector(".lightbox__count");
  let cur = 0;

  const show = (i) => {
    cur = (i + plates.length) % plates.length;
    const p = plates[cur];
    lbImg.src = p.src;
    lbImg.alt = p.alt;
    lbCount.textContent = `${String(cur + 1).padStart(2, "0")} / ${plates.length}${p.title ? "  ·  " + p.title : ""}`;
  };
  const open = (i) => { show(i); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; };
  const close = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };

  gallery.addEventListener("click", (e) => {
    const item = e.target.closest(".gallery__item");
    if (item) open(parseInt(item.dataset.index, 10));
  });
  lb.querySelector(".lightbox__close").addEventListener("click", close);
  lb.querySelector(".lightbox__nav--prev").addEventListener("click", () => show(cur - 1));
  lb.querySelector(".lightbox__nav--next").addEventListener("click", () => show(cur + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });

  /* ---- Mobile nav ---- */
  const nav = document.querySelector(".nav");
  const toggle = nav.querySelector(".nav__toggle");
  toggle.addEventListener("click", () => {
    const openNow = nav.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(openNow));
  });
  nav.querySelectorAll(".nav__links a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ---- Nav hide-on-scroll-down + cloporte reveal ---- */
  const cloporte = document.getElementById("cloporte");
  const footer = document.querySelector(".footer");
  let lastY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    if (!nav.classList.contains("menu-open")) {
      if (y > lastY && y > 300) nav.classList.add("is-hidden");
      else nav.classList.remove("is-hidden");
    }
    nav.classList.toggle("scrolled", y > 60);
    cloporte.classList.toggle("show", y > window.innerHeight * 0.9);
    // lighten the cloporte once it sits over the dark footer
    cloporte.classList.toggle("over-dark", footer.getBoundingClientRect().top < window.innerHeight - 70);
    lastY = y;
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  cloporte.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();
