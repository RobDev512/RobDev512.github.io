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
- sección pública del roadmap del propio hub;
- historial cronológico del portafolio con fuente independiente.

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

**Estado:** Completada.

## Objetivo

Registrar la evolución del portafolio como un sistema vivo y separar con
claridad tres conceptos:

- catálogo: qué proyectos existen y cuál es su estado actual;
- historial: qué hitos y releases ya ocurrieron;
- roadmap: qué está planeado para después.

## Alcance de la fase

- `data/history.json` como fuente central del historial;
- `js/history.js` como renderer independiente del catálogo;
- cronología visual de releases, hitos y fases del Hub;
- filtros por proyecto, tipo de evento, año, mes, día y hora;
- agrupación temporal configurable por año, mes, día u hora;
- horas exactas cuando la fuente pública conserva un timestamp verificable;
- eventos con precisión de día cuando no existe una hora confiable, sin inventarla;
- estado de filtros compartible mediante URL;
- vista cronológica y resumen por periodo;
- identidad visual por proyecto;
- panel de detalle y enlaces a proyectos, releases o documentación;
- datos históricos curados: nada se infiere automáticamente sin una fuente
  confiable.

## Primer inventario histórico

La primera versión del historial registra:

- releases verificadas de Convertidor de Archivos;
- releases verificadas de TecNet Finder;
- release estable v1.4.3.2 de AWS ORBISHOT;
- cierre de las Fases 1 a 6 del Hub;
- inicio de la Fase 7.

LabNotes podrá incorporar eventos adicionales cuando exista una fecha histórica
confiable para cada hito que se quiera representar.

## Impacto esperado

El Hub deja de mostrar únicamente el estado presente y empieza a conservar una
memoria técnica navegable de cómo evolucionaron los proyectos.

---

# Fase 7.1 - Identidad visual e iconografía SVG

**Estado:** Completada.

## Objetivo

Cerrar el ciclo visual posterior al historial con una identidad propia para el
Hub y un sistema de iconografía reutilizable que pueda crecer con las fases
futuras.

## Alcance

- logo principal, icono cuadrado y lockup del Hub;
- favicon y tamaños derivados para navegador y dispositivos;
- banner tecnológico de portada con líneas, nodos y circuitos decorativos;
- navegación superior con identidad del Hub;
- sprite SVG reutilizable para controles e interacciones;
- iconos SVG en navegación, catálogo, filtros, tarjetas, historial y roadmap;
- soporte responsive y `prefers-reduced-motion`;
- sección dinámica de proyectos destacados alimentada por `projects.json`;
- centro de documentación dinámica en una pestaña independiente;
- descarga opcional del Markdown original desde el centro de documentación;
- integración real de visitas mediante GoatCounter;
- contador público de visitas totales y del día;
- favoritos personales persistentes por navegador mediante `localStorage`;
- filtro avanzado de favoritos y acceso rápido desde el banner;
- documentación del sistema visual dentro de la arquitectura del Hub.

## Regla

Los SVG son parte de la interfaz y deben mantener significado funcional. La
decoración puramente visual permanece marcada como `aria-hidden` para no añadir
ruido a lectores de pantalla.

## Impacto esperado

Consolidar al Hub como un producto con identidad propia y no únicamente como un
contenedor de tarjetas de otros proyectos.

---

# Fase 8 - Centro de releases y actividad

**Estado:** Planeada.

## Objetivo

Reunir en una vista específica las versiones actuales y releases relevantes de
todos los proyectos sin sustituir sus repositorios.

## Posibles funciones

- feed de releases recientes;
- versión estable / versión en desarrollo por proyecto;
- acceso directo a descarga, notas y changelog cuando existan;
- distinción entre release estable, pre-release y parche;
- actividad reciente sin convertir el Hub en un clon de GitHub.

## Impacto esperado

Responder rápidamente: **¿qué cambió recientemente en mis proyectos?**

---

# Fase 9 - Mapa del ecosistema de proyectos

**Estado:** Visión futura.

## Objetivo

Mostrar relaciones reales entre proyectos sin alterar la clasificación principal
por tipo de producto.

## Posibles funciones

- relaciones entre proyectos por tecnologías compartidas;
- proyectos que nacieron de una materia, práctica o proyecto previo;
- dependencias o reutilización de componentes cuando sean relevantes;
- vista tipo grafo opcional;
- enlaces entre proyectos relacionados desde sus páginas individuales.

## Regla

Una relación sólo se registra cuando tiene sentido técnico o histórico; no se
crean conexiones únicamente porque dos proyectos usen el mismo lenguaje.

---

# Fase 10 - Métricas e insights del portafolio

**Estado:** Visión futura.

## Objetivo

Generar estadísticas derivadas de los datos que el Hub ya mantiene.

## Posibles funciones

- proyectos por categoría, estado y visibilidad;
- tecnologías más utilizadas;
- releases por año;
- evolución del número de proyectos;
- distribución entre proyectos públicos, privados y locales;
- hitos destacados por año;
- métricas técnicas y descriptivas, evitando rankings de productividad sin
  contexto.

## Impacto esperado

Convertir datos del catálogo e historial en una lectura resumida de la evolución
técnica del portafolio.

---

# Fase 11 - Automatización y calidad del Hub

**Estado:** Visión futura.

## Objetivo

Reducir mantenimiento manual sin perder el control curado sobre la información
pública.

## Posibles funciones

- validación automática de `projects.json`, `project-pages.json` e
  `history.json`;
- comprobación de enlaces públicos;
- detección de IDs duplicados o referencias rotas;
- GitHub Actions para validar PRs del Hub;
- herramienta para sugerir nuevas entradas históricas a partir de releases;
- actualización asistida de `updatedAt`;
- generación de snapshots de datos antes de cambios estructurales.

## Regla

La automatización puede **proponer** información, pero no debe publicar datos
privados ni inventar hechos históricos.

---

# Fase 12 - Archivo y snapshots del portafolio

**Estado:** Visión futura.

## Objetivo

Conservar estados históricos completos del Hub para que el portafolio pueda
reconstruirse aun cuando proyectos individuales cambien o desaparezcan.

## Posibles funciones

- snapshot anual del catálogo;
- exportación JSON / Markdown de metadata pública;
- paquete de respaldo del historial;
- página de archivo por año;
- comparación entre dos snapshots;
- preservación de versiones públicas importantes del propio Hub.

## Impacto esperado

Convertir el Hub en un archivo personal durable, no sólo en una página de
presentación actual.

---

# Fase 13 - Casos de estudio y presentación profesional

**Estado:** Visión futura.

## Objetivo

Permitir que los proyectos más importantes expliquen decisiones, arquitectura y
aprendizajes sin convertir todas las páginas en reportes extensos.

## Posibles funciones

- casos de estudio opcionales por proyecto;
- problema, solución, arquitectura y decisiones clave;
- galería de evolución visual;
- retos técnicos y aprendizajes;
- vínculos desde historial y releases hacia un caso de estudio;
- modo de presentación pública más enfocado a portafolio profesional.

---

# Fase 14 - Ingeniería y documentación funcional del Hub

**Estado:** Visión futura.

## Objetivo

Documentar el Hub como sistema de software, tomando como referencia prácticas de
ingeniería utilizadas en proyectos académicos como FISW, pero adaptadas a un
proyecto personal para evitar documentación artificial o innecesaria.

## Documentación prevista

- actores y alcance del sistema;
- catálogo formal de casos de uso;
- diagrama de casos de uso;
- flujos principal, alternos y excepciones de los casos importantes;
- requisitos funcionales y no funcionales;
- reglas de negocio y restricciones;
- diagramas de actividad o BPMN cuando el proceso lo justifique;
- componentes, responsabilidades e interfaces internas;
- matriz ligera de trazabilidad entre requisito, caso de uso y componente;
- criterios de calidad, pruebas y mantenimiento;
- historial de decisiones arquitectónicas relevantes.

## Regla

La documentación debe describir comportamiento real del Hub. No se crearán
diagramas, requisitos o procesos únicamente para llenar una plantilla.

## Impacto esperado

Hacer que el Hub pueda entenderse, mantenerse y evaluarse como un sistema
completo, además de funcionar como portafolio público.

---

# Próximo paso

Implementar la Fase 8:

**centro de releases y actividad reciente del portafolio**.

Las fases 9 a 14 quedan registradas como posibilidades futuras. Su prioridad
puede cambiar según crezcan los proyectos y las necesidades reales del Hub.
