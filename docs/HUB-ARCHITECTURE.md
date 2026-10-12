# Arquitectura del Hub de Proyectos

## 1. Objetivo

`robdev512.github.io` funciona como el portal central de proyectos personales de RobDev512.

El hub representa proyectos por lo que son, no por la carpeta local donde se encuentran ni por el lenguaje principal.

## 2. Modelo de clasificación

Cada proyecto se describe mediante:

- categoría;
- subtipo;
- descripción;
- tecnologías;
- estado;
- visibilidad;
- versión, cuando aplica;
- enlaces públicos, cuando existen.

Las tecnologías son metadata secundaria.

## 3. Categorías

### Desarrollo Web

Aplicaciones web, sitios, plataformas, dashboards, portales, PWAs y sistemas full-stack.

Ejemplo: LabNotes.

### Desarrollo de Aplicaciones de Escritorio

Aplicaciones nativas, utilidades y herramientas locales con interfaz de escritorio.

Ejemplo: Convertidor de Archivos.

### Desarrollo de Aplicaciones Móviles

Aplicaciones Android, iOS o multiplataforma orientadas principalmente a teléfonos o tablets.

### Desarrollo de Videojuegos

Videojuegos web, de escritorio, móviles y prototipos jugables.

Ejemplo: AWS ORBISHOT.

### Automatización y Scripts

Scripts y herramientas cuyo objetivo principal es automatizar tareas o procesamiento repetitivo.

### Backend y Servicios

APIs, servicios web, microservicios e integraciones cuyo producto principal es el backend.

### Datos y Bases de Datos

Procesamiento, análisis, ETL, herramientas SQL/NoSQL y proyectos cuyo producto principal gira alrededor de datos.

### Sistemas y Experimentación

Compiladores, DSLs, redes, bajo nivel, concurrencia, rendimiento, herramientas de consola y experimentos técnicos.

Ejemplo: TecNet Finder.

### Otros

Categoría temporal para proyectos todavía no clasificables de forma más específica.

## 4. Estados

- En desarrollo
- Estable
- Experimental
- Pausado
- Terminado
- Archivado

## 5. Visibilidad

- Público
- Código privado / aplicación pública
- Privado
- Local

La visibilidad no determina el estado del proyecto.

## 6. Catálogo central

La fuente de verdad es:

`data/projects.json`

La lógica se encuentra en:

`js/hub.js`

El HTML no contiene manualmente la información individual de cada proyecto.

## 7. Navegación

La navegación visible por categoría se genera desde la taxonomía y el contenido real del catálogo.

Reglas:

- siempre existe Todos;
- sólo aparecen categorías con al menos un proyecto;
- cada categoría muestra su cantidad;
- `?category=<id>` representa la categoría activa;
- Atrás y Adelante restauran la selección;
- nuevas categorías aparecen automáticamente al recibir su primer proyecto.

## 8. Inventario y publicación

La estructura local de carpetas no se replica públicamente.

Durante el inventario se distinguen:

- proyectos de portafolio;
- proyectos pequeños o de práctica;
- variantes históricas;
- carpetas técnicas;
- proyectos pendientes de documentación.

Un proyecto privado o local puede tener presencia en el hub sin publicar su código.

Nunca deben publicarse:

- rutas locales;
- credenciales;
- secretos;
- contraseñas;
- datos privados;
- archivos internos sensibles.

## 9. Proyectos registrados

### AWS ORBISHOT

- Desarrollo de Videojuegos
- Videojuego web
- Estable
- Público

### LabNotes

- Desarrollo Web
- Aplicación web full-stack
- En desarrollo
- Código privado / aplicación pública

### Convertidor de Archivos

- Desarrollo de Aplicaciones de Escritorio
- Utilidad de conversión y procesamiento de archivos
- Estable
- Público

### TecNet Finder

- Sistemas y Experimentación
- DSL / compilador para análisis de redes
- En desarrollo
- Privado

## 10. Principio del hub

La navegación debe responder primero:

**¿Qué tipo de proyecto es?**

y después:

**¿Con qué tecnologías está construido?**

El objetivo es mantener un portafolio e historial técnico coherente aunque los proyectos vivan en repositorios, despliegues o ubicaciones diferentes.

## 11. Páginas individuales actuales

Todos los proyectos del catálogo actual disponen de una presentación propia:

- AWS ORBISHOT: landing independiente del proyecto.
- LabNotes: `/projects/labnotes/`.
- Convertidor de Archivos: `/projects/convertidor-archivos/`.
- TecNet Finder: `/projects/tecnet-finder/`.

Las páginas de proyectos privados pueden describir el producto sin exponer el repositorio ni código interno.

Las páginas nuevas comparten estilos base mediante:

`projects/project-page.css`

## 12. Identidad visual y roadmaps

Cuando un proyecto dispone de logo propio, el Hub utiliza una copia pública
del recurso de marca dentro de `assets/`.

Las páginas de proyecto pueden incluir un resumen visual de su roadmap y un
archivo `ROADMAP.md` independiente.

Esto permite que un proyecto con repositorio privado, como TecNet Finder,
muestre públicamente su identidad y planificación sin exponer su código.

## 13. Presentación de estado y visibilidad

El catálogo mantiene `status` y `visibility` como dimensiones independientes.

Las tarjetas muestran ambos valores mediante indicadores visuales separados:

- Estado: En desarrollo, Estable, Experimental, Pausado, Terminado o Archivado.
- Visibilidad: Público, Código privado / aplicación pública, Privado o Local.

`statusDetail` puede añadir contexto sin sustituir el estado normalizado.

Las tecnologías permanecen en `card.badges` y no deben duplicar el estado o la
visibilidad. Los atributos `data-status` y `data-visibility` se conservan en
cada tarjeta para habilitar filtros visibles en una fase posterior.


## 14. Navegación avanzada

La Fase 5 convierte los filtros internos del catálogo en controles visibles.

El estado de navegación puede combinar:

- categoría;
- estado;
- visibilidad;
- tecnología;
- texto de búsqueda;
- sólo destacados;
- ordenamiento.

La URL conserva el estado mediante parámetros:

- `category`
- `status`
- `visibility`
- `tech`
- `q`
- `featured`
- `sort`

Atrás y Adelante restauran la vista completa.

### Búsqueda

La búsqueda se normaliza sin distinguir mayúsculas ni acentos y consulta:

- nombre;
- subtipo;
- descripción;
- versión;
- codename;
- detalle de estado;
- categoría;
- estado;
- visibilidad;
- tecnologías;
- badges de la tarjeta.

### Ordenamiento

El catálogo admite:

- orden recomendado (`displayOrder`);
- más recientes (`updatedAt`);
- destacados primero (`featured`);
- nombre A–Z;
- nombre Z–A.

`updatedAt` representa la actividad más reciente conocida del repositorio del
proyecto y permite ordenar sin depender del orden manual del catálogo.


## 15. Búsqueda simple y avanzada

La navegación tiene dos niveles:

### Modo normal

Siempre visible:

- búsqueda de texto;
- categorías.

### Modo avanzado

Se activa explícitamente mediante el botón `Búsqueda avanzada` e incluye:

- estado;
- visibilidad;
- tecnología;
- ordenamiento;
- sólo destacados.

Al cerrar el modo avanzado se eliminan sus filtros y se conserva la navegación
simple.

Si una URL contiene parámetros avanzados válidos, el panel se abre
automáticamente para hacer visible el estado que está afectando al catálogo.

## 16. Roadmap público

La portada puede presentar el roadmap del propio Hub como una sección
independiente.

La interfaz no duplica la planificación: obtiene las fases directamente de
`docs/HUB-ROADMAP.md`, mostrando número de fase, título, estado y un resumen.

La sección puede retirarse posteriormente sin modificar el archivo Markdown
ni la arquitectura del catálogo.


## 17. Roadmap enriquecido

La sección pública del roadmap del Hub ya no se limita a tarjetas mínimas.

Ahora soporta:

- resumen visible por fase;
- lista corta de highlights;
- panel `Ver detalle`;
- vista en tarjetas;
- vista en árbol vertical;
- vista en árbol horizontal.

La fuente sigue siendo `docs/HUB-ROADMAP.md`, por lo que la portada sólo actúa
como una visualización derivada del documento real.


## 18. Roadmap timeline en canvas

El roadmap público del Hub soporta una visualización tipo línea de tiempo
renderizada con `<canvas>`.

Características:

- nodos por fase;
- línea base cronológica;
- selección interactiva mediante clic;
- panel de detalle desacoplado;
- coexistencia con una vista alternativa en tarjetas.

Esto permite una representación más visual sin abandonar el documento fuente
`docs/HUB-ROADMAP.md`.


## 19. Estándar reutilizable de páginas

La Fase 6 separa el contenido largo de una página estándar de su HTML.

### Fuente de contenido

`data/project-pages.json`

### Renderer

`projects/project-page.js`

### Estilos

`projects/project-page.css`

### Roadmap

`projects/project-roadmap.js`

### Shell

Cada página estándar sólo necesita declarar:

`data-project-id="<id>"`

El renderer busca ese ID en `data/project-pages.json` y construye la página.

### Excepciones deliberadas

AWS ORBISHOT y LabNotes continúan como páginas personalizadas. El estándar no
pretende eliminar identidades especiales; pretende evitar duplicación en los
proyectos que sí pueden compartir una estructura común.

### Scaffold

`scripts/new-project-page.mjs` crea la carpeta inicial de un proyecto nuevo a
partir de `projects/_template/`.


## 20. Exportación PDF de roadmaps

`js/roadmap-pdf.js` genera PDFs A4 directamente en el navegador sin bibliotecas
externas.

El catálogo puede declarar `roadmapExport` por proyecto. La configuración
define la fuente, título y nombre del archivo.

Tipos soportados:

- `markdown`: descarga y convierte un `ROADMAP.md`;
- `script-array`: extrae un arreglo estático de roadmap desde un script propio.

Esto permite respaldar roadmaps incluso cuando un proyecto, como LabNotes,
mantiene su información de roadmap en JavaScript.

Los nombres de archivo incluyen automáticamente la fecha de exportación.


### Ajuste de exportación PDF diseñada

La exportación PDF evolucionó de una generación textual simple a una
**renderización HTML de impresión**.

`js/roadmap-pdf.js` ahora:

- interpreta el roadmap fuente;
- construye una composición visual para impresión;
- la renderiza en un `iframe` oculto;
- lanza `window.print()` para que el usuario guarde el resultado como PDF.

Esto permite mantener portada, bloques, tarjetas, estados y jerarquía visual
sin introducir librerías externas.


### Exportador PDF visual directo

La implementación definitiva de `js/roadmap-pdf.js` genera el archivo PDF en el
navegador y lo descarga mediante `Blob` + `URL.createObjectURL`.

El documento se dibuja como PDF vectorial con:

- fondos y paneles;
- colores de identidad por proyecto;
- badges de estado;
- tarjetas de contenido;
- portada y estadísticas;
- paginación.

Esto evita depender del cuadro de impresión y mantiene una apariencia
consistente en el archivo descargado.

## 21. Historial del portafolio

La Fase 7 introduce una fuente independiente para hechos históricos:

`data/history.json`

El renderer vive en:

`js/history.js`

### Separación de responsabilidades

- `data/projects.json`: estado actual del catálogo.
- `data/project-pages.json`: contenido de páginas estándar.
- `data/history.json`: hechos que ya ocurrieron.
- `docs/HUB-ROADMAP.md`: planificación del propio Hub.

El historial no debe deducirse automáticamente a partir de `updatedAt` ni de un
roadmap. Un evento sólo se registra cuando existe una fecha y descripción
suficientemente confiables.

### Modelo de evento

Cada evento puede declarar:

- `id`;
- `date` como fecha de respaldo y compatibilidad;
- `occurredAt` opcional con timestamp ISO-8601 cuando la hora es verificable;
- `precision` (`day` o `time`) para no inventar granularidad inexistente;
- `sequence` para desempatar u ordenar hitos relacionados;
- `type`;
- `projectId`;
- `title`;
- `summary`;
- `version`, cuando aplica;
- `featured`;
- `links`.

### Tipos iniciales

- `hub-phase`: cierre o avance de una fase del Hub.
- `release`: release verificable de un proyecto.
- `milestone`: hito relevante que no corresponde necesariamente a un release.

### Navegación

La vista pública admite:

- filtro por proyecto;
- filtro por tipo;
- filtro por año;
- filtro por mes;
- filtro por día;
- filtro por hora cuando existen timestamps exactos;
- agrupación por año, mes, día u hora;
- vista Cronología;
- vista Por periodo.

Los filtros utilizan parámetros `hProject`, `hType`, `hYear`, `hMonth`, `hDay`,
`hHour`, `hGroup` y `hView`, que coexisten con los parámetros del catálogo sin
reemplazarlos.

Los timestamps exactos se almacenan en UTC y se presentan usando la zona horaria
local del navegador. Los eventos sin `occurredAt` se muestran con precisión de
día y quedan fuera de un filtro de hora específico.

### Principio de integridad histórica

El historial es curado. La automatización futura podrá sugerir eventos a partir
de tags, releases o commits, pero la publicación seguirá requiriendo datos
públicos y verificables.
