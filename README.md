# RobDev512.github.io

Portal central de proyectos personales de RobDev512.

Sitio:

https://robdev512.github.io/

## Propósito

Este repositorio funciona como el hub general de proyectos personales.

El portal puede representar proyectos públicos, privados, locales, desplegados, experimentales, terminados o todavía en desarrollo.

Nunca deben publicarse rutas locales, credenciales, secretos ni información privada.

## Clasificación

Los proyectos se clasifican principalmente por su tipo de producto o área de desarrollo, no por el lenguaje utilizado.

Categorías:

- Desarrollo Web
- Desarrollo de Aplicaciones de Escritorio
- Desarrollo de Aplicaciones Móviles
- Desarrollo de Videojuegos
- Automatización y Scripts
- Backend y Servicios
- Datos y Bases de Datos
- Sistemas y Experimentación
- Otros

## Arquitectura actual

La fuente central del catálogo es:

`data/projects.json`

La lógica de carga, validación, navegación, filtros y renderizado se encuentra en:

`js/hub.js`

`index.html` contiene la estructura general y la navegación visible por categorías.

Las categorías visibles se generan automáticamente según los proyectos registrados.

## Proyectos actuales

### AWS ORBISHOT

- Categoría: Desarrollo de Videojuegos
- Subtipo: Videojuego web
- Estado: Estable con roadmap activo
- Versión: v1.4.3.2
- Visibilidad: Público
- Página: https://robdev512.github.io/AWS-ORBISHOT/

### LabNotes

- Categoría: Desarrollo Web
- Subtipo: Aplicación web full-stack
- Estado: En desarrollo
- Release: v1.1.0-alpha.1 - Night Shift
- Visibilidad: Código privado / aplicación pública
- Página: https://robdev512.github.io/projects/labnotes/

### Convertidor de Archivos

- Categoría: Desarrollo de Aplicaciones de Escritorio
- Subtipo: Utilidad de conversión y procesamiento de archivos
- Estado: Estable
- Versión: v1.1.1
- Visibilidad: Público
- Página: https://robdev512.github.io/projects/convertidor-archivos/
- Repositorio: https://github.com/RobDev512/ConvertidorArchivos

### TecNet Finder

- Categoría: Sistemas y Experimentación
- Subtipo: DSL / compilador para análisis de redes
- Estado: En desarrollo
- Visibilidad: Privado
- Página: https://robdev512.github.io/projects/tecnet-finder/
- Código no publicado desde el hub

### AutoInputR

- Categoría: Desarrollo de Aplicaciones de Escritorio
- Subtipo: Herramienta de automatización visual de escritorio
- Estado: Estable con roadmap activo
- Versión: v1.3.0
- Visibilidad: Público
- Página: https://robdev512.github.io/projects/autoinputr/
- Repositorio: https://github.com/RobDev512/AutoInputR-Desktop

## Navegación del catálogo

El hub incluye:

- navegación por categorías;
- búsqueda por nombre, descripción, tecnologías y metadata;
- filtros por estado;
- filtros por visibilidad;
- filtros por tecnología;
- opción para mostrar sólo proyectos destacados;
- orden recomendado, por actividad reciente, destacados o nombre;
- combinación simultánea de filtros;
- URL compartible con el estado completo de la navegación;
- navegación Atrás / Adelante conservando filtros y orden.

## Inventario inicial

La Fase 3 revisó los proyectos personales existentes y separó:

- proyectos adecuados para el portafolio;
- prácticas pequeñas;
- variantes históricas;
- carpetas técnicas;
- proyectos que necesitan más información antes de publicarse.

El catálogo público no refleja directamente la estructura local de carpetas.


## Estados y visibilidad

Cada tarjeta muestra de forma separada:

- el estado actual del proyecto;
- la visibilidad del proyecto;
- un detalle adicional del estado cuando aporta información útil.

Los estados no se mezclan con las tecnologías.

La visibilidad tampoco implica el estado: un proyecto puede estar en
desarrollo y ser público, privado, local o tener código privado con una
aplicación pública.

## Documentación

- `docs/HUB-ARCHITECTURE.md`
- `docs/HUB-ROADMAP.md`

## Estado actual

Las Fases 1 a 5 del Hub están implementadas:

1. catálogo dinámico;
2. navegación por categorías;
3. inventario inicial y páginas de proyecto;
4. estado y visibilidad;
5. búsqueda, filtros combinados y ordenamiento.

Todos los proyectos registrados actualmente cuentan con una página de presentación o landing propia.

## Roadmaps por proyecto

Los proyectos con planificación propia pueden exponer un `ROADMAP.md` dentro
de su página de presentación.

Actualmente:

- `projects/convertidor-archivos/ROADMAP.md`
- `projects/tecnet-finder/ROADMAP.md`
- `projects/autoinputr/ROADMAP.md`

Las páginas HTML muestran un resumen visual del roadmap y el Markdown conserva
el detalle de versiones.

Los logos del Hub son copias de los recursos de marca oficiales de cada
proyecto y se almacenan en `assets/` para que el catálogo público no dependa
de repositorios privados.


## Búsqueda simple y avanzada

La búsqueda principal permanece siempre disponible junto con las categorías.

La búsqueda avanzada es opcional y se despliega mediante un botón. Al cerrarla,
los filtros avanzados se limpian y el catálogo vuelve a la navegación simple,
conservando únicamente la búsqueda de texto y la categoría activa.

## Roadmap público del Hub

La página principal incluye una sección de roadmap que se carga desde
`docs/HUB-ROADMAP.md`.

Esto permite mostrar temporalmente la evolución del propio Hub sin duplicar
manualmente el estado de sus fases en `index.html`.


## Visualización del roadmap

La portada del hub incluye una sección de roadmap más expresiva:

- tarjetas con resumen;
- detalle expandible por fase;
- vista tipo árbol vertical;
- vista tipo árbol horizontal;
- carga directa desde `docs/HUB-ROADMAP.md`.

Esto permite usar el roadmap como referencia rápida sin perder el documento
Markdown como fuente principal.


## Roadmap del Hub en modo timeline

La portada ahora ofrece dos visualizaciones para el roadmap del Hub:

- tarjetas;
- línea de tiempo interactiva en canvas.

La línea de tiempo permite recorrer fases, seleccionar nodos y consultar el
detalle de cada etapa sin abandonar la portada.


## Estándar de páginas individuales

La Fase 6 establece un sistema reutilizable para páginas de proyecto.

Los proyectos estándar usan:

- `data/project-pages.json`;
- `projects/project-page.js`;
- `projects/project-page.css`;
- `projects/project-roadmap.js`;
- un `index.html` mínimo por proyecto.

Convertidor de Archivos, TecNet Finder y AutoInputR ya utilizan este patrón.

AWS ORBISHOT y LabNotes conservan páginas personalizadas porque su identidad
visual y estructura justifican una presentación propia.

Para crear una página nueva:

`node scripts/new-project-page.mjs <project-id>`

Guía:

`docs/PROJECT-PAGE-STANDARD.md`


## Motion polish

Antes de cerrar la Fase 6 se añadió una capa visual de interacción:

- iluminación al hacer hover sobre botones;
- respuesta visual al presionar controles;
- elevación sutil de tarjetas;
- glow reactivo a la posición del cursor;
- aparición progresiva al hacer scroll;
- movimiento sutil de logos;
- soporte de `prefers-reduced-motion` para accesibilidad.

El objetivo es dar más vida al Hub sin convertir las animaciones en una
distracción.


## Roadmaps unificados

Convertidor de Archivos, TecNet Finder y AutoInputR usan ahora el mismo patrón visual de
roadmap empleado como referencia por AWS ORBISHOT y LabNotes: grid de tarjetas,
estado superior, acción de detalle y panel expandido.

La semántica de los estados continúa siendo propia de cada proyecto; lo que se
unifica es la experiencia visual y de interacción.


## Portal visual común de proyectos

La Fase 6 unifica también la composición completa de las páginas estándar.

Convertidor de Archivos, TecNet Finder y AutoInputR usan ahora el mismo lenguaje estructural
de AWS ORBISHOT:

- header del proyecto;
- hero editorial con visual orbital;
- franja de cuatro funciones;
- release actual;
- roadmap dinámico;
- siguiente release;
- footer.

La identidad de cada proyecto se conserva mediante su logo, color de acento y
contenido.


## Respaldo PDF de roadmaps

Los roadmaps pueden descargarse como PDF directamente desde el Hub.

El sistema usa `js/roadmap-pdf.js`, un exportador local sin dependencias
externas. Convierte el contenido fuente a un documento A4 paginado y descarga
un archivo con fecha.

Fuentes actuales:

- Hub: `docs/HUB-ROADMAP.md`;
- AWS ORBISHOT: `AWS-Game/docs/ROADMAP.md` del repositorio público;
- LabNotes: `projects/labnotes/ROADMAP.md`;
- Convertidor de Archivos: `projects/convertidor-archivos/ROADMAP.md`;
- TecNet Finder: `projects/tecnet-finder/ROADMAP.md`;
- AutoInputR: `projects/autoinputr/ROADMAP.md`;

El PDF es un respaldo documental; el Markdown o los datos del roadmap continúan
siendo la fuente de verdad.


### Cómo funciona la exportación PDF diseñada

La exportación de roadmaps ya no genera un PDF plano de texto.

Ahora el Hub construye una **vista de impresión diseñada**, con portada, resumen,
estadísticas, tarjetas por versión, estados y bloques de contenido. Después abre
el diálogo de impresión del navegador para guardar el resultado como PDF.

Flujo esperado:

1. pulsar `Roadmap PDF` o `Exportar PDF`;
2. se prepara una vista de impresión estilizada;
3. el navegador abre el diálogo de impresión;
4. elegir **Guardar como PDF**.

De esta manera se conserva el diseño visual del documento exportado.


### Exportación PDF visual directa

La exportación final vuelve a ser una **descarga directa `.pdf`**, pero conserva
un diseño propio en lugar del formato textual inicial.

Cada respaldo incluye:

- portada oscura con identidad de color por proyecto;
- estadísticas generales;
- metadatos de la exportación;
- una página diseñada por fase o versión;
- badges de versión y estado;
- tarjetas para objetivos, funciones y listas del roadmap;
- numeración y pie de página.

No usa el diálogo de impresión del navegador.


### Maquetación compacta del PDF

El respaldo PDF usa ahora una composición híbrida:

- portada;
- tarjetas de dos columnas para versiones/fases cortas;
- páginas completas sólo para versiones extensas;
- continuidad automática cuando una versión supera una página.

Esto reduce páginas casi vacías y conserva más la sensación de un roadmap
visual, sin sacrificar el contenido completo.


### Maquetación adaptativa del PDF

El exportador PDF usa una cuadrícula adaptativa:

- tres columnas para versiones realmente breves;
- dos columnas para tarjetas medianas;
- ancho completo para versiones densas;
- páginas de detalle para versiones muy largas.

La altura de cada tarjeta se calcula a partir del contenido antes de dibujarla.
Los badges largos reducen tipografía o cambian de fila para no desbordarse.


### Maquetación masonry segura

El PDF usa una cuadrícula de dos columnas tipo masonry para aprovechar mejor el
alto disponible de cada página.

- las tarjetas cortas ocupan la columna con más espacio libre;
- las tarjetas medianas conservan dos columnas;
- una versión densa puede usar el ancho completo;
- una versión muy extensa pasa a páginas de detalle;
- la altura se calcula antes de dibujar para evitar desbordes.

Los badges de estado largos también ajustan tamaño o cambian de fila.


### Empaque final del PDF

La maquetación final combina masonry de dos columnas con tarjetas de ancho
completo cuando eso aprovecha mejor el espacio. El exportador calcula la altura
real antes de dibujar y evita badges o texto fuera de sus contenedores.

## Historial del portafolio

La Fase 7 añade una memoria cronológica independiente del catálogo y del
roadmap.

Fuente:

`data/history.json`

Renderer:

`js/history.js`

La portada ofrece filtros por proyecto, tipo de evento, año, mes, día y hora,
además de una agrupación configurable por año, mes, día u hora. Los eventos que
conservan un timestamp verificable muestran su hora local; cuando sólo existe
fecha, el Hub mantiene precisión de día y no inventa una hora.

La vista alternativa resume por periodo usando la granularidad elegida. El
historial registra hechos ya ocurridos; `docs/HUB-ROADMAP.md` continúa
representando la planificación.

## Identidad visual del Hub

La Fase 7.1 introduce una identidad visual propia para el Hub.

Recursos principales:

- `assets/branding/robdev512-hub-logo.png`: logo horizontal de portada;
- `assets/branding/robdev512-hub-icon.png`: icono cuadrado maestro;
- `assets/branding/robdev512-hub-lockup.png`: lockup compacto;
- `assets/icons/hub-icons.svg`: sprite SVG compartido de interfaz.

El icono maestro se utiliza para generar favicons y tamaños de navegador. El
sprite SVG evita repetir archivos de iconos individuales y mantiene una
apariencia consistente entre catálogo, historial, roadmap y navegación.

El banner principal utiliza elementos vectoriales decorativos propios de la
interfaz —líneas, nodos y circuitos— sin convertirlos en información semántica.

## Destacados, documentación y visitas

La Fase 7.1 amplía la identidad del Hub con:

- una sección dinámica de proyectos destacados basada en `featured`;
- un centro visual de documentación disponible en `/docs/`;
- un contador global de visitas integrado con GoatCounter.

El contador se configura en `data/site-config.json` y actualmente utiliza el sitio
`robdev512.goatcounter.com`. Las vistas locales no se registran; el conteo público
se alimenta desde la versión publicada del Hub.

## Favoritos personales

Cada visitante puede marcar proyectos como favoritos. La selección se guarda
localmente en el navegador y no modifica `data/projects.json`.

Esto mantiene separados dos conceptos:

- **destacados**: selección editorial definida por `featured`;
- **favoritos**: selección personal guardada en `localStorage`.

La búsqueda avanzada permite mostrar únicamente los favoritos del navegador
actual.
