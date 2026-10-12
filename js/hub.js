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
    technology: null
  }
};


const grid =
  document.querySelector("#projectsGrid");



function createElement(
  tagName,
  className = "",
  text = ""
) {

  const element =
    document.createElement(tagName);


  if (className) {
    element.className = className;
  }


  if (text !== "") {
    element.textContent = text;
  }


  return element;

}



function requireString(
  value,
  fieldName,
  projectId = "catalog"
) {

  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
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
    throw new Error(
      "El catálogo no contiene una taxonomía válida."
    );
  }


  const taxonomyGroups = [
    "categories",
    "statuses",
    "visibilities"
  ];


  for (const groupName of taxonomyGroups) {

    const ids = new Set();


    for (
      const item of catalog.taxonomy[groupName]
    ) {

      requireString(
        item.id,
        `${groupName}.id`
      );

      requireString(
        item.label,
        `${groupName}.label`
      );


      if (ids.has(item.id)) {
        throw new Error(
          `ID duplicado en taxonomy.${groupName}: ${item.id}`
        );
      }


      ids.add(item.id);

    }

  }

}



function taxonomyIds(
  catalog,
  groupName
) {

  return new Set(
    catalog.taxonomy[groupName]
      .map((item) => item.id)
  );

}



function validateProject(
  project,
  catalog,
  knownIds
) {

  requireString(
    project.id,
    "id",
    "project"
  );


  if (knownIds.has(project.id)) {
    throw new Error(
      `ID de proyecto duplicado: ${project.id}`
    );
  }


  knownIds.add(project.id);


  requireString(
    project.name,
    "name",
    project.id
  );


  requireString(
    project.category,
    "category",
    project.id
  );


  requireString(
    project.subtype,
    "subtype",
    project.id
  );


  requireString(
    project.status,
    "status",
    project.id
  );


  requireString(
    project.visibility,
    "visibility",
    project.id
  );


  requireString(
    project.description,
    "description",
    project.id
  );


  if (
    !Array.isArray(project.technologies)
  ) {
    throw new Error(
      `${project.id}: technologies debe ser un arreglo.`
    );
  }


  const categories =
    taxonomyIds(
      catalog,
      "categories"
    );


  const statuses =
    taxonomyIds(
      catalog,
      "statuses"
    );


  const visibilities =
    taxonomyIds(
      catalog,
      "visibilities"
    );


  if (
    !categories.has(project.category)
  ) {
    throw new Error(
      `${project.id}: categoría desconocida "${project.category}".`
    );
  }


  if (
    !statuses.has(project.status)
  ) {
    throw new Error(
      `${project.id}: estado desconocido "${project.status}".`
    );
  }


  if (
    !visibilities.has(project.visibility)
  ) {
    throw new Error(
      `${project.id}: visibilidad desconocida "${project.visibility}".`
    );
  }


  if (
    !project.card ||
    !SUPPORTED_CARD_VARIANTS.has(
      project.card.variant
    )
  ) {
    throw new Error(
      `${project.id}: variante de tarjeta no soportada.`
    );
  }


  if (
    !Array.isArray(project.card.badges)
  ) {
    throw new Error(
      `${project.id}: card.badges debe ser un arreglo.`
    );
  }


  if (
    !Array.isArray(project.links)
  ) {
    throw new Error(
      `${project.id}: links debe ser un arreglo.`
    );
  }


  for (const link of project.links) {

    requireString(
      link.label,
      "links.label",
      project.id
    );

    requireString(
      link.url,
      "links.url",
      project.id
    );

  }

}



function validateCatalog(catalog) {

  if (
    !catalog ||
    typeof catalog !== "object"
  ) {
    throw new Error(
      "El catálogo recibido no es válido."
    );
  }


  if (
    catalog.schemaVersion !==
    SUPPORTED_SCHEMA_VERSION
  ) {
    throw new Error(
      `schemaVersion no soportado: ${catalog.schemaVersion}`
    );
  }


  validateTaxonomy(catalog);


  if (
    !Array.isArray(catalog.projects)
  ) {
    throw new Error(
      "projects debe ser un arreglo."
    );
  }


  const knownIds =
    new Set();


  for (
    const project of catalog.projects
  ) {

    validateProject(
      project,
      catalog,
      knownIds
    );

  }

}



function applyLinkBehavior(
  anchor,
  link
) {

  anchor.href =
    link.url;


  if (link.external === true) {

    anchor.target =
      "_blank";


    anchor.rel =
      "noreferrer";

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



function createActions(
  project,
  extraClass = ""
) {

  const actions =
    createElement(
      "div",
      `project-actions ${extraClass}`.trim()
    );


  for (
    const link of project.links
  ) {

    const anchor =
      createElement(
        "a",
        buttonClasses(link),
        link.label
      );


    applyLinkBehavior(
      anchor,
      link
    );


    actions.append(anchor);

  }


  return actions;

}



function createBadges(project) {

  const tags =
    createElement(
      "div",
      "project-tags"
    );


  for (
    const badge of project.card.badges
  ) {

    tags.append(
      createElement(
        "span",
        "",
        badge
      )
    );

  }


  return tags;

}



function createMeta(
  project,
  extraClass = "",
  versionClass = ""
) {

  const meta =
    createElement(
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



function renderFeaturedCard(project) {

  const article =
    createElement(
      "article",
      "project-card project-card-featured"
    );


  article.dataset.projectId =
    project.id;


  article.dataset.category =
    project.category;


  article.dataset.status =
    project.status;


  const art =
    createElement(
      "div",
      "project-art"
    );


  art.append(
    createElement(
      "div",
      "project-orbit orbit-a"
    )
  );


  art.append(
    createElement(
      "div",
      "project-orbit orbit-b"
    )
  );


  const logo =
    createElement(
      "img"
    );


  logo.src =
    project.logo.src;


  logo.alt =
    project.logo.alt;


  art.append(logo);


  const copy =
    createElement(
      "div",
      "project-copy"
    );


  copy.append(
    createMeta(project)
  );


  copy.append(
    createElement(
      "h3",
      "",
      project.name
    )
  );


  copy.append(
    createElement(
      "p",
      "",
      project.description
    )
  );


  copy.append(
    createBadges(project)
  );


  copy.append(
    createActions(project)
  );


  article.append(
    art,
    copy
  );


  return article;

}



function renderLabNotesCard(project) {

  const article =
    createElement(
      "article",
      "project-card project-card-placeholder project-card-labnotes"
    );


  article.dataset.projectId =
    project.id;


  article.dataset.category =
    project.category;


  article.dataset.status =
    project.status;


  const logoShell =
    createElement(
      "div",
      "labnotes-logo-shell"
    );


  const logo =
    createElement(
      "img",
      "labnotes-logo"
    );


  logo.src =
    project.logo.src;


  logo.alt =
    project.logo.alt;


  logoShell.append(logo);


  article.append(
    logoShell
  );


  article.append(
    createMeta(
      project,
      "labnotes-meta",
      "labnotes-version"
    )
  );


  article.append(
    createElement(
      "h3",
      "",
      project.name
    )
  );


  article.append(
    createElement(
      "p",
      "",
      project.description
    )
  );


  article.append(
    createBadges(project)
  );


  article.append(
    createActions(
      project,
      "labnotes-actions"
    )
  );


  return article;

}



function renderStandardCard(project) {

  const article =
    createElement(
      "article",
      "project-card project-card-placeholder"
    );


  article.dataset.projectId =
    project.id;


  article.dataset.category =
    project.category;


  article.dataset.status =
    project.status;


  if (
    project.logo &&
    project.logo.src
  ) {

    const logoShell =
      createElement(
        "div",
        "placeholder-mark"
      );


    const logo =
      createElement("img");


    logo.src =
      project.logo.src;


    logo.alt =
      project.logo.alt || project.name;


    logo.style.maxWidth =
      "38px";


    logo.style.maxHeight =
      "38px";


    logoShell.append(logo);


    article.append(
      logoShell
    );

  }


  article.append(
    createMeta(project)
  );


  article.append(
    createElement(
      "h3",
      "",
      project.name
    )
  );


  article.append(
    createElement(
      "p",
      "",
      project.description
    )
  );


  article.append(
    createBadges(project)
  );


  article.append(
    createActions(project)
  );


  return article;

}



function renderProjectCard(project) {

  switch (
    project.card.variant
  ) {

    case "featured":
      return renderFeaturedCard(
        project
      );


    case "labnotes":
      return renderLabNotesCard(
        project
      );


    case "standard":
    default:
      return renderStandardCard(
        project
      );

  }

}



function projectMatchesFilters(project) {

  const {
    category,
    status,
    technology
  } = state.filters;


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
    !project.technologies.includes(
      technology
    )
  ) {
    return false;
  }


  return true;

}



function visibleProjects() {

  return state.projects
    .filter(
      projectMatchesFilters
    )
    .sort(
      (a, b) =>
        (a.displayOrder ?? 9999) -
        (b.displayOrder ?? 9999)
    );

}



function renderProjects() {

  const projects =
    visibleProjects();


  const fragment =
    document.createDocumentFragment();


  for (
    const project of projects
  ) {

    fragment.append(
      renderProjectCard(project)
    );

  }


  grid.replaceChildren(
    fragment
  );


  grid.setAttribute(
    "aria-busy",
    "false"
  );


  if (
    projects.length === 0
  ) {

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
      )
    );


    emptyCard.append(
      createElement(
        "h3",
        "",
        "No hay proyectos para mostrar"
      )
    );


    emptyCard.append(
      createElement(
        "p",
        "",
        "Los filtros actuales no coinciden con ningún proyecto."
      )
    );


    grid.append(
      emptyCard
    );

  }

}



function showCatalogError(error) {

  console.error(
    "No se pudo cargar el catálogo:",
    error
  );


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
    )
  );


  errorCard.append(
    createElement(
      "h3",
      "",
      "No se pudo cargar el catálogo"
    )
  );


  errorCard.append(
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
    [...catalog.projects];


  renderProjects();

}



function setFilters({
  category = null,
  status = null,
  technology = null
} = {}) {

  state.filters = {
    category,
    status,
    technology
  };


  renderProjects();

}



function resetFilters() {

  setFilters();

}



function getCatalog() {

  return state.catalog;

}



function getProjects() {

  return [
    ...state.projects
  ];

}



window.HubCatalog = {
  getCatalog,
  getProjects,
  setFilters,
  resetFilters
};



loadCatalog()
  .catch(
    showCatalogError
  );
