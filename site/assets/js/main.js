"use strict";

// Configuración editable del contacto comercial.
// Reemplazar por los datos reales cuando se confirmen. Los campos vacíos se ocultan.
const HAPMED_CONFIG = {
  contactEmail: "h@hapmed.qzz.io",
};

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.getElementById("primary-nav");
  const aurora = document.querySelector(".aurora");

  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (navToggle && primaryNav) {
    const closeNav = () => {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menú");
      primaryNav.classList.remove("is-open");
    };

    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
      primaryNav.classList.toggle("is-open", !isOpen);
    });

    primaryNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });
  }

  // Revelado con leve escalonado (stagger) por grupo.
  const reveals = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const siblings = el.parentElement ? el.parentElement.querySelectorAll("[data-reveal]") : [el];
            const index = Array.prototype.indexOf.call(siblings, el);
            el.style.transitionDelay = Math.min(index, 4) * 90 + "ms";
            el.classList.add("is-visible");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -70px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
  }

  // Parallax muy sutil del fondo.
  if (aurora && !reduceMotion) {
    let ticking = false;
    const update = () => {
      aurora.style.transform = "translate3d(0," + Math.min(window.scrollY * 0.06, 120) + "px,0)";
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
      },
      { passive: true }
    );
  }

  const progress = document.querySelector(".scroll-progress");
  if (progress) {
    const onProgress = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? h.scrollTop / max : 0) + ")";
    };
    onProgress();
    window.addEventListener("scroll", onProgress, { passive: true });
    window.addEventListener("resize", onProgress);
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const emailLink = document.getElementById("contact-email");
  if (emailLink && HAPMED_CONFIG.contactEmail) {
    emailLink.href = "mailto:" + HAPMED_CONFIG.contactEmail;
    emailLink.textContent = HAPMED_CONFIG.contactEmail;
  }

  // Mascota: el mono se columpia por la página a intervalos aleatorios.
  const mascot = document.querySelector(".mascot");
  if (mascot && !reduceMotion) {
    let animating = false;

    const swing = () => {
      if (animating || document.hidden) { schedule(); return; }
      animating = true;
      const w = window.innerWidth;
      const top = 12 + Math.random() * 38; // % desde arriba
      mascot.style.top = top + "vh";
      mascot.style.opacity = "1";

      mascot.animate(
        [
          { transform: "translate3d(-190px, 0, 0) rotate(-24deg)", opacity: 0 },
          { transform: "translate3d(" + (w / 2 - 70) + "px, -90px, 0) rotate(0deg)", opacity: 1, offset: 0.5 },
          { transform: "translate3d(" + (w + 190) + "px, 0, 0) rotate(24deg)", opacity: 1 }
        ],
        { duration: 4600, easing: "ease-in-out" }
      ).onfinish = () => {
        mascot.style.opacity = "0";
        animating = false;
        schedule();
      };
    };

    const schedule = () => {
      window.setTimeout(swing, 6000 + Math.random() * 12000);
    };

    schedule();
  }
})();
