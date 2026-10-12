const roadmapItems = [

  {
    version: "v1.0.0",
    codename: "Foundation",
    title: "Base estable",

    status: "published",
    statusLabel: "Publicada",

    summary:
      "Primera versión funcional y base SemVer de LabNotes.",

    details: [
      "Autenticación, recuperación de contraseña y gestión de cuenta.",
      "Notas, categorías, laboratorios, etiquetas, búsqueda, imágenes y comentarios.",
      "Perfil, preferencias, administración básica y diseño responsive.",
      "Node.js, Express, SQL Server / Azure SQL, JWT HttpOnly, SMTP, GitHub Actions y Azure App Service."
    ]
  },


  {
    version: "v1.1.0",
    preRelease: "v1.1.0-alpha.1",

    codename: "Night Shift",
    title: "Experiencia y participación",

    status: "current",
    statusLabel: "En desarrollo",

    summary:
      "Accesibilidad visual, participación comunitaria y mejor organización de las notas.",


    implemented: [

      "Sistema de temas y apariencia de Night Shift.",

      "Tema oscuro y persistencia de preferencias visuales.",

      "Sistema de votos Útil / No útil.",

      "Backend, frontend, estilos y migración SQL del sistema de votos.",

      "Versión SemVer y codename configurados como fuente del release.",

      "Correcciones responsive de Night Shift para móvil."

    ],


    inProgress: [

      "Sistema de favoritos por usuario.",

      "Backend de favoritos iniciado.",

      "Migración SQL de favoritos iniciada.",

      "Pendiente completar interfaz e integración de Mis favoritos."

    ],


    pending: [

      "Mostrar versión y codename dentro de la interfaz de LabNotes.",

      "Completar favoritos de extremo a extremo.",

      "Ordenamiento por más recientes, más útiles y más comentadas.",

      "Estado Abierto / Resuelto, visualización y filtrado.",

      "Pruebas de regresión y validación final de Night Shift.",

      "Avanzar desde alpha hacia beta / rc antes de publicar v1.1.0 estable."

    ]
  },


  {
    version: "v1.2.0",
    codename: "Resolve",
    title: "Soluciones colaborativas",

    status: "planned",
    statusLabel: "Planeada",

    summary:
      "Comentarios convertidos en respuestas técnicas con validación y moderación.",

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

    summary:
      "Encontrar conocimiento útil de forma rápida incluso con gran volumen de notas.",

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

    summary:
      "Vincular LabNotes con computadoras físicas y crear historial técnico por equipo.",

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

    summary:
      "Reconocer contribuciones útiles sin convertir la plataforma en una competencia excesiva.",

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

    summary:
      "Robustecer despliegues, observabilidad, seguridad y pruebas.",

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

    summary:
      "Trazabilidad de cambios y reutilización del conocimiento fuera de la plataforma.",

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

    summary:
      "Una experiencia instalable, más inmediata y personalizada.",

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

    summary:
      "Operación formal de laboratorios, mantenimiento e inventario.",

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

    summary:
      "Asistencia basada en datos cuando exista suficiente conocimiento real acumulado.",

    details: [
      "Problemas similares avanzados.",
      "Recomendación de soluciones existentes.",
      "Sugerencias de categorías y etiquetas.",
      "Resumen de soluciones extensas.",
      "Control humano como principio de diseño."
    ]
  }

];



const grid =
  document.querySelector("#roadmapGrid");


const detail =
  document.querySelector("#roadmapDetail");


const filters =
  [
    ...document.querySelectorAll(
      "[data-filter]"
    )
  ];


let activeFilter =
  "all";


let selectedVersion =
  null;



function statusClass(status) {

  if (status === "published") {
    return "status-published";
  }

  if (status === "current") {
    return "status-current-roadmap";
  }

  if (status === "planned") {
    return "status-planned";
  }

  return "status-future";

}



function matchesFilter(item) {

  return (
    activeFilter === "all" ||
    item.status === activeFilter
  );

}



function renderGrid() {

  const visible =
    roadmapItems.filter(
      matchesFilter
    );


  grid.innerHTML =
    visible
      .map((item) => {

        const versionText =
          item.preRelease
            ? `${item.version} · ${item.codename}`
            : `${item.version} · ${item.codename}`;


        return `

          <button
            class="
              roadmap-card
              ${
                selectedVersion === item.version
                  ? "selected"
                  : ""
              }
            "
            type="button"
            data-version="${item.version}"
          >

            <div class="roadmap-card-top">

              <span class="roadmap-version">
                ${versionText}
              </span>

              <span
                class="
                  roadmap-status
                  ${statusClass(item.status)}
                "
              >
                ${item.statusLabel}
              </span>

            </div>


            <h3>
              ${item.title}
            </h3>


            <p>
              ${item.summary}
            </p>


            ${
              item.preRelease
                ? `
                  <span class="roadmap-open">
                    ${item.preRelease} · Ver progreso →
                  </span>
                `
                : `
                  <span class="roadmap-open">
                    Ver detalle →
                  </span>
                `
            }

          </button>

        `;

      })
      .join("");


  grid
    .querySelectorAll(
      "[data-version]"
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          showDetail(
            button.dataset.version
          );

        }
      );

    });

}



function listMarkup(items) {

  return `
    <ul>
      ${
        items
          .map(
            (item) =>
              `<li>${item}</li>`
          )
          .join("")
      }
    </ul>
  `;

}



function currentProgressMarkup(item) {

  return `

    <div class="roadmap-progress-detail">


      <section
        class="
          roadmap-progress-group
          done
        "
      >

        <h4>
          Implementado
        </h4>

        ${listMarkup(item.implemented)}

      </section>



      <section
        class="
          roadmap-progress-group
          working
        "
      >

        <h4>
          En progreso
        </h4>

        ${listMarkup(item.inProgress)}

      </section>



      <section
        class="
          roadmap-progress-group
          pending
        "
      >

        <h4>
          Pendiente
        </h4>

        ${listMarkup(item.pending)}

      </section>


    </div>

  `;

}



function normalDetailMarkup(item) {

  return listMarkup(
    item.details ?? []
  );

}



function showDetail(version) {

  const item =
    roadmapItems.find(
      (candidate) =>
        candidate.version === version
    );


  if (!item) {
    return;
  }


  selectedVersion =
    version;


  renderGrid();


  detail.hidden =
    false;


  const extraVersion =
    item.preRelease
      ? `
        <p>
          Pre-release actual:
          <strong>
            ${item.preRelease}
          </strong>
        </p>
      `
      : "";


  const content =
    item.status === "current"
      ? currentProgressMarkup(item)
      : normalDetailMarkup(item);


  detail.innerHTML = `

    <div class="roadmap-detail-header">

      <div>

        <span class="roadmap-version">
          ${item.version}
        </span>

        <h3>
          ${item.codename}
          ·
          ${item.title}
        </h3>

      </div>


      <span
        class="
          roadmap-status
          ${statusClass(item.status)}
        "
      >
        ${item.statusLabel}
      </span>

    </div>


    <p>
      ${item.summary}
    </p>


    ${extraVersion}


    ${content}


    <button
      class="roadmap-close"
      type="button"
      id="roadmapClose"
    >
      Cerrar detalle
    </button>

  `;


  document
    .querySelector(
      "#roadmapClose"
    )
    ?.addEventListener(
      "click",
      () => {

        selectedVersion =
          null;

        detail.hidden =
          true;

        detail.innerHTML =
          "";

        renderGrid();

      }
    );


  detail.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });

}



filters.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        activeFilter =
          button.dataset.filter;


        selectedVersion =
          null;


        detail.hidden =
          true;


        detail.innerHTML =
          "";


        filters.forEach(
          (candidate) => {

            const active =
              candidate === button;


            candidate.classList.toggle(
              "active",
              active
            );


            candidate.setAttribute(
              "aria-pressed",
              String(active)
            );

          }
        );


        renderGrid();

      }
    );

  }
);



renderGrid();
