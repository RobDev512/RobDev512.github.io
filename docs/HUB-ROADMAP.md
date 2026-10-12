# Roadmap del Hub de Proyectos

## Estado actual

El hub ya cuenta con:

- GitHub Pages;
- catálogo dinámico;
- `data/projects.json` como fuente central;
- renderizado mediante `js/hub.js`;
- taxonomía de categorías, estados y visibilidades;
- navegación visible por categoría;
- búsqueda simple;
- búsqueda avanzada opcional;
- filtros combinados y ordenamiento;
- inventario inicial de proyectos personales;
- páginas individuales para los proyectos ya registrados;
- sección pública del roadmap del propio hub.

## Criterio general

El hub se organiza por **tipo de proyecto/producto**, no por lenguaje de
programación. Los lenguajes, frameworks, plataformas y bases de datos se
tratan como metadata secundaria.

---

# Fase 1 - Catálogo dinámico

**Estado:** Completada.

## Objetivo

Separar el catálogo de proyectos de `index.html` y mover la información del hub
a una fuente de verdad centralizada.

## Implementado

- `data/projects.json` como catálogo principal;
- carga dinámica desde `js/hub.js`;
- renderizado de tarjetas sin hardcodear cada proyecto en HTML;
- estructura preparada para ampliar el catálogo sin rediseñar la portada.

## Impacto

Esta fase convirtió la portada en una vista renderizada desde datos, lo que
permitió que el hub pudiera crecer sin duplicar estructura manual en el HTML.

---

# Fase 2 - Categorías y navegación

**Estado:** Completada.

## Objetivo

Agrupar el catálogo por categoría de proyecto y permitir navegación clara desde
la portada.

## Implementado

- categorías visibles como navegación;
- opción `Todos`;
- contadores por categoría;
- sincronización con la URL;
- navegación compatible con Atrás / Adelante del navegador.

## Impacto

El hub dejó de ser un listado lineal y empezó a comportarse como un catálogo
navegable.

---

# Fase 3 - Inventario de proyectos existentes

**Estado:** Completada.

## Objetivo

Registrar proyectos personales ya existentes, aunque no todos estuvieran
publicados en GitHub o completamente documentados.

## Implementado

- incorporación inicial de AWS ORBISHOT, LabNotes, Convertidor de Archivos y
  TecNet Finder;
- logos de proyectos con identidad propia;
- páginas individuales o landing para cada uno;
- roadmaps individuales conectados con su documentación.

## Impacto

Esta fase hizo que el hub representara proyectos reales y no sólo una
arquitectura vacía.

---

# Fase 4 - Estados y visibilidad

**Estado:** Completada.

## Objetivo

Hacer explícito si un proyecto está estable, en desarrollo o privado, sin
mezclar ese significado con las tecnologías de la tarjeta.

## Implementado

- estados independientes del resto de etiquetas;
- visibilidad independiente del resto de etiquetas;
- estilos visuales para cada combinación;
- soporte para proyectos públicos, privados, locales o de código privado con
  app pública.

## Impacto

El catálogo empezó a comunicar claramente la situación de cada proyecto y no
sólo su stack técnico.

---

# Fase 5 - Navegación avanzada

**Estado:** Completada.

## Objetivo

Mejorar la exploración del catálogo con búsqueda, filtros combinados y
ordenamiento, manteniendo una navegación simple para el uso diario.

## Implementado

- búsqueda simple siempre visible;
- panel de búsqueda avanzada opcional;
- filtros por estado, visibilidad y tecnología;
- orden recomendado, recientes, destacados y orden alfabético;
- opción para mostrar sólo proyectos destacados;
- persistencia de la vista en la URL;
- sección pública del roadmap del hub.

## Impacto

La portada se convirtió en un explorador funcional del catálogo sin perder la
simplicidad de uso.

---

# Fase 6 - Páginas individuales

**Estado:** Completada.

## Objetivo

Definir un patrón reutilizable para futuras páginas de proyecto con identidad
propia, metadata común y roadmap coherente.

## Implementado

- `data/project-pages.json` como fuente de contenido para páginas estándar;
- renderer compartido `projects/project-page.js`;
- estilos compartidos mediante `projects/project-page.css`;
- integración automática con `projects/project-roadmap.js`;
- shell HTML mínimo basado en `data-project-id`;
- Convertidor de Archivos migrado al patrón común;
- TecNet Finder migrado al patrón común;
- plantilla `projects/_template/`;
- script `scripts/new-project-page.mjs` para crear nuevas páginas;
- guía `docs/PROJECT-PAGE-STANDARD.md`;
- soporte explícito para mantener páginas personalizadas cuando el proyecto lo
  requiera;
- exportación y descarga de respaldos PDF para el roadmap del Hub y los
  roadmaps de AWS ORBISHOT, LabNotes, Convertidor de Archivos y TecNet Finder.

## Impacto

Agregar un proyecto estándar ya no requiere copiar y mantener una página HTML
completa. La estructura visual y el comportamiento viven en recursos
compartidos, mientras que cada proyecto conserva su contenido y roadmap.
---

# Fase 7 - Historial del portafolio

**Estado:** Visión futura.

## Objetivo

Registrar la evolución del portafolio como un sistema vivo, mostrando cómo ha
crecido el conjunto de proyectos con el tiempo.

## Posibles funciones

- historial de altas de proyectos;
- timeline de releases relevantes del portafolio;
- vista por etapas o temporadas de desarrollo;
- destacados por año o ciclo;
- conexiones entre proyectos relacionados.

## Impacto esperado

Convertir el hub no sólo en un catálogo, sino también en un registro narrativo
de evolución personal y técnica.

---

# Próximo paso

Evaluar la Fase 7:

**historial del portafolio y evolución temporal de los proyectos**.

La Fase 6 queda cerrada con un estándar reutilizable para páginas futuras.
