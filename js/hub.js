"use strict";

const CATALOG_URL = "./data/projects.json";
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
    visibility: null
  }
};

const grid = document.querySelector("#projectsGrid");
const categoryFilters = document.querySelector("#categoryFilters");
const catalogSummary = document.querySelector("#catalogSummary");

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

  for (const link of project.links) {
    requireString(link.label, "links.label", project.id);
    requireString(link.url, "links.url", project.id);
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

  return actions;
}

function createBadges(project) {
  const tags = createElement("div", "project-tags");

  for (const badge of project.card.badges) {
    tags.append(createElement("span", "", badge));
  }

  return tags;
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

function projectMatchesFilters(project, filters = state.filters) {
  const {
    category,
    status,
    technology,
    visibility
  } = filters;

  if (category && project.category !== category) {
    return false;
  }

  if (status && project.status !== status) {
    return false;
  }

  if (
    technology &&
    !project.technologies.includes(technology)
  ) {
    return false;
  }

  if (visibility && project.visibility !== visibility) {
    return false;
  }

  return true;
}

function visibleProjects() {
  return state.projects
    .filter((project) => projectMatchesFilters(project))
    .sort(
      (a, b) =>
        (a.displayOrder ?? 9999) -
        (b.displayOrder ?? 9999)
    );
}

function categoryLabel(categoryId) {
  if (!categoryId || !state.catalog) {
    return null;
  }

  return (
    state.catalog.taxonomy.categories.find(
      (category) => category.id === categoryId
    )?.label ?? null
  );
}

function categoryProjectCount(categoryId) {
  return state.projects.filter(
    (project) => project.category === categoryId
  ).length;
}

function activeCategories() {
  if (!state.catalog) {
    return [];
  }

  return state.catalog.taxonomy.categories.filter(
    (category) => categoryProjectCount(category.id) > 0
  );
}

function createCategoryButton({
  id,
  label,
  count
}) {
  const isActive = state.filters.category === id;

  const button = createElement(
    "button",
    `category-filter${isActive ? " active" : ""}`
  );

  button.type = "button";
  button.dataset.category = id ?? "";
  button.setAttribute("aria-pressed", String(isActive));
  button.setAttribute(
    "aria-label",
    `${label}: ${count} ${count === 1 ? "proyecto" : "proyectos"}`
  );

  button.append(
    createElement("span", "", label),
    createElement(
      "span",
      "category-filter-count",
      String(count)
    )
  );

  button.addEventListener("click", () => {
    setFilters(
      {
        category: id
      },
      {
        historyMode: "push"
      }
    );
  });

  return button;
}

function renderCategoryFilters() {
  if (!categoryFilters || !state.catalog) {
    return;
  }

  const fragment = document.createDocumentFragment();

  fragment.append(
    createCategoryButton({
      id: null,
      label: "Todos",
      count: state.projects.length
    })
  );

  for (const category of activeCategories()) {
    fragment.append(
      createCategoryButton({
        id: category.id,
        label: category.label,
        count: categoryProjectCount(category.id)
      })
    );
  }

  categoryFilters.replaceChildren(fragment);
}

function renderCatalogSummary() {
  if (!catalogSummary) {
    return;
  }

  const visible = visibleProjects().length;
  const total = state.projects.length;
  const activeLabel = categoryLabel(state.filters.category);

  if (activeLabel) {
    catalogSummary.textContent =
      `${visible} ${visible === 1 ? "proyecto" : "proyectos"} · ${activeLabel}`;

    return;
  }

  catalogSummary.textContent =
    `${total} ${total === 1 ? "proyecto" : "proyectos"} en el catálogo`;
}

function renderProjects() {
  const projects = visibleProjects();
  const fragment = document.createDocumentFragment();

  for (const project of projects) {
    fragment.append(renderProjectCard(project));
  }

  grid.replaceChildren(fragment);
  grid.setAttribute("aria-busy", "false");

  if (projects.length === 0) {
    const emptyCard = createElement(
      "article",
      "project-card project-card-placeholder"
    );

    emptyCard.append(
      createElement("span", "project-type", "Catálogo"),
      createElement("h3", "", "No hay proyectos para mostrar"),
      createElement(
        "p",
        "",
        "Los filtros actuales no coinciden con ningún proyecto."
      )
    );

    grid.append(emptyCard);
  }
}

function renderCatalog() {
  renderCategoryFilters();
  renderCatalogSummary();
  renderProjects();
}

function categoryExists(categoryId) {
  if (!categoryId || !state.catalog) {
    return false;
  }

  return state.catalog.taxonomy.categories.some(
    (category) => category.id === categoryId
  );
}

function categoryHasProjects(categoryId) {
  return categoryProjectCount(categoryId) > 0;
}

function readCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");

  if (
    category &&
    categoryExists(category) &&
    categoryHasProjects(category)
  ) {
    return category;
  }

  return null;
}

function syncCategoryUrl(historyMode = "replace") {
  const url = new URL(window.location.href);
  const category = state.filters.category;

  if (category) {
    url.searchParams.set("category", category);
  } else {
    url.searchParams.delete("category");
  }

  const method = historyMode === "push"
    ? "pushState"
    : "replaceState";

  window.history[method](
    { category },
    "",
    url
  );
}

function normalizeFilters(filters) {
  const next = {
    ...state.filters,
    ...filters
  };

  for (const key of Object.keys(next)) {
    if (next[key] === "" || next[key] === undefined) {
      next[key] = null;
    }
  }

  return next;
}

function setFilters(
  filters = {},
  {
    historyMode = "replace",
    syncUrl = true
  } = {}
) {
  state.filters = normalizeFilters(filters);

  if (
    state.filters.category &&
    (
      !categoryExists(state.filters.category) ||
      !categoryHasProjects(state.filters.category)
    )
  ) {
    state.filters.category = null;
  }

  if (syncUrl) {
    syncCategoryUrl(historyMode);
  }

  renderCatalog();
}

function resetFilters() {
  state.filters = {
    category: null,
    status: null,
    technology: null,
    visibility: null
  };

  syncCategoryUrl("push");
  renderCatalog();
}

function getCatalog() {
  return state.catalog;
}

function getProjects() {
  return [...state.projects];
}

function getFilters() {
  return { ...state.filters };
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

  const errorCard = createElement(
    "article",
    "project-card project-card-placeholder"
  );

  errorCard.append(
    createElement("span", "project-type", "Catálogo"),
    createElement("h3", "", "No se pudo cargar el catálogo"),
    createElement(
      "p",
      "",
      "Revisa data/projects.json o vuelve a cargar la página."
    )
  );

  grid.replaceChildren(errorCard);
  grid.setAttribute("aria-busy", "false");
}

async function loadCatalog() {
  if (!grid) {
    throw new Error("No existe #projectsGrid en index.html.");
  }

  if (!categoryFilters) {
    throw new Error("No existe #categoryFilters en index.html.");
  }

  const response = await fetch(
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

  const catalog = await response.json();
  validateCatalog(catalog);

  state.catalog = catalog;
  state.projects = [...catalog.projects];
  state.filters.category = readCategoryFromUrl();

  syncCategoryUrl("replace");
  renderCatalog();
}

window.addEventListener("popstate", () => {
  if (!state.catalog) {
    return;
  }

  state.filters.category = readCategoryFromUrl();
  renderCatalog();
});

window.HubCatalog = {
  getCatalog,
  getProjects,
  getFilters,
  setFilters,
  resetFilters
};

loadCatalog().catch(showCatalogError);
