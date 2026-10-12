# Estándar de páginas individuales del Hub

## Objetivo

Las páginas individuales del Hub deben poder crearse sin duplicar decenas de
líneas de HTML por proyecto.

La Fase 6 establece un patrón común para proyectos que no necesitan una landing
completamente personalizada.

## Componentes

### `data/project-pages.json`

Fuente de verdad para el contenido largo de las páginas estándar.

Contiene:

- identidad visual;
- título y descripción;
- metadata del hero;
- botones;
- secciones;
- tecnologías;
- footer.

### `projects/project-page.js`

Renderer compartido.

Carga la configuración según `data-project-id` y construye:

- topbar;
- hero;
- metadata;
- botones;
- contenido;
- funciones;
- fases;
- roadmap;
- tecnologías;
- footer.

### `projects/project-roadmap.js`

Motor compartido para `ROADMAP.md`.

La página estándar lo carga automáticamente cuando existe una sección de tipo
`roadmap`.

### `projects/project-page.css`

Estilos compartidos de las páginas estándar.

### `projects/_template/`

Plantilla mínima para futuros proyectos.

## Tipos de página

El Hub puede convivir con dos modelos:

### Página estándar

Adecuada para la mayoría de proyectos.

Ejemplos actuales:

- Convertidor de Archivos;
- TecNet Finder.

### Página personalizada

Adecuada cuando el proyecto ya tiene una identidad o experiencia propia que no
conviene reducir al template común.

Ejemplos actuales:

- AWS ORBISHOT;
- LabNotes.

No es necesario migrar una landing personalizada al renderer estándar si eso
empeora su identidad.

## Crear una página nueva

Desde la raíz de `RobDev512.github.io`:

    node scripts/new-project-page.mjs mi-proyecto

El script crea:

    projects/mi-proyecto/
    ├── index.html
    └── ROADMAP.md

Después se debe:

1. agregar el proyecto a `data/projects.json`;
2. agregar su configuración a `data/project-pages.json`;
3. copiar su logo a `assets/`;
4. actualizar el `ROADMAP.md`;
5. probar la página desde un servidor HTTP local.

## Secciones soportadas

### `intro`

Texto principal y código opcional.

### `features`

Grid de tarjetas con funciones o áreas.

### `phases`

Lista de etapas completadas o pendientes.

### `roadmap`

Roadmap interactivo leído desde `ROADMAP.md`.

### `technologies`

Lista de tecnologías.

## Regla de diseño

La página debe responder, en este orden:

1. qué es el proyecto;
2. qué hace;
3. en qué estado está;
4. qué puede hacer;
5. hacia dónde va;
6. con qué tecnologías está construido.

## Privacidad

Una página puede representar un proyecto privado sin publicar código,
credenciales, rutas locales o datos sensibles.

Los enlaces privados sólo deben incluirse cuando forman parte deliberada de la
experiencia del propietario.


## Roadmap visual unificado

Las páginas estándar utilizan el mismo patrón visual base que las presentaciones
de AWS ORBISHOT y LabNotes:

- tarjetas de tres columnas en escritorio;
- versión en la esquina superior izquierda;
- estado en pill en la esquina superior derecha;
- título y resumen en el cuerpo;
- acción `Ver detalle →`;
- panel expandido debajo del grid;
- filtros en pills;
- responsive a dos columnas y después una;
- animaciones de entrada y hover.

Los nombres de los estados pueden variar entre proyectos porque representan
ciclos de desarrollo distintos, pero la estructura visual se mantiene común.


## Portal visual unificado

Las páginas estándar ya no usan una composición distinta del resto del
portafolio. El renderer compartido sigue el mismo lenguaje visual del portal de
AWS ORBISHOT:

1. header con marca RobDev512 y navegación;
2. hero de dos columnas con texto a la izquierda y visual orbital a la derecha;
3. franja de cuatro características;
4. bloque de versión actual;
5. tarjeta de release;
6. roadmap dinámico;
7. bloque de siguiente versión;
8. footer.

El color de acento cambia por proyecto, pero la composición y jerarquía visual
permanecen iguales.

Los proyectos con identidad muy especializada pueden conservar contenido propio,
pero una página estándar debe respetar este patrón.
