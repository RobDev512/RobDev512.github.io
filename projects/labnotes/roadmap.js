const roadmapItems = [
  {
    version: "v1.0.0",
    codename: "Foundation",
    title: "Base estable",
    status: "published",
    statusLabel: "Publicada",
    summary: "Primera versión funcional y base SemVer de LabNotes.",
    details: [
      "Autenticación, recuperación de contraseña y gestión de cuenta.",
      "Notas, categorías, laboratorios, etiquetas, búsqueda, imágenes y comentarios.",
      "Perfil, preferencias, administración básica y diseño responsive.",
      "Node.js, Express, SQL Server / Azure SQL, JWT HttpOnly, SMTP, GitHub Actions y Azure App Service."
    ]
  },
  {
    version: "v1.1.0",
    codename: "Night Shift",
    title: "Experiencia y participación",
    status: "current",
    statusLabel: "Actual",
    summary: "Accesibilidad visual, feedback comunitario y organización de notas.",
    details: [
      "Modo oscuro con detección del sistema, persistencia y contraste accesible.",
      "Versión y codename visibles.",
      "Votos Útil / No útil.",
      "Favoritos y sección Mis favoritos.",
      "Ordenamiento por recientes, útiles y comentadas.",
      "Estado Abierto / Resuelto con filtrado."
    ]
  },
  {
    version: "v1.2.0",
    codename: "Resolve",
    title: "Soluciones colaborativas",
    status: "planned",
    statusLabel: "Planeada",
    summary: "Comentarios convertidos en respuestas técnicas con validación y moderación.",
    details: [
      "Solución aceptada por el autor.",
      "Votos en respuestas.",
      "Notificaciones internas.",
      "Reportes y moderación administrativa."
    ]
  },
  {
    version: "v1.3.0",
    codename: "Compass",
    title: "Búsqueda y descubrimiento",
    status: "planned",
    statusLabel: "Planeada",
    summary: "Encontrar conocimiento útil de forma rápida incluso con gran volumen de notas.",
    details: [
      "Búsqueda avanzada.",
      "Filtros combinables.",
      "Problemas similares antes de publicar.",
      "Paginación, carga progresiva y skeleton loaders."
    ]
  },
  {
    version: "v1.4.0",
    codename: "Grid",
    title: "Equipos, QR e incidencias",
    status: "planned",
    statusLabel: "Planeada",
    summary: "Vincular LabNotes con computadoras físicas y crear historial técnico por equipo.",
    details: [
      "Entidad Equipo y notas por computadora.",
      "Página e historial de cada equipo.",
      "Código QR único.",
      "Historial de incidencias y dashboard de resolución."
    ]
  },
  {
    version: "v1.5.0",
    codename: "Merit",
    title: "Perfiles y reputación",
    status: "planned",
    statusLabel: "Planeada",
    summary: "Reconocer contribuciones útiles sin convertir la plataforma en competencia excesiva.",
    details: [
      "Perfil ampliado.",
      "Insignias por aportaciones.",
      "Historial cronológico de actividad.",
      "Reputación contextual."
    ]
  },
  {
    version: "v1.6.0",
    codename: "Sentinel",
    title: "Infraestructura y seguridad",
    status: "planned",
    statusLabel: "Planeada",
    summary: "Robustecer despliegues, observabilidad, seguridad y pruebas.",
    details: [
      "Azure Blob Storage.",
      "Logs estructurados y health checks.",
      "Rate limiting y validación de uploads.",
      "Pruebas automáticas y CI/CD con gates."
    ]
  },
  {
    version: "v1.7.0",
    codename: "Archive",
    title: "Historial y exportación",
    status: "planned",
    statusLabel: "Planeada",
    summary: "Trazabilidad de cambios y reutilización del conocimiento fuera de la plataforma.",
    details: [
      "Historial de versiones de notas.",
      "Restauración de contenido previo.",
      "Exportación PDF.",
      "Formato de impresión."
    ]
  },
  {
    version: "v1.8.0",
    codename: "Pulse",
    title: "PWA, tiempo real y suscripciones",
    status: "planned",
    statusLabel: "Planeada",
    summary: "Una experiencia instalable, más inmediata y personalizada.",
    details: [
      "PWA en Android, iPhone y Windows.",
      "Mejor manejo de conexiones lentas.",
      "Notificaciones avanzadas.",
      "Tiempo real y suscripciones."
    ]
  },
  {
    version: "v1.9.0",
    codename: "Campus",
    title: "Capacidades institucionales",
    status: "planned",
    statusLabel: "Planeada",
    summary: "Operación formal de laboratorios, mantenimiento e inventario.",
    details: [
      "Estructura institucional.",
      "Roles avanzados.",
      "Mantenimiento con prioridades y técnicos asignados.",
      "Inventario y trazabilidad técnica."
    ]
  },
  {
    version: "v1.10.0",
    codename: "Insight",
    title: "Funciones inteligentes",
    status: "future",
    statusLabel: "Visión",
    summary: "Asistencia basada en datos cuando exista suficiente conocimiento real acumulado.",
    details: [
      "Problemas similares avanzados.",
      "Recomendación de soluciones existentes.",
      "Sugerencias de categorías y etiquetas.",
      "Resumen de soluciones extensas.",
      "Control humano como principio de diseño."
    ]
  }
];

const grid = document.querySelector("#roadmapGrid");
const detail = document.querySelector("#roadmapDetail");
const filters = [...document.querySelectorAll("[data-filter]")];

let activeFilter = "all";
let selectedVersion = null;

function statusClass(status) {
  if (status === "published") return "status-published";
  if (status === "current") return "status-current-roadmap";
  if (status === "planned") return "status-planned";
  return "status-future";
}

function matchesFilter(item) {
  return activeFilter === "all" || item.status === activeFilter;
}

function renderGrid() {
  const visible = roadmapItems.filter(matchesFilter);

  grid.innerHTML = visible.map((item) => `
    <button class="roadmap-card ${selectedVersion === item.version ? "selected" : ""}" type="button" data-version="${item.version}">
      <div class="roadmap-card-top">
        <span class="roadmap-version">${item.version} · ${item.codename}</span>
        <span class="roadmap-status ${statusClass(item.status)}">${item.statusLabel}</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <span class="roadmap-open">Ver detalle →</span>
    </button>
  `).join("");

  grid.querySelectorAll("[data-version]").forEach((button) => {
    button.addEventListener("click", () => showDetail(button.dataset.version));
  });
}

function showDetail(version) {
  const item = roadmapItems.find((candidate) => candidate.version === version);
  if (!item) return;

  selectedVersion = version;
  renderGrid();

  detail.hidden = false;
  detail.innerHTML = `
    <div class="roadmap-detail-header">
      <div>
        <span class="roadmap-version">${item.version}</span>
        <h3>${item.codename} · ${item.title}</h3>
      </div>
      <span class="roadmap-status ${statusClass(item.status)}">${item.statusLabel}</span>
    </div>
    <p>${item.summary}</p>
    <ul>${item.details.map((detailItem) => `<li>${detailItem}</li>`).join("")}</ul>
    <button class="roadmap-close" type="button" id="roadmapClose">Cerrar detalle</button>
  `;

  document.querySelector("#roadmapClose")?.addEventListener("click", () => {
    selectedVersion = null;
    detail.hidden = true;
    detail.innerHTML = "";
    renderGrid();
  });

  detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    selectedVersion = null;
    detail.hidden = true;
    detail.innerHTML = "";

    filters.forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle("active", active);
      candidate.setAttribute("aria-pressed", String(active));
    });

    renderGrid();
  });
});

renderGrid();
