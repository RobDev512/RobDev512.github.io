"use strict";

const KM_CHARACTERS =
  "abcdefghijklmnopqrstuvwxyz" +
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
  "0123456789" +
  "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

function kmSecurePassword(length) {
  const result = [];
  const alphabetLength = KM_CHARACTERS.length;
  const limit = Math.floor(256 / alphabetLength) * alphabetLength;

  while (result.length < length) {
    const bytes = new Uint8Array(
      Math.max(32, (length - result.length) * 2)
    );

    crypto.getRandomValues(bytes);

    for (const value of bytes) {
      if (value >= limit) {
        continue;
      }

      result.push(
        KM_CHARACTERS[value % alphabetLength]
      );

      if (result.length === length) {
        break;
      }
    }
  }

  return result.join("");
}

function kmMockWindow(theme, mode) {
  const longPassword =
    "uR4!eZ8@pL2#tQ7$xV9&mN5*Kb3?Yw6+Ds1";

  const output =
    mode === "long"
      ? longPassword
      : "••••••••••••••••";

  const scroll =
    mode === "long"
      ? '<span class="km-mock-scroll"></span>'
      : "";

  return `
    <div class="km-window km-window-${theme}">
      <div class="km-mock-titlebar">
        <div class="km-mock-brand">
          <span class="km-mock-mark"></span>
          <span>KeyMint</span>
        </div>
        <div class="km-mock-controls">
          <span class="km-mock-control">◐</span>
          <span class="km-mock-control">—</span>
          <span class="km-mock-control close">×</span>
        </div>
      </div>
      <div class="km-mock-body">
        <div class="km-mock-panel">
          <div class="km-mock-row">
            <span class="km-mock-label">Longitud de contraseña</span>
            <span class="km-mock-value">${mode === "long" ? "48" : "16"}</span>
          </div>
          <div class="km-mock-slider"></div>
          <div class="km-mock-output">
            ${output}
            ${scroll}
          </div>
          <div class="km-mock-actions">
            <span class="km-mock-button">Mostrar</span>
            <span class="km-mock-button">Copiar</span>
            <span class="km-mock-button">Limpiar</span>
          </div>
          <div class="km-mock-generate">Generar contraseña</div>
        </div>
      </div>
    </div>
  `;
}

function buildKeyMintShowcase() {
  const section = document.createElement("section");
  section.className = "keymint-showcase";
  section.id = "keymint-showcase";

  section.innerHTML = `
    <div class="km-showcase-heading">
      <span class="section-kicker">Vista previa</span>
      <h2>Conoce KeyMint antes de descargarlo</h2>
      <p>
        Recorre algunos estados visuales de la aplicación y prueba una
        versión web del generador. La demo trabaja únicamente en tu
        navegador y no guarda ni envía las contraseñas generadas.
      </p>
    </div>

    <div class="km-showcase-grid">
      <article class="km-showcase-card">
        <div class="km-card-head">
          <div>
            <span class="section-kicker">Slideshow</span>
            <h3>KeyMint v1.1.0 en escritorio</h3>
            <p>Representaciones visuales de los estados principales de la app.</p>
          </div>
          <span class="km-live-pill">3 vistas</span>
        </div>

        <div class="km-slider-stage" id="kmSliderStage">
          <div class="km-slide is-active" data-km-slide="0">
            ${kmMockWindow("dark", "normal")}
            <span class="km-slide-caption">Modo oscuro · Vista principal</span>
          </div>
          <div class="km-slide" data-km-slide="1">
            ${kmMockWindow("light", "normal")}
            <span class="km-slide-caption">Modo claro · Misma estructura</span>
          </div>
          <div class="km-slide" data-km-slide="2">
            ${kmMockWindow("dark", "long")}
            <span class="km-slide-caption">Contraseña larga · Scroll horizontal</span>
          </div>
        </div>

        <div class="km-slider-controls" aria-label="Controles del slideshow">
          <button class="km-slide-arrow" id="kmPrevSlide" type="button" aria-label="Vista anterior">←</button>
          <button class="km-slide-dot is-active" type="button" data-km-dot="0" aria-label="Vista 1"></button>
          <button class="km-slide-dot" type="button" data-km-dot="1" aria-label="Vista 2"></button>
          <button class="km-slide-dot" type="button" data-km-dot="2" aria-label="Vista 3"></button>
          <button class="km-slide-arrow" id="kmNextSlide" type="button" aria-label="Vista siguiente">→</button>
        </div>
      </article>

      <article class="km-showcase-card km-demo">
        <div class="km-card-head">
          <div>
            <span class="section-kicker">Demo web</span>
            <h3>Prueba el generador</h3>
            <p>Misma idea de KeyMint, ejecutada localmente en el navegador.</p>
          </div>
          <span class="km-live-pill">Local</span>
        </div>

        <div class="km-demo-panel">
          <div class="km-demo-length-row">
            <label for="kmDemoLength">Longitud</label>
            <span class="km-demo-length" id="kmDemoLengthValue">16</span>
          </div>

          <input
            id="kmDemoLength"
            type="range"
            min="4"
            max="64"
            step="1"
            value="16"
          >

          <div class="km-demo-output-wrap">
            <input
              id="kmDemoOutput"
              type="password"
              readonly
              aria-label="Contraseña generada por la demo"
              placeholder="Genera una contraseña"
            >
            <button
              class="km-demo-eye"
              id="kmDemoToggle"
              type="button"
            >Mostrar</button>
          </div>

          <div class="km-demo-actions">
            <button class="km-demo-button primary" id="kmDemoGenerate" type="button">Generar contraseña</button>
            <button class="km-demo-button" id="kmDemoCopy" type="button">Copiar</button>
            <button class="km-demo-button" id="kmDemoClear" type="button">Limpiar</button>
          </div>

          <p class="km-demo-status" id="kmDemoStatus" aria-live="polite">
            Todo se genera localmente en este navegador.
          </p>

          <p class="km-demo-privacy">
            La demo usa <code>crypto.getRandomValues()</code>. No almacena
            historial, no utiliza cookies para las contraseñas y no realiza
            peticiones de red con el valor generado.
          </p>
        </div>
      </article>
    </div>
  `;

  return section;
}

function installKeyMintSlideshow(section) {
  const slides = [...section.querySelectorAll("[data-km-slide]")];
  const dots = [...section.querySelectorAll("[data-km-dot]")];
  const stage = section.querySelector("#kmSliderStage");
  const previous = section.querySelector("#kmPrevSlide");
  const next = section.querySelector("#kmNextSlide");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let current = 0;
  let timer = null;

  function show(index) {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === current);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  }

  function stopAuto() {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function startAuto() {
    stopAuto();

    if (reduceMotion) {
      return;
    }

    timer = window.setInterval(() => {
      show(current + 1);
    }, 5200);
  }

  previous.addEventListener("click", () => {
    show(current - 1);
    startAuto();
  });

  next.addEventListener("click", () => {
    show(current + 1);
    startAuto();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      show(index);
      startAuto();
    });
  });

  stage.addEventListener("pointerenter", stopAuto);
  stage.addEventListener("pointerleave", startAuto);
  stage.addEventListener("focusin", stopAuto);
  stage.addEventListener("focusout", startAuto);

  startAuto();
}

function installKeyMintDemo(section) {
  const lengthInput = section.querySelector("#kmDemoLength");
  const lengthValue = section.querySelector("#kmDemoLengthValue");
  const output = section.querySelector("#kmDemoOutput");
  const toggle = section.querySelector("#kmDemoToggle");
  const generate = section.querySelector("#kmDemoGenerate");
  const copy = section.querySelector("#kmDemoCopy");
  const clear = section.querySelector("#kmDemoClear");
  const status = section.querySelector("#kmDemoStatus");

  function setStatus(message, error = false) {
    status.textContent = message;
    status.style.color = error ? "#ef7777" : "#7ef0d1";
  }

  lengthInput.addEventListener("input", () => {
    lengthValue.textContent = lengthInput.value;
  });

  generate.addEventListener("click", () => {
    output.value = kmSecurePassword(Number(lengthInput.value));
    output.type = "password";
    toggle.textContent = "Mostrar";
    setStatus("Contraseña generada localmente.");
  });

  toggle.addEventListener("click", () => {
    if (!output.value) {
      setStatus("Primero genera una contraseña.", true);
      return;
    }

    const showing = output.type === "text";
    output.type = showing ? "password" : "text";
    toggle.textContent = showing ? "Mostrar" : "Ocultar";
  });

  copy.addEventListener("click", async () => {
    if (!output.value) {
      setStatus("Primero genera una contraseña.", true);
      return;
    }

    try {
      await navigator.clipboard.writeText(output.value);
      setStatus("Contraseña copiada.");
    }
    catch {
      output.type = "text";
      output.select();
      const copied = document.execCommand("copy");
      output.setSelectionRange(0, 0);
      setStatus(
        copied ? "Contraseña copiada." : "No se pudo copiar automáticamente.",
        !copied
      );
    }
  });

  clear.addEventListener("click", () => {
    output.value = "";
    output.type = "password";
    toggle.textContent = "Mostrar";
    setStatus("Demo limpia. Todo sigue local.");
  });
}

function installKeyMintShowcase() {
  if (document.querySelector("#keymint-showcase")) {
    return true;
  }

  const hero = document.querySelector("main > .hero");

  if (!hero) {
    return false;
  }

  const showcase = buildKeyMintShowcase();
  hero.insertAdjacentElement("afterend", showcase);

  const nav = document.querySelector(".site-nav");

  if (nav && !nav.querySelector('a[href="#keymint-showcase"]')) {
    const link = document.createElement("a");
    link.href = "#keymint-showcase";
    link.textContent = "Demo";
    nav.prepend(link);
  }

  installKeyMintSlideshow(showcase);
  installKeyMintDemo(showcase);
  return true;
}

if (!installKeyMintShowcase()) {
  const observer = new MutationObserver(() => {
    if (installKeyMintShowcase()) {
      observer.disconnect();
    }
  });

  observer.observe(
    document.querySelector("#projectPageRoot"),
    {
      childList: true,
      subtree: true,
    }
  );
}
