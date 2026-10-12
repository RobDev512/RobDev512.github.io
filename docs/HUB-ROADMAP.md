# Roadmap del Hub de Proyectos

## Estado actual

El hub ya cuenta con:

- GitHub Pages;
- dominio robdev512.github.io;
- AWS ORBISHOT;
- página individual de AWS ORBISHOT;
- LabNotes;
- página individual de LabNotes;
- catálogo dinámico;
- fuente central data/projects.json;
- renderizado mediante js/hub.js;
- taxonomía inicial de categorías, estados y visibilidades;
- navegación visible por categoría;
- contadores por categoría;
- URL compartible de categoría;
- soporte interno para filtros combinados por categoría, estado, tecnología y visibilidad.

---

# Fase 1 - Catálogo dinámico

**Estado:** Completada.

## Objetivo

Transformar el hub en un catálogo centralizado y eliminar la información individual de proyectos de index.html.

## Implementado

- [x] Crear data/projects.json.
- [x] Crear js/hub.js.
- [x] Extraer la información individual de proyectos de index.html.
- [x] Generar las tarjetas mediante JavaScript.
- [x] Mantener el diseño destacado de AWS ORBISHOT.
- [x] Mantener el diseño específico de LabNotes.
- [x] Mantener las páginas individuales.
- [x] Mantener los enlaces actuales.
- [x] Validar la estructura del catálogo.
- [x] Preparar filtros internos por categoría.
- [x] Preparar filtros internos por estado.
- [x] Preparar filtros internos por tecnología.
- [x] Añadir estado de error si projects.json no puede cargarse.

## Primeros proyectos

- AWS ORBISHOT.
- LabNotes.

---

# Fase 2 - Categorías y navegación del catálogo

**Estado:** Completada.

## Objetivo

Permitir explorar el catálogo por tipo de proyecto sin clasificarlo principalmente por lenguaje.

## Categorías iniciales

- Desarrollo Web.
- Desarrollo de Aplicaciones de Escritorio.
- Desarrollo de Aplicaciones Móviles.
- Desarrollo de Videojuegos.
- Automatización y Scripts.
- Backend y Servicios.
- Datos y Bases de Datos.
- Sistemas y Experimentación.
- Otros.

## Implementado

- [x] Mostrar navegación visible por categoría.
- [x] Añadir opción Todos.
- [x] Generar los filtros desde la taxonomía de projects.json.
- [x] Mostrar únicamente categorías que contienen proyectos.
- [x] Añadir contador de proyectos por categoría.
- [x] Conectar los controles con HubCatalog.setFilters().
- [x] Mantener tecnologías como etiquetas secundarias.
- [x] Preparar filtros combinados posteriores.
- [x] Preparar filtro interno de visibilidad.
- [x] Mantener el diseño responsive.
- [x] Añadir estado activo accesible con aria-pressed.
- [x] Añadir resumen dinámico de resultados.
- [x] Sincronizar la categoría activa con ?category=<id>.
- [x] Soportar navegación Atrás / Adelante del navegador.
- [x] Hacer que nuevas categorías aparezcan automáticamente al recibir su primer proyecto.

---

# Fase 3 - Inventario de proyectos existentes

**Estado:** Siguiente objetivo.

## Objetivo

Revisar los proyectos personales existentes y registrarlos dentro del catálogo.

## Fuentes locales iniciales

- Proyectos HTML.
- Proyectos Python.
- Proyectos C++.
- Proyectos GOlang.
- futuros proyectos móviles;
- otras carpetas personales.

## Datos a identificar

Para cada proyecto:

- nombre;
- categoría;
- subtipo;
- descripción;
- tecnologías;
- estado;
- visibilidad;
- versión;
- logo;
- disponibilidad pública;
- repositorio si existe.

Nunca se publicarán rutas locales.

---

# Fase 4 - Estados y visibilidad

**Estado:** Planeado.

## Estados

- En desarrollo.
- Estable.
- Experimental.
- Pausado.
- Terminado.
- Archivado.

## Visibilidad

- Público.
- Código privado / aplicación pública.
- Privado.
- Local.

## Objetivo

Permitir que proyectos todavía no publicados tengan presencia en el portafolio.

---

# Fase 5 - Navegación avanzada

**Estado:** Planeado.

## Funciones

- buscador;
- filtros por estado;
- filtros por tecnología;
- filtros por visibilidad;
- ordenamiento;
- proyectos destacados;
- proyectos recientes;
- combinación de filtros.

La navegación básica por categoría ya quedó implementada en la Fase 2.

---

# Fase 6 - Páginas individuales

**Estado:** Planeado.

Los proyectos importantes podrán disponer de una página:

/projects/<id>/

Contenido posible:

- presentación;
- capturas;
- tecnologías;
- historial;
- versión;
- estado;
- roadmap;
- enlaces;
- aplicación;
- repositorio.

AWS ORBISHOT y LabNotes funcionan como primeras referencias.

---

# Fase 7 - Historial del portafolio

**Estado:** Visión futura.

Posibles funciones:

- timeline de proyectos;
- año de creación;
- fecha de última actualización;
- proyectos activos;
- proyectos terminados;
- estadísticas por categoría;
- estadísticas por tecnología;
- evolución histórica del portafolio.

---

# Principio principal

La navegación debe responder primero:

**¿Qué tipo de proyecto es?**

Y después:

**¿Con qué tecnologías está construido?**

Los lenguajes son metadata secundaria.

---

# Próximo paso

Implementar la Fase 3:

**inventario de proyectos personales existentes**

registrándolos progresivamente en data/projects.json sin publicar rutas locales ni información sensible.
