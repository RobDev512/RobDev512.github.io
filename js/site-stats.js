"use strict";

const SITE_CONFIG_URL = "./data/site-config.json";

const visitCounter =
  document.querySelector("#hubVisitCounter");

const visitTotal =
  document.querySelector("#hubVisitTotal");

const visitMeta =
  document.querySelector("#hubVisitMeta");


function isLocalPreview() {
  return [
    "127.0.0.1",
    "localhost",
    ""
  ].includes(window.location.hostname);
}


function setVisitCounterState(
  state,
  {
    total = "—",
    meta = ""
  } = {}
) {
  if (!visitCounter) {
    return;
  }

  visitCounter.dataset.state =
    state;

  if (visitTotal) {
    visitTotal.textContent =
      total;
  }

  if (visitMeta) {
    visitMeta.textContent =
      meta;
  }
}


function todayIsoDate() {
  const now =
    new Date();

  const local =
    new Date(
      now.getTime() -
      now.getTimezoneOffset() *
      60_000
    );

  return local
    .toISOString()
    .slice(0, 10);
}


function goatBaseUrl(code) {
  return `https://${code}.goatcounter.com`;
}


async function goatCounterValue(
  code,
  path,
  query = ""
) {
  const response =
    await fetch(
      `${goatBaseUrl(code)}/counter/${encodeURIComponent(path)}.json${query}`,
      {
        cache: "no-store"
      }
    );

  if (response.status === 404) {
    return "0";
  }

  if (!response.ok) {
    throw new Error(
      `Contador HTTP ${response.status}`
    );
  }

  const payload =
    await response.json();

  if (!payload?.count) {
    throw new Error(
      "Respuesta de contador inválida."
    );
  }

  return payload.count;
}


function loadGoatCounterScript(code) {
  return new Promise(
    (resolve, reject) => {
      if (
        document.querySelector(
          "script[data-goatcounter]"
        )
      ) {
        resolve();
        return;
      }

      const script =
        document.createElement("script");

      script.src =
        "https://gc.zgo.at/count.js";

      script.async =
        true;

      script.dataset.goatcounter =
        `${goatBaseUrl(code)}/count`;

      script.addEventListener(
        "load",
        resolve,
        {
          once: true
        }
      );

      script.addEventListener(
        "error",
        () => reject(
          new Error(
            "No se pudo cargar GoatCounter."
          )
        ),
        {
          once: true
        }
      );

      document.head.append(script);
    }
  );
}


async function initializeVisitCounter() {
  if (!visitCounter) {
    return;
  }

  try {
    const response =
      await fetch(
        SITE_CONFIG_URL,
        {
          cache: "no-store"
        }
      );

    if (!response.ok) {
      throw new Error(
        "No se pudo cargar site-config.json."
      );
    }

    const config =
      await response.json();

    const analytics =
      config?.analytics ?? {};

    if (
      analytics.provider !== "goatcounter" ||
      analytics.enabled !== true ||
      !analytics.siteCode
    ) {
      setVisitCounterState(
        "setup",
        {
          meta:
            "Pendiente de activar el contador global"
        }
      );

      return;
    }

    const code =
      String(
        analytics.siteCode
      ).trim();

    const counterPath =
      analytics.counterPath ||
      "TOTAL";

    if (!isLocalPreview()) {
      await loadGoatCounterScript(code);
    }

    const total =
      await goatCounterValue(
        code,
        counterPath
      );

    let meta =
      isLocalPreview()
        ? "Vista previa local · esta carga no cuenta"
        : "Visitas registradas";

    if (
      analytics.displayToday === true
    ) {
      try {
        const today =
          await goatCounterValue(
            code,
            counterPath,
            `?start=${todayIsoDate()}`
          );

        meta =
          `${today} hoy · ${meta}`;
      }
      catch (error) {
        console.warn(
          "No se pudo cargar el conteo de hoy:",
          error
        );
      }
    }

    setVisitCounterState(
      "ready",
      {
        total,
        meta
      }
    );
  }
  catch (error) {
    console.error(
      "No se pudo inicializar el contador:",
      error
    );

    setVisitCounterState(
      "error",
      {
        meta:
          "Contador temporalmente no disponible"
      }
    );
  }
}


initializeVisitCounter();
