"use strict";

// Configuración editable del contacto comercial.
// Reemplazar por los datos reales cuando se confirmen. Los campos vacíos se ocultan.
const HAPMED_CONFIG = {
  contactEmail: "contacto@hapmed.example",
  contactSecondaryLabel: "LinkedIn",
  contactSecondaryUrl: "",
};

(function () {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.getElementById("primary-nav");

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

  const reveals = document.querySelectorAll("[data-reveal]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const emailLink = document.getElementById("contact-email");
  if (emailLink && HAPMED_CONFIG.contactEmail) {
    emailLink.href = "mailto:" + HAPMED_CONFIG.contactEmail;
    emailLink.textContent = HAPMED_CONFIG.contactEmail;
  }

  const secondaryLink = document.getElementById("contact-secondary");
  if (secondaryLink) {
    if (HAPMED_CONFIG.contactSecondaryUrl) {
      secondaryLink.href = HAPMED_CONFIG.contactSecondaryUrl;
      secondaryLink.textContent = HAPMED_CONFIG.contactSecondaryLabel;
      secondaryLink.hidden = false;
      secondaryLink.rel = "noopener";
      secondaryLink.target = "_blank";
    } else {
      secondaryLink.hidden = true;
    }
  }
})();
