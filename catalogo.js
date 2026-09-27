/* ============================================================
   THORGONZA — Catálogo de Papelería
   ============================================================
   CÓMO AGREGAR PRODUCTOS:
   Solo agrega un objeto al array 'productos' con esta estructura:

   {
     nombre: "Nombre del producto",
     descripcion: "Descripción del producto aquí...",
     imagen: "img/CatalogoPapel/nombre-imagen.jpg",
     categoria: "Categoría",
     precio: "$0.00"
   }

   Las categorías se generan automáticamente.
   Puedes poner las que quieras: "Tarjetas", "Hojas", "Carpetas", etc.
   ============================================================ */

(function () {
  "use strict";

  /* ==============================
     ARRAY DE PRODUCTOS
     ==============================
     AGREGA TUS PRODUCTOS AQUÍ ↓
  */
  const productos = [
    {
      nombre: "Almohadilla dactilar",
      descripcion: "Almohadilla para firma electrónica o sello húmedo. Diseño personalizado con tu marca.",
      imagen: "img/CatalogoPapel/Almohadilla dactilar.png",
      categoria: "Accesorios",
      precio: "$5.00"
    }
    /* ----- EJEMPLO: descomenta y edita para agregar más productos -----
    ,
    {
      nombre: "Tarjetas de presentación",
      descripcion: "Impresión a doble cara en papel couché 300g. Acabado brillante o mate.",
      imagen: "img/CatalogoPapel/tarjetas.jpg",
      categoria: "Tarjetas",
      precio: "$8.00"
    },
    {
      nombre: "Hojas membretadas",
      descripcion: "Formato A4, papel bond 90g, color institucional con logo al dorso.",
      imagen: "img/CatalogoPapel/hojas.png",
      categoria: "Hojas",
      precio: "$12.00"
    },
    {
      nombre: "Carpetas corporativas",
      descripcion: "Acabado mate, logos estampados. Ideales para presentaciones y reuniones.",
      imagen: "img/CatalogoPapel/carpetas.jpg",
      categoria: "Carpetas",
      precio: "$25.00"
    },
    {
      nombre: "Sobres personalizados",
      descripcion: "Sobres tamaño oficio con impresión a todo color. Cierre adhesivo o pestaña.",
      imagen: "img/CatalogoPapel/sobres.jpg",
      categoria: "Hojas",
      precio: "$10.00"
    },
    {
      nombre: "Stickers adhesivos",
      descripcion: "Vinilo adhesivo de alta resistencia. Corte personalizado a cualquier forma.",
      imagen: "img/CatalogoPapel/stickers.png",
      categoria: "Accesorios",
      precio: "$3.50"
    }
    ----- FIN DEL EJEMPLO ----- */
  ];

  /* ==============================
     CONFIGURACIÓN
     ============================== */
  const PRODUCTOS_POR_CARGA = {
    desktop: 12,
    tablet: 8,
    mobile: 6
  };

  /* ==============================
     VARIABLES
     ============================== */
  let categoriaActiva = "todos";
  let productosFiltrados = [...productos];
  let productosMostrados = 0;
  let cargando = false;

  /* ==============================
     DOM
     ============================== */
  const grid = document.getElementById("catalogoGrid");
  const filtroContainer = document.getElementById("filtro");
  const sentinel = document.getElementById("sentinel");
  const modal = document.getElementById("modal");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalCerrar = document.getElementById("modalCerrar");
  const modalImagen = document.getElementById("modalImagen");
  const modalNombre = document.getElementById("modalNombre");
  const modalDescripcion = document.getElementById("modalDescripcion");

  /* ==============================
     UTILIDADES
     ============================== */
  function obtenerLimite() {
    const width = window.innerWidth;
    if (width <= 768) return PRODUCTOS_POR_CARGA.mobile;
    if (width <= 1024) return PRODUCTOS_POR_CARGA.tablet;
    return PRODUCTOS_POR_CARGA.desktop;
  }

  function extraerCategorias() {
    const cats = [...new Set(productos.map((p) => p.categoria))];
    return cats.sort();
  }

  /* ==============================
     FILTROS
     ============================== */
  function renderizarFiltros() {
    const categorias = extraerCategorias();

    /* Botón "Todos" ya está en el HTML, agrega los demás */
    categorias.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "filtro__btn";
      btn.dataset.categoria = cat;
      btn.textContent = cat;
      filtroContainer.appendChild(btn);
    });
  }

  function filtrarProductos(categoria) {
    categoriaActiva = categoria;
    productosFiltrados =
      categoria === "todos"
        ? [...productos]
        : productos.filter((p) => p.categoria === categoria);

    productosMostrados = 0;
    grid.innerHTML = "";
    cargarMasProductos();
  }

  /* ==============================
     RENDERIZADO DE CARDS
     ============================== */
  function crearCardProducto(producto) {
    const card = document.createElement("article");
    card.className = "card-producto";
    card.innerHTML = `
      <div class="card-producto__imagen-contenedor">
        <img
          class="card-producto__imagen"
          src="${producto.imagen}"
          alt="${producto.nombre}"
          loading="lazy"
        />
        <span class="card-producto__precio">${producto.precio}</span>
      </div>
      <div class="card-producto__cuerpo">
        <span class="card-producto__categoria">${producto.categoria}</span>
        <h3 class="card-producto__nombre">${producto.nombre}</h3>
        <p class="card-producto__descripcion">${producto.descripcion}</p>
      </div>
    `;

    /* Click para abrir modal */
    card.addEventListener("click", () => abrirModal(producto));

    return card;
  }

  function cargarMasProductos() {
    if (cargando) return;
    cargando = true;

    const limite = obtenerLimite();
    const inicio = productosMostrados;
    const fin = Math.min(inicio + limite, productosFiltrados.length);

    if (inicio >= productosFiltrados.length) {
      cargando = false;
      return;
    }

    const fragmento = document.createDocumentFragment();

    for (let i = inicio; i < fin; i++) {
      const card = crearCardProducto(productosFiltrados[i]);
      fragmento.appendChild(card);
    }

    grid.appendChild(fragmento);
    productosMostrados = fin;

    /* Animación reveal de las nuevas cards */
    requestAnimationFrame(() => {
      const nuevasCards = grid.querySelectorAll(".card-producto:not(.visible)");
      nuevasCards.forEach((card, idx) => {
        setTimeout(() => card.classList.add("visible"), idx * 60);
      });
    });

    cargando = false;
  }

  /* ==============================
     MODAL
     ============================== */
  function abrirModal(producto) {
    modalImagen.src = producto.imagen;
    modalImagen.alt = producto.nombre;
    modalNombre.textContent = producto.nombre;
    modalDescripcion.textContent = producto.descripcion;

    /* Actualizar precio en el modal */
    const modalPrecio = document.getElementById("modalPrecio");
    if (modalPrecio) {
      modalPrecio.textContent = producto.precio;
    }

    modal.classList.add("abierto");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function cerrarModal() {
    modal.classList.remove("abierto");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  /* ==============================
     SCROLL INFINITO
     ============================== */
  function configurarScrollInfinito() {
    if (!("IntersectionObserver" in window)) {
      /* Fallback: carga todo de una vez */
      cargarMasProductos();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !cargando) {
            cargarMasProductos();
          }
        });
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
  }

  /* ==============================
     EVENTOS
     ============================== */

  /* Filtros */
  filtroContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".filtro__btn");
    if (!btn) return;

    /* Actualizar estado activo */
    filtroContainer.querySelectorAll(".filtro__btn").forEach((b) => {
      b.classList.remove("filtro__btn--activo");
    });
    btn.classList.add("filtro__btn--activo");

    filtrarProductos(btn.dataset.categoria);
  });

  /* Modal: cerrar */
  modalCerrar.addEventListener("click", cerrarModal);
  modalOverlay.addEventListener("click", cerrarModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("abierto")) {
      cerrarModal();
    }
  });

  /* Modal: swipe para cerrar en móvil */
  let touchStartY = 0;
  modal.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  modal.addEventListener("touchend", (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    if (touchEndY - touchStartY > 80) {
      cerrarModal();
    }
  }, { passive: true });

  /* ==============================
     INICIALIZACIÓN
     ============================== */
  function init() {
    renderizarFiltros();
    cargarMasProductos();
    configurarScrollInfinito();
  }

  init();
})();
