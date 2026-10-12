"use strict";

const HISTORY_URL = "./data/history.json";
const HISTORY_PROJECTS_URL = "./data/projects.json";
const HISTORY_SCHEMA_VERSION = 2;

const historyState = {
  data: null,
  projects: new Map(),
  events: [],
  filters: {
    project: null,
    type: null,
    year: null,
    month: null,
    day: null,
    hour: null
  },
  view: "timeline",
  granularity: "month",
  selectedId: null
};

const historySection = document.querySelector("#portfolioHistory");
const historyGrid = document.querySelector("#historyTimeline");
const historyPeriods = document.querySelector("#historyPeriods");
const historyStatus = document.querySelector("#historyStatus");
const historyStats = document.querySelector("#historyStats");
const historyProjectFilter = document.querySelector("#historyProjectFilter");
const historyTypeFilter = document.querySelector("#historyTypeFilter");
const historyYearFilter = document.querySelector("#historyYearFilter");
const historyMonthFilter = document.querySelector("#historyMonthFilter");
const historyDayFilter = document.querySelector("#historyDayFilter");
const historyHourFilter = document.querySelector("#historyHourFilter");
const historyGranularity = document.querySelector("#historyGranularity");
const historyReset = document.querySelector("#historyReset");
const historyViewToggle = document.querySelector("#historyViewToggle");
const historyDetail = document.querySelector("#historyDetail");

function historyCreate(tag, className = "", text = "") {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== "") {
    element.textContent = text;
  }

  return element;
}


const HISTORY_ICON_SPRITE = "./assets/icons/hub-icons.svg";

function historyIcon(name, className = "ui-icon") {
  const svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  svg.setAttribute("class", className);
  svg.setAttribute("aria-hidden", "true");

  const use = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "use"
  );

  use.setAttribute(
    "href",
    `${HISTORY_ICON_SPRITE}#icon-${name}`
  );

  svg.append(use);
  return svg;
}

function historyTypeIcon(type) {
  const icons = {
    "hub-phase": "roadmap",
    release: "tag",
    milestone: "star"
  };

  return icons[type] ?? "history";
}

function historyRequireString(value, fieldName, eventId = "history") {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${eventId}: ${fieldName} debe ser una cadena no vacía.`);
  }
}

function validateHistory(data) {
  if (!data || typeof data !== "object") {
    throw new Error("El historial recibido no es válido.");
  }

  if (data.schemaVersion !== HISTORY_SCHEMA_VERSION) {
    throw new Error(`schemaVersion no soportado: ${data.schemaVersion}`);
  }

  if (!data.taxonomy || !Array.isArray(data.taxonomy.types)) {
    throw new Error("El historial no contiene taxonomy.types.");
  }

  if (!Array.isArray(data.events)) {
    throw new Error("history.events debe ser un arreglo.");
  }

  const typeIds = new Set();

  for (const type of data.taxonomy.types) {
    historyRequireString(type.id, "taxonomy.types.id");
    historyRequireString(type.label, "taxonomy.types.label");
    typeIds.add(type.id);
  }

  const eventIds = new Set();

  for (const event of data.events) {
    historyRequireString(event.id, "id");
    historyRequireString(event.date, "date", event.id);
    historyRequireString(event.type, "type", event.id);
    historyRequireString(event.projectId, "projectId", event.id);
    historyRequireString(event.title, "title", event.id);
    historyRequireString(event.summary, "summary", event.id);

    if (eventIds.has(event.id)) {
      throw new Error(`ID de evento duplicado: ${event.id}`);
    }

    eventIds.add(event.id);

    if (!typeIds.has(event.type)) {
      throw new Error(`${event.id}: tipo desconocido ${event.type}.`);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
      throw new Error(`${event.id}: date debe usar YYYY-MM-DD.`);
    }

    const [year, month, day] = event.date.split("-").map(Number);
    const localDate = new Date(year, month - 1, day, 12, 0, 0);

    if (
      localDate.getFullYear() !== year ||
      localDate.getMonth() !== month - 1 ||
      localDate.getDate() !== day
    ) {
      throw new Error(`${event.id}: fecha inválida.`);
    }

    if (event.occurredAt !== undefined) {
      historyRequireString(event.occurredAt, "occurredAt", event.id);

      if (Number.isNaN(Date.parse(event.occurredAt))) {
        throw new Error(`${event.id}: occurredAt no es un ISO-8601 válido.`);
      }
    }

    if (
      event.precision !== undefined &&
      !["day", "time"].includes(event.precision)
    ) {
      throw new Error(`${event.id}: precision debe ser day o time.`);
    }

    if (event.precision === "time" && !event.occurredAt) {
      throw new Error(`${event.id}: precision time requiere occurredAt.`);
    }

    if (event.links !== undefined && !Array.isArray(event.links)) {
      throw new Error(`${event.id}: links debe ser un arreglo.`);
    }
  }
}

function historyTypeLabel(typeId) {
  return historyState.data?.taxonomy.types.find((item) => item.id === typeId)?.label ?? typeId;
}

function historySubject(event) {
  if (event.projectId === "hub") {
    return {
      id: "hub",
      name: "RobDev512 Hub",
      logo: null
    };
  }

  const project = historyState.projects.get(event.projectId);

  return {
    id: event.projectId,
    name: project?.name ?? event.projectId,
    logo: project?.logo?.src ?? null,
    alt: project?.logo?.alt ?? ""
  };
}

function historyHasExactTime(event) {
  return typeof event.occurredAt === "string" && !Number.isNaN(Date.parse(event.occurredAt));
}

function historyParts(event) {
  if (historyHasExactTime(event)) {
    const date = new Date(event.occurredAt);

    return {
      year: String(date.getFullYear()),
      month: String(date.getMonth() + 1).padStart(2, "0"),
      day: String(date.getDate()).padStart(2, "0"),
      hour: String(date.getHours()).padStart(2, "0"),
      minute: String(date.getMinutes()).padStart(2, "0"),
      second: String(date.getSeconds()).padStart(2, "0"),
      date
    };
  }

  const [year, month, day] = event.date.split("-");

  return {
    year,
    month,
    day,
    hour: null,
    minute: null,
    second: null,
    date: new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0)
  };
}

function historyDateLabel(event, { detailed = false } = {}) {
  const parts = historyParts(event);

  if (historyHasExactTime(event)) {
    const options = detailed
      ? {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hourCycle: "h23",
          timeZoneName: "short"
        }
      : {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23"
        };

    return new Intl.DateTimeFormat("es-MX", options).format(parts.date);
  }

  const dateLabel = new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(parts.date);

  return detailed ? `${dateLabel} · hora no registrada` : dateLabel;
}

function historyMonthLabel(year, month) {
  const date = new Date(Number(year), Number(month) - 1, 1, 12, 0, 0);
  return new Intl.DateTimeFormat("es-MX", {
    month: "long",
    year: "numeric"
  }).format(date);
}

function historyDayLabel(year, month, day) {
  const date = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

function historyPeriodKey(event, granularity = historyState.granularity) {
  const parts = historyParts(event);

  switch (granularity) {
    case "year":
      return parts.year;
    case "day":
      return `${parts.year}-${parts.month}-${parts.day}`;
    case "hour":
      return historyHasExactTime(event)
        ? `${parts.year}-${parts.month}-${parts.day}T${parts.hour}`
        : `${parts.year}-${parts.month}-${parts.day}Tunknown`;
    case "month":
    default:
      return `${parts.year}-${parts.month}`;
  }
}

function historyPeriodLabel(event, granularity = historyState.granularity) {
  const parts = historyParts(event);

  switch (granularity) {
    case "year":
      return parts.year;
    case "day":
      return historyDayLabel(parts.year, parts.month, parts.day);
    case "hour":
      return historyHasExactTime(event)
        ? `${historyDayLabel(parts.year, parts.month, parts.day)} · ${parts.hour}:00`
        : `${historyDayLabel(parts.year, parts.month, parts.day)} · hora no registrada`;
    case "month":
    default:
      return historyMonthLabel(parts.year, parts.month);
  }
}

function historySort(events) {
  return [...events].sort((a, b) => {
    const aParts = historyParts(a);
    const bParts = historyParts(b);
    const aDay = `${aParts.year}-${aParts.month}-${aParts.day}`;
    const bDay = `${bParts.year}-${bParts.month}-${bParts.day}`;
    const dayCompare = bDay.localeCompare(aDay);

    if (dayCompare !== 0) {
      return dayCompare;
    }

    const sequenceCompare = (b.sequence ?? 0) - (a.sequence ?? 0);

    if (sequenceCompare !== 0) {
      return sequenceCompare;
    }

    return bParts.date.getTime() - aParts.date.getTime();
  });
}

function eventMatchesTemporalFilter(event) {
  const parts = historyParts(event);
  const filters = historyState.filters;

  if (filters.year && parts.year !== filters.year) return false;
  if (filters.month && parts.month !== filters.month) return false;
  if (filters.day && parts.day !== filters.day) return false;

  if (filters.hour) {
    if (!historyHasExactTime(event) || parts.hour !== filters.hour) {
      return false;
    }
  }

  return true;
}

function filteredHistoryEvents() {
  return historySort(
    historyState.events.filter((event) => {
      if (historyState.filters.project && event.projectId !== historyState.filters.project) {
        return false;
      }

      if (historyState.filters.type && event.type !== historyState.filters.type) {
        return false;
      }

      return eventMatchesTemporalFilter(event);
    })
  );
}

function populateHistorySelect(select, values, placeholder) {
  if (!select) {
    return;
  }

  select.replaceChildren();

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = placeholder;
  select.append(defaultOption);

  for (const value of values) {
    const option = document.createElement("option");
    option.value = value.id;
    option.textContent = value.label;
    select.append(option);
  }
}

function eventsForTemporalOptions(level) {
  return historyState.events.filter((event) => {
    const parts = historyParts(event);
    const filters = historyState.filters;

    if (level !== "year" && filters.year && parts.year !== filters.year) return false;
    if (!["year", "month"].includes(level) && filters.month && parts.month !== filters.month) return false;
    if (!["year", "month", "day"].includes(level) && filters.day && parts.day !== filters.day) return false;

    return true;
  });
}

function populateTemporalFilters() {
  const allParts = historyState.events.map(historyParts);
  const years = [...new Set(allParts.map((parts) => parts.year))]
    .sort((a, b) => b.localeCompare(a))
    .map((year) => ({ id: year, label: year }));

  populateHistorySelect(historyYearFilter, years, "Todos los años");

  const monthEvents = eventsForTemporalOptions("month");
  const monthIds = [...new Set(monthEvents.map((event) => historyParts(event).month))]
    .sort((a, b) => a.localeCompare(b));

  const monthYear = historyState.filters.year ?? historyParts(monthEvents[0] ?? historyState.events[0]).year;
  const months = monthIds.map((month) => ({
    id: month,
    label: new Intl.DateTimeFormat("es-MX", { month: "long" })
      .format(new Date(Number(monthYear), Number(month) - 1, 1, 12, 0, 0))
  }));

  populateHistorySelect(historyMonthFilter, months, "Todos los meses");

  const dayEvents = eventsForTemporalOptions("day");
  const days = [...new Set(dayEvents.map((event) => historyParts(event).day))]
    .sort((a, b) => Number(a) - Number(b))
    .map((day) => ({ id: day, label: `Día ${Number(day)}` }));

  populateHistorySelect(historyDayFilter, days, "Todos los días");

  const hourEvents = eventsForTemporalOptions("hour")
    .filter(historyHasExactTime);

  const hours = [...new Set(hourEvents.map((event) => historyParts(event).hour))]
    .sort((a, b) => Number(a) - Number(b))
    .map((hour) => ({ id: hour, label: `${hour}:00–${hour}:59` }));

  populateHistorySelect(historyHourFilter, hours, "Todas las horas");

  updateHistoryControls();
}

function validateTemporalSelections() {
  const availableYears = new Set(historyState.events.map((event) => historyParts(event).year));
  if (historyState.filters.year && !availableYears.has(historyState.filters.year)) {
    historyState.filters.year = null;
  }

  const monthEvents = eventsForTemporalOptions("month");
  const availableMonths = new Set(monthEvents.map((event) => historyParts(event).month));
  if (historyState.filters.month && !availableMonths.has(historyState.filters.month)) {
    historyState.filters.month = null;
    historyState.filters.day = null;
    historyState.filters.hour = null;
  }

  const dayEvents = eventsForTemporalOptions("day");
  const availableDays = new Set(dayEvents.map((event) => historyParts(event).day));
  if (historyState.filters.day && !availableDays.has(historyState.filters.day)) {
    historyState.filters.day = null;
    historyState.filters.hour = null;
  }

  const hourEvents = eventsForTemporalOptions("hour").filter(historyHasExactTime);
  const availableHours = new Set(hourEvents.map((event) => historyParts(event).hour));
  if (historyState.filters.hour && !availableHours.has(historyState.filters.hour)) {
    historyState.filters.hour = null;
  }
}

function renderHistoryStats() {
  if (!historyStats) {
    return;
  }

  const subjects = new Set(historyState.events.map((event) => event.projectId));
  const releases = historyState.events.filter((event) => event.type === "release").length;
  const exactTimes = historyState.events.filter(historyHasExactTime).length;

  const stats = [
    [historyState.events.length, "Eventos registrados"],
    [subjects.size, "Proyectos / Hub"],
    [releases, "Releases"],
    [exactTimes, "Con hora exacta"]
  ];

  historyStats.replaceChildren();

  for (const [value, label] of stats) {
    const item = historyCreate("div", "history-stat");
    item.append(
      historyCreate("strong", "", String(value)),
      historyCreate("span", "", label)
    );
    historyStats.append(item);
  }
}

function historyEventCard(event) {
  const subject = historySubject(event);
  const card = historyCreate("button", `history-event history-event-${event.type} history-project-${subject.id}`);
  card.type = "button";
  card.dataset.historyEvent = event.id;
  card.setAttribute("aria-pressed", String(historyState.selectedId === event.id));

  if (historyState.selectedId === event.id) {
    card.classList.add("selected");
  }

  const marker = historyCreate("span", "history-event-marker");
  marker.setAttribute("aria-hidden", "true");

  const top = historyCreate("div", "history-event-top");
  const identity = historyCreate("div", "history-event-identity");

  if (subject.logo) {
    const img = document.createElement("img");
    img.src = subject.logo;
    img.alt = subject.alt || "";
    identity.append(img);
  }
  else {
    identity.append(historyCreate("span", "history-subject-glyph", "R"));
  }

  const subjectCopy = historyCreate("div");
  const typeLine = historyCreate("span", "history-event-type-line");
  typeLine.append(
    historyIcon(
      historyTypeIcon(event.type),
      "ui-icon history-event-type-icon"
    ),
    document.createTextNode(
      historyTypeLabel(event.type)
    )
  );

  subjectCopy.append(
    historyCreate("strong", "", subject.name),
    typeLine
  );
  identity.append(subjectCopy);

  const date = historyCreate("time", "history-event-date", historyDateLabel(event));
  date.dateTime = event.occurredAt ?? event.date;
  date.title = historyDateLabel(event, { detailed: true });
  top.append(identity, date);

  const title = historyCreate("h3", "", event.title);
  const summary = historyCreate("p", "", event.summary);

  const meta = historyCreate("div", "history-event-meta");

  if (event.version) {
    meta.append(historyCreate("span", "history-version", event.version));
  }

  meta.append(
    historyCreate(
      "span",
      historyHasExactTime(event) ? "history-time-precision exact" : "history-time-precision",
      historyHasExactTime(event) ? "Hora exacta" : "Precisión: día"
    )
  );

  if (event.featured) {
    meta.append(historyCreate("span", "history-featured", "Hito destacado"));
  }

  card.append(marker, top, title, summary, meta);

  card.addEventListener("click", () => {
    historyState.selectedId = historyState.selectedId === event.id ? null : event.id;
    renderHistoryTimeline();
    renderHistoryDetail();
  });

  return card;
}

function renderHistoryTimeline() {
  if (!historyGrid) {
    return;
  }

  const events = filteredHistoryEvents();
  historyGrid.replaceChildren();

  if (!events.length) {
    historyGrid.append(
      historyCreate("p", "history-empty", "No hay eventos que coincidan con estos filtros.")
    );
    return;
  }

  let lastPeriod = null;
  let periodEventIndex = 0;

  for (const event of events) {
    const period = historyPeriodKey(event);

    if (period !== lastPeriod) {
      const divider = historyCreate("div", "history-period-divider");
      divider.append(
        historyCreate("span", "", historyPeriodLabel(event)),
        historyCreate("i")
      );
      historyGrid.append(divider);
      lastPeriod = period;
      periodEventIndex = 0;
    }

    const card = historyEventCard(event);

    card.classList.add(
      periodEventIndex % 2 === 0
        ? "history-event-left"
        : "history-event-right"
    );

    historyGrid.append(card);
    periodEventIndex += 1;
  }
}

function renderHistoryPeriods() {
  if (!historyPeriods) {
    return;
  }

  const events = filteredHistoryEvents();
  const grouped = new Map();

  for (const event of events) {
    const key = historyPeriodKey(event);

    if (!grouped.has(key)) {
      grouped.set(key, {
        label: historyPeriodLabel(event),
        sortDate: historyParts(event).date.getTime(),
        events: []
      });
    }

    grouped.get(key).events.push(event);
  }

  historyPeriods.replaceChildren();

  if (!grouped.size) {
    historyPeriods.append(
      historyCreate("p", "history-empty", "No hay periodos que coincidan con estos filtros.")
    );
    return;
  }

  const groups = [...grouped.values()].sort((a, b) => b.sortDate - a.sortDate);

  for (const group of groups) {
    const periodEvents = historySort(group.events);
    const card = historyCreate("article", "history-period-card");
    const header = historyCreate("div", "history-period-card-header");
    header.append(
      historyCreate("strong", "", group.label),
      historyCreate("span", "", `${periodEvents.length} eventos`)
    );

    const releases = periodEvents.filter((event) => event.type === "release").length;
    const milestones = periodEvents.filter((event) => event.featured).length;
    const subjects = new Set(periodEvents.map((event) => event.projectId)).size;
    const exactTimes = periodEvents.filter(historyHasExactTime).length;

    const metrics = historyCreate("div", "history-period-metrics");
    for (const [value, label] of [
      [releases, "releases"],
      [milestones, "destacados"],
      [subjects, "proyectos / Hub"],
      [exactTimes, "con hora"]
    ]) {
      const metric = historyCreate("span");
      metric.append(historyCreate("strong", "", String(value)), document.createTextNode(` ${label}`));
      metrics.append(metric);
    }

    const highlights = historyCreate("div", "history-period-highlights");
    const candidates = periodEvents.filter((item) => item.featured);
    const visible = candidates.length ? candidates : periodEvents;

    for (const event of visible.slice(0, 6)) {
      const item = historyCreate("button", "history-period-highlight");
      item.type = "button";
      item.textContent = `${historyHasExactTime(event) ? `${historyParts(event).hour}:${historyParts(event).minute} · ` : ""}${event.title}`;
      item.addEventListener("click", () => {
        historyState.selectedId = event.id;
        setHistoryView("timeline", true);
        renderHistoryTimeline();
        renderHistoryDetail();
        historyDetail?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
      highlights.append(item);
    }

    card.append(header, metrics, highlights);
    historyPeriods.append(card);
  }
}

function renderHistoryDetail() {
  if (!historyDetail) {
    return;
  }

  const event = historyState.events.find((candidate) => candidate.id === historyState.selectedId);

  if (!event) {
    historyDetail.hidden = true;
    historyDetail.replaceChildren();
    return;
  }

  const subject = historySubject(event);
  historyDetail.hidden = false;
  historyDetail.replaceChildren();

  const top = historyCreate("div", "history-detail-top");
  const labels = historyCreate("div", "history-detail-labels");
  labels.append(
    historyCreate("span", "history-detail-subject", subject.name),
    historyCreate("span", "history-detail-type", historyTypeLabel(event.type))
  );

  const close = historyCreate("button", "history-detail-close");
  close.type = "button";
  close.append(
    historyIcon("close"),
    historyCreate("span", "", "Cerrar")
  );
  close.addEventListener("click", () => {
    historyState.selectedId = null;
    renderHistoryTimeline();
    renderHistoryDetail();
  });

  top.append(labels, close);

  historyDetail.append(
    top,
    historyCreate("h3", "", event.title),
    historyCreate("p", "", event.summary)
  );

  const meta = historyCreate("div", "history-detail-meta");
  meta.append(historyCreate("span", "", historyDateLabel(event, { detailed: true })));

  if (historyHasExactTime(event)) {
    meta.append(historyCreate("span", "", "Hora mostrada en la zona local del navegador"));
  }
  else {
    meta.append(historyCreate("span", "", "El origen sólo conserva precisión de día"));
  }

  if (event.version) {
    meta.append(historyCreate("span", "", event.version));
  }

  historyDetail.append(meta);

  if (event.links?.length) {
    const actions = historyCreate("div", "history-detail-actions");

    for (const link of event.links) {
      const anchor = historyCreate("a", "history-detail-link");
      anchor.href = link.url;
      anchor.append(
        historyIcon(
          link.external
            ? "external"
            : "link"
        ),
        historyCreate("span", "", link.label)
      );

      if (link.external) {
        anchor.target = "_blank";
        anchor.rel = "noreferrer";
      }

      actions.append(anchor);
    }

    historyDetail.append(actions);
  }
}

function renderHistoryStatus() {
  if (!historyStatus) {
    return;
  }

  const events = filteredHistoryEvents();
  const count = events.length;
  const total = historyState.events.length;
  const exact = events.filter(historyHasExactTime).length;
  const granularityLabel = {
    year: "año",
    month: "mes",
    day: "día",
    hour: "hora"
  }[historyState.granularity];

  historyStatus.textContent = count === total
    ? `${total} eventos registrados · ${exact} con hora exacta · agrupación por ${granularityLabel}.`
    : `${count} de ${total} eventos visibles · ${exact} con hora exacta · agrupación por ${granularityLabel}.`;
}

function setHistoryView(view, push = false) {
  historyState.view = view === "periods" ? "periods" : "timeline";

  if (historyGrid) {
    historyGrid.hidden = historyState.view !== "timeline";
  }

  if (historyPeriods) {
    historyPeriods.hidden = historyState.view !== "periods";
  }

  historyViewToggle?.querySelectorAll("[data-history-view]").forEach((button) => {
    const active = button.dataset.historyView === historyState.view;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  if (push) {
    syncHistoryUrl("push");
  }
}

function setHistoryGranularity(value, push = false) {
  const valid = new Set(["year", "month", "day", "hour"]);
  historyState.granularity = valid.has(value) ? value : "month";

  if (historyGranularity) {
    historyGranularity.value = historyState.granularity;
  }

  renderHistoryTimeline();
  renderHistoryPeriods();
  renderHistoryStatus();

  if (push) {
    syncHistoryUrl("push");
  }
}

function syncHistoryUrl(mode = "replace") {
  const url = new URL(window.location.href);
  const values = {
    hProject: historyState.filters.project,
    hType: historyState.filters.type,
    hYear: historyState.filters.year,
    hMonth: historyState.filters.month,
    hDay: historyState.filters.day,
    hHour: historyState.filters.hour,
    hGroup: historyState.granularity !== "month" ? historyState.granularity : null,
    hView: historyState.view !== "timeline" ? historyState.view : null
  };

  for (const [key, value] of Object.entries(values)) {
    if (value) {
      url.searchParams.set(key, value);
    }
    else {
      url.searchParams.delete(key);
    }
  }

  window.history[mode === "push" ? "pushState" : "replaceState"]({}, "", url);
}

function readHistoryUrl() {
  const params = new URLSearchParams(window.location.search);
  const validProjects = new Set(["hub", ...historyState.projects.keys()]);
  const validTypes = new Set(historyState.data.taxonomy.types.map((item) => item.id));
  const validGranularity = new Set(["year", "month", "day", "hour"]);

  const project = params.get("hProject");
  const type = params.get("hType");
  const view = params.get("hView");
  const granularity = params.get("hGroup");

  historyState.filters.project = validProjects.has(project) ? project : null;
  historyState.filters.type = validTypes.has(type) ? type : null;
  historyState.filters.year = /^\d{4}$/.test(params.get("hYear") ?? "") ? params.get("hYear") : null;
  historyState.filters.month = /^(0[1-9]|1[0-2])$/.test(params.get("hMonth") ?? "") ? params.get("hMonth") : null;
  historyState.filters.day = /^(0[1-9]|[12]\d|3[01])$/.test(params.get("hDay") ?? "") ? params.get("hDay") : null;
  historyState.filters.hour = /^([01]\d|2[0-3])$/.test(params.get("hHour") ?? "") ? params.get("hHour") : null;
  historyState.view = view === "periods" ? "periods" : "timeline";
  historyState.granularity = validGranularity.has(granularity) ? granularity : "month";

  validateTemporalSelections();
}

function updateHistoryControls() {
  if (historyProjectFilter) historyProjectFilter.value = historyState.filters.project ?? "";
  if (historyTypeFilter) historyTypeFilter.value = historyState.filters.type ?? "";
  if (historyYearFilter) historyYearFilter.value = historyState.filters.year ?? "";
  if (historyMonthFilter) historyMonthFilter.value = historyState.filters.month ?? "";
  if (historyDayFilter) historyDayFilter.value = historyState.filters.day ?? "";
  if (historyHourFilter) historyHourFilter.value = historyState.filters.hour ?? "";
  if (historyGranularity) historyGranularity.value = historyState.granularity;
}

function renderHistory() {
  validateTemporalSelections();
  populateTemporalFilters();
  renderHistoryTimeline();
  renderHistoryPeriods();
  renderHistoryDetail();
  renderHistoryStatus();
  setHistoryView(historyState.view, false);
  updateHistoryControls();
}

function temporalFilterChanged(level, value) {
  historyState.filters[level] = value || null;

  if (level === "year") {
    historyState.filters.month = null;
    historyState.filters.day = null;
    historyState.filters.hour = null;
  }
  else if (level === "month") {
    historyState.filters.day = null;
    historyState.filters.hour = null;
  }
  else if (level === "day") {
    historyState.filters.hour = null;
  }

  historyState.selectedId = null;
  renderHistory();
  syncHistoryUrl("push");
}

function bindHistoryControls() {
  historyProjectFilter?.addEventListener("change", () => {
    historyState.filters.project = historyProjectFilter.value || null;
    historyState.selectedId = null;
    renderHistory();
    syncHistoryUrl("push");
  });

  historyTypeFilter?.addEventListener("change", () => {
    historyState.filters.type = historyTypeFilter.value || null;
    historyState.selectedId = null;
    renderHistory();
    syncHistoryUrl("push");
  });

  historyYearFilter?.addEventListener("change", () => temporalFilterChanged("year", historyYearFilter.value));
  historyMonthFilter?.addEventListener("change", () => temporalFilterChanged("month", historyMonthFilter.value));
  historyDayFilter?.addEventListener("change", () => temporalFilterChanged("day", historyDayFilter.value));
  historyHourFilter?.addEventListener("change", () => temporalFilterChanged("hour", historyHourFilter.value));

  historyGranularity?.addEventListener("change", () => {
    setHistoryGranularity(historyGranularity.value, true);
  });

  historyReset?.addEventListener("click", () => {
    historyState.filters = {
      project: null,
      type: null,
      year: null,
      month: null,
      day: null,
      hour: null
    };
    historyState.granularity = "month";
    historyState.selectedId = null;
    renderHistory();
    syncHistoryUrl("push");
  });

  historyViewToggle?.querySelectorAll("[data-history-view]").forEach((button) => {
    button.addEventListener("click", () => {
      setHistoryView(button.dataset.historyView, true);
    });
  });

  window.addEventListener("popstate", () => {
    readHistoryUrl();
    renderHistory();
  });
}

async function loadPortfolioHistory() {
  if (!historySection) {
    return;
  }

  try {
    const [historyResponse, projectsResponse] = await Promise.all([
      fetch(HISTORY_URL, { cache: "no-store" }),
      fetch(HISTORY_PROJECTS_URL, { cache: "no-store" })
    ]);

    if (!historyResponse.ok) {
      throw new Error(`history.json HTTP ${historyResponse.status}`);
    }

    if (!projectsResponse.ok) {
      throw new Error(`projects.json HTTP ${projectsResponse.status}`);
    }

    const [data, projectsData] = await Promise.all([
      historyResponse.json(),
      projectsResponse.json()
    ]);

    validateHistory(data);

    historyState.data = data;
    historyState.events = data.events;
    historyState.projects = new Map(
      (projectsData.projects ?? []).map((project) => [project.id, project])
    );

    const projectOptions = [
      { id: "hub", label: "RobDev512 Hub" },
      ...[...historyState.projects.values()]
        .filter((project) => historyState.events.some((event) => event.projectId === project.id))
        .map((project) => ({ id: project.id, label: project.name }))
        .sort((a, b) => a.label.localeCompare(b.label, "es"))
    ];

    populateHistorySelect(historyProjectFilter, projectOptions, "Todos los proyectos");
    populateHistorySelect(
      historyTypeFilter,
      data.taxonomy.types.map((type) => ({ id: type.id, label: type.label })),
      "Todos los tipos"
    );

    readHistoryUrl();
    bindHistoryControls();
    renderHistoryStats();
    renderHistory();

    historySection.classList.add("history-ready");
  }
  catch (error) {
    console.error("No se pudo cargar el historial del portafolio:", error);

    if (historyStatus) {
      historyStatus.textContent = "No se pudo cargar el historial del portafolio.";
      historyStatus.classList.add("history-error");
    }
  }
}

loadPortfolioHistory();
