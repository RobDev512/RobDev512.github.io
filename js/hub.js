"use strict";

const CATALOG_URL = "./data/projects.json";
const HUB_ROADMAP_URL = "./docs/HUB-ROADMAP.md";
const SUPPORTED_SCHEMA_VERSION = 1;
const SUPPORTED_CARD_VARIANTS = new Set([
  "featured",
  "labnotes",
  "standard"
]);

const state = {
  catalog: null,
  projects: [],
  filters: {
    category: null,
    status: null,
    technology: null,
    visibility: null,
    query: null,
    featured: false
  },
  sort: "curated",
  advancedOpen: false,
  roadmap: {
    phases: [],
    markdown: "",
    view: "cards",
    selected: null,
    canvasNodes: []
  }
};

const grid = document.querySelector("#projectsGrid");
const categoryFilters = document.querySelector("#categoryFilters");
const catalogSummary = document.querySelector("#catalogSummary");

const catalogSearch =
  document.querySelector("#catalogSearch");

const statusFilter =
  document.querySelector("#statusFilter");

const visibilityFilter =
  document.querySelector("#visibilityFilter");

const technologyFilter =
  document.querySelector("#technologyFilter");

const sortOrder =
  document.querySelector("#sortOrder");

const featuredOnly =
  document.querySelector("#featuredOnly");

const resetCatalogFilters =
  document.querySelector("#resetCatalogFilters");

const advancedSearchToggle =
  document.querySelector("#advancedSearchToggle");

const advancedCatalogPanel =
  document.querySelector("#advancedCatalogPanel");

const hubRoadmapGrid =
  document.querySelector("#hubRoadmapGrid");

const hubRoadmapStatus =
  document.querySelector("#hubRoadmapStatus");

const hubRoadmapViewToggle =
  document.querySelector("#hubRoadmapViewToggle");

const hubRoadmapPdfExport =
  document.querySelector("#hubRoadmapPdfExport");

const hubRoadmapTimeline =
  document.querySelector("#hubRoadmapTimeline");

const hubRoadmapCanvas =
  document.querySelector("#hubRoadmapCanvas");

const hubRoadmapDetail =
  document.querySelector("#hubRoadmapDetail");

const hubRoadmapDetailTop =
  document.querySelector("#hubRoadmapDetailTop");

const hubRoadmapDetailTitle =
  document.querySelector("#hubRoadmapDetailTitle");

const hubRoadmapDetailBody =
  document.querySelector("#hubRoadmapDetailBody");

function createElement(tagName, className = "", text = "") {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text !== "") {
    element.textContent = text;
  }

  return element;
}

function requireString(value, fieldName, projectId = "catalog") {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `${projectId}: "${fieldName}" debe ser una cadena no vacía.`
    );
  }
}

function validateTaxonomy(catalog) {
  if (
    !catalog.taxonomy ||
    !Array.isArray(catalog.taxonomy.categories) ||
    !Array.isArray(catalog.taxonomy.statuses) ||
    !Array.isArray(catalog.taxonomy.visibilities)
  ) {
    throw new Error("El catálogo no contiene una taxonomía válida.");
  }

  const taxonomyGroups = [
    "categories",
    "statuses",
    "visibilities"
  ];

  for (const groupName of taxonomyGroups) {
    const ids = new Set();

    for (const item of catalog.taxonomy[groupName]) {
      requireString(item.id, `${groupName}.id`);
      requireString(item.label, `${groupName}.label`);

      if (ids.has(item.id)) {
        throw new Error(
          `ID duplicado en taxonomy.${groupName}: ${item.id}`
        );
      }

      ids.add(item.id);
    }
  }
}

function taxonomyIds(catalog, groupName) {
  return new Set(
    catalog.taxonomy[groupName].map((item) => item.id)
  );
}

function validateProject(project, catalog, knownIds) {
  requireString(project.id, "id", "project");

  if (knownIds.has(project.id)) {
    throw new Error(`ID de proyecto duplicado: ${project.id}`);
  }

  knownIds.add(project.id);

  requireString(project.name, "name", project.id);
  requireString(project.category, "category", project.id);
  requireString(project.subtype, "subtype", project.id);
  requireString(project.status, "status", project.id);
  requireString(project.visibility, "visibility", project.id);
  requireString(project.description, "description", project.id);

  if (!Array.isArray(project.technologies)) {
    throw new Error(`${project.id}: technologies debe ser un arreglo.`);
  }

  const categories = taxonomyIds(catalog, "categories");
  const statuses = taxonomyIds(catalog, "statuses");
  const visibilities = taxonomyIds(catalog, "visibilities");

  if (!categories.has(project.category)) {
    throw new Error(
      `${project.id}: categoría desconocida "${project.category}".`
    );
  }

  if (!statuses.has(project.status)) {
    throw new Error(
      `${project.id}: estado desconocido "${project.status}".`
    );
  }

  if (!visibilities.has(project.visibility)) {
    throw new Error(
      `${project.id}: visibilidad desconocida "${project.visibility}".`
    );
  }

  if (
    !project.card ||
    !SUPPORTED_CARD_VARIANTS.has(project.card.variant)
  ) {
    throw new Error(
      `${project.id}: variante de tarjeta no soportada.`
    );
  }

  if (!Array.isArray(project.card.badges)) {
    throw new Error(`${project.id}: card.badges debe ser un arreglo.`);
  }

  if (!Array.isArray(project.links)) {
    throw new Error(`${project.id}: links debe ser un arreglo.`);
  }

  if (
    project.updatedAt !== undefined &&
    (
      typeof project.updatedAt !== "string" ||
      Number.isNaN(Date.parse(project.updatedAt))
    )
  ) {
    throw new Error(`${project.id}: updatedAt no es una fecha válida.`);
  }

  if (
    project.featured !== undefined &&
    typeof project.featured !== "boolean"
  ) {
    throw new Error(`${project.id}: featured debe ser booleano.`);
  }

  for (const link of project.links) {
    requireString(link.label, "links.label", project.id);
    requireString(link.url, "links.url", project.id);
  }

  if (project.roadmapExport !== undefined) {
    requireString(
      project.roadmapExport.type,
      "roadmapExport.type",
      project.id
    );

    requireString(
      project.roadmapExport.url,
      "roadmapExport.url",
      project.id
    );

    requireString(
      project.roadmapExport.title,
      "roadmapExport.title",
      project.id
    );

    requireString(
      project.roadmapExport.filename,
      "roadmapExport.filename",
      project.id
    );
  }
}

function validateCatalog(catalog) {
  if (!catalog || typeof catalog !== "object") {
    throw new Error("El catálogo recibido no es válido.");
  }

  if (catalog.schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
    throw new Error(
      `schemaVersion no soportado: ${catalog.schemaVersion}`
    );
  }

  validateTaxonomy(catalog);

  if (!Array.isArray(catalog.projects)) {
    throw new Error("projects debe ser un arreglo.");
  }

  const knownIds = new Set();

  for (const project of catalog.projects) {
    validateProject(project, catalog, knownIds);
  }
}

function applyLinkBehavior(anchor, link) {
  anchor.href = link.url;

  if (link.external === true) {
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
  }
}

function buttonClasses(link) {
  switch (link.style) {
    case "primary":
      return "btn btn-primary";

    case "labnotes-primary":
      return "btn labnotes-button";

    case "secondary":
    default:
      return "btn btn-secondary";
  }
}


let roadmapPdfLoaderPromise = null;


function ensureRoadmapPdfExporter() {
  if (window.RoadmapPdf) {
    return Promise.resolve(
      window.RoadmapPdf
    );
  }

  if (roadmapPdfLoaderPromise) {
    return roadmapPdfLoaderPromise;
  }

  roadmapPdfLoaderPromise =
    new Promise(
      (resolve, reject) => {
        const script =
          document.createElement(
            "script"
          );

        script.src =
          "./js/roadmap-pdf.js";

        script.onload =
          () => {
            if (window.RoadmapPdf) {
              resolve(
                window.RoadmapPdf
              );
              return;
            }

            reject(
              new Error(
                "El exportador PDF no se inicializó."
              )
            );
          };

        script.onerror =
          () => {
            reject(
              new Error(
                "No se pudo cargar roadmap-pdf.js."
              )
            );
          };

        document.head.append(
          script
        );
      }
    );

  return roadmapPdfLoaderPromise;
}


async function exportProjectRoadmap(
  project,
  button
) {
  const config =
    project.roadmapExport;

  if (!config) {
    return;
  }

  const originalText =
    button.textContent;

  button.disabled = true;
  button.textContent =
    "Generando PDF…";

  try {
    const exporter =
      await ensureRoadmapPdfExporter();

    await exporter.downloadFromSource(
      config
    );

    button.textContent =
      "PDF descargado";

    window.setTimeout(
      () => {
        button.textContent =
          originalText;

        button.disabled =
          false;
      },
      1200
    );
  }
  catch (error) {
    console.error(
      `No se pudo exportar el roadmap de ${project.name}:`,
      error
    );

    button.textContent =
      "Error al exportar";

    window.setTimeout(
      () => {
        button.textContent =
          originalText;

        button.disabled =
          false;
      },
      1500
    );
  }
}


async function exportHubRoadmapPdf() {
  if (!hubRoadmapPdfExport) {
    return;
  }

  const originalText =
    hubRoadmapPdfExport.textContent;

  hubRoadmapPdfExport.disabled =
    true;

  hubRoadmapPdfExport.textContent =
    "Generando PDF…";

  try {
    const exporter =
      await ensureRoadmapPdfExporter();

    let markdown =
      state.roadmap.markdown;

    if (!markdown) {
      const response =
        await fetch(
          HUB_ROADMAP_URL,
          {
            cache: "no-store"
          }
        );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      markdown =
        await response.text();
    }

    exporter.downloadMarkdown({
      markdown,
      title:
        "RobDev512 Hub",
      subtitle:
        "Roadmap general del portafolio",
      source:
        HUB_ROADMAP_URL,
      filename:
        "RobDev512-Hub-Roadmap.pdf"
    });

    hubRoadmapPdfExport.textContent =
      "PDF descargado";

    window.setTimeout(
      () => {
        hubRoadmapPdfExport.textContent =
          originalText;

        hubRoadmapPdfExport.disabled =
          false;
      },
      1200
    );
  }
  catch (error) {
    console.error(
      "No se pudo exportar el roadmap del Hub:",
      error
    );

    hubRoadmapPdfExport.textContent =
      "Error al exportar";

    window.setTimeout(
      () => {
        hubRoadmapPdfExport.textContent =
          originalText;

        hubRoadmapPdfExport.disabled =
          false;
      },
      1500
    );
  }
}


function createActions(project, extraClass = "") {
  const actions = createElement(
    "div",
    `project-actions ${extraClass}`.trim()
  );

  for (const link of project.links) {
    const anchor = createElement(
      "a",
      buttonClasses(link),
      link.label
    );

    applyLinkBehavior(anchor, link);
    actions.append(anchor);
  }

  if (project.roadmapExport) {
    const exportButton =
      createElement(
        "button",
        "btn btn-secondary roadmap-pdf-action",
        "Roadmap PDF"
      );

    exportButton.type =
      "button";

    exportButton.title =
      `Descargar respaldo PDF del roadmap de ${project.name}`;

    exportButton.addEventListener(
      "click",
      () => {
        exportProjectRoadmap(
          project,
          exportButton
        );
      }
    );

    actions.append(
      exportButton
    );
  }

  return actions;
}

function createBadges(project) {
  const tags = createElement("div", "project-tags");

  for (const badge of project.card.badges) {
    tags.append(createElement("span", "", badge));
  }

  return tags;
}

function taxonomyLabel(groupName, itemId) {
  if (
    !itemId ||
    !state.catalog ||
    !state.catalog.taxonomy ||
    !Array.isArray(state.catalog.taxonomy[groupName])
  ) {
    return null;
  }

  return (
    state.catalog.taxonomy[groupName].find(
      (item) => item.id === itemId
    )?.label ?? null
  );
}

function statusLabel(statusId) {
  return taxonomyLabel("statuses", statusId);
}

function visibilityLabel(visibilityId) {
  return taxonomyLabel("visibilities", visibilityId);
}

function createProjectState(project, extraClass = "") {
  const wrapper = createElement(
    "div",
    `project-state ${extraClass}`.trim()
  );

  const status = createElement(
    "span",
    `project-state-pill project-status project-status-${project.status}`
  );

  status.append(
    createElement(
      "span",
      "project-state-key",
      "Estado"
    ),
    createElement(
      "strong",
      "",
      statusLabel(project.status) ?? project.status
    )
  );

  const visibility = createElement(
    "span",
    `project-state-pill project-visibility project-visibility-${project.visibility}`
  );

  visibility.append(
    createElement(
      "span",
      "project-state-key",
      "Visibilidad"
    ),
    createElement(
      "strong",
      "",
      visibilityLabel(project.visibility) ?? project.visibility
    )
  );

  wrapper.append(
    status,
    visibility
  );

  const statusText =
    statusLabel(project.status);

  if (
    project.statusDetail &&
    project.statusDetail !== statusText
  ) {
    wrapper.append(
      createElement(
        "span",
        "project-state-detail",
        project.statusDetail
      )
    );
  }

  return wrapper;
}

function createMeta(project, extraClass = "", versionClass = "") {
  const meta = createElement(
    "div",
    `project-meta ${extraClass}`.trim()
  );

  meta.append(
    createElement(
      "span",
      "project-type",
      project.card.eyebrow
    )
  );

  if (project.version) {
    meta.append(
      createElement(
        "span",
        `project-version ${versionClass}`.trim(),
        project.version
      )
    );
  }

  return meta;
}

function applyProjectDataAttributes(article, project) {
  article.dataset.projectId = project.id;
  article.dataset.category = project.category;
  article.dataset.status = project.status;
  article.dataset.visibility = project.visibility;
}

function renderFeaturedCard(project) {
  const article = createElement(
    "article",
    "project-card project-card-featured"
  );

  applyProjectDataAttributes(article, project);

  const art = createElement("div", "project-art");

  art.append(
    createElement("div", "project-orbit orbit-a"),
    createElement("div", "project-orbit orbit-b")
  );

  const logo = createElement("img");
  logo.src = project.logo.src;
  logo.alt = project.logo.alt;
  art.append(logo);

  const copy = createElement("div", "project-copy");

  copy.append(
    createMeta(project),
    createElement("h3", "", project.name),
    createElement("p", "", project.description),
    createProjectState(project),
    createBadges(project),
    createActions(project)
  );

  article.append(art, copy);

  return article;
}

function renderLabNotesCard(project) {
  const article = createElement(
    "article",
    "project-card project-card-placeholder project-card-labnotes"
  );

  applyProjectDataAttributes(article, project);

  const logoShell = createElement(
    "div",
    "labnotes-logo-shell"
  );

  const logo = createElement("img", "labnotes-logo");
  logo.src = project.logo.src;
  logo.alt = project.logo.alt;
  logoShell.append(logo);

  article.append(
    logoShell,
    createMeta(
      project,
      "labnotes-meta",
      "labnotes-version"
    ),
    createElement("h3", "", project.name),
    createElement("p", "", project.description),
    createProjectState(project, "labnotes-state"),
    createBadges(project),
    createActions(project, "labnotes-actions")
  );

  return article;
}

function projectMark(project) {
  if (
    project.card &&
    typeof project.card.mark === "string" &&
    project.card.mark.trim() !== ""
  ) {
    return project.card.mark.trim().slice(0, 3).toUpperCase();
  }

  const words = project.name
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function renderStandardCard(project) {
  const article = createElement(
    "article",
    `project-card project-card-standard project-card-standard-${project.category}`
  );

  applyProjectDataAttributes(article, project);

  const visual = createElement(
    "div",
    "standard-card-visual"
  );

  visual.append(
    createElement("div", "standard-card-orbit orbit-one"),
    createElement("div", "standard-card-orbit orbit-two")
  );

  let identity;

  if (
    project.logo &&
    project.logo.src
  ) {
    identity = createElement(
      "img",
      "standard-card-logo"
    );

    identity.src = project.logo.src;
    identity.alt = project.logo.alt || project.name;
  }
  else {
    identity = createElement(
      "div",
      "standard-card-mark",
      projectMark(project)
    );
  }

  if (
    project.logo &&
    project.logo.src
  ) {
    visual.append(identity);
  }
  else {
    const category = createElement(
      "span",
      "standard-card-category",
      categoryLabel(project.category) ?? project.subtype
    );

    visual.append(identity, category);
  }

  const copy = createElement(
    "div",
    "standard-card-copy"
  );

  copy.append(
    createMeta(project),
    createElement("h3", "", project.name),
    createElement("p", "", project.description),
    createProjectState(project),
    createBadges(project),
    createActions(project)
  );

  article.append(visual, copy);

  return article;
}

function renderProjectCard(project) {
  switch (project.card.variant) {
    case "featured":
      return renderFeaturedCard(project);

    case "labnotes":
      return renderLabNotesCard(project);

    case "standard":
    default:
      return renderStandardCard(project);
  }
}

function normalizeSearchText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
}


function searchableProjectText(project) {
  const values = [
    project.name,
    project.subtype,
    project.description,
    project.version,
    project.codename,
    project.statusDetail,
    categoryLabel(project.category),
    statusLabel(project.status),
    visibilityLabel(project.visibility),
    ...project.technologies,
    ...(project.card?.badges ?? [])
  ];

  return normalizeSearchText(
    values
      .filter(Boolean)
      .join(" ")
  );
}


function projectMatchesFilters(
  project,
  filters = state.filters
) {
  const {
    category,
    status,
    technology,
    visibility,
    query,
    featured
  } = filters;

  if (
    category &&
    project.category !== category
  ) {
    return false;
  }

  if (
    status &&
    project.status !== status
  ) {
    return false;
  }

  if (
    technology &&
    !project.technologies.includes(technology)
  ) {
    return false;
  }

  if (
    visibility &&
    project.visibility !== visibility
  ) {
    return false;
  }

  if (
    featured === true &&
    project.featured !== true
  ) {
    return false;
  }

  if (query) {
    const needle =
      normalizeSearchText(query);

    if (
      needle &&
      !searchableProjectText(project).includes(needle)
    ) {
      return false;
    }
  }

  return true;
}


function projectTimestamp(project) {
  const value =
    Date.parse(project.updatedAt ?? "");

  return Number.isNaN(value)
    ? 0
    : value;
}


function curatedOrder(a, b) {
  return (
    (a.displayOrder ?? 9999) -
    (b.displayOrder ?? 9999)
  );
}


function projectComparator(a, b) {
  switch (state.sort) {
    case "recent":
      return (
        projectTimestamp(b) -
        projectTimestamp(a) ||
        curatedOrder(a, b)
      );

    case "featured":
      return (
        Number(b.featured === true) -
        Number(a.featured === true) ||
        projectTimestamp(b) -
        projectTimestamp(a) ||
        curatedOrder(a, b)
      );

    case "name-asc":
      return a.name.localeCompare(
        b.name,
        "es",
        {
          sensitivity: "base"
        }
      );

    case "name-desc":
      return b.name.localeCompare(
        a.name,
        "es",
        {
          sensitivity: "base"
        }
      );

    case "curated":
    default:
      return curatedOrder(a, b);
  }
}


function visibleProjects() {
  return state.projects
    .filter(
      (project) =>
        projectMatchesFilters(project)
    )
    .sort(projectComparator);
}


function categoryLabel(categoryId) {
  return taxonomyLabel(
    "categories",
    categoryId
  );
}


function projectCountFor(
  property,
  value
) {
  return state.projects.filter(
    (project) =>
      project[property] === value
  ).length;
}


function categoryProjectCount(categoryId) {
  return projectCountFor(
    "category",
    categoryId
  );
}


function activeCategories() {
  if (!state.catalog) {
    return [];
  }

  return state.catalog.taxonomy.categories.filter(
    (category) =>
      categoryProjectCount(category.id) > 0
  );
}


function createCategoryButton({
  id,
  label,
  count
}) {
  const isActive =
    state.filters.category === id;

  const button = createElement(
    "button",
    `category-filter${isActive ? " active" : ""}`
  );

  button.type = "button";
  button.dataset.category = id ?? "";

  button.setAttribute(
    "aria-pressed",
    String(isActive)
  );

  button.setAttribute(
    "aria-label",
    `${label}: ${count} ${
      count === 1
        ? "proyecto"
        : "proyectos"
    }`
  );

  button.append(
    createElement(
      "span",
      "",
      label
    ),
    createElement(
      "span",
      "category-filter-count",
      String(count)
    )
  );

  button.addEventListener(
    "click",
    () => {
      setFilters(
        {
          category: id
        },
        {
          historyMode: "push"
        }
      );
    }
  );

  return button;
}


function renderCategoryFilters() {
  if (
    !categoryFilters ||
    !state.catalog
  ) {
    return;
  }

  const fragment =
    document.createDocumentFragment();

  fragment.append(
    createCategoryButton({
      id: null,
      label: "Todos",
      count: state.projects.length
    })
  );

  for (
    const category
    of activeCategories()
  ) {
    fragment.append(
      createCategoryButton({
        id: category.id,
        label: category.label,
        count:
          categoryProjectCount(
            category.id
          )
      })
    );
  }

  categoryFilters.replaceChildren(
    fragment
  );
}


function uniqueTechnologies() {
  return [
    ...new Set(
      state.projects.flatMap(
        (project) =>
          project.technologies
      )
    )
  ].sort(
    (a, b) =>
      a.localeCompare(
        b,
        "es",
        {
          sensitivity: "base"
        }
      )
  );
}


function activeTaxonomyItems(
  groupName,
  projectProperty
) {
  if (!state.catalog) {
    return [];
  }

  return state.catalog.taxonomy[
    groupName
  ].filter(
    (item) =>
      projectCountFor(
        projectProperty,
        item.id
      ) > 0
  );
}


function populateSelect(
  select,
  items,
  placeholder
) {
  if (!select) {
    return;
  }

  const current =
    select.value;

  const fragment =
    document.createDocumentFragment();

  const empty =
    document.createElement("option");

  empty.value = "";
  empty.textContent = placeholder;

  fragment.append(empty);

  for (const item of items) {
    const option =
      document.createElement("option");

    option.value = item.id;
    option.textContent =
      item.label;

    fragment.append(option);
  }

  select.replaceChildren(fragment);

  if (
    [
      ...select.options
    ].some(
      (option) =>
        option.value === current
    )
  ) {
    select.value = current;
  }
}


function populateAdvancedFilters() {
  populateSelect(
    statusFilter,
    activeTaxonomyItems(
      "statuses",
      "status"
    ),
    "Todos los estados"
  );

  populateSelect(
    visibilityFilter,
    activeTaxonomyItems(
      "visibilities",
      "visibility"
    ),
    "Todas las visibilidades"
  );

  populateSelect(
    technologyFilter,
    uniqueTechnologies().map(
      (technology) => ({
        id: technology,
        label: technology
      })
    ),
    "Todas las tecnologías"
  );
}


function hasAdvancedFilterState() {
  return Boolean(
    state.filters.status ||
    state.filters.visibility ||
    state.filters.technology ||
    state.filters.featured === true ||
    state.sort !== "curated"
  );
}


function clearAdvancedFilters({
  historyMode = "push"
} = {}) {
  state.filters = {
    ...state.filters,
    status: null,
    visibility: null,
    technology: null,
    featured: false
  };

  state.sort = "curated";
  state.advancedOpen = false;

  syncUrl(historyMode);
  renderCatalog();
}


function setAdvancedOpen(
  open,
  {
    clearOnClose = true
  } = {}
) {
  const shouldOpen =
    open === true;

  if (
    !shouldOpen &&
    clearOnClose &&
    hasAdvancedFilterState()
  ) {
    clearAdvancedFilters();
    return;
  }

  state.advancedOpen =
    shouldOpen;

  syncControlValues();
}

function syncControlValues() {
  if (catalogSearch) {
    catalogSearch.value =
      state.filters.query ?? "";
  }

  if (statusFilter) {
    statusFilter.value =
      state.filters.status ?? "";
  }

  if (visibilityFilter) {
    visibilityFilter.value =
      state.filters.visibility ?? "";
  }

  if (technologyFilter) {
    technologyFilter.value =
      state.filters.technology ?? "";
  }

  if (sortOrder) {
    sortOrder.value =
      state.sort;
  }

  if (featuredOnly) {
    featuredOnly.checked =
      state.filters.featured === true;
  }

  if (resetCatalogFilters) {
    resetCatalogFilters.disabled =
      !hasActiveFilters();
  }

  if (advancedSearchToggle) {
    advancedSearchToggle.setAttribute(
      "aria-expanded",
      String(state.advancedOpen)
    );

    advancedSearchToggle.textContent =
      state.advancedOpen
        ? "Ocultar búsqueda avanzada"
        : "Búsqueda avanzada";
  }

  if (advancedCatalogPanel) {
    advancedCatalogPanel.hidden =
      !state.advancedOpen;
  }
}


function activeFilterCount() {
  return [
    state.filters.category,
    state.filters.status,
    state.filters.technology,
    state.filters.visibility,
    state.filters.query,
    state.filters.featured === true
      ? "featured"
      : null
  ].filter(Boolean).length;
}


function hasActiveFilters() {
  return (
    activeFilterCount() > 0 ||
    state.sort !== "curated"
  );
}


function renderCatalogSummary() {
  if (!catalogSummary) {
    return;
  }

  const visible =
    visibleProjects().length;

  const total =
    state.projects.length;

  const filterCount =
    activeFilterCount();

  if (
    visible === total &&
    filterCount === 0
  ) {
    catalogSummary.textContent =
      `${total} ${
        total === 1
          ? "proyecto"
          : "proyectos"
      } en el catálogo`;

    return;
  }

  catalogSummary.textContent =
    `${visible} de ${total} ${
      total === 1
        ? "proyecto"
        : "proyectos"
    } · ${filterCount} ${
      filterCount === 1
        ? "filtro activo"
        : "filtros activos"
    }`;
}


function renderProjects() {
  const projects =
    visibleProjects();

  const fragment =
    document.createDocumentFragment();

  for (const project of projects) {
    fragment.append(
      renderProjectCard(project)
    );
  }

  grid.replaceChildren(fragment);

  grid.setAttribute(
    "aria-busy",
    "false"
  );

  if (projects.length === 0) {
    const emptyCard =
      createElement(
        "article",
        "project-card project-card-placeholder"
      );

    emptyCard.append(
      createElement(
        "span",
        "project-type",
        "Catálogo"
      ),
      createElement(
        "h3",
        "",
        "No hay proyectos para mostrar"
      ),
      createElement(
        "p",
        "",
        "La búsqueda o los filtros actuales no coinciden con ningún proyecto."
      )
    );

    grid.append(emptyCard);
  }
}


function renderCatalog() {
  renderCategoryFilters();
  renderCatalogSummary();
  syncControlValues();
  renderProjects();

  requestAnimationFrame(
    refreshInteractionPolish
  );
}


function taxonomyItemExists(
  groupName,
  itemId
) {
  if (
    !itemId ||
    !state.catalog
  ) {
    return false;
  }

  return state.catalog.taxonomy[
    groupName
  ].some(
    (item) =>
      item.id === itemId
  );
}


function categoryHasProjects(
  categoryId
) {
  return (
    categoryProjectCount(
      categoryId
    ) > 0
  );
}


function technologyExists(
  technology
) {
  return (
    !technology ||
    uniqueTechnologies().includes(
      technology
    )
  );
}


function normalizeFilters(
  filters
) {
  const next = {
    ...state.filters,
    ...filters
  };

  for (
    const key
    of [
      "category",
      "status",
      "technology",
      "visibility",
      "query"
    ]
  ) {
    if (
      next[key] === "" ||
      next[key] === undefined
    ) {
      next[key] = null;
    }
  }

  next.featured =
    next.featured === true;

  return next;
}


const VALID_SORTS =
  new Set([
    "curated",
    "recent",
    "featured",
    "name-asc",
    "name-desc"
  ]);


function normalizeSort(sort) {
  return VALID_SORTS.has(sort)
    ? sort
    : "curated";
}


function readViewStateFromUrl() {
  const params =
    new URLSearchParams(
      window.location.search
    );

  const category =
    params.get("category");

  const status =
    params.get("status");

  const visibility =
    params.get("visibility");

  const technology =
    params.get("tech");

  const query =
    params.get("q");

  const featured =
    params.get("featured") === "1";

  const sort =
    normalizeSort(
      params.get("sort")
    );

  return {
    filters: normalizeFilters({
      category:
        category &&
        taxonomyItemExists(
          "categories",
          category
        ) &&
        categoryHasProjects(category)
          ? category
          : null,

      status:
        status &&
        taxonomyItemExists(
          "statuses",
          status
        )
          ? status
          : null,

      visibility:
        visibility &&
        taxonomyItemExists(
          "visibilities",
          visibility
        )
          ? visibility
          : null,

      technology:
        technologyExists(
          technology
        )
          ? technology
          : null,

      query:
        query?.trim()
          ? query.trim()
          : null,

      featured
    }),

    sort
  };
}


function syncUrl(
  historyMode = "replace"
) {
  const url =
    new URL(
      window.location.href
    );

  const entries = {
    category:
      state.filters.category,

    status:
      state.filters.status,

    visibility:
      state.filters.visibility,

    tech:
      state.filters.technology,

    q:
      state.filters.query,

    featured:
      state.filters.featured
        ? "1"
        : null,

    sort:
      state.sort !== "curated"
        ? state.sort
        : null
  };

  for (
    const [
      key,
      value
    ]
    of Object.entries(entries)
  ) {
    if (value) {
      url.searchParams.set(
        key,
        value
      );
    }
    else {
      url.searchParams.delete(
        key
      );
    }
  }

  const method =
    historyMode === "push"
      ? "pushState"
      : "replaceState";

  window.history[method](
    {
      filters:
        getFilters(),

      sort:
        state.sort
    },
    "",
    url
  );
}


function validateFilterState() {
  if (
    state.filters.category &&
    (
      !taxonomyItemExists(
        "categories",
        state.filters.category
      ) ||
      !categoryHasProjects(
        state.filters.category
      )
    )
  ) {
    state.filters.category =
      null;
  }

  if (
    state.filters.status &&
    !taxonomyItemExists(
      "statuses",
      state.filters.status
    )
  ) {
    state.filters.status =
      null;
  }

  if (
    state.filters.visibility &&
    !taxonomyItemExists(
      "visibilities",
      state.filters.visibility
    )
  ) {
    state.filters.visibility =
      null;
  }

  if (
    state.filters.technology &&
    !technologyExists(
      state.filters.technology
    )
  ) {
    state.filters.technology =
      null;
  }
}


function setFilters(
  filters = {},
  {
    historyMode = "replace",
    syncUrlState = true,
    sort = state.sort
  } = {}
) {
  state.filters =
    normalizeFilters(filters);

  state.sort =
    normalizeSort(sort);

  validateFilterState();

  if (syncUrlState) {
    syncUrl(historyMode);
  }

  renderCatalog();
}


function setSort(
  sort,
  {
    historyMode = "push"
  } = {}
) {
  state.sort =
    normalizeSort(sort);

  syncUrl(historyMode);
  renderCatalog();
}


function resetFilters() {
  state.filters = {
    category: null,
    status: null,
    technology: null,
    visibility: null,
    query: null,
    featured: false
  };

  state.sort = "curated";
  state.advancedOpen = false;

  syncUrl("push");
  renderCatalog();
}


function getCatalog() {
  return state.catalog;
}


function getProjects() {
  return [
    ...state.projects
  ];
}


function getFilters() {
  return {
    ...state.filters
  };
}


function getViewState() {
  return {
    filters:
      getFilters(),

    sort:
      state.sort,

    visibleProjects:
      visibleProjects()
        .map(
          (project) =>
            project.id
        )
  };
}


function bindAdvancedControls() {
  advancedSearchToggle?.addEventListener(
    "click",
    () => {
      setAdvancedOpen(
        !state.advancedOpen
      );
    }
  );

  catalogSearch?.addEventListener(
    "input",
    () => {
      setFilters(
        {
          query:
            catalogSearch.value
        },
        {
          historyMode:
            "replace"
        }
      );
    }
  );

  statusFilter?.addEventListener(
    "change",
    () => {
      state.advancedOpen = true;

      setFilters(
        {
          status:
            statusFilter.value
        },
        {
          historyMode:
            "push"
        }
      );
    }
  );

  visibilityFilter?.addEventListener(
    "change",
    () => {
      state.advancedOpen = true;

      setFilters(
        {
          visibility:
            visibilityFilter.value
        },
        {
          historyMode:
            "push"
        }
      );
    }
  );

  technologyFilter?.addEventListener(
    "change",
    () => {
      state.advancedOpen = true;

      setFilters(
        {
          technology:
            technologyFilter.value
        },
        {
          historyMode:
            "push"
        }
      );
    }
  );

  sortOrder?.addEventListener(
    "change",
    () => {
      state.advancedOpen = true;

      setSort(
        sortOrder.value
      );
    }
  );

  featuredOnly?.addEventListener(
    "change",
    () => {
      state.advancedOpen = true;

      setFilters(
        {
          featured:
            featuredOnly.checked
        },
        {
          historyMode:
            "push"
        }
      );
    }
  );

  resetCatalogFilters?.addEventListener(
    "click",
    () => {
      resetFilters();
    }
  );
}


function showCatalogError(error) {
  console.error(
    "No se pudo cargar el catálogo:",
    error
  );

  if (categoryFilters) {
    categoryFilters.replaceChildren(
      createElement(
        "span",
        "catalog-summary",
        "Categorías no disponibles"
      )
    );
  }

  if (catalogSummary) {
    catalogSummary.textContent =
      "No se pudo cargar el catálogo";
  }

  const errorCard =
    createElement(
      "article",
      "project-card project-card-placeholder"
    );

  errorCard.append(
    createElement(
      "span",
      "project-type",
      "Catálogo"
    ),
    createElement(
      "h3",
      "",
      "No se pudo cargar el catálogo"
    ),
    createElement(
      "p",
      "",
      "Revisa data/projects.json o vuelve a cargar la página."
    )
  );

  grid.replaceChildren(
    errorCard
  );

  grid.setAttribute(
    "aria-busy",
    "false"
  );
}


async function loadCatalog() {
  if (!grid) {
    throw new Error(
      "No existe #projectsGrid en index.html."
    );
  }

  if (!categoryFilters) {
    throw new Error(
      "No existe #categoryFilters en index.html."
    );
  }

  const response =
    await fetch(
      CATALOG_URL,
      {
        cache: "no-store"
      }
    );

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} al cargar ${CATALOG_URL}`
    );
  }

  const catalog =
    await response.json();

  validateCatalog(catalog);

  state.catalog =
    catalog;

  state.projects =
    [
      ...catalog.projects
    ];

  populateAdvancedFilters();

  const initial =
    readViewStateFromUrl();

  state.filters =
    initial.filters;

  state.sort =
    initial.sort;

  state.advancedOpen =
    hasAdvancedFilterState();

  bindAdvancedControls();

  syncUrl("replace");
  renderCatalog();
}


window.addEventListener(
  "popstate",
  () => {
    if (!state.catalog) {
      return;
    }

    const next =
      readViewStateFromUrl();

    state.filters =
      next.filters;

    state.sort =
      next.sort;

    state.advancedOpen =
      hasAdvancedFilterState();

    renderCatalog();
  }
);




/* =========================================================
   INTERACTION POLISH
   ========================================================= */

function enablePointerGlow(root = document) {
  const targets =
    root.querySelectorAll(
      ".project-card, .catalog-controls, .hub-roadmap-card, .hub-roadmap-detail"
    );

  for (const target of targets) {
    if (
      target.dataset.pointerGlowReady ===
      "true"
    ) {
      continue;
    }

    target.dataset.pointerGlowReady =
      "true";

    target.addEventListener(
      "pointermove",
      (event) => {
        const rect =
          target.getBoundingClientRect();

        const x =
          event.clientX - rect.left;

        const y =
          event.clientY - rect.top;

        target.style.setProperty(
          "--pointer-x",
          `${x}px`
        );

        target.style.setProperty(
          "--pointer-y",
          `${y}px`
        );

        target.classList.add(
          "pointer-active"
        );
      }
    );

    target.addEventListener(
      "pointerleave",
      () => {
        target.classList.remove(
          "pointer-active"
        );
      }
    );
  }
}


function enableRevealAnimations(root = document) {
  const targets =
    root.querySelectorAll(
      [
        ".catalog-controls",
        ".project-card",
        ".hub-roadmap-card",
        ".hub-roadmap-detail",
        ".projects-heading"
      ].join(",")
    );

  if (
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    for (const target of targets) {
      target.classList.add(
        "reveal-visible"
      );
    }

    return;
  }

  const observer =
    new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          entry.target.classList.add(
            "reveal-visible"
          );

          observer.unobserve(
            entry.target
          );
        }
      },
      {
        threshold: 0.12,
        rootMargin:
          "0px 0px -28px 0px"
      }
    );

  for (const target of targets) {
    if (
      target.dataset.revealReady ===
      "true"
    ) {
      continue;
    }

    target.dataset.revealReady =
      "true";

    target.classList.add(
      "reveal-ready"
    );

    observer.observe(target);
  }
}


function refreshInteractionPolish() {
  enablePointerGlow();
  enableRevealAnimations();
}




function installHubScrollProgress() {
  if (
    document.querySelector(
      ".hub-scroll-progress"
    )
  ) {
    return;
  }

  const bar =
    document.createElement(
      "div"
    );

  bar.className =
    "hub-scroll-progress";

  bar.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.append(
    bar
  );

  const update = () => {
    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const ratio =
      maxScroll > 0
        ? Math.min(
            1,
            Math.max(
              0,
              window.scrollY /
              maxScroll
            )
          )
        : 0;

    bar.style.transform =
      `scaleX(${ratio})`;
  };

  update();

  window.addEventListener(
    "scroll",
    update,
    {
      passive: true
    }
  );

  window.addEventListener(
    "resize",
    update
  );
}


function installHubRippleFeedback() {
  if (
    document.body.dataset.hubRippleReady ===
    "true"
  ) {
    return;
  }

  document.body.dataset.hubRippleReady =
    "true";

  document.addEventListener(
    "pointerdown",
    (event) => {
      const target =
        event.target.closest(
          [
            ".btn",
            ".github-link",
            ".category-filter",
            ".catalog-reset",
            ".catalog-advanced-toggle",
            ".hub-roadmap-view-button",
            ".hub-roadmap-link",
            ".hub-roadmap-detail-button"
          ].join(",")
        );

      if (!target) {
        return;
      }

      const rect =
        target.getBoundingClientRect();

      const size =
        Math.max(
          rect.width,
          rect.height
        ) * 1.7;

      const ripple =
        document.createElement(
          "span"
        );

      ripple.className =
        "hub-ui-ripple";

      ripple.style.width =
        `${size}px`;

      ripple.style.height =
        `${size}px`;

      ripple.style.left =
        `${event.clientX -
        rect.left -
        size / 2}px`;

      ripple.style.top =
        `${event.clientY -
        rect.top -
        size / 2}px`;

      target.append(ripple);

      window.setTimeout(
        () => {
          ripple.remove();
        },
        620
      );
    }
  );
}


function installHubFinalMotionLayer() {
  installHubScrollProgress();
  installHubRippleFeedback();
}


window.HubCatalog = {
  getCatalog,
  getProjects,
  getFilters,
  getViewState,
  setFilters,
  setSort,
  resetFilters
};


loadCatalog().catch(
  showCatalogError
);




function normalizeHubRoadmapStatus(raw = "") {
  const value =
    raw
      .replace(/\.$/, "")
      .trim();

  const normalized =
    normalizeSearchText(value);

  if (normalized.includes("completada")) {
    return {
      key: "completed",
      label: value
    };
  }

  if (normalized.includes("parcial")) {
    return {
      key: "partial",
      label: value
    };
  }

  if (normalized.includes("vision")) {
    return {
      key: "vision",
      label: value
    };
  }

  if (normalized.includes("siguiente")) {
    return {
      key: "next",
      label: value
    };
  }

  return {
    key: "planned",
    label: value || "Planeada"
  };
}


function parseRoadmapSectionLines(lines) {
  const sections = [];
  let current = null;

  for (const rawLine of lines) {
    const line =
      rawLine.trim();

    const heading =
      line.match(/^##\s+(.+)$/);

    if (heading) {
      if (current) {
        sections.push(current);
      }

      current = {
        title: heading[1].trim(),
        lines: []
      };

      continue;
    }

    if (!current) {
      continue;
    }

    if (line.startsWith("---")) {
      continue;
    }

    current.lines.push(rawLine);
  }

  if (current) {
    sections.push(current);
  }

  return sections;
}


function cleanRoadmapText(raw = "") {
  return raw
    .replace(/`/g, "")
    .replace(/\*\*/g, "")
    .trim();
}


function roadmapSectionToHtml(section) {
  const lines =
    section.lines
      .map(
        (line) => line.trimEnd()
      )
      .filter(
        (line) => line.trim() !== ""
      );

  if (!lines.length) {
    return "";
  }

  const parts = [];
  let currentList = [];

  const flushList = () => {
    if (!currentList.length) {
      return;
    }

    parts.push(
      `<ul>${currentList
        .map(
          (item) =>
            `<li>${cleanRoadmapText(item)}</li>`
        )
        .join("")}</ul>`
    );

    currentList = [];
  };

  for (const rawLine of lines) {
    const line =
      rawLine.trim();

    if (line.startsWith("- ")) {
      currentList.push(
        line.slice(2)
      );
      continue;
    }

    flushList();

    parts.push(
      `<p>${cleanRoadmapText(line)}</p>`
    );
  }

  flushList();

  return `
    <section class="hub-roadmap-detail-section">
      <h4>${section.title}</h4>
      ${parts.join("")}
    </section>
  `;
}


function roadmapSummary(phase) {
  const preferred =
    phase.sections.find(
      (section) =>
        section.title === "Impacto"
    ) ||
    phase.sections.find(
      (section) =>
        section.title === "Impacto esperado"
    ) ||
    phase.sections.find(
      (section) =>
        section.title === "Objetivo"
    ) ||
    phase.sections[0];

  if (!preferred) {
    return "Consulta el ROADMAP.md para ver el detalle completo.";
  }

  for (const rawLine of preferred.lines) {
    const line =
      cleanRoadmapText(rawLine);

    if (
      line &&
      !line.startsWith("-")
    ) {
      return line;
    }
  }

  return "Consulta el ROADMAP.md para ver el detalle completo.";
}


function roadmapHighlights(phase) {
  const section =
    phase.sections.find(
      (item) =>
        [
          "Implementado",
          "Ya adelantado",
          "Posibles funciones",
          "Falta por completar"
        ].includes(item.title)
    );

  if (!section) {
    return [];
  }

  return section.lines
    .map(
      (line) => line.trim()
    )
    .filter(
      (line) =>
        line.startsWith("- ")
    )
    .map(
      (line) =>
        cleanRoadmapText(
          line.slice(2)
        )
    )
    .slice(0, 3);
}


function parseHubRoadmap(markdown) {
  const lines =
    markdown
      .replace(/\r/g, "")
      .split("\n");

  const phases = [];
  let current = null;

  const headingPattern =
    /^# Fase (\d+) - (.+)$/;

  for (const rawLine of lines) {
    const match =
      rawLine.match(headingPattern);

    if (match) {
      if (current) {
        phases.push(current);
      }

      current = {
        number: Number(match[1]),
        title: match[2].trim(),
        statusRaw: "",
        lines: []
      };

      continue;
    }

    if (!current) {
      continue;
    }

    const statusMatch =
      rawLine
        .trim()
        .match(
          /^\*\*Estado:\*\*\s*(.+)$/
        );

    if (statusMatch) {
      current.statusRaw =
        statusMatch[1].trim();
    }

    current.lines.push(rawLine);
  }

  if (current) {
    phases.push(current);
  }

  return phases
    .map(
      (phase) => {
        const sections =
          parseRoadmapSectionLines(
            phase.lines
          );

        return {
          ...phase,
          status:
            normalizeHubRoadmapStatus(
              phase.statusRaw
            ),
          sections,
          excerpt:
            roadmapSummary({
              ...phase,
              sections
            }),
          highlights:
            roadmapHighlights({
              ...phase,
              sections
            })
        };
      }
    )
    .sort(
      (a, b) =>
        a.number - b.number
    );
}


function roadmapViewClass(view) {
  return view === "timeline"
    ? "timeline-view"
    : "cards-view";
}


function renderHubRoadmapDetail() {
  if (
    !hubRoadmapDetail ||
    !hubRoadmapDetailTop ||
    !hubRoadmapDetailTitle ||
    !hubRoadmapDetailBody
  ) {
    return;
  }

  const phase =
    state.roadmap.phases.find(
      (item) =>
        item.number ===
        state.roadmap.selected
    );

  if (!phase) {
    hubRoadmapDetail.hidden =
      true;

    return;
  }

  hubRoadmapDetail.hidden =
    false;

  hubRoadmapDetailTop.replaceChildren(
    createElement(
      "span",
      "hub-roadmap-phase",
      `Fase ${phase.number}`
    ),
    createElement(
      "span",
      `hub-roadmap-state hub-roadmap-state-${phase.status.key}`,
      phase.status.label
    )
  );

  hubRoadmapDetailTitle.textContent =
    phase.title;

  hubRoadmapDetailBody.innerHTML =
    phase.sections
      .map(
        roadmapSectionToHtml
      )
      .join("");
}


function setRoadmapView(view) {
  state.roadmap.view = view;
  renderHubRoadmap();
}


function bindRoadmapViewToggle() {
  if (!hubRoadmapViewToggle) {
    return;
  }

  const buttons =
    hubRoadmapViewToggle.querySelectorAll(
      "[data-view]"
    );

  for (const button of buttons) {
    button.addEventListener(
      "click",
      () => {
        setRoadmapView(
          button.dataset.view
        );
      }
    );
  }
}


function phaseStatusColor(statusKey) {
  switch (statusKey) {
    case "completed":
      return "#59d289";

    case "partial":
      return "#36c5f0";

    case "next":
      return "#ff9f1c";

    case "vision":
      return "#a78bfa";

    default:
      return "#7c8b99";
  }
}


function drawRoundedRect(
  context,
  x,
  y,
  width,
  height,
  radius
) {
  context.beginPath();
  context.moveTo(
    x + radius,
    y
  );
  context.lineTo(
    x + width - radius,
    y
  );
  context.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + radius
  );
  context.lineTo(
    x + width,
    y + height - radius
  );
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height
  );
  context.lineTo(
    x + radius,
    y + height
  );
  context.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - radius
  );
  context.lineTo(
    x,
    y + radius
  );
  context.quadraticCurveTo(
    x,
    y,
    x + radius,
    y
  );
  context.closePath();
}


function canvasWrapText(
  context,
  text,
  x,
  y,
  maxWidth,
  lineHeight,
  maxLines = 2
) {
  const words =
    text.split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    const test =
      current
        ? `${current} ${word}`
        : word;

    if (
      context.measureText(test).width <=
      maxWidth
    ) {
      current = test;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    current = word;
  }

  if (current) {
    lines.push(current);
  }

  const renderLines =
    lines.slice(0, maxLines);

  if (
    lines.length > maxLines &&
    renderLines.length
  ) {
    const lastIndex =
      renderLines.length - 1;

    renderLines[lastIndex] =
      `${renderLines[lastIndex]}…`;
  }

  renderLines.forEach(
    (line, index) => {
      context.fillText(
        line,
        x,
        y + index * lineHeight
      );
    }
  );
}


function renderRoadmapTimelineCanvas() {
  if (
    !hubRoadmapCanvas ||
    !hubRoadmapTimeline ||
    state.roadmap.view !== "timeline"
  ) {
    return;
  }

  const phases =
    state.roadmap.phases;

  if (!phases.length) {
    return;
  }

  const shell =
    hubRoadmapCanvas.parentElement;

  const width =
    Math.max(
      shell.clientWidth,
      phases.length * 180
    );

  const height = 360;

  hubRoadmapCanvas.width =
    width * window.devicePixelRatio;

  hubRoadmapCanvas.height =
    height * window.devicePixelRatio;

  hubRoadmapCanvas.style.width =
    `${width}px`;

  hubRoadmapCanvas.style.height =
    `${height}px`;

  const context =
    hubRoadmapCanvas.getContext("2d");

  context.setTransform(
    window.devicePixelRatio,
    0,
    0,
    window.devicePixelRatio,
    0,
    0
  );

  context.clearRect(
    0,
    0,
    width,
    height
  );

  const baselineY = 190;
  const startX = 90;
  const endX = width - 90;
  const spacing =
    phases.length > 1
      ? (endX - startX) /
        (phases.length - 1)
      : 0;

  context.lineWidth = 4;
  context.strokeStyle =
    "rgba(54, 197, 240, 0.18)";
  context.beginPath();
  context.moveTo(
    startX,
    baselineY
  );
  context.lineTo(
    endX,
    baselineY
  );
  context.stroke();

  state.roadmap.canvasNodes = [];

  phases.forEach(
    (phase, index) => {
      const x =
        startX + spacing * index;
      const y =
        baselineY;

      const selected =
        phase.number ===
        state.roadmap.selected;

      const cardWidth = 150;
      const cardHeight = 110;
      const cardX =
        x - cardWidth / 2;
      const cardY =
        index % 2 === 0
          ? 34
          : 214;

      const color =
        phaseStatusColor(
          phase.status.key
        );

      context.strokeStyle =
        color;
      context.fillStyle =
        "rgba(12, 19, 28, 0.96)";
      context.lineWidth =
        selected
          ? 2.5
          : 1.5;

      drawRoundedRect(
        context,
        cardX,
        cardY,
        cardWidth,
        cardHeight,
        14
      );
      context.fill();
      context.stroke();

      context.beginPath();
      context.moveTo(
        x,
        index % 2 === 0
          ? cardY + cardHeight
          : cardY
      );
      context.lineTo(
        x,
        y
      );
      context.strokeStyle =
        "rgba(54, 197, 240, 0.15)";
      context.lineWidth = 2;
      context.stroke();

      context.beginPath();
      context.fillStyle =
        selected
          ? color
          : "#0b1620";
      context.arc(
        x,
        y,
        selected ? 11 : 9,
        0,
        Math.PI * 2
      );
      context.fill();

      context.beginPath();
      context.lineWidth = 3;
      context.strokeStyle = color;
      context.arc(
        x,
        y,
        selected ? 13 : 11,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.fillStyle =
        selected
          ? color
          : "#5fdfff";
      context.font =
        "900 10px system-ui, sans-serif";
      context.textAlign = "left";
      context.fillText(
        `FASE ${phase.number}`,
        cardX + 14,
        cardY + 18
      );

      context.fillStyle = "#f2f6fa";
      context.font =
        "700 18px system-ui, sans-serif";
      canvasWrapText(
        context,
        phase.title,
        cardX + 14,
        cardY + 44,
        cardWidth - 28,
        22,
        2
      );

      context.fillStyle = color;
      context.font =
        "800 9px system-ui, sans-serif";

      canvasWrapText(
        context,
        phase.status.label.toUpperCase(),
        cardX + 14,
        cardY + cardHeight - 27,
        cardWidth - 28,
        12,
        2
      );

      state.roadmap.canvasNodes.push({
        number: phase.number,
        x,
        y,
        radius: 18,
        cardX,
        cardY,
        cardWidth,
        cardHeight
      });
    }
  );
}


function onRoadmapCanvasClick(event) {
  if (!hubRoadmapCanvas) {
    return;
  }

  const rect =
    hubRoadmapCanvas.getBoundingClientRect();

  const x =
    event.clientX - rect.left;
  const y =
    event.clientY - rect.top;

  const hit =
    state.roadmap.canvasNodes.find(
      (node) =>
        (
          (x - node.x) ** 2 +
          (y - node.y) ** 2
        ) <= node.radius ** 2 ||
        (
          x >= node.cardX &&
          x <= node.cardX + node.cardWidth &&
          y >= node.cardY &&
          y <= node.cardY + node.cardHeight
        )
    );

  if (!hit) {
    return;
  }

  state.roadmap.selected =
    hit.number;

  renderHubRoadmap();

  if (hubRoadmapDetail) {
    hubRoadmapDetail.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}


function createRoadmapCard(phase) {
  const card =
    createElement(
      "article",
      `hub-roadmap-card hub-roadmap-card-${phase.status.key}`
    );

  const top =
    createElement(
      "div",
      "hub-roadmap-card-top"
    );

  top.append(
    createElement(
      "span",
      "hub-roadmap-phase",
      `Fase ${phase.number}`
    ),
    createElement(
      "span",
      `hub-roadmap-state hub-roadmap-state-${phase.status.key}`,
      phase.status.label
    )
  );

  const highlights =
    createElement(
      "ul",
      "hub-roadmap-highlights"
    );

  for (const item of phase.highlights) {
    highlights.append(
      createElement(
        "li",
        "",
        item
      )
    );
  }

  const detailButton =
    createElement(
      "button",
      `hub-roadmap-detail-button${
        state.roadmap.selected ===
        phase.number
          ? " active"
          : ""
      }`,
      state.roadmap.selected ===
        phase.number
        ? "Ocultar detalle"
        : "Ver detalle"
    );

  detailButton.type = "button";

  detailButton.addEventListener(
    "click",
    () => {
      if (
        state.roadmap.selected ===
        phase.number
      ) {
        state.roadmap.selected =
          null;
      }
      else {
        state.roadmap.selected =
          phase.number;
      }

      renderHubRoadmap();

      if (
        state.roadmap.selected ===
          phase.number &&
        hubRoadmapDetail
      ) {
        hubRoadmapDetail.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }
  );

  card.append(
    top,
    createElement(
      "h3",
      "",
      phase.title
    ),
    createElement(
      "p",
      "",
      phase.excerpt
    )
  );

  if (phase.highlights.length) {
    card.append(highlights);
  }

  const footer =
    createElement(
      "div",
      "hub-roadmap-card-footer"
    );

  footer.append(detailButton);
  card.append(footer);

  return card;
}


function renderHubRoadmap() {
  if (!hubRoadmapGrid) {
    return;
  }

  hubRoadmapGrid.className =
    `hub-roadmap-grid ${roadmapViewClass(
      state.roadmap.view
    )}`;

  const cardsMode =
    state.roadmap.view === "cards";

  hubRoadmapGrid.hidden =
    !cardsMode;

  if (hubRoadmapTimeline) {
    hubRoadmapTimeline.hidden =
      cardsMode;
  }

  if (cardsMode) {
    const fragment =
      document.createDocumentFragment();

    for (const phase of state.roadmap.phases) {
      fragment.append(
        createRoadmapCard(phase)
      );
    }

    hubRoadmapGrid.replaceChildren(
      fragment
    );
  }
  else {
    renderRoadmapTimelineCanvas();
  }

  if (hubRoadmapStatus) {
    hubRoadmapStatus.textContent =
      `${state.roadmap.phases.length} fases cargadas desde HUB-ROADMAP.md.`;
  }

  if (hubRoadmapViewToggle) {
    const buttons =
      hubRoadmapViewToggle.querySelectorAll(
        "[data-view]"
      );

    for (const button of buttons) {
      const isActive =
        button.dataset.view ===
        state.roadmap.view;

      button.classList.toggle(
        "active",
        isActive
      );

      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );
    }
  }

  renderHubRoadmapDetail();

  requestAnimationFrame(
    refreshInteractionPolish
  );
}


async function loadHubRoadmap() {
  if (!hubRoadmapGrid) {
    return;
  }

  const response =
    await fetch(
      HUB_ROADMAP_URL,
      {
        cache: "no-store"
      }
    );

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} al cargar ${HUB_ROADMAP_URL}`
    );
  }

  const markdown =
    await response.text();

  const phases =
    parseHubRoadmap(markdown);

  if (!phases.length) {
    throw new Error(
      "No se encontraron fases en HUB-ROADMAP.md."
    );
  }

  state.roadmap.phases =
    phases;

  state.roadmap.markdown =
    markdown;

  state.roadmap.selected =
    phases[0].number;

  bindRoadmapViewToggle();

  if (
    hubRoadmapPdfExport &&
    hubRoadmapPdfExport.dataset.bound !== "true"
  ) {
    hubRoadmapPdfExport.dataset.bound =
      "true";

    hubRoadmapPdfExport.addEventListener(
      "click",
      exportHubRoadmapPdf
    );
  }

  if (hubRoadmapCanvas) {
    hubRoadmapCanvas.addEventListener(
      "click",
      onRoadmapCanvasClick
    );
  }

  window.addEventListener(
    "resize",
    () => {
      if (
        state.roadmap.view ===
        "timeline"
      ) {
        renderRoadmapTimelineCanvas();
      }
    }
  );

  renderHubRoadmap();
}


function showHubRoadmapError(error) {
  console.error(
    "No se pudo cargar el roadmap del Hub:",
    error
  );

  if (hubRoadmapStatus) {
    hubRoadmapStatus.textContent =
      "No se pudo cargar el roadmap del Hub.";
  }
}

loadHubRoadmap().catch(
  showHubRoadmapError
);


requestAnimationFrame(
  installHubFinalMotionLayer
);
