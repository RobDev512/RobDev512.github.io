"use strict";

const DOCS = [
  { id: "architecture", label: "Arquitectura", title: "Arquitectura del Hub", kind: "Arquitectura", path: "./HUB-ARCHITECTURE.md", icon: "cpu" },
  { id: "roadmap", label: "Roadmap", title: "Roadmap del Hub", kind: "Evolución", path: "./HUB-ROADMAP.md", icon: "roadmap" },
  { id: "project-standard", label: "Estándar de proyecto", title: "Estándar de páginas de proyecto", kind: "Estándar", path: "./PROJECT-PAGE-STANDARD.md", icon: "file" },
  { id: "readme", label: "README", title: "README del Hub", kind: "Referencia", path: "../README.md", icon: "info" }
];

const navigation = document.querySelector("#docsNavigation");
const rendered = document.querySelector("#docsRendered");
const status = document.querySelector("#docsStatus");
const documentTitle = document.querySelector("#docsDocumentTitle");
const documentKind = document.querySelector("#docsDocumentKind");
const openRaw = document.querySelector("#docsOpenRaw");
const download = document.querySelector("#docsDownload");

function icon(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "docs-icon");
  svg.setAttribute("aria-hidden", "true");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", `../assets/icons/hub-icons.svg#icon-${name}`);
  svg.append(use);
  return svg;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function inlineMarkdown(value = "") {
  let html = escapeHtml(value);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
    const safe = escapeHtml(href);
    const external = /^https?:\/\//i.test(href);
    return `<a href="${safe}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${label}</a>`;
  });
  return html;
}

function markdownToHtml(markdown = "") {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const output = [];
  let paragraph = [];
  let listType = null;
  let inCode = false;
  let codeLines = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    output.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  }

  function closeList() {
    if (!listType) return;
    output.push(`</${listType}>`);
    listType = null;
  }

  function openList(type) {
    if (listType === type) return;
    closeList();
    listType = type;
    output.push(`<${type}>`);
  }

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/g, "");

    if (line.trim().startsWith("```")) {
      flushParagraph();
      closeList();

      if (!inCode) {
        inCode = true;
        codeLines = [];
      }
      else {
        output.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        inCode = false;
        codeLines = [];
      }
      continue;
    }

    if (inCode) {
      codeLines.push(rawLine);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      closeList();
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      flushParagraph();
      closeList();
      output.push("<hr>");
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = heading[1].length;
      output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    const unordered = line.match(/^\s*[-*]\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      openList("ul");
      output.push(`<li>${inlineMarkdown(unordered[1])}</li>`);
      continue;
    }

    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      openList("ol");
      output.push(`<li>${inlineMarkdown(ordered[1])}</li>`);
      continue;
    }

    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      flushParagraph();
      closeList();
      output.push(`<blockquote>${inlineMarkdown(quote[1])}</blockquote>`);
      continue;
    }

    paragraph.push(line.trim());
  }

  if (inCode) {
    output.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  }

  flushParagraph();
  closeList();

  return output.join("\n");
}

function currentDocumentId() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("doc");
  return DOCS.some((doc) => doc.id === requested) ? requested : DOCS[0].id;
}

function setDocumentUrl(id) {
  const url = new URL(window.location.href);
  url.searchParams.set("doc", id);
  window.history.pushState({}, "", url);
}

function renderNavigation(activeId) {
  const fragment = document.createDocumentFragment();

  for (const doc of DOCS) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `docs-nav-button${doc.id === activeId ? " active" : ""}`;
    button.append(icon(doc.icon), document.createTextNode(doc.label));
    button.addEventListener("click", () => {
      if (doc.id !== currentDocumentId()) setDocumentUrl(doc.id);
      loadDocument(doc.id);
    });
    fragment.append(button);
  }

  navigation.replaceChildren(fragment);
}

async function loadDocument(id) {
  const doc = DOCS.find((item) => item.id === id) ?? DOCS[0];

  renderNavigation(doc.id);
  documentTitle.textContent = doc.title;
  documentKind.textContent = doc.kind;
  openRaw.href = doc.path;
  download.href = doc.path;
  download.download = doc.path.split("/").pop();
  status.textContent = "Cargando documento…";
  rendered.replaceChildren();

  try {
    const response = await fetch(doc.path, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const markdown = await response.text();
    rendered.innerHTML = markdownToHtml(markdown);
    status.textContent = "Documento cargado.";
  }
  catch (error) {
    console.error("No se pudo cargar la documentación:", error);
    status.textContent = "No se pudo cargar este documento.";
    rendered.innerHTML = "<p>Comprueba que el archivo Markdown exista y que la página se esté sirviendo por HTTP.</p>";
  }
}

window.addEventListener("popstate", () => loadDocument(currentDocumentId()));
loadDocument(currentDocumentId());
