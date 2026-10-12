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
    visibility: null,
    query: null,
    featured: false
  },
  sort: "curated"
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
      setSort(
        sortOrder.value
      );
    }
  );

  featuredOnly?.addEventListener(
    "change",
    () => {
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

    renderCatalog();
  }
);


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
