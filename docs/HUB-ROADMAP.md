# Roadmap del Hub de Proyectos

## Estado actual

El hub ya cuenta con:

- GitHub Pages;
- dominio robdev512.github.io;
- AWS ORBISHOT;
- página individual de AWS ORBISHOT;
- LabNotes;
- página individual de LabNotes;
- enlaces hacia aplicaciones y proyectos.

Actualmente parte del catálogo todavía está definido directamente en HTML.

---

# Fase 1 - Catálogo dinámico

**Estado:** Siguiente objetivo.

## Objetivo

Transformar el hub en un catálogo centralizado.

## Alcance

- Crear data/projects.json.
- Crear js/hub.js.
- Extraer la información de proyectos de index.html.
- Generar tarjetas mediante JavaScript.
- Mantener proyectos destacados.
- Mantener las páginas individuales.

## Primeros proyectos

- AWS ORBISHOT.
- LabNotes.

---

# Fase 2 - Categorías por tipo de proyecto

**Estado:** Planeado.

## Categorías

- Desarrollo Web.
- Desarrollo de Aplicaciones de Escritorio.
- Desarrollo de Aplicaciones Móviles.
- Desarrollo de Videojuegos.
- Automatización y Scripts.
- Backend y Servicios.
- Datos y Bases de Datos.
- Sistemas y Experimentación.
- Otros.

## Objetivo

Clasificar primero por el tipo de producto.

Las tecnologías permanecerán como etiquetas secundarias.

---

# Fase 3 - Inventario de proyectos existentes

**Estado:** Planeado.

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
- filtros por categoría;
- filtros por estado;
- filtros por tecnología;
- ordenamiento;
- proyectos destacados;
- proyectos recientes;
- combinación de filtros.

El objetivo es evitar tener que crear una página HTML separada para cada categoría.

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

Implementar la Fase 1:

**data/projects.json + js/hub.js**

manteniendo inicialmente:

- AWS ORBISHOT;
- LabNotes.
