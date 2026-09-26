/* Thorgonza — interacciones de la landing page */

(function () {
  "use strict";

  /* ---------- Menú móvil ---------- */
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  toggle.addEventListener("click", () => {
    const aberto = menu.classList.toggle("abierto");
    toggle.classList.toggle("activo", aberto);
    toggle.setAttribute("aria-expanded", String(aberto));
    toggle.setAttribute("aria-label", aberto ? "Cerrar menú" : "Abrir menú");
  });

  menu.querySelectorAll("a").forEach((enlace) => {
    enlace.addEventListener("click", () => {
      menu.classList.remove("abierto");
      toggle.classList.remove("activo");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Sombra del header al hacer scroll ---------- */
  const header = document.querySelector(".header");
  const onScroll = () => header.classList.toggle("sombra", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Animación de aparición (reveal) ---------- */
  const elementos = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
            observer.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    elementos.forEach((el) => observer.observe(el));
  } else {
    elementos.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Efecto parallax suave en burbujas del hero ---------- */
  const burbujas = document.querySelectorAll(".burbuja");
  const hero = document.querySelector(".hero");

  if (hero && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    hero.addEventListener("mousemove", (e) => {
      const { clientX, clientY } = e;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (clientX - cx) / cx;
      const dy = (clientY - cy) / cy;

      burbujas.forEach((b, i) => {
        const factor = (i + 1) * 6;
        b.style.translate = `${dx * factor}px ${dy * factor}px`;
      });
    });
  }

  /* ---------- Resaltar enlace activo en la navegación ---------- */
  const secciones = document.querySelectorAll("main section[id]");
  const enlaces = document.querySelectorAll(".nav__link");

  if ("IntersectionObserver" in window && secciones.length) {
    const navObserver = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            enlaces.forEach((l) => {
              l.style.color = l.getAttribute("href") === `#${entrada.target.id}`
                ? "#3caafb"
                : "";
            });
          }
        });
      },
      { threshold: 0.5 }
    );
    secciones.forEach((s) => navObserver.observe(s));
  }
})();
